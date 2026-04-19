import React from 'react';
import { LuSearch, LuX, LuChevronDown } from 'react-icons/lu';

const FilterBarExercise = ({ 
    search, 
    setSearch, 
    filters, 
    setFilters, 
    totalRecords, 
    placeholder = "BUSCAR..." 
}) => {
    const hasActiveFilters = filters.type || filters.muscleGroup;
    return (
        <div className="flex flex-col">
            {/* 1. Search Bar */}
            <div className="pt-4 mb-2">
                <div className="relative group">
                    <input 
                        type="text"
                        placeholder={placeholder}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="input-form pl-10 pr-10 h-12 uppercase font-black text-[10px] tracking-widest"
                    />
                    <LuSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-blue-500" size={16} />
                    {search && (
                        <button 
                            onClick={() => setSearch("")} 
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 active:scale-90 transition-transform"
                        >
                            <LuX size={18} />
                        </button>
                    )}
                </div>
            </div>

            {/* 2. Horizontal Filters */}
            <div className="relative py-2">
                <div className="flex gap-2 overflow-x-auto no-scrollbar pr-12">
                    {/* Selector Tipo */}
                    <div className="relative shrink-0">
                        <select 
                            value={filters.type}
                            onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                            className="appearance-none bg-zinc-100 dark:bg-zinc-900 text-[9px] font-black uppercase tracking-widest pl-3 pr-7 py-2.5 rounded-xl border border-transparent dark:text-zinc-300 active:scale-[0.98] transition-all"
                        >
                            <option value="">Tipo</option>
                            <option value="strength">Fuerza</option>
                            <option value="cardio">Cardio</option>
                        </select>
                        <LuChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" size={10} />
                    </div>

                    {/* Type Selector */}
                    <div className="relative shrink-0">
                        <select 
                            value={filters.muscleGroup}
                            onChange={(e) => setFilters(prev => ({ ...prev, muscleGroup: e.target.value }))}
                            className="appearance-none bg-zinc-100 dark:bg-zinc-900 text-[9px] font-black uppercase tracking-widest pl-3 pr-7 py-2.5 rounded-xl border border-transparent dark:text-zinc-300 active:scale-[0.98] transition-all"
                        >
                            <option value="">Músculo</option>
                            <option value="pecho">Pecho</option>
                            <option value="espalda">Espalda</option>
                            <option value="hombros">Hombros</option>
                            <option value="biceps">Bíceps</option>
                            <option value="triceps">Tríceps</option>
                            <option value="antebrazos">Antebrazos</option>
                            <option value="cuadriceps">Cuádriceps</option>
                            <option value="isquios">Isquios</option>
                            <option value="gluteos">Glúteos</option>
                            <option value="gemelos">Gemelos</option>
                            <option value="abs">Abs</option>
                            <option value="cardio">Cardio</option>
                            <option value="full_body">Full Body</option>
                        </select>
                        <LuChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" size={10} />
                    </div>
                </div>

                {/* Floating Clear Button */}
                {hasActiveFilters && (
                    <div className="absolute right-0 top-0 h-full flex items-center bg-linear-to-l from-gray-50 dark:from-zinc-950 via-gray-50/80 dark:via-zinc-950/80 to-transparent pl-16 pointer-events-none">
                        <button 
                            onClick={() => setFilters({ type: "", muscleGroup: "" })} 
                            className="pointer-events-auto flex items-center gap-1.5 px-3 py-2 bg-red-500/10 dark:bg-red-500/20 text-red-600 dark:text-red-400 rounded-xl border border-red-500/20 active:scale-90 transition-all shadow-sm"
                        >
                            <LuX size={12} strokeWidth={3} />
                            <span className="text-[9px] font-black uppercase tracking-[0.2em]">Limpiar</span>
                        </button>
                    </div>
                )}
            </div>

            {/* 3. Results Counter */}
            <div className="px-1 py-2 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em]">
                    {totalRecords} Resultados
                </span>
            </div>
        </div>
    );
};

export default FilterBarExercise;
