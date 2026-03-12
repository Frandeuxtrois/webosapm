import React, { useState, useEffect } from 'react';
import {
    MapPin, Phone, Clock, Stethoscope,
    CreditCard, HeartPulse, Info, Navigation
} from 'lucide-react'; // Eliminado ChevronRight y Loader2 que no se usaban
import { Button } from './ui/Button';

const IMAGES = [
    "/centro-medico/foto1.png",
    "/centro-medico/foto2.jpg",
    "/centro-medico/foto3.jpg",
    "/centro-medico/foto4.jpg",
    "/centro-medico/foto5.jpg"
];

const MEDICAL_SPECIALTIES = [
    "Cardiología", "Cirugía General", "Clínica Médica", "Dermatología",
    "Diabetología", "Endocrinología", "Gastroenterología", "Ginecología",
    "Kinesiología", "Neumonología", "Nutrición", "Osteopatía",
    "Otorrinolaringología", "Pediatría", "Traumatología", "Urología"
];

const DENTAL_SPECIALTIES = [
    "Odontología general", "Odontopediatría", "Periodoncia", "Ortodoncia",
    "Prótesis", "Implantes", "Radiología dental", "Cirugías"
];

export const CentroMedico: React.FC = () => {
    const [currentImg, setCurrentImg] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentImg((prev) => (prev + 1) % IMAGES.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section id="centro-medico" className="pt-20 bg-white font-sans text-[#1C75BB] overflow-x-hidden animate-in fade-in duration-700">

            {/* CARRUSEL HERO */}
            <div className="relative h-[400px] md:h-[600px] w-full overflow-hidden bg-slate-100">
                {IMAGES.map((img, idx) => (
                    <div
                        key={idx}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === currentImg ? 'opacity-100' : 'opacity-0'}`}
                    >
                        <img
                            src={img}
                            className="w-full h-full object-cover object-center brightness-[0.6]"
                            alt={`Instalaciones Centro Médico ${idx + 1}`}
                        />
                    </div>
                ))}

                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 bg-black/10">
                    <h1 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter drop-shadow-2xl">
                        Centro Médico <span className="text-[#00AEEF]">OSAPM</span>
                    </h1>
                    <p className="mt-4 text-white text-sm md:text-lg font-bold uppercase tracking-[0.2em] md:tracking-[0.4em] opacity-90">
                        Excelencia Médica a tu servicio
                    </p>
                </div>

                {/* Barra de Contacto */}
                <div className="absolute bottom-0 left-0 w-full bg-white/95 backdrop-blur-md border-t border-gray-100 py-4 md:py-8 px-4 flex flex-col md:flex-row justify-center items-center gap-4 md:gap-12 shadow-2xl">
                    <div className="flex items-center gap-2">
                        <MapPin className="text-[#00AEEF]" size={20} />
                        <p className="font-bold text-[11px] md:text-sm uppercase">Ecuador 949, CABA</p>
                    </div>
                    <div className="hidden md:block h-6 w-[1px] bg-gray-200"></div>
                    <div className="flex items-center gap-2">
                        <Phone className="text-[#00AEEF]" size={20} />
                        <p className="font-bold text-[11px] md:text-sm uppercase">(011) 2034 - 1000</p>
                    </div>
                    <div className="hidden md:block h-6 w-[1px] bg-gray-200"></div>
                    <div className="flex items-center gap-2">
                        <Clock className="text-[#00AEEF]" size={20} />
                        <p className="font-bold text-[11px] md:text-sm uppercase">Lun a Vie 8:00 - 20:00</p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 lg:px-16 py-12 md:py-24">

                {/* ESPECIALIDADES MÉDICAS */}
                <div className="mb-24">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="p-3 bg-[#00AEEF]/10 rounded-2xl text-[#00AEEF]">
                            <Stethoscope size={32} />
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-[#1C75BB]">Especialidades</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                        {MEDICAL_SPECIALTIES.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-4 p-5 bg-white border border-gray-100 rounded-2xl shadow-sm hover:border-[#00AEEF] hover:shadow-xl transition-all group cursor-default">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#00AEEF] group-hover:scale-150 transition-transform"></div>
                                <p className="font-bold text-[13px] uppercase tracking-wide text-[#1C75BB] group-hover:text-[#00AEEF] transition-colors">{item}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* BLOQUE ODONTOLOGÍA */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-24">
                    <div className="lg:col-span-2 bg-[#1C75BB] rounded-[3rem] p-10 md:p-16 text-white shadow-2xl relative overflow-hidden group">
                        <HeartPulse className="absolute -right-10 -bottom-10 w-64 h-64 opacity-5 group-hover:scale-110 transition-transform duration-1000" />
                        <div className="relative z-10">
                            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-10 flex items-center gap-4">
                                <span className="bg-white text-[#1C75BB] px-4 py-1 rounded-2xl text-2xl">ODONTOLOGÍA</span>
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                                {DENTAL_SPECIALTIES.map((item, idx) => (
                                    <div key={idx} className="flex items-center border-b border-white/20 pb-3 hover:border-white transition-colors">
                                        <p className="font-bold text-lg uppercase tracking-tight">{item}</p>
                                        {/* Flecha eliminada */}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Tarjeta Medios de Pago */}
                    <div className="bg-[#F8FAFC] rounded-[3rem] p-10 border border-gray-100 shadow-lg flex flex-col justify-between">
                        <div>
                            <CreditCard size={40} className="text-[#00AEEF] mb-8" />
                            <h3 className="text-2xl font-black uppercase tracking-tight mb-4 text-[#1C75BB] leading-tight">Medios de Pago</h3>
                            <p className="text-gray-500 font-medium text-sm leading-relaxed mb-8">
                                Aceptamos todas las tarjetas para trabajos de <strong>Prótesis y Ortodoncia</strong>.
                            </p>
                            <div className="p-5 bg-white border border-[#00AEEF]/20 border-l-[6px] border-l-[#00AEEF] rounded-r-2xl shadow-sm">
                                <p className="text-[#1C75BB] font-black text-2xl leading-none">3 Cuotas</p>
                                <p className="text-[10px] uppercase font-bold text-gray-400 mt-2 tracking-widest text-left">Sin interés bancario</p>
                            </div>
                        </div>
                        <div className="mt-8 flex items-start gap-3 bg-[#00AEEF]/5 p-4 rounded-2xl border border-[#00AEEF]/10">
                            <Info className="text-[#00AEEF] shrink-0 mt-0.5" size={18} />
                            <p className="text-[10px] font-bold text-[#1C75BB] leading-normal uppercase text-left">
                                Centro Médico y Seccionales habilitadas.
                            </p>
                        </div>
                    </div>
                </div>

                {/* GOOGLE MAPS */}
                <div className="mb-24">
                    <div className="flex items-center gap-4 mb-10 text-[#1C75BB]">
                        <div className="p-3 bg-[#00AEEF]/10 rounded-2xl text-[#00AEEF]">
                            <Navigation size={32} />
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight">Cómo Llegar</h2>
                    </div>

                    <div className="w-full h-[350px] md:h-[500px] rounded-[3rem] overflow-hidden shadow-2xl border-4 border-slate-50 relative group">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3283.991152763868!2d-58.4031206!3d-34.6043813!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bccaea6646f903%3A0x70677464019a3b5f!2sEcuador%20949%2C%20C1214%20CABA%2C%20Argentina!5e0!3m2!1ses-419!2sar!4v1710000000000!5m2!1ses-419!2sar"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            className="grayscale-[0.4] group-hover:grayscale-0 transition-all duration-1000 contrast-[1.1]"
                        ></iframe>
                    </div>
                </div>

                {/* BOTÓN FINAL */}
                <div className="text-center px-4">
                    <p className="text-gray-400 font-bold uppercase tracking-[0.2em] mb-6 text-xs italic">Consultas y turnos telefónicos</p>
                    <a
                        href="tel:01120341000"
                        className="inline-flex w-full md:w-auto bg-[#00AEEF] text-white px-10 md:px-20 py-5 rounded-full font-black uppercase tracking-widest text-[13px] md:text-sm hover:bg-[#1C75BB] transition-all shadow-2xl shadow-blue-500/30 active:scale-95 text-center justify-center items-center gap-3"
                    >
                        <Phone size={20} />
                        Llamar ahora: (011) 2034 - 1000
                    </a>
                </div>

            </div>
        </section>
    );
};