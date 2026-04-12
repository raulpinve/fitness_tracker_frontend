import { HiOutlineArrowLeft } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

export default function Header({
    title,
    showBack = false,
    rightAction = null,
    center = true,
}) {
    const navigate = useNavigate();

    return (
        <header className="h-14 flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4">
            <div className="w-10 flex items-center text-sm">
                {showBack && (
                    <button
                        onClick={() => navigate(-1)}
                        className="text-gray-600 dark:text-zinc-400 text-xl cursor-pointer hover:opacity-70 transition-opacity"
                    >
                        <HiOutlineArrowLeft />
                    </button>
                )}
            </div>

            <div className={`flex-1 ${center ? "text-center" : ""}`}>
                <h1 className="font-semibold text-lg text-gray-800 dark:text-zinc-100 truncate"> 
                    {title}
                </h1>
            </div>

            <div className="flex w-10 justify-end text-sm">
                {rightAction}
            </div>
        </header>
    );
}
