import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import {
    Accessibility, Info, User, Stethoscope, FileText, ClipboardList, MessageCircle,
    CheckCircle2, Download, AlertTriangle, ZoomIn, ZoomOut, Plus, Minus, Phone, Mail, Clock,
    Send, X, Eye, Building2, Bus, School, GraduationCap, Baby, HeartPulse, Home, Receipt,
    ShieldAlert, BadgeCheck, ArrowRight, Scale, RefreshCw, IdCard
} from 'lucide-react';

const FONT_SIZES = [14, 16, 18, 20, 22];
const FONT_LABELS = ['XS', 'S', 'M', 'L', 'XL'];

const EMAIL_PRESTACIONES = 'prestacionesespeciales@apm.org.ar';
const EMAIL_FACTURACION = 'comprobantes@apm.org.ar';
const TELEFONO = '4633-7878 int. 114';
const HORARIO = 'Lunes a viernes de 9:00 a 16:00 hs';
const INSTRUCTIVO_URL = '/formularios/instructivo_discapacidad.pdf';
const ANEXOS_PATH = '/formularios/discapacidad';
const MODELOS_PATH = '/discapacidad/modelos';

type TabId = 'general' | 'afiliado' | 'prestador' | 'documentacion' | 'modelos' | 'faq' | 'atencion';

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: 'general', label: 'Información general', icon: <Info size={18} /> },
    { id: 'afiliado', label: 'Soy afiliado/a', icon: <User size={18} /> },
    { id: 'prestador', label: 'Soy prestador/a', icon: <Stethoscope size={18} /> },
    { id: 'documentacion', label: 'Formularios y Anexos', icon: <FileText size={18} /> },
    { id: 'modelos', label: 'Modelos de Prescripción', icon: <ClipboardList size={18} /> },
    { id: 'atencion', label: 'Atención Discapacidad', icon: <MessageCircle size={18} /> },
];

const CONSIDERACIONES_GENERALES = [
    'Recepción de solicitudes a partir del 1.º de noviembre de 2026.',
    `La documentación debe enviarse a ${EMAIL_PRESTACIONES}.`,
    'La documentación firmada en forma hológrafa, electrónica o digital debe enviarse en un único archivo PDF.',
    'Toda la documentación debe estar completa, legible y sin tachaduras ni enmiendas.',
    'No se aceptan fotos de WhatsApp, archivos JPG o similares: serán rechazados en forma inmediata.',
    'Sólo pueden iniciar trámites afiliados mayores de un (1) año. Hasta esa edad la cobertura es a través del PMO.',
    'Las prestaciones se cubren únicamente por el período de validez del Certificado Único de Discapacidad (CUD).',
    'La cobertura se autoriza, en general, por el término de un año calendario.',
    'La cobertura se reconoce según el valor del Nomenclador de Prestaciones Básicas del Ministerio de Salud de la Nación y la SSS.',
    'Todas las prestaciones autorizadas están sujetas a auditoría de terreno y evaluación permanente del Equipo Interdisciplinario.',
];

const DOC_BENEFICIARIO = [
    'Certificado Único de Discapacidad (CUD) vigente.',
    'Constancia de alumno regular 2027, o nota aclaratoria firmada por el titular en caso de no estar escolarizado.',
    'Conformidad prestacional (Anexo II) firmada por la persona con discapacidad, familiar responsable o tutor. Con fecha anterior al inicio de la prestación y sin enmiendas.',
    'Planilla de solicitud de cobertura prestacional (Anexo I).',
    'Monotributistas: últimos 6 pagos.',
];

const DOC_MEDICO = [
    'Indicación médica (prescripción) firmada y sellada por el médico tratante, con fecha anterior al período solicitado.',
    'Resumen de Historia Clínica (Anexo III) confeccionado por el médico tratante.',
    'Medida de Independencia Funcional – FIM (Anexo IV), en caso de solicitar dependencia.',
    'Solicitud de Transporte (Anexo V), en caso de solicitar transporte. No reemplaza a la indicación médica.',
    'Utilizar los modelos y formularios de OSAPM.',
];

const INDICACION_MEDICA = [
    'Nombre y apellido, DNI, N.º de afiliado y obra social.',
    'Diagnóstico/s.',
    'Período de tratamiento (por ejemplo: enero a diciembre de 2027).',
    'Nombre de la prestación.',
    'Escolaridad, centros, instituciones u hospital de día: mencionar jornada simple o doble.',
    'Prestaciones de apoyo (Psicología, Psicopedagogía, Terapia Ocupacional, Psicomotricidad, Fonoaudiología, etc.): cantidad de sesiones.',
    'Módulo Integral Intensivo, Simple o Estimulación Temprana: nombre de cada terapia y cantidad de sesiones.',
    'Transporte: puntos de destino (ej.: domicilio – escuela, CET) y justificación de la imposibilidad de usar transporte público.',
    'Dependencia: debe aclararse en la indicación.',
    'Firma y sello legible del profesional.',
];

const GUIA_RAPIDA: { titulo: string; icon: React.ReactNode; items: string[] }[] = [
    {
        titulo: 'Escolaridad / CET / Centro de Día',
        icon: <School size={18} />,
        items: ['Certificado Único de Discapacidad (CUD)', 'Indicación médica', 'Resumen de Historia Clínica', 'Informe inicial o evolutivo', 'Presupuesto', 'Plan de trabajo', 'Conformidad del afiliado', 'FIM, si corresponde'],
    },
    {
        titulo: 'Prestaciones de Apoyo',
        icon: <HeartPulse size={18} />,
        items: ['Certificado Único de Discapacidad (CUD)', 'Indicación médica', 'Resumen de Historia Clínica', 'Informe inicial o evolutivo', 'Presupuesto', 'Plan de trabajo', 'Registro de prestador', 'Conformidad del afiliado', 'Constancia de alumno regular'],
    },
    {
        titulo: 'Módulos Ambulatorios / Estimulación Temprana',
        icon: <Baby size={18} />,
        items: ['Certificado Único de Discapacidad (CUD)', 'Indicación médica', 'Resumen de Historia Clínica', 'Informe inicial o evolutivo', 'Presupuesto', 'Plan de trabajo', 'Registro de prestador', 'Conformidad del afiliado'],
    },
    {
        titulo: 'Integración Escolar / Maestra de Apoyo',
        icon: <GraduationCap size={18} />,
        items: ['Certificado Único de Discapacidad (CUD)', 'Indicación médica', 'Resumen de Historia Clínica', 'Informe inicial o evolutivo', 'Presupuesto', 'Plan de trabajo', 'Conformidad del afiliado', 'Acta acuerdo', 'Constancia de alumno regular'],
    },
    {
        titulo: 'Hogares',
        icon: <Home size={18} />,
        items: ['Certificado Único de Discapacidad (CUD)', 'Indicación médica', 'Resumen de Historia Clínica', 'Informe inicial o evolutivo', 'Presupuesto', 'Plan de trabajo', 'Constancia de inscripción y categorización definitiva del Servicio Nacional de Rehabilitación', 'Conformidad del afiliado', 'Informe social', 'FIM, si corresponde'],
    },
    {
        titulo: 'Transporte',
        icon: <Bus size={18} />,
        items: ['Certificado Único de Discapacidad (CUD)', 'Indicación médica', 'Resumen de Historia Clínica', 'Presupuesto', 'Conformidad del afiliado', 'Constancia de alumno regular', 'FIM, si corresponde', 'Mapa / recorrido solicitado', 'Seguro, VTV y licencia de conducir', 'Declaración de domicilio'],
    },
];

