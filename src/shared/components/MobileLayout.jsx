import { HiOutlineLogout } from "react-icons/hi";
import { LuClipboardList, LuDumbbell, LuFlame, LuLogOut } from "react-icons/lu";
import { NavLink, Outlet } from "react-router-dom";
import BottomSheet from "./BottomSheet";

export default function MobileLayout() {
  
    return (
        <div className="max-w-md mx-auto h-screen flex flex-col  border border-gray-200 relative">
            <main className="flex-1 overflow-y-auto pb-20">
               <Outlet />
            </main>
            <nav className="h-16 bg-white border-t fixed bottom-0 w-full max-w-md border-gray-200">
                <div className="flex justify-around items-center h-full">
                  <NavLink
                        to="/exercises"
                        className={({ isActive }) =>
                            `flex flex-col items-center text-xs transition-all duration-200 ${
                                isActive ? "text-blue-600 scale-110" : "text-gray-600"
                            }`
                        }
                    >
                        <LuDumbbell size={20} />Ejercicios
                    </NavLink>
                    <NavLink
                        to="/routines"
                        className={({ isActive }) =>
                            `flex flex-col items-center text-xs transition-all duration-200 ${
                            isActive ? "text-blue-600 scale-110" : "text-gray-600"
                            }`
                        }
                    >
                        <LuClipboardList size={20} /> Rutinas
                    </NavLink>
                    <NavLink
                        to="/workouts"
                        className={({ isActive }) =>
                            `flex flex-col items-center text-xs transition-all duration-200 ${
                            isActive ? "text-blue-600 scale-110" : "text-gray-600"
                            }`
                        }
                    >
                        <LuFlame size={20} />
                        Workouts
                    </NavLink>
                    <button className="flex flex-col items-center text-xs text-gray-600 hover:text-red-500 transition">
                        <HiOutlineLogout size={20} />
                        Salir
                    </button>
                </div>
            </nav>
            {/* <BottomSheet open={open} onClose={() => setOpen(false)}>
               <button className="py-2">Editar</button>
               <button className="py-2 text-red-500">Eliminar</button>
            </BottomSheet>  */}
           </div>
    );
}