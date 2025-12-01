import React, {
    createContext,
    useState,
    useContext,
    ReactNode,
    useEffect
} from "react";
import { ApiWebURL } from "../utils/Index";
import { useNavigate } from "react-router-dom";

// TIPOS
export type UserRole = "ADMIN" | "COLAB";

interface UserType {
    id: number;
    email: string;
    rol: UserRole;   // <-- NOMBRE UNIFICADO
    createdAt: string;
    updatedAt: string;
}

interface AuthContextType {
    user: UserType | null;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    setUser: React.Dispatch<React.SetStateAction<UserType | null>>;
}

// CONTEXTO
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<UserType | null>(null);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    // Recuperar sesión al cargar
    useEffect(() => {
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (token && storedUser) {
            try {
                const parsedUser: UserType = JSON.parse(storedUser);
                setUser(parsedUser);
            } catch {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
            }
        }
        setLoading(false);
    }, []);

    // LOGIN
    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            const response = await fetch(`${ApiWebURL}api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) return false;

            const data = await response.json();

            const userClean: UserType = {
                id: data.user.id,
                email: data.user.email,
                rol: data.user.rol,  // <-- CAMBIO CORRECTO
                createdAt: data.user.createdAt,
                updatedAt: data.user.updatedAt,
            };

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(userClean));

            setUser(userClean);

            return true;

        } catch (err) {
            console.error("Error:", err);
            return false;
        }
    };

    // LOGOUT
    const logout = () => {
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login", { replace: true });
    };

    if (loading) return <div>Cargando sesión...</div>;

    return (
        <AuthContext.Provider value={{ user, login, logout, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

// HOOK
export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
    return ctx;
};
