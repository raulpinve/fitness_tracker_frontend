import React from 'react';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

const LoadMoreButton = ({ onClick, loading, hasMore, text = "Cargar más" }) => {
    if (!hasMore) return null;

    return (
        <div className="px-1 mt-4 mb-6">
            <button
                onClick={onClick}
                disabled={loading}
                className="w-full py-4 bg-zinc-100 dark:bg-zinc-900/50 cursor-pointer text-zinc-500 dark:text-zinc-400 text-[10px] font-black uppercase tracking-widest rounded-2xl border border-zinc-200 dark:border-zinc-800/50 flex justify-center items-center gap-3 transition-all active:scale-[0.97] disabled:opacity-50"
            >
                {loading ? (
                    <>
                        <AiOutlineLoading3Quarters className="animate-spin text-sm" />
                        <span>Cargando...</span>
                    </>
                ) : (
                    <>
                        <span>{text}</span>
                        <span className="text-lg opacity-50">↓</span>
                    </>
                )}
            </button>
        </div>
    );
};

export default LoadMoreButton;
