import React, { useEffect, useState } from 'react';
import { ArrowRight, Newspaper } from 'lucide-react';
import { apiService, Noticia, BACKOFFICE_API_BASE_URL } from '../services/api';

const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800';

const formatDate = (dateStr: string) => {
  try {
    return new Date(dateStr).toLocaleDateString('es-AR', { day: '2-digit', month: 'short' }).toUpperCase();
  } catch { return ''; }
};

const getThumb = (n: Noticia) =>
  n.imagenes?.length ? `${BACKOFFICE_API_BASE_URL}${n.imagenes[0].rutaImagen}` : PLACEHOLDER_IMAGE;

export const Hero: React.FC<{ onNoticiaClick?: (id: number) => void }> = ({ onNoticiaClick }) => {
  const [noticias, setNoticias] = useState<Noticia[]>([]);

  useEffect(() => {
    apiService.getNoticias(3).then(setNoticias).catch(() => {});
  }, []);

  const scrollToPlanes = () =>
    document.getElementById('planes')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden">

      {/* BG image — background-size para controlar zoom */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'url(/familia.png)',
          backgroundSize: '78% auto',
          backgroundPosition: 'right 15%',
          backgroundRepeat: 'no-repeat',
          backgroundColor: '#1565a8',
        }}
      />

      {/* Overlay SVG — C invertida, gradiente celeste → azul */}
      {/* Overlay — gradiente diagonal, de sólido a transparente */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(105deg, #1C75BB 0%, #1C75BB 22%, #1a8fd1 36%, rgba(0,174,239,0.25) 50%, transparent 63%)',
        }}
      />

      {/* Main content */}
      <div className="relative z-10 flex-1 flex items-center pt-20 pb-10">
        <div className="px-8 lg:px-16 max-w-xl">
          <p className="text-white/60 text-[11px] font-black uppercase tracking-[0.35em] mb-5">
            Obra Social de Agentes de Propaganda Médica
          </p>
          <h1 className="text-6xl md:text-7xl font-black text-white leading-[0.95] tracking-tighter mb-5">
            Tu salud,<br />
            <span className="font-light italic text-white/90">a tu ritmo.</span>
          </h1>
          <p className="text-white/75 text-base leading-relaxed max-w-sm mb-8">
            Cobertura nacional, atención personalizada y gestión 100% digital. Más de 70 años cuidando tu salud.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={scrollToPlanes}
              className="bg-white text-[#1C75BB] font-black px-7 py-3.5 rounded-full hover:bg-[#00AEEF] hover:text-white transition-all duration-300 shadow-xl text-sm uppercase tracking-wider"
            >
              Sumarme ahora
            </button>
            <button
              onClick={scrollToPlanes}
              className="border-2 border-white/40 text-white font-semibold px-7 py-3.5 rounded-full hover:bg-white/10 backdrop-blur-sm transition-all duration-300 text-sm uppercase tracking-wider"
            >
              Conocé nuestros planes
            </button>
          </div>
        </div>
      </div>

      {/* News strip — 3 cards horizontales, bottom right */}
      {noticias.length > 0 && (
        <div className="absolute bottom-8 right-6 lg:right-10 z-20 w-[600px]">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden shadow-2xl">

            <div className="flex items-center gap-2 px-5 pt-3 pb-2 border-b border-white/10">
              <Newspaper size={12} className="text-[#00AEEF]" />
              <span className="text-white/60 text-[12px] font-black uppercase tracking-[0.25em]">Últimas novedades</span>
            </div>

            <div className="grid grid-cols-3 divide-x divide-white/10">
              {noticias.slice(0, 3).map(n => (
                <button
                  key={n.idNoticia}
                  onClick={() => onNoticiaClick?.(n.idNoticia)}
                  className="flex flex-col gap-2 p-4 hover:bg-white/10 transition-colors text-left group"
                >
                  <div className="relative h-[80px] rounded-xl overflow-hidden">
                    <img src={getThumb(n)} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90" />
                  </div>
                  <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">{formatDate(n.vigenciaDesde)}</p>
                  <p className="text-white text-[16px] font-semibold leading-snug line-clamp-2 group-hover:text-[#00AEEF] transition-colors">{n.titulo}</p>
                  <span className="flex items-center gap-1 text-[#00AEEF]/70 text-[11px] font-bold group-hover:text-[#00AEEF] transition-colors mt-auto">
                    Leer más <ArrowRight size={10} />
                  </span>
                </button>
              ))}
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
