"use client"

import { createContext, useContext, useState, useEffect,  ReactNode } from "react";

interface AuthContextProps {
    token: string | null;
    setToken: (token: string | null) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const savedUserData = localStorage.getItem("userData");
        if (savedUserData) {
            const { token } = JSON.parse(savedUserData);
            if (token) {
                setToken(token);
            }
        }
    }, []);

    const logout = () => {
        setToken(null);
        localStorage.clear();
    }

    return (
        <AuthContext.Provider value={{ token, setToken, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
