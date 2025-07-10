// backend/clarifaiRoute.js (or your existing route/controller file)

import express from 'express';
import { ClarifaiStub, grpc } from 'clarifai-nodejs-grpc';

const router = express.Router();

// Clarifai credentials
const PAT = 'b86fad7a542543bf88634c380a627df8';
const USER_ID = 'ariba';
const APP_ID = 'image-analyzer-app';
const MODEL_ID = 'general-image-recognition';
const MODEL_VERSION_ID = 'aa7f35c01e0642fda5cf400f543e7c40';

// Clarifai setup
const stub = ClarifaiStub.grpc();
const metadata = new grpc.Metadata();
metadata.set('authorization', 'Key ' + PAT);

// Route to analyze image
router.post('/analyze', async (req, res) => {
  const { imageUrl } = req.body;

  if (!imageUrl) {
    return res.status(400).json({ message: 'No image URL provided' });
  }

  try {
    stub.PostModelOutputs(
      {
        user_app_id: {
          user_id: USER_ID,
          app_id: APP_ID,
        },
        model_id: MODEL_ID,
        version_id: MODEL_VERSION_ID,
        inputs: [
          {
            data: {
              image: {
                url: imageUrl,
                allow_duplicate_url: true,
              },
            },
          },
        ],
      },
      metadata,
      (err, response) => {
        if (err) {
          return res.status(500).json({ message: 'Clarifai API error', error: err });
        }

        if (response.status.code !== 10000) {
          return res.status(500).json({ message: 'Clarifai API failed', error: response });
        }

        const concepts = response.outputs[0].data.concepts;
        res.json({ concepts });
      }
    );
  } catch (err) {
    res.status(500).json({ message: 'Error analyzing image', error: err });
  }
});

export default router;
