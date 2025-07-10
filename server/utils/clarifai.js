import axios from 'axios';

const USER_ID = "ariba";
const APP_ID = "image-analyzer";
const PAT = "fe69e522a00b4a0394be4dce9c062552";

// ✅ Use correct version ID of the model
const MODEL_ID = "general-image-recognition";
const MODEL_VERSION_ID = "aa7f35c01e0642fda5cf400f543e7c40";

const analyzeImage = async (base64Image) => {
  const response = await axios.post(
    `https://api.clarifai.com/v2/models/${MODEL_ID}/versions/${MODEL_VERSION_ID}/outputs`,
    {
      user_app_id: {
        user_id: USER_ID,
        app_id: APP_ID,
      },
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
    {
      headers: {
        Authorization: `Key ${process.env.CLARIFAI_API_KEY}`, // ✅ This is correct for API key
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data;
};

export default analyzeImage;
