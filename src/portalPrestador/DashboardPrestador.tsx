import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, ReceiptText, ClipboardList, FolderOpen,
  MessageCircle, LogOut, Menu, X, ChevronRight, Loader2, Users
} from 'lucide-react';
import { apiService, DatosPrestador } from '../services/api';
import { PerfilPrestador } from './sections/PerfilPrestador';
import { Liquidaciones } from './sections/Liquidaciones';
import { Tarifario } from './sections/Tarifario';
import { MisArchivos } from './sections/MisArchivos';
import { ContactoPrestador } from './sections/ContactoPrestador';
import { BuscadorAfiliados } from './sections/BuscadorAfiliados';
import headerLogo from '../assets/headerlogo.png';

interface DashboardPrestadorProps {
  onLogout: () => void;
}

type Section = 'inicio' | 'liquidaciones' | 'tarifario' | 'archivos' | 'contacto' | 'afiliados';

const menuItems: { id: Section; icon: any; label: string }[] = [
  { id: 'inicio', icon: LayoutDashboard, label: 'Inicio' },
  { id: 'liquidaciones', icon: ReceiptText, label: 'Liquidaciones' },
  { id: 'tarifario', icon: ClipboardList, label: 'Tarifario' },
  { id: 'archivos', icon: FolderOpen, label: 'Mis Archivos' },
  { id: 'afiliados', icon: Users, label: 'Afiliados' },
  { id: 'contacto', icon: MessageCircle, label: 'Contacto' },
];

export const DashboardPrestador: React.FC<DashboardPrestadorProps> = ({ onLogout }) => {
  const [activeSection, setActiveSection] = useState<Section>('inicio');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [datos, setDatos] = useState<DatosPrestador | null>(null);
  const [loadingDatos, setLoadingDatos] = useState(true);

  const fetchDatos = async () => {
    try {
      const d = await apiService.getDatosPrestador();
      setDatos(d);
    } catch (err: any) {
      if (err.message === 'SESSION_EXPIRED') { onLogout(); return; }
    } finally {
      setLoadingDatos(false);
    }
  };

  useEffect(() => {
    fetchDatos();
  }, []);

  const handleSessionExpired = () => onLogout();

  const handleNavClick = (id: Section) => {
    setActiveSection(id);
    setSidebarOpen(false);
  };

  const today = new Date().toLocaleDateString('es-AR', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  const renderSection = () => {
    switch (activeSection) {
      case 'inicio':
        return <PerfilPrestador datos={datos} onUpdate={fetchDatos} />;
      case 'liquidaciones':
        return <Liquidaciones onSessionExpired={handleSessionExpired} />;
      case 'tarifario':
        return <Tarifario onSessionExpired={handleSessionExpired} />;
      case 'archivos':
        return <MisArchivos onSessionExpired={handleSessionExpired} />;
      case 'afiliados':
        return <BuscadorAfiliados onSessionExpired={handleSessionExpired} />;
      case 'contacto':
        return <ContactoPrestador onSessionExpired={handleSessionExpired} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex">
      {/* Overlay móvil */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full z-40 flex flex-col transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:flex`}
        style={{ width: 260, backgroundColor: '#0f2a4a', minHeight: '100vh' }}
      >
        {/* Logo / Header sidebar */}
        <div className="px-6 py-6 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#00AEEF] rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-black text-xs">P</span>
            </div>
            <div>
              <p className="text-white font-black text-sm leading-tight">Portal</p>
              <p className="text-[#00AEEF] font-black text-xs leading-tight">Prestadores</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white/40 hover:text-white transition-colors p-1"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navegación */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl font-black transition-all text-left ${
                activeSection === item.id
                  ? 'bg-[#00AEEF] text-white shadow-lg'
                  : 'text-white/50 hover:bg-white/10 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon size={18} strokeWidth={activeSection === item.id ? 2.5 : 2} />
                <span className="text-[11px] uppercase tracking-wider">{item.label}</span>
              </div>
              {activeSection === item.id && <ChevronRight size={14} />}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-white/10">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-white/50 hover:bg-red-500/20 hover:text-red-400 font-black transition-all text-left"
          >
            <LogOut size={18} />
            <span className="text-[11px] uppercase tracking-wider">Cerrar sesión</span>
          </button>
        </div>
      </aside>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-100 sticky top-0 z-20 shadow-sm">
          <div className="px-6 lg:px-8 py-4 flex items-center gap-4">
            {/* Botón menú mobile */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-[#1C75BB] hover:bg-slate-100 rounded-xl transition-colors"
            >
              <Menu size={22} />
            </button>

            <img src={headerLogo} alt="OSAPM" className="h-8 lg:h-10 object-contain" />

            <div className="hidden md:block h-6 w-px bg-gray-200 mx-2"></div>

            <div className="flex-1">
              {loadingDatos ? (
                <div className="h-5 w-48 bg-slate-100 rounded-lg animate-pulse"></div>
              ) : (
                <div>
                  <p className="font-black text-[#1C75BB] text-sm leading-tight">
                    Bienvenido/a, {datos?.nombre ?? '—'}
                  </p>
                  <p className="text-[10px] text-gray-400 font-medium capitalize">{today}</p>
                </div>
              )}
            </div>

            <button
              onClick={onLogout}
              className="hidden lg:flex items-center gap-2 px-4 py-2 bg-slate-100 text-[#1C75BB] rounded-xl font-black text-[10px] transition-all hover:bg-red-50 hover:text-red-500 uppercase tracking-widest active:scale-95"
            >
              <LogOut size={14} /> Salir
            </button>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 px-6 lg:px-8 py-8">
          {loadingDatos && activeSection === 'inicio' ? (
            <div className="h-[50vh] flex flex-col items-center justify-center text-[#1C75BB]">
              <Loader2 className="animate-spin w-10 h-10 mb-4" />
              <p className="font-black text-xs text-gray-400 uppercase tracking-widest">Cargando datos del prestador...</p>
            </div>
          ) : (
            renderSection()
          )}
        </main>
      </div>
    </div>
  );
};
