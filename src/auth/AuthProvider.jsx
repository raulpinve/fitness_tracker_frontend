import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import axios from "axios";

const baseUrl = import.meta.env.VITE_API_URL;

export function AuthProvider({ children }) {
    const [accessToken, setAccessToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true); 
    const [user, setUser] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await axios.post(`${baseUrl}/auth/refresh`, {}, { withCredentials: true });
                setAccessToken(res?.data?.data?.accessToken);
                if (res?.data?.data?.user) {
                    setUser(res.data.data.user);
                }
            } catch (err) {
                setAccessToken(null);
            } finally {
                setIsLoading(false);
            }
        };
        checkAuth();
    }, []);

    const logout = async () => {
        try {
            await fetch(`${baseUrl}/auth/logout`, {
                method: "POST",
                credentials: "include"
            });
        } catch (err) {
            console.log("Error logout", err);
        } finally {
            setAccessToken(null);
            setUser(null);
        }
    };
    return (
      <AuthContext.Provider 
        value={{ 
          accessToken, 
          setAccessToken,
          user,
          setUser,
          loading: isLoading,
          logout 
        }}
      >
        {!isLoading && children}
      </AuthContext.Provider>
    );
}