const INFORMES = [
    { situacion: 'Inicio de una nueva prestación', informe: 'Informe de Admisión: instrumentos de valoración aplicados y resultados del proceso de evaluación, firmado por el prestador.' },
    { situacion: 'Continuidad de la prestación', informe: 'Informe de Evolución del año inmediato anterior: período de abordaje, modalidad, intervenciones realizadas con la persona y su núcleo de apoyo, y resultados alcanzados.' },
    { situacion: 'Junio 2027', informe: 'Informe Semestral, adjunto a la facturación.' },
];

const DATOS_BANCARIOS = 'Datos bancarios: titular de la cuenta, tipo y N.º de cuenta, CBU y CUIT.';

interface PrestacionPrestador {
    id: string;
    titulo: string;
    subtitulo?: string;
    icon: React.ReactNode;
    notas?: string[];
    documentacion: string[];
    extra?: { titulo: string; items: string[] };
}

const PRESTACIONES_PRESTADOR: PrestacionPrestador[] = [
    {
        id: 'ambulatorias',
        titulo: 'Prestaciones Profesionales Ambulatorias',
        subtitulo: 'Prestación de apoyo: Psicología, Psicopedagogía, Fonoaudiología, Terapia Ocupacional, Kinesiología y Psicomotricidad.',
        icon: <HeartPulse size={20} />,
        documentacion: [
            'Fotocopia del título profesional.',
            'Inscripción en el Registro Nacional de Prestadores (RNP) – SSSalud.',
            'Habilitación sanitaria del consultorio.',
            'Constancia de inscripción en ARCA.',
            'Plan de trabajo y objetivos: fecha de inicio, período (ej.: enero a diciembre 2027), días y horarios, objetivos específicos, estrategias de intervención, firma y sello.',
            'Presupuesto (Anexo VIII).',
            'Seguro de mala praxis.',
            'Informes correspondientes.',
            DATOS_BANCARIOS,
        ],
    },
    {
        id: 'integracion',
        titulo: 'Apoyo a la Integración Escolar – Equipo',
        subtitulo: 'Sólo para equipos categorizados por el Servicio Nacional de Rehabilitación.',
        icon: <School size={20} />,
        notas: [
            'Tiene por objetivo la adecuación de la currícula de aprendizaje y de la metodología que debe emplear el docente del colegio. NO ES UN ACOMPAÑANTE TERAPÉUTICO: se busca la inclusión del niño en el aula, por lo que el adulto de referencia debe ser su docente.',
            'Mínimo de 32 horas mensuales entre actividad áulica y extraáulica. La cantidad de horas depende del proyecto individual e incluye atención individual, familiar y coordinación del equipo técnico profesional.',
        ],
        documentacion: [
            'Adaptaciones curriculares, firmadas por el equipo de integración.',
            'Constancia de inscripción y categorización definitiva del Servicio Nacional de Rehabilitación.',
            'Acta Acuerdo (Anexo X), firmada por familiar responsable/tutor, directivo de la escuela y prestador.',
            'Presupuesto (Anexo IX).',
            'Constancia de inscripción en ARCA.',
            'Informes correspondientes.',
            DATOS_BANCARIOS,
        ],
    },
    {
        id: 'maestra',
        titulo: 'Maestro/a de Apoyo',
        subtitulo: 'Lic. en Psicopedagogía o Profesor/a de Educación Especial.',
        icon: <GraduationCap size={20} />,
        notas: [
            'Mínimo de 24 horas mensuales de actividad áulica y/o extraáulica.',
            'No se autorizan como Maestro/a de Apoyo fonoaudiólogos, psicólogos, kinesiólogos, profesores de educación física, psicomotricistas ni terapistas ocupacionales.',
        ],
        documentacion: [
            'Título profesional y certificado analítico de materias.',
            'RNP, en caso de Lic. en Psicopedagogía.',
            'Adaptaciones curriculares.',
            'Acta Acuerdo (Anexo X).',
            'Presupuesto (Anexo IX).',
            'Seguro de mala praxis.',
            'Constancia de inscripción en ARCA.',
            'Informes correspondientes.',
            DATOS_BANCARIOS,
        ],
    },
    {
        id: 'institucionales',
        titulo: 'Prestaciones Institucionales',
        subtitulo: 'Escolaridad pre-primaria y primaria, Formación Laboral, Centro Educativo Terapéutico, Centro de Día y Hogares.',
        icon: <Building2 size={20} />,
        documentacion: [
            'Plan de trabajo y objetivos.',
            'Presupuesto (Anexo VI).',
            'Conformidad de tratamiento (Anexo II): firma y sello del prestador, firma y aclaración de madre, padre o tutor.',
            'Constancia de inscripción y categorización definitiva del Servicio Nacional de Rehabilitación.',
            'Constancia de inscripción en ARCA.',
            'Informes correspondientes.',
            DATOS_BANCARIOS,
        ],
        extra: {
            titulo: 'Modalidad Hogar',
            items: ['Además, Informe Social firmado por Lic. en Trabajo Social.', 'Si el afiliado requiere dependencia, ver el apartado "Dependencia".'],
        },
    },
    {
        id: 'estimulacion',
        titulo: 'Estimulación Temprana',
        subtitulo: 'Mínimo 15 sesiones mensuales. Se reconoce hasta los 4 años de edad del afiliado.',
        icon: <Baby size={20} />,
        documentacion: [
            'Plan de trabajo y objetivos.',
            'Presupuesto.',
            'Conformidad de tratamiento (Anexo II).',
            'Constancia de inscripción y categorización definitiva del Servicio Nacional de Rehabilitación.',
            'Registro Nacional de Prestadores de la SSSalud (RNP).',
            'Constancia de inscripción en ARCA.',
            'Informes correspondientes.',
            DATOS_BANCARIOS,
        ],
    },
    {
        id: 'rehabilitacion',
        titulo: 'Rehabilitación',
        subtitulo: 'Módulo Integral Simple, Módulo Integral Intensivo y Hospital de Día.',
        icon: <Stethoscope size={20} />,
        documentacion: [
            'Plan de trabajo y objetivos.',
            'Presupuesto (Anexo VI).',
            'Constancia de inscripción y categorización definitiva del Servicio Nacional de Rehabilitación.',
            'Registro Nacional de Prestadores de la SSSalud (RNP).',
            'Seguro de mala praxis.',
            'Constancia de inscripción en ARCA.',
            'Informes correspondientes.',
            DATOS_BANCARIOS,
        ],
    },
    {
        id: 'transporte',
        titulo: 'Transporte',
        subtitulo: 'Tiene requisitos adicionales y específicos.',
        icon: <Bus size={20} />,
        documentacion: [
            'Indicación médica.',
            'Solicitud de Transporte (Anexo V).',
            'Justificación médica de los motivos físicos y/o conductuales que impiden utilizar transporte público con acompañante.',
            'Habilitación municipal del vehículo.',
            'Póliza de seguro del vehículo que realizará los traslados.',
            'Verificación Técnica Vehicular (VTV).',
            'Licencia de conducir.',
            'Constancia de inscripción en ARCA.',
            DATOS_BANCARIOS,
            'Planilla de asistencia mensual.',
            'Presupuesto de Transporte (Anexo VII), acompañado de la impresión del kilometraje según Google Maps.',
            'Conformidad de tratamiento (Anexo II): firma y sello del prestador, firma y aclaración de madre, padre o tutor.',
        ],
    },
];

