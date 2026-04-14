import React from 'react';
import { HiOutlinePlus } from 'react-icons/hi';

const FloatingActionButton = ({ text, onClick, icon: Icon = HiOutlinePlus }) => {
    return (
        <div className="fixed bottom-26 left-0 right-0 flex justify-center z-40 pointer-events-none">
            <button 
                onClick={onClick}
                className="pointer-events-auto cursor-pointer flex items-center gap-2 px-6 h-12 
                    /* Modo Claro: Negro con texto blanco */
                    bg-zinc-900 text-white shadow-[0_8px_20px_rgba(0,0,0,0.3)] border-white/10

                    dark:bg-zinc-100 dark:text-zinc-950 dark:shadow-[0_8px_30px_rgba(255,255,255,0.08)] dark:border-black/5
                    
                    rounded-full border active:scale-95 transition-all 
                    animate-in fade-in zoom-in slide-in-from-bottom-4 duration-500"
            >
                <Icon className="text-lg" strokeWidth={3} />
                <span className="text-[10px] font-black uppercase tracking-widest">
                    {text}
                </span>
            </button>
        </div>
    );
};

export default FloatingActionButton;
