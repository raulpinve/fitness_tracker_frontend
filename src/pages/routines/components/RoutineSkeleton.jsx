const RoutineSkeleton = () => (
    <div className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800/60 rounded-2xl p-4 shadow-sm animate-pulse mb-3">
        <div className="flex items-center">
            {/* El icono de la gema */}
            <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-900 flex-shrink-0 mr-3" />

            <div className="flex-1 min-w-0 space-y-3">
                {/* Línea del título de la rutina */}
                <div className="h-4 bg-zinc-100 dark:bg-zinc-900 rounded-full w-1/2" />
                
                {/* Contenedor de los ejercicios (Pills) */}
                <div className="flex items-center gap-2">
                    <div className="h-4 bg-zinc-100 dark:bg-zinc-900 rounded-md w-16" />
                    <div className="h-4 bg-zinc-100 dark:bg-zinc-900 rounded-md w-20" />
                </div>
            </div>
        </div>
    </div>
);

export default RoutineSkeleton;