const DEPENDENCIA_INSTITUCIONES = [
    'Informe cualitativo y cuantitativo de la Escala de Medición de Independencia Funcional (FIM), confeccionado por Lic. en Terapia Ocupacional (puede ser del Centro u Hogar).',
    'Informe del prestador especificando los apoyos que se brindarán conforme al plan de abordaje individual.',
];

const DEPENDENCIA_TRANSPORTE = [
    'Informe cualitativo y cuantitativo de la FIM, confeccionado por médico tratante y/o Lic. en Terapia Ocupacional.',
    'Incluir en el diagrama de traslado los apoyos específicos que se brindarán.',
];

const FACTURA_DETALLE = [
    'Período de prestación.',
    'Prestación brindada según el Nomenclador de Prestaciones Básicas.',
    'Modalidad.',
    'Jornada simple o doble.',
    'Categoría del establecimiento.',
    'Si incluye dependencia.',
    'Especialidades: cantidad de sesiones y valor unitario.',
    'Monto individual de cada prestación y sumatoria total.',
    'Firma y sello.',
];

const FACTURA_TRANSPORTE = [
    'Dirección de partida y de destino.',
    'Cantidad de viajes diarios y mensuales.',
    'Kilómetros por viaje y total de kilómetros del mes.',
    'Si incluye dependencia.',
    'Valor del kilómetro y valor total.',
    'Firma y sello.',
];

const MOTIVOS_DEBITO = [
    'Facturación por un monto superior al autorizado.',
    'Sesiones en feriados nacionales, en prestaciones no institucionales.',
    'Planilla de asistencia enmendada, incompleta o inexistente.',
    'Excedente de kilometraje respecto de la menor distancia entre domicilio y destino según Google Maps.',
    'Falta de datos requeridos en el detalle o cuerpo de la factura.',
    'Confección incorrecta de la factura o invalidez impositiva.',
    'Presentación de la factura fuera del plazo establecido.',
];

const ANEXOS: { numero: string; titulo: string; descripcion: string; archivo: string }[] = [
    { numero: 'I', titulo: 'Planilla de Solicitud de Cobertura Prestacional', descripcion: 'Planilla de datos personales del afiliado y del titular. Tiene carácter de declaración jurada.', archivo: 'anexo-01-solicitud-cobertura-prestacional-2027.pdf' },
    { numero: 'II', titulo: 'Conformidad Prestacional', descripcion: 'Firma de la persona con discapacidad o familiar/tutor. Fecha anterior al inicio.', archivo: 'anexo-02-conformidad-prestacional-2027.pdf' },
    { numero: 'III', titulo: 'Resumen de Historia Clínica', descripcion: 'Lo completa el médico tratante.', archivo: 'anexo-03-resumen-historia-clinica-2027.pdf' },
    { numero: 'IV', titulo: 'Medida de Independencia Funcional (FIM)', descripcion: 'Para solicitudes con dependencia.', archivo: 'anexo-04-medida-independencia-funcional-2027.pdf' },
    { numero: 'V', titulo: 'Solicitud de Transporte', descripcion: 'Con justificación médica de la solicitud.', archivo: 'anexo-05-solicitud-transporte-2027.pdf' },
    { numero: 'VI', titulo: 'Presupuesto Prestaciones Institucionales', descripcion: 'Escolaridad, CET, Centro de Día, Hogar y Rehabilitación.', archivo: 'anexo-06-presupuesto-prestaciones-institucionales-2027.pdf' },
    { numero: 'VII', titulo: 'Presupuesto de Transporte por Destino', descripcion: 'Con cronograma de traslados y kilometraje.', archivo: 'anexo-07-presupuesto-transporte-2027.pdf' },
    { numero: 'VIII', titulo: 'Presupuesto Prestaciones Profesionales Ambulatorias', descripcion: 'Terapias ambulatorias por sesión.', archivo: 'anexo-08-presupuesto-prestaciones-ambulatorias-2027.pdf' },
    { numero: 'IX', titulo: 'Presupuesto Maestra de Apoyo / Apoyo a la Integración Escolar', descripcion: 'Para integración escolar con equipo o maestra de apoyo.', archivo: 'anexo-09-presupuesto-apoyo-integracion-escolar-2027.pdf' },
    { numero: 'X', titulo: 'Acta de Acuerdo de Inclusión', descripcion: 'Firma familia, escuela y prestador.', archivo: 'anexo-10-acta-acuerdo-inclusion-2027.pdf' },
    { numero: '—', titulo: 'Solicitud de Cambio de Prestador', descripcion: 'Para cambiar de prestador en una prestación autorizada.', archivo: 'solicitud-cambio-prestador-2027.pdf' },
    { numero: '—', titulo: 'Planilla de Asistencia', descripcion: 'Mensual. Se presenta junto con la facturación.', archivo: 'planilla-asistencia-2027.pdf' },
];

interface Modelo {
    titulo: string;
    archivo: string;
}

const MODELOS: Modelo[] = [
    { titulo: 'Prestación de Apoyo', archivo: 'prestacion-de-apoyo.webp' },
    { titulo: 'Módulo Apoyo a la Integración Escolar (Equipo)', archivo: 'apoyo-integracion-escolar.webp' },
    { titulo: 'Estimulación Temprana', archivo: 'estimulacion-temprana.webp' },
    { titulo: 'Prestaciones Educativas', archivo: 'prestaciones-educativas.webp' },
    { titulo: 'Transporte', archivo: 'transporte.webp' },
];

const HOJA_VERIFICACION: Modelo = { titulo: 'Hoja de Verificación', archivo: 'hoja-de-verificacion.webp' };

interface PreguntaDisca {
    pregunta: string;
    respuesta: string[];
    items?: string[];
}

const PREGUNTAS: PreguntaDisca[] = [
    {
        pregunta: '¿Cómo me contacto con el sector de Prestaciones Especiales?',
        respuesta: [`Teléfono: ${TELEFONO}, ${HORARIO.toLowerCase()}.`, `E-mail: ${EMAIL_PRESTACIONES}`],
    },
    {
        pregunta: 'Una vez presentada la documentación, ¿cuánto tiempo demora la auditoría?',
        respuesta: [],
        items: [
            'Solicitudes anuales (renovación de prestaciones o solicitud por primera vez): 30 días hábiles.',
            'Modificaciones o incorporaciones dentro de una solicitud ya aprobada: 15 días hábiles.',
            'Solicitudes derivadas al Equipo Interdisciplinario para su análisis y auditoría: 15 días hábiles.',
        ],
    },
    {
        pregunta: '¿Cómo me entero del resultado de la auditoría?',
        respuesta: ['El prestador recibirá un e-mail con la autorización de la prestación solicitada.'],
    },
    {
        pregunta: '¿Qué debo hacer si pasaron los 30 días y mi expediente no se encuentra autorizado?',
        respuesta: ['Es responsabilidad del afiliado, familiar, tutor o prestador realizar el seguimiento de la solicitud o expediente.'],
        items: [
            'Si por algún motivo no se audita en tiempo y forma, recibirá un e-mail informando que la auditoría se encuentra en curso y que será auditada en los próximos días.',
            'Verifique que la solicitud no tenga rechazos ni correcciones pendientes.',
            'En altas recientes de beneficiarios monotributistas, la revisión puede demorar más debido a los plazos de actualización del padrón.',
            'Si con lo anterior no resolvió su duda, puede realizar su consulta desde el formulario de Atención Discapacidad.',
        ],
    },
    {
        pregunta: 'Si envié una solicitud y quiero cambiar un prestador o documentación, ¿tengo que aguardar a la auditoría?',
        respuesta: ['Sí. Mientras la solicitud se encuentre "pendiente de verificación" no podrá realizar NINGUNA acción sobre la misma. Deberá aguardar a que sea auditada (aceptada u observada).'],
    },
    {
        pregunta: '¿Puedo cambiar de prestador cuando la prestación ya fue autorizada?',
        respuesta: ['Sí, conforme lo indicado en el Instructivo de Discapacidad, presentando la Solicitud de Cambio de Prestador. Toda modificación será auditada en un plazo de 15 días hábiles.'],
    },
    {
        pregunta: 'Ante un cambio de prestador, ¿se debe presentar Informe de Evaluación Inicial?',
        respuesta: ['No corresponde presentar informe de evaluación inicial. Debe presentarse el informe evolutivo del prestador anterior.'],
    },
];

