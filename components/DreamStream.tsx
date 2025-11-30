import React, { useState, useRef, useEffect } from 'react';
import { Scene } from '../types';
import { Play, Pause, SkipForward, SkipBack, Disc, Music, Minus, Square, X } from 'lucide-react';

interface DreamStreamProps {
  scenes: Scene[];
}

const DreamStream: React.FC<DreamStreamProps> = ({ scenes }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const playableScenes = scenes.filter(s => s.status === 'completed' && s.videoUrl);
  const currentScene = playableScenes[currentIndex];

  useEffect(() => {
    if (videoRef.current && currentScene && currentScene.videoUrl) {
      const uri = currentScene.videoUrl;
      if (videoRef.current.src !== uri) {
        videoRef.current.src = uri;
        if (isPlaying) {
          videoRef.current.play().catch(console.error);
        }
      }
    }
  }, [currentScene, isPlaying]);

  useEffect(() => {
    if (currentIndex >= playableScenes.length && playableScenes.length > 0) {
      setCurrentIndex(0);
    }
  }, [playableScenes.length, currentIndex]);

  const handleEnded = () => {
    if (currentIndex < playableScenes.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(console.error);
      }
      setIsPlaying(!isPlaying);
    }
  };

  const next = () => {
    setCurrentIndex(prev => (prev + 1) % playableScenes.length);
  };

  const prev = () => {
    setCurrentIndex(prev => (prev - 1 + playableScenes.length) % playableScenes.length);
  };

  if (playableScenes.length === 0) return null;

  return (
    <div className="w-full max-w-5xl mx-auto mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Player Window */}
      <div className="win-border-out bg-[#c0c0c0] p-1 shadow-lg">
        <div className="bg-[#000080] text-white px-2 py-0.5 flex justify-between items-center mb-1 select-none">
            <div className="flex items-center gap-2">
                 <Music className="w-3 h-3" />
                 <span className="text-[10px] font-bold uppercase">Dream Player - [Playlist: {playableScenes.length}]</span>
            </div>
            <div className="flex gap-0.5">
                 <button className="bg-[#c0c0c0] w-3 h-3 flex items-center justify-center border-t border-l border-white border-b border-r border-black"><Minus className="w-2 h-2 text-black" /></button>
                 <button className="bg-[#c0c0c0] w-3 h-3 flex items-center justify-center border-t border-l border-white border-b border-r border-black"><Square className="w-2 h-2 text-black" /></button>
                 <button className="bg-[#c0c0c0] w-3 h-3 flex items-center justify-center border-t border-l border-white border-b border-r border-black"><X className="w-2 h-2 text-black" /></button>
            </div>
        </div>

        <div className="relative aspect-video bg-black win-border-in mx-1 mt-1 mb-2">
            <video
            ref={videoRef}
            className="w-full h-full object-contain"
            onEnded={handleEnded}
            playsInline
            autoPlay={isPlaying}
            />
            {/* Retro Scanline */}
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] opacity-20"></div>
        </div>
        
        {/* Controls Area */}
        <div className="px-2 pb-2">
            {/* Track Info Display */}
            <div className="win-border-in bg-black p-2 mb-2 flex justify-between items-center">
                <div className="text-green-500 font-mono text-xs overflow-hidden whitespace-nowrap">
                    SCENE {currentIndex + 1}: {currentScene?.answer || "Buffering..."}
                </div>
                <div className="text-green-500 font-mono text-xs">
                    00:{Math.floor(Math.random() * 60).toString().padStart(2,'0')}
                </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-center gap-4 py-2">
                <button 
                    onClick={prev}
                    className="p-1 bg-[#c0c0c0] border-t border-l border-white border-b border-r border-black active:border-t-black active:border-l-black active:border-r-white active:border-b-white"
                >
                    <SkipBack className="w-4 h-4 text-black" />
                </button>
                
                <button 
                    onClick={togglePlay}
                    className="px-4 py-1 bg-[#c0c0c0] border-t border-l border-white border-b border-r border-black active:border-t-black active:border-l-black active:border-r-white active:border-b-white"
                >
                    {isPlaying ? (
                        <Pause className="w-4 h-4 text-black fill-current" />
                    ) : (
                        <Play className="w-4 h-4 text-black fill-current" />
                    )}
                </button>

                <button 
                    onClick={next}
                    className="p-1 bg-[#c0c0c0] border-t border-l border-white border-b border-r border-black active:border-t-black active:border-l-black active:border-r-white active:border-b-white"
                >
                    <SkipForward className="w-4 h-4 text-black" />
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default DreamStream;