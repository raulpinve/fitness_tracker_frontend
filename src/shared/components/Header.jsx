import { HiOutlineArrowLeft } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { useDarkMode } from "../hooks/useDarkMode";

export default function Header({
    title,
    showBack = false,
    rightAction = null,
    center = true,
    backTo 
}) {
    const navigate = useNavigate();
    
    const handleBack = () => {
        if (backTo) {
            navigate(backTo);
        } else {
            navigate(-1);
        }
    };

    return (
        <header className="sticky top-0 z-40 h-16 w-full flex items-center justify-between border-b border-gray-100/50 dark:border-zinc-800/50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl px-4 transition-all">
            {/* Botón de Atrás - Estilo 'Pill' sutil */}
            <div className="w-12 flex items-center">
                {showBack && (
                    <button
                        onClick={handleBack}
                        className="flex items-center justify-center w-10 h-10 rounded-xl bg-zinc-100/50 dark:bg-zinc-800/50 text-zinc-600 dark:text-zinc-400 text-xl cursor-pointer active:scale-90 transition-all border border-transparent dark:border-zinc-700/30"
                    >
                        <HiOutlineArrowLeft />
                    </button>
                )}
            </div>

            {/* Título Principal - Tipografía más Pro */}
            <div className={`flex-1 px-2 ${center ? "text-center" : ""}`}>
                <h1 className="font-black text-sm text-zinc-900 dark:text-zinc-100 uppercase tracking-widest truncate"> 
                    {title}
                </h1>
            </div>

            {/* Acción Derecha */}
            <div className="flex w-12 justify-end items-center">
                {rightAction ? (
                    <div className="active:scale-90 transition-transform">
                        {rightAction}
                    </div>
                ) : (
                    <div className="w-10" /> // Espaciador para mantener el centrado
                )}
            </div>
        </header>
    );
}
