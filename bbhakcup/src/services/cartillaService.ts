import { apiClient } from './apiClient';
import { API_ENDPOINTS } from './apiConfig';

export const cartillaService = {
    // Trae los parámetros (provincias, tipos de cartilla, seccionales)
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

    // Trae especialidades filtradas por tipo de prestador
    getEspecialidades: async (tipoId: number) => {
        try {
            const res = await apiClient.get(`${API_ENDPOINTS.ESPECIALIDADES}?prestadorTipo=${tipoId}`);
            return res.data;
        } catch (error) {
            return [];
        }
    },

    // Trae localidades filtradas por provincia
    getLocalidades: async (provId: string) => {
        try {
            const id = provId === "C" ? "caba" : provId;
            const res = await apiClient.get(`${API_ENDPOINTS.LOCALIDADES}?provinciaId=${id}`);
            return res.data;
        } catch (error) {
            return [];
        }
    },

    // Realiza la búsqueda final
    buscar: async (payload: any) => {
        try {
            const res = await apiClient.post(API_ENDPOINTS.BUSCAR_CARTILLA, payload);
            // Retornamos el array de resultados
            return Array.isArray(res.data) ? res.data : (res.data?.data || []);
        } catch (error) {
            return [];
        }
    }
};