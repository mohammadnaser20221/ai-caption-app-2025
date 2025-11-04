
import React, { useState, useRef, useCallback } from 'react';
import { UploadIcon } from './IconComponents';

interface ImageUploaderProps {
  onGenerate: (imageFile: File, prompt: string) => void;
  isLoading: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onGenerate, isLoading }) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('Write a witty caption');
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // 4MB limit
        setError('File is too large. Please select an image under 4MB.');
        return;
      }
      setError(null);
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };
  
  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
       if (file.size > 4 * 1024 * 1024) {
        setError('File is too large. Please select an image under 4MB.');
        return;
      }
      setError(null);
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  }, []);

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleSubmit = () => {
    if (imageFile) {
      onGenerate(imageFile, prompt);
    } else {
      setError('Please select an image first.');
    }
  };

  const handleReset = () => {
    setImageFile(null);
    setPreviewUrl(null);
    setError(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-6">
      <div 
        className="relative w-full h-64 border-2 border-dashed border-purple-400/50 rounded-xl flex flex-col justify-center items-center text-center p-4 cursor-pointer hover:border-purple-400 transition-all duration-300 bg-black/20"
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/png, image/jpeg, image/jpg"
          className="hidden"
        />
        {previewUrl ? (
          <>
            <img src={previewUrl} alt="Preview" className="max-h-full max-w-full object-contain rounded-md" />
            <button onClick={(e) => { e.stopPropagation(); handleReset(); }} className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1.5 hover:bg-red-500 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </>
        ) : (
          <div className="text-gray-400">
            <UploadIcon />
            <p className="mt-2 font-semibold">Click to upload or drag & drop</p>
            <p className="text-xs">PNG, JPG, or JPEG (Max 4MB)</p>
          </div>
        )}
      </div>
      {error && <p className="text-red-400 text-sm text-center">{error}</p>}

      <div>
        <label htmlFor="image-prompt" className="block text-sm font-medium text-gray-300 mb-2">Caption style (optional)</label>
        <input
          id="image-prompt"
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., Make it funny and add emojis"
          className="w-full bg-black/20 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={isLoading || !imageFile}
        className="w-full bg-purple-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-purple-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-500/30"
      >
        {isLoading ? 'Generating...' : 'Generate Caption'}
      </button>
    </div>
  );
};
