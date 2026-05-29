const IS_DEV = import.meta.env.DEV;
export const API_BASE_URL = IS_DEV ? '/api-main/AppOSAPM' : 'https://appapis.apm.org.ar/AppOSAPM';
export const TICKETS_BASE_URL = IS_DEV ? '/api-backoffice' : 'https://osapmapis.apm.org.ar';

export const API_ENDPOINTS = {
    
    LOGIN: '/api/Auth/login',
    REGISTRO: '/api/Auth/registrar',
    REFRESH: '/api/Auth/refresh',
    OLVIDE_CLAVE: '/api/Auth/olvide-clave',
    EJECUTAR_RESET: '/api/Auth/reset-clave',

    
    MI_PERFIL: '/api/Datos/mi-perfil',

    
    CREDENCIALES: '/api/Afiliado/mis-credenciales',
    CUENTA_CORRIENTE: '/api/Afiliado/cuenta-corriente',
    SALDO: '/api/Afiliado/saldo',
    GENERAR_CUPON: '/api/Afiliado/generar-cupon-pago',

    
    PERFIL_DATOS: '/api/Perfil/mis-datos',
    PERFIL_CAMBIAR_PASS: '/api/Perfil/cambiar-password',
    PERFIL_SOLICITAR_EMAIL: '/api/Perfil/solicitar-cambio-email',
    PERFIL_CONFIRMAR_EMAIL: '/api/Perfil/confirmar-cambio-email',

    
    GENERAR_TOKEN: '/api/Afiliado/generar-token-credencial',

    
    NUEVA_CONSULTA: '/api/Info/nueva-consulta',
    MIS_CONSULTAS: '/api/info/mis-consultas',
    RESPONDER_CONSULTA: '/api/Info/responder-consulta',
    NOTICIAS: (idSistema: number) => `/api/Info/noticias/${idSistema}`,
    BORRAR_CHAT: '/api/Info/consulta',         
    BORRAR_MENSAJE: '/api/Info/consulta-mensaje', 

    
    MANUAL_PDF: '/api/Info/manual-pdf',
    MANUAL_EMAIL: '/api/Info/manual-email',


    
    BUSCAR_CARTILLA: '/api/Cartilla/Buscar',

    
    PROVINCIAS: '/api/Parametros/provincias',
    LOCALIDADES: '/api/Parametros/localidades',
    BARRIOS: '/api/Parametros/barrios',
    SECCIONALES: '/api/Parametros/seccionales',
    ESPECIALIDADES: '/api/Parametros/especialidades',
    TIPOS_CARTILLA: '/api/Parametros/tipos-cartilla',

    
    DATOS_UTILES_SECCIONALES: '/api/DatosUtiles/seccionales',
    DATOS_UTILES_FAQ: (tipoId: number) => `/api/DatosUtiles/preguntas-frecuentes/${tipoId}`,

    
    DATOS_UTILES_TELEFONOS: '/api/DatosUtiles/telefonos-utiles',




    
    TICKET_CATEGORIAS: '/api/Ticket/categorias',
    TICKET_CREAR: '/api/Ticket/crear',
    TICKET_MIS_TICKETS: '/api/Ticket/tickets-afiliado',


} as const;

export const API_TIMEOUT = 10000;