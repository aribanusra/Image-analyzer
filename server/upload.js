import express from 'express';
import multer from 'multer';
import fs from 'fs';
import dotenv from 'dotenv';
import path from 'path';
import analyzeImage from './utils/clarifai.js';

import { authenticateToken } from './middleware/auth.js';
import { insertImageRecord, getUserImages, deleteImageRecord } from './uploadDb.js';

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

// POST /api/upload (authenticated)
router.post('/', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    const userId = req.user.id;
    const filename = req.file.filename;
    const imagePath = req.file.path;

    // Read image as base64
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');

    // Analyze image with Clarifai REST API
    const response = await analyzeImage(base64Image);
    if (!response || !response.outputs || !response.outputs[0].data.concepts) {
      return res.status(500).json({ message: "Clarifai API error", error: "No concepts returned" });
    }
    const labels = response.outputs[0].data.concepts.map(c => c.name).join(', ');

    // Save to PostgreSQL
    await insertImageRecord({
      user_id: userId,
      image_name: filename,
      image_path: `/uploads/${filename}`,
      labels,
    });

    res.json({
      message: 'Image uploaded and analyzed successfully',
      filename,
      imageUrl: `http://localhost:2222/uploads/${filename}`,
      labels,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Error uploading or analyzing image',
      error: err.message,
    });
  }
});

export default router;
