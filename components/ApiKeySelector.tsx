import React, { useState, useEffect } from 'react';
import { ArrowRight, Zap, HelpCircle, X, Smile } from 'lucide-react';

interface ApiKeySelectorProps {
  onKeySelected: () => void;
}

const ApiKeySelector: React.FC<ApiKeySelectorProps> = ({ onKeySelected }) => {
  const [hasKey, setHasKey] = useState(false);
  const [checking, setChecking] = useState(true);
  const [step, setStep] = useState(1);

  const checkKey = async () => {
    try {
      if (window.aistudio && window.aistudio.hasSelectedApiKey) {
        const selected = await window.aistudio.hasSelectedApiKey();
        setHasKey(selected);
        if (selected) {
          onKeySelected();
        }
      }
    } catch (e) {
      console.error("Error checking API key:", e);
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    checkKey();
    const interval = setInterval(checkKey, 2000);
    return () => clearInterval(interval);
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectKey = async () => {
    try {
      if (window.aistudio && window.aistudio.openSelectKey) {
        await window.aistudio.openSelectKey();
        setStep(2); 
      } else {
        alert("We couldn't find the AI Studio tools. Please check your connection.");
      }
    } catch (e) {
      console.error("Failed to open key selector", e);
    }
  };

  if (checking) return null;
  if (hasKey) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#008080] p-4">
      {/* Centered System Window */}
      <div className="win-border-out bg-[#c0c0c0] max-w-md w-full p-1 shadow-2xl">
        <div className="win-titlebar px-2 py-1 flex justify-between items-center mb-4">
            <span className="text-white font-bold text-xs">Welcome!</span>
            <X className="w-4 h-4 bg-[#c0c0c0] text-black border-t border-l border-white border-b border-r border-black p-0.5 cursor-pointer" />
        </div>

        <div className="px-6 py-6">
            <div className="flex gap-4 mb-6">
                <div className="w-12 h-12 flex-shrink-0 bg-white win-border-in flex items-center justify-center rounded-full">
                    <Smile className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-black mb-1">Let's Get Connected</h2>
                    <p className="text-sm text-zinc-700 leading-snug">
                        To create videos, this tool needs to connect to your Google Account.
                    </p>
                </div>
            </div>

            <div className="space-y-4">
                <div className="bg-white/50 p-3 rounded-md border border-zinc-300 text-xs text-zinc-800">
                    <p className="mb-2">
                        We use Google's <strong>Veo</strong> model to generate the videos. 
                        Click below to select or create a project.
                    </p>
                    <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="text-blue-700 hover:underline flex items-center gap-1 font-medium mt-2">
                        <HelpCircle className="w-3 h-3" />
                        Learn more about Google AI pricing
                    </a>
                </div>

                <div className="flex justify-end gap-2 mt-8">
                     <button
                        onClick={handleSelectKey}
                        className="px-6 py-2 text-black font-bold text-sm bg-[#c0c0c0] border-t border-l border-white border-b border-r border-black active:border-t-black active:border-l-black active:border-r-white active:border-b-white flex items-center gap-2 hover:bg-[#d0d0d0] transition-colors"
                      >
                        {step === 1 ? 'Connect Google Account' : 'Waiting for connection...'}
                        <ArrowRight className="w-4 h-4" />
                      </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ApiKeySelector;