import { HiOutlineArrowLeft } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

export default function Header({
    title,
    showBack = false,
    rightAction = null,
    center = true,
}) {
    const navigate = useNavigate();

    return (
        <header className="h-14 flex items-center justify-between border-b border-gray-200 bg-white px-4">
            {/* Left */}
            <div className="w-10 flex items-center">
                {showBack && (
                    <button
                        onClick={() => navigate(-1)}
                        className="text-gray-600 text-xl cursor-pointer"
                    >
                        <HiOutlineArrowLeft />
                    </button>
                )}
            </div>

            {/* Title */}
            <div className={`flex-1 ${center ? "text-center" : ""}`}>
                <h1 className="font-semibold text-lg text-gray-800 truncate"> {title}</h1>
            </div>

            {/* Right */}
            <div className="flex w-10 justify-end">
                {rightAction}
            </div>
        </header>
  );
}