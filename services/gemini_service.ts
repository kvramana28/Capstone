import { GoogleGenAI, Type } from "@google/genai";
import type { PredictionResult } from '../types';

// Initialize the GoogleGenAI client with the API key from environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Define the response schema using the Type enum from the @google/genai SDK.
const pestPredictionSchema = {
  type: Type.OBJECT,
  properties: {
    pest_detected: {
      type: Type.STRING,
      description: "The common name of the pest or disease detected in the paddy crop image. If the plant is healthy, return 'Healthy'.",
    },
    confidence: {
      type: Type.STRING,
      description: "The confidence level of the prediction as a percentage (e.g., '85%'). For 'Healthy' status, this can be '99%'.",
    },
    description: {
      type: Type.STRING,
      description: "A concise, one-paragraph description of the detected pest/disease, its characteristics, and the damage it causes to paddy plants. If healthy, provide a brief description of a healthy paddy plant.",
    },
    recommended_action: {
      type: Type.STRING,
      description: "A bulleted list of 2-3 actionable recommendations for the farmer to manage or treat the detected pest/disease. Use markdown format for the list (e.g., '- First action.\\n- Second action.'). If healthy, recommend actions to maintain crop health.",
    },
  },
  required: ["pest_detected", "confidence", "description", "recommended_action"],
};

// Helper function to convert a File object to a base64 string for the API.
const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

/**
 * Analyzes an image of a paddy crop and returns a pest prediction.
 */
export const get_pest_prediction = async (imageFile: File): Promise<PredictionResult> => {
    const prompt = "Analyze the provided image of a paddy plant. Identify any pests or diseases, or confirm if it's healthy. Respond ONLY with a JSON object matching the provided schema.";
    
    const imagePart = await fileToGenerativePart(imageFile);

    // Use ai.models.generateContent with the correct model and configuration.
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ parts: [{ text: prompt }, imagePart] }],
        config: {
            responseMimeType: "application/json",
            responseSchema: pestPredictionSchema,
        }
    });

    // Extract text from the response object directly using the .text property.
    const resultText = response.text;
    
    try {
        return JSON.parse(resultText) as PredictionResult;
    } catch (e) {
        console.error("Error parsing Gemini response:", resultText);
        throw new Error("Failed to get a valid analysis from the model. The image might not be clear or may not contain a paddy plant.");
    }
};
