import React, { useState, useRef, useCallback } from 'react';
import { UploadIcon } from './IconComponents';

interface VideoUploaderProps {
  onGenerate: (videoFile: File, prompt: string) => void;
  isLoading: boolean;
}

export const VideoUploader: React.FC<VideoUploaderProps> = ({ onGenerate, isLoading }) => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('Write an engaging caption');
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

  const handleFileChange = (file: File | undefined) => {
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        setError('File is too large. Please select a video under 50MB.');
        return;
      }
      setError(null);
      setVideoFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };
  
  const onFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFileChange(event.target.files?.[0]);
  }
  
  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith('video/')) {
       handleFileChange(file);
    }
  }, []);

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleSubmit = () => {
    if (videoFile) {
      onGenerate(videoFile, prompt);
    } else {
      setError('Please select a video first.');
    }
  };

  const handleReset = () => {
    setVideoFile(null);
    setPreviewUrl(null);
    setError(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-6">
      <div 
        className="relative w-full h-64 border-2 border-dashed border-purple-400/50 rounded-xl flex flex-col justify-center items-center text-center p-2 cursor-pointer hover:border-purple-400 transition-all duration-300 bg-black/20"
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={onFileSelect}
          accept="video/mp4, video/webm"
          className="hidden"
        />
        {previewUrl ? (
          <>
            <video src={previewUrl} controls className="max-h-full max-w-full object-contain rounded-md" />
            <button onClick={(e) => { e.stopPropagation(); handleReset(); }} className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1.5 hover:bg-red-500 transition-colors z-10">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </>
        ) : (
          <div className="text-gray-400">
            <UploadIcon />
            <p className="mt-2 font-semibold">Click to upload or drag & drop a video</p>
            <p className="text-xs">MP4, WebM (Max 50MB)</p>
          </div>
        )}
      </div>
      {error && <p className="text-red-400 text-sm text-center">{error}</p>}

      <div>
        <label htmlFor="video-prompt" className="block text-sm font-medium text-gray-300 mb-2">Caption style (optional)</label>
        <input
          id="video-prompt"
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., Make it exciting and add hashtags"
          className="w-full bg-black/20 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={isLoading || !videoFile}
        className="w-full bg-purple-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-purple-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-500/30"
      >
        {isLoading ? 'Generating...' : 'Generate Caption'}
      </button>
    </div>
  );
};