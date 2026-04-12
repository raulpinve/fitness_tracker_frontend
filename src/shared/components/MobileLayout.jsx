import { HiOutlineLogout } from "react-icons/hi";
import { LuClipboardList, LuDumbbell, LuFlame } from "react-icons/lu";
import { NavLink, Outlet } from "react-router-dom";

export default function MobileLayout() {
  
    return (
        // Contenedor principal con fondo Zinc-950 (más profundo) para el modo oscuro
        <div className="max-w-md mx-auto h-screen flex flex-col border border-slate-200 dark:border-zinc-800 dark:bg-zinc-950 relative">
            <main className="flex-1 overflow-y-auto pb-20">
               <Outlet />
            </main>
            
            {/* Nav con fondo Zinc-900 para crear jerarquía sobre el fondo principal */}
            <nav className="h-16 bg-white border-t fixed bottom-0 w-full max-w-md border-gray-200 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex justify-around items-center h-full">
                  <NavLink
                        to="/exercises"
                        className={({ isActive }) =>
                            `flex flex-col items-center text-xs transition-all duration-200 ${
                                isActive ? "text-blue-600 scale-110" : "text-gray-600 dark:text-zinc-400"
                            }`
                        }
                    >
                        <LuDumbbell size={20} />
                        <span>Ejercicios</span>
                    </NavLink>

                    <NavLink
                        to="/routines"
                        className={({ isActive }) =>
                            `flex flex-col items-center text-xs transition-all duration-200 ${
                            isActive ? "text-blue-600 scale-110" : "text-gray-600 dark:text-zinc-400"
                            }`
                        }
                    >
                        <LuClipboardList size={20} /> 
                        <span>Rutinas</span>
                    </NavLink>

                    <NavLink
                        to="/workouts"
                        className={({ isActive }) =>
                            `flex flex-col items-center text-xs transition-all duration-200 ${
                            isActive ? "text-blue-600 scale-110" : "text-gray-600 dark:text-zinc-400"
                            }`
                        }
                    >
                        <LuFlame size={20} />
                        <span>Workouts</span>
                    </NavLink>

                    <button className="flex flex-col items-center text-xs text-gray-600 dark:text-zinc-400 hover:text-red-500 transition">
                        <HiOutlineLogout size={20} />
                        <span>Salir</span>
                    </button>
                </div>
            </nav>
        </div>
    );
};
