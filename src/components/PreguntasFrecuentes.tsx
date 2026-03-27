import React, { useState, useEffect } from 'react';
import { Plus, Minus, HelpCircle, MessageCircle, Phone, ArrowRight } from 'lucide-react';
import { apiService, PreguntaFrecuente } from '../services/api';

export const PreguntasFrecuentes: React.FC = () => {
    const [preguntas, setPreguntas] = useState<PreguntaFrecuente[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    useEffect(() => {
        apiService.getPreguntasFrecuentes(3)
            .then((data) => {
                setPreguntas(data);
            })
            .catch(() => setError(true))
            .finally(() => setLoading(false));
    }, []);

    const togglePregunta = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section id="preguntas-frecuentes" className="pt-32 pb-20 bg-white font-sans text-[#1C75BB] min-h-screen">
            <div className="max-w-4xl mx-auto px-6">

                {/* CABECERA */}
                <div className="text-center mb-16 space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#00AEEF]/10 rounded-full text-[#00AEEF]">
                        <HelpCircle size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Centro de Ayuda</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-[#111111]">
                        Preguntas <span className="text-[#00AEEF]">Frecuentes</span>
                    </h2>
                    <p className="text-gray-500 font-medium max-w-lg mx-auto leading-relaxed">
                        Resolvé tus dudas de forma inmediata. Si no encontrás lo que buscás, recordá que nuestros canales de atención están abiertos.
                    </p>
                </div>

                {/* ESTADOS: LOADING / ERROR / LISTADO */}
                {loading ? (
                    <div className="space-y-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-20 rounded-3xl bg-slate-100 animate-pulse" />
                        ))}
                    </div>
                ) : error ? (
                    <div className="text-center py-16 text-gray-400">
                        <HelpCircle size={40} className="mx-auto mb-4 opacity-40" />
                        <p className="font-semibold">No se pudieron cargar las preguntas frecuentes.</p>
                        <p className="text-sm mt-1">Por favor, intentá de nuevo más tarde.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {preguntas.map((item, index) => (
                            <div
                                key={index}
                                className={`group border-2 rounded-3xl transition-all duration-300 ${
                                    openIndex === index
                                        ? 'border-[#00AEEF] bg-slate-50/50'
                                        : 'border-slate-100 hover:border-slate-200'
                                }`}
                            >
                                <button
                                    onClick={() => togglePregunta(index)}
                                    className="w-full flex items-center justify-between p-6 md:p-8 text-left outline-none"
                                >
                                    <h3 className="text-lg md:text-xl font-bold tracking-tight text-[#111111] pr-4">
                                        {item.pregunta}
                                    </h3>
                                    <div className={`shrink-0 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`}>
                                        {openIndex === index ? (
                                            <Minus className="text-[#00AEEF]" size={24} />
                                        ) : (
                                            <Plus className="text-slate-300" size={24} />
                                        )}
                                    </div>
                                </button>

                                {openIndex === index && (
                                    <div className="px-6 md:px-8 pb-8 animate-in fade-in slide-in-from-top-2 duration-300">
                                        <div className="h-[2px] w-12 bg-[#00AEEF] mb-6 rounded-full opacity-50"></div>
                                        <p className="text-gray-600 leading-relaxed font-medium text-base">
                                            {item.respuesta}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* BANNER DE CONTACTO FINAL */}
                <div className="mt-20 grid md:grid-cols-2 gap-6">
                    <div className="p-8 bg-[#1C75BB] rounded-[2.5rem] text-white shadow-xl flex flex-col justify-between group cursor-pointer hover:scale-[1.02] transition-all">
                        <div className="space-y-4">
                            <MessageCircle size={40} className="text-[#00AEEF]" />
                            <h4 className="text-xl font-black uppercase tracking-tighter">¿Aún tenés dudas?</h4>
                            <p className="text-sm font-medium opacity-80 leading-relaxed">Nuestro equipo de atención al afiliado está listo para ayudarte con gestiones complejas.</p>
                        </div>
                        <button className="mt-8 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#00AEEF] group-hover:text-white transition-colors">
                            Contactar soporte <ArrowRight size={16} />
                        </button>
                    </div>

                    <div className="p-8 bg-slate-50 border-2 border-slate-100 rounded-[2.5rem] flex flex-col justify-between">
                        <div className="space-y-4">
                            <Phone size={40} className="text-[#00AEEF]" />
                            <h4 className="text-xl font-black uppercase tracking-tighter text-[#111111]">Mesa de Ayuda</h4>
                            <p className="text-sm font-bold text-gray-500">Llamanos de Lunes a Viernes de 8:00 a 20:00 hs para consultas administrativas.</p>
                        </div>
                        <p className="mt-8 text-2xl font-black text-[#1C75BB]">0800-666-7276</p>
                    </div>
                </div>

            </div>
        </section>
    );
};
