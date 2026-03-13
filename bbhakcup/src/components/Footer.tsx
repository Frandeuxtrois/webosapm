import React from 'react';
import { Facebook, Instagram, Linkedin, Phone, MapPin, Globe } from 'lucide-react';

// Importamos el mismo logo que en el header
import footerLogo from '../assets/headerlogo.png';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-oscuro text-white pt-20 pb-10 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* COLUMNAS: Se eliminó la línea de borde inferior (border-b) */}
        <div className="grid md:grid-cols-4 gap-12 mb-12">

          {/* COLUMNA 1: LOGO Y REDES */}
          <div className="col-span-1 md:col-span-1">
            <div className="mb-4">
              <a href="/" className="inline-block transition-transform hover:scale-105">
                <img
                  src={footerLogo}
                  alt="Logo OSAPM"
                  className="h-12 w-auto object-contain"
                />
              </a>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Comprometidos con tu salud y bienestar desde hace más de 70 años.
              Cobertura nacional y atención personalizada.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com/osapmorg" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white/5 text-gray-400 hover:text-white hover:bg-celeste transition-all">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://www.instagram.com/osapmorg/" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white/5 text-gray-400 hover:text-white hover:bg-celeste transition-all">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://www.linkedin.com/company/osapm---obra-social-agentes-de-propaganda-medica/" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white/5 text-gray-400 hover:text-white hover:bg-celeste transition-all">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* COLUMNA 2: INSTITUCIONAL */}
          <div>
            <h3 className="font-bold text-lg mb-6 text-white border-l-4 border-celeste pl-3 uppercase text-xs tracking-widest">Institucional</h3>
            <ul className="space-y-4 text-sm text-gray-400 font-medium">
              <li><a href="#" className="hover:text-celeste transition-colors">Nosotros</a></li>
              <li><a href="#" className="hover:text-celeste transition-colors">Autoridades</a></li>
              <li><a href="#" className="hover:text-celeste transition-colors">Cartilla Médica</a></li>
            </ul>
          </div>

          {/* COLUMNA 3: LEGALES Y CONTROL */}
          <div>
            <h3 className="font-bold text-lg mb-6 text-white border-l-4 border-celeste pl-3 uppercase text-xs tracking-widest">Legales</h3>
            <ul className="space-y-4 text-sm text-gray-400 font-medium">
              <li><a href="#" className="hover:text-celeste transition-colors">Términos y Condiciones</a></li>
              <li><a href="#" className="hover:text-celeste transition-colors">Política de Privacidad</a></li>
              <li>
                <a
                  href="https://www.argentina.gob.ar/economia/industria-y-comercio/defensadelconsumidor"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-celeste transition-colors"
                >
                  Defensa al Consumidor
                </a>
              </li>
              <li>
                <a
                  href="https://www.argentina.gob.ar/sssalud"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-celeste transition-colors text-xs leading-tight block"
                >
                  Superintendencia de Servicios de Salud
                </a>
              </li>
            </ul>
          </div>

          {/* COLUMNA 4: CONTACTO SEDE */}
          <div>
            <h3 className="font-bold text-lg mb-6 text-white border-l-4 border-celeste pl-3 uppercase text-xs tracking-widest">Sede Central</h3>
            <ul className="space-y-4 text-sm text-gray-400 font-medium">
              <li className="flex items-start gap-3">
                <MapPin className="text-celeste shrink-0" size={18} />
                <span>Avellaneda 2144 (C1406FYT) <br /> CABA, Argentina</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="text-celeste shrink-0" size={18} />
                <span>(54-11) 4633-7878 / 9336</span>
              </li>
              <li className="flex items-center gap-3">
                <Globe className="text-celeste shrink-0" size={18} />
                <span>www.osapm.org</span>
              </li>
            </ul>
          </div>
        </div>

        {/* BARRA INFERIOR: Se mantiene este borde (border-t) como la única línea divisoria */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-6 border-t border-gray-800 pt-12">
          <div className="text-center lg:text-left">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Identificación Institucional</p>
            <p className="text-xs text-gray-400 font-mono">RNAS: 1-1820-0 | RNEMP: 614173</p>
          </div>

          <div className="text-center lg:text-right">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Organismo de Control SSSALUD</p>
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
              <p className="text-[#00AEEF] font-black text-sm italic">0800-222-SALUD (72583)</p>
              <span className="hidden sm:block text-gray-700">|</span>
              <a href="https://www.sssalud.gob.ar" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white text-xs underline">www.sssalud.gob.ar</a>
            </div>
          </div>
        </div>

        {/* COPYRIGHT FINAL */}
        <div className="mt-10 text-center text-[10px] text-gray-600 uppercase tracking-[0.3em]">
          <p>&copy; {new Date().getFullYear()} OSAPM - Todos los derechos reservados.</p>
          {/* Al lado del copyright o en una esquina */}
          <button
            onClick={() => window.location.href = '/admin-dashboard'}
            className="opacity-0 hover:opacity-10 transition-opacity text-[8px]"
          >
            Admin
          </button>
        </div>
      </div>
    </footer>
  );
};