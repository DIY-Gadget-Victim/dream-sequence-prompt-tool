
import React, { useEffect, useState } from 'react';
import { Hourglass, Loader2 } from 'lucide-react';

interface ProgressWindowProps {
  pendingCount: number;
  totalCount: number;
  modelName: string;
}

const ProgressWindow: React.FC<ProgressWindowProps> = ({ pendingCount, totalCount, modelName }) => {
  const [secondsRemaining, setSecondsRemaining] = useState(0);

  useEffect(() => {
    // Estimate time per batch (2 videos process in parallel)
    // Fast models ~40s, High Quality ~90s
    const isFast = modelName.includes('fast');
    const timePerBatch = isFast ? 40 : 90;
    
    // We process 2 at a time
    const batchesLeft = Math.ceil(pendingCount / 2);
    const totalSeconds = batchesLeft * timePerBatch;
    
    setSecondsRemaining(totalSeconds);
  }, [pendingCount, modelName]);

  // Visual progress percentage
  const progress = Math.round(((totalCount - pendingCount) / totalCount) * 100) || 0;

  // Format time
  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  
  // Generate progress blocks for visual bar
  const totalBlocks = 20;
  const filledBlocks = Math.round((progress / 100) * totalBlocks);

  return (
    <div className="fixed bottom-12 right-6 z-50 w-72 animate-in slide-in-from-right duration-500">
      <div className="win-border-out bg-[#c0c0c0] p-1 shadow-xl">
        <div className="bg-[#000080] text-white px-2 py-0.5 flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase flex items-center gap-2">
                <Loader2 className="w-3 h-3 animate-spin" />
                Processing Request...
            </span>
        </div>

        <div className="px-3 pb-3 pt-1">
            <div className="flex items-start gap-3 mb-3">
                <div className="w-8 h-8 flex-shrink-0">
                    <Hourglass className="w-8 h-8 text-blue-800 animate-pulse" />
                </div>
                <div>
                    <p className="text-xs text-black font-bold mb-0.5">Estimated Time Left:</p>
                    <p className="text-sm font-mono text-zinc-700">
                        {minutes > 0 ? `${minutes} min ` : ''}{seconds} sec
                    </p>
                    <p className="text-[10px] text-zinc-500 mt-1">
                        Queue: {pendingCount} of {totalCount} remaining
                    </p>
                </div>
            </div>

            {/* Retro Progress Bar */}
            <div className="win-border-in bg-white h-5 flex p-0.5 space-x-0.5">
                {Array.from({ length: totalBlocks }).map((_, i) => (
                    <div 
                        key={i} 
                        className={`flex-1 ${i < filledBlocks ? 'bg-[#000080]' : 'bg-transparent'}`}
                    ></div>
                ))}
            </div>
            <div className="text-center text-[10px] text-zinc-500 mt-1 font-mono">
                {progress}% Completed
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressWindow;
