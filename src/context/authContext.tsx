import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { afiliadoService } from '../services/afiliadoService';
import { API_BASE_URL, API_ENDPOINTS } from '../services/apiConfig';
import { UserDecoded } from '../types';

interface AuthContextType {
    user: UserDecoded | null;
    isLoggedIn: boolean;
    loading: boolean;
    login: (dni: string, pass: string) => Promise<{ ok: boolean; data: any }>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserDecoded | null>(null);
    const [loading, setLoading] = useState(true);

    // Chequeo inicial de sesión (Persistencia)
    useEffect(() => {
        const initAuth = async () => {
            const token = authService.getToken();
            if (token) {
                const perfil = await afiliadoService.getPerfil();
                const identity = authService.processIdentity(token, perfil);
                setUser(identity);
            }
            setLoading(false);
        };
        initAuth();
    }, []);

    // Función de Login que sincroniza toda la App
    const login = async (dni: string, pass: string) => {
        const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.LOGIN}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ dni, password: pass }),
        });

        const data = await response.json();

        if (response.ok && data.token) {
            authService.saveToken(data.token);
            // Traemos perfil para nombres prolijos
            const perfil = await afiliadoService.getPerfil();
            const identity = authService.processIdentity(data.token, perfil);

            // ACTUALIZACIÓN INSTANTÁNEA DEL ESTADO
            setUser(identity);
            return { ok: true, data };
        }
        return { ok: false, data };
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{
            user,
            isLoggedIn: !!user,
            loading,
            login,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth error');
    return context;
};