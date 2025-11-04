
import React from 'react';

export const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center items-center my-8">
    <div className="relative">
      <div className="w-16 h-16 border-4 border-purple-400 border-solid rounded-full animate-spin border-t-transparent"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-purple-300 font-bold text-xs">AI</div>
    </div>
  </div>
);
