import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function ProtectedRoute() {
    const { accessToken, loading } = useAuth();

    if (loading) {
      return (
        <div className="flex justify-center items-center h-screen">
          <AiOutlineLoading3Quarters className="animate-spin text-blue-600 text-4xl" />
        </div>
      );
    }
    return accessToken 
      ? <Outlet />
      : <Navigate to="/login" />;
  }