const PRESTACIONES_CONSULTA = [
    'Prestación de apoyo (terapias ambulatorias)',
    'Apoyo a la integración escolar (equipo)',
    'Maestro/a de apoyo',
    'Escolaridad / CET / Centro de Día',
    'Hogar',
    'Estimulación temprana',
    'Rehabilitación (módulo integral / hospital de día)',
    'Transporte',
    'Otra',
];

const FontSizeContext = createContext(FONT_SIZES[1]);

const Subtitle = ({ children }: { children: React.ReactNode }) => {
    const fontSize = useContext(FontSizeContext);
    return (
        <h4 style={{ fontSize: fontSize * 0.8 }} className="font-black text-[#1C75BB] uppercase tracking-widest mb-4 mt-8 flex items-center gap-2 border-l-4 border-[#00AEEF] pl-3">
            {children}
        </h4>
    );
};

const TextP = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
    const fontSize = useContext(FontSizeContext);
    return <p style={{ fontSize }} className={`text-gray-600 leading-relaxed mb-4 ${className}`}>{children}</p>;
};

const CheckList = ({ items, columns = 1 }: { items: string[]; columns?: 1 | 2 }) => {
    const fontSize = useContext(FontSizeContext);
    return (
        <ul className={`grid grid-cols-1 ${columns === 2 ? 'md:grid-cols-2' : ''} gap-x-6 gap-y-2 mb-6`}>
            {items.map((item) => (
                <li key={item} style={{ fontSize: fontSize * 0.95 }} className="text-gray-600 flex gap-2 items-start">
                    <CheckCircle2 size={14} className="text-[#00AEEF] shrink-0 mt-1" />
                    <span>{item}</span>
                </li>
            ))}
        </ul>
    );
};

const TabTitle = ({ children, bajada }: { children: React.ReactNode; bajada?: string }) => (
    <div className="mb-6">
        <h3 className="text-3xl font-black uppercase tracking-tighter text-[#1C75BB]">{children}</h3>
        {bajada && <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.2em] mt-1">{bajada}</p>}
    </div>
);

const ImportanteBox = () => {
    const fontSize = useContext(FontSizeContext);
    return (
        <div className="p-5 rounded-2xl mb-6 bg-amber-50 border border-amber-200 flex gap-3">
            <AlertTriangle size={20} className="text-amber-600 shrink-0 mt-0.5" />
            <div style={{ fontSize: fontSize * 0.95 }} className="text-gray-700 space-y-1">
                <p className="font-black uppercase text-amber-700 text-xs tracking-widest mb-1">Importante</p>
                <p>La presentación de la documentación <strong>no implica la autorización</strong> de la prestación.</p>
                <p>Las prestaciones deben contar con <strong>autorización previa</strong> del Área de Discapacidad antes de su inicio. <strong>No se autorizan prestaciones con carácter retroactivo.</strong></p>
            </div>
        </div>
    );
};

const DescargaInstructivo = () => (
    <a
        href={INSTRUCTIVO_URL}
        download
        target="_blank"
        rel="noopener noreferrer"
        className="p-6 bg-[#1C75BB] text-white rounded-[2rem] flex items-center justify-between gap-4 hover:bg-[#00AEEF] transition-colors group"
    >
        <div className="flex items-center gap-4">
            <div className="p-3 bg-white/10 rounded-2xl shrink-0">
                <FileText size={26} className="text-[#00AEEF] group-hover:text-white transition-colors" />
            </div>
            <div>
                <p className="font-black uppercase tracking-tight">Instructivo de Prestaciones Especiales 2027</p>
                <p className="text-sm opacity-80">Guía completa para afiliados y prestadores. Leer antes de gestionar.</p>
            </div>
        </div>
        <Download size={22} className="shrink-0" />
    </a>
);

const VisorImagen = ({ modelo, onClose }: { modelo: Modelo; onClose: () => void }) => {
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', onKey);
        document.body.style.overflow = 'hidden';
        return () => {
            window.removeEventListener('keydown', onKey);
            document.body.style.overflow = '';
        };
    }, [onClose]);

    return (
        <div
            className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-label={modelo.titulo}
        >
            <div className="relative max-h-full max-w-3xl w-full flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
                <div className="w-full flex items-center justify-between mb-3 text-white">
                    <p className="font-black uppercase tracking-tight text-sm">{modelo.titulo}</p>
                    <button onClick={onClose} className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors" aria-label="Cerrar">
                        <X size={18} />
                    </button>
                </div>
                <img
                    src={`${MODELOS_PATH}/${modelo.archivo}`}
                    alt={modelo.titulo}
                    draggable={false}
                    onContextMenu={(e) => e.preventDefault()}
                    className="max-h-[80vh] w-auto rounded-2xl shadow-2xl bg-white select-none"
                />
                <p className="text-white/60 text-xs mt-3">Imagen orientativa · archivo no descargable</p>
            </div>
        </div>
    );
};

const TarjetaModelo = ({ modelo, onOpen }: { modelo: Modelo; onOpen: (m: Modelo) => void }) => (
    <button
        onClick={() => onOpen(modelo)}
        className="group text-left bg-slate-50 rounded-3xl border border-gray-100 overflow-hidden hover:border-[#00AEEF] hover:shadow-md transition-all"
    >
        <div className="aspect-[2/3] overflow-hidden bg-white">
            <img
                src={`${MODELOS_PATH}/${modelo.archivo}`}
                alt={modelo.titulo}
                loading="lazy"
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
                className="w-full h-full object-cover object-top group-hover:scale-[1.03] transition-transform duration-300 select-none"
            />
        </div>
        <div className="p-4 flex items-center justify-between gap-2">
            <p className="font-bold text-sm text-[#1C75BB] leading-tight">{modelo.titulo}</p>
            <Eye size={16} className="text-[#00AEEF] shrink-0" />
        </div>
    </button>
);

