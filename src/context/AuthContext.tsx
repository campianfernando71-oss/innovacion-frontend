import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { ApiWebURL } from "../utils/Index";
import { useNavigate } from "react-router-dom";

export type UserRole = "ADMIN" | "TECNICO" | "CLIENTE";

interface UserType {
    id: number;
    email: string;
    role: UserRole;
    createdAt: string;
    updatedAt: string;
}

interface AuthContextType {
    user: UserType | null;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    setUser: React.Dispatch<React.SetStateAction<UserType | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<UserType | null>(null);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();     // <-- CORRECTO

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

    // Login
    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            const response = await fetch(`${ApiWebURL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) return false;

            const data = await response.json();

            const userClean: UserType = {
                id: data.user.id,
                email: data.user.email,
                role: data.user.role,
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

    // Logout corregido
    const logout = () => {
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login", { replace: true });  // <-- FUNCIONAL
    };

    if (loading) return <div>Cargando sesión...</div>;

    return (
        <AuthContext.Provider value={{ user, login, logout, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
    return ctx;
};
