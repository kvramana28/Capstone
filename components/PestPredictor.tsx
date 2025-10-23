import React, { useState } from 'react';
import type { PredictionResult } from '../types';
import { getPestPrediction } from '../services/geminiService';
import ImageUploader from './ImageUploader';
import ResultDisplay from './ResultDisplay';
import Spinner from './Spinner';
import Camera from './Camera';

const PestPredictor: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);

  const dataURLtoFile = (dataurl: string, filename: string): File => {
    const arr = dataurl.split(',');
    const mimeMatch = arr[0].match(/:(.*?);/);
    if (!mimeMatch) throw new Error("Invalid data URL");
    const mime = mimeMatch[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const newPreviewUrl = URL.createObjectURL(file);
      setPreviewUrl(newPreviewUrl);
      setPrediction(null);
      setError(null);
    }
  };

  const handleCapture = (dataUrl: string) => {
    const capturedFile = dataURLtoFile(dataUrl, `capture-${Date.now()}.jpg`);
    setImageFile(capturedFile);
    setPreviewUrl(dataUrl);
    setPrediction(null);
    setError(null);
    setIsCameraOpen(false);
  };

  const handleAnalyzeClick = async () => {
    if (!imageFile) {
      setError('Please select an image first.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setPrediction(null);

    try {
      const result = await getPestPrediction(imageFile);
      setPrediction(result);
    } catch (err) {
      console.error(err);
      setError('Failed to analyze the image. The model may be unable to identify a pest from this photo. Please try another one.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isCameraOpen && <Camera onCapture={handleCapture} onClose={() => setIsCameraOpen(false)} />}
      <main className="flex-grow container mx-auto p-4 md:p-8 flex flex-col items-center">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-200">
          <p className="text-center text-gray-600 mb-6">
            Upload a photo of your paddy crop, or use your camera to take a new one. Our AI will analyze it for common pests and provide actionable advice.
          </p>
          
          <ImageUploader 
            previewUrl={previewUrl} 
            onImageChange={handleImageChange} 
            onTakePhotoClick={() => setIsCameraOpen(true)}
          />

          <div className="mt-6 text-center">
            <button
              onClick={handleAnalyzeClick}
              disabled={!imageFile || isLoading}
              className="w-full md:w-auto px-8 py-3 bg-green-600 text-white font-bold rounded-lg shadow-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
            >
              {isLoading ? 'Analyzing...' : 'Analyze Crop'}
            </button>
          </div>
        </div>

        {isLoading && <Spinner />}
        
        {error && (
          <div className="mt-8 w-full max-w-2xl bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {prediction && !isLoading && (
          <div className="mt-8 w-full max-w-3xl">
            <ResultDisplay result={prediction} />
          </div>
        )}
      </main>
    </>
  );
};

export default PestPredictor;