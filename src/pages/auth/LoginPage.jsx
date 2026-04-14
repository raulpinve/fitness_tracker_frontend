import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../auth/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../shared/components/Button';
import { handleErrors } from '../../utils/handleErrors';
import { IoFitnessOutline } from 'react-icons/io5';
import { useAuthServices } from '../../services/auth.service';
import MessageError from '../../shared/components/MessageError';

const LoginPage = () => {
    const { register, handleSubmit, setError, formState: { errors }, setValue } = useForm({ mode: "onChange" });
    const [ messageError, setMessageError ] = useState(null);
    const { setAccessToken } = useAuth();
    const [ loadingPage, setLoadingPage ] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuthServices();
    
    const onSubmit = async (data) => {
        setMessageError(false)
        setLoadingPage(true)
        try {
            const resultado = await login(data)
            setAccessToken(resultado.data.accessToken);
            navigate("/exercises");
        } catch (error) {
            if(error === "errorInterno"){
                setMessageError("Ha ocurrido un error interno. Por favor, inténtalo nuevamente.")
            }else{
                handleErrors(error, setError, setMessageError)
            }
        } finally {
            setLoadingPage(false)
        }
    }
    useEffect(() => {
        setValue("username", "raulpinve");
        setValue("password", "Raul1234!");
    }, [])

    return (
        <div className='h-screen flex items-center justify-center'>
            <div className="flex flex-col p-4 justify-center flex-1 w-full max-w-md mx-auto">
                <h1 className="mb-2 font-bold text-gray-800 text-title-sm dark:text-white/90 text-3xl text-center justify-center flex items-center gap-2"><IoFitnessOutline /> Fitness tracker</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Ingresa tu nombre de usuario y contraseña para iniciar sesión</p>

                {/* Formulario para iniciar sesión */}
                <form
                    action=""
                    className="flex flex-col gap-2 text-sm text-gray-600 dark:text-white mt-6"
                    onSubmit={handleSubmit(onSubmit)}
                    autoComplete="off"
                >
                    {/* Username */}
                    <div>
                        <label htmlFor="username" className="font-semibold">
                        Username <span className="text-red-600">*</span>
                        </label>
                        <input
                            className={`${ errors.username ? "input-form-error" : ""} input-form`}
                            type="text"
                            id="username"
                            {...register("username", {
                                required: {
                                    value: true,
                                    message: "El username debe tener entre 3 y 20 caracteres y solo puede contener letras, números y guiones bajos.",
                                },
                                pattern: {
                                    value: /^[a-zA-Z0-9_]{3,20}$/,
                                    message: "El username debe tener entre 3 y 20 caracteres y solo puede contener letras, números y guiones bajos.",
                                },
                            })}
                        />
                        {errors.username && errors.username.message && (
                            <p className="input-message-error">{errors.username.message}</p>
                        )}
                    </div>
                        
                    {/* Password */}
                    <div>
                        <label htmlFor="password" className="font-semibold">
                        Contraseña <span className="text-red-600">*</span>
                        </label>
                        <input
                            className={`${ errors.password ? "input-form-error" : ""}  input-form`}
                            type="password"
                            id="password"
                            {...register("password", {
                                required: {
                                    value: true,
                                    message:"La contraseña debe tener al menos una letra mayúscula, un número, un carácter especial y tener entre 8 y 20 caracteres de longitud.",
                                },
                                pattern: {
                                    value: /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-={}[\]:;""<>,.?\\/]).{8,20}$/,
                                    message: "La contraseña debe tener al menos una letra mayúscula, un número, un carácter especial y tener entre 8 y 20 caracteres de longitud.",
                                },
                            })}
                        />
                        {errors.password && errors.password.message && (
                            <p className="input-message-error">{errors.password.message}</p>
                        )}
                    </div>
                    {/* Mensaje de error general */}
                    {messageError && <MessageError>{messageError}</MessageError>}
{/* 
                    <Link to="/solicitar-restablecer-contrasena" className="text-indigo-700 underline dark:text-white">
                        ¿Olvidó su contraseña?
                    </Link>
                     */}
                    <Button
                        type="submit"
                        loading={loadingPage}
                        colorButton="primary"
                        textButton="Iniciar sesión"
                    />
                        <p className="text-sm text-gray-600 dark:text-white">
                    </p>
                                        
                    <p className="text-sm text-gray-600 dark:text-white">
                        ¿Aún no tienes una cuenta? {" "}
                        <Link to="/signup" className="text-indigo-700 underline dark:text-white">
                            Registrate aquí
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;