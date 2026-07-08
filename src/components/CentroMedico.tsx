import React, { useState, useEffect, useRef } from 'react';
import {
    MapPin, Phone, Stethoscope,
    CreditCard, Navigation, MessageCircle, HandHeart,
    ExternalLink, Mail, Banknote, QrCode, Newspaper, ChevronDown,
    ChevronLeft, ChevronRight
} from 'lucide-react';
import { apiService, Noticia, BACKOFFICE_API_BASE_URL } from '../services/api';

const NOTICIA_PLACEHOLDER_IMG = 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800';

const getNoticiaImg = (n: Noticia) =>
    n.imagenes?.length ? `${BACKOFFICE_API_BASE_URL}${n.imagenes[0].rutaImagen}` : NOTICIA_PLACEHOLDER_IMG;

const stripHtml = (html: string) => html.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim();

const formatFecha = (d: string) =>
    new Date(d).toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' });


interface Especialidad {
    nombre: string;
    procedimientos?: string[];
}

const ESPECIALIDADES: Especialidad[] = [
    { nombre: "Cardiología", procedimientos: ["Electrocardiograma"] },
    { nombre: "Cirugía General" },
    { nombre: "Clínica Médica", procedimientos: ["Consulta Clínica Médica"] },
    {
        nombre: "Dermatología",
        procedimientos: [
            "Escisión local de lesión de piel o glándula de piel (quiste sebáceo, ántrax, nevus, etc.)",
            "Destrucción de lesión de piel por electrocoagulación o sustancias químicas — hasta 5 elementos",
            "Destrucción de lesión de piel por electrocoagulación o sustancias químicas — más de 5 elementos",
            "Drenaje de absceso",
            "Dermatoscopía",
            "Control de lunares / Mapeo corporal",
            "Biopsia de piel",
            "Curetaje",
            "Infiltración de queloides"
        ]
    },
    { nombre: "Diabetología" },
    { nombre: "Endocrinología" },
    { nombre: "Gastroenterología" },
    {
        nombre: "Ginecología",
        procedimientos: [
            "Colposcopía / Traqueloscopía",
            "Cepillado endocervical c/ control colposcópico (Cytobrush)",
            "Topificación vulvar",
            "Vaginoscopía",
            "Vulvoscopía",
            "Toma de muestra para Papanicolau",
            "Extracción de DIU",
            "Colocación de DIU (incluye DIU Kupfer standard — otro DIU a cargo del paciente)",
            "Biopsia de vagina",
            "Biopsia de cuello",
            "Punción de vagina",
            "Punción de saco de Douglas",
            "Escisión local de lesión de cuello / Electrocoagulación / Cauterización química"
        ]
    },
    { nombre: "Neumonología", procedimientos: ["Espirometría computada"] },
    { nombre: "Neurología" },
    { nombre: "Nutrición", procedimientos: ["Dieta"] },
    { nombre: "Osteopatía" },
    {
        nombre: "Otorrinolaringología",
        procedimientos: [
            "Extracción de cuerpo extraño en oído / Extracción de cerumen",
            "Rinofibrolaringoscopía"
        ]
    },
    { nombre: "Pediatría" },
    {
        nombre: "Rehabilitación",
        procedimientos: [
            "Fisiokinesioterapia con Láser, Magneto, Ultrasonido, Electroanalgesia, Ejercicios"
        ]
    },
    { nombre: "Reumatología", procedimientos: ["Capilaroscopía"] },
    {
        nombre: "Traumatología",
        procedimientos: [
            "Infiltraciones de Traumatología, con o sin medicación incluida (Corticoides / Ácido Hialurónico)",
            "Curaciones",
            "Extracción de puntos"
        ]
    },
    { nombre: "Urología", procedimientos: ["Colocación y recambio de sonda"] },
];

const ODONTOLOGIA = [
    "Blanqueamiento",
    "Cirugía",
    "Consultas",
    "Endodoncia",
    "Odontopediatría",
    "Operatoria Dental",
    "Ortopedia",
    "Periodoncia",
    "Prevención / Ortodoncia",
    "Prótesis",
    "Radiología Odontológica",
    "Rehabilitaciones sobre Implantes",
];

const PRESTACIONES_MEDICAS = ESPECIALIDADES.filter(e => e.procedimientos && e.procedimientos.length > 0);
const PRESTACIONES_REHAB = ["Ejercicios", "Electroanalgesia", "Fisiokinesioterapia", "Láser", "Magneto", "Osteopatía", "Ultrasonido"];

