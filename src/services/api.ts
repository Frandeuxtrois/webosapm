import { Plan } from '../types';
import { PLANS } from '../constants';

const OSAM_API_BASE_URL = 'https://appapis.apm.org.ar/AppOSAPM';
export const BACKOFFICE_API_BASE_URL = 'https://osapmapis.apm.org.ar';

export interface PreguntaFrecuente {
  pregunta: string;
  respuesta: string;
}

export interface NoticiaImagen {
  idImagen: number;
  rutaImagen: string;
  epigrafe: string | null;
}

export interface Noticia {
  idNoticia: number;
  idSistema: number;
  titulo: string;
  copete: string;
  cuerpo: string;
  vigenciaDesde: string;
  vigenciaHasta: string;
  publicado: boolean;
  esPublica: boolean;
  imagenes: NoticiaImagen[];
}

// --- PRESTADOR INTERFACES ---

export interface PlanPrestador {
  planId: string;
  planNombre: string;
  fechaDesde: string;
  fechaHasta: string | null;
  ambulatorio: number; // 0=No atiende, 1=Atiende, 2=Requiere autorización
  internacion: number;
  guardia: number;
}

export interface DatoAnexo {
  prestadorDatoaAnexoTipoNombre: string;
  texto: string;
}

export interface DatosPrestador {
  prestadorId: number;
  nombre: string;
  direccion: string;
  localidad: string;
  provinciaNombre: string;
  email: string;
  telefono: string;
  planes: PlanPrestador[];
  datosAnexos: DatoAnexo[];
}

export interface Afiliado {
  apellidoNombre: string;
  planNombre: string;
  seccionalNombre: string;
  estaActivo: boolean;
}

export interface Liquidacion {
  fecha: string;
  comprobante: string;
  importeTotal: number;
  importeAjuste: number;
  importeLiquidado: number;
}

export interface Prestacion {
  codigoApm: string;
  equivalencia: string;
  descripcion: string;
  importe: number;
  plan1KAmb: boolean; plan1KInt: boolean; plan1KGdia: boolean;
  plan3KAmb: boolean; plan3KInt: boolean; plan3KGdia: boolean;
  plan5KAmb: boolean; plan5KInt: boolean; plan5KGdia: boolean;
}

export interface ArchivoPrestador {
  id: number;
  nombreMostrar: string;
  fechaSubida: string;
  tamaño: number;
}

// --- PRESTADOR HELPERS ---

const PRESTADOR_BASE = 'https://appapis.apm.org.ar/AppOSAPM';

const prestadorHeaders = (isJson = true): Record<string, string> => {
  const token = localStorage.getItem('prestador_token') ?? '';
  const h: Record<string, string> = { Authorization: `Bearer ${token}` };
  if (isJson) h['Content-Type'] = 'application/json';
  return h;
};

