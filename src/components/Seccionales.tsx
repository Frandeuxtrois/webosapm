import React, { useState } from 'react';
import { MapPin, Phone, Mail, Search, Navigation, Building2, ChevronRight } from 'lucide-react';

const SECCIONALES_DATA = [
    { nombre: "BAHIA BLANCA", direccion: "ALMAFUERTE 517", telefono: "(0291) 452-9718 - 15 503-3892", email: "sec_bahiablanca@apm.org.ar" },
    { nombre: "BARILOCHE", direccion: "COMBATE DEL RINCON 1881, Piso PB", telefono: "(0294) 432-7574", email: "sec_bariloche@apm.org.ar" },
    { nombre: "CAPITAL FEDERAL", direccion: "CÓRDOBA 2939", telefono: "(011) 4963-3231/7445", email: "sec_capital@apm.org.ar" },
    { nombre: "CATAMARCA / LA RIOJA", direccion: "CONGRESAL CENTENO 156", telefono: "(0383) 443-2433 - 383 496-2304", email: "sec_catamarca@apm.org.ar" },
    { nombre: "CENTRO BUENOS AIRES (AZUL)", direccion: "ARENALES 764", telefono: "(02281) 15 51-2952", email: "sec_azul@apm.org.ar" },
    { nombre: "CENTRO BUENOS AIRES (TANDIL)", direccion: "SERRANO 1004", telefono: "(0249) 15 450-6415", email: "sec_tandil@apm.org.ar" },
    { nombre: "CENTRO-NOROESTE", direccion: "DR. REAL 963", telefono: "(011) 15 3667-1325", email: "sec_centronoroeste@apm.org.ar" },
    { nombre: "CHACO", direccion: "CERVANTES 134", telefono: "(0362) 15 437-4829", email: "sec_chaco@apm.org.ar" },
    { nombre: "COMODORO RIVADAVIA", direccion: "LA PRENSA 865", telefono: "(0297) 541-3853", email: "sec_crivadavia@apm.org.ar" },
    { nombre: "CORRIENTES", direccion: "F.J. CABRAL 2218", telefono: "(0379) 15 452-1301", email: "sec_corrientes@apm.org.ar" },
    { nombre: "JUJUY", direccion: "PJE. ERNESTO CLAROS 33", telefono: "388 442-9835", email: "sec_jujuy@apm.org.ar" },
    { nombre: "JUNIN", direccion: "RAMÓN FALCÓN 170", telefono: "(0236) 15 441-9543", email: "sec_junin@apm.org.ar" },
    { nombre: "LA PAMPA", direccion: "ELISEO TELLO 450", telefono: "295 481-0359", email: "sec_lapampa@apm.org.ar" },
    { nombre: "LA PLATA", direccion: "CALLE 38 640", telefono: "(0221) 421-6034 - (0221) 421-5265", email: "sec_laplata@apm.org.ar" },
    { nombre: "MAR DEL PLATA", direccion: "25 DE MAYO 3334", telefono: "(0223) 15 686-0430", email: "sec_mardelplata@apm.org.ar" },
    { nombre: "MENDOZA", direccion: "RIVADAVIA 76, Piso PB, Dpto: D", telefono: "261 508-1295", email: "sec_mendoza@apm.org.ar" },
    { nombre: "MISIONES", direccion: "AV. ROQUE SÁENZ PEÑA 2468", telefono: "376 429-0947", email: "sec_misiones@apm.org.ar" },
    { nombre: "NEUQUEN/R.NEGRO", direccion: "PEHUÉN 868", telefono: "(0299) 442-8163 - 229 511-0148", email: "sec_neuquen@apm.org.ar" },
    { nombre: "NOROESTE", direccion: "RONDEAU 2236", telefono: "(011) 7925-6724 - (011) 6654-6599", email: "sec_noroeste@apm.org.ar" },
    { nombre: "NORTE", direccion: "HILARIO DE LA QUINTANA 2899", telefono: "(011) 4790-9634 - 15 3667-6042", email: "secretarianorte@apm.org.ar" },
    { nombre: "OESTE", direccion: "YATAY 448", telefono: "(011) 2116-1477 - 15-3667-1228", email: "sec_oeste@apm.org.ar" },
    { nombre: "RIO CUARTO", direccion: "SADI CARNOT 456", telefono: "(0358) 503-2864", email: "sec_riocuarto@apm.org.ar" },
    { nombre: "SALTA", direccion: "ALVARADO 1262", telefono: "(0387) 422-1957", email: "sec_salta@apm.org.ar" },
    { nombre: "SAN JUAN", direccion: "25 DE MAYO (OESTE) 178", telefono: "(0264) 15 586-6510", email: "sec_sanjuan@apm.org.ar" },
    { nombre: "SAN LUIS", direccion: "BARRIO 292 MZ 6 CASA 78", telefono: "(0266) 15 457-8270", email: "sec_sanluis@apm.org.ar" },
    { nombre: "SANTA FE", direccion: "JUAN J. PASO 3462", telefono: "(0342) 459-8053", email: "sec_santafe@apm.org.ar" },
    { nombre: "SEDE CENTRAL", direccion: "AV. AVELLANEDA 2144", telefono: "(011) 4633-7878", email: "info@apm.org.ar" },
    { nombre: "SGO. DEL ESTERO", direccion: "24 DE SEPTIEMBRE 1394", telefono: "(0385) 425-3033", email: "sec_sgoestero@apm.org.ar" },
    { nombre: "SUDOESTE", direccion: "PROF. MARIÑO 894", telefono: "Cel: 11-3667-8564", email: "sec_sudoeste@apm.org.ar" },
    { nombre: "SUR", direccion: "GUIDO SPANO 629", telefono: "Cel. 15 3667-6377", email: "sec_sur@apm.org.ar" },
    { nombre: "TRELEW", direccion: "CENTENARIO 394", telefono: "280 436-3164", email: "sec_trelew@apm.org.ar" },
    { nombre: "TUCUMAN", direccion: "AV SÁENZ PEÑA 570", telefono: "(0381) 231-8502", email: "sec_tucuman@apm.org.ar" },
];

