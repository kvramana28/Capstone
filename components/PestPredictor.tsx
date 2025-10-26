import React, { useState } from 'react';
import ImageUploader from './ImageUploader';
import ResultDisplay from './ResultDisplay';
import Spinner from './Spinner';
import Camera from './Camera';
import { getPestPrediction } from '../services/geminiService';
import type { PredictionResult } from '../types';

// Helper function to convert data URL to File object
const dataURLtoFile = (dataurl: string, filename: string): File | null => {
    const arr = dataurl.split(',');
    if (arr.length < 2) { return null; }
    const mimeMatch = arr[0].match(/:(.*?);/);
    if (!mimeMatch) { return null; }
    const mime = mimeMatch[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
}


const PestPredictor: React.FC = () => {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [result, setResult] = useState<PredictionResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isCameraOpen, setIsCameraOpen] = useState(false);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setResult(null);
            setError(null);
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };
    
    const handleTakePhotoClick = () => {
        setIsCameraOpen(true);
    };

    const handleCapture = (dataUrl: string) => {
        const file = dataURLtoFile(dataUrl, 'camera-photo.jpg');
        if (file) {
            setResult(null);
            setError(null);
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
        setIsCameraOpen(false);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!imageFile) {
            setError('Please select an image first.');
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const prediction = await getPestPrediction(imageFile);
            setResult(prediction);
        } catch (err: any) {
            setError(err.message || 'An unknown error occurred during analysis.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex-grow container mx-auto p-4 md:p-8 flex flex-col items-center">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-200">
                <p className="text-center text-gray-600 mb-6">
                    Upload a photo of your paddy crop. Our AI will analyze it for common pests and provide actionable advice.
                </p>
                <form onSubmit={handleSubmit}>
                    <ImageUploader 
                        previewUrl={previewUrl} 
                        onImageChange={handleImageChange} 
                        onTakePhotoClick={handleTakePhotoClick}
                    />
                    <div className="mt-6 text-center">
                        <button type="submit" disabled={!imageFile || loading} className="w-full md:w-auto px-8 py-3 bg-green-600 text-white font-bold rounded-lg shadow-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50">
                            {loading ? 'Analyzing...' : 'Analyze Crop'}
                        </button>
                    </div>
                </form>
            </div>

            {loading && <div className="mt-8"><Spinner /></div>}

            {error && (
                <div className="mt-8 w-full max-w-2xl bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg" role="alert">
                    <strong className="font-bold">Error: </strong>
                    <span className="block sm:inline">{error}</span>
                </div>
            )}

            {result && (
                <div className="mt-8 w-full max-w-3xl">
                    <ResultDisplay result={result} />
                </div>
            )}
            
            {isCameraOpen && (
                <Camera onCapture={handleCapture} onClose={() => setIsCameraOpen(false)} />
            )}
        </main>
    );
};

export default PestPredictor;
