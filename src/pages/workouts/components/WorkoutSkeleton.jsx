const WorkoutSkeleton = () => {
    // We define the single row structure first
    const SkeletonItem = () => (
        <div className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800/60 rounded-2xl p-4 shadow-sm animate-pulse mb-3">
            <div className="flex items-center">
                {/* Date/Status Square Box */}
                <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-900 flex-shrink-0 mr-4" />

                <div className="flex-1 min-w-0 space-y-3">
                    {/* Workout Title line */}
                    <div className="h-4 bg-zinc-100 dark:bg-zinc-900 rounded-full w-2/3" />
                    
                    <div className="flex items-center gap-3">
                        {/* Duration Badge */}
                        <div className="h-4 bg-zinc-100 dark:bg-zinc-900 rounded-md w-16" />
                        {/* Session type subtext */}
                        <div className="h-3 bg-zinc-100 dark:bg-zinc-900 rounded-full w-24" />
                    </div>
                </div>
            </div>
        </div>
    );

    // We return an array of 5 skeleton items
    return (
        <>
            {[...Array(10)].map((_, i) => (
                <SkeletonItem key={i} />
            ))}
        </>
    );
};

export default WorkoutSkeleton;
