import React, { useState } from 'react';
import { FileText, Download, ArrowDownToLine, ZoomIn, ZoomOut } from 'lucide-react';

const FONT_SIZES = [13, 14, 15, 16, 18];
const FONT_LABELS = ["XS", "S", "M", "L", "XL"];

const FORMULARIOS = [
    {
        title: "Diabetes",
        desc: "Planilla de solicitud para el programa de cobertura de diabetes.",
        file: "/formularios/formulario_diabetes.pdf",
    },
    {
        title: "Excepciones",
        desc: "Solicitud de cobertura excepcional de prestaciones.",
        file: "/formularios/formulario_excepciones.pdf",
    },
    {
        title: "Discapacidad — Medicamentos",
        desc: "Solicitud de medicamentos para beneficiarios con discapacidad.",
        file: "/formularios/medicamentos_discapacidad.pdf",
    },
    {
        title: "Crónicos",
        desc: "Cobertura de medicamentos para patologías crónicas prevalentes.",
        file: "/formularios/formulario_cronicidad.pdf",
    },
    {
        title: "Reintegro Celíacos",
        desc: "Solicitud de reintegro para pacientes celíacos.",
        file: "/formularios/reintegro_celiacos.pdf",
    },
    {
        title: "Prestadores de Discapacidad",
        desc: "Listado de prestadores habilitados para servicios de discapacidad.",
        file: "/formularios/prestadores_discapacidad.pdf",
    },
    {
        title: "Instructivo de Discapacidad",
        desc: "Guía de acceso a servicios. Leer antes de gestionar.",
        file: "/formularios/instructivo_discapacidad.pdf",
    },
];

export const FormularioSalud: React.FC = () => {
    const [fontSizeIdx, setFontSizeIdx] = useState(2);
    const fontSize = FONT_SIZES[fontSizeIdx];

    return (
        <section className="pt-20 min-h-screen bg-slate-50 font-sans text-[#1C75BB] animate-in fade-in duration-500">

            <div className="bg-[#1C75BB] px-6 md:px-12 py-10 relative">
                <div className="flex flex-col items-center text-center gap-3">
                    <div className="p-3 bg-white/10 rounded-2xl">
                        <FileText size={28} className="text-[#00AEEF]" />
                    </div>
                    <div>
                        <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-white leading-none">
                            Formularios de <span className="text-[#00AEEF]">Salud</span>
                        </h1>
                        <p className="text-white/60 font-bold uppercase text-[10px] tracking-[0.25em] mt-1">
                            Descargá, completá y presentá en tu seccional
                        </p>
                    </div>
                </div>

                <div className="absolute right-6 md:right-12 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-white/10 border border-white/20 rounded-xl p-1">
                    <button
                        onClick={() => setFontSizeIdx(i => Math.max(0, i - 1))}
                        disabled={fontSizeIdx === 0}
                        className="p-1.5 rounded-lg hover:bg-white/10 disabled:opacity-30 transition-all text-white"
                    >
                        <ZoomOut size={14} />
                    </button>
                    <div className="flex gap-0.5 px-1">
                        {FONT_SIZES.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setFontSizeIdx(i)}
                                className={`w-5 h-5 rounded-md transition-all text-[9px] font-black ${
                                    fontSizeIdx === i ? 'bg-[#00AEEF] text-white' : 'text-white/50 hover:text-white'
                                }`}
                            >
                                {FONT_LABELS[i]}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={() => setFontSizeIdx(i => Math.min(FONT_SIZES.length - 1, i + 1))}
                        disabled={fontSizeIdx === FONT_SIZES.length - 1}
                        className="p-1.5 rounded-lg hover:bg-white/10 disabled:opacity-30 transition-all text-white"
                    >
                        <ZoomIn size={14} />
                    </button>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 md:px-12 py-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {FORMULARIOS.map((form, idx) => (
                        <a
                            key={idx}
                            href={form.file}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center gap-4 bg-white border border-gray-100 rounded-2xl px-5 py-5 shadow-sm hover:border-[#00AEEF] hover:shadow-lg transition-all duration-200"
                        >
                            <div className="w-10 h-10 bg-[#00AEEF]/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-[#00AEEF] transition-colors duration-200">
                                <ArrowDownToLine size={18} className="text-[#00AEEF] group-hover:text-white transition-colors duration-200" />
                            </div>

                            <div className="flex-1 min-w-0">
                                <p style={{ fontSize }} className="font-black uppercase tracking-tight text-[#1C75BB] group-hover:text-[#00AEEF] transition-colors leading-tight">
                                    {form.title}
                                </p>
                                <p style={{ fontSize: fontSize * 0.87 }} className="text-gray-400 font-medium mt-0.5 leading-snug">
                                    {form.desc}
                                </p>
                            </div>

                            <div className="flex-shrink-0 flex items-center gap-1 text-[#00AEEF] font-black uppercase tracking-widest opacity-50 group-hover:opacity-100 transition-opacity" style={{ fontSize: 10 }}>
                                <Download size={12} />
                                PDF
                            </div>
                        </a>
                    ))}
                </div>

                <p className="text-center text-gray-400 font-bold uppercase tracking-[0.2em] mt-6 text-[9px] italic">
                    Dudas: consultá en tu seccional o escribinos a <span className="not-italic text-[#00AEEF]">autorizaciones@apm.org.ar</span>
                </p>
            </div>
        </section>
    );
};
