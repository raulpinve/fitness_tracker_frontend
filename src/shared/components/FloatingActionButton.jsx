import React from 'react';
import { HiOutlinePlus } from 'react-icons/hi';
import { LuPlus } from 'react-icons/lu'; // Usamos Lucide para consistencia

const FloatingActionButton = ({ text, onClick, icon: Icon = LuPlus }) => {
    return (
        /* El bottom-26 está perfecto para quedar sobre tu Nav bar */
        <div className="fixed bottom-28 left-0 right-0 flex justify-center z-40 pointer-events-none">
            <button 
                onClick={onClick}
                className="pointer-events-auto cursor-pointer flex items-center gap-3 px-8 h-14 
                    /* Estética TYTAN: Azul Eléctrico con Sombra de Neón */
                    bg-blue-600 text-white border-blue-500/50
                    shadow-[0_12px_30px_-5px_rgba(37,99,235,0.5)]
                    
                    /* Modo Oscuro: Mantenemos el azul pero con un glow más profundo */
                    dark:bg-blue-600 dark:border-blue-400/20 
                    dark:shadow-[0_15px_40px_-10px_rgba(37,99,235,0.6)]
                    
                    /* Forma: No circular perfecto, sino 'Squircle' industrial */
                    rounded-2xl border active:scale-90 transition-all duration-300
                    animate-in fade-in zoom-in slide-in-from-bottom-10"
            >
                {/* Icono con trazo grueso y pequeño pulso */}
                <div className="relative">
                    <div className="absolute inset-0 bg-white/20 blur-md rounded-full animate-pulse" />
                    <Icon className="relative text-lg" strokeWidth={3.5} />
                </div>

                <span className="text-[11px] font-black uppercase italic tracking-[0.2em] leading-none">
                    {text}
                </span>

                {/* Detalle decorativo: Línea vertical sutil */}
                <div className="h-4 w-[1px] bg-white/20 ml-1" />
            </button>
        </div>
    );
};

export default FloatingActionButton;
