import express from 'express';
import fs from 'fs';
import path from 'path';
import analyzeImage from './utils/clarifai.js';
import { authenticateToken } from './middleware/auth.js';
import { updateImageLabels, getUserImages } from './uploadDb.js';

const router = express.Router();

// POST /api/analyze/:id (authenticated) - Analyze a specific image
router.post('/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const imageId = req.params.id;
    
    // Get the image from database
    const result = await getUserImages(userId);
    const image = result.find(img => String(img.id) === String(imageId) || img.image_name === imageId);
    
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    // Read image file as base64
    const imagePath = path.join(process.cwd(), 'uploads', image.image_name);
    if (!fs.existsSync(imagePath)) {
      return res.status(404).json({ message: 'Image file not found' });
    }

    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');

    // Analyze image with Clarifai gRPC API
    const response = await analyzeImage(base64Image);
    
    if (!response || !response.outputs || !response.outputs[0].data.concepts) {
      return res.status(500).json({ 
        message: "Clarifai API error", 
        error: "No concepts returned" 
      });
    }
    
    const labels = response.outputs[0].data.concepts.map(c => c.name).join(', ');

    // Update the image record with new labels
    await updateImageLabels(imageId, userId, labels);

    res.json({
      message: 'Image analyzed successfully',
      imageId: image.id,
      imageName: image.image_name,
      labels,
      concepts: response.outputs[0].data.concepts
    });
  } catch (err) {
    // Check if it's a Clarifai API authentication error
    if (err.message && err.message.includes('authentication')) {
      return res.status(500).json({
        message: 'Clarifai API authentication failed',
        error: 'Invalid or expired API key. Please check your Clarifai configuration.',
      });
    }
    
    res.status(500).json({
      message: 'Error analyzing image',
      error: err.message,
    });
  }
});

// GET /api/analyze/:id (authenticated) - Get analysis results for a specific image
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const imageId = req.params.id;
    
    // Get the image from database
    const result = await getUserImages(userId);
    const image = result.find(img => String(img.id) === String(imageId) || img.image_name === imageId);
    
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    res.json({
      imageId: image.id,
      imageName: image.image_name,
      imageUrl: `http://localhost:2222/uploads/${image.image_name}`,
      labels: image.labels || 'No analysis available',
      analyzed: !!image.labels
    });
  } catch (err) {
    console.error('Error fetching analysis:', err);
    res.status(500).json({
      message: 'Error fetching analysis',
      error: err.message,
    });
  }
});

export default router; 