export const Seccionales: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredSeccionales = SECCIONALES_DATA.filter(sec =>
        sec.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sec.direccion.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <section id="seccionales" className="pt-32 pb-20 bg-white font-sans text-[#1C75BB] overflow-x-hidden">
            <div className="max-w-7xl mx-auto px-6 md:px-12">

                {/* HEADER */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#00AEEF]/10 rounded-full">
                            <Navigation size={16} className="text-[#00AEEF]" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00AEEF]">Presencia Nacional</span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">
                            ¿Dónde nos <br /> <span className="text-[#00AEEF]">Encontramos?</span>
                        </h2>
                    </div>

                    {/* BUSCADOR MINIMALISTA */}
                    <div className="relative w-full md:w-96 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#00AEEF] transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Buscar seccional o ciudad..."
                            className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-4 font-bold outline-none focus:border-[#00AEEF] focus:bg-white transition-all shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* MAPA PRINCIPAL */}
                <div className="w-full h-[400px] bg-slate-100 rounded-[2.5rem] mb-20 overflow-hidden shadow-2xl border-4 border-white relative">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d210147.2831818296!2d-58.5733842!3d-34.6156624!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bcca3b41c00001%3A0x391994017770bc1d!2sObra%20Social%20de%20Agentes%20de%20Propaganda%20M%C3%A9dica!5e0!3m2!1ses-419!2sar!4v1710000000000!5m2!1ses-419!2sar"
                        width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"
                        className="grayscale hover:grayscale-0 transition-all duration-700 contrast-[1.1]"
                    ></iframe>
                    <div className="absolute top-6 left-6 bg-[#1C75BB] text-white p-4 rounded-2xl shadow-xl hidden lg:block border border-white/20">
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#00AEEF] mb-1">Mapa Interactivo</p>
                        <p className="text-xs font-bold opacity-80">Hacé click en los pines para ver detalles.</p>
                    </div>
                </div>

                {/* GRILLA DE SECCIONALES */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredSeccionales.map((sec, idx) => (
                        <div key={idx} className="group bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:border-[#00AEEF]/30 transition-all relative overflow-hidden flex flex-col justify-between">
                            <div className="absolute top-0 left-0 w-1.5 h-full bg-[#00AEEF] opacity-0 group-hover:opacity-100 transition-all"></div>

                            <div>
                                <div className="flex justify-between items-start mb-6">
                                    <div className="p-3 bg-slate-50 rounded-xl text-gray-400 group-hover:bg-[#00AEEF]/10 group-hover:text-[#00AEEF] transition-colors">
                                        <Building2 size={24} />
                                    </div>
                                    <ChevronRight size={16} className="text-slate-200 group-hover:text-[#00AEEF] transition-colors" />
                                </div>
                                <h3 className="text-xl font-black uppercase tracking-tight mb-2 leading-tight">
                                    {sec.nombre}
                                </h3>
                                <div className="space-y-4 pt-4 border-t border-slate-50">
                                    <div className="flex items-start gap-3">
                                        <MapPin size={18} className="text-[#00AEEF] shrink-0 mt-1" />
                                        <p className="text-sm font-bold opacity-70 italic">{sec.direccion}</p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Phone size={18} className="text-[#00AEEF] shrink-0 mt-1" />
                                        <p className="text-sm font-black">{sec.telefono}</p>
                                    </div>
                                    {sec.email && (
                                        <div className="flex items-center gap-3">
                                            <Mail size={18} className="text-[#00AEEF] shrink-0" />
                                            <p className="text-xs font-bold truncate">{sec.email}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <button className="mt-8 w-full py-3 bg-slate-50 text-slate-400 font-black text-[10px] uppercase tracking-widest rounded-xl group-hover:bg-[#00AEEF] group-hover:text-white transition-all shadow-inner">
                                Ver en Mapa
                            </button>
                        </div>
                    ))}
                </div>

                {/* EMPTY STATE */}
                {filteredSeccionales.length === 0 && (
                    <div className="py-20 text-center">
                        <p className="text-xl font-bold opacity-30 uppercase tracking-widest">No se encontraron seccionales para tu búsqueda</p>
                    </div>
                )}
            </div>
        </section>
    );
};