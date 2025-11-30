import React, { useState } from 'react';
import { Scene } from '../types';
import { constructPrompt, DEFAULT_PROMPT_TEMPLATE } from '../services/geminiService';
import { Play, Settings2, ChevronDown, ChevronUp, RotateCcw, X, Minus, Square, Cpu, Info } from 'lucide-react';

interface InputFormProps {
  onScenesParsed: (scenes: Scene[]) => void;
  isProcessing: boolean;
  selectedModel: string;
  onModelSelect: (model: string) => void;
}

const SAMPLE_INPUT = "What does the future look like? ; Flying cars in neon skies ; Robots gardening ; A city made of crystal";

const InputForm: React.FC<InputFormProps> = ({ onScenesParsed, isProcessing, selectedModel, onModelSelect }) => {
  const [inputText, setInputText] = useState('');
  const [promptTemplate, setPromptTemplate] = useState(DEFAULT_PROMPT_TEMPLATE);
  const [showPromptSettings, setShowPromptSettings] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleParse = () => {
    setError(null);
    if (!inputText.trim()) {
      setError("Please describe your dream first.");
      return;
    }

    // Expected format: {THEME}; {SCENE1}; {SCENE2}; ...
    // Split everything by semi-colon
    const parts = inputText.split(';').map(p => p.trim()).filter(p => p.length > 0);
    
    if (parts.length < 2) {
      setError("Please format as: Theme ; Scene 1 ; Scene 2 (use semi-colons to separate each part).");
      return;
    }

    // First part is the Question/Theme
    const question = parts[0];
    
    // Remaining parts are the Answers/Scenes
    const answers = parts.slice(1);

    const newScenes: Scene[] = answers.map((answer) => ({
      id: crypto.randomUUID(),
      question,
      answer,
      prompt: constructPrompt(question, answer, promptTemplate),
      status: 'idle',
    }));

    onScenesParsed(newScenes);
  };

  const handleResetTemplate = () => {
    setPromptTemplate(DEFAULT_PROMPT_TEMPLATE);
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-12">
      <div className="win-border-out bg-[#c0c0c0] p-1">
        {/* Title Bar */}
        <div className="win-titlebar-active px-2 py-1 flex items-center justify-between mb-1 select-none">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xs uppercase tracking-wider text-black">Dream Composer</span>
          </div>
          <div className="flex gap-1">
             <button className="bg-[#c0c0c0] w-4 h-4 flex items-center justify-center border-t border-l border-white border-b border-r border-black shadow-sm active:border-t-black active:border-l-black active:border-r-white active:border-b-white">
                <Minus className="w-2 h-2 text-black" />
             </button>
             <button className="bg-[#c0c0c0] w-4 h-4 flex items-center justify-center border-t border-l border-white border-b border-r border-black shadow-sm active:border-t-black active:border-l-black active:border-r-white active:border-b-white">
                <Square className="w-2 h-2 text-black" />
             </button>
             <button className="bg-[#c0c0c0] w-4 h-4 flex items-center justify-center border-t border-l border-white border-b border-r border-black shadow-sm active:border-t-black active:border-l-black active:border-r-white active:border-b-white">
                <X className="w-3 h-3 text-black" />
             </button>
          </div>
        </div>
        
        <div className="p-4">
            {/* Friendly Guide */}
            <div className="mb-4 bg-yellow-50 border border-yellow-200 p-3 rounded-sm text-xs text-zinc-800 flex gap-3">
                <div className="flex-shrink-0 pt-0.5">
                    <Info className="w-4 h-4 text-yellow-600" />
                </div>
                <div>
                    <p className="font-bold mb-1">How to write your dream:</p>
                    <p className="mb-1">
                        1. Type a general <strong>Theme</strong> or Question.
                    </p>
                    <p className="mb-1">
                        2. Add a <strong>semicolon ( ; )</strong> after the theme.
                    </p>
                    <p>
                        3. List your <strong>Scenes</strong>, adding a <strong>semicolon ( ; )</strong> between each one.
                    </p>
                </div>
            </div>
            
            <div className="relative group">
            <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Try this format:\n\n${SAMPLE_INPUT}`}
                className="w-full h-32 win-border-in p-3 text-black placeholder-zinc-400 focus:outline-none resize-none text-sm leading-relaxed font-medium"
                disabled={isProcessing}
                spellCheck={false}
            />
            </div>

            {/* Prompt Settings Toggle */}
            <div className="mt-4 pt-2 border-t border-zinc-400 border-dashed">
            <button
                onClick={() => setShowPromptSettings(!showPromptSettings)}
                className="flex items-center gap-2 text-xs text-zinc-600 hover:text-black transition-colors mb-2 w-full"
            >
                {showPromptSettings ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                <Settings2 className="w-3 h-3" />
                <span className="underline decoration-dotted">Advanced Options (Models & Prompts)</span>
            </button>

            {showPromptSettings && (
                <div className="mb-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="win-border-in bg-white p-3 space-y-4">
                    
                    {/* Model Selector */}
                    <div>
                         <div className="flex items-center gap-2 mb-1">
                            <Cpu className="w-3 h-3 text-zinc-500" />
                            <label className="text-[10px] font-bold text-zinc-500 uppercase">
                                Video AI Model
                            </label>
                         </div>
                         <select 
                            value={selectedModel}
                            onChange={(e) => onModelSelect(e.target.value)}
                            className="w-full text-xs font-mono bg-[#f5f5f5] border border-zinc-300 p-1.5 focus:outline-none cursor-pointer"
                         >
                            <option value="veo-3.1-generate-preview">Veo 3.1 (High Quality - Slow)</option>
                            <option value="veo-3.1-fast-generate-preview">Veo 3.1 Fast (Turbo - Recommended)</option>
                            <option value="veo-3.0-generate-001">Veo 3.0 (Standard)</option>
                            <option value="veo-3.0-fast-generate-001">Veo 3.0 Fast (Turbo)</option>
                            <option value="veo-2.0-generate-001">Veo 2.0 (Legacy)</option>
                         </select>
                    </div>

                    {/* Prompt Template */}
                    <div>
                        <div className="flex items-center justify-between mb-2 pb-2 border-b border-zinc-200">
                            <label className="text-[10px] font-bold text-zinc-500 uppercase">
                            Base Prompt Instructions
                            </label>
                            <button 
                            onClick={handleResetTemplate}
                            className="text-[10px] flex items-center gap-1 text-red-600 hover:text-red-700 bg-zinc-100 px-2 py-0.5 border border-zinc-300 hover:border-red-300 rounded-sm transition-colors"
                            title="Reset to default"
                            >
                            <RotateCcw className="w-3 h-3" />
                            Reset Default
                            </button>
                        </div>
                        <div className="mb-2 text-[10px] text-zinc-500 font-mono">
                        System variables: <span className="bg-yellow-100 px-1 border border-yellow-200 rounded-sm">{'{QUESTION}'}</span> (Theme) and <span className="bg-green-100 px-1 border border-green-200 rounded-sm">{'{ANSWER}'}</span> (Scene).
                        </div>
                        <textarea
                            value={promptTemplate}
                            onChange={(e) => setPromptTemplate(e.target.value)}
                            className="w-full h-48 bg-[#f5f5f5] p-2 text-xs font-mono text-zinc-700 focus:outline-none border border-zinc-300 resize-y"
                            spellCheck={false}
                        />
                    </div>
                </div>
                </div>
            )}
            </div>

            {error && (
            <div className="mt-4 flex items-center gap-2 text-red-800 text-xs bg-red-50 border border-red-200 p-3 rounded-sm">
                <div className="w-5 h-5 bg-red-100 rounded-full text-red-600 flex items-center justify-center flex-shrink-0">
                    <Info className="w-3 h-3" />
                </div>
                <span className="font-medium">{error}</span>
            </div>
            )}

            <div className="mt-4 flex justify-end">
            <button
                onClick={handleParse}
                disabled={isProcessing || !inputText.trim()}
                className="flex items-center gap-2 px-8 py-2 bg-[#c0c0c0] hover:bg-[#d4d4d4] active:bg-[#a0a0a0] text-black disabled:text-zinc-500 font-bold text-sm uppercase border-t border-l border-white border-b border-r border-black active:border-t-black active:border-l-black active:border-r-white active:border-b-white shadow-sm transition-all"
            >
                <span>Create Dreams</span>
                <Play className="w-4 h-4 fill-current" />
            </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default InputForm;