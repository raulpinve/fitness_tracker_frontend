import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import axios from "axios";

const baseUrl = import.meta.env.VITE_API_URL;

export function AuthProvider({ children }) {
    const [accessToken, setAccessToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true); 
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");    

        const checkAuth = async () => {
            try {
                const res = await axios.post(`${baseUrl}/auth/autheticate-token`, {}, { headers: { Authorization: `Bearer ${token}` } });
                setAccessToken(token);
                if (res?.data?.data?.user) {
                    setUser(res.data.data.user);
                }
            } catch (err) {
                console.log(err)
                setAccessToken(null);
            } finally {
                setIsLoading(false);
            }
        };
        checkAuth();
    }, []);

    const logout = async () => {
        try {
            localStorage.removeItem("token");
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