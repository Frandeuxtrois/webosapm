import React, { useState } from 'react';
import { Plus, Minus, HelpCircle, MessageCircle, Phone, ArrowRight } from 'lucide-react';

const PREGUNTAS_DATA = [
    {
        question: "¿Dónde llamo si tengo una Urgencia Médica?",
        answer: "En esta WEB tenés los números de teléfono para cada situación: Urgencia, Derivación, Atención al afiliado. Además dichos teléfonos están disponibles en nuestra APP.",
        category: "Emergencias"
    },
    {
        question: "¿Cómo tramito una autorización?",
        answer: "Podés tramitar las autorizaciones de prácticas enviando la receta médica al mail de tu seccional o desde la autogestión de este sitio ingresando con tu usuario, seleccionas el trámite, adjuntas la receta y enviás. Podés hacer el seguimiento de tu autorización desde esta página y descargarla cuando esté lista.",
        category: "Trámites"
    },
    {
        question: "¿Cómo obtengo mi credencial?",
        answer: "Ingresando con tu usuario podés generar tu credencial digital. También podés obtenerla de forma instantánea descargando nuestra APP oficial en tu celular.",
        category: "Afiliados"
    },
    {
        question: "¿Hay atención presencial en las Seccionales?",
        answer: "Debido al contexto actual, te sugerimos usar los canales digitales. Si es imprescindible que concurras a nuestras oficinas, contactate vía mail o telefónicamente y solicitá un turno previo. Es una forma de cuidarnos entre todos.",
        category: "Atención"
    },
    {
        question: "¿Ante síntomas o sospecha de Covid cómo debo proceder?",
        answer: "Mantenete aislado y avisá a tus contactos estrechos. Podés acudir a la Guardia más cercana o solicitar médico a domicilio (tené en cuenta que hay demoras). El profesional de salud te indicará los pasos a seguir. Si el resultado es positivo, contactate con nuestra Obra Social para el seguimiento.",
        category: "Salud"
    }
];

export const PreguntasFrecuentes: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

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

                {/* LISTADO DE PREGUNTAS (ACORDEÓN) */}
                <div className="space-y-4">
                    {PREGUNTAS_DATA.map((item, index) => (
                        <div
                            key={index}
                            className={`group border-2 rounded-3xl transition-all duration-300 ${openIndex === index ? 'border-[#00AEEF] bg-slate-50/50' : 'border-slate-100 hover:border-slate-200'
                                }`}
                        >
                            <button
                                onClick={() => togglePregunta(index)}
                                className="w-full flex items-center justify-between p-6 md:p-8 text-left outline-none"
                            >
                                <div className="flex items-center gap-4">
                                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg ${openIndex === index ? 'bg-[#00AEEF] text-white' : 'bg-slate-100 text-gray-400'
                                        }`}>
                                        {item.category}
                                    </span>
                                    <h3 className="text-lg md:text-xl font-bold tracking-tight text-[#111111]">
                                        {item.question}
                                    </h3>
                                </div>
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
                                        {item.answer}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

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