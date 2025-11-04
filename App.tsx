import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { TabSelector } from './components/TabSelector';
import { ImageUploader } from './components/ImageUploader';
import { TextInput } from './components/TextInput';
import { VideoUploader } from './components/VideoUploader';
import { CaptionCard } from './components/CaptionCard';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorDisplay } from './components/ErrorDisplay';
import { generateCaptionForImage, generateCaptionForText, generateCaptionForVideo } from './services/geminiService';
import { fileToBase64 } from './utils/fileUtils';
import type { Caption, Tab } from './types';
import { DeleteIcon } from './components/IconComponents';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('image');
  const [captions, setCaptions] = useState<Caption[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const savedCaptions = localStorage.getItem('ai-captions');
      if (savedCaptions) {
        setCaptions(JSON.parse(savedCaptions));
      }
    } catch (e) {
      console.error("Failed to load captions from localStorage", e);
      setError("Could not load saved captions.");
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('ai-captions', JSON.stringify(captions));
    } catch(e) {
      console.error("Failed to save captions to localStorage", e);
      setError("Could not save captions.");
    }
  }, [captions]);

  const handleImageCaptionRequest = useCallback(async (imageFile: File, prompt: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const base64Image = await fileToBase64(imageFile);
      const mimeType = imageFile.type;
      const result = await generateCaptionForImage(base64Image, mimeType, prompt);
      const newCaption: Caption = {
        id: Date.now().toString(),
        text: result,
        timestamp: new Date().toISOString(),
      };
      setCaptions(prev => [newCaption, ...prev]);
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const handleVideoCaptionRequest = useCallback(async (videoFile: File, prompt: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const base64Video = await fileToBase64(videoFile);
      const mimeType = videoFile.type;
      const result = await generateCaptionForVideo(base64Video, mimeType, prompt);
      const newCaption: Caption = {
        id: Date.now().toString(),
        text: result,
        timestamp: new Date().toISOString(),
      };
      setCaptions(prev => [newCaption, ...prev]);
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleTextCaptionRequest = useCallback(async (text: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await generateCaptionForText(text);
       const newCaption: Caption = {
        id: Date.now().toString(),
        text: result,
        timestamp: new Date().toISOString(),
      };
      setCaptions(prev => [newCaption, ...prev]);
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteCaption = (id: string) => {
    setCaptions(prev => prev.filter(c => c.id !== id));
  };
  
  const clearAllCaptions = () => {
      setCaptions([]);
  };
  
  const renderActiveTab = () => {
      switch(activeTab) {
          case 'image':
              return <ImageUploader onGenerate={handleImageCaptionRequest} isLoading={isLoading} />;
          case 'video':
              return <VideoUploader onGenerate={handleVideoCaptionRequest} isLoading={isLoading} />;
          case 'text':
              return <TextInput onGenerate={handleTextCaptionRequest} isLoading={isLoading} />;
          default:
              return null;
      }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/50 to-gray-900 text-white font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <Header />
        <main>
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-6 sm:p-8 mb-8">
            <TabSelector activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className="mt-6">
              {renderActiveTab()}
            </div>
          </div>

          {isLoading && <LoadingSpinner />}
          {error && <ErrorDisplay message={error} />}

          <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold tracking-tight text-purple-300">Generated Captions</h2>
                {captions.length > 0 && (
                     <button
                        onClick={clearAllCaptions}
                        className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors"
                        aria-label="Clear all captions"
                    >
                        <DeleteIcon />
                        Clear All
                    </button>
                )}
            </div>
            {captions.length === 0 && !isLoading && (
              <div className="text-center py-12 bg-white/5 rounded-lg border border-dashed border-white/20">
                <p className="text-gray-400">Your generated captions will appear here.</p>
              </div>
            )}
            {captions.map(caption => (
              <CaptionCard key={caption.id} caption={caption} onDelete={deleteCaption} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;