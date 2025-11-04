import React from 'react';
import type { Tab } from '../types';
import { ImageIcon, TextIcon, VideoIcon } from './IconComponents';

interface TabSelectorProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

export const TabSelector: React.FC<TabSelectorProps> = ({ activeTab, setActiveTab }) => {
  // FIX: Changed JSX.Element to React.ReactNode to resolve namespace error.
  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'image', label: 'Image Caption', icon: <ImageIcon /> },
    { id: 'video', label: 'Video Caption', icon: <VideoIcon /> },
    { id: 'text', label: 'Text Caption', icon: <TextIcon /> },
  ];

  return (
    <div className="flex bg-black/20 rounded-full border border-white/20 p-1">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`w-full flex justify-center items-center gap-2 rounded-full py-2.5 px-4 text-sm font-semibold transition-all duration-300 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900
            ${
              activeTab === tab.id
                ? 'bg-purple-600 shadow-lg shadow-purple-500/30 text-white'
                : 'text-gray-300 hover:bg-white/10'
            }`}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
};