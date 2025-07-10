import pg from 'pg';
const { Pool } = pg;
import dotenv from 'dotenv';
dotenv.config();

// Optimized connection pool configuration
const pool = new Pool({ 
  connectionString: process.env.DB_URL,
  // Connection pool settings for better performance
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
  maxUses: 7500, // Close (and replace) a connection after it has been used 7500 times
});

// Handle pool errors
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

export const insertImageRecord = async ({ user_id, image_name, image_path, labels }) => {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `INSERT INTO upload (user_id, image_name, image_path, labels)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [user_id, image_name, image_path, labels]
    );
    return result.rows[0].id;
  } finally {
    client.release();
  }
};

export const getUserImages = async (userId) => {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `SELECT id, user_id, image_name, image_path, labels, created_at 
       FROM upload 
       WHERE user_id = $1 
       ORDER BY created_at DESC`,
      [userId]
    );
    
    // Add full image URL to each image
    const imagesWithUrls = result.rows.map(image => ({
      ...image,
      imageUrl: `http://localhost:2222${image.image_path}`
    }));
    
    return imagesWithUrls;
  } finally {
    client.release();
  }
};

export const deleteImageRecord = async (imageId, userId) => {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `DELETE FROM upload 
       WHERE id = $1 AND user_id = $2 
       RETURNING image_name, image_path`,
      [imageId, userId]
    );
    return result.rows[0];
  } finally {
    client.release();
  }
};

export const updateImageLabels = async (imageId, userId, labels) => {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `UPDATE upload 
       SET labels = $1 
       WHERE id = $2 AND user_id = $3 
       RETURNING id, image_name, labels`,
      [labels, imageId, userId]
    );
    return result.rows[0];
  } finally {
    client.release();
  }
};

export default pool; 