const ExerciseBlockSkeleton = () => (
    <div className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-[2rem] p-6 shadow-sm mb-6 animate-pulse">
        {/* Header Skeleton */}
        <div className="flex items-center gap-4 mb-5">
            <div className="p-5 bg-zinc-100 dark:bg-zinc-900 rounded-2xl w-12 h-12" />
            <div className="space-y-2 flex-1">
                <div className="h-4 bg-zinc-100 dark:bg-zinc-900 rounded-full w-1/2" />
                <div className="h-2 bg-zinc-100 dark:bg-zinc-900 rounded-full w-1/3" />
            </div>
        </div>

        {/* Pills Skeleton (Simulando 3 sets previos) */}
        <div className="flex gap-3 mb-5">
            {[1, 2, 3].map(i => (
                <div key={i} className="w-20 h-16 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800" />
            ))}
        </div>

        {/* Input Panel Skeleton */}
        <div className="h-20 bg-zinc-50 dark:bg-zinc-900/50 rounded-3xl border border-zinc-100 dark:border-zinc-800/50" />
    </div>
);

export default ExerciseBlockSkeleton;