import { createContext, useState, useEffect, ReactNode, useContext } from "react";
import { decodeToken } from "../../services/tokenService";
import { getUserById } from "../../services/userService";


interface User {
  isBusiness: boolean | undefined;
  _id: string;
  name?: {
    first?: string;
    middle?: string;
    last?: string;
  };
  email?: string;
  isAdmin?: boolean;
  phone?: string;
  image?: {
    url?: string;
    alt?: string;
  };
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshUser = async () => {
    setIsLoading(true);
    const token = sessionStorage.getItem("token");

    if (!token) {
      setIsLoggedIn(false);
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const decoded = decodeToken(token);
      if (decoded && decoded._id) {
        setIsLoggedIn(true);
        
        try {
          const res = await getUserById(decoded._id);
          if (res.data) {
            setUser(res.data);
            console.log("User data refreshed:", res.data);
          }
        } catch (err) {
          console.error("Error fetching user data:", err);
        }
      } else {
        sessionStorage.removeItem("token");
        setIsLoggedIn(false);
        setUser(null);
      }
    } catch (err) {
      console.error("Token decode error:", err);
      sessionStorage.removeItem("token");
      setIsLoggedIn(false);
      setUser(null);
    }
    
    setIsLoading(false);
  };

  const login = (token: string) => {
    sessionStorage.setItem("token", token);
    refreshUser();
  };

  const logout = () => {
    sessionStorage.removeItem("token");
    setIsLoggedIn(false);
    setUser(null);
    window.location.href = "/";
  };

  // בדיקה ראשונית בטעינת האפליקציה
  useEffect(() => {
    refreshUser();
  }, []);

  const value = {
    user,
    isLoggedIn,
    isLoading,
    login,
    logout,
    refreshUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// הוק שימושי לשימוש ב-AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
export default AuthContext;

