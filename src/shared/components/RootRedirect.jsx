import { Navigate } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";

export default function RootRedirect() {
  const { accessToken, loading } = useAuth();

  if (loading) return <p>Cargando...</p>;

  return accessToken
    ? <Navigate to="/exercises" />
    : <Navigate to="/login" />;
}