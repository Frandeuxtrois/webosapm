import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { NAV_STRUCTURE } from '../constants';
import { Button } from './ui/Button';

// Importación del logo
import headerLogo from '../assets/headerlogo.png';

interface HeaderProps {
  isLoggedIn?: boolean;
  onActionClick?: (type: 'afiliado' | 'prestador') => void;
  onCentroMedicoClick?: () => void;
  onHomeClick?: () => void;
  onSectionClick?: (hash: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  isLoggedIn,
  onActionClick,
  onCentroMedicoClick,
  onHomeClick,
  onSectionClick
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setIsOpen(false);
    setActiveDropdown(null);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      onSectionClick?.(href);
      setIsOpen(false);
    }
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <header className={`fixed w-full z-50 transition-[background-color,padding,box-shadow] duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-xl shadow-lg py-2' : 'bg-white/100 py-4'
      } border-b border-gray-100`}>

      {/* TEXTURA GRANULADA */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.08] z-[-1]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

      <div className="max-w-full mx-auto px-6 md:px-10 lg:px-16 relative z-10">
        <div className="flex justify-between items-center h-12">

          {/* LOGO */}
          <div className="flex-shrink-0 flex items-center">
            <button onClick={() => { onHomeClick?.(); setIsOpen(false); }} className="transition-transform hover:scale-105 block outline-none">
              <img src={headerLogo} alt="Logo" className={`transition-all duration-300 object-contain ${scrolled ? 'h-9' : 'h-12'}`} />
            </button>
          </div>

          {/* NAVEGACIÓN DESKTOP */}
          <nav className="hidden md:flex space-x-5 lg:space-x-8 items-center h-full">

            {/* OPCIÓN: INICIO (Agregada) */}
            <button
              onClick={() => { onHomeClick?.(); setIsOpen(false); }}
              className="text-[#1C75BB] hover:text-[#00AEEF] font-bold text-[12px] uppercase tracking-wider transition-colors leading-none"
            >
              Inicio
            </button>

            {/* OPCIÓN: CENTRO MÉDICO */}
            <button
              onClick={() => { onCentroMedicoClick?.(); setIsOpen(false); }}
              className="text-[#1C75BB] hover:text-[#00AEEF] font-bold text-[12px] uppercase tracking-wider transition-colors leading-none"
            >
              Centro Médico
            </button>

