
import { GoogleGenAI, Type } from "@google/genai";
import type { PredictionResult } from '../types';

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

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

export const getPestPrediction = async (imageFile: File): Promise<PredictionResult> => {
  const imagePart = await fileToGenerativePart(imageFile);
  
  const prompt = `You are a specialized agricultural expert system for paddy crops. Your task is to analyze the provided image of a paddy plant and identify any pests or diseases. If the plant appears healthy, state that. Respond ONLY with a JSON object that strictly adheres to the provided schema. Do not include any introductory text or markdown formatting around the JSON object.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: { parts: [{ text: prompt }, imagePart] },
    config: {
      responseMimeType: "application/json",
      responseSchema: pestPredictionSchema,
    },
  });

  const jsonText = response.text.trim();
  const result: PredictionResult = JSON.parse(jsonText);
  return result;
};
