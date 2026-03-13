import React, { useState, useEffect } from 'react';
import {
    Bell, Users, FileText, CreditCard, BookOpen,
    Key, LogOut, Download, User, MapPin, Hash, Home,
    ChevronRight, Loader2, Lock, Mail, ShieldCheck,
    Wallet, Calendar, ArrowUpRight, ArrowDownLeft,
    Plus, Search, Navigation, Phone, ArrowLeft
} from 'lucide-react';

// Importación de recursos y servicios
import headerLogo from '../assets/headerlogo.png';
import { Credencial } from './Credencial';
import { afiliadoService } from '../services/afiliadoService';
import { cartillaService } from '../services/cartillaService';
import { useAuth } from '../context/authContext';

interface DashboardProps {
    onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
    const { user, loading: authLoading } = useAuth();
    const [activeSection, setActiveSection] = useState('grupo-familiar');
    const [perfilReal, setPerfilReal] = useState<any>(null);
    const [credenciales, setCredenciales] = useState<any[]>([]);
    const [tokenDinamico, setTokenDinamico] = useState<string>('');
    const [loadingData, setLoadingData] = useState(false);

    // --- ESTADOS: ESTADO DE CUENTA ---
    const [saldo, setSaldo] = useState<number>(0);
    const [movimientos, setMovimientos] = useState<any[]>([]);
    const [visibleCount, setVisibleCount] = useState(10);

    // --- ESTADOS: SEGURIDAD ---
    const [passForm, setPassForm] = useState({ actual: '', nueva: '' });
    const [emailForm, setEmailForm] = useState({ nuevo: '', codigo: '' });
    const [emailStep, setEmailStep] = useState(1);
    const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

    // --- ESTADOS: CARTILLA MÉDICA ---
    const [cartillaParams, setCartillaParams] = useState<any>({ tipos: [], provincias: [], seccionales: [] });
    const [especialidades, setEspecialidades] = useState<any[]>([]);
    const [localidades, setLocalidades] = useState<any[]>([]);
    const [resultadosCartilla, setResultadosCartilla] = useState<any[]>([]);
    const [cartillaView, setCartillaView] = useState<'filtros' | 'resultados'>('filtros');
    const [filtrosCartilla, setFiltrosCartilla] = useState({
        tipoCartilla: '',
        tipoPrestadorId: null as number | null,
        subEspecialidadId: "",
        provinciaId: "",
        seccionalId: "",
        localidadId: "0",
        razonSocial: ""
    });

    const menuItems = [
        { id: 'notificaciones', icon: Bell, label: 'Notificaciones' },
        { id: 'grupo-familiar', icon: Users, label: 'Mi Grupo Familiar' },
        { id: 'prestadores', icon: FileText, label: 'Cartilla Médica' },
        { id: 'estado-cuenta', icon: CreditCard, label: 'Estado de Cuenta' },
        { id: 'carnet', icon: BookOpen, label: 'Credencial Digital' },
        { id: 'cambiar-password', icon: Key, label: 'Seguridad' },
    ];

    // 1. CARGA INICIAL (Perfil y Grupo)
    useEffect(() => {
        if (user) {
            const fetchInitial = async () => {
                setLoadingData(true);
                try {
                    const [resPerfil, resCred] = await Promise.all([
                        afiliadoService.getPerfil(),
                        afiliadoService.getCredenciales()
                    ]);
                    if (resPerfil) setPerfilReal(resPerfil);
                    setCredenciales(Array.isArray(resCred) ? resCred : [resCred]);
                } catch (e) { }
                setLoadingData(false);
            };
            fetchInitial();
        }
    }, [user]);

    // 2. LÓGICA DE CARTILLA
    useEffect(() => {
        if (activeSection === 'prestadores') {
            cartillaService.getParametrosBusqueda().then(data => {
                if (data) setCartillaParams({ tipos: data.tiposCartilla || [], provincias: data.provincias || [], seccionales: data.seccionales || [] });
            });
        }
    }, [activeSection]);

    useEffect(() => {
        if (filtrosCartilla.tipoPrestadorId) {
            cartillaService.getEspecialidades(filtrosCartilla.tipoPrestadorId).then(data => setEspecialidades(data || []));
        }
    }, [filtrosCartilla.tipoPrestadorId]);

