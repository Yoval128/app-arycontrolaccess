import React, {createContext, useState, useContext, ReactNode} from "react";

interface User {
    role: "administrador" | "empleado" | "invitado" | null;
    token: string | null;
    email: string | null;
}


interface AuthContextType {
    user: User;
    login: (role: User["role"], token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Proveedor del contexto
export const AuthProvider = ({children}: { children: ReactNode }) => {
    const [user, setUser] = useState<User>({role: null, token: null});

    const login = (role: User["role"], token: string, email: string) => {
        setUser({role, token, email});
    };


    const logout = () => {
        setUser({role: null, token: null});
    };

    return (
        <AuthContext.Provider value={{user, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook personalizado para acceder al contexto
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth debe usarse dentro de un AuthProvider");
    }
    return context;
};