const PrestacionCard = ({ prestacion, abierta, onToggle }: { prestacion: PrestacionPrestador; abierta: boolean; onToggle: () => void }) => {
    const fontSize = useContext(FontSizeContext);
    return (
        <div className={`border-2 rounded-3xl transition-all duration-300 ${abierta ? 'border-[#00AEEF] bg-slate-50/50' : 'border-slate-100 hover:border-slate-200'}`}>
            <button onClick={onToggle} className="w-full flex items-center gap-4 p-5 md:p-6 text-left outline-none" aria-expanded={abierta}>
                <div className={`p-2.5 rounded-2xl shrink-0 transition-colors ${abierta ? 'bg-[#1C75BB] text-white' : 'bg-blue-50 text-[#1C75BB]'}`}>
                    {prestacion.icon}
                </div>
                <div className="flex-1">
                    <p style={{ fontSize: fontSize * 1.05 }} className="font-black tracking-tight text-[#1C75BB] leading-tight">{prestacion.titulo}</p>
                    {prestacion.subtitulo && <p style={{ fontSize: fontSize * 0.85 }} className="text-gray-500 mt-1">{prestacion.subtitulo}</p>}
                </div>
                {abierta ? <Minus className="text-[#00AEEF] shrink-0" size={22} /> : <Plus className="text-slate-300 shrink-0" size={22} />}
            </button>
            {abierta && (
                <div className="px-5 md:px-6 pb-6 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="h-[2px] w-12 bg-[#00AEEF] mb-5 rounded-full opacity-50" />
                    {prestacion.notas && (
                        <div className="p-4 rounded-2xl mb-5 bg-blue-50 border border-blue-100 space-y-2">
                            {prestacion.notas.map((n) => <p key={n} style={{ fontSize: fontSize * 0.95 }} className="text-gray-700">{n}</p>)}
                        </div>
                    )}
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Documentación del prestador</p>
                    <CheckList items={prestacion.documentacion} />
                    {prestacion.extra && (
                        <>
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">{prestacion.extra.titulo}</p>
                            <CheckList items={prestacion.extra.items} />
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

interface ConsultaForm {
    nombre: string;
    documento: string;
    email: string;
    prestacion: string;
    prestador: string;
    motivo: string;
}

const CONSULTA_VACIA: ConsultaForm = { nombre: '', documento: '', email: '', prestacion: '', prestador: '', motivo: '' };

const FormularioConsulta = () => {
    const [form, setForm] = useState<ConsultaForm>(CONSULTA_VACIA);
    const [enviado, setEnviado] = useState(false);

    const set = (campo: keyof ConsultaForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
        setForm((f) => ({ ...f, [campo]: e.target.value }));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const subject = `Consulta Discapacidad - ${form.nombre} - ${form.documento}`;
        const body = [
            'CONSULTA - ÁREA DE DISCAPACIDAD',
            '',
            `Nombre y apellido del afiliado/a: ${form.nombre}`,
            `DNI / CUIL: ${form.documento}`,
            `E-mail de respuesta: ${form.email}`,
            `Prestación solicitada: ${form.prestacion}`,
            `Prestador o institución: ${form.prestador}`,
            '',
            'Motivo de la consulta:',
            form.motivo,
        ].join('\n');
        window.location.href = `mailto:${EMAIL_PRESTACIONES}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        setEnviado(true);
    };

    const inputCls = 'w-full bg-slate-50 border-2 border-slate-200 rounded-xl py-3 px-4 text-sm text-gray-700 placeholder:text-gray-400 outline-none focus:border-[#00AEEF] focus:bg-white transition-all';
    const labelCls = 'block text-sm font-bold text-[#1C75BB] mb-1.5';
    const req = <span className="text-[#00AEEF]" aria-hidden="true">*</span>;

    return (
        <div className="bg-white rounded-[2rem] border-2 border-red-200 p-6 md:p-8">
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-red-50 border-2 border-red-300 mb-6">
                <IdCard size={22} className="text-red-700 shrink-0 mt-0.5" />
                <div>
                    <p className="font-black uppercase tracking-tight text-red-800 text-sm">Exclusivo para personas con CUD vigente</p>
                    <p className="text-sm text-red-900/80 mt-0.5">Formulario de consulta para personas con Certificado Único de Discapacidad vigente.</p>
                </div>
            </div>

            <h4 className="text-xl font-black tracking-tight text-[#1C75BB]">Formulario de consulta</h4>
            <p className="text-sm text-gray-500 mb-6">Completá los datos para enviarnos tu consulta sobre prestaciones de discapacidad y autorizaciones.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="dc-nombre" className={labelCls}>Nombre y apellido del afiliado/a {req}</label>
                        <input id="dc-nombre" required className={inputCls} placeholder="Ingresá el nombre y apellido" value={form.nombre} onChange={set('nombre')} />
                    </div>
                    <div>
                        <label htmlFor="dc-doc" className={labelCls}>DNI / CUIL {req}</label>
                        <input id="dc-doc" required inputMode="numeric" className={inputCls} placeholder="Ingresá el DNI o CUIL" value={form.documento} onChange={set('documento')} />
                    </div>
                </div>
                <div>
                    <label htmlFor="dc-email" className={labelCls}>E-mail del afiliado/a {req}</label>
                    <input id="dc-email" type="email" required className={inputCls} placeholder="Correo electrónico donde desea recibir la respuesta" value={form.email} onChange={set('email')} />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="dc-prestacion" className={labelCls}>Prestación solicitada {req}</label>
                        <select id="dc-prestacion" required className={inputCls} value={form.prestacion} onChange={set('prestacion')}>
                            <option value="" disabled>Seleccioná una opción</option>
                            {PRESTACIONES_CONSULTA.map((p) => <option key={p} value={p}>{p}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="dc-prestador" className={labelCls}>Prestador o institución {req}</label>
                        <input id="dc-prestador" required className={inputCls} placeholder="Nombre del prestador o institución" value={form.prestador} onChange={set('prestador')} />
                    </div>
                </div>
                <div>
                    <label htmlFor="dc-motivo" className={labelCls}>Motivo de la consulta {req}</label>
                    <textarea id="dc-motivo" required rows={4} className={`${inputCls} resize-y`} placeholder="Describí brevemente tu consulta" value={form.motivo} onChange={set('motivo')} />
                </div>

                <button type="submit" className="w-full md:w-auto md:px-10 bg-[#1C75BB] hover:bg-[#00AEEF] text-white font-black uppercase tracking-widest text-sm py-4 rounded-xl transition-colors flex items-center justify-center gap-2 mx-auto">
                    <Send size={16} /> Enviar consulta
                </button>
            </form>

            {enviado && (
                <div className="mt-5 p-4 rounded-2xl bg-blue-50 border border-blue-100 text-sm text-gray-700 flex gap-3">
                    <Info size={18} className="text-[#1C75BB] shrink-0 mt-0.5" />
                    <p>Se abrió tu aplicación de correo con la consulta lista para enviar. Si no se abrió, escribinos directamente a <a href={`mailto:${EMAIL_PRESTACIONES}`} className="font-bold text-[#1C75BB] underline">{EMAIL_PRESTACIONES}</a>.</p>
                </div>
            )}

            <p className="text-xs text-gray-400 text-center mt-6">
                La consulta será recibida por el sector de Prestaciones Especiales. La respuesta será enviada al e-mail informado en el formulario.
            </p>
        </div>
    );
};

export const Discapacidad: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabId>('general');
    const [fontSizeIdx, setFontSizeIdx] = useState(1);
    const [prestacionAbierta, setPrestacionAbierta] = useState<string | null>(null);
    const [preguntaAbierta, setPreguntaAbierta] = useState<number | null>(null);
    const [modeloAbierto, setModeloAbierto] = useState<Modelo | null>(null);
    const mainRef = useRef<HTMLElement>(null);

    const fontSize = FONT_SIZES[fontSizeIdx];

    const handleTabChange = (id: TabId) => {
        setActiveTab(id);
        if (window.innerWidth < 1024) mainRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'general':
                return (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <TabTitle bajada="Información, orientación y gestión de prestaciones">Discapacidad</TabTitle>
                        <div className="bg-blue-50 p-6 rounded-3xl mb-6 border border-blue-100">
                            <TextP>La Obra Social cuenta con un <strong>Sector de Auditoría y Orientación para Personas con Discapacidad</strong>, integrado por un Equipo Interdisciplinario de profesionales especializados en la materia.</TextP>
                            <TextP>El principal objetivo del sector es acompañar, orientar y evaluar las prestaciones solicitadas por los beneficiarios, promoviendo un abordaje integral y procurando garantizar el acceso a las prestaciones correspondientes, de acuerdo con los principios y postulados establecidos en la Convención sobre los Derechos de las Personas con Discapacidad.</TextP>
                            <TextP className="mb-0">El Equipo Interdisciplinario interviene en la evaluación de las solicitudes prestacionales, considerando las necesidades particulares de cada beneficiario, la documentación presentada, las indicaciones profesionales y el marco normativo vigente.</TextP>
                        </div>

                        <ImportanteBox />

                        <div className="grid md:grid-cols-2 gap-4 mb-2">
                            <div className="p-6 bg-slate-50 rounded-3xl border border-gray-100">
                                <div className="flex items-center gap-2 mb-3 text-[#1C75BB]">
                                    <Scale size={18} className="text-[#00AEEF]" />
                                    <p className="font-black uppercase text-xs tracking-widest">Marco normativo</p>
                                </div>
                                <TextP className="mb-0">Las prestaciones se encuentran reguladas principalmente por la <strong>Ley N.º 24.901</strong> – Sistema de Prestaciones Básicas en Habilitación y Rehabilitación Integral a favor de las Personas con Discapacidad, y por el Marco Básico de Organización y Funcionamiento de Prestaciones y Establecimientos de Atención a Personas con Discapacidad, aprobado mediante <strong>Resolución N.º 1328/2006</strong> del Ministerio de Salud de la Nación, y sus modificatorias.</TextP>
                            </div>
                            <div className="p-6 bg-slate-50 rounded-3xl border border-gray-100">
                                <div className="flex items-center gap-2 mb-3 text-[#1C75BB]">
                                    <RefreshCw size={18} className="text-[#00AEEF]" />
                                    <p className="font-black uppercase text-xs tracking-widest">Actualización de requisitos</p>
                                </div>
                                <TextP className="mb-0">Toda la documentación y los requisitos establecidos por el Sector de Discapacidad podrán ser modificados o actualizados de acuerdo con las disposiciones, resoluciones y demás normativa que emita la Superintendencia de Servicios de Salud y otros organismos competentes.</TextP>
                            </div>
                        </div>

                        <Subtitle>Consideraciones generales</Subtitle>
                        <CheckList items={CONSIDERACIONES_GENERALES} />

                        <DescargaInstructivo />

                        <Subtitle>Accesos rápidos</Subtitle>
                        <div className="grid md:grid-cols-2 gap-4">
                            {([
                                { id: 'afiliado', titulo: 'Soy afiliado/a', desc: 'Documentación a presentar y guía rápida por prestación.', icon: <User size={24} /> },
                                { id: 'prestador', titulo: 'Soy prestador/a', desc: 'Requisitos por prestación, informes y facturación.', icon: <Stethoscope size={24} /> },
                            ] as const).map((acceso) => (
                                <button
                                    key={acceso.id}
                                    onClick={() => handleTabChange(acceso.id)}
                                    className="p-6 bg-white rounded-3xl border-2 border-slate-100 hover:border-[#00AEEF] hover:shadow-md transition-all text-left flex items-center gap-4 group"
                                >
                                    <div className="p-3 bg-blue-50 rounded-2xl text-[#1C75BB] group-hover:bg-[#1C75BB] group-hover:text-white transition-colors">{acceso.icon}</div>
                                    <div className="flex-1">
                                        <p className="font-black uppercase tracking-tight text-[#1C75BB]">{acceso.titulo}</p>
                                        <p className="text-sm text-gray-500">{acceso.desc}</p>
                                    </div>
                                    <ArrowRight size={18} className="text-[#00AEEF] group-hover:translate-x-1 transition-transform" />
                                </button>
                            ))}
                        </div>
                    </div>
                );

            case 'afiliado':
                return (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <TabTitle bajada="Documentación referida al afiliado">Soy afiliado/a</TabTitle>
                        <ImportanteBox />

                        <div className="grid md:grid-cols-2 gap-4 mb-2">
                            <div className="rounded-3xl border border-blue-100 overflow-hidden">
                                <div className="bg-blue-50 px-6 py-4 flex items-center gap-3">
                                    <div className="p-2.5 bg-white rounded-2xl text-[#1C75BB]"><User size={20} /></div>
                                    <p className="font-black text-lg tracking-tight text-[#1C75BB]">Del Beneficiario</p>
                                </div>
                                <div className="p-6"><CheckList items={DOC_BENEFICIARIO} /></div>
                            </div>
                            <div className="rounded-3xl border border-cyan-100 overflow-hidden">
                                <div className="bg-cyan-50 px-6 py-4 flex items-center gap-3">
                                    <div className="p-2.5 bg-white rounded-2xl text-[#1C75BB]"><Stethoscope size={20} /></div>
                                    <p className="font-black text-lg tracking-tight text-[#1C75BB]">Del Médico</p>
                                </div>
                                <div className="p-6"><CheckList items={DOC_MEDICO} /></div>
                            </div>
                        </div>

                        <Subtitle>¿Qué debe incluir la indicación médica?</Subtitle>
                        <TextP>La indicación <strong>no puede ser emitida por profesionales de la institución donde se brinda la prestación</strong>, y su fecha de emisión debe ser anterior al período solicitado. Debe incluir:</TextP>
                        <CheckList items={INDICACION_MEDICA} columns={2} />
                        <button onClick={() => handleTabChange('modelos')} className="mb-2 text-sm font-bold text-[#1C75BB] hover:text-[#00AEEF] flex items-center gap-1.5 transition-colors">
                            Ver modelos de prescripción médica <ArrowRight size={14} />
                        </button>

                        <Subtitle>Guía rápida: ¿qué documentación necesito?</Subtitle>
                        <TextP>Presentá exclusivamente la documentación detallada para la modalidad prestacional solicitada, completa, vigente, legible y correctamente confeccionada.</TextP>
                        <div className="grid md:grid-cols-2 gap-4 mb-6">
                            {GUIA_RAPIDA.map((g) => (
                                <div key={g.titulo} className="p-5 bg-slate-50 rounded-3xl border border-gray-100">
                                    <div className="flex items-center gap-2 mb-3 text-[#1C75BB]">
                                        <span className="text-[#00AEEF]">{g.icon}</span>
                                        <p className="font-black uppercase text-xs tracking-widest">{g.titulo}</p>
                                    </div>
                                    <ol className="space-y-1.5">
                                        {g.items.map((item, i) => (
                                            <li key={item} style={{ fontSize: fontSize * 0.9 }} className="flex gap-2 text-gray-600">
                                                <span className="w-5 h-5 rounded-full bg-white border border-blue-100 text-[10px] font-black text-[#1C75BB] flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ol>
                                </div>
                            ))}
                        </div>

                        <Subtitle>¿Qué pasa después?</Subtitle>
                        <TextP>Una vez recibida la documentación, el Área de Prestaciones Especiales – Discapacidad evalúa la solicitud conforme a la normativa vigente. Si está completa, vigente y correcta, se continúa con la evaluación y, de resultar aprobada, se notifica la autorización.</TextP>
                        <TextP>Si se detecta documentación faltante, vencida, ilegible o que requiera modificación, se la solicitará para continuar el trámite. La documentación incompleta puede frenar el trámite hasta que se complete.</TextP>
                    </div>
                );

            case 'prestador':
                return (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <TabTitle bajada="Documentación referida al prestador">Soy prestador/a</TabTitle>
                        <ImportanteBox />
                        <div className="p-5 rounded-2xl mb-6 bg-blue-50 border border-blue-100 flex gap-3">
                            <Info size={20} className="text-[#1C75BB] shrink-0 mt-0.5" />
                            <TextP className="mb-0"><strong>Portal de Prestadores:</strong> una vez autorizada la prestación, el prestador podrá darse de alta en el Portal de Prestadores de OSAPM.</TextP>
                        </div>

                        <Subtitle>Informes requeridos</Subtitle>
                        <div className="rounded-3xl border border-gray-100 overflow-hidden mb-2">
                            {INFORMES.map((inf, i) => (
                                <div key={inf.situacion} className={`grid md:grid-cols-[220px_1fr] ${i > 0 ? 'border-t border-gray-100' : ''}`}>
                                    <div className="px-5 py-4 bg-slate-50 font-black text-sm text-[#1C75BB]">{inf.situacion}</div>
                                    <div style={{ fontSize: fontSize * 0.95 }} className="px-5 py-4 text-gray-600">{inf.informe}</div>
                                </div>
                            ))}
                        </div>

                        <Subtitle>Requisitos por prestación</Subtitle>
                        <div className="space-y-3 mb-2">
                            {PRESTACIONES_PRESTADOR.map((p) => (
                                <PrestacionCard
                                    key={p.id}
                                    prestacion={p}
                                    abierta={prestacionAbierta === p.id}
                                    onToggle={() => setPrestacionAbierta(prestacionAbierta === p.id ? null : p.id)}
                                />
                            ))}
                        </div>

                        <Subtitle>Dependencia</Subtitle>
                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <div className="p-5 bg-slate-50 rounded-3xl border border-gray-100">
                                <p className="font-black uppercase text-xs tracking-widest text-[#1C75BB] mb-3">Hogar, Centro de Día y CET</p>
                                <CheckList items={DEPENDENCIA_INSTITUCIONES} />
                            </div>
                            <div className="p-5 bg-slate-50 rounded-3xl border border-gray-100">
                                <p className="font-black uppercase text-xs tracking-widest text-[#1C75BB] mb-3">Transporte</p>
                                <CheckList items={DEPENDENCIA_TRANSPORTE} />
                            </div>
                        </div>
                        <TextP>No se reconoce dependencia cuando, por edad, el afiliado deba trasladarse acompañado por familiar o tutor responsable, ni cuando la FIM señale niveles de independencia funcional que posibiliten la autonomía en el traslado.</TextP>

                        <Subtitle>Facturación</Subtitle>
                        <div className="grid md:grid-cols-3 gap-4 mb-6">
                            <div className="p-5 bg-[#1C75BB] text-white rounded-3xl">
                                <Clock size={22} className="text-[#00AEEF] mb-3" />
                                <p className="font-black uppercase text-xs tracking-widest mb-1">Cuándo</p>
                                <p className="text-sm opacity-90">Del 1 al 10 de cada mes, facturas y planilla de asistencia.</p>
                            </div>
                            <div className="p-5 bg-[#1C75BB] text-white rounded-3xl">
                                <Mail size={22} className="text-[#00AEEF] mb-3" />
                                <p className="font-black uppercase text-xs tracking-widest mb-1">Dónde</p>
                                <a href={`mailto:${EMAIL_FACTURACION}`} className="text-sm font-bold underline break-all">{EMAIL_FACTURACION}</a>
                                <p className="text-xs opacity-70 mt-1">Mesa de Entradas</p>
                            </div>
                            <div className="p-5 bg-[#1C75BB] text-white rounded-3xl">
                                <Receipt size={22} className="text-[#00AEEF] mb-3" />
                                <p className="font-black uppercase text-xs tracking-widest mb-1">A nombre de</p>
                                <p className="text-sm opacity-90">Obra Social Agentes de Propaganda Médica</p>
                                <p className="text-xs opacity-70 mt-1">CUIT 30-62311465-9 · Av. Avellaneda 2144, CABA</p>
                            </div>
                        </div>
                        <TextP>La facturación debe respetar el período y la prestación efectivamente autorizados. El pago se realiza por transferencia bancaria, y el CBU informado debe corresponder a la razón social/CUIT de la factura.</TextP>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="p-5 bg-slate-50 rounded-3xl border border-gray-100">
                                <p className="font-black uppercase text-xs tracking-widest text-[#1C75BB] mb-3">Detalle de la factura</p>
                                <CheckList items={FACTURA_DETALLE} />
                            </div>
                            <div className="p-5 bg-slate-50 rounded-3xl border border-gray-100">
                                <p className="font-black uppercase text-xs tracking-widest text-[#1C75BB] mb-3">Facturas de transporte</p>
                                <CheckList items={FACTURA_TRANSPORTE} />
                            </div>
                        </div>

                        <Subtitle>Motivos de débito</Subtitle>
                        <div className="p-5 rounded-2xl bg-red-50 border border-red-100">
                            <ul className="space-y-2">
                                {MOTIVOS_DEBITO.map((m) => (
                                    <li key={m} style={{ fontSize: fontSize * 0.95 }} className="flex gap-2 items-start text-gray-700">
                                        <ShieldAlert size={15} className="text-red-600 shrink-0 mt-1" />
                                        <span>{m}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                );

            case 'documentacion':
                return (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <TabTitle bajada="Documentación para la gestión de prestaciones">Formularios y Anexos</TabTitle>
                        <DescargaInstructivo />

                        <Subtitle>Anexos 2027</Subtitle>
                        <div className="grid md:grid-cols-2 gap-3">
                            {ANEXOS.map((a) => (
                                <a
                                    key={a.archivo}
                                    href={`${ANEXOS_PATH}/${a.archivo}`}
                                    download
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-5 bg-slate-50 rounded-3xl border border-gray-100 flex items-center gap-4 hover:border-[#00AEEF] hover:shadow-md transition-all group"
                                >
                                    <div className="w-12 h-12 rounded-2xl bg-white border border-blue-100 flex items-center justify-center shrink-0 font-black text-[#1C75BB] text-sm group-hover:bg-[#1C75BB] group-hover:text-white transition-colors">
                                        {a.numero === '—' ? <FileText size={18} /> : a.numero}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p style={{ fontSize: fontSize * 0.95 }} className="font-bold text-[#1C75BB] group-hover:text-[#00AEEF] transition-colors leading-tight">
                                            {a.numero !== '—' && <span className="text-gray-400 font-black text-[10px] uppercase tracking-widest block mb-0.5">Anexo {a.numero}</span>}
                                            {a.titulo}
                                        </p>
                                        <p style={{ fontSize: fontSize * 0.8 }} className="text-gray-500 mt-1">{a.descripcion}</p>
                                    </div>
                                    <Download size={18} className="text-[#00AEEF] shrink-0" />
                                </a>
                            ))}
                        </div>

                        <Subtitle>Hoja de verificación</Subtitle>
                        <TextP>Checklist de la documentación indispensable para autorizar prestaciones. Descargala y tildá lo que corresponda.</TextP>
                        <div className="flex flex-col sm:flex-row gap-4 items-start">
                            <div className="w-full max-w-[200px]">
                                <TarjetaModelo modelo={HOJA_VERIFICACION} onOpen={setModeloAbierto} />
                            </div>
                            <a
                                href={`${ANEXOS_PATH}/hoja-de-verificacion-2027.pdf`}
                                download
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-[#1C75BB] hover:bg-[#00AEEF] text-white font-black uppercase tracking-widest text-xs px-6 py-4 rounded-xl transition-colors"
                            >
                                <Download size={16} /> Descargar Hoja de Verificación
                            </a>
                        </div>
                    </div>
                );

            case 'modelos':
                return (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <TabTitle bajada="Imagen orientativa · archivo no descargable">Modelos de Prescripción Médica</TabTitle>
                        <TextP>Para evitar errores, solicitamos que las prescripciones se confeccionen siguiendo los modelos de OSAPM. Hacé clic en cada modelo para verlo en tamaño completo.</TextP>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {MODELOS.map((m) => <TarjetaModelo key={m.archivo} modelo={m} onOpen={setModeloAbierto} />)}
                        </div>
                    </div>
                );

            case 'faq':
                return (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <TabTitle bajada="Consultas habituales sobre prestaciones y auditoría">Preguntas Frecuentes</TabTitle>
                        <div className="space-y-3">
                            {PREGUNTAS.map((p, index) => {
                                const abierta = preguntaAbierta === index;
                                return (
                                    <div key={p.pregunta} className={`border-2 rounded-3xl transition-all duration-300 ${abierta ? 'border-[#00AEEF] bg-slate-50/50' : 'border-slate-100 hover:border-slate-200'}`}>
                                        <button
                                            onClick={() => setPreguntaAbierta(abierta ? null : index)}
                                            className="w-full flex items-center justify-between p-5 md:p-6 text-left outline-none"
                                            aria-expanded={abierta}
                                        >
                                            <h4 style={{ fontSize: fontSize * 1.05 }} className="font-black tracking-tight text-[#1C75BB] pr-4">{p.pregunta}</h4>
                                            {abierta ? <Minus className="text-[#00AEEF] shrink-0" size={22} /> : <Plus className="text-slate-300 shrink-0" size={22} />}
                                        </button>
                                        {abierta && (
                                            <div className="px-5 md:px-6 pb-6 animate-in fade-in slide-in-from-top-2 duration-300">
                                                <div className="h-[2px] w-12 bg-[#00AEEF] mb-5 rounded-full opacity-50" />
                                                {p.respuesta.map((r) => <TextP key={r}>{r}</TextP>)}
                                                {p.items && <CheckList items={p.items} />}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );

            case 'atencion':
                return (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <TabTitle bajada="Consultas por prestaciones y autorizaciones">Atención Discapacidad</TabTitle>
                        <div className="grid lg:grid-cols-[minmax(0,320px)_1fr] gap-6">
                            <div className="space-y-4">
                                <div className="p-6 bg-[#1C75BB] text-white rounded-[2rem]">
                                    <Phone size={26} className="text-[#00AEEF] mb-3" />
                                    <p className="font-black uppercase text-xs tracking-widest opacity-70 mb-1">Teléfono</p>
                                    <p className="text-2xl font-black leading-tight">4633-7878</p>
                                    <p className="text-sm font-bold">Interno 114</p>
                                    <p className="text-xs opacity-70 mt-2">{HORARIO}</p>
                                </div>
                                <div className="p-6 bg-slate-50 rounded-[2rem] border border-gray-100">
                                    <Mail size={26} className="text-[#00AEEF] mb-3" />
                                    <p className="font-black uppercase text-xs tracking-widest text-gray-400 mb-1">E-mail</p>
                                    <a href={`mailto:${EMAIL_PRESTACIONES}`} className="font-bold text-[#1C75BB] hover:text-[#00AEEF] break-all transition-colors">{EMAIL_PRESTACIONES}</a>
                                </div>
                                <div className="p-6 bg-slate-50 rounded-[2rem] border border-gray-100 space-y-3">
                                    {[
                                        { icon: <Send size={16} />, text: 'Tu consulta es recibida por el sector de Prestaciones Especiales para su análisis.' },
                                        { icon: <Clock size={16} />, text: 'La respuesta se envía al e-mail informado en el formulario.' },
                                        { icon: <BadgeCheck size={16} />, text: 'Completá todos los datos para agilizar la gestión.' },
                                    ].map((x) => (
                                        <div key={x.text} className="flex gap-3 items-start text-sm text-gray-600">
                                            <span className="p-2 bg-white rounded-xl text-[#1C75BB] shrink-0">{x.icon}</span>
                                            <span>{x.text}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <FormularioConsulta />
                        </div>
                    </div>
                );
        }
    };

    return (
        <FontSizeContext.Provider value={fontSize}>
            <section id="discapacidad" className="pt-20 pb-20 bg-slate-50 font-sans min-h-screen text-[#1C75BB]">
                <div className="bg-[#1C75BB] px-6 md:px-12 py-10 relative mb-10">
                    <div className="flex flex-col items-center text-center gap-3">
                        <div className="p-3 bg-white/10 rounded-2xl">
                            <Accessibility size={28} className="text-[#00AEEF]" />
                        </div>
                        <div>
                            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-white leading-none">
                                Área de <span className="text-[#00AEEF]">Discapacidad</span>
                            </h2>
                            <p className="text-white/60 font-bold uppercase text-[10px] tracking-[0.25em] mt-1">
                                Prestaciones Especiales · OSAPM
                            </p>
                        </div>
                    </div>

                    <div className="hidden md:flex absolute right-6 md:right-12 top-1/2 -translate-y-1/2 items-center gap-1 bg-white/10 border border-white/20 rounded-xl p-1">
                        <button
                            onClick={() => setFontSizeIdx((i) => Math.max(0, i - 1))}
                            disabled={fontSizeIdx === 0}
                            aria-label="Reducir tamaño de texto"
                            className="p-1.5 rounded-lg hover:bg-white/10 disabled:opacity-30 transition-all text-white"
                        >
                            <ZoomOut size={14} />
                        </button>
                        <div className="flex gap-0.5 px-1">
                            {FONT_SIZES.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setFontSizeIdx(i)}
                                    className={`w-5 h-5 rounded-md transition-all text-[9px] font-black ${fontSizeIdx === i ? 'bg-[#00AEEF] text-white' : 'text-white/50 hover:text-white'}`}
                                >
                                    {FONT_LABELS[i]}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => setFontSizeIdx((i) => Math.min(FONT_SIZES.length - 1, i + 1))}
                            disabled={fontSizeIdx === FONT_SIZES.length - 1}
                            aria-label="Aumentar tamaño de texto"
                            className="p-1.5 rounded-lg hover:bg-white/10 disabled:opacity-30 transition-all text-white"
                        >
                            <ZoomIn size={14} />
                        </button>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    <div className="flex flex-col lg:flex-row gap-12">
                        <aside className="w-full lg:w-80 flex-shrink-0">
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-1 gap-1 bg-slate-50/50 p-2 rounded-[2.5rem] border border-gray-100 lg:sticky lg:top-28">
                                {TABS.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => handleTabChange(item.id)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-[10px] uppercase tracking-wider transition-all
                                        ${activeTab === item.id
                                                ? 'bg-[#1C75BB] text-white shadow-xl lg:translate-x-2'
                                                : 'text-[#1C75BB]/60 hover:bg-white hover:text-[#1C75BB]'
                                            }`}
                                    >
                                        <span className={activeTab === item.id ? 'text-[#00AEEF]' : 'opacity-40'}>{item.icon}</span>
                                        <span className="text-left leading-tight">{item.label}</span>
                                    </button>
                                ))}
                            </div>
                        </aside>

                        <main ref={mainRef} className="flex-1 min-w-0 bg-white rounded-[3rem] border border-gray-100 shadow-sm p-6 md:p-12 min-h-[650px] overflow-hidden scroll-mt-28">
                            {renderContent()}
                        </main>
                    </div>
                </div>

                {modeloAbierto && <VisorImagen modelo={modeloAbierto} onClose={() => setModeloAbierto(null)} />}
            </section>
        </FontSizeContext.Provider>
    );
};
