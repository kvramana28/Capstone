import React from 'react';

interface ImageUploaderProps {
  previewUrl: string | null;
  onImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onTakePhotoClick: () => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ previewUrl, onImageChange, onTakePhotoClick }) => {
  return (
    <div>
      <div className="w-full h-64 border-2 border-dashed border-gray-300 rounded-lg flex justify-center items-center bg-gray-50 overflow-hidden">
        {previewUrl ? (
          <img src={previewUrl} alt="Paddy crop preview" className="max-h-full max-w-full object-contain" />
        ) : (
          <div className="text-center text-gray-500 p-4">
             <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            <p className="mt-2 font-semibold">Image preview will appear here</p>
            <p className="text-xs text-gray-400">Select an image or use your camera</p>
          </div>
        )}
      </div>
      
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <label htmlFor="imageUploader" className="w-full px-4 py-3 bg-green-100 text-green-800 font-semibold rounded-lg text-center cursor-pointer hover:bg-green-200 transition-colors flex items-center justify-center gap-2">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          Upload from Device
        </label>
        <button
          onClick={onTakePhotoClick}
          type="button"
          className="w-full px-4 py-3 bg-green-100 text-green-800 font-semibold rounded-lg text-center hover:bg-green-200 transition-colors flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 6a2 2 0 012-2h1.172a2 2 0 011.414.586l.828.828A2 2 0 008.828 6H12a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
              <path d="M15 8a1 1 0 10-2 0v2a1 1 0 102 0V8z" />
          </svg>
          Take Photo with Camera
        </button>
      </div>
      
      <input
        type="file"
        id="imageUploader"
        accept="image/png, image/jpeg"
        className="hidden"
        onChange={onImageChange}
      />
    </div>
  );
};

export default ImageUploader;