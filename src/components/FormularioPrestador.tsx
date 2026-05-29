import React from 'react';
import { ClipboardList, ArrowDownToLine, Download, Info } from 'lucide-react';

export const FormularioPrestador: React.FC = () => {
    return (
        <section className="pt-20 min-h-screen bg-slate-50 font-sans text-[#1C75BB] animate-in fade-in duration-500">

            <div className="bg-[#1C75BB] px-6 md:px-12 py-10">
                <div className="flex flex-col items-center text-center gap-3">
                    <div className="p-3 bg-white/10 rounded-2xl">
                        <ClipboardList size={28} className="text-[#00AEEF]" />
                    </div>
                    <div>
                        <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-white leading-none">
                            Formulario de <span className="text-[#00AEEF]">Prestador</span>
                        </h1>
                        <p className="text-white/60 font-bold uppercase text-[10px] tracking-[0.25em] mt-1">
                            Documentación para prestadores de OSAPM
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-6 md:px-12 py-8 space-y-4">

                <a
                    href="/formularios/formulario_prestador/rendicion_prestadores.pdf"
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-5 bg-white border border-gray-100 rounded-2xl px-6 py-5 shadow-sm hover:border-[#00AEEF] hover:shadow-lg transition-all duration-200"
                >
                    <div className="w-12 h-12 bg-[#00AEEF]/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-[#00AEEF] transition-colors duration-200">
                        <ArrowDownToLine size={22} className="text-[#00AEEF] group-hover:text-white transition-colors duration-200" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-black uppercase tracking-tight text-[#1C75BB] group-hover:text-[#00AEEF] transition-colors text-base">
                            Planilla de Rendición de Prestadores
                        </h3>
                        <p className="text-gray-400 text-[13px] font-medium mt-0.5">
                            Formulario oficial para la rendición de prestaciones médicas ante OSAPM.
                        </p>
                    </div>
                    <div className="flex items-center gap-1.5 text-[#00AEEF] font-black text-[10px] uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-opacity flex-shrink-0">
                        <Download size={13} />
                        PDF
                    </div>
                </a>

                <div className="flex gap-4 p-5 bg-white border border-gray-100 rounded-2xl shadow-sm">
                    <Info size={18} className="text-[#00AEEF] flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="font-black text-[#1C75BB] uppercase text-[11px] tracking-wider mb-1">¿Ya sos prestador?</p>
                        <p className="text-gray-500 text-[13px] leading-relaxed">
                            Accedé al <span className="font-black text-[#1C75BB]">Portal de Prestadores</span> para gestionar tus liquidaciones, tarifario y subir documentación directamente desde tu cuenta.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};