const MEDIOS_PAGO = [
    { label: 'Débito', icon: CreditCard },
    { label: 'Crédito', icon: CreditCard },
    { label: 'Transferencia', icon: Banknote },
    { label: 'QR', icon: QrCode },
];

interface CentroMedicoProps {
    onNoticiasClick?: () => void;
}

export const CentroMedico: React.FC<CentroMedicoProps> = ({ onNoticiasClick }) => {
    const [prestacionTab, setPrestacionTab] = useState<'medicas' | 'rehabilitacion' | 'odontologicas'>('medicas');
    const [especialidadesOpen, setEspecialidadesOpen] = useState(false);
    const [prestacionesOpen, setPrestacionesOpen] = useState(false);
    const [noticias, setNoticias] = useState<Noticia[]>([]);
    const [loadingNoticias, setLoadingNoticias] = useState(true);
    const sliderRef = useRef<HTMLDivElement>(null);
    const [sliderAtStart, setSliderAtStart] = useState(true);
    const [sliderAtEnd, setSliderAtEnd] = useState(true);

    useEffect(() => {
        apiService.getNoticias(4)
            .then(setNoticias)
            .catch(() => setNoticias([]))
            .finally(() => setLoadingNoticias(false));
    }, []);

    useEffect(() => {
        const el = sliderRef.current;
        if (!el) return;
        setSliderAtEnd(el.scrollWidth <= el.clientWidth + 4);
    }, [noticias]);

    const handleSliderScroll = () => {
        const el = sliderRef.current;
        if (!el) return;
        setSliderAtStart(el.scrollLeft <= 4);
        setSliderAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
    };

    const slideBy = (dir: 1 | -1) => {
        const el = sliderRef.current;
        if (!el) return;
        const card = el.querySelector('[data-card]') as HTMLElement;
        const step = card ? card.clientWidth + 24 : el.clientWidth * 0.9;
        el.scrollBy({ left: dir * step, behavior: 'smooth' });
    };

    return (
        <section id="centro-medico" className="pt-20 bg-white font-sans text-[#1C75BB] animate-in fade-in duration-700">

            {/* INFO BAR */}
            <div className="bg-[#1C75BB] px-6 py-3 flex flex-wrap justify-center gap-5 md:gap-10">
                <button
                    onClick={() => document.getElementById('novedades')?.scrollIntoView({ behavior: 'smooth' })}
                    className="flex items-center gap-2 bg-[#00AEEF] text-white text-[13px] font-black uppercase tracking-wider px-4 py-1.5 rounded-full hover:bg-white hover:text-[#1C75BB] transition-colors"
                >
                    <Newspaper size={13} />
                    <span>Novedades</span>
                </button>
                <div className="flex items-center gap-2 text-white text-[13px] font-bold uppercase tracking-wider">
                    <MapPin size={14} />
                    <span>Ecuador 949, CABA</span>
                </div>
                <div className="flex items-center gap-2 text-white text-[13px] font-bold uppercase tracking-wider">
                    <Phone size={14} />
                    <span>(011) 2034-1000</span>
                </div>
                <a href="https://wa.me/5491123010833" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white text-[13px] font-bold uppercase tracking-wider hover:text-[#00AEEF] transition-colors">
                    <MessageCircle size={14} />
                    <span>WhatsApp</span>
                </a>
                <a href="https://www.instagram.com/centromedicoosapm" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white text-[13px] font-bold uppercase tracking-wider hover:text-[#00AEEF] transition-colors">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                        <circle cx="12" cy="12" r="4" />
                        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                    </svg>
                    <span>Instagram</span>
                </a>
            </div>

            {/* HERO: FOTO + HISTORIA */}
            <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="flex items-center justify-center bg-slate-50 p-8 lg:p-12">
                    <div className="w-full rounded-3xl overflow-hidden shadow-2xl ring-1 ring-gray-100">
                        <img
                            src="/cm-osapm/foto1.png"
                            className="w-full aspect-[4/3] object-cover"
                            style={{ objectPosition: 'center calc(50% + -50px)' }}
                            alt="Centro Médico OSAPM"
                        />
                    </div>
                </div>
                <div className="flex flex-col justify-center px-10 py-14 bg-white">
                    <p className="text-[12px] font-black uppercase tracking-widest text-[#00AEEF] mb-3">Nuestra historia</p>
                    <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-[#1C75BB] leading-none mb-2">
                        Centro Médico <span className="text-[#00AEEF]">OSAPM</span>
                    </h1>
                    <div className="w-16 h-1 bg-[#00AEEF] rounded-full mb-6" />

                    <div className="flex flex-wrap gap-2 mb-6">
                        {['5 Consultorios Médicos', 'Rehabilitación', '3 Consultorios Odontológicos', 'Radiología Dental', 'Quirófano Odontológico'].map(t => (
                            <span key={t} className="text-[12px] font-bold bg-[#00AEEF]/10 text-[#1C75BB] px-3 py-1.5 rounded-full">{t}</span>
                        ))}
                    </div>

                    <div className="space-y-3 text-gray-600 text-base leading-relaxed">
                        <p>En Octubre del 2021 te anunciábamos la apertura de nuestro Centro Médico OSAPM.</p>
                        <p>En esos momentos, estuvimos trabajando en la remodelación de ese espacio tan querido que se inauguró hace 30 años como Clínica Odontológica. Se buscó optimizar los recursos para poner a tu disposición más servicios y una atención exclusiva.</p>
                        <p>Fue para nosotros una satisfacción rescatar las oportunidades y haber podido compartir con vos la noticia que sin dudas redundó en una mejor atención.</p>
                        <button
                            onClick={() => document.getElementById('direccion-medica')?.scrollIntoView({ behavior: 'smooth' })}
                            className="font-bold text-[#00AEEF] underline underline-offset-2 text-left hover:text-[#1C75BB] transition-colors"
                        >
                            Ahora a 6 años...
                        </button>
                    </div>

                    <div className="mt-8 flex flex-col sm:flex-row gap-3">
                        <a href="tel:01120341000" className="flex items-center justify-center gap-2 bg-[#1C75BB] text-white px-7 py-3 rounded-full font-black uppercase tracking-wider text-sm hover:bg-[#00AEEF] transition-colors shadow-lg">
                            <Phone size={16} />
                            Llamar
                        </a>
                        <a href="https://wa.me/5491123010833" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-[#25D366] text-white px-7 py-3 rounded-full font-black uppercase tracking-wider text-sm hover:bg-[#128C7E] transition-colors shadow-lg">
                            <MessageCircle size={16} />
                            WhatsApp Turnos
                        </a>
                    </div>
                </div>
            </div>

            {/* SUSANA SECTION */}
            <div id="direccion-medica" className="grid grid-cols-1 lg:grid-cols-2 bg-slate-50">
                <div className="flex flex-col justify-center px-10 py-14 order-2 lg:order-1">
                    <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-[#1C75BB] leading-none mb-1">
                        Dra. Susana Agliano
                    </h2>
                    <p className="text-[#00AEEF] font-black text-sm uppercase tracking-widest mb-6">Dirección Médica</p>
                    <div className="w-16 h-1 bg-[#00AEEF] rounded-full mb-6" />

                    <div className="relative space-y-3 text-gray-600 text-base leading-relaxed pl-5 border-l-2 border-[#00AEEF]/30">
                        <p>Dirigir, coordinar y llevar adelante un Centro Médico claramente no es tarea fácil. Hoy me toca estar a la cabeza y si bien sé que asumí una responsabilidad enorme, también sé que si hay algo que me caracteriza son los desafíos y metas que me propongo.</p>
                        <p>Siempre se puede ir un poquito más allá, aprender algo nuevo. Es mi manera de encarar mi trabajo, mi día a día siempre en movimiento no quedándome estática.</p>
                        <p>Obviamente no estoy sola, hay un equipo de personas excelentes y muy capaces trabajando juntos para poder dar lo mejor a nuestros pacientes.</p>
                        <p>Lo que sí me ayudó, algo que aprendí en estos últimos años es... rodearme de buena gente. Gente que va para un mismo lado. Ante todo, buenas personas.</p>
                    </div>
                    <p className="mt-5 font-black text-[#1C75BB] text-sm uppercase tracking-wide">Eso somos — buena gente que trabaja día a día. Vamos por más, Centro Médico OSAPM.</p>
                </div>
                <div className="flex items-center justify-center bg-white p-6 lg:p-8 order-1 lg:order-2">
                    <div className="w-full max-w-md rounded-3xl overflow-hidden shadow-2xl ring-1 ring-gray-100">
                        <img
                            src="/cm-osapm/susana1.JPG"
                            className="w-full aspect-[4/5] object-cover object-top"
                            alt="Dra. Susana Agliano - Dirección Médica"
                        />
                    </div>
                </div>
            </div>
            <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

            {/* ESPECIALIDADES */}
            <div className="py-16">
                <div className="px-4 lg:px-10 mb-4">
                    <button
                        onClick={() => setEspecialidadesOpen(o => !o)}
                        className="flex items-center gap-4 text-[#1C75BB] group"
                    >
                        <div className="p-3 bg-[#00AEEF]/10 rounded-2xl text-[#00AEEF]">
                            <Stethoscope size={32} />
                        </div>
                        <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight">Especialidades</h2>
                        <span className="ml-1 p-1.5 bg-[#00AEEF]/15 rounded-full">
                            <ChevronDown
                                size={20}
                                className={`text-[#00AEEF] transition-transform duration-300 ${especialidadesOpen ? 'rotate-180' : ''}`}
                            />
                        </span>
                    </button>
                </div>

                {!especialidadesOpen && (
                    <div className="px-4 lg:px-10 mt-5 flex flex-wrap gap-2">
                        {ESPECIALIDADES.slice(0, 6).map(e => (
                            <span key={e.nombre} className="text-[11px] font-bold uppercase tracking-wider bg-[#00AEEF]/8 text-[#1C75BB] px-3 py-1.5 rounded-full border border-[#00AEEF]/20">
                                {e.nombre}
                            </span>
                        ))}
                        <span className="text-[11px] font-bold uppercase tracking-wider bg-slate-100 text-gray-400 px-3 py-1.5 rounded-full">
                            +{ESPECIALIDADES.length - 6 + ODONTOLOGIA.length} más
                        </span>
                    </div>
                )}

                {especialidadesOpen && (
                    <div className="max-w-7xl mx-auto px-4 lg:px-8 animate-in fade-in slide-in-from-top-2 duration-300 pt-8">
                        {/* Médicas y Rehabilitación */}
                        <div className="mb-12">
                            <p className="text-[14px] font-black uppercase tracking-widest text-[#00AEEF] mb-5 flex items-center gap-3">
                                <span className="w-5 h-[2px] bg-[#00AEEF] rounded-full inline-block" />
                                Médicas y Rehabilitación
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                {ESPECIALIDADES.map((esp) => (
                                    <div key={esp.nombre} className="flex items-center gap-3 p-5 bg-white border border-gray-100 rounded-2xl hover:border-[#00AEEF] hover:shadow-md transition-all">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#00AEEF] flex-shrink-0" />
                                        <p className="font-bold text-[14px] text-slate-600">{esp.nombre}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Odontológicas */}
                        <div>
                            <p className="text-[14px] font-black uppercase tracking-widest text-[#00AEEF] mb-5 flex items-center gap-3">
                                <span className="w-5 h-[2px] bg-[#00AEEF] rounded-full inline-block" />
                                Odontológicas
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                {ODONTOLOGIA.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-4 p-5 bg-white border border-gray-100 rounded-2xl hover:border-[#00AEEF] hover:shadow-md transition-all group cursor-default">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#00AEEF] group-hover:scale-150 transition-transform flex-shrink-0" />
                                        <p className="font-bold text-[14px] text-slate-600 group-hover:text-[#00AEEF] transition-colors">{item}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* PRESTACIONES */}
            <div className="py-12">
                <div className="px-4 lg:px-10 mb-4">
                    <button
                        onClick={() => setPrestacionesOpen(o => !o)}
                        className="flex items-center gap-4 text-[#1C75BB] group"
                    >
                        <div className="p-3 bg-[#00AEEF]/10 rounded-2xl text-[#00AEEF]">
                            <HandHeart size={32} />
                        </div>
                        <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight">Prestaciones</h2>
                        <span className="ml-1 p-1.5 bg-[#00AEEF]/15 rounded-full">
                            <ChevronDown
                                size={20}
                                className={`text-[#00AEEF] transition-transform duration-300 ${prestacionesOpen ? 'rotate-180' : ''}`}
                            />
                        </span>
                    </button>
                </div>

                {!prestacionesOpen && (
                    <div className="px-4 lg:px-10 mt-5 flex flex-wrap gap-2">
                        {['Médicas', 'Rehabilitación', 'Odontológicas'].map(cat => (
                            <span key={cat} className="text-[11px] font-bold uppercase tracking-wider bg-[#00AEEF]/8 text-[#1C75BB] px-3 py-1.5 rounded-full border border-[#00AEEF]/20">
                                {cat}
                            </span>
                        ))}
                        <span className="text-[11px] font-bold uppercase tracking-wider bg-slate-100 text-gray-400 px-3 py-1.5 rounded-full">
                            {PRESTACIONES_MEDICAS.reduce((acc, e) => acc + e.procedimientos!.length, 0) + PRESTACIONES_REHAB.length + ODONTOLOGIA.length} procedimientos
                        </span>
                    </div>
                )}

                {prestacionesOpen && (
                <div className="max-w-7xl mx-auto px-4 lg:px-8 animate-in fade-in slide-in-from-top-2 duration-300 pt-8">
                <div className="flex flex-wrap gap-3 mb-8">
                    {([
                        { key: 'medicas', label: 'Médicas' },
                        { key: 'rehabilitacion', label: 'Rehabilitación' },
                        { key: 'odontologicas', label: 'Odontológicas' },
                    ] as const).map(({ key, label }) => (
                        <button
                            key={key}
                            onClick={() => setPrestacionTab(key)}
                            className={`px-7 py-3 rounded-full font-black text-[14px] uppercase tracking-wider transition-all duration-200 ${prestacionTab === key ? 'bg-[#00AEEF] text-white shadow-lg shadow-blue-400/30 scale-105' : 'bg-white border border-gray-200 text-[#1C75BB] hover:border-[#00AEEF] hover:text-[#00AEEF]'}`}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-gray-100 shadow-xl animate-in fade-in duration-300">
                    {prestacionTab === 'medicas' && (
                        <div className="space-y-6">
                            {PRESTACIONES_MEDICAS.map((esp) => (
                                <div key={esp.nombre}>
                                    <p className="text-[13px] font-black uppercase tracking-widest text-[#1C75BB] mb-3 border-l-4 border-[#00AEEF] pl-3">{esp.nombre}</p>
                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                        {esp.procedimientos!.map((p, i) => (
                                            <li key={i} className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl border border-gray-100">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#00AEEF] flex-shrink-0 mt-1.5" />
                                                <p className="font-bold text-[13px] text-slate-600 leading-snug">{p}</p>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    )}
                    {prestacionTab === 'rehabilitacion' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {PRESTACIONES_REHAB.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3 p-5 bg-white border border-gray-100 rounded-2xl hover:border-[#00AEEF] hover:shadow-md transition-all">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#00AEEF] flex-shrink-0" />
                                    <p className="font-bold text-[13px] text-slate-600">{item}</p>
                                </div>
                            ))}
                        </div>
                    )}
                    {prestacionTab === 'odontologicas' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {ODONTOLOGIA.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3 p-5 bg-white border border-gray-100 rounded-2xl hover:border-[#00AEEF] hover:shadow-md transition-all">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#00AEEF] flex-shrink-0" />
                                    <p className="font-bold text-[13px] text-slate-600">{item}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                </div>
                )}
            </div>

            {/* NOVEDADES */}
            <div id="novedades" className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
                <div className="flex items-center gap-4 text-[#1C75BB] mb-10">
                    <div className="p-3 bg-[#00AEEF]/10 rounded-2xl text-[#00AEEF]">
                        <Newspaper size={32} />
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight">Novedades</h2>
                </div>

                {loadingNoticias ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-white rounded-3xl overflow-hidden animate-pulse">
                                <div className="aspect-[16/9] bg-gray-200" />
                                <div className="p-6 space-y-3">
                                    <div className="h-3 w-24 bg-gray-200 rounded-full" />
                                    <div className="h-5 w-3/4 bg-gray-200 rounded-full" />
                                    <div className="h-3 w-full bg-gray-200 rounded-full" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : noticias.length === 0 ? (
                    <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">No hay novedades publicadas aún.</p>
                ) : (
                    <div className="relative">
                        {!sliderAtStart && (
                            <button
                                onClick={() => slideBy(-1)}
                                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center text-[#1C75BB] hover:bg-[#1C75BB] hover:text-white transition-all border border-gray-100"
                            >
                                <ChevronLeft size={20} />
                            </button>
                        )}
                        <div
                            ref={sliderRef}
                            onScroll={handleSliderScroll}
                            className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-2 [&::-webkit-scrollbar]:hidden"
                        >
                            {noticias.map(n => (
                                <div
                                    key={n.idNoticia}
                                    data-card
                                    onClick={onNoticiasClick}
                                    className="flex-shrink-0 w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] snap-start bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                                >
                                    <div className="aspect-[16/9] overflow-hidden">
                                        <img src={getNoticiaImg(n)} alt={n.titulo} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="p-6">
                                        <p className="text-[12px] font-black uppercase tracking-widest text-[#00AEEF] mb-2">
                                            {formatFecha(n.vigenciaDesde)}
                                        </p>
                                        <h3 className="font-black text-[#1C75BB] text-base uppercase tracking-tight leading-tight mb-2 line-clamp-2">{n.titulo}</h3>
                                        <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">{stripHtml(n.copete)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {!sliderAtEnd && (
                            <button
                                onClick={() => slideBy(1)}
                                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center text-[#1C75BB] hover:bg-[#1C75BB] hover:text-white transition-all border border-gray-100"
                            >
                                <ChevronRight size={20} />
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* MEDIOS DE PAGO */}
            <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
                <div className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-lg">
                    <div className="flex items-center gap-3 mb-8">
                        <CreditCard size={28} className="text-[#00AEEF]" />
                        <h3 className="text-2xl font-black uppercase tracking-tight text-[#1C75BB]">Medios de Pago</h3>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {MEDIOS_PAGO.map(({ label, icon: Icon }) => (
                            <div key={label} className="flex flex-col items-center gap-3 p-6 bg-slate-50 rounded-2xl border border-gray-100 hover:border-[#00AEEF] transition-colors">
                                <Icon size={24} className="text-[#00AEEF]" />
                                <p className="font-black text-sm uppercase tracking-wider text-[#1C75BB]">{label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* MAPA */}
            <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
                <div className="flex items-center gap-4 mb-10 text-[#1C75BB]">
                    <div className="p-3 bg-[#00AEEF]/10 rounded-2xl text-[#00AEEF]">
                        <Navigation size={32} />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight">Cómo Llegar</h2>
                </div>
                <div className="w-full h-[350px] md:h-[500px] rounded-[3rem] overflow-hidden shadow-2xl border-4 border-slate-50">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3283.991152763868!2d-58.4031206!3d-34.6043813!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bccaea6646f903%3A0x70677464019a3b5f!2sEcuador%20949%2C%20C1214%20CABA%2C%20Argentina!5e0!3m2!1ses-419!2sar!4v1710000000000!5m2!1ses-419!2sar"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                    />
                </div>
            </div>

            {/* PROFESIONALES DE SALUD */}
            <div className="max-w-7xl mx-auto px-4 lg:px-8 pb-16">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-8 bg-slate-50 border border-gray-100 rounded-3xl">
                    <div>
                        <p className="text-[12px] font-black uppercase tracking-widest text-[#00AEEF] mb-1">Sumate al equipo</p>
                        <p className="font-black text-lg uppercase tracking-tighter text-[#1C75BB]">Profesionales de Salud</p>
                        <p className="text-sm text-gray-400 mt-1">¿Querés formar parte del plantel del Centro Médico OSAPM? Dejanos tu CV.</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
                        <a
                            href="mailto:centro.medico@apm.org.ar"
                            className="flex items-center gap-2 border border-[#1C75BB]/30 text-[#1C75BB] px-5 py-2.5 rounded-full font-black text-sm uppercase tracking-wider hover:bg-[#1C75BB] hover:text-white hover:border-[#1C75BB] transition-all"
                        >
                            <Mail size={14} />
                            centro.medico@apm.org.ar
                        </a>
                        <a
                            href="https://www.linkedin.com/in/centro-m%C3%A9dico-osapm-9679b839b/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 border border-gray-200 text-gray-400 px-5 py-2.5 rounded-full font-black text-sm uppercase tracking-wider hover:border-[#1C75BB] hover:text-[#1C75BB] transition-all"
                        >
                            <ExternalLink size={14} />
                            LinkedIn
                        </a>
                    </div>
                </div>
            </div>

        </section>
    );
};
