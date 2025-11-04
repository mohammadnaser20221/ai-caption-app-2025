
import React, { useState } from 'react';

interface TextInputProps {
  onGenerate: (text: string) => void;
  isLoading: boolean;
}

export const TextInput: React.FC<TextInputProps> = ({ onGenerate, isLoading }) => {
  const [text, setText] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    if (text.trim()) {
        setError(null);
        onGenerate(text);
    } else {
        setError("Please enter some text to generate a caption.");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="text-input" className="block text-sm font-medium text-gray-300 mb-2">
            Your Text, Quote, or Idea
        </label>
        <textarea
          id="text-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={6}
          placeholder="e.g., 'Just finished a great workout!' or 'To be or not to be...'"
          className="w-full bg-black/20 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
        />
        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
      </div>

      <button
        onClick={handleSubmit}
        disabled={isLoading || !text.trim()}
        className="w-full bg-purple-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-purple-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-500/30"
      >
        {isLoading ? 'Generating...' : 'Generate Caption'}
      </button>
    </div>
  );
};
