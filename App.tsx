
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Scene } from './types';
import InputForm from './components/InputForm';
import SceneCard from './components/SceneCard';
import ApiKeySelector from './components/ApiKeySelector';
import DreamStream from './components/DreamStream';
import BSOD from './components/BSOD';
import HelpWindow from './components/HelpWindow';
import ProgressWindow from './components/ProgressWindow';
import { generateVideoForScene } from './services/geminiService';
import { Monitor, Zap, Power, Settings, BookOpen } from 'lucide-react';

const App: React.FC = () => {
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [apiKeyReady, setApiKeyReady] = useState(false);
  const [showBsod, setShowBsod] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  
  // Model state
  const [veoModel, setVeoModel] = useState<string>('veo-3.1-generate-preview');

  // Start Menu state
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const startMenuRef = useRef<HTMLDivElement>(null);
  const startButtonRef = useRef<HTMLDivElement>(null);

  // Close start menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        startMenuRef.current && 
        !startMenuRef.current.contains(event.target as Node) &&
        startButtonRef.current &&
        !startButtonRef.current.contains(event.target as Node)
      ) {
        setIsStartMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRedoApiSetup = async () => {
    setIsStartMenuOpen(false);
    try {
        if (window.aistudio?.openSelectKey) {
            await window.aistudio.openSelectKey();
            setApiKeyReady(false); // Reset to force the modal check if needed, though openSelectKey is modal itself
        }
    } catch (e) {
        console.error("Failed to open key selector", e);
    }
  };

  const handleShutdown = () => {
    setIsStartMenuOpen(false);
    setShowBsod(true);
  };
  
  const handleOpenHelp = () => {
    setIsStartMenuOpen(false);
    setShowHelp(true);
  };

  // Queue processing with concurrency limit
  const processQueue = useCallback(async (currentScenes: Scene[], modelName: string) => {
    setIsProcessing(true);
    
    // Filter for scenes that need processing (idle)
    const scenesToProcess = currentScenes.filter(s => s.status === 'idle');
    const CONCURRENCY_LIMIT = 2;

    const processScene = async (scene: Scene) => {
        setScenes(prev => prev.map(s => s.id === scene.id ? { ...s, status: 'generating' } : s));

        try {
            const videoUri = await generateVideoForScene(scene, {
                resolution: '1080p',
                aspectRatio: '16:9'
            }, modelName);
            
            const separator = videoUri.includes('?') ? '&' : '?';
            const fetchUrl = `${videoUri}${separator}key=${process.env.API_KEY}`;
            
            const response = await fetch(fetchUrl);
            if (!response.ok) throw new Error(`Failed to download: ${response.statusText}`);
            
            const blob = await response.blob();
            if (blob.size === 0) throw new Error("Empty video file");

            const videoUrl = URL.createObjectURL(blob);

            setScenes(prev => prev.map(s => s.id === scene.id ? { 
                ...s, 
                status: 'completed', 
                videoUri, 
                videoUrl 
            } : s));

        } catch (error: any) {
            const errorMessage = error.message || "Failed";
            console.error(`Error processing scene ${scene.id}:`, error);
            
            if (errorMessage.includes("Requested entity was not found")) {
                try {
                    if (window.aistudio?.openSelectKey) {
                        await window.aistudio.openSelectKey();
                    }
                } catch (selectError) {
                    console.error("Failed to open key selector", selectError);
                }
            }

            setScenes(prev => prev.map(s => s.id === scene.id ? { ...s, status: 'failed', error: errorMessage } : s));
        }
    };

    const activePromises = new Set<Promise<void>>();

    for (const scene of scenesToProcess) {
        if (activePromises.size >= CONCURRENCY_LIMIT) {
            await Promise.race(activePromises);
        }

        const promise = processScene(scene);
        const cleanupPromise = promise.then(() => {
            activePromises.delete(cleanupPromise);
        });
        activePromises.add(cleanupPromise);
    }
    
    await Promise.all(activePromises);
    setIsProcessing(false);
  }, []);

  const handleScenesParsed = (newScenes: Scene[]) => {
    setScenes(newScenes);
    processQueue(newScenes, veoModel);
  };

  if (showBsod) {
    return <BSOD onDismiss={() => setShowBsod(false)} />;
  }

  const hasCompletedScenes = scenes.some(s => s.status === 'completed');
  const pendingCount = scenes.filter(s => s.status === 'idle' || s.status === 'generating').length;

  return (
    <div className="min-h-screen font-mono flex flex-col pb-12">
      
      {!apiKeyReady && <ApiKeySelector onKeySelected={() => setApiKeyReady(true)} />}
      
      {showHelp && <HelpWindow onClose={() => setShowHelp(false)} />}
      
      {isProcessing && pendingCount > 0 && (
        <ProgressWindow 
            pendingCount={pendingCount} 
            totalCount={scenes.length} 
            modelName={veoModel} 
        />
      )}

      {/* Taskbar Header */}
      <header className="bg-[#c0c0c0] border-b-2 border-white shadow-md sticky top-0 z-40">
        <div className="border-b border-black">
            <div className="max-w-7xl mx-auto px-4 h-10 flex items-center justify-between">
            <div className="flex items-center gap-2 relative">
                
                {/* Menu Button */}
                <div 
                    ref={startButtonRef}
                    onClick={() => setIsStartMenuOpen(!isStartMenuOpen)}
                    className={`flex items-center gap-2 px-3 py-1 bg-[#c0c0c0] cursor-pointer hover:bg-[#d0d0d0] border-t border-l border-b border-r transition-all
                        ${isStartMenuOpen 
                            ? 'border-t-black border-l-black border-r-white border-b-white bg-zinc-300' 
                            : 'border-t-white border-l-white border-r-black border-b-black'
                        } active:border-t-black active:border-l-black active:border-r-white active:border-b-white`}
                >
                    <Monitor className="w-4 h-4 text-black" />
                    <h1 className="text-xs font-bold uppercase text-black select-none">
                    MENU
                    </h1>
                </div>

                {/* Start Menu Dropdown */}
                {isStartMenuOpen && (
                    <div 
                        ref={startMenuRef}
                        className="absolute top-10 left-0 w-56 bg-[#c0c0c0] win-border-out shadow-xl flex flex-col p-1 z-50 animate-in slide-in-from-top-2 duration-100"
                    >
                        {/* Vertical Strip */}
                        <div className="bg-[#000080] absolute left-1 top-1 bottom-1 w-6 overflow-hidden flex items-end justify-center">
                             <span className="text-white text-xs font-bold whitespace-nowrap tracking-widest origin-bottom-left -rotate-90 translate-x-4 mb-2">
                                DREAM OS
                             </span>
                        </div>
                        
                        <div className="pl-7 space-y-1">
                            <button 
                                onClick={handleOpenHelp}
                                className="w-full text-left px-3 py-2 hover:bg-[#000080] hover:text-white text-black text-sm flex items-center gap-2 group transition-colors"
                            >
                                <BookOpen className="w-4 h-4 group-hover:text-white" />
                                <span>Guide: How to use</span>
                            </button>
                            <button 
                                onClick={handleRedoApiSetup}
                                className="w-full text-left px-3 py-2 hover:bg-[#000080] hover:text-white text-black text-sm flex items-center gap-2 group transition-colors"
                            >
                                <Settings className="w-4 h-4 group-hover:text-white" />
                                <span>API Key Settings...</span>
                            </button>
                            <div className="border-t border-zinc-500 my-1"></div>
                            <button 
                                onClick={handleShutdown}
                                className="w-full text-left px-3 py-2 hover:bg-[#000080] hover:text-white text-black text-sm flex items-center gap-2 group transition-colors"
                            >
                                <Power className="w-4 h-4 group-hover:text-white" />
                                <span>Reset App</span>
                            </button>
                        </div>
                    </div>
                )}

                <div className="h-6 w-[2px] bg-zinc-400 mx-2 border-r border-white"></div>
                <h1 className="text-sm font-bold text-zinc-700 hidden md:block">
                Dream Sequence Tool
                </h1>
            </div>
            
            <div className="flex items-center gap-4">
                 <div className="win-border-in bg-white px-2 py-0.5 text-[10px] text-zinc-600 flex items-center gap-2">
                    <Zap className="w-3 h-3 text-green-600 fill-current" />
                    System Ready
                 </div>
                 <div className="win-border-in bg-white px-2 py-0.5 text-[10px] text-black">
                    {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                 </div>
            </div>
            </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-6 py-8 w-full">
        <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-black mb-3 drop-shadow-sm">What do you want to dream about?</h2>
            <p className="text-zinc-600 text-sm max-w-lg mx-auto leading-relaxed">
                Enter a main theme and list the scenes you want to see. Our AI will weave them into a continuous video loop for you.
            </p>
        </div>

        <InputForm 
            onScenesParsed={handleScenesParsed} 
            isProcessing={isProcessing} 
            selectedModel={veoModel}
            onModelSelect={setVeoModel}
        />

        {hasCompletedScenes && (
            <DreamStream scenes={scenes} />
        )}

        {scenes.length > 0 && (
          <div className="mt-8 pt-8 border-t border-zinc-400 border-dashed">
            <div className="flex items-center gap-2 mb-6">
               <div className="w-2 h-2 bg-black rounded-full"></div>
               <h3 className="text-sm font-bold text-black uppercase">Your Dream Collection ({scenes.length})</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {scenes.map((scene) => (
                <SceneCard key={scene.id} scene={scene} />
              ))}
            </div>
          </div>
        )}
      </main>
      
      <footer className="fixed bottom-0 w-full bg-[#c0c0c0] border-t border-white px-4 py-1 text-[10px] text-zinc-600 flex justify-between z-30">
         <span>Status: OK</span>
         <span>Dream_Weaver_v1.0</span>
      </footer>
    </div>
  );
};

export default App;