            {NAV_STRUCTURE.map((group) => (
              <div key={group.label} className="relative group flex items-center h-full">
                {group.items ? (
                  <button className="flex items-center text-[#1C75BB] hover:text-[#00AEEF] font-bold text-[12px] uppercase tracking-wider transition-colors leading-none">
                    {group.label} <ChevronDown className="ml-1 h-3.5 w-3.5" />
                  </button>
                ) : (
                  <a href={group.href} onClick={(e) => handleNavClick(e, group.href!)} className="text-[#1C75BB] hover:text-[#00AEEF] font-bold text-[12px] uppercase tracking-wider transition-colors leading-none">
                    {group.label}
                  </a>
                )}

                {/* Submenú Desktop - Corregido el GAP con padding superior en el contenedor */}
                {group.items && (
                  <div className="absolute right-0 top-full hidden group-hover:block pt-2 animate-in fade-in zoom-in-95 duration-200">
                    <div className="w-64 rounded-2xl shadow-2xl bg-white border border-gray-100 overflow-hidden">
                      <div className="py-2 text-[#1C75BB]">
                        {group.items.map((item) => (
                          <a
                            key={item.label}
                            href={item.href}
                            onClick={(e) => handleNavClick(e, item.href)}
                            className="block px-5 py-3 text-[11px] font-bold hover:bg-slate-50 hover:text-[#00AEEF] transition-colors uppercase tracking-tight"
                          >
                            {item.label}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {!isLoggedIn && (
              <div className="relative group flex items-center h-full">
                <button className="text-[#1C75BB] hover:text-[#00AEEF] font-bold text-[12px] uppercase tracking-wider px-2 leading-none transition-colors flex items-center">
                  Ingresar <ChevronDown className="ml-1 h-4 w-4" />
                </button>
                {/* Corregido el GAP aquí también */}
                <div className="absolute right-0 top-full hidden group-hover:block pt-2 animate-in fade-in zoom-in-95 duration-200">
                  <div className="w-52 rounded-2xl shadow-2xl bg-white border border-gray-100 overflow-hidden">
                    <div className="py-2 text-[#1C75BB]">
                      <button onClick={() => onActionClick?.('afiliado')} className="w-full text-left block px-5 py-3 text-[11px] font-bold hover:bg-slate-50 hover:text-[#00AEEF] transition-colors uppercase">Portal Afiliados</button>
                      <button onClick={() => onActionClick?.('prestador')} className="w-full text-left block px-5 py-3 text-[11px] font-bold hover:bg-slate-50 hover:text-[#00AEEF] rounded-xl transition-colors uppercase">Portal Prestadores</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <Button
              onClick={() => onActionClick?.('afiliado')}
              className={`ml-4 py-2.5 px-8 text-[11px] font-black uppercase tracking-[0.15em] transition-all rounded-xl shadow-lg 
              ${isLoggedIn ? 'bg-white border-2 border-celeste text-celeste hover:bg-celeste hover:text-white' : 'bg-[#00AEEF] text-white hover:bg-[#1C75BB]'}`}
            >
              {isLoggedIn ? 'Mi Perfil' : 'Quiero Afiliarme!'}
            </Button>
          </nav>

          {/* BOTÓN MENÚ MÓVIL */}
          <div className="md:hidden flex items-center h-full">
            <button onClick={toggleMenu} className="text-[#1C75BB] p-2 hover:text-[#00AEEF] outline-none">
              {isOpen ? <X size={32} /> : <Menu size={32} />}
            </button>
          </div>
        </div>
      </div>

      {/* MENÚ MÓVIL */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-2xl border-t border-gray-100 animate-in slide-in-from-top duration-300">
          <div className="px-6 pt-4 pb-10 space-y-3 h-screen overflow-y-auto bg-white">
            <button onClick={() => { onHomeClick?.(); setIsOpen(false); }} className="w-full text-left py-4 text-sm font-black text-[#1C75BB] uppercase border-b border-gray-50">Inicio</button>
            <button onClick={() => { onCentroMedicoClick?.(); setIsOpen(false); }} className="w-full text-left py-4 text-sm font-black text-[#1C75BB] uppercase border-b border-gray-50">Centro Médico</button>

            {NAV_STRUCTURE.map((group) => (
              <div key={group.label} className="border-b border-gray-100 pb-2 text-[#1C75BB]">
                {group.items ? (
                  <>
                    <button onClick={() => setActiveDropdown(activeDropdown === group.label ? null : group.label)} className="w-full flex justify-between items-center py-4 text-sm font-black uppercase">
                      {group.label} <ChevronDown className={`h-5 w-5 transition-transform ${activeDropdown === group.label ? 'rotate-180' : ''}`} />
                    </button>
                    {activeDropdown === group.label && (
                      <div className="pl-4 space-y-1 bg-slate-50/50 rounded-2xl animate-in fade-in slide-in-from-top-1 duration-200">
                        {group.items.map((item) => (
                          <a key={item.label} href={item.href} onClick={(e) => handleNavClick(e, item.href)} className="block px-4 py-4 text-xs font-bold opacity-70">{item.label}</a>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <a href={group.href} onClick={(e) => handleNavClick(e, group.href!)} className="block py-4 text-sm font-black uppercase">{group.label}</a>
                )}
              </div>
            ))}

            <div className="pt-6 space-y-4">
              {!isLoggedIn && (
                <div className="bg-slate-50 rounded-3xl p-5 border border-gray-100 text-center">
                  <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Ingresar</span>
                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => { onActionClick?.('afiliado'); setIsOpen(false); }} className="py-3 bg-white text-[#1C75BB] font-bold text-[10px] uppercase rounded-xl border border-gray-200 shadow-sm">Afiliado</button>
                    <button onClick={() => { onActionClick?.('prestador'); setIsOpen(false); }} className="py-3 bg-white text-[#1C75BB] font-bold text-[10px] uppercase rounded-xl border border-gray-200 shadow-sm">Prestador</button>
                  </div>
                </div>
              )}
              <Button onClick={() => { onActionClick?.('afiliado'); setIsOpen(false); }} className="w-full py-4 text-xs font-black uppercase justify-center bg-[#00AEEF] text-white shadow-xl rounded-full">
                {isLoggedIn ? 'Mi Perfil' : 'Quiero afiliarme'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};