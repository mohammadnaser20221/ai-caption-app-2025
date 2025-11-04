
import React, { useState } from 'react';
import type { Caption } from '../types';
import { CopyIcon, CheckIcon, DeleteIcon } from './IconComponents';

interface CaptionCardProps {
  caption: Caption;
  onDelete: (id: string) => void;
}

export const CaptionCard: React.FC<CaptionCardProps> = ({ caption, onDelete }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(caption.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl shadow-lg p-5 animate-fade-in">
      <p className="text-gray-200 whitespace-pre-wrap">{caption.text}</p>
      <div className="mt-4 flex justify-end items-center gap-4">
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 text-sm font-medium text-purple-300 hover:text-white transition-colors"
          aria-label="Copy caption"
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
        <button
          onClick={() => onDelete(caption.id)}
          className="flex items-center gap-2 text-sm font-medium text-red-400 hover:text-red-300 transition-colors"
          aria-label="Delete caption"
        >
          <DeleteIcon />
        </button>
      </div>
    </div>
  );
};

// Add fade-in animation to tailwind config or a global style if needed
// For simplicity, defining it here in a style tag, though not ideal for production.
// A better way is using a CSS file or extending tailwind.config.js
const style = document.createElement('style');
style.innerHTML = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in {
    animation: fadeIn 0.5s ease-out forwards;
  }
`;
document.head.appendChild(style);
