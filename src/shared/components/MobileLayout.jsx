import { HiOutlineLogout } from "react-icons/hi";
import { LuClipboardList, LuDumbbell, LuFlame, LuHistory, LuMoon, LuSun, LuUser  } from "react-icons/lu";
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
                
                <main className="flex-1 overflow-y-auto pb-36 bg-transparent no-scrollbar">
                    <Outlet />
                </main>
                <div className="fixed bottom-6 left-0 right-0 flex justify-center px-8 z-50 pointer-events-none">
                    <nav className="w-full max-w-sm h-16 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-white/40 dark:border-zinc-800/50 px-2 pointer-events-auto">
                        <div className="flex justify-around items-center h-full">
                            
                            {/* Ejercicios */}
                            <NavLink to="/exercises" className={({ isActive }) => `relative flex flex-col items-center justify-center w-14 h-12 rounded-xl transition-all duration-300 ${isActive ? "text-blue-600 dark:text-blue-400 scale-110" : "text-zinc-400 dark:text-zinc-500"}`}>
                                {({ isActive }) => (
                                    <>
                                        <LuDumbbell size={20} strokeWidth={isActive ? 2.5 : 2} />
                                        <span className="text-[8px] font-black uppercase tracking-tighter mt-1">Gimnasio</span>
                                        {isActive && <div className="absolute inset-0 bg-blue-500/10 dark:bg-blue-400/10 rounded-xl blur-md -z-10 animate-pulse" />}
                                    </>
                                )}
                            </NavLink>

                            {/* Rutinas */}
                            <NavLink to="/routines" className={({ isActive }) => `relative flex flex-col items-center justify-center w-14 h-12 rounded-xl transition-all duration-300 ${isActive ? "text-blue-600 dark:text-blue-400 scale-110" : "text-zinc-400 dark:text-zinc-500"}`}>
                                {({ isActive }) => (
                                    <>
                                        <LuClipboardList size={20} strokeWidth={isActive ? 2.5 : 2} />
                                        <span className="text-[8px] font-black uppercase tracking-tighter mt-1">Rutinas</span>
                                        {isActive && <div className="absolute inset-0 bg-blue-500/10 dark:bg-blue-400/10 rounded-xl blur-md -z-10 animate-pulse" />}
                                    </>
                                )}
                            </NavLink>

                            {/* Workouts (Entrenar) */}
                            <NavLink to="/workouts" className={({ isActive }) => `relative flex flex-col items-center justify-center w-14 h-12 rounded-xl transition-all duration-300 ${isActive ? "text-blue-600 dark:text-blue-400 scale-110" : "text-zinc-400 dark:text-zinc-500"}`}>
                                {({ isActive }) => (
                                    <>
                                        <LuFlame size={20} strokeWidth={isActive ? 2.5 : 2} />
                                        <span className="text-[8px] font-black uppercase tracking-tighter mt-1">Entrenar</span>
                                        {isActive && <div className="absolute inset-0 bg-blue-500/10 dark:bg-blue-400/10 rounded-xl blur-md -z-10 animate-pulse" />}
                                    </>
                                )}
                            </NavLink>

                            {/* Historial */}
                            <NavLink to="/history" className={({ isActive }) => `relative flex flex-col items-center justify-center w-14 h-12 rounded-xl transition-all duration-300 ${isActive ? "text-blue-600 dark:text-blue-400 scale-110" : "text-zinc-400 dark:text-zinc-500"}`}>
                                {({ isActive }) => (
                                    <>
                                        <LuHistory size={20} strokeWidth={isActive ? 2.5 : 2} />
                                        <span className="text-[8px] font-black uppercase tracking-tighter mt-1">Bitácora</span>
                                        {isActive && <div className="absolute inset-0 bg-blue-500/10 dark:bg-blue-400/10 rounded-xl blur-md -z-10 animate-pulse" />}
                                    </>
                                )}
                            </NavLink>

                            {/* Perfil */}
                            <NavLink to="/profile" className={({ isActive }) => `relative flex flex-col items-center justify-center w-14 h-12 rounded-xl transition-all duration-300 ${isActive ? "text-blue-600 dark:text-blue-400 scale-110" : "text-zinc-400 dark:text-zinc-500"}`}>
                                {({ isActive }) => (
                                    <>
                                        <LuUser size={20} strokeWidth={isActive ? 2.5 : 2} />
                                        <span className="text-[8px] font-black uppercase tracking-tighter mt-1">Perfil</span>
                                        {isActive && <div className="absolute inset-0 bg-blue-500/10 dark:bg-blue-400/10 rounded-xl blur-md -z-10 animate-pulse" />}
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
