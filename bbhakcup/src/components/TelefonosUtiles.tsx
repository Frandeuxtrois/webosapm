import React, { useState } from 'react';
import { Phone, Search, AlertCircle, MapPin, Activity, Headphones, ChevronRight } from 'lucide-react';

const TELEFONOS_DATA = [
    { region: "TODO EL PAIS", servicio: "CALL CENTER NACIONAL DE EMERGENCIAS Y MESA DE AYUDA", numeros: ["0810-220-7673 (Urgencias)", "0800-666-7276 (Mesa de Ayuda)"], destacado: true },
    { region: "AMBA", servicio: "AYUDA MEDICA", numeros: ["4860-7100"] },
    { region: "AZUL", servicio: "EMERGENCIAS MEDICAS AZUL", numeros: ["02281-433078"] },
    { region: "BAHIA BLANCA", servicio: "EMERGENCIAS ALERTA", numeros: ["0291-4560000", "0291-4562076"] },
    { region: "CATAMARCA", servicio: "EMERGENCIAS ECA CATAMARCA", numeros: ["0383-4430845", "0383-4425000"] },
    { region: "COMODORO RIVADAVIA", servicio: "EMERGENCIAS MEDICAS COMODORO", numeros: ["0297-434567", "0297-433333"] },
    { region: "CORRIENTES", servicio: "EQUIPO MEDICO DE EMERGENCIAS", numeros: ["0379 443-5588"] },
    { region: "JUNIN", servicio: "EMERGENCIAS INTERMED", numeros: ["02364-4425185"] },
    { region: "LA PLATA", servicio: "EMERGENCIAS UDEC", numeros: ["0221-4830497"] },
    { region: "LA RIOJA", servicio: "EMERGENCIA RIOJANA INMEDIATA", numeros: ["03804-422116", "03804-431000", "03804-423754"] },
    { region: "LUJAN", servicio: "AYUDA MEDICA", numeros: ["0800-999-5355", "011-4860-7126"] },
    { region: "MAR DEL PLATA", servicio: "EMERGENCIAS SEREM", numeros: ["0223-4942552", "0223-4932226"] },
    { region: "MENDOZA", servicio: "EMERGENCIAS SERPRISA", numeros: ["0261-4326666"] },
    { region: "MERCEDES", servicio: "EMERGENCIAS MEDICAS MERCEDES", numeros: ["02324-427354", "02324-427355"] },
    { region: "NEUQUEN", servicio: "EMERGENCIAS VITTAL", numeros: ["0810-220-3090"] },
    { region: "OLAVARRIA", servicio: "EMERGENCIAS MEDICAS OLAVARRIA", numeros: ["02284-410000", "440929"] },
    { region: "PERGAMINO", servicio: "EMERGENCIAS MEDICAR", numeros: ["02477-443044", "02477-424730"] },
    { region: "PILAR", servicio: "AYUDA MEDICA", numeros: ["0800-999-2064"] },
    { region: "POSADAS", servicio: "EMERGENCIA IAMIP", numeros: ["0376-4444444"] },
    { region: "RESISTENCIA", servicio: "EMERGENCIAS FEMECHACO", numeros: ["0362-4423489", "0362-4429237"] },
    { region: "RIO CUARTO", servicio: "EMERGENCIA VITTAL", numeros: ["0358-4541641", "0358-4638341"] },
    { region: "SALTA", servicio: "EMERGENCIAS SALTA", numeros: ["0387-4319271"] },
    { region: "SAN JUAN", servicio: "EMERGENCIAS ECI - FUTURA NORTE", numeros: ["0264-4200911"] },
    { region: "SAN LUIS", servicio: "EMERGENCIA SEMED", numeros: ["0266-4496033"] },
    { region: "SAN MIGUEL DE TUCUMAN", servicio: "ECCO-EMERGENCIA CARDIOCORONARIA", numeros: ["0381-4310799", "0381-4215903"] },
    { region: "SAN SALVADOR DE JUJUY", servicio: "EMERGENCIAS SAE", numeros: ["0388-4228866", "0388-427041"] },
    { region: "SANTA FE", servicio: "UNIDAD DE EMERGENCIA UNISEM", numeros: ["0342-4553500", "0342-4552000"] },
    { region: "SANTA ROSA", servicio: "EMERGENCIAS F.A.E.R.A.C.", numeros: ["02954-456056"] },
    { region: "SANTIAGO DEL ESTERO", servicio: "U24 SANTIAGO EMERGENCIAS", numeros: ["0385- 4241122"] },
    { region: "TANDIL", servicio: "EMERGENCIAS USICOM", numeros: ["0249-4425107"] },
    { region: "TRELEW", servicio: "EMERGENCIA NATIVUS SALUD", numeros: ["0280-4435888", "0280-4431082"] },
    { region: "ZARATE / CHIVILCOY", servicio: "EMERGENCIAS CHIVILCOY", numeros: ["03487-430911", "422898", "421644"] },
];

