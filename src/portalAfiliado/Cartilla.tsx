import React, { useState, useEffect } from 'react';
import { Search, MapPin, Phone, ArrowLeft, Loader2, Navigation, XCircle } from 'lucide-react';
import { cartillaService } from '../services/cartillaService';
import { useAuth } from '../context/authContext';

export const Cartilla: React.FC = () => {
    const { user } = useAuth(); // Obtenemos el planId y seccionalId del token decodificado

    // Listas de parámetros
    const [tiposCartilla, setTiposCartilla] = useState<any[]>([]);
    const [provincias, setProvincias] = useState<any[]>([]);
    const [seccionales, setSeccionales] = useState<any[]>([]);
    const [especialidades, setEspecialidades] = useState<any[]>([]);
    const [localidades, setLocalidades] = useState<any[]>([]);

    // Estados de UI y Resultados
    const [resultados, setResultados] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingEsp, setLoadingEsp] = useState(false);
    const [view, setView] = useState<'filtros' | 'resultados'>('filtros');

    // Estado de Filtros (Igual a tu App)
    const [filtros, setFiltros] = useState({
        tipoCartilla: null as number | null,
        tipoPrestadorId: null as number | null,
        subEspecialidadId: "",
        provinciaId: "",
        seccionalId: "",
        localidadId: 0,
        razonSocial: ""
    });

    // 1. CARGA INICIAL (Equivalente a cargarParametrosIniciales)
    useEffect(() => {
        const init = async () => {
            const data = await cartillaService.getParametrosBusqueda();
            if (data) {
                setTiposCartilla(data.tiposCartilla);
                setProvincias(data.provincias);
                setSeccionales(data.seccionales);
            }
        };
        init();
    }, []);

    // 2. CARGA ESPECIALIDADES (Cuando cambia tipoPrestadorId)
    useEffect(() => {
        if (filtros.tipoPrestadorId !== null) {
            setLoadingEsp(true);
            cartillaService.getEspecialidades(filtros.tipoPrestadorId)
                .then(setEspecialidades)
                .finally(() => setLoadingEsp(false));
        }
    }, [filtros.tipoPrestadorId]);

    // 3. CARGA LOCALIDADES (Cuando cambia provinciaId)
    useEffect(() => {
        if (filtros.provinciaId) {
            cartillaService.getLocalidades(filtros.provinciaId).then(setLocalidades);
        } else {
            setLocalidades([]);
        }
    }, [filtros.provinciaId]);

    // LÓGICA DE BÚSQUEDA (Réplica exacta de handleBuscar de tu App)
    const handleBuscar = async () => {
        if (filtros.tipoCartilla === null) return;

        setLoading(true);
        try {
            // Lógica de Seccional: filtro manual o la del usuario o 001 por defecto
            const seccionalParaBusqueda = filtros.seccionalId || user?.seccionalId || "001";

            const payload = {
                tipoCartilla: Number(filtros.tipoCartilla),
                plan: user?.planId || "", // IMPORTANTE: El plan sale del token
                seccionalId: seccionalParaBusqueda,
                razonSocial: filtros.razonSocial || "",
                provinciaId: filtros.provinciaId || "",
                localidadId: Number(filtros.localidadId),
                barrioId: 0, // En web lo seteamos en 0 por ahora
                subEspecialidadId: filtros.subEspecialidadId || ""
            };

            const data = await cartillaService.buscar(payload);
            setResultados(data);

            if (data.length > 0) {
                setView('resultados');
            } else {
                alert("Sin resultados para esta selección.");
            }
        } catch (error) {
            alert("Error al realizar la búsqueda.");
        } finally {
            setLoading(false);
        }
    };

    const resetFiltros = () => {
        setFiltros({
            tipoCartilla: null,
            tipoPrestadorId: null,
            subEspecialidadId: "",
            provinciaId: "",
            seccionalId: "",
            localidadId: 0,
            razonSocial: ""
        });
        setEspecialidades([]);
        setLocalidades([]);
    };

    // Validaciones de UI
    const showEspecialidad = filtros.tipoCartilla === 1 || filtros.tipoCartilla === 7;
    const isEspecialidadObligatoria = showEspecialidad;
    const isButtonDisabled = filtros.tipoCartilla === null || loading || (isEspecialidadObligatoria && filtros.subEspecialidadId === "");

    return (
        <div className="animate-in fade-in duration-700 text-[#1C75BB] font-sans">
            {view === 'filtros' ? (
                <div className="max-w-4xl mx-auto bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 md:p-12">

                    {/* Header Buscador */}
                    <div className="flex justify-between items-start mb-10">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-[#00AEEF]/10 rounded-2xl text-[#00AEEF]">
                                <Search size={32} />
                            </div>
                            <div>
                                <h2 className="text-3xl font-black uppercase tracking-tighter">Cartilla Médica</h2>
                                <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">Buscador Oficial de Prestadores</p>
                            </div>
                        </div>
                        <button onClick={resetFiltros} className="text-gray-400 hover:text-red-500 transition-colors">
                            <XCircle size={24} />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                        {/* 1. TIPO DE CARTILLA */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest ml-1 opacity-60">1. Tipo de Cartilla (Requerido)</label>
                            <select
                                className={`w-full bg-slate-50 border-2 rounded-xl p-4 font-bold outline-none transition-all appearance-none ${filtros.tipoCartilla === null ? 'border-[#00AEEF]/30' : 'border-transparent focus:ring-2 focus:ring-[#00AEEF]'}`}
                                value={filtros.tipoCartilla || ""}
                                onChange={(e) => {
                                    const val = Number(e.target.value);
                                    const item = tiposCartilla.find(t => t.id === val);
                                    setFiltros({ ...filtros, tipoCartilla: val, tipoPrestadorId: item?.tipo_prestador_id, subEspecialidadId: "" });
                                }}
                            >
                                <option value="">Seleccionar...</option>
                                {tiposCartilla.map(t => <option key={t.id} value={t.id}>{t.descripcion}</option>)}
                            </select>
                        </div>

                        {/* RAZON SOCIAL */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest ml-1 opacity-60">Nombre o Razón Social</label>
                            <input
                                type="text"
                                disabled={filtros.tipoCartilla === null}
                                placeholder="Ej: Británico, Perez..."
                                className="w-full bg-slate-50 border-none rounded-xl p-4 font-bold outline-none focus:ring-2 focus:ring-[#00AEEF] disabled:opacity-50"
                                value={filtros.razonSocial}
                                onChange={(e) => setFiltros({ ...filtros, razonSocial: e.target.value })}
                            />
                        </div>

                        {/* 2. ESPECIALIDAD (Si corresponde) */}
                        {showEspecialidad && (
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest ml-1 opacity-60 text-[#00AEEF]">2. Especialidad Médica (Requerido)</label>
                                <div className="relative">
                                    <select
                                        disabled={loadingEsp}
                                        className="w-full bg-slate-50 border-2 border-[#00AEEF]/20 rounded-xl p-4 font-bold outline-none focus:ring-2 focus:ring-[#00AEEF] appearance-none disabled:opacity-50"
                                        value={filtros.subEspecialidadId}
                                        onChange={(e) => setFiltros({ ...filtros, subEspecialidadId: e.target.value })}
                                    >
                                        <option value="">{loadingEsp ? "Cargando especialidades..." : "Seleccionar especialidad..."}</option>
                                        {especialidades.map(esp => <option key={esp.id} value={esp.id}>{esp.nombre}</option>)}
                                    </select>
                                    {loadingEsp && <Loader2 className="absolute right-4 top-4 animate-spin text-[#00AEEF]" size={20} />}
                                </div>
                            </div>
                        )}

                        {/* SECCIONAL */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest ml-1 opacity-60">Cambiar Seccional (Opcional)</label>
                            <select
                                className="w-full bg-slate-50 border-none rounded-xl p-4 font-bold outline-none focus:ring-2 focus:ring-[#00AEEF] appearance-none"
                                value={filtros.seccionalId}
                                onChange={(e) => setFiltros({ ...filtros, seccionalId: e.target.value })}
                            >
                                <option value="">Mi seccional actual</option>
                                {seccionales.map(s => <option key={s.id} value={s.id}>{s.nombre}</option>)}
                            </select>
                        </div>

                        {/* PROVINCIA */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest ml-1 opacity-60">Provincia</label>
                            <select
                                className="w-full bg-slate-50 border-none rounded-xl p-4 font-bold outline-none focus:ring-2 focus:ring-[#00AEEF] appearance-none"
                                value={filtros.provinciaId}
                                onChange={(e) => setFiltros({ ...filtros, provinciaId: e.target.value, localidadId: 0 })}
                            >
                                <option value="">Todas</option>
                                {provincias.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                            </select>
                        </div>

                        {/* LOCALIDAD (Solo si hay provincia) */}
                        {localidades.length > 0 && (
                            <div className="md:col-span-2 space-y-2 animate-in slide-in-from-top-2">
                                <label className="text-[10px] font-black uppercase tracking-widest ml-1 opacity-60">Localidad</label>
                                <select
                                    className="w-full bg-slate-50 border-none rounded-xl p-4 font-bold outline-none focus:ring-2 focus:ring-[#00AEEF] appearance-none"
                                    value={filtros.localidadId}
                                    onChange={(e) => setFiltros({ ...filtros, localidadId: Number(e.target.value) })}
                                >
                                    <option value="0">Todas las localidades</option>
                                    {localidades.map(l => <option key={l.id} value={l.id}>{l.nombre}</option>)}
                                </select>
                            </div>
                        )}
                    </div>

                    <button
                        disabled={isButtonDisabled}
                        onClick={handleBuscar}
                        className="w-full mt-12 bg-[#00AEEF] text-white font-black py-5 rounded-2xl shadow-xl hover:bg-[#1C75BB] transition-all flex items-center justify-center gap-3 disabled:opacity-50 uppercase tracking-[0.2em] text-xs"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <><Navigation size={18} /> Aplicar Filtros y Buscar</>}
                    </button>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* BARRA DE CONTROL DE RESULTADOS */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 px-4">
                        <button
                            onClick={() => setView('filtros')}
                            className="flex items-center gap-2 font-black text-[10px] uppercase tracking-widest hover:text-[#00AEEF] transition-colors"
                        >
                            <ArrowLeft size={16} /> Modificar Búsqueda
                        </button>
                        <div className="bg-white px-4 py-2 rounded-full border border-gray-100 shadow-sm text-xs font-bold">
                            <span className="text-[#00AEEF]">{resultados.length}</span> prestadores encontrados
                        </div>
                    </div>

                    {/* GRILLA DE PRESTADORES */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-20">
                        {resultados.map((item, idx) => (
                            <div key={idx} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-2 h-full bg-[#00AEEF] opacity-0 group-hover:opacity-100 transition-all"></div>

                                <h4 className="font-black text-xl uppercase tracking-tight leading-tight mb-2 group-hover:text-[#00AEEF] transition-colors">
                                    {item.nombre || item.razonSocial}
                                </h4>

                                {item.especialidad && (
                                    <p className="text-[#00AEEF] font-bold text-[10px] uppercase tracking-widest mb-6 italic opacity-80">
                                        {item.especialidad}
                                    </p>
                                )}

                                <div className="space-y-4 pt-6 border-t border-gray-50">
                                    <div className="flex items-start gap-3">
                                        <MapPin size={18} className="text-gray-300 shrink-0 mt-1" />
                                        <p className="text-sm font-bold text-gray-600 leading-snug">
                                            {item.direccion}
                                            <span className="block text-[10px] opacity-60 uppercase mt-0.5">{item.localidad}</span>
                                        </p>
                                    </div>

                                    {item.telefonos && (
                                        <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-gray-100">
                                            <Phone size={18} className="text-[#00AEEF] shrink-0" />
                                            <p className="text-sm font-black tracking-tight">{item.telefonos}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};