    useEffect(() => {
        if (filtrosCartilla.provinciaId) {
            cartillaService.getLocalidades(filtrosCartilla.provinciaId).then(data => setLocalidades(data || []));
        }
    }, [filtrosCartilla.provinciaId]);

    // 3. ESTADO DE CUENTA
    useEffect(() => {
        if (activeSection === 'estado-cuenta' && user) {
            const fetchFinanzas = async () => {
                setLoadingData(true);
                const [resSaldo, resMovs] = await Promise.all([
                    afiliadoService.getSaldo(),
                    afiliadoService.getCuentaCorriente()
                ]);
                setSaldo(resSaldo?.saldo || 0);
                setMovimientos(resMovs || []);
                setVisibleCount(10);
                setLoadingData(false);
            };
            fetchFinanzas();
        }
    }, [activeSection, user]);

    // 4. REFRESCAR TOKEN CARNET
    useEffect(() => {
        let interval: any;
        if (activeSection === 'carnet' && user) {
            const refreshToken = async () => {
                const nuevoToken = await afiliadoService.generarToken();
                setTokenDinamico(nuevoToken);
            };
            refreshToken();
            interval = setInterval(refreshToken, 9 * 60 * 1000);
        }
        return () => clearInterval(interval);
    }, [activeSection, user]);

    // --- HANDLERS ---
    const handleLoadMore = () => setVisibleCount(prev => prev + 15);

