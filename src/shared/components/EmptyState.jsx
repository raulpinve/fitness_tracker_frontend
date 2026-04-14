import React from 'react';
import { LuInbox } from 'react-icons/lu';

const EmptyState = ({ 
    message = "No hay registros disponibles", 
    icon: Icon = LuInbox,
    className = "" 
}) => {
    return (
        <div className={`bg-white dark:bg-zinc-950 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-[2rem] p-12 flex flex-col items-center justify-center text-center ${className}`}>
            <div className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-2xl mb-4">
                <Icon className="text-zinc-300 dark:text-zinc-600" size={32} />
            </div>
            <p className="text-sm font-bold text-zinc-500 dark:text-zinc-500 italic max-w-[200px] leading-relaxed">
                {message}
            </p>
        </div>
    );
};

export default EmptyState;
