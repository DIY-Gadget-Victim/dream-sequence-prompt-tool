import React, { useState } from 'react';
import { Scene } from '../types';
import { Loader2, AlertTriangle, Download, Copy, Check, FileVideo, Maximize2 } from 'lucide-react';

interface SceneCardProps {
  scene: Scene;
}

const SceneCard: React.FC<SceneCardProps> = ({ scene }) => {
  const [copied, setCopied] = useState(false);

  const copyPrompt = () => {
    navigator.clipboard.writeText(scene.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="win-border-out bg-[#c0c0c0] p-1 flex flex-col h-full">
        {/* Window Title */}
        <div className="bg-[#000080] text-white px-2 py-0.5 text-[10px] font-bold uppercase flex justify-between items-center mb-1">
            <span className="truncate pr-2">Scene_File_{scene.id.slice(0,4)}.mp4</span>
            <div className="flex gap-0.5">
                 <div className="w-3 h-3 bg-[#c0c0c0] border-t border-l border-white border-b border-r border-black text-black flex items-center justify-center">
                    <Maximize2 className="w-2 h-2" />
                 </div>
            </div>
        </div>

      <div className="relative aspect-video win-border-in bg-black flex items-center justify-center overflow-hidden">
        {scene.status === 'idle' && (
          <div className="text-zinc-500 font-bold text-xs flex flex-col items-center gap-2">
            <FileVideo className="w-8 h-8 opacity-50" />
            <span>Waiting to start...</span>
          </div>
        )}
        
        {scene.status === 'generating' && (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
            <div className="text-white text-xs font-mono px-2 py-1 bg-black/50 rounded">
                Generating Video...
            </div>
          </div>
        )}

        {scene.status === 'failed' && (
          <div className="flex flex-col items-center gap-2 text-red-400 p-6 text-center">
            <AlertTriangle className="w-8 h-8 mb-2" />
            <span className="text-xs font-mono">{scene.error || "Something went wrong"}</span>
          </div>
        )}

        {scene.status === 'completed' && scene.videoUrl && (
          <>
            <video 
                src={scene.videoUrl} 
                controls 
                loop 
                autoPlay 
                muted 
                className="w-full h-full object-cover"
            />
          </>
        )}
      </div>

      <div className="p-3 flex-1 flex flex-col">
        <div className="mb-3">
             <div className="text-[10px] text-zinc-600 mb-1 font-bold uppercase">Theme:</div>
             <div className="win-border-in bg-[#fff] px-2 py-1 text-xs mb-3 truncate text-zinc-800 italic">
                 {scene.question}
             </div>
             
             <div className="text-[10px] text-zinc-600 mb-1 font-bold uppercase">Scene Detail:</div>
             <div className="font-bold text-sm leading-snug mb-2 pl-1 text-black">
                "{scene.answer}"
             </div>
        </div>

        <div className="mt-auto flex items-center justify-between gap-2 pt-2 border-t border-zinc-400 border-dotted">
             <div className="flex gap-2">
                {scene.status === 'completed' && scene.videoUrl && (
                    <a 
                        href={scene.videoUrl} 
                        download={`dream_${scene.id}.mp4`}
                        className="p-1.5 bg-[#c0c0c0] border-t border-l border-white border-b border-r border-black active:border-t-black active:border-l-black active:border-r-white active:border-b-white hover:bg-[#d0d0d0]"
                        title="Download Video"
                    >
                        <Download className="w-4 h-4 text-black" />
                    </a>
                )}
             </div>

             <button 
                onClick={copyPrompt}
                className="text-[10px] text-blue-800 hover:text-blue-600 underline flex items-center gap-1"
             >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copied ? "Copied" : "Copy Prompt"}
             </button>
        </div>
      </div>
    </div>
  );
};

export default SceneCard;