    const handlePassSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await afiliadoService.cambiarPassword(passForm.actual, passForm.nueva);
        setStatusMsg({ type: res.ok ? 'success' : 'error', text: res.data.message || res.data.error });
        if (res.ok) setPassForm({ actual: '', nueva: '' });
    };

    const handleEmailRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await afiliadoService.solicitarCambioEmail(emailForm.nuevo);
        if (res.ok) setEmailStep(2);
        setStatusMsg({ type: res.ok ? 'success' : 'error', text: res.data.message || res.data.error });
    };

    const handleDownloadCupon = async (idFactura: string, numero: string) => {
        setLoadingData(true);
        try {
            const blob = await afiliadoService.generarCuponPago(idFactura);
            if (blob) {
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `Cupon_${numero}.pdf`);
                document.body.appendChild(link);
                link.click();
                link.parentNode?.removeChild(link);
                window.URL.revokeObjectURL(url);
            }
        } catch (e) {
            alert("Error al descargar el cupón.");
        } finally {
            setLoadingData(false);
        }
    };

    const handleBuscarCartilla = async () => {
        setLoadingData(true);
        const payload = {
            tipoCartilla: Number(filtrosCartilla.tipoCartilla),
            plan: user?.planId || "",
            seccionalId: filtrosCartilla.seccionalId || user?.seccionalId || "001",
            razonSocial: filtrosCartilla.razonSocial,
            provinciaId: filtrosCartilla.provinciaId,
            localidadId: Number(filtrosCartilla.localidadId),
            subEspecialidadId: filtrosCartilla.subEspecialidadId
        };
        const data = await cartillaService.buscar(payload);
        setResultadosCartilla(data || []);
        setLoadingData(false);
        if (data && data.length > 0) setCartillaView('resultados');
        else alert("No se encontraron resultados.");
    };

    const renderContent = () => {
        if (loadingData && movimientos.length === 0 && resultadosCartilla.length === 0) return (
            <div className="h-[60vh] flex flex-col items-center justify-center text-[#1C75BB]">
                <Loader2 className="animate-spin w-12 h-12 mb-4" />
                <p className="font-bold text-sm text-gray-400 uppercase tracking-widest text-center">Conectando con OSAPM...</p>
            </div>
        );

        switch (activeSection) {
            case 'grupo-familiar':
                return (
                    <div className="space-y-6 animate-in fade-in duration-500 text-[#1C75BB]">
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                            <h2 className="text-xl font-black mb-8 flex items-center gap-3 uppercase tracking-tighter">
                                <span className="w-1.5 h-6 bg-[#00AEEF] rounded-full"></span>
                                Datos del titular
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <InfoItem icon={User} label="Apellido y Nombre" value={perfilReal?.nombreCompleto || user?.nombre} />
                                <InfoItem icon={Hash} label="DNI" value={perfilReal?.dni || user?.dni} />
                                <InfoItem icon={FileText} label="Plan" value={perfilReal?.planNombre || user?.planNombre} isHighlight />
                                <InfoItem icon={MapPin} label="Localidad" value={perfilReal?.localidad} />
                                <div className="md:col-span-2">
                                    <InfoItem icon={Home} label="Domicilio Actual" value={perfilReal?.domicilio} />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                            <h2 className="text-xs font-black uppercase tracking-widest mb-6 opacity-40">Grupo Familiar en Sistema</h2>
                            <div className="overflow-hidden border border-gray-100 rounded-2xl">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 text-[10px] font-black uppercase text-[#1C75BB]">
                                        <tr>
                                            <th className="px-6 py-4">Afiliado</th>
                                            <th className="px-6 py-4 text-center">Nro Carnet</th>
                                            <th className="px-6 py-4 text-center">Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {credenciales.map((m, i) => (
                                            <tr key={i} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-5 font-bold text-gray-900">{m.nombreCompleto}</td>
                                                <td className="px-6 py-5 text-center font-mono text-sm opacity-60">{m.nroCarnet}</td>
                                                <td className="px-6 py-5 text-center text-[10px] font-black uppercase text-green-600 tracking-widest">Activo</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                );

            case 'prestadores':
                return (
                    <div className="space-y-6 animate-in fade-in duration-500">
                        {cartillaView === 'filtros' ? (
                            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10 text-[#1C75BB]">
                                <div className="flex items-center gap-4 mb-10">
                                    <div className="p-3 bg-[#00AEEF]/10 rounded-2xl text-[#00AEEF]"><Search size={28} /></div>
                                    <h2 className="text-2xl font-black uppercase tracking-tighter">Buscador de Cartilla</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[#1C75BB]">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase opacity-40 ml-1">Tipo de Atención *</label>
                                        <select className="w-full bg-slate-50 border-none rounded-xl p-4 font-bold outline-none focus:ring-2 focus:ring-[#00AEEF] appearance-none"
                                            value={filtrosCartilla.tipoCartilla}
                                            onChange={(e) => {
                                                const sel = cartillaParams.tipos.find((t: any) => t.id == e.target.value);
                                                setFiltrosCartilla({ ...filtrosCartilla, tipoCartilla: e.target.value, tipoPrestadorId: sel?.tipo_prestador_id || null, subEspecialidadId: "" });
                                            }}>
                                            <option value="">Seleccionar...</option>
                                            {cartillaParams.tipos?.map((t: any) => <option key={t.id} value={t.id}>{t.descripcion}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase opacity-40 ml-1">Razón Social o Nombre</label>
                                        <input type="text" placeholder="Ej: Británico..." className="w-full bg-slate-50 border-none rounded-xl p-4 font-bold outline-none focus:ring-2 focus:ring-[#00AEEF]"
                                            value={filtrosCartilla.razonSocial} onChange={(e) => setFiltrosCartilla({ ...filtrosCartilla, razonSocial: e.target.value })} />
                                    </div>
                                    {(filtrosCartilla.tipoCartilla === "1" || filtrosCartilla.tipoCartilla === "7") && (
                                        <div className="md:col-span-2 space-y-2">
                                            <label className="text-[10px] font-black uppercase opacity-40 ml-1">Especialidad *</label>
                                            <select className="w-full bg-slate-50 border-none rounded-xl p-4 font-bold outline-none focus:ring-2 focus:ring-[#00AEEF] appearance-none"
                                                value={filtrosCartilla.subEspecialidadId} onChange={(e) => setFiltrosCartilla({ ...filtrosCartilla, subEspecialidadId: e.target.value })}>
                                                <option value="">Seleccionar especialidad...</option>
                                                {especialidades.map((esp: any) => <option key={esp.id} value={esp.id}>{esp.nombre}</option>)}
                                            </select>
                                        </div>
                                    )}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase opacity-40 ml-1">Provincia</label>
                                        <select className="w-full bg-slate-50 border-none rounded-xl p-4 font-bold outline-none focus:ring-2 focus:ring-[#00AEEF] appearance-none"
                                            value={filtrosCartilla.provinciaId} onChange={(e) => setFiltrosCartilla({ ...filtrosCartilla, provinciaId: e.target.value, localidadId: "0" })}>
                                            <option value="">Todas</option>
                                            {cartillaParams.provincias?.map((p: any) => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase opacity-40 ml-1">Localidad</label>
                                        <select disabled={!filtrosCartilla.provinciaId} className="w-full bg-slate-50 border-none rounded-xl p-4 font-bold outline-none focus:ring-2 focus:ring-[#00AEEF] appearance-none disabled:opacity-30"
                                            value={filtrosCartilla.localidadId} onChange={(e) => setFiltrosCartilla({ ...filtrosCartilla, localidadId: e.target.value })}>
                                            <option value="0">Todas</option>
                                            {localidades.map((l: any) => <option key={l.id} value={l.id}>{l.nombre}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <button onClick={handleBuscarCartilla} className="w-full mt-10 bg-[#00AEEF] text-white font-black py-4 rounded-xl shadow-lg hover:bg-[#1C75BB] transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-2">
                                    <Navigation size={18} /> Iniciar Búsqueda
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <button onClick={() => setCartillaView('filtros')} className="flex items-center gap-2 font-black text-[10px] uppercase tracking-widest text-[#1C75BB] hover:underline mb-4">
                                    <ArrowLeft size={16} /> Volver a filtros
                                </button>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {resultadosCartilla.map((p, idx) => (
                                        <div key={idx} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-[#1C75BB] hover:shadow-md transition-all">
                                            <h4 className="font-black text-lg uppercase mb-1 tracking-tight">{p.nombre || p.razonSocial}</h4>
                                            {p.especialidad && <p className="text-[#00AEEF] text-[10px] font-bold uppercase tracking-widest mb-4 italic">{p.especialidad}</p>}
                                            <div className="space-y-3 pt-4 border-t border-gray-50 opacity-80">
                                                <div className="flex items-start gap-3"><MapPin size={16} className="shrink-0 mt-0.5 opacity-40" /><p className="text-sm font-bold leading-snug">{p.direccion}, {p.localidad}</p></div>
                                                {p.telefonos && <div className="flex items-center gap-3"><Phone size={16} className="text-[#00AEEF]" /><p className="text-sm font-black">{p.telefonos}</p></div>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                );

            case 'estado-cuenta':
                return (
                    <div className="space-y-6 animate-in fade-in duration-500 pb-10 text-[#1C75BB]">
                        {/* BOX SALDO */}
                        <div className="bg-white rounded-3xl p-10 border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-[#1C75BB]"><Wallet size={32} /></div>
                                <div><p className="text-[10px] font-black uppercase opacity-40 mb-1 tracking-widest">Saldo deudor total</p><h3 className="text-4xl font-black text-gray-900 tracking-tighter">${saldo.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</h3></div>
                            </div>
                            <button className="px-10 py-4 bg-[#1C75BB] text-white font-black rounded-xl shadow-lg hover:bg-[#00AEEF] transition-all uppercase tracking-widest text-[10px]">Pagar Cuotas Online</button>
                        </div>
                        {/* LISTADO MOVIMIENTOS */}
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-[10px] font-black uppercase tracking-widest text-[#1C75BB]">
                                    <tr><th className="px-8 py-5 text-center">Fecha</th><th className="px-8 py-5">Comprobante</th><th className="px-8 py-5 text-right">Importe</th><th className="px-8 py-5 text-center">Acción</th></tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {movimientos.slice(0, visibleCount).map((m) => (
                                        <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-8 py-6 font-bold text-xs text-center">{new Date(m.fecha_movimiento).toLocaleDateString('es-AR')}</td>
                                            <td className="px-8 py-6"><p className="text-[9px] font-black opacity-30 uppercase leading-none">{m.tipo_comprobante}</p><p className="font-bold text-sm tracking-tight">{m.numero_comprobante}</p></td>
                                            <td className={`px-8 py-6 text-right font-black ${m.impaga ? 'text-red-500' : 'text-green-600'}`}>${m.importe.toLocaleString('es-AR')}</td>
                                            <td className="px-8 py-6 text-center">
                                                {m.impaga && (
                                                    <button
                                                        onClick={() => handleDownloadCupon(m.id, m.numero_comprobante)}
                                                        className="p-2.5 bg-[#1C75BB] text-white rounded-xl hover:scale-110 active:scale-95 transition-all shadow-md"
                                                    >
                                                        <Download size={14} />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {visibleCount < movimientos.length && (
                                <div className="p-8 text-center bg-gray-50/50">
                                    <button onClick={handleLoadMore} className="px-8 py-3 bg-white border border-gray-200 rounded-xl font-bold text-[10px] uppercase text-[#1C75BB] shadow-sm hover:bg-slate-100 transition-all">
                                        <Plus size={16} className="inline mr-2" /> Mostrar más movimientos
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                );

            case 'cambiar-password':
                return (
                    <div className="flex flex-col gap-6 max-w-2xl animate-in fade-in duration-500 text-[#1C75BB]">
                        <div className="bg-white rounded-3xl p-10 border border-gray-100 shadow-sm">
                            <h2 className="text-xl font-black mb-8 uppercase tracking-tight flex items-center gap-3"><Key size={22} /> Seguridad de Cuenta</h2>
                            <form onSubmit={handlePassSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2"><label className="text-[10px] font-black uppercase opacity-40 ml-1 tracking-widest">Clave Actual</label><input type="password" required className="w-full bg-slate-50 border-none rounded-xl p-4 font-bold outline-none focus:ring-2 focus:ring-[#00AEEF]" value={passForm.actual} onChange={e => setPassForm({ ...passForm, actual: e.target.value })} /></div>
                                    <div className="space-y-2"><label className="text-[10px] font-black uppercase opacity-40 ml-1 tracking-widest">Nueva Clave</label><input type="password" required className="w-full bg-slate-50 border-none rounded-xl p-4 font-bold outline-none focus:ring-2 focus:ring-[#00AEEF]" value={passForm.nueva} onChange={e => setPassForm({ ...passForm, nueva: e.target.value })} /></div>
                                </div>
                                <button className="px-10 bg-[#1C75BB] text-white font-black py-4 rounded-xl shadow-lg uppercase text-[10px] tracking-widest">Actualizar Contraseña</button>
                            </form>
                        </div>
                        {/* CAMBIO DE EMAIL */}
                        <div className="bg-white rounded-3xl p-10 border border-gray-100 shadow-sm">
                            <h2 className="text-xl font-black mb-6 uppercase tracking-tight flex items-center gap-3 text-[#1C75BB]"><Mail size={22} /> Correo Electrónico</h2>
                            {emailStep === 1 ? (
                                <form onSubmit={handleEmailRequest} className="space-y-6">
                                    <p className="text-[#1C75BB] text-xs font-bold opacity-70 mb-4 leading-relaxed">Ingresá el nuevo email. Te enviaremos un código para confirmar el cambio.</p>
                                    <input type="email" required className="w-full bg-slate-50 border-none rounded-xl p-4 font-bold outline-none focus:ring-2 focus:ring-[#00AEEF]" placeholder="nuevo@email.com" value={emailForm.nuevo} onChange={e => setEmailForm({ ...emailForm, nuevo: e.target.value })} />
                                    <button className="px-10 bg-white text-[#1C75BB] font-black py-4 rounded-xl border border-gray-200 uppercase tracking-widest text-[10px] shadow-sm">Solicitar Cambio</button>
                                </form>
                            ) : (
                                <form onSubmit={async (e) => {
                                    e.preventDefault();
                                    const res = await afiliadoService.confirmarCambioEmail(emailForm.codigo);
                                    if (res.ok) setEmailStep(1);
                                    setStatusMsg({ type: res.ok ? 'success' : 'error', text: res.data.message });
                                }} className="space-y-6">
                                    <div className="p-4 bg-blue-50/50 rounded-xl text-[#1C75BB] text-xs font-bold text-center mb-4 uppercase tracking-widest">Ingresá el código de 6 dígitos</div>
                                    <input type="text" required maxLength={6} className="w-full bg-slate-50 border border-gray-200 rounded-xl p-6 text-center text-3xl font-black tracking-[0.5em] outline-none focus:ring-2 focus:ring-[#00AEEF]" value={emailForm.codigo} onChange={e => setEmailForm({ ...emailForm, codigo: e.target.value })} />
                                    <div className="flex gap-4">
                                        <button className="flex-1 bg-[#1C75BB] text-white font-black py-4 rounded-xl shadow-xl uppercase tracking-widest text-xs">Confirmar</button>
                                        <button type="button" onClick={() => setEmailStep(1)} className="px-6 text-gray-500 font-bold uppercase text-[10px] tracking-widest">Cancelar</button>
                                    </div>
                                </form>
                            )}
                        </div>
                        {statusMsg.text && (
                            <div className={`p-5 rounded-2xl text-center font-bold text-xs uppercase tracking-widest border animate-pulse ${statusMsg.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                                {statusMsg.text}
                            </div>
                        )}
                    </div>
                );

            case 'carnet':
                return <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm animate-in fade-in"><Credencial data={credenciales} token={tokenDinamico} loading={loadingData} onRefresh={() => { }} /></div>;

            default:
                return null;
        }
    };

    if (authLoading) return <div className="h-screen w-full flex items-center justify-center bg-white"><Loader2 className="animate-spin text-[#00AEEF] w-10 h-10" /></div>;

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-[#1C75BB]">
            <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
                <div className="max-w-full mx-auto px-6 lg:px-16 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <img src={headerLogo} alt="Logo" className="h-10 lg:h-12 object-contain" />
                        <span className="hidden md:block text-[10px] font-black uppercase tracking-[0.3em] border-l pl-6 border-gray-100 text-gray-400">Portal Afiliados</span>
                    </div>
                    <button onClick={onLogout} className="flex items-center gap-2 px-5 py-2 bg-slate-100 text-[#1C75BB] rounded-2xl font-black text-[10px] transition-all shadow-sm hover:bg-red-50 hover:text-red-500 uppercase tracking-widest active:scale-95">
                        <LogOut size={16} /> Salir
                    </button>
                </div>
            </header>

            <div className="max-w-full mx-auto px-6 lg:px-16 py-10 flex flex-col lg:flex-row gap-8">
                <aside className="w-full lg:w-80 flex-shrink-0">
                    <div className="bg-white rounded-[2rem] border border-gray-200 p-4 sticky top-28 shadow-sm">
                        <nav className="space-y-1">
                            {menuItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => { setActiveSection(item.id); setStatusMsg({ type: '', text: '' }); }}
                                    className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl font-black transition-all ${activeSection === item.id
                                        ? 'bg-[#00AEEF] text-white shadow-lg scale-[1.02]'
                                        : 'text-[#1C75BB]/50 hover:bg-slate-50 hover:text-[#1C75BB]'
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <item.icon size={20} strokeWidth={3} />
                                        <span className="text-[10px] uppercase tracking-wider">{item.label}</span>
                                    </div>
                                    {activeSection === item.id && <ChevronRight size={14} />}
                                </button>
                            ))}
                        </nav>
                    </div>
                </aside>
                <main className="flex-1">{renderContent()}</main>
            </div>
        </div>
    );
};

const InfoItem: React.FC<{ icon: any; label: string; value: string; isHighlight?: boolean }> = ({ icon: Icon, label, value, isHighlight }) => (
    <div className="flex items-center gap-5 group">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all ${isHighlight ? 'bg-[#00AEEF] text-white shadow-lg shadow-[#00AEEF]/20' : 'bg-slate-50 text-[#1C75BB] border border-gray-100'
            }`}>
            <Icon size={20} />
        </div>
        <div>
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">{label}</p>
            <p className={`text-base font-bold leading-tight ${isHighlight ? 'text-[#00AEEF]' : 'text-[#1C75BB]'}`}>{value || '---'}</p>
        </div>
    </div>
);