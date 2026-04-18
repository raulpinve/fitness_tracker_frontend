
const RoutineExerciseSkeleton = () => (
    <div className="flex flex-col divide-y divide-gray-100 dark:divide-zinc-800/50 bg-white dark:bg-zinc-950 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800/50 overflow-hidden animate-pulse">
        {[...Array(10)].map((_, i) => (
            <div key={i} className="flex items-center p-3">
                {/* Order number skeleton */}
                <div className="w-6 h-3 bg-zinc-100 dark:bg-zinc-800 rounded mr-1" />

                {/* Thumbnail skeleton */}
                <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 shrink-0 border border-transparent" />

                {/* Exercise info */}
                <div className="flex-1 ml-3 space-y-2">
                    {/* Exercise name */}
                    <div className="h-3 bg-zinc-100 dark:bg-zinc-800 rounded-full w-1/2" />
                    {/* Goals (sets, reps, kg) */}
                    <div className="h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full w-3/4" />
                </div>

                {/* Actions button (three-dots circle) */}
                <div className="w-10 h-10 rounded-full bg-zinc-50 dark:bg-zinc-900/50 ml-2" />
            </div>
        ))}
    </div>
);

export default RoutineExerciseSkeleton;
