// src/services/authService.ts
import { UserDecoded } from '../types';

export const authService = {
    getToken: () => localStorage.getItem('auth_token'),
    saveToken: (token: string) => localStorage.setItem('auth_token', token),
    logout: () => localStorage.removeItem('auth_token'),

    decodeToken: (token: string): any => {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
                window.atob(base64).split('').map(c =>
                    '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
                ).join('')
            );
            return JSON.parse(jsonPayload);
        } catch (e) {
            return null;
        }
    },

    processIdentity: (token: string, perfilData: any = null): UserDecoded | null => {
        const decoded = authService.decodeToken(token);
        if (!decoded) return null;

        // Lógica 099 -> 001 que pediste
        const rawSeccional = String(decoded.SeccionalId || "001").trim();
        const seccional_app = rawSeccional === "099" ? "001" : rawSeccional;

        return {
            dni: decoded.nameid,             // Del Token
            afiliadoId: decoded.AfiliadoId,   // Del Token
            planId: decoded.PlanId,           // Del Token
            seccionalId: seccional_app,       // Del Token procesado
            nombre: perfilData?.apellidoNombre || `Usuario ${decoded.nameid}`, // De la API o el DNI
            planNombre: perfilData?.planDescrip || `Plan ${decoded.PlanId}`,  // De la API o el ID
            exp: decoded.exp
        };
    }
};