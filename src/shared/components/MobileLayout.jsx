import { HiOutlineLogout } from "react-icons/hi";
import { LuClipboardList, LuDumbbell, LuFlame, LuHistory, LuMoon, LuSun, LuUser  } from "react-icons/lu";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";
import BottomSheet from "./BottomSheet";

export default function MobileLayout() {
    const { logout } = useAuth(); 
    return (
        <>
            <div className="max-w-md mx-auto h-screen flex flex-col border border-slate-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 relative overflow-hidden z-40">
                <main className="flex-1 overflow-y-auto pb-36 bg-transparent no-scrollbar">
                    <Outlet />
                </main>
                <div className="fixed bottom-6 left-0 right-0 flex justify-center px-6 z-50 pointer-events-none">
                    <nav className="w-full max-w-[360px] h-[72px] bg-white/80 dark:bg-zinc-950/80 backdrop-blur-2xl rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-white/50 dark:border-zinc-800/50 p-2 pointer-events-auto relative overflow-hidden">
                        
                        {/* Decoración Tytan: Línea de estatus superior interna muy sutil */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-zinc-200 dark:bg-zinc-800 rounded-full opacity-20" />

                        <div className="flex justify-around items-center h-full relative z-10">
                            
                            {/* Gimnasio */}
                            <NavLink to="/exercises" className={({ isActive }) => `group relative flex flex-col items-center justify-center flex-1 h-full rounded-2xl transition-all duration-500 ${isActive ? "text-blue-600 dark:text-blue-500" : "text-zinc-400 dark:text-zinc-600 hover:text-zinc-500"}`}>
                                {({ isActive }) => (
                                    <>
                                        <div className={`relative p-2 rounded-xl transition-all duration-300 ${isActive ? "bg-blue-600/10 scale-110" : ""}`}>
                                            <LuDumbbell size={20} strokeWidth={isActive ? 2.5 : 2} />
                                            {isActive && (
                                                <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-600 rounded-full border-2 border-white dark:border-zinc-950 animate-pulse" />
                                            )}
                                        </div>
                                        <span className={`text-[8px] font-black uppercase tracking-[0.15em] mt-1 italic transition-all ${isActive ? "opacity-100" : "opacity-60"}`}>
                                            Gimnasio
                                        </span>
                                    </>
                                )}
                            </NavLink>

                            {/* Rutinas */}
                            <NavLink to="/routines" className={({ isActive }) => `group relative flex flex-col items-center justify-center flex-1 h-full rounded-2xl transition-all duration-500 ${isActive ? "text-blue-600 dark:text-blue-500" : "text-zinc-400 dark:text-zinc-600 hover:text-zinc-500"}`}>
                                {({ isActive }) => (
                                    <>
                                        <div className={`relative p-2 rounded-xl transition-all duration-300 ${isActive ? "bg-blue-600/10 scale-110" : ""}`}>
                                            <LuClipboardList size={20} strokeWidth={isActive ? 2.5 : 2} />
                                            {isActive && (
                                                <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-600 rounded-full border-2 border-white dark:border-zinc-950 animate-pulse" />
                                            )}
                                        </div>
                                        <span className={`text-[8px] font-black uppercase tracking-[0.15em] mt-1 italic transition-all ${isActive ? "opacity-100" : "opacity-60"}`}>
                                            Rutinas
                                        </span>
                                    </>
                                )}
                            </NavLink>

                            {/* Workouts (Entrenar - El Botón Central destaca un poco más) */}
                            <NavLink to="/workouts" className={({ isActive }) => `group relative flex flex-col items-center justify-center flex-1 h-full rounded-2xl transition-all duration-500 ${isActive ? "text-blue-600 dark:text-blue-500" : "text-zinc-400 dark:text-zinc-600 hover:text-zinc-500"}`}>
                                {({ isActive }) => (
                                    <>
                                        <div className={`relative p-2 rounded-xl transition-all duration-300 ${isActive ? "bg-blue-600/10 scale-110" : ""}`}>
                                            <LuFlame size={20} strokeWidth={isActive ? 2.5 : 2} />
                                            {isActive && (
                                                <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-600 rounded-full border-2 border-white dark:border-zinc-950 animate-pulse" />
                                            )}
                                        </div>
                                        <span className={`text-[8px] font-black uppercase tracking-[0.15em] mt-1 italic transition-all ${isActive ? "opacity-100" : "opacity-60"}`}>
                                            Entrenar
                                        </span>
                                    </>
                                )}
                            </NavLink>

                            {/* Perfil */}
                            <NavLink to="/profile" className={({ isActive }) => `group relative flex flex-col items-center justify-center flex-1 h-full rounded-2xl transition-all duration-500 ${isActive ? "text-blue-600 dark:text-blue-500" : "text-zinc-400 dark:text-zinc-600 hover:text-zinc-500"}`}>
                                {({ isActive }) => (
                                    <>
                                        <div className={`relative p-2 rounded-xl transition-all duration-300 ${isActive ? "bg-blue-600/10 scale-110" : ""}`}>
                                            <LuUser size={20} strokeWidth={isActive ? 2.5 : 2} />
                                            {isActive && (
                                                <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-600 rounded-full border-2 border-white dark:border-zinc-950 animate-pulse" />
                                            )}
                                        </div>
                                        <span className={`text-[8px] font-black uppercase tracking-[0.15em] mt-1 italic transition-all ${isActive ? "opacity-100" : "opacity-60"}`}>
                                            Perfil
                                        </span>
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
