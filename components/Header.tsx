
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="text-center my-8 md:my-12">
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tighter">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
          AI Caption Generator
        </span>
      </h1>
      <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
        Craft the perfect caption for your photos and ideas. Powered by Gemini AI, designed for 2025.
      </p>
    </header>
  );
};
