import { LuCircleAlert } from 'react-icons/lu';

const MessageError = ({ children }) => {
    return (
        <div className="rounded-2xl border border-red-100 bg-red-50/50 p-4 dark:border-red-900/30 dark:bg-red-950/20 mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-3">
                {/* Icono con contenedor para dar peso visual */}
                <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-red-100 dark:bg-red-500/20 flex items-center justify-center text-red-600 dark:text-red-500">
                    <LuCircleAlert size={18} strokeWidth={2.5} />
                </div>
                
                <div className="flex-1">
                    <p className="text-[10px] font-black text-red-600 dark:text-red-500 uppercase tracking-widest leading-none mb-1">
                        Atención
                    </p>
                    <div className="text-xs font-bold text-red-800/80 dark:text-red-400/90 leading-tight">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MessageError;
