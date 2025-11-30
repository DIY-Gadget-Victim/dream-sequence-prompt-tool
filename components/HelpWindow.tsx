import React from 'react';
import { X, BookOpen, Key, Edit3, Film } from 'lucide-react';

interface HelpWindowProps {
  onClose: () => void;
}

const HelpWindow: React.FC<HelpWindowProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
      <div className="win-border-out bg-[#c0c0c0] max-w-2xl w-full shadow-2xl animate-in zoom-in-95 duration-200">
        
        {/* Title Bar */}
        <div className="win-titlebar px-2 py-1 flex justify-between items-center select-none">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            <span className="font-bold text-xs uppercase">Quick Start Guide</span>
          </div>
          <button 
            onClick={onClose}
            className="w-4 h-4 bg-[#c0c0c0] text-black border-t border-l border-white border-b border-r border-black flex items-center justify-center active:border-t-black active:border-l-black active:border-r-white active:border-b-white focus:outline-none"
          >
            <X className="w-3 h-3" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
            <div className="win-border-in bg-white p-6 text-sm overflow-y-auto max-h-[60vh]">
                <h1 className="text-xl font-bold mb-4 border-b-2 border-black pb-2">How to Use Dream Weaver</h1>
                
                <div className="space-y-6">
                    <section>
                        <h3 className="font-bold flex items-center gap-2 mb-2 text-zinc-800">
                            <Key className="w-5 h-5 text-yellow-600" /> 
                            1. Connection
                        </h3>
                        <p className="mb-2 text-zinc-600">
                            If you haven't already, you'll need to click the <strong>Connect</strong> prompt when the app starts. This links to Google's video engine.
                        </p>
                    </section>

                    <section>
                        <h3 className="font-bold flex items-center gap-2 mb-2 text-zinc-800">
                            <Edit3 className="w-5 h-5 text-blue-600" /> 
                            2. Writing your Dream
                        </h3>
                        <p className="mb-2 text-zinc-600">
                            The tool uses a special sentence structure to understand what you want. Think of it like a list where every item ends with a semi-colon:
                        </p>
                        <div className="bg-blue-50 p-4 rounded border border-blue-100 font-medium text-zinc-800 mb-2">
                            <span className="text-blue-700">Theme</span> 
                            <span className="mx-2 font-bold text-xl text-zinc-400">;</span> 
                            <span className="text-green-700">Scene 1</span> 
                            <span className="mx-2 font-bold text-xl text-zinc-400">;</span> 
                            <span className="text-green-700">Scene 2</span> 
                            <span className="mx-2 font-bold text-xl text-zinc-400">;</span> 
                            <span className="text-green-700">Scene 3</span>
                        </div>
                        <ul className="list-disc pl-5 space-y-1 text-zinc-600 text-xs">
                            <li><strong>Theme:</strong> The overall feeling or question (e.g., "What is happiness?").</li>
                            <li><strong>Semicolon (;):</strong> This separates <em>everything</em>. Use it between the theme and every single scene.</li>
                            <li><strong>Scenes:</strong> The things you want to see.</li>
                        </ul>
                    </section>

                    <section>
                        <h3 className="font-bold flex items-center gap-2 mb-2 text-zinc-800">
                            <Film className="w-5 h-5 text-green-600" /> 
                            3. Creating the Video
                        </h3>
                        <p className="mb-2 text-zinc-600">
                            Click <strong>Create Dreams</strong> and wait a moment. The system creates the videos one by one. Once they are ready, they will automatically start playing in the Dream Player loop.
                        </p>
                    </section>
                </div>
            </div>

            <div className="mt-4 flex justify-end">
                <button 
                    onClick={onClose}
                    className="px-6 py-2 bg-[#c0c0c0] text-black font-bold text-xs uppercase border-t border-l border-white border-b border-r border-black active:border-t-black active:border-l-black active:border-r-white active:border-b-white shadow-sm hover:bg-[#d0d0d0]"
                >
                    Got it!
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default HelpWindow;