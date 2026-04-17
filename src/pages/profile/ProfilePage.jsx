import React, { useEffect, useState } from 'react';
import Header from '../../shared/components/Header';
import { useAuth } from '../../auth/useAuth';
import { LuMoon, LuSun, LuLogOut, LuChevronRight } from 'react-icons/lu';
import { useDarkMode } from '../../shared/hooks/useDarkMode';
import { useUserServices } from '../../services/users.service';
import BottomSheet from '../../shared/components/BottomSheet';
import ProfileEditForm from './components/ProfileEditForm';
import { toast } from 'sonner';

const ProfilePage = () => {
    const [stats, setStats] = useState({ totalWorkouts: 0, currentStreak: 0 });
    const [openEditSheet, setOpenEditSheet] = useState();
    const { isDark, toggleDarkMode } = useDarkMode();
    const { getUserStats } = useUserServices();
    const { user, logout } = useAuth();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await getUserStats(); 
                setStats(res.data);
            } catch {
                toast.error("Error al cargar estadísticas");
            }
        };
        fetchStats();
    }, []);

    const nombreCompleto = `${user?.firstName} ${user?.lastName}`;
    
    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pt-6 pb-20">
            {/* <Header title="Mi Perfil" /> */}

            <div className="p-4 space-y-6 max-w-md mx-auto">
                
                {/* 1. Card de Usuario: El "Hero" de la página */}
                <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-6 shadow-sm border border-zinc-100 dark:border-zinc-800 flex flex-col items-center text-center">
                    <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white text-4xl font-black italic shadow-lg shadow-blue-500/20 mb-4 border-4 border-white dark:border-zinc-900 transition-transform active:scale-95">
                        {user?.firstName?.charAt(0) || 'A'}
                    </div>
                    <h2 className="text-xl font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-tighter">
                        {nombreCompleto || "Atleta Elite"}
                    </h2>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.3em] mt-1">
                        {user?.username || "Usuario"}
                    </p>
                </div>
                <button 
                    onClick={() => setOpenEditSheet(true)}  
                    className="mt-4 px-6 py-2 cursor-pointer bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-[10px] font-black uppercase tracking-widest rounded-xl border border-zinc-200 dark:border-zinc-700 active:scale-95 transition-all"
                >
                    Editar Perfil
                </button>

                {/* 2. Sección de Estadísticas Rápidas (Placeholders para el futuro) */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white dark:bg-zinc-900 p-4 rounded-3xl border border-zinc-100 dark:border-zinc-800">
                        <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest mb-1">Entrenamientos</p>
                        <p className="text-xl font-black text-zinc-800 dark:text-zinc-100">
                            {stats.totalWorkouts}
                        </p>
                    </div>
                    <div className="bg-white dark:bg-zinc-900 p-4 rounded-3xl border border-zinc-100 dark:border-zinc-800">
                        <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest mb-1">Racha Días</p>
                        <p className="text-xl font-black text-zinc-800 dark:text-zinc-100">
                            {stats.currentStreak} {stats.currentStreak > 0 ? '🔥' : '❄️'}
                        </p>
                    </div>
                </div>

                {/* 3. Menú de Ajustes */}
                <div className="space-y-2">
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] ml-4 mb-2">Preferencias</p>
                    
                    {/* Switch de Modo Oscuro */}
                    <button 
                        onClick={toggleDarkMode}
                        className="w-full flex items-center justify-between p-4 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 active:scale-[0.98] transition-all"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 dark:text-zinc-400">
                                {isDark ? <LuMoon size={18} /> : <LuSun size={18} />}
                            </div>
                            <span className="text-xs font-black text-zinc-700 dark:text-zinc-200 uppercase tracking-widest">Modo Oscuro</span>
                        </div>
                        <div className={`w-10 h-5 rounded-full transition-colors relative ${isDark ? 'bg-blue-600' : 'bg-zinc-300'}`}>
                            <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${isDark ? 'left-6' : 'left-1'}`} />
                        </div>
                    </button>

                    {/* Botón de Logout */}
                    <button 
                        onClick={logout}
                        className="w-full flex items-center justify-between p-4 bg-red-50/50 dark:bg-red-950/10 rounded-2xl border border-red-100/50 dark:border-red-900/20 active:scale-[0.98] transition-all group"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600">
                                <LuLogOut size={18} />
                            </div>
                            <span className="text-xs font-black text-red-600 uppercase tracking-widest">Cerrar Sesión</span>
                        </div>
                        <LuChevronRight className="text-red-300 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>

            <BottomSheet open={openEditSheet} onClose={() => setOpenEditSheet(false)}>
                <ProfileEditForm onCancel={() => setOpenEditSheet(false)} />
            </BottomSheet>
        </div>
    );
};

export default ProfilePage;
