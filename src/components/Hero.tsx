import React, { useState, useEffect } from 'react';
import { Button } from './ui/Button';
import { ChevronLeft, ChevronRight, Zap, Smartphone, CheckCircle2, ArrowRight, Calendar } from 'lucide-react';
import { apiService, Noticia, BACKOFFICE_API_BASE_URL } from '../services/api';

const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800';

const formatDate = (dateStr: string) => {
  try {
    return new Date(dateStr).toLocaleDateString('es-AR', { month: 'long', year: 'numeric' });
  } catch {
    return '';
  }
};

const getImages = (noticia: Noticia): string[] => {
  if (!noticia.imagenes || noticia.imagenes.length === 0) return [PLACEHOLDER_IMAGE];
  return noticia.imagenes.map((img) => `${BACKOFFICE_API_BASE_URL}${img.rutaImagen}`).filter(Boolean);
};


export const Hero: React.FC<{ onNoticiaClick?: (id: number) => void }> = ({ onNoticiaClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiService.getNoticias(3)
      .then(setNoticias)
      .catch((err) => console.error('Error cargando noticias:', err))
      .finally(() => setLoading(false));
  }, []);

  const scrollToPlanes = () => {
    const planesSection = document.getElementById('planes');
    if (planesSection) planesSection.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (noticias.length === 0) return;
    const timer = setInterval(() => nextSlide(), 9000);
    return () => clearInterval(timer);
  }, [currentIndex, noticias.length]);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % noticias.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + noticias.length) % noticias.length);

  return (
    <section className="relative flex items-center bg-gradient-to-br from-celeste to-azul overflow-hidden pt-24 pb-12 min-h-[750px]">

      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-white opacity-10 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-white opacity-10 blur-3xl"></div>

      <div className="relative z-10 w-full flex flex-col lg:flex-row items-center pl-8 lg:pl-16">

        {/* LADO IZQUIERDO */}
        <div className="w-full lg:w-1/2 shrink-0 text-center lg:text-left space-y-4 animate-fade-in -mt-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs font-medium">
            <Zap size={14} className="text-yellow-300 fill-yellow-300" />
            <span>Inscripción 100% Online y rápida</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight">
            Tu salud, <br />
            <span className="text-white opacity-90 font-light italic">a tu ritmo.</span>
          </h1>

          <p className="text-base md:text-lg text-white/95 max-w-xl mx-auto lg:mx-0 font-light leading-relaxed">
            Redefinimos el cuidado de la salud priorizando tu tiempo y tu tranquilidad. Creemos en una medicina de <strong>alta calidad</strong> impulsada por la innovación tecnológica, ofreciéndote una experiencia digital fluida, segura y transparente.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start pt-2">
            <Button variant="white" className="text-azul font-black shadow-xl hover:shadow-2xl hover:scale-105 transition-all px-8 py-3 text-base">
              Sumarme ahora
            </Button>
            <Button variant="outline" onClick={scrollToPlanes} className="border-white text-white hover:bg-white/10 px-8 py-3 backdrop-blur-sm text-base transition-all">
              Conocé nuestros planes
            </Button>
          </div>

          <div className="flex flex-wrap gap-4 justify-center lg:justify-start pt-2 text-white/80">
            <div className="flex items-center gap-2">
              <Smartphone size={16} />
              <span className="text-xs font-medium">App Propia</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} />
              <span className="text-xs font-medium">Gestión Simple</span>
            </div>
          </div>
        </div>

        {/* LADO DERECHO: CARRUSEL */}
        <div className="flex-1 relative flex flex-col items-center justify-center pr-8 mt-8">
          <div className="relative w-full h-[420px] flex items-center justify-center">

            {/* SKELETON */}
            {loading && (
              <div className="absolute w-full bg-white rounded-[2.5rem] overflow-hidden shadow-2xl animate-pulse">
                <div className="h-[240px] w-full bg-gray-200" />
                <div className="h-1 w-full bg-gradient-to-r from-celeste via-azul to-celeste" />
                <div className="px-8 py-7 flex flex-col gap-3">
                  <div className="h-4 w-24 bg-gray-200 rounded-full" />
                  <div className="h-7 w-3/4 bg-gray-200 rounded-full" />
                  <div className="h-4 w-full bg-gray-200 rounded-full" />
                  <div className="h-4 w-2/3 bg-gray-200 rounded-full" />
                </div>
              </div>
            )}

            {/* NOTICIAS */}
            {!loading && noticias.map((item, index) => {
              let position = index - currentIndex;
              if (position < 0) position += noticias.length;
              const isActive = position === 0;
              const isNext = position === 1 || (currentIndex === noticias.length - 1 && index === 0);
              const images = getImages(item);

              return (
                <div
                  key={item.idNoticia}
                  className={`absolute w-full transition-all duration-700 transform
                    ${isActive
                      ? 'z-30 opacity-100 translate-x-0 translate-y-0 scale-100 rotate-0'
                      : isNext
                        ? 'z-20 opacity-40 translate-x-10 translate-y-6 scale-90 rotate-2'
                        : 'z-10 opacity-0 translate-x-20 scale-75'
                    }`}
                >
                  <div className={`bg-white rounded-[2.5rem] overflow-hidden shadow-2xl ${isActive ? 'shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)]' : ''}`}>
                    <div className="h-[240px] w-full relative overflow-hidden bg-gray-100">
                      <img src={images[0]} alt={item.titulo} className="absolute inset-0 w-full h-full object-cover" />
                      <div className="absolute top-6 left-6 z-20">
                        <span className="px-4 py-1.5 text-xs font-bold text-white bg-celeste backdrop-blur-md rounded-full uppercase tracking-widest shadow-md">
                          Novedad
                        </span>
                      </div>
                    </div>

                    <div className="h-1 w-full bg-gradient-to-r from-celeste via-azul to-celeste" />

                    <div className="px-8 py-7 bg-white flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-gray-400 text-sm font-medium">
                          <Calendar size={14} />
                          <span>{formatDate(item.vigenciaDesde)}</span>
                        </div>
                        <span className="text-sm font-semibold text-celeste uppercase tracking-wider">Novedad</span>
                      </div>
                      <h3 className="text-2xl font-black text-slate-800 leading-tight">{item.titulo}</h3>
                      <p className="text-base text-gray-500 leading-relaxed font-normal line-clamp-2">{item.copete}</p>
                      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <button
                          onClick={() => onNoticiaClick?.(item.idNoticia)}
                          className="inline-flex items-center gap-1.5 text-sm font-semibold text-celeste hover:gap-3 transition-all duration-200"
                        >
                          Leer más <ArrowRight size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {!loading && noticias.length > 1 && (
            <div className="flex gap-6 mt-12 z-40">
              <button onClick={prevSlide} className="p-2 rounded-full bg-white/20 text-white backdrop-blur-xl border border-white/30 hover:bg-white/40 transition-all shadow-xl active:scale-90">
                <ChevronLeft size={18} />
              </button>
              <button onClick={nextSlide} className="p-2 rounded-full bg-white/20 text-white backdrop-blur-xl border border-white/30 hover:bg-white/40 transition-all shadow-xl active:scale-90">
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>

      </div>
    </section>
  );
};
