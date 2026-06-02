import React from 'react';
import { Phone, MapPin, Globe, Download } from 'lucide-react';

const SSS_DOCS = [
  { nombre: 'SSS 2026', tipo: 'PDF', url: '/cartilla-docs/SSS 2026.pdf' },
  { nombre: 'Anexo III — Período 2026', tipo: 'XLSX', url: '/cartilla-docs/Anexo III - 118200 Periodo 2026.xlsx' },
];

import footerLogo from '../assets/headerlogo.png';

const SocialBtn = ({ href, color, icon, label }: { href: string; color: string; icon: React.ReactNode; label: string }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="group relative flex items-center justify-start w-[38px] h-[38px] rounded-full overflow-hidden transition-all duration-300 hover:w-[118px] hover:rounded-[40px] active:translate-x-[2px] active:translate-y-[2px] shadow-md shrink-0"
    style={{ backgroundColor: color }}
  >
    <span className="w-full flex items-center justify-center transition-all duration-300 group-hover:w-[35%] group-hover:pl-[10px] shrink-0">
      {icon}
    </span>
    <span className="absolute right-0 w-0 opacity-0 text-white text-[13px] font-semibold whitespace-nowrap overflow-hidden transition-all duration-300 group-hover:w-[65%] group-hover:opacity-100 group-hover:pr-[10px]">
      {label}
    </span>
  </a>
);

interface FooterProps {
  onNavigate?: (view: string) => void;
  onSectionClick?: (hash: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onSectionClick }) => {
  return (
    <footer className="bg-oscuro text-white pt-20 pb-10 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid md:grid-cols-4 gap-12 mb-12">

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
            <div className="flex gap-3">
              <SocialBtn
                href="https://facebook.com/osapmorg"
                color="#1877F2"
                label="Facebook"
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" height="17" viewBox="0 0 320 512" fill="white">
                    <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"/>
                  </svg>
                }
              />
              <SocialBtn
                href="https://www.instagram.com/osapmorg/"
                color="#E1306C"
                label="Instagram"
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" height="17" viewBox="0 0 448 512" fill="white">
                    <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/>
                  </svg>
                }
              />
              <SocialBtn
                href="https://www.linkedin.com/company/osapm---obra-social-agentes-de-propaganda-medica/"
                color="#0A66C2"
                label="LinkedIn"
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" height="17" viewBox="0 0 448 512" fill="white">
                    <path d="M100.3 448H7.4V148.9h92.9zM53.8 108.1C24.1 108.1 0 83.5 0 53.8a53.8 53.8 0 0 1 107.6 0c0 29.7-24.1 54.3-53.8 54.3zM447.9 448h-92.7V302.4c0-34.7-.7-79.2-48.3-79.2-48.3 0-55.7 37.7-55.7 76.7V448h-92.8V148.9h89.1v40.8h1.3c12.4-23.5 42.7-48.3 87.9-48.3 94 0 111.3 61.9 111.3 142.3V448z"/>
                  </svg>
                }
              />
            </div>
          </div>

          <div>
            <h3 className="font-bold mb-6 text-white border-l-4 border-celeste pl-3 uppercase text-xs tracking-widest">Nosotros</h3>
            <ul className="space-y-4 text-sm text-gray-400 font-medium">


              <li>
                <button onClick={() => onNavigate?.('telefonos-utiles')} className="hover:text-celeste transition-colors text-left">
                  Teléfonos Útiles
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate?.('seccionales')} className="hover:text-celeste transition-colors text-left">
                  Oficinas
                </button>
              </li>
              <li>
                <button onClick={() => onSectionClick?.('#contacto')} className="hover:text-celeste transition-colors text-left">
                  Contacto
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-6 text-white border-l-4 border-red-500 pl-3 uppercase text-xs tracking-widest leading-tight">
              Si sos víctima de<br />violencia de género
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Llamá al{' '}
              <a href="tel:144" className="text-celeste font-black hover:underline">*144</a>
              . Las 24hs los 365 días del año.
            </p>
          </div>

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

        <div className="flex items-center gap-4 mt-6 text-[10px] text-gray-600 uppercase tracking-[0.3em]">
          {SSS_DOCS.map(({ nombre, tipo, url }) => (
            <a key={nombre} href={url} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-gray-400 transition-colors">
              <Download size={9} />
              {nombre} ({tipo})
            </a>
          ))}
        </div>

        <div className="mt-6 text-center text-[10px] text-gray-600 uppercase tracking-[0.3em] flex flex-col items-center gap-2">
          <p>&copy; {new Date().getFullYear()} OSAPM - Todos los derechos reservados.</p>
          <a href="/privacidad.html" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-400 transition-colors underline underline-offset-2">
            Política de Privacidad
          </a>
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