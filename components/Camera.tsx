import React, { useRef, useEffect, useState } from 'react';

interface CameraProps {
  onCapture: (dataUrl: string) => void;
  onClose: () => void;
}

const Camera: React.FC<CameraProps> = ({ onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }, // Prefer rear camera
          audio: false,
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        // Fallback to any camera if environment fails
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (fallbackErr) {
            console.error("Fallback camera error:", fallbackErr);
            setError("Could not access the camera. Please check permissions in your browser settings and try again.");
        }
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleCaptureClick = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setCapturedImage(dataUrl);
      }
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
  };

  const handleUsePhoto = () => {
    if (capturedImage) {
      onCapture(capturedImage);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center z-50 p-4 animate-fade-in-fast">
      <div className="relative w-full max-w-2xl bg-gray-900 rounded-xl overflow-hidden shadow-2xl border border-gray-700">
        <button onClick={onClose} className="absolute top-3 right-3 z-20 text-white bg-black bg-opacity-40 rounded-full p-2 hover:bg-opacity-60 transition-colors" aria-label="Close camera">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        {error ? (
          <div className="p-8 text-center text-red-400">
            <h3 className="text-lg font-bold">Camera Error</h3>
            <p className="mt-2">{error}</p>
          </div>
        ) : (
          <div className="w-full aspect-video bg-black flex items-center justify-center">
            {capturedImage ? (
              <img src={capturedImage} alt="Captured" className="max-h-full max-w-full object-contain" />
            ) : (
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover"></video>
            )}
          </div>
        )}
        <canvas ref={canvasRef} className="hidden"></canvas>
      </div>
      
      {!error && (
        <div className="mt-6 flex items-center justify-center w-full max-w-2xl">
          {capturedImage ? (
            <div className="flex space-x-4">
              <button onClick={handleRetake} className="px-8 py-3 bg-gray-200 text-gray-800 font-bold rounded-lg shadow-md hover:bg-gray-300 transition-all transform hover:scale-105">Retake</button>
              <button onClick={handleUsePhoto} className="px-8 py-3 bg-green-600 text-white font-bold rounded-lg shadow-md hover:bg-green-700 transition-all transform hover:scale-105">Use Photo</button>
            </div>
          ) : (
            <button onClick={handleCaptureClick} className="w-20 h-20 bg-white rounded-full shadow-lg border-4 border-gray-400 hover:border-white transition-all transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-green-500" aria-label="Capture photo"></button>
          )}
        </div>
      )}
      <style>{`
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      .animate-fade-in-fast {
        animation: fadeIn 0.3s ease-out forwards;
      }
    `}</style>
    </div>
  );
};

export default Camera;
