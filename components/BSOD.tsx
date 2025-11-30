import React, { useEffect } from 'react';

interface BSODProps {
  onDismiss: () => void;
}

const BSOD: React.FC<BSODProps> = ({ onDismiss }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        // Prevent default behavior to try and capture input, though system keys usually bypass this
        if (e.cancelable) e.preventDefault();

        // Check for specific control keys that should NOT trigger return individually
        const isCtrl = e.key === 'Control';
        const isAlt = e.key === 'Alt';
        const isDel = e.key === 'Delete';
        
        // Check for the specific restart combination
        const isCombo = e.ctrlKey && e.altKey && e.key === 'Delete';

        // If the user presses the magic combo, we 'restart' (return to home)
        if (isCombo) {
            onDismiss();
            return;
        }

        // If user is just pressing a modifier or Delete key to form the combo, do nothing
        if (isCtrl || isAlt || isDel) {
            return;
        }

        // Any other key triggers a return to the home screen
        onDismiss();
    };

    const handleClick = () => {
        onDismiss();
    };

    // Small delay to prevent immediate dismissal if the user was clicking the button
    const timeout = setTimeout(() => {
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('click', handleClick);
    }, 500);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('click', handleClick);
    };
  }, [onDismiss]);

  return (
    <div className="fixed inset-0 bg-[#0000AA] text-white font-mono p-8 z-[9999] cursor-none flex items-center justify-center select-none overflow-hidden">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-12">
            <span className="bg-[#AAAAAA] text-[#0000AA] font-bold px-2 py-0.5">Windows</span>
        </div>
        
        <p className="mb-8 text-center">
            A fatal exception 0E has occurred at 0028:C0011E36 in VXD VMM(01) + 00010E36. The current application will be terminated.
        </p>

        <ul className="list-none space-y-4 mb-12">
            <li>* Press any key to terminate the current application.</li>
            <li>* Press CTRL+ALT+DEL again to restart your computer. You will lose any unsaved information in all applications.</li>
        </ul>

        <p className="text-center animate-pulse">Press any key to continue_</p>
      </div>
    </div>
  );
};

export default BSOD;