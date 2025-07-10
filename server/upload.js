import express from 'express';
import multer from 'multer';
import fs from 'fs';
import dotenv from 'dotenv';
import path from 'path';
import { authenticateToken } from './middleware/auth.js';
import { insertImageRecord, getUserImages, deleteImageRecord } from './uploadDb.js';
import pool from './uploadDb.js';

dotenv.config();

const router = express.Router();

// Set up multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

// GET /api/upload (authenticated) - Fetch user's images
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const images = await getUserImages(userId);
    res.json({ images });
  } catch (err) {
    console.error('Error fetching images:', err);
    res.status(500).json({
      message: 'Error fetching images',
      error: err.message,
    });
  }
});

// GET /api/upload/:id (authenticated) - Fetch a single image by id
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const imageId = req.params.id;
    const result = await getUserImages(userId);
    const image = result.find(img => String(img.id) === String(imageId) || img.image_name === imageId);
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }
    res.json(image);
  } catch (err) {
    console.error('Error fetching image:', err);
    res.status(500).json({ message: 'Error fetching image', error: err.message });
  }
});

// DELETE /api/upload/:id (authenticated) - Delete an image
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const imageId = req.params.id;
    
    // Delete from database and get image info
    const deletedImage = await deleteImageRecord(imageId, userId);
    
    if (!deletedImage) {
      return res.status(404).json({ message: 'Image not found or access denied' });
    }
    
    // Delete file from filesystem
    const filePath = path.join(process.cwd(), 'uploads', deletedImage.image_name);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    res.json({ 
      message: 'Image deleted successfully',
      deletedImage: deletedImage.image_name
    });
  } catch (err) {
    console.error('Error deleting image:', err);
    res.status(500).json({ 
      message: 'Error deleting image', 
      error: err.message 
    });
  }
});

// POST /api/upload (authenticated) - Upload image only
router.post('/', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    const userId = req.user.id;
    const filename = req.file.filename;

    // Verify user exists in database
    const userCheck = await pool.query('SELECT id FROM users WHERE id = $1', [userId]);
    if (userCheck.rows.length === 0) {
      return res.status(404).json({
        message: 'User not found',
        error: `User with ID ${userId} does not exist in database`
      });
    }

    // Save to PostgreSQL without analysis and get the real image id
    const imageId = await insertImageRecord({
      user_id: userId,
      image_name: filename,
      image_path: `/uploads/${filename}`,
      labels: null, // No labels initially
    });

    res.json({
      message: 'Image uploaded successfully',
      filename,
      imageUrl: `http://localhost:2222/uploads/${filename}`,
      imageId, // Return the real image ID for analysis
    });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({
      message: 'Error uploading image',
      error: err.message,
    });
  }
});

export default router;
