import { ClarifaiStub, grpc } from 'clarifai-nodejs-grpc';
import dotenv from 'dotenv';
dotenv.config(); // This must run before you use process.env

const USER_ID = "ariba";
const APP_ID = "image-analyzer-app"; // Using the correct app ID
const PAT = process.env.CLARIFAI_API_KEY || 'b86fad7a542543bf88634c380a627df8'; // Fallback to hardcoded key

// Clarifai setup
const stub = ClarifaiStub.grpc();
const metadata = new grpc.Metadata();
metadata.set('authorization', 'Key ' + PAT);

const MODEL_ID = "general-image-recognition";
const MODEL_VERSION_ID = "aa7f35c01e0642fda5cf400f543e7c40";

const analyzeImage = async (base64Image) => {
  return new Promise((resolve, reject) => {
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
                base64: base64Image,
              },
            },
          },
        ],
      },
      metadata,
      (err, response) => {
        if (err) {
          console.error('Clarifai gRPC error:', err);
          reject(err);
          return;
        }

        if (response.status.code !== 10000) {
          console.error('Clarifai API failed:', response.status);
          reject(new Error(`Clarifai API failed: ${response.status.description}`));
          return;
        }

        resolve(response);
      }
    );
  });
};

export default analyzeImage;
