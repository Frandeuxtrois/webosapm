import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import {
    FileText, CheckCircle2, Stethoscope, Pill, Activity, Heart, UserCheck,
    AlertTriangle, ShieldCheck, Microscope, Navigation, Users, Clock,
    ShieldAlert, Info, Download, AlertCircle, Star, Search, X,
    ZoomIn, ZoomOut
} from 'lucide-react';

// ─── Highlight helper ─────────────────────────────────────────────────────────
function normalize(s: string) {
    return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// ─── Font size steps ──────────────────────────────────────────────────────────
const FONT_SIZES = [14, 16, 18, 20, 22];
const FONT_LABELS = ["XS", "S", "M", "L", "XL"];

// ─── Datos del menú lateral ───────────────────────────────────────────────────
const TRAMITES_DATA = [
    { id: "internaciones", label: "Internaciones", icon: <Navigation size={18} /> },
    { id: "medicamentos", label: "Medicamentos", icon: <Pill size={18} /> },
    { id: "odontologia", label: "Odontología", icon: <Stethoscope size={18} /> },
    { id: "protesis", label: "Prótesis y Órtesis", icon: <Activity size={18} /> },
    { id: "ambulatoria", label: "Atención Ambulatoria", icon: <Heart size={18} /> },
    { id: "cardio", label: "P. Preventivo Cardiovascular", icon: <Activity size={18} /> },
    { id: "uterino", label: "Cáncer Cuello Uterino", icon: <Microscope size={18} /> },
    { id: "mama", label: "Cáncer De Mama", icon: <Microscope size={18} /> },
    { id: "odonto-prev", label: "Prevención Odontológica", icon: <ShieldCheck size={18} /> },
    { id: "ive", label: "Interrupción Embarazo (IVE)", icon: <ShieldAlert size={18} /> },
    { id: "guia", label: "Cómo efectuar trámites", icon: <FileText size={18} /> },
    { id: "identidad", label: "Identidad de Género", icon: <UserCheck size={18} /> },
    { id: "violencia", label: "Violencia de género", icon: <AlertTriangle size={18} /> },
    { id: "discapacidad", label: "Discapacidad", icon: <Users size={18} /> },
];

// ─── Componente principal ─────────────────────────────────────────────────────
export const Tramites: React.FC = () => {
    const [activeTab, setActiveTab] = useState(TRAMITES_DATA[0].id);
    const [searchQuery, setSearchQuery] = useState("");
    const [matchCount, setMatchCount] = useState(0);
    const [fontSizeIdx, setFontSizeIdx] = useState(1);
    const mainRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    const fontSize = FONT_SIZES[fontSizeIdx];

    // Reset search when tab changes
    useEffect(() => { setSearchQuery(""); setMatchCount(0); }, [activeTab]);

    // Apply highlight marks to DOM after render
    useEffect(() => {
        const container = contentRef.current;
        if (!container) return;

        // Remove previous marks
        container.querySelectorAll("mark.tramite-hl").forEach(m => {
            const parent = m.parentNode;
            if (parent) { parent.replaceChild(document.createTextNode(m.textContent || ""), m); parent.normalize(); }
        });

        if (!searchQuery.trim() || searchQuery.length < 2) { setMatchCount(0); return; }

        const q = normalize(searchQuery);
        let count = 0;
        let firstMark: Element | null = null;

        // Walk all text nodes inside the main content
        const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, {
            acceptNode: (node) => {
                const parent = node.parentElement;
                if (!parent) return NodeFilter.FILTER_REJECT;
                const tag = parent.tagName.toLowerCase();
                if (tag === "input" || tag === "button" || tag === "script") return NodeFilter.FILTER_REJECT;
                if (parent.closest("mark")) return NodeFilter.FILTER_REJECT;
                return NodeFilter.FILTER_ACCEPT;
            }
        });

        const textNodes: Text[] = [];
        let node: Node | null;
        while ((node = walker.nextNode())) textNodes.push(node as Text);

        textNodes.forEach(textNode => {
            const text = textNode.textContent || "";
            const normText = normalize(text);
            const idx = normText.indexOf(q);
            if (idx === -1) return;

            // Split and wrap
            const frag = document.createDocumentFragment();
            let last = 0;
            let cur = idx;
            while (cur !== -1) {
                if (cur > last) frag.appendChild(document.createTextNode(text.slice(last, cur)));
                const mark = document.createElement("mark");
                mark.className = "tramite-hl";
                mark.style.cssText = "background:#FEF08A;color:inherit;border-radius:3px;padding:0 2px;";
                mark.textContent = text.slice(cur, cur + q.length);
                frag.appendChild(mark);
                if (!firstMark) firstMark = mark;
                count++;
                last = cur + q.length;
                cur = normText.indexOf(q, last);
            }
            if (last < text.length) frag.appendChild(document.createTextNode(text.slice(last)));
            textNode.parentNode?.replaceChild(frag, textNode);
        });

        setMatchCount(count);
        // Scroll to first match
        if (firstMark) (firstMark as Element).scrollIntoView({ behavior: "smooth", block: "center" });
    }, [searchQuery, activeTab]);

    const handleTabChange = (id: string) => { setActiveTab(id); };

    // ── Subcomponentes ────────────────────────────────────────────────────────
    const Subtitle = ({ children }: { children: React.ReactNode }) => (
        <h4 style={{ fontSize: fontSize * 0.8 }} className="font-black text-[#1C75BB] uppercase tracking-widest mb-4 mt-8 flex items-center gap-2 border-l-4 border-[#00AEEF] pl-3">
            {children}
        </h4>
    );

    const TextP = ({ children, className = "", style: customStyle }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) => (
        <p style={{ fontSize, ...customStyle }} className={`text-gray-600 leading-relaxed mb-4 ${className}`}>{children}</p>
    );

    const List = ({ items }: { items: string[] }) => (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 mb-6">
            {items.map((item, i) => (
                <li key={i} style={{ fontSize }} className="text-gray-500 flex gap-2 items-start">
                    <CheckCircle2 size={14} className="text-[#00AEEF] shrink-0 mt-0.5" />
                    <span>{item}</span>
                </li>
            ))}
        </ul>
    );

    const InfoBox = ({ children, color = "blue" }: { children: React.ReactNode; color?: string }) => {
        const styles: Record<string, string> = {
            blue: "bg-blue-50 border border-blue-100",
            orange: "bg-orange-50 border border-orange-100",
            red: "bg-red-50 border border-red-100",
            slate: "bg-slate-50 border border-gray-100",
            dark: "bg-slate-900 text-white",
        };
        return <div className={`p-5 rounded-2xl mb-4 ${styles[color]}`}>{children}</div>;
    };

    // ── Contenido por pestaña ─────────────────────────────────────────────────
    const renderContent = () => {
        switch (activeTab) {

            case "internaciones":
                return (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h3 className="text-3xl font-black uppercase tracking-tighter text-[#1C75BB] mb-6">Internaciones</h3>
                        <div className="bg-blue-50 p-6 rounded-3xl mb-8 border border-blue-100">
                            <TextP>Comprende la internación clínico quirúrgica y especializada, programada y de urgencia, de baja, mediana y alta complejidad, en todas sus modalidades: institucional, hospital de día, domiciliaria y en salud mental.</TextP>
                            <TextP className="mb-0">Incluye cobertura al <strong>100% en gastos, derechos, honorarios, material de contraste o radioactivo, medicamentos, elementos e instrumental necesarios, descartables o no</strong>, a través de los prestadores de cartilla de OSAPM de la R.A. Las prácticas diagnósticas y terapéuticas necesarias en internación también son <strong>sin cargo</strong> para el afiliado.</TextP>
                        </div>
                        <Subtitle>Modalidades y Cobertura</Subtitle>
                        <List items={[
                            "Institucional, Hospital de Día y Domiciliaria",
                            "Salud Mental",
                            "Cirugía Ambulatoria (cobertura idéntica a la de internación)",
                            "Prácticas diagnósticas y terapéuticas sin cargo",
                            "Internación de Urgencia",
                            "Internaciones para prácticas no contenidas en el PMO (derivadas a prestadores contratados)"
                        ]} />
                        <Subtitle>Requisitos para Internación Programada</Subtitle>
                        <TextP>El beneficiario deberá gestionar en OSAPM de la R.A. la <strong>autorización previa al ingreso</strong>. Las órdenes de internación deben cumplir con los siguientes datos:</TextP>
                        <List items={[
                            "Prescripción del médico tratante con datos completos del afiliado",
                            "Diagnóstico presuntivo o de certeza",
                            "Procedimiento a realizar",
                            "Fecha de internación y tiempo estimado de duración",
                            "Fecha de pedido, firma y sello del profesional"
                        ]} />
                        <div className="bg-slate-50 p-5 rounded-2xl border border-gray-100 mb-4">
                            <p style={{ fontSize: fontSize * 0.85 }} className="font-black text-[#1C75BB] flex items-center gap-2 uppercase mb-2">
                                <Clock size={15} /> Urgencias
                            </p>
                            <TextP className="mb-0">Debe solicitarse la autorización dentro de las <strong>24 horas posteriores al ingreso</strong>.</TextP>
                        </div>
                        <Subtitle>Extensión y Prórroga de Internación</Subtitle>
                        <TextP>OSAPM de la R.A. podrá extender la orden de internación fijando hasta un determinado número de días en función del proceso manifestado por el profesional prescribiente. En caso de necesidad de prorrogar la internación, lo hará la <strong>Auditoría Médica</strong> considerando la evolución del cuadro del paciente.</TextP>
                        <Subtitle>Internación Domiciliaria</Subtitle>
                        <TextP>Cuando el caso lo amerite y a solicitud de la entidad en la que cursó su internación, podrá extenderse en el domicilio del afiliado por un <strong>período limitado a la recuperación de la patología</strong> que provocó su internación institucional. Los servicios se prestarán de acuerdo con la solicitud de dicha entidad.</TextP>
                    </div>
                );

            case "medicamentos":
                return (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h3 className="text-3xl font-black uppercase tracking-tighter text-[#1C75BB] mb-6">Medicamentos</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                            <div className="p-5 bg-slate-50 rounded-2xl border border-gray-100 text-center">
                                <p className="text-3xl font-black text-[#00AEEF]">40%</p>
                                <p style={{ fontSize: fontSize * 0.8 }} className="font-bold text-[#1C75BB] uppercase">Ambulatorios (Anexo III Resol. 310/04)</p>
                            </div>
                            <div className="p-5 bg-slate-50 rounded-2xl border border-gray-100 text-center">
                                <p className="text-3xl font-black text-[#00AEEF]">70%</p>
                                <p style={{ fontSize: fontSize * 0.8 }} className="font-bold text-[#1C75BB] uppercase">Patologías Crónicas Prevalentes</p>
                            </div>
                            <div className="p-5 bg-[#1C75BB] rounded-2xl text-center">
                                <p className="text-3xl font-black text-white">100%</p>
                                <p style={{ fontSize: fontSize * 0.8 }} className="font-bold text-[#00AEEF] uppercase">Planes Especiales / Internación</p>
                            </div>
                        </div>
                        <Subtitle>Normas Generales de Prescripción</Subtitle>
                        <TextP>Para obtener el descuento establecido, el beneficiario debe presentar en las farmacias adheridas la receta completada de puño y letra por el profesional. Solo son válidas las recetas de profesionales e instituciones de Cartilla (incluyendo los del servicio de Emergencias y las Instituciones Sanatoriales incorporadas).</TextP>
                        <List items={[
                            "Prescripción obligatoria por Nombre Genérico (Ley 25.649 y Dto. 486/02)",
                            "Validez de la receta: 30 días desde la fecha de emisión",
                            "Máximo 2 productos por receta",
                            "Sin indicación de tamaño: se entrega el envase de menor tamaño",
                            "Antibióticos inyectables monodosis: hasta 5 frascos/ampollas por receta",
                            "Antibióticos inyectables multidosis: uno grande por receta",
                            "Únicamente profesionales e instituciones de Cartilla",
                            "Cobertura de tiras reactivas según Ley 26.914 de Diabetes"
                        ]} />
                        <Subtitle>Cobertura al 100%</Subtitle>
                        <List items={[
                            "Medicamentos en internación",
                            "Plan Materno Infantil",
                            "Medicamentos de provisión centralizada",
                            "Dapsona: tratamiento de la lepra",
                            "Inmunoglobulina antihepatitis B (según recomendaciones Anexo III)",
                            "Medicamentos anticonceptivos (Anexos III y IV)",
                            "Medicación analgésica oncológica (según protocolos aprobados)",
                            "Anticonceptivos intrauterinos, preservativos, diafragmas y espermicidas (Prog. Salud Sexual)",
                            "Levonogestrel (Resol. 232/2007)"
                        ]} />
                        <InfoBox color="orange">
                            <p style={{ fontSize: fontSize * 0.85 }} className="font-bold text-orange-700 uppercase">Exclusiones</p>
                            <p style={{ fontSize }} className="text-orange-800 mt-1">Se exceptúan de la cobertura: medicamentos de venta libre, productos dietéticos, jabones, dentífricos, champúes y cremas de uso cosmético en general.</p>
                        </InfoBox>
                        <Subtitle>Medicamentos de Provisión Centralizada</Subtitle>
                        <List items={[
                            "Insulinas",
                            "Tuberculostáticos",
                            "Drogas Oncológicas (ver norma de cobertura oncológica)",
                            "Eritropoyetina: tratamiento de anemia por Insuficiencia Renal Crónica",
                            "Mestinón: tratamiento de la miastenia gravis",
                            "Factor VIII y antihemofílicos",
                            "Medicación anti HIV y anti SIDA",
                            "Inmunosupresores (etapa posterior a trasplantes)"
                        ]} />
                        <Subtitle>Medicamentos de Alto Costo con Apoyo Financiero del SUR</Subtitle>
                        <TextP>Cada caso, en forma individual (excepto HIV), deberá presentar la documentación que la Obra Social solicite:</TextP>
                        <List items={[
                            "Interferón: esclerosis múltiple y hepatitis crónica por virus B o C",
                            "Copolímero: alternativa del interferón para esclerosis múltiple",
                            "Gestrinona y Danazol: endometriosis en segunda línea",
                            "Teicoplamina: infecciones por estafilococos meticilinoresistentes (ambulatorio)",
                            "Factores estimulantes de colonias granulocíticas: neutropenias severas (<1000 neutrófilos/mm³)",
                            "Dnasa y Pulmozine: enfermedad fibroquística pulmonar",
                            "Riluzole: esclerosis lateral amiotrófica",
                            "Somatotropina: síndrome de Turner e hipopituitarismo con trastornos del crecimiento",
                            "Octreotide: síndrome carcinoide y tumores hipofisiarios (acromegalia)",
                            "Cerezyme (Cederase) y L-Acetil Carnitina: enfermedad de Gaucher",
                            "Calcitriol e Inmunomoduladores",
                            "Medicación para Hepatitis Crónica (Resol. 350/2006)"
                        ]} />
                        <Subtitle>Programa Medicamentos para Patologías Crónicas Prevalentes</Subtitle>
                        <TextP>Para medicamentos comprendidos en la Resol. 310/04-MS, el beneficiario debe presentar a la Obra Social una <strong>ficha clínica</strong> completada por el médico tratante. Una vez evaluada y aprobada por el Auditor Médico, se comunicará al beneficiario la farmacia que proveerá los medicamentos por los períodos establecidos.</TextP>
                        <Subtitle>Cobertura Oncológica (100%)</Subtitle>
                        <TextP>La Obra Social brinda cobertura integral sin cargo a pacientes con enfermedades oncológicas:</TextP>
                        <List items={[
                            "Drogas oncológicas según protocolos reconocidos a nivel nacional (no experimentales)",
                            "Hormonoterapia en tumores sólidos",
                            "Ondansetrón para vómitos inducidos por drogas altamente emetizantes (provisión centralizada)",
                            "Medicación analgésica para manejo del dolor (protocolos aprobados)",
                            "Otra medicación no oncológica en protocolos: 40% a cargo de la Obra Social (dispensa en red de farmacias)"
                        ]} />
                        <TextP className="italic" style={{ fontSize: fontSize * 0.85, color: '#9ca3af' }}>Para la provisión inicial se requiere: solicitud de cobertura, planilla oncológica con firma y sello del médico, historia clínica con edad/peso/altura, diagnóstico, estadificación, estudios complementarios, anatomía patológica y protocolo quirúrgico si corresponde. Las entregas subsiguientes requieren ficha de tratamiento oncológico mensual.</TextP>
                        <Subtitle>Provisión de Drogas Antihemofílicas (100%)</Subtitle>
                        <TextP>El afiliado debe iniciar el trámite en Atención al Beneficiario de su Seccional, cumpliendo la Resol. N° 1561/12 y Resol. N° 1048/14 (SUR). El Auditor Médico evaluará la solicitud conforme al PMO y autorizará la cobertura con recupero a través del Área SUR.</TextP>
                    </div>
                );

            case "odontologia":
                return (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h3 className="text-3xl font-black uppercase tracking-tighter text-[#1C75BB] mb-6">Odontología</h3>
                        <TextP>Cobertura en concordancia con las Resoluciones 201/02-MS y N° 1991/05. Tienen derecho al uso de este servicio los afiliados en <strong>todas sus categorías</strong>.</TextP>
                        <div className="grid md:grid-cols-3 gap-4 mb-8">
                            {[
                                { nivel: "Nivel I", desc: "Odontología Básica" },
                                { nivel: "Nivel II", desc: "Odontología Especializada" },
                                { nivel: "Nivel III", desc: "Odontología Compleja" }
                            ].map((n, i) => (
                                <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-gray-100 text-center">
                                    <p style={{ fontSize: fontSize * 0.85 }} className="font-black text-[#00AEEF] uppercase">{n.nivel}</p>
                                    <p style={{ fontSize: fontSize * 0.85 }} className="font-bold text-[#1C75BB] uppercase mt-1">{n.desc}</p>
                                </div>
                            ))}
                        </div>
                        <Subtitle>Normativa de Atención</Subtitle>
                        <List items={[
                            "Atención por servicios propios o contratados",
                            "El afiliado abona el bono de Coseguro correspondiente a cada práctica en la Seccional de su jurisdicción",
                            "Quedan excluidos del pago de coseguros los beneficiarios bajo Programa Preventivo Odontológico",
                            "Las prácticas que superen el PMO quedan a criterio de la Auditoría Médica según cada caso"
                        ]} />
                        <div className="bg-[#1C75BB] text-white p-6 rounded-3xl mt-6">
                            <h4 style={{ fontSize }} className="font-black uppercase mb-2 flex items-center gap-2">
                                <Star size={16} className="text-[#00AEEF]" /> Plan 5000APM
                            </h4>
                            <p style={{ fontSize }} className="opacity-90">Los beneficiarios de este plan cuentan con la cobertura de <strong>un implante odontológico anual</strong>.</p>
                        </div>
                    </div>
                );

            case "protesis":
                return (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h3 className="text-3xl font-black uppercase tracking-tighter text-[#1C75BB] mb-6">Prótesis, Órtesis y Ópticas</h3>
                        <Subtitle>Prótesis e Implantes</Subtitle>
                        <div className="grid md:grid-cols-2 gap-4 mb-6">
                            <div className="p-5 bg-slate-50 rounded-2xl border border-gray-100">
                                <p className="text-2xl font-black text-[#00AEEF]">100%</p>
                                <p style={{ fontSize }} className="font-bold uppercase text-[#1C75BB]">Prótesis e implantes de colocación interna y permanente de fabricación nacional</p>
                            </div>
                            <div className="p-5 bg-slate-50 rounded-2xl border border-gray-100">
                                <p className="text-2xl font-black text-gray-400">50%</p>
                                <p style={{ fontSize }} className="font-bold uppercase text-[#1C75BB]">Órtesis y prótesis externas (50% restante a cargo del afiliado)</p>
                            </div>
                        </div>
                        <List items={[
                            "Las indicaciones médicas deben efectuarse por nombre genérico, sin mención o sugerencia de marca o proveedor",
                            "No se reconocen prótesis miogénicas o bioeléctricas (Resol. 1561/12)",
                            "El monto máximo a erogar por OSAPM será el de la menor cotización en plaza",
                            "En caso de inexistencia de prótesis nacional similar a la necesaria, se dará cobertura a prótesis importada",
                            "No se recibirán ni tramitarán solicitudes que no cumplan estrictamente el requisito de nombre genérico",
                            "En materiales con apoyo financiero del SUR, la Obra Social solicitará la documentación necesaria"
                        ]} />
                        <Subtitle>Ópticas</Subtitle>
                        <TextP>Beneficio exclusivo a través de <strong>ópticas contratadas</strong> (listados en Seccionales). OSAPM cubre hasta un valor prefijado; la diferencia entre dicho valor y el precio de la óptica queda a cargo del socio.</TextP>
                        <List items={[
                            "1 par de cristales blancos o de color por vicio de refracción (visión cercana o lejana)",
                            "Beneficiarios menores de 15 años: 1 par por año aniversario",
                            "Si el vicio de refracción evoluciona en lapsos menores, requiere autorización de Auditoría Médica",
                            "Lentes de contacto: 1 par anual para menores de 15 años (cualquier vicio de refracción y dioptría)",
                            "Se excluyen: cristales orgánicos, fotocromáticos, antireflex, metalizados, proximales y descartables",
                            "Se excluyen lentes de contacto esférico y especial",
                            "La modalidad de cobertura por reintegro es de carácter excepcional (urgencia o sin prestador contratado)"
                        ]} />
                        <TextP className="italic" style={{ fontSize: fontSize * 0.85, color: '#9ca3af' }}>Para acceder al beneficio, presentar la prescripción del especialista en la Seccional para su autorización y obtener el listado de ópticas autorizadas. Se recomienda consultar los valores cubiertos por OSAPM al momento de solicitar la autorización.</TextP>
                        <Subtitle>Otoamplífonos</Subtitle>
                        <TextP>La Obra Social asegura la provisión de <strong>otoamplífonos estándar al 100%</strong> en niños de hasta 15 años, con audífonos convencionales (Resol. N°201/02-MS y PMO).</TextP>
                        <TextP>Para los <strong>Planes 5000 y 5000APM</strong>, OSAPM de la R.A. otorgará al beneficiario un <strong>subsidio por única vez</strong> para paliar la erogación correspondiente.</TextP>
                    </div>
                );

            case "ambulatoria":
                return (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h3 className="text-3xl font-black uppercase tracking-tighter text-[#1C75BB] mb-6">Atención Ambulatoria</h3>
                        <Subtitle>Normas de Atención por Plan</Subtitle>
                        <div className="grid md:grid-cols-2 gap-4 mb-8">
                            <div className="p-5 bg-slate-50 rounded-2xl border border-gray-100">
                                <h5 style={{ fontSize }} className="font-bold uppercase text-[#1C75BB] mb-2">Plan 5000APM</h5>
                                <p style={{ fontSize }} className="text-gray-500">Libre elección entre los médicos contenidos en Cartilla. Pueden concurrir en forma directa a especialistas.</p>
                            </div>
                            <div className="p-5 bg-slate-50 rounded-2xl border border-gray-100">
                                <h5 style={{ fontSize }} className="font-bold uppercase text-[#1C75BB] mb-2">Otros Planes (MAP)</h5>
                                <p style={{ fontSize }} className="text-gray-500">Elección entre Médicos Referentes de Atención Personalizada para seguimiento integral. Las derivaciones a especialistas se realizan con Formulario de Referencia/Contrareferencia.</p>
                            </div>
                        </div>
                        <Subtitle>Médico Referente (MAP)</Subtitle>
                        <TextP>El Médico de Atención Personalizada confecciona la <strong>Historia Clínica Única</strong> con todos los datos necesarios para el cuidado de la salud, tratamiento de enfermedades, derivación oportuna a especialistas, solicitud de prácticas complementarias y seguimiento de planes preventivos.</TextP>
                        <Subtitle>Especialidades con Acceso Directo (sin Formulario de Derivación)</Subtitle>
                        <div className="flex flex-wrap gap-2 mb-8">
                            {["Cardiología", "Ginecología", "Hematología", "Oftalmología", "Urología"].map((esp) => (
                                <span key={esp} style={{ fontSize: fontSize * 0.8 }} className="px-3 py-1 bg-blue-100 text-[#1C75BB] font-black uppercase rounded-full">{esp}</span>
                            ))}
                        </div>
                        <Subtitle>Todas las Especialidades con Cobertura</Subtitle>
                        <List items={[
                            "Alergia", "Anatomía Patológica", "Anestesiología", "Cardiología", "Cirugía cardiovascular",
                            "Cirugía de cabeza y cuello", "Cirugía general", "Cirugía infantil", "Cirugía plástica reparadora",
                            "Cirugía de tórax", "Clínica Médica", "Dermatología", "Diagnóstico por imágenes (Rx, TAC, RMN, Ecografía)",
                            "Endocrinología", "Gastroenterología", "Hematología", "Hemoterapia", "Inmunología",
                            "Infectología", "Fisiatría / Rehabilitación", "Fonoaudiología", "Geriatría", "Ginecología",
                            "Medicina Familiar y General", "Medicina Nuclear (diagnóstico y tratamiento)", "Nefrología",
                            "Neonatología", "Neumonología", "Neurología y Neurocirugía", "Nutrición", "Obstetricia",
                            "Oftalmología", "Oncología y Onco-hematología", "Ortopedia y Traumatología", "Otorrinolaringología",
                            "Pediatría", "Proctología", "Psiquiatría", "Psicología", "Reumatología",
                            "Terapia Intensiva", "Terapia Radiante", "Urología"
                        ]} />
                        <Subtitle>Prácticas de Baja Complejidad</Subtitle>
                        <TextP>El afiliado solicita la autorización en cualquier Seccional de OSAPMRA y luego se comunica con el Centro de Diagnóstico de Cartilla para reservar turno. Debe concurrir con: <strong>orden del médico tratante con diagnóstico, autorización de la Obra Social, credencial vigente y documento de identidad</strong>.</TextP>
                        <TextP className="italic" style={{ fontSize: fontSize * 0.85, color: '#9ca3af' }}>En Centros de Diagnóstico que validan prestaciones on line, solo se requiere la solicitud de las prácticas y la credencial.</TextP>
                        <Subtitle>Prácticas de Mediana y Alta Complejidad</Subtitle>
                        <TextP>Requieren <strong>autorización previa de OSAPM de la R.A.</strong> en todos los casos. El Departamento de Auditoría podrá solicitar ampliación de historia clínica para emitir dictamen. En los planes que corresponda, el afiliado abona el coseguro establecido en Resol. N° 2018-3-APN-CNEPYSMVYM/MT.</TextP>
                        <Subtitle>Excepciones al Coseguro</Subtitle>
                        <List items={[
                            "Embarazadas: 100% de cobertura durante gestación, parto y hasta 30 días posteriores, y el recién nacido hasta cumplir 1 año de vida",
                            "Beneficiarios incluidos en Programas Preventivos",
                            "Discapacitados: presentar certificado oficial; se exceptúan consultas y prácticas relacionadas a la causa de discapacidad"
                        ]} />
                        <Subtitle>Urgencias y Emergencias</Subtitle>
                        <div className="space-y-3">
                            <div className="flex gap-4 items-center p-4 bg-red-50 rounded-2xl border border-red-100">
                                <AlertCircle className="text-red-500 shrink-0" />
                                <div>
                                    <p style={{ fontSize }} className="font-black text-red-600 uppercase">Código Rojo: Emergencia Médica</p>
                                    <p style={{ fontSize }} className="text-red-800">Riesgo de vida en cuestión de minutos.</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-center p-4 bg-orange-50 rounded-2xl border border-orange-100">
                                <AlertTriangle className="text-orange-500 shrink-0" />
                                <div>
                                    <p style={{ fontSize }} className="font-black text-orange-600 uppercase">Código Amarillo: Urgencia Médica</p>
                                    <p style={{ fontSize }} className="text-orange-800">Requiere atención rápida; hay más tiempo pero sin tratamiento puede haber riesgo de vida.</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-center p-4 bg-blue-50 rounded-2xl border border-blue-100">
                                <Info className="text-blue-400 shrink-0" />
                                <div>
                                    <p style={{ fontSize }} className="font-black text-blue-600 uppercase">Código Verde: Visita Médica</p>
                                    <p style={{ fontSize }} className="text-blue-800">El paciente requiere atención médica pero puede esperar (ej.: cuadros gripales).</p>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case "cardio":
                return (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h3 className="text-3xl font-black uppercase tracking-tighter text-[#1C75BB] mb-6">Programa Preventivo Cardiovascular</h3>
                        <TextP>Nuestro Plan de Prevención de Enfermedades Cardiovasculares tiene por objeto <strong>detectar precozmente factores de riesgo</strong> para el desarrollo de enfermedades cardiovasculares, favoreciendo el control de la morbimortalidad.</TextP>
                        <Subtitle>Objetivos</Subtitle>
                        <List items={[
                            "Diagnóstico precoz en beneficiarios con riesgo cardiovascular aumentado",
                            "Orientar a dichos beneficiarios para un correcto y oportuno tratamiento",
                            "Actividades de consejería sobre factores de riesgo cardiovascular y hábitos de vida",
                            "Promover hábitos de vida saludable",
                            "Promover la realización de exámenes periódicos de salud según edad y riesgo"
                        ]} />
                        <Subtitle>Guía de Examen Periódico de Salud (a partir de los 40 años)</Subtitle>
                        <List items={[
                            "Examen clínico anual completo",
                            "Control de tensión arterial",
                            "Control de talla y peso",
                            "Colesterol (periodicidad según resultado obtenido)",
                            "Glucemia cada 3 años si el resultado anterior fue normal",
                            "TSH en mujeres mayores de 50 años (periodicidad según resultado)",
                            "Detección de tabaquismo, alcoholismo y otras adicciones"
                        ]} />
                        <div className="bg-slate-50 p-5 rounded-2xl border border-gray-100 mt-4">
                            <p style={{ fontSize: fontSize * 0.85 }} className="font-bold text-[#1C75BB] uppercase mb-2">Materiales Informativos</p>
                            <TextP className="mb-0">Distribución de cartillas educativas sobre detección precoz de la diabetes, boletín informativo trimestral y página web con link específico para los programas. Disponemos de planillas de evaluación de factores de riesgo elaboradas por la Superintendencia de Servicios de Salud.</TextP>
                        </div>
                    </div>
                );

            case "uterino":
                return (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h3 className="text-3xl font-black uppercase tracking-tighter text-[#1C75BB] mb-6">Programa Preventivo — Cáncer de Cuello Uterino</h3>
                        <Subtitle>Objetivos</Subtitle>
                        <List items={[
                            "Controlar la mortalidad por cáncer de cuello de útero",
                            "Captar en forma oportuna y adecuada a las beneficiarias para su control periódico desde el inicio de relaciones sexuales",
                            "Realizar examen ginecológico y toma de muestra de Papanicolaou según guías de práctica clínica",
                            "Realizar tratamiento oportuno a lesiones detectadas en el examen periódico"
                        ]} />
                        <Subtitle>Protocolo de Examen Periódico</Subtitle>
                        <TextP>A partir del inicio de la actividad sexual se realizará <strong>una vez por año</strong>:</TextP>
                        <List items={["Consulta ginecológica anual", "Papanicolaou (PAP) anual"]} />
                        <TextP>En caso de <strong>PAP patológico</strong>, se efectuará:</TextP>
                        <List items={["Colposcopía", "Cepillado endocervical"]} />
                        <TextP>En caso de <strong>colposcopía patológica</strong>, se realizará:</TextP>
                        <List items={["Biopsia dirigida colposcópica"]} />
                        <div className="bg-slate-50 p-5 rounded-2xl border border-gray-100 mt-4">
                            <p style={{ fontSize: fontSize * 0.85 }} className="font-bold text-[#1C75BB] uppercase mb-2">Actividades del Programa</p>
                            <TextP className="mb-0">Entrega de material informativo y boletines por parte de los responsables de Atención al Beneficiario. Control de registros de cumplimiento del programa y seguimiento de eventos patológicos detectados por los profesionales contratados.</TextP>
                        </div>
                    </div>
                );

            case "mama":
                return (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h3 className="text-3xl font-black uppercase tracking-tighter text-[#1C75BB] mb-6">Programa Preventivo — Cáncer de Mama</h3>
                        <Subtitle>Objetivos</Subtitle>
                        <List items={[
                            "Controlar la mortalidad por cáncer de mama",
                            "Captar oportunamente a las beneficiarias para su control periódico a partir de los 40 años",
                            "Realizar examen mamario y mamografía en forma anual a partir de los 40 años",
                            "Realizar tratamiento oportuno a lesiones detectadas en el examen periódico"
                        ]} />
                        <Subtitle>Protocolo de Detección</Subtitle>
                        <TextP><strong>Autoexamen mamario:</strong> Una vez por mes a partir de los 20 años. La Obra Social informa sobre la técnica a través de folletos ilustrativos y boletín trimestral.</TextP>
                        <div className="grid md:grid-cols-2 gap-4 mb-6">
                            <div className="p-5 bg-slate-50 rounded-2xl border border-gray-100">
                                <p style={{ fontSize: fontSize * 0.85 }} className="font-black text-[#1C75BB] uppercase mb-2">Población con fuerte historia familiar</p>
                                <p style={{ fontSize }} className="text-gray-500">Una mamografía anual a partir de los <strong>35 años</strong>.</p>
                            </div>
                            <div className="p-5 bg-slate-50 rounded-2xl border border-gray-100">
                                <p style={{ fontSize: fontSize * 0.85 }} className="font-black text-[#1C75BB] uppercase mb-2">Población en riesgo estándar</p>
                                <p style={{ fontSize }} className="text-gray-500">Una mamografía anual a partir de los <strong>35 años</strong>.</p>
                            </div>
                        </div>
                        <TextP>Ante <strong>mamografía anormal o patológica</strong> se efectuará biopsia:</TextP>
                        <List items={["Biopsia positiva → tratamiento", "Biopsia negativa → control mamográfico al año"]} />
                        <div className="bg-slate-50 p-5 rounded-2xl border border-gray-100 mt-4">
                            <p style={{ fontSize: fontSize * 0.85 }} className="font-bold text-[#1C75BB] uppercase mb-2">Actividades del Programa</p>
                            <TextP className="mb-0">Entrega de material informativo y boletines trimestrales. Control de registros de cumplimiento y seguimiento de eventos patológicos. Facilitación del acceso a controles a través de folletería e internet.</TextP>
                        </div>
                    </div>
                );

            case "odonto-prev":
                return (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h3 className="text-3xl font-black uppercase tracking-tighter text-[#1C75BB] mb-6">Programa de Prevención Odontológica</h3>
                        <Subtitle>Objetivos</Subtitle>
                        <List items={[
                            "Estimular la consulta preventiva odontológica anual en la totalidad de los beneficiarios",
                            "Lograr que los beneficiarios adquieran hábitos de higiene y cuidado de la dentadura",
                            "Realizar al menos una consulta preventiva odontológica durante el embarazo",
                            "Promover la consulta del niño a la salida del primer diente",
                            "Promover la consulta anual desde los 3 a los 6 años de vida",
                            "Capacitar a los beneficiarios sobre técnica de cepillado y fluoración"
                        ]} />
                        <Subtitle>Recursos y Actividades</Subtitle>
                        <List items={[
                            "Guía de actividades odontológicas preventivas",
                            "Material informativo para beneficiarios",
                            "Talleres y distribución de material gráfico",
                            "Beneficiarios incluidos en este programa quedan eximidos del pago de coseguros"
                        ]} />
                    </div>
                );

            case "ive":
                return (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h3 className="text-3xl font-black uppercase tracking-tighter text-[#1C75BB] mb-6">IVE — Ley 27.610</h3>
                        <div className="bg-blue-50 p-6 rounded-3xl mb-8 border border-blue-100">
                            <TextP className="mb-0">OSAPM garantiza el acceso a la <strong>Interrupción Voluntaria del Embarazo (IVE)</strong> con <strong>cobertura integral y gratuita</strong>. Las prestaciones están incluidas en el PMO junto con diagnóstico, medicamentos y terapias de apoyo.</TextP>
                        </div>
                        <Subtitle>Derechos Garantizados</Subtitle>
                        <List items={[
                            "Decidir la interrupción del embarazo conforme a la ley",
                            "Requerir y acceder a la atención de la interrupción del embarazo",
                            "Recibir atención postaborto en todos los casos",
                            "Recibir atención sanitaria durante todo el proceso e información sobre el procedimiento y cuidados posteriores",
                            "Prevenir embarazos no intencionales mediante acceso a información, ESI y métodos anticonceptivos eficaces",
                            "Trato digno y respetuoso",
                            "Privacidad en la consulta y confidencialidad",
                            "Información actualizada, veraz y comprensible"
                        ]} />
                        <Subtitle>Plazos</Subtitle>
                        <TextP>El derecho a decidir y acceder a la IVE es garantizado <strong>hasta la semana 14 inclusive</strong> del proceso gestacional. Una vez solicitada la prestación, la Obra Social debe cumplir en un plazo máximo de <strong>10 días corridos</strong>.</TextP>
                        <Subtitle>Situaciones Especiales (Semana 15 en adelante)</Subtitle>
                        <List items={[
                            "Embarazo resultado de una violación: con requerimiento y declaración jurada ante el personal de salud (para menores de 13 años, la declaración jurada no es requerida)",
                            "Peligro para la vida o la salud de la persona gestante"
                        ]} />
                        <Subtitle>Consentimiento Informado</Subtitle>
                        <TextP>Se requiere el <strong>consentimiento informado por escrito</strong> de la persona gestante. Nadie puede ser sustituido en el ejercicio personal de este derecho. <strong>En ningún caso se requiere autorización judicial</strong> para acceder a la IVE.</TextP>
                        <Subtitle>Objeción de Conciencia</Subtitle>
                        <TextP>El profesional de salud que deba intervenir directamente puede ejercer la objeción de conciencia, pero debe <strong>derivar de buena fe</strong> a la paciente para que sea atendida por otro profesional en forma oportuna, sin demoras. No podrá negarse cuando la vida o salud de la persona gestante esté en peligro y requiera atención inmediata.</TextP>
                        <div className="p-6 bg-slate-900 text-white rounded-[2.5rem] mt-6">
                            <p style={{ fontSize: fontSize * 0.8 }} className="uppercase font-black text-[#00AEEF] mb-2">Cómo solicitar acceso a la IVE en OSAPM</p>
                            <p style={{ fontSize }} className="mb-2">Completá el formulario en nuestra web o comunicarte al <strong>0800 666 7276</strong>.</p>
                            <p style={{ fontSize: fontSize * 0.8 }} className="opacity-60">Más información: <span className="underline">argentina.gob.ar/salud/sexual/acceso-la-interrupcion-del-embarazo-ive-ile</span></p>
                        </div>
                    </div>
                );

            case "guia":
                return (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h3 className="text-3xl font-black uppercase tracking-tighter text-[#1C75BB] mb-6">Cómo Efectuar Trámites de Prestaciones Médicas</h3>
                        <Subtitle>Modalidad Online</Subtitle>
                        <TextP>La modalidad para efectuar trámites de manera online es a través del <strong>correo electrónico de tu Seccional</strong> o telefónicamente. Si tenés que concurrir personalmente, debés programar un turno dentro del horario de atención. Consultá los contactos en la sección de Oficinas: <span className="text-[#00AEEF]">osapm.org/#/oficinas</span></TextP>
                        <Subtitle>Trámites que Requieren Autorización Previa</Subtitle>
                        <List items={[
                            "Internaciones Programadas",
                            "Cirugías Programadas",
                            "Prácticas Ambulatorias",
                            "Tratamientos",
                            "Medicamentos Crónicos",
                            "Medicamentos para Diabetes",
                            "Medicamentos Especiales",
                            "Alta Complejidad (sujeto a Auditoría Médica)"
                        ]} />
                        <Subtitle>Datos Obligatorios en la Solicitud de Autorización</Subtitle>
                        <TextP>Para agilizar la respuesta, las órdenes deben contener:</TextP>
                        <List items={[
                            "Nombre, Apellido y número de afiliado",
                            "Plan al que pertenece",
                            "Práctica a efectuarse",
                            "Diagnóstico presuntivo o de certeza",
                            "Firma y sello del profesional solicitante",
                            "Fecha de emisión",
                            "Lugar donde se realizará la prestación",
                            "Correo al que debe remitirse la autorización"
                        ]} />
                        <TextP className="italic" style={{ fontSize: fontSize * 0.85, color: '#9ca3af' }}>Las autorizaciones pueden solicitarse en las Seccionales de OSAPM de la R.A. personalmente o por internet a <strong>autorizaciones@apm.org.ar</strong>. Si se realiza fuera de horario, se recibirá respuesta el día hábil posterior.</TextP>
                        <InfoBox color="orange">
                            <p style={{ fontSize: fontSize * 0.85 }} className="font-bold text-orange-700 uppercase leading-relaxed">
                                ⚠️ Recomendación: No solicitar turnos para la realización de prácticas o estudios hasta no contar con la correspondiente autorización.
                            </p>
                        </InfoBox>
                        <TextP className="italic" style={{ fontSize: fontSize * 0.85, color: '#9ca3af' }}>Las prestaciones de alta complejidad contenidas en el PMO serán derivadas a las instituciones que OSAPM de la R.A. tiene contratadas para tal fin, previa autorización de la Auditoría Médica, quien puede solicitar ampliación de historia clínica según el caso.</TextP>
                    </div>
                );

            case "identidad":
                return (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h3 className="text-3xl font-black uppercase tracking-tighter text-[#1C75BB] mb-6">Identidad de Género — Ley 26.743</h3>
                        <TextP>La Ley N° 26.743 entiende la identidad de género autopercibida como la vivencia interna e individual del género tal como cada persona la siente, la cual puede corresponder o no con el sexo asignado al momento del nacimiento, incluyendo la vivencia del cuerpo y otras expresiones de género.</TextP>
                        <Subtitle>Atención Sanitaria Integral (Mayores de 18 años)</Subtitle>
                        <TextP>Todas las personas mayores de 18 años pueden acceder a <strong>intervenciones quirúrgicas totales y parciales y/o tratamientos integrales hormonales</strong> para adecuar su cuerpo a su identidad de género autopercibida, <strong>sin necesidad de autorización judicial o administrativa</strong>. Solo se requiere el consentimiento informado de la persona.</TextP>
                        <TextP>Para los tratamientos hormonales, <strong>no es necesario acreditar voluntad de intervención quirúrgica</strong> de reasignación genital.</TextP>
                        <List items={[
                            "Cobertura 100% permanente dentro del PMO",
                            "Tratamientos hormonales sin acreditar cirugía previa",
                            "Acceso garantizado por efectores públicos, privados y Obras Sociales",
                            "Sin autorización judicial ni administrativa para mayores de 18 años"
                        ]} />
                        <Subtitle>Menores de Edad</Subtitle>
                        <TextP>Rigen los principios de <strong>capacidad progresiva e interés superior del niño/niña</strong> (Convención sobre los Derechos del Niño y Ley 26.061). Para intervenciones quirúrgicas totales o parciales se requiere adicionalmente la <strong>conformidad de la autoridad judicial competente</strong>, quien deberá expedirse en un plazo no mayor de <strong>60 días</strong> desde la solicitud.</TextP>
                        <div className="p-6 bg-slate-900 text-white rounded-[2.5rem] mt-6">
                            <p style={{ fontSize: fontSize * 0.8 }} className="uppercase font-black text-[#00AEEF] mb-2">Cómo solicitar acceso en OSAPM</p>
                            <p style={{ fontSize }} className="mb-2">Completá el formulario y nos pondremos en contacto para guiarte en el proceso. La obra social garantiza cobertura total e integral.</p>
                            <p style={{ fontSize: fontSize * 0.8 }} className="opacity-60">Más información: <span className="underline">argentina.gob.ar/justicia/derechofacil/leysimple/identidad-de-genero</span></p>
                        </div>
                    </div>
                );

            case "violencia":
                return (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h3 className="text-3xl font-black uppercase tracking-tighter text-[#1C75BB] mb-6">Violencia de Género</h3>
                        <div className="bg-red-50 p-6 rounded-3xl border border-red-100 mb-8">
                            <p className="text-red-700 font-black text-2xl mb-1">Línea 144</p>
                            <TextP className="text-red-800 mb-1">Gratuita, las 24 horas, todos los días.</TextP>
                            <TextP className="text-red-800 mb-0"><strong>WhatsApp:</strong> +54 9 11 2771-6463 | <strong>App:</strong> argentina.gob.ar/aplicaciones/linea-144</TextP>
                        </div>
                        <Subtitle>¿Qué es la Violencia de Género?</Subtitle>
                        <List items={[
                            "Psicológica: insultos, humillaciones, control, aislamiento",
                            "Sexual: actos forzados o sin consentimiento, negarse a usar preservativo",
                            "Física: empujones, golpes, patadas, arrojar objetos",
                            "Económica: privación de dinero, impedimento para trabajar, retención de identificaciones o pertenencias"
                        ]} />
                        <TextP className="italic" style={{ fontSize: fontSize * 0.85, color: '#9ca3af' }}>En general, la violencia de género se vuelve más frecuente y grave con el tiempo. Cuanto más tiempo se permanezca en una relación de violencia, mayores son las consecuencias físicas y emocionales.</TextP>
                        <Subtitle>¿Cómo Hacer una Denuncia?</Subtitle>
                        <List items={[
                            "Llamar a la Línea 144 para asesoramiento previo",
                            "Comisaría de la Mujer o Comisaría de Seguridad según localidad",
                            "Juzgado de Familia o Juzgado de Paz",
                            "Fiscalía de turno",
                            "CAJ (Centro de Acceso a la Justicia) más cercano: argentina.gob.ar/justicia/afianzar/caj/listado"
                        ]} />
                        <Subtitle>Plan de Seguridad para Salir de la Violencia</Subtitle>
                        <List items={[
                            "Localizar un vecino, amigo, conocido o refugio al que acudir si debés abandonar tu casa",
                            "Establecer una forma secreta de comunicarte con un vecino de confianza para emergencias",
                            "Preparar bolso de emergencia: documentos, teléfono, dinero, llaves, medicamentos, ropa y lista de contactos",
                            "Planificar adónde irás y cómo llegarás (medios de transporte, tarjeta SUBE)",
                            "Realizar llamadas en momentos seguros (cuando el agresor no esté cerca)",
                            "Mantener puertas y ventanas abiertas para que vecinos puedan escuchar en caso de necesidad"
                        ]} />
                        <Subtitle>Protección de Medios de Comunicación</Subtitle>
                        <List items={[
                            "Usar el teléfono con precaución: pueden interceptar llamadas y revisar registros",
                            "Usar computadoras en trabajo, lugares públicos o casa de amigos para buscar ayuda",
                            "Quitar dispositivos GPS del vehículo (pueden usarse para rastrear ubicación)",
                            "Cambiar con frecuencia las contraseñas de correo electrónico",
                            "Limpiar el historial del navegador regularmente"
                        ]} />
                        <Subtitle>Asistencia de OSAPM</Subtitle>
                        <TextP>Si sos afiliada y sufrís consecuencias físicas o mentales por violencia de género, solicitanos asistencia sanitaria. <strong>Garantizamos privacidad en la consulta.</strong></TextP>
                        <Subtitle>¿Cómo Ayudar a Alguien que Conocés?</Subtitle>
                        <List items={[
                            "Comunicarle de manera discreta los recursos disponibles: Línea 144 y WhatsApp",
                            "Mantener contacto regular para saber si se encuentra en seguridad",
                            "Asumir que quien ejerce violencia puede vigilar y controlar las comunicaciones",
                            "Al comunicarte, verificar si el agresor está presente ya que los horarios pueden variar"
                        ]} />
                    </div>
                );

            case "discapacidad":
                return (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h3 className="text-3xl font-black uppercase tracking-tighter text-[#1C75BB] mb-6">Discapacidad</h3>
                        <TextP>Ofrecemos una herramienta esencial para quienes requieren información actualizada y detallada sobre prestadores relacionados con servicios de discapacidad.</TextP>
                        <div className="grid md:grid-cols-2 gap-6 mt-8 mb-8">
                            <div className="p-8 bg-[#1C75BB] text-white rounded-[2.5rem] flex flex-col justify-between">
                                <Download size={32} className="text-[#00AEEF] mb-4" />
                                <div>
                                    <h4 style={{ fontSize }} className="font-black uppercase mb-2">Lista de Prestadores</h4>
                                    <p style={{ fontSize }} className="opacity-80 mb-2">Organizados por provincia y localidad con contactos directos.</p>
                                    <ul style={{ fontSize: fontSize * 0.85 }} className="opacity-70 mb-6 space-y-1">
                                        <li>• Nombres y ubicaciones por provincia y localidad</li>
                                        <li>• Contactos y correos electrónicos para consultas</li>
                                        <li>• Tipos de servicios por institución o profesional</li>
                                    </ul>
                                    <button style={{ fontSize: fontSize * 0.8 }} className="bg-white text-[#1C75BB] px-6 py-3 rounded-xl font-black uppercase tracking-widest hover:bg-[#00AEEF] hover:text-white transition-all">Descargar Lista</button>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="p-6 bg-slate-50 rounded-3xl border border-gray-100 flex items-center justify-between">
                                    <div>
                                        <h5 style={{ fontSize }} className="font-bold uppercase text-[#1C75BB]">Instructivo de Discapacidad</h5>
                                        <p style={{ fontSize: fontSize * 0.85 }} className="text-gray-500 mt-1">Guía de acceso a servicios. Contiene información muy importante; leer atentamente antes de gestionar.</p>
                                    </div>
                                    <Download size={18} className="text-[#00AEEF] shrink-0 ml-4" />
                                </div>
                                <div className="p-6 bg-slate-50 rounded-3xl border border-gray-100 flex items-center justify-between">
                                    <div>
                                        <h5 style={{ fontSize }} className="font-bold uppercase text-[#1C75BB]">Formulario de Medicación</h5>
                                        <p style={{ fontSize: fontSize * 0.85 }} className="text-gray-500 mt-1">Para requerir medicación específica para la discapacidad.</p>
                                    </div>
                                    <Download size={18} className="text-[#00AEEF] shrink-0 ml-4" />
                                </div>
                                <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100">
                                    <p style={{ fontSize: fontSize * 0.85 }} className="text-[#1C75BB] font-bold uppercase mb-1">Tipos de Servicios Incluidos</p>
                                    <p style={{ fontSize }} className="text-gray-500">Centros de día, rehabilitación, educación terapéutica, entre otros.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            default:
                return (
                    <div className="py-20 text-center space-y-4 text-[#1C75BB]">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Info size={40} className="opacity-20" />
                        </div>
                        <h3 className="text-xl font-bold uppercase tracking-tight">Información en Proceso</h3>
                        <p style={{ fontSize }} className="text-gray-400 max-w-xs mx-auto">Estamos cargando la normativa completa para esta sección.</p>
                    </div>
                );
        }
    };

    // ── Render principal ──────────────────────────────────────────────────────
    return (
        <section id="tramites" className="pt-32 pb-20 bg-white font-sans min-h-screen text-[#1C75BB]">
            <div className="max-w-7xl mx-auto px-6 md:px-12">

                {/* Cabecera */}
                <div className="mb-12 border-b border-gray-100 pb-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-[#111111]">
                                Guía de <span className="text-[#00AEEF]">Trámites</span>
                            </h2>
                            <p className="text-[#1C75BB] font-bold uppercase text-[10px] tracking-[0.3em] mt-2">Normativas y Prestaciones de OSAPM de la R.A.</p>
                        </div>

                        {/* Controles: solo tamaño de fuente */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">

                            {/* Control de tamaño de fuente */}
                            <div className="flex items-center gap-1 bg-slate-50 border border-gray-200 rounded-xl p-1" title="Ajustar tamaño de texto">
                                <button
                                    onClick={() => setFontSizeIdx(i => Math.max(0, i - 1))}
                                    disabled={fontSizeIdx === 0}
                                    className="p-2 rounded-lg hover:bg-white hover:shadow-sm disabled:opacity-30 transition-all text-[#1C75BB]"
                                >
                                    <ZoomOut size={15} />
                                </button>
                                <div className="flex gap-0.5 px-1">
                                    {FONT_SIZES.map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setFontSizeIdx(i)}
                                            className={`w-5 h-5 rounded-md transition-all text-[9px] font-black ${fontSizeIdx === i
                                                ? 'bg-[#1C75BB] text-white'
                                                : 'text-gray-400 hover:text-[#1C75BB]'
                                                }`}
                                        >
                                            {FONT_LABELS[i]}
                                        </button>
                                    ))}
                                </div>
                                <button
                                    onClick={() => setFontSizeIdx(i => Math.min(FONT_SIZES.length - 1, i + 1))}
                                    disabled={fontSizeIdx === FONT_SIZES.length - 1}
                                    className="p-2 rounded-lg hover:bg-white hover:shadow-sm disabled:opacity-30 transition-all text-[#1C75BB]"
                                >
                                    <ZoomIn size={15} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Menú lateral */}
                    <aside className="w-full lg:w-80 flex-shrink-0">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-1 gap-1 bg-slate-50/50 p-2 rounded-[2.5rem] border border-gray-100 lg:sticky lg:top-28">
                            {TRAMITES_DATA.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => handleTabChange(item.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-[10px] uppercase tracking-wider transition-all
                                    ${activeTab === item.id
                                            ? 'bg-[#1C75BB] text-white shadow-xl lg:translate-x-2'
                                            : 'text-[#1C75BB]/60 hover:bg-white hover:text-[#1C75BB]'
                                        }`}
                                >
                                    <span className={activeTab === item.id ? 'text-[#00AEEF]' : 'opacity-40'}>
                                        {item.icon}
                                    </span>
                                    <span className="text-left leading-tight">{item.label}</span>
                                </button>
                            ))}
                        </div>
                    </aside>

                    {/* Contenido */}
                    <main ref={mainRef} className="flex-1 bg-white rounded-[3rem] border border-gray-100 shadow-sm p-8 md:p-12 min-h-[650px] overflow-hidden">
                        {/* Buscador interno */}
                        <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-100">
                            <div className="relative flex-1 max-w-sm">
                                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    placeholder="Buscar en esta sección..."
                                    className="w-full pl-9 pr-8 py-2 rounded-xl border border-gray-200 bg-slate-50 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#00AEEF] focus:bg-white transition-all"
                                />
                                {searchQuery && (
                                    <button onClick={() => setSearchQuery("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                        <X size={14} />
                                    </button>
                                )}
                            </div>
                            {searchQuery && (
                                <span className="text-xs font-bold shrink-0 text-[#1C75BB]">
                                    {matchCount > 0 ? `${matchCount} coincidencia${matchCount !== 1 ? 's' : ''}` : <span className="text-gray-400">Sin resultados</span>}
                                </span>
                            )}
                        </div>
                        <div ref={contentRef}>
                            {renderContent()}
                        </div>
                    </main>
                </div>
            </div>
        </section>
    );
};