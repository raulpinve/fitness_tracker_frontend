import { HiOutlineLogout } from "react-icons/hi";
import { LuClipboardList, LuDumbbell, LuFlame, LuMoon, LuSun, LuUser  } from "react-icons/lu";
import { NavLink, Outlet } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../../auth/useAuth";
import { useState } from "react";
import BottomSheet from "./BottomSheet";
import { useDarkMode } from "../hooks/useDarkMode";

export default function MobileLayout() {
    const { logout } = useAuth(); 
    const [ openProfileSheet, setOpenProfileSheet] = useState(false);
    const { isDark, toggleDarkMode } = useDarkMode();

    const handleConfirmLogout = async () => {
        try {
            await logout(); 
            toast.success("Sesión cerrada");
        } catch {
            toast.error("Error al cerrar sesión");
        }
    };
  
    return (
        <>
            <div className="max-w-md mx-auto h-screen flex flex-col border border-slate-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 relative overflow-hidden z-40">
                
                <main className="flex-1 overflow-y-auto pb-32 bg-transparent">
                <Outlet />
                </main>
                
                {/* Nav con fondo Zinc-900 para crear jerarquía sobre el fondo principal */}
                {/* <nav className="fixed bottom-0 w-full max-w-md h-20 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-lg border-t border-gray-100 dark:border-zinc-800/50 px-6 pb-2 z-50">
                    <div className="flex justify-between items-center h-full">
                        <NavLink
                            to="/exercises"
                            className={({ isActive }) =>
                                `relative flex flex-col items-center justify-center gap-1 transition-all duration-300 ${
                                    isActive ? "text-blue-600 dark:text-blue-400" : "text-zinc-400 dark:text-zinc-600"
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <LuDumbbell className={`transition-transform duration-300 ${isActive ? "scale-110" : ""}`} size={22} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Ejercicios</span>
                                    {isActive && (
                                        <div className="absolute -top-3 w-1 h-1 bg-blue-600 rounded-full shadow-[0_0_8px_rgba(37,99,235,0.8)]" />
                                    )}
                                </>
                            )}
                        </NavLink>

                        <NavLink
                            to="/routines"
                            className={({ isActive }) =>
                                `relative flex flex-col items-center justify-center gap-1 transition-all duration-300 ${
                                    isActive ? "text-blue-600 dark:text-blue-400" : "text-zinc-400 dark:text-zinc-600"
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <LuClipboardList className={`transition-transform duration-300 ${isActive ? "scale-110" : ""}`} size={22} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Rutinas</span>
                                    {isActive && (
                                        <div className="absolute -top-3 w-1 h-1 bg-blue-600 rounded-full shadow-[0_0_8px_rgba(37,99,235,0.8)]" />
                                    )}
                                </>
                            )}
                        </NavLink>

                        <NavLink
                            to="/workouts"
                            className={({ isActive }) =>
                                `relative flex flex-col items-center justify-center gap-1 transition-all duration-300 ${
                                    isActive ? "text-blue-600 dark:text-blue-400" : "text-zinc-400 dark:text-zinc-600"
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <LuFlame className={`transition-transform duration-300 ${isActive ? "scale-110" : ""}`} size={22} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Entrenar</span>
                                    {isActive && (
                                        <div className="absolute -top-3 w-1 h-1 bg-blue-600 rounded-full shadow-[0_0_8px_rgba(37,99,235,0.8)]" />
                                    )}
                                </>
                            )}
                        </NavLink>

                        <button 
                            className="flex flex-col items-center justify-center gap-1 text-zinc-400 dark:text-zinc-600 hover:text-red-500 transition-colors duration-200"
                        >
                            <HiOutlineLogout size={22} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Salir</span>
                        </button>
                    </div>
                </nav> */}

                <div className="fixed bottom-6 left-0 right-0 flex justify-center px-8 z-50 pointer-events-none">
                    <nav className="w-full max-w-sm h-16 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-white/40 dark:border-zinc-800/50 px-2 pointer-events-auto">
                        <div className="flex justify-around items-center h-full">
                            
                            {/* Ejercicios */}
                            <NavLink
                                to="/exercises"
                                className={({ isActive }) =>
                                    `relative flex flex-col items-center justify-center w-14 h-12 rounded-xl transition-all duration-300 ${
                                        isActive 
                                        ? "text-blue-600 dark:text-blue-400 scale-110" 
                                        : "text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300"
                                    }`
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        <LuDumbbell size={22} strokeWidth={isActive ? 2.5 : 2} />
                                        <span className="text-[9px] font-black uppercase tracking-tighter mt-1">Gimnasio</span>
                                        {/* Brillo de fondo sutil solo cuando está activo */}
                                        {isActive && (
                                            <div className="absolute inset-0 bg-blue-500/10 dark:bg-blue-400/10 rounded-xl blur-md -z-10 animate-pulse" />
                                        )}
                                    </>
                                )}
                            </NavLink>

                            {/* Rutinas */}
                            <NavLink
                                to="/routines"
                                className={({ isActive }) =>
                                    `relative flex flex-col items-center justify-center w-14 h-12 rounded-xl transition-all duration-300 ${
                                        isActive 
                                        ? "text-blue-600 dark:text-blue-400 scale-110" 
                                        : "text-zinc-400 dark:text-zinc-500"
                                    }`
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        <LuClipboardList size={22} strokeWidth={isActive ? 2.5 : 2} />
                                        <span className="text-[9px] font-black uppercase tracking-tighter mt-1">Rutinas</span>
                                        {isActive && <div className="absolute inset-0 bg-blue-500/10 dark:bg-blue-400/10 rounded-xl blur-md -z-10 animate-pulse" />}
                                    </>
                                )}
                            </NavLink>

                            {/* Workouts */}
                            <NavLink
                                to="/workouts"
                                className={({ isActive }) =>
                                    `relative flex flex-col items-center justify-center w-14 h-12 rounded-xl transition-all duration-300 ${
                                        isActive 
                                        ? "text-blue-600 dark:text-blue-400 scale-110" 
                                        : "text-zinc-400 dark:text-zinc-500"
                                    }`
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        <LuFlame size={22} strokeWidth={isActive ? 2.5 : 2} />
                                        <span className="text-[9px] font-black uppercase tracking-tighter mt-1">Entrenar</span>
                                        {isActive && <div className="absolute inset-0 bg-blue-500/10 dark:bg-blue-400/10 rounded-xl blur-md -z-10 animate-pulse" />}
                                    </>
                                )}
                            </NavLink>

                            {/* Separador tipo "Gema" */}
                            <div className="w-[1.5px] h-4 bg-zinc-200 dark:bg-zinc-800 rounded-full mx-1" />

                            {/* Perfil   */}
                            <NavLink
                                to="/profile"
                                className={({ isActive }) =>
                                    `relative flex flex-col items-center justify-center w-14 h-12 rounded-xl transition-all duration-300 ${
                                        isActive 
                                        ? "text-blue-600 dark:text-blue-400 scale-110" 
                                        : "text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300"
                                    }`
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        <LuUser size={22} strokeWidth={isActive ? 2.5 : 2} />
                                        <span className="text-[9px] font-black uppercase tracking-tighter mt-1">Perfil</span>
                                        
                                        {/* Brillo de fondo sutil cuando la ruta es /profile */}
                                        {isActive && (
                                            <div className="absolute inset-0 bg-blue-500/10 dark:bg-blue-400/10 rounded-xl blur-md -z-10 animate-pulse" />
                                        )}
                                    </>
                                )}
                            </NavLink>
                        </div>
                    </nav>
                </div>
            </div>

       
        </>
    );
};
