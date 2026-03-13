import React, { useState } from 'react';
import {
    LayoutDashboard,
    Newspaper,
    FileStack,
    Users,
    Settings,
    LogOut,
    Plus,
    Edit,
    Trash2,
    BarChart3,
    Eye,
    CheckCircle,
    AlertCircle,
    Search,
    FileText,
    Globe,
    ShieldCheck,
    Loader2,
    ChevronRight,
    Bell
} from 'lucide-react';
import headerLogo from '../assets/headerlogo.png';

interface AdminDashboardProps {
    onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
    const [activeTab, setActiveTab] = useState('overview');
    const [searchTerm, setSearchTerm] = useState('');

    const menuItems = [
        { id: 'overview', icon: LayoutDashboard, label: 'Inicio' },
        { id: 'noticias', icon: Newspaper, label: 'Noticias / Hero' },
        { id: 'formularios', icon: FileStack, label: 'Formularios PDF' },
        { id: 'usuarios', icon: Users, label: 'Afiliados / Usuarios' },
        { id: 'config', icon: Settings, label: 'Configuración' },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
                return (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* ESTADÍSTICAS RÁPIDAS */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <StatCard title="Visitas Web" value="2.450" icon={Globe} color="text-[#00AEEF]" />
                            <StatCard title="Nuevos Afiliados" value="+24" icon={Users} color="text-green-500" />
                            <StatCard title="Docs. Descargados" value="156" icon={FileText} color="text-purple-500" />
                            <StatCard title="Alertas Sistema" value="0" icon={ShieldCheck} color="text-emerald-500" />
                        </div>

                        <div className="grid lg:grid-cols-2 gap-8">
                            {/* ACTIVIDAD RECIENTE */}
                            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
                                <h3 className="text-xl font-black text-[#1C75BB] mb-6 uppercase tracking-tighter italic">Actividad del Portal</h3>
                                <div className="space-y-4">
                                    {[
                                        { user: "Franco Vigo", action: "Actualizó credencial", time: "Hace 5 min" },
                                        { user: "Admin_01", action: "Subió nueva noticia", time: "Hace 20 min" },
                                        { user: "Sede Central", action: "Cambio de horario", time: "Hace 1 hora" },
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-gray-50">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center font-bold text-[10px] text-[#00AEEF]">OS</div>
                                                <p className="text-sm font-bold text-gray-700">{item.user} <span className="font-medium text-gray-400">{item.action}</span></p>
                                            </div>
                                            <span className="text-[10px] font-bold text-gray-400 uppercase">{item.time}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* ESTADO SERVIDORES */}
                            <div className="bg-[#1C75BB] rounded-[2.5rem] p-8 text-white shadow-xl flex flex-col justify-center">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="p-3 bg-white/10 rounded-2xl"><BarChart3 size={32} /></div>
                                    <h3 className="text-2xl font-black uppercase tracking-tighter">Estado de API</h3>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl">
                                        <span className="text-sm font-bold uppercase tracking-widest">Servidor IIS</span>
                                        <span className="px-3 py-1 bg-green-500 text-[10px] font-black rounded-full uppercase">Online</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl">
                                        <span className="text-sm font-bold uppercase tracking-widest">Base de Datos</span>
                                        <span className="px-3 py-1 bg-green-500 text-[10px] font-black rounded-full uppercase">Online</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'noticias':
                return (
                    <div className="space-y-6 animate-in fade-in duration-500">
                        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
                            <div className="flex justify-between items-center mb-8">
                                <div>
                                    <h2 className="text-2xl font-black text-[#1C75BB] uppercase tracking-tighter leading-none">Gestión de Carrusel</h2>
                                    <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-widest">Control de Noticias en Home</p>
                                </div>
                                <button className="bg-[#00AEEF] text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-[#1C75BB] transition-all shadow-lg shadow-blue-500/20">
                                    <Plus size={18} /> Nueva Noticia
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[1, 2, 3].map((n) => (
                                    <div key={n} className="bg-slate-50 rounded-3xl border border-gray-100 overflow-hidden group">
                                        <div className="h-40 bg-gray-200 relative">
                                            <img src={`https://picsum.photos/400/200?random=${n}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="" />
                                            <div className="absolute top-3 right-3 flex gap-2">
                                                <button className="p-2 bg-white rounded-lg shadow-md text-[#1C75BB] hover:text-[#00AEEF]"><Edit size={16} /></button>
                                                <button className="p-2 bg-white rounded-lg shadow-md text-red-500 hover:bg-red-50"><Trash2 size={16} /></button>
                                            </div>
                                        </div>
                                        <div className="p-5">
                                            <p className="text-[10px] font-black text-[#00AEEF] uppercase mb-1">Activo</p>
                                            <h4 className="font-bold text-[#1C75BB] text-sm uppercase leading-tight mb-2">Campaña de Vacunación Invernal {n}</h4>
                                            <p className="text-xs text-gray-400 line-clamp-2">Descripción breve de lo que se muestra en el hero de la página principal.</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case 'formularios':
                return (
                    <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden p-8 animate-in fade-in duration-500">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-black text-[#1C75BB] uppercase tracking-tighter">Repositorio de Formularios</h2>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                                <input type="text" placeholder="Buscar PDF..." className="bg-slate-50 border-none rounded-xl py-2 pl-10 pr-4 text-sm font-bold outline-none focus:ring-2 focus:ring-[#00AEEF]" />
                            </div>
                        </div>
                        <div className="space-y-3">
                            {["Formulario de Salud", "Alta de Afiliado", "Solicitud de Reintegro"].map((doc, i) => (
                                <div key={i} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all cursor-pointer">
                                    <div className="flex items-center gap-4 text-[#1C75BB]">
                                        <div className="p-3 bg-white rounded-xl shadow-sm text-red-500"><FileStack size={20} /></div>
                                        <div>
                                            <p className="font-bold text-sm uppercase">{doc}</p>
                                            <p className="text-[10px] font-black text-gray-400 tracking-widest">TIPO: SALUD | TAMAÑO: 1.2 MB</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="p-2 text-gray-400 hover:text-[#00AEEF]"><Edit size={18} /></button>
                                        <button className="p-2 text-gray-400 hover:text-red-500"><Trash2 size={18} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            default:
                return (
                    <div className="bg-white rounded-[3rem] p-20 text-center border-2 border-dashed border-gray-200">
                        <Loader2 size={48} className="mx-auto text-gray-300 mb-4 animate-spin" />
                        <h2 className="text-xl font-bold text-gray-400 uppercase tracking-tighter">Módulo en Desarrollo</h2>
                        <p className="text-gray-400 text-sm italic">Preparando el motor CRUD para {activeTab}...</p>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans flex text-[#1C75BB]">

            {/* SIDEBAR ADMIN (AZUL #1C75BB) */}
            <aside className="w-72 bg-[#1C75BB] text-white flex flex-col fixed h-full z-50 shadow-2xl">
                <div className="p-8">
                    <img src={headerLogo} alt="Logo" className="h-10 brightness-0 invert" />
                    <div className="mt-6 p-4 bg-white/10 rounded-2xl border border-white/5">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Operador:</p>
                        <p className="font-bold text-sm">Administrador_Sistemas</p>
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-1">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl font-black transition-all group
                                ${activeTab === item.id
                                    ? 'bg-white text-[#1C75BB] shadow-xl'
                                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                <item.icon size={20} strokeWidth={activeTab === item.id ? 3 : 2} />
                                <span className="text-[10px] uppercase tracking-widest">{item.label}</span>
                            </div>
                            {activeTab === item.id && <ChevronRight size={14} />}
                        </button>
                    ))}
                </nav>

                <div className="p-8">
                    <button
                        onClick={onLogout}
                        className="flex items-center gap-3 w-full p-4 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-2xl transition-all font-black text-[10px] uppercase tracking-[0.2em] border border-red-500/20"
                    >
                        <LogOut size={18} /> Salir del Sistema
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 ml-72">
                <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 h-20 flex items-center px-10 sticky top-0 z-40">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-[#00AEEF] rounded-full animate-ping"></div>
                        <h2 className="font-black text-lg text-[#111111] uppercase tracking-tighter">
                            Panel de Control <span className="text-gray-300 font-light mx-2">/</span> <span className="text-[#00AEEF]">{activeTab}</span>
                        </h2>
                    </div>
                    <div className="ml-auto flex items-center gap-6">
                        <button className="relative p-2 text-gray-400 hover:text-[#00AEEF] transition-colors">
                            <Bell size={20} />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                        <div className="w-[1px] h-8 bg-gray-100"></div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-[#1C75BB] font-black border border-gray-100 shadow-sm">
                                AD
                            </div>
                        </div>
                    </div>
                </header>

                <main className="p-10 max-w-7xl mx-auto">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

// Componente para las tarjetas de estadísticas
const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 hover:shadow-xl hover:scale-[1.02] transition-all group">
        <div className="flex justify-between items-start mb-4">
            <div className={`p-4 bg-slate-50 rounded-2xl transition-colors group-hover:bg-[#1C75BB] group-hover:text-white ${color}`}>
                <Icon size={24} />
            </div>
            <span className="text-[10px] font-black text-green-500 bg-green-50 px-2 py-0.5 rounded-full">+4%</span>
        </div>
        <div>
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">{title}</p>
            <p className="text-3xl font-black text-[#111111] tracking-tighter">{value}</p>
        </div>
    </div>
);