const tryRefreshPrestador = async (): Promise<boolean> => {
  const cuit = localStorage.getItem('prestador_cuit');
  const rt = localStorage.getItem('prestador_refresh_token');
  if (!cuit || !rt) return false;
  const r = await fetch(`${PRESTADOR_BASE}/api/AuthPrestador/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ CUIT: cuit, RefreshToken: rt })
  });
  if (!r.ok) return false;
  const d = await r.json();
  localStorage.setItem('prestador_token', d.token);
  localStorage.setItem('prestador_refresh_token', d.refreshToken);
  return true;
};

const pfetch = async (url: string, init: RequestInit = {}): Promise<Response> => {
  const isForm = init.body instanceof FormData;
  const go = () => fetch(url, { ...init, headers: { ...prestadorHeaders(!isForm), ...(init.headers as Record<string, string> ?? {}) } });
  const res = await go();
  if (res.status === 401) {
    const ok = await tryRefreshPrestador();
    if (ok) return go();
    localStorage.removeItem('prestador_token');
    localStorage.removeItem('prestador_refresh_token');
    localStorage.removeItem('prestador_cuit');
    throw new Error('SESSION_EXPIRED');
  }
  return res;
};

export const apiService = {
  getPlans: async (): Promise<Plan[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(PLANS), 500);
    });
  },

  submitContactForm: async (data: { name: string; email: string; message: string }) => {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ success: true, message: 'Consulta enviada correctamente.' }), 800);
    });
  },

  getNoticias: async (idSistema: number = 3): Promise<Noticia[]> => {
    const response = await fetch(`${BACKOFFICE_API_BASE_URL}/api/BackOffice/Noticias/${idSistema}?esPublica=true`);
    if (!response.ok) throw new Error(`Error al obtener noticias: ${response.status}`);
    const data = await response.json();
    const items: Noticia[] = Array.isArray(data) ? data : data.noticias ?? data.items ?? [];
    // Fetch detalle de cada noticia en paralelo para obtener copete e imagenes
    const detalles = await Promise.all(items.map((n) => apiService.getNoticiaDetalle(n.idNoticia)));
    return detalles;
  },

  getNoticiaDetalle: async (id: number): Promise<Noticia> => {
    const response = await fetch(`${BACKOFFICE_API_BASE_URL}/api/BackOffice/Noticia/${id}`);
    if (!response.ok) throw new Error(`Error al obtener noticia ${id}: ${response.status}`);
    return response.json();
  },

  getPreguntasFrecuentes: async (tipoId: number = 3): Promise<PreguntaFrecuente[]> => {
    const response = await fetch(`${OSAM_API_BASE_URL}/api/DatosUtiles/preguntas-frecuentes/${tipoId}`);
    if (!response.ok) throw new Error(`Error al obtener preguntas frecuentes: ${response.status}`);
    return response.json();
  },

  submitAffiliationForm: async (data: { nombre: string; email: string; telefono: string; condicion: string; mensaje: string }) => {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ success: true, message: 'Solicitud de afiliación enviada correctamente.' }), 800);
    });
  },

  // --- PRESTADOR METHODS ---

  loginPrestador: async (cuit: string, password: string) => {
    const r = await fetch(`${PRESTADOR_BASE}/api/AuthPrestador/login`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ CUIT: cuit, Password: password })
    });
    if (!r.ok) throw new Error(`${r.status}`);
    return r.json();
  },

  olvideClavePrestador: async (cuit: string, email: string) => {
    const r = await fetch(`${PRESTADOR_BASE}/api/AuthPrestador/olvideClave`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ CUIT: cuit, Email: email })
    });
    if (!r.ok) throw new Error(`${r.status}`);
    return r.json();
  },

  resetClavePrestador: async (cuit: string, token: string, nuevaPassword: string) => {
    const r = await fetch(`${PRESTADOR_BASE}/api/AuthPrestador/resetClave`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ CUIT: cuit, Token: token, NuevaPassword: nuevaPassword })
    });
    if (!r.ok) throw new Error(`${r.status}`);
    return r.json();
  },

  getDatosPrestador: async (): Promise<DatosPrestador> => {
    const r = await pfetch(`${PRESTADOR_BASE}/api/Prestador/getDatosPrestador`);
    if (!r.ok) throw new Error(`${r.status}`);
    return r.json();
  },

  updateDatosPrestador: async (data: { email?: string; telefono?: string; direccion?: string }) => {
    const r = await pfetch(`${PRESTADOR_BASE}/api/Prestador/updateDatos`, {
      method: 'PUT', body: JSON.stringify(data)
    });
    if (!r.ok) throw new Error(`${r.status}`);
    return r.json();
  },

  getLiquidaciones: async (fechaDesde?: string): Promise<Liquidacion[]> => {
    const qs = fechaDesde ? `?fechaDesde=${fechaDesde}` : '';
    const r = await pfetch(`${PRESTADOR_BASE}/api/Prestador/getLiquidaciones${qs}`);
    if (!r.ok) throw new Error(`${r.status}`);
    return r.json();
  },

  getPrestacionesContratadas: async (): Promise<Prestacion[]> => {
    const r = await pfetch(`${PRESTADOR_BASE}/api/Prestador/getPrestacionesContratadas`);
    if (!r.ok) throw new Error(`${r.status}`);
    return r.json();
  },

  descargarTarifario: async () => {
    const r = await pfetch(`${PRESTADOR_BASE}/api/Prestador/getPrestacionesContratadasExcel`);
    if (!r.ok) throw new Error(`${r.status}`);
    const blob = await r.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'tarifario.xlsx'; a.click();
    URL.revokeObjectURL(url);
  },

  descargarTarifarioPorConceptos: async () => {
    const r = await pfetch(`${PRESTADOR_BASE}/api/Prestador/getPrestacionesContratadasConceptoExcel`);
    if (!r.ok) throw new Error(`${r.status}`);
    const blob = await r.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'tarifario-conceptos.xlsx'; a.click();
    URL.revokeObjectURL(url);
  },

  subirArchivos: async (files: File[]) => {
    const fd = new FormData();
    files.forEach(f => fd.append('archivos', f));
    const r = await pfetch(`${PRESTADOR_BASE}/api/Prestador/subirArchivos`, { method: 'POST', body: fd });
    if (!r.ok) throw new Error(`${r.status}`);
    return r.json();
  },

  getArchivos: async (): Promise<ArchivoPrestador[]> => {
    const r = await pfetch(`${PRESTADOR_BASE}/api/Prestador/getArchivos`);
    if (!r.ok) throw new Error(`${r.status}`);
    return r.json();
  },

  deleteArchivo: async (id: number) => {
    const r = await pfetch(`${PRESTADOR_BASE}/api/Prestador/deleteArchivo/${id}`, { method: 'DELETE' });
    if (!r.ok) throw new Error(`${r.status}`);
    return r.json();
  },

  downloadArchivo: async (id: number, nombreMostrar: string) => {
    const r = await pfetch(`${PRESTADOR_BASE}/api/Prestador/downloadArchivo?id=${id}`);
    if (!r.ok) throw new Error(`${r.status}`);
    const blob = await r.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = nombreMostrar; a.click();
    URL.revokeObjectURL(url);
  },

  getAfiliado: async (afiliadoId: string, parentescoId: number): Promise<Afiliado> => {
    const r = await pfetch(`${PRESTADOR_BASE}/api/Prestador/getAfiliado?afiliadoId=${afiliadoId}&parentescoId=${parentescoId}`);
    if (!r.ok) throw new Error(`${r.status}`);
    return r.json();
  },

  enviarMensaje: async (asunto: string, mensaje: string, archivoIds: number[]) => {
    const r = await pfetch(`${PRESTADOR_BASE}/api/Prestador/enviarMensaje`, {
      method: 'POST', body: JSON.stringify({ asunto, mensaje, archivoIds })
    });
    if (!r.ok) throw new Error(`${r.status}`);
    return r.json();
  },
};
