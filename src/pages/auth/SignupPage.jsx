import { LuEye, LuEyeOff} from "react-icons/lu"
import { handleErrors } from "../../utils/handleErrors"
import { Link, useNavigate } from "react-router-dom"
import Button from "../../shared/components/Button"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { IoFitnessOutline } from "react-icons/io5"
import { useAuth } from "../../auth/useAuth"
import { useAuthServices } from "../../services/auth.service"

const SignupPage = () => {
    const { register, handleSubmit, setError, formState: { errors }, setValue } = useForm({ mode: "onChange"});
    const [mostrarPassword, setMostrarPassword] = useState(false);
    const [ messageError, setMessageError] = useState(null);
    const [ loading, setLoading ] = useState(false);
    const { setAccessToken, setUser } = useAuth();
    const navigate = useNavigate();
    const { signUp } = useAuthServices();
    
    const onSubmit = async (data) => {
        setLoading(true);
        setMessageError(null);

        try {
            const resultado = await signUp(data)
            setAccessToken(resultado?.data?.accessToken);
            setUser(resultado?.data?.user);
            navigate("/exercises");
        } catch (error) {
            if(error === "errorInterno"){
              setMessageError("Ha ocurrido un error interno. Por favor, inténtalo nuevamente.")
            }else{
              handleErrors(error, setError, setMessageError)
            }
        }finally{
          setLoading(false)
        }
    }

    useEffect(() => {
        setValue("firstName", "Raul");
        setValue("lastName", "García");
        setValue("email", "raulpinve@gmail.com");
        setValue("username", "raulpinve");
        setValue("password", "Raul1234!");
    }, [])

    // Establece el modo nocturno en caso de que este activado por el usuario
    return (
        <div className='h-screen flex items-center justify-center'>
            <div className="flex flex-col p-4 justify-center flex-1 w-full max-w-md mx-auto">
                <h1 className="mb-2 font-bold text-gray-800 text-title-sm dark:text-white/90 text-3xl text-center justify-center flex items-center gap-2"><IoFitnessOutline /> Fitness tracker</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Crea una cuenta ingresando tu nombre de usuario, correo y una contraseña segura.</p>

                {/* Formulario para iniciar sesión */}
                <form action="" className="gap-2 mt-6 text-sm text-gray-600 dark:text-white" onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                    <div className="lg:flex gap-2">
                        {/* Primer nombre */}
                        <div>
                            <label htmlFor="firstName" className="font-semibold">Primer nombre <span className="text-red-600">*</span></label>
                            <input type="text" 
                                className={`${(errors.firstName && errors.firstName.message) ? "input-form-error": ""} input-form`}
                                {...register("firstName", {
                                        required: {value: true, message:"Debe escribir un nombre."}, 
                                        minLength: {value: 2, message: "El nombre debe tener al menos dos caracteres."},
                                        maxLength: {value: 30, message: "El nombre no puede tener más de 30 caracteres."}
                                    })
                                }
                                id="firstName"
                            />
                            {(errors.firstName && errors.firstName.message ) && (
                                <p className="input-message-error">{errors.firstName.message}</p>
                            )}
                        </div>

                        {/* lastName */}
                        <div>
                            <label htmlFor="lastName" className="font-semibold">lastName <span className="text-red-600">*</span></label>
                            <input
                                className={`${(errors.lastName && errors.lastName.message) ? "input-form-error": ""} input-form`}
                                type="text"
                                {...register("lastName", {
                                    required: {value: true, message:"Debe escribir los lastName."}, 
                                    minLength: {value: 2, message: "Los apellidos deben tener al menos dos caracteres."},
                                    maxLength: {value: 60, message: "Los apellidos no pueden tener más de 60 caracteres."}
                                })}
                                id="lastName"
                            />
                            {(errors.lastName && errors.lastName.message ) && (
                                <p className="input-message-error">{errors.lastName.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label htmlFor="" className="font-semibold">E-mail <span className="text-red-600">*</span></label>
                        <input 
                            className={`${errors.email ? "input-form-error": ""} input-form`}
                            {...register("email", {
                                required: {value: true, message: "Debe escribir correo electrónico"}, 
                                pattern: {
                                    value: /^(?!\.)[a-zA-Z0-9._%+-]+@(?!-)[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                    message: "Escriba un correo electrónico válido."
                                }
                            })}
                            type="email" 
                            id="email"
                        />
                        {(errors.email && errors.email.message ) && (
                            <p className="input-message-error">{errors.email.message}</p>
                        )}
                    </div>

                    {/* Username */}
                    <div>
                        <label htmlFor="username" className="font-semibold">Username <span className="text-red-600">*</span></label>
                        <input 
                            className={`${errors.username ? "input-form-error": ""} input-form`}
                            type="text" 
                            id="username"
                            {...register("username", {
                                required: {value: true, message: "El username debe tener entre 3 y 20 caracteres y solo puede contener letras, números y guiones bajos."}, 
                                pattern: {
                                    value: /^[a-zA-Z0-9_]{3,20}$/,
                                    message: "El username debe tener entre 3 y 20 caracteres y solo puede contener letras, números y guiones bajos."
                                }
                            })}
                        />
                        {(errors.username && errors.username.message ) && (
                            <p className="input-message-error">{errors.username.message }</p>
                        )}
                    </div>

                    {/* Contraseña */}
                    <div>
                        <label htmlFor="password" className="font-semibold">Contraseña <span className="text-red-600">*</span></label>
                        <div className="relative">
                            <input 
                                className={`${errors.password ? "input-form-error": ""} input-form`}
                                type={mostrarPassword ? "text" : "password"}
                                {...register("password", {
                                    required: {value: true, message: "La contraseña debe tener al menos una letra mayúscula, un número, un carácter especial y tener entre 8 y 20 caracteres de longitud."},
                                    pattern: {
                                        value: /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-={}[\]:;""<>,.?\\/]).{8,20}$/,
                                        message: "La contraseña debe tener al menos una letra mayúscula, un número, un carácter especial y tener entre 8 y 20 caracteres de longitud."
                                    }
                                })}
                            />
                            <button 
                                className="absolute z-30 text-gray-500 -translate-y-1/2 cursor-pointer right-4 top-1/2 dark:text-gray-400"
                                type="button"    
                                onClick={() => setMostrarPassword(prev => !prev)}
                            >
                                {mostrarPassword ? <LuEyeOff /> : <LuEye />}
                            </button>
                        </div>
                        {(errors.password && errors.password.message ) && (
                            <p className="input-message-error">{errors.password.message}</p>
                        )}
                    </div>

                    {messageError && 
                        <p className="message-error">
                            {messageError}
                        </p>
                    }
                    <Button type="submit" loading={loading} className="my-3" colorButton="primary" textButton="Registrarse"/>
                    <p className="text-sm text-gray-600 dark:text-white">¿Ya tienes una cuenta creada? <Link to="/login" className="text-indigo-700 dark:text-white underline">Loguéate aquí</Link></p>
                </form>
            </div>
        </div>
    )
}
export default SignupPage