const ExerciseSkeleton = () => (
    <div className="flex items-center p-3 animate-pulse bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-900 mb-3">
        {/* Círculo/Imagen */}
        <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-900 rounded-xl mr-4" />
        
        <div className="flex-1 space-y-3">
            {/* Línea de nombre */}
            <div className="h-3 bg-zinc-100 dark:bg-zinc-900 rounded-full w-3/4" />
            {/* Badges */}
            <div className="flex gap-2">
                <div className="h-4 bg-zinc-100 dark:bg-zinc-900 rounded-md w-12" />
                <div className="h-4 bg-zinc-100 dark:bg-zinc-900 rounded-md w-16" />
            </div>
        </div>
    </div>
);

export default ExerciseSkeleton;
