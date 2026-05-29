import { apiClient } from './apiClient';
import { API_ENDPOINTS, TICKETS_BASE_URL } from './apiConfig';

export const cartillaService = {
    
    getParametrosBusqueda: async () => {
        try {
            const [tipos, provs, seccionales] = await Promise.all([
                apiClient.get(API_ENDPOINTS.TIPOS_CARTILLA),
                apiClient.get(API_ENDPOINTS.PROVINCIAS),
                apiClient.get(API_ENDPOINTS.SECCIONALES)
            ]);
            return {
                tiposCartilla: tipos.data,
                provincias: provs.data,
                seccionales: seccionales.data
            };
        } catch (error) {
            console.error("Error cargando parámetros de cartilla", error);
            return null;
        }
    },

    
    getEspecialidades: async (tipoId: number) => {
        try {
            const res = await apiClient.get(`${API_ENDPOINTS.ESPECIALIDADES}?prestadorTipo=${tipoId}`);
            return res.data;
        } catch (error) {
            return [];
        }
    },

    
    getLocalidades: async (provId: string) => {
        try {
            const id = provId === "C" ? "caba" : provId;
            const res = await apiClient.get(`${API_ENDPOINTS.LOCALIDADES}?provinciaId=${id}`);
            return res.data;
        } catch (error) {
            return [];
        }
    },

    
    buscar: async (payload: any) => {
        try {
            const res = await apiClient.post(API_ENDPOINTS.BUSCAR_CARTILLA, payload);
            return Array.isArray(res.data) ? res.data : (res.data?.data || []);
        } catch (error) {
            return [];
        }
    },

};