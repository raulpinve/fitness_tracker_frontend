import { RiLoader4Fill  } from "react-icons/ri";

const Button = ({ type, loading, colorButton, textButton, onClick, children, className = "" }) => {
  return (
    <button 
        type={type}
        className={`button-form ${className} w-full button-form-${colorButton} ${loading ? "button-form-disabled": ``}`}
        disabled={loading}
        onClick={onClick}
    >
        { loading && <RiLoader4Fill className="animate-spin" />}
        { textButton || children }
    </button>
  )
}

export default Button