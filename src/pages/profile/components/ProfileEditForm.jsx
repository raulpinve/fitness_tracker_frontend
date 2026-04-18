import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Button from '../../../shared/components/Button';
import MessageError from '../../../shared/components/MessageError';
import { useAuth } from '../../../auth/useAuth';
import { useUserServices } from '../../../services/users.service';
import { toast } from 'sonner';
import { handleErrors } from '../../../utils/handleErrors';

const ProfileEditForm = ({ onCancel }) => {
    const { user, setUser } = useAuth(); 
    const { updateUserInfo } = useUserServices();
    const [loading, setLoading] = useState(false);
    const [messageError, setMessageError] = useState(null);

    const { register, handleSubmit, setError } = useForm({
        defaultValues: {
            firstName: user?.firstName || "",
            lastName: user?.lastName || "",
            username: user?.username || "",
            email: user?.email || ""
        }
    });

    const onSubmit = async (data) => {
        setLoading(true);
        setMessageError(null);
        try {
            const res = await updateUserInfo(data);
            setUser(res.data); 
            
            toast.success("Perfil actualizado con éxito");
            onCancel(); 
        } catch (error) {
            handleErrors(error, setError, setMessageError);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto max-h-[85vh] overflow-y-auto no-scrollbar">
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5 pb-10" autoComplete="off">
                <div className="text-center mb-6">
                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-1">Configuración</p>
                    <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-100">Editar Perfil</h3>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                        <label className="label-form">Nombre</label>
                        <input {...register("firstName", { required: true })} className="input-form" placeholder="Nombre" />
                    </div>
                    <div className="space-y-1">
                        <label className="label-form">Apellido</label>
                        <input {...register("lastName", { required: true })} className="input-form" placeholder="Apellido" />
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="space-y-1">
                        <label className="label-form">Nombre de usuario</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 font-bold text-xs">@</span>
                            <input {...register("username", { required: true })} className="input-form pl-9" placeholder="usuario" />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="label-form">Correo electrónico</label>
                        <input 
                            type="email" 
                            {...register("email", { required: true })} 
                            className="input-form" 
                            placeholder="correo@ejemplo.com" 
                        />
                    </div>
                </div>
                {messageError && <MessageError>{messageError}</MessageError>}
                <div className="pt-2">
                    <Button 
                        colorButton="primary" 
                        type="submit" 
                        loading={loading}
                        className="w-full"
                    >
                        ACTUALIZAR DATOS
                    </Button>
                    <button 
                        type="button"
                        onClick={onCancel}
                        className="w-full py-4 text-zinc-400 dark:text-zinc-500 font-bold text-[10px] uppercase tracking-widest active:bg-zinc-50 dark:active:bg-zinc-800/50 rounded-2xl mt-2 transition-colors"
                    >
                        CANCELAR
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProfileEditForm;