export const TelefonosUtiles: React.FC = () => {
    const [search, setSearch] = useState("");

    const filteredData = TELEFONOS_DATA.filter(item =>
        item.region.toLowerCase().includes(search.toLowerCase()) ||
        item.servicio.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <section id="telefonos" className="pt-32 pb-20 bg-white font-sans text-[#1C75BB] overflow-x-hidden animate-in fade-in duration-700">
            <div className="max-w-7xl mx-auto px-6 md:px-12">

                {/* HEADER SECCIÓN */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                    <div className="space-y-4 text-center md:text-left">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 rounded-full text-red-600">
                            <AlertCircle size={18} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Atención las 24 Horas</span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-tight">
                            Teléfonos <br /> <span className="text-[#00AEEF]">Útiles</span>
                        </h2>
                    </div>

                    {/* BUSCADOR */}
                    <div className="relative w-full md:w-96 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#00AEEF] transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Buscar ciudad o servicio..."
                            className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-4 font-bold outline-none focus:border-[#00AEEF] focus:bg-white transition-all shadow-sm text-[#1C75BB]"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* BANNER EMERGENCIAS NACIONAL (Solo se ve si no hay búsqueda o si coincide) */}
                {(search === "" || "todo el pais".includes(search.toLowerCase())) && (
                    <div className="mb-12 bg-gradient-to-r from-[#1C75BB] to-[#00AEEF] rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden group">
                        <Activity className="absolute -right-10 -bottom-10 w-64 h-64 opacity-10 group-hover:scale-110 transition-transform duration-1000" />
                        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Headphones size={32} className="text-white" />
                                    <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter leading-none">Call Center Nacional</h3>
                                </div>
                                <p className="font-bold opacity-80 max-w-xl text-sm md:text-base">Mesa de ayuda y derivaciones para todo el territorio argentino. Atención inmediata.</p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <a href="tel:08102207673" className="bg-white text-[#1C75BB] px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all text-center">
                                    0810-220-7673
                                </a>
                                <a href="tel:08006667276" className="bg-[#1C75BB] text-white border-2 border-white/20 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl hover:bg-white hover:text-[#1C75BB] transition-all text-center">
                                    0800-666-7276
                                </a>
                            </div>
                        </div>
                    </div>
                )}

                {/* GRILLA DE TELÉFONOS REGIONALES */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredData.filter(i => !i.destacado).map((item, idx) => (
                        <div key={idx} className="group bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-[#00AEEF]/20 transition-all flex flex-col justify-between overflow-hidden relative">
                            <div className="absolute top-0 left-0 w-1.5 h-full bg-[#00AEEF] opacity-0 group-hover:opacity-100 transition-all"></div>

                            <div>
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center gap-2 text-[#00AEEF]">
                                        <MapPin size={16} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">{item.region}</span>
                                    </div>
                                    <Activity size={18} className="text-slate-100 group-hover:text-[#00AEEF]/20 transition-colors" />
                                </div>

                                <h4 className="text-lg font-black uppercase leading-tight mb-6 text-[#1C75BB] min-h-[3rem]">
                                    {item.servicio}
                                </h4>

                                <div className="space-y-3">
                                    {item.numeros.map((num, nIdx) => (
                                        <a
                                            key={nIdx}
                                            href={`tel:${num.replace(/[^0-9]/g, "")}`}
                                            className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl group/btn hover:bg-[#00AEEF] transition-all"
                                        >
                                            <span className="font-black text-sm tracking-tighter group-hover/btn:text-white transition-colors">{num}</span>
                                            <Phone size={16} className="text-[#00AEEF] group-hover/btn:text-white" />
                                        </a>
                                    ))}
                                </div>
                            </div>

                            <p className="mt-6 text-[9px] font-bold text-slate-300 uppercase tracking-widest text-center group-hover:text-[#00AEEF] transition-colors">
                                Click para llamar desde el teléfono
                            </p>
                        </div>
                    ))}
                </div>

                {/* EMPTY STATE */}
                {filteredData.length === 0 && (
                    <div className="py-20 text-center">
                        <p className="text-xl font-bold opacity-20 uppercase tracking-widest">No se encontraron resultados para "{search}"</p>
                    </div>
                )}
            </div>
        </section>
    );
};