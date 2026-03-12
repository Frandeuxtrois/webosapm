import { API_BASE_URL, API_ENDPOINTS } from './apiConfig';

const getAuthHeaders = () => ({
    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
});

export const afiliadoService = {
    // --- PERFIL Y CREDENCIALES ---
    getPerfil: async () => {
        try {
            const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.PERFIL_DATOS}`, {
                headers: getAuthHeaders()
            });
            if (!res.ok) return null;
            return await res.json();
        } catch {
            return null;
        }
    },

    getCredenciales: async () => {
        try {
            const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.CREDENCIALES}`, {
                headers: getAuthHeaders()
            });
            if (!res.ok) return [];
            const data = await res.json();
            return Array.isArray(data) ? data : [data];
        } catch {
            return [];
        }
    },

    getSaldo: async () => {
        try {
            const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.SALDO}`, {
                headers: getAuthHeaders()
            });
            return res.ok ? await res.json() : { saldo: 0 };
        } catch {
            return { saldo: 0 };
        }
    },

    getCuentaCorriente: async () => {
        try {
            const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.CUENTA_CORRIENTE}`, {
                headers: getAuthHeaders()
            });
            if (!res.ok) return [];
            return await res.json();
        } catch {
            return [];
        }
    },

    generarCuponPago: async (idFactura: string) => {
        try {
            const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.GENERAR_CUPON}`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({ id: idFactura }) // Enviamos el ID de la factura FAB
            });

            if (!res.ok) throw new Error('No se pudo generar el cupón');

            // Retornamos el archivo como un BLOB (Binary Large Object)
            return await res.blob();
        } catch (error) {
            console.error("Error al descargar cupón:", error);
            return null;
        }
    },


    generarToken: async () => {
        try {
            const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.GENERAR_TOKEN}`, {
                headers: getAuthHeaders()
            });
            if (!res.ok) return '';
            const data = await res.json();
            return data?.token || '';
        } catch {
            return '';
        }
    },

    // --- SEGURIDAD (PASSWORD Y EMAIL) ---

    cambiarPassword: async (passwordActual: string, nuevaPassword: string) => {
        try {
            const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.PERFIL_CAMBIAR_PASS}`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({ passwordActual, nuevaPassword })
            });
            const data = await res.json();
            return { ok: res.ok, data };
        } catch {
            return { ok: false, data: { message: 'Error de conexión al servidor' } };
        }
    },

    solicitarCambioEmail: async (nuevoEmail: string) => {
        try {
            const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.PERFIL_SOLICITAR_EMAIL}`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({ nuevoEmail })
            });
            const data = await res.json();
            return { ok: res.ok, data };
        } catch {
            return { ok: false, data: { message: 'Error de conexión al servidor' } };
        }
    },

    confirmarCambioEmail: async (codigo: string) => {
        try {
            const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.PERFIL_CONFIRMAR_EMAIL}`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({ codigo })
            });
            const data = await res.json();
            return { ok: res.ok, data };
        } catch {
            return { ok: false, data: { message: 'Error de conexión al servidor' } };
        }
    }
};