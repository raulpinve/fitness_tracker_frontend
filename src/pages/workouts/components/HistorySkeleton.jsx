const HistorySkeleton = () => (
    <div className="flex flex-wrap gap-3 mb-5 animate-pulse">
        {[...Array(3)].map((_, i) => (
            <div 
                key={i} 
                className="min-w-18.75 h-16 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800" 
            />
        ))}
    </div>
);

export default HistorySkeleton;