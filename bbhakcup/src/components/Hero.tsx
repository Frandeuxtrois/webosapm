import React, { useState, useEffect } from 'react';
import { Button } from './ui/Button';
import { ChevronLeft, ChevronRight, Zap, Smartphone, CheckCircle2 } from 'lucide-react';

// Data optimizada: Atractiva para jóvenes, honesta y profesional
const MOCK_NEWS = [
  {
    id: 1,
    title: "Tu salud, en tu celular",
    description: "Olvidate de las filas y los trámites. Autorizaciones, turnos y tu credencial digital siempre con vos en nuestra App. Gestión 100% online.",
    images: [
      'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1551288049-bbbda536ad37?auto=format&fit=crop&q=80&w=800'
    ]
  },
  {
    id: 2,
    title: "Atención Médica 24/7",
    description: "Consultas médicas por videollamada en el momento. Resolvé tus dudas de salud estés donde estés, sin esperas innecesarias.",
    images: [
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1581056771107-24ca5f033842?auto=format&fit=crop&q=80&w=800"
    ]
  },
  {
    id: 3,
    title: "Centro Médico OSAPM",
    description: "Accedé a nuestro nuevo Centro Médico OSAPM",
    images: [
      '/centromedico.png',
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800'
    ]
  }
];

const InnerCardCarousel: React.FC<{ images: string[], isActiveCard: boolean }> = ({ images, isActiveCard }) => {
  const [imgIndex, setImgIndex] = useState(0);

  useEffect(() => {
    if (!isActiveCard || images.length <= 1) return;
    const interval = setInterval(() => {
      setImgIndex((prev) => (prev + 1) % images.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [isActiveCard, images.length]);

  return (
    <div className="relative w-full h-full group/inner">
      {images.map((img, i) => (
        <img
          key={i}
          src={img}
          alt={`Slide ${i}`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${i === imgIndex ? 'opacity-100' : 'opacity-0'}`}
        />
      ))}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {images.map((_, i) => (
            <div key={i} className={`h-1.5 rounded-full transition-all ${i === imgIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/50'}`} />
          ))}
        </div>
      )}
    </div>
  );
};

export const Hero: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // LOGICA DE SCROLL: Lleva al usuario a la sección con id="planes"
  const scrollToPlanes = () => {
    const planesSection = document.getElementById('planes');
    if (planesSection) {
      planesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const timer = setInterval(() => nextSlide(), 9000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % MOCK_NEWS.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + MOCK_NEWS.length) % MOCK_NEWS.length);

  return (
    <section className="relative h-screen min-h-[800px] flex items-center bg-gradient-to-br from-celeste to-azul overflow-hidden">

      {/* Elementos decorativos de fondo */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-white opacity-10 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-white opacity-10 blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full pt-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* LADO IZQUIERDO: TEXTO Y ACCIONES */}
          <div className="text-center lg:text-left space-y-8 animate-fade-in">

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium">
              <Zap size={16} className="text-yellow-300 fill-yellow-300" />
              <span>Inscripción 100% Online y rápida</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight">
              Tu salud, <br />
              <span className="text-white opacity-90 font-light italic">a tu ritmo.</span>
            </h1>

            <p className="text-xl md:text-2xl text-white/95 max-w-2xl mx-auto lg:mx-0 font-light leading-relaxed">
              Redefinimos el cuidado de la salud priorizando tu tiempo y tu tranquilidad. Creemos en una medicina de <strong>alta calidad</strong> impulsada por la innovación tecnológica, ofreciéndote una experiencia digital fluida, segura y transparente. Trabajamos para que cada gestión sea más dinámica, permitiéndote acceder a la mejor red de profesionales con la rapidez que el ritmo de vida actual exige.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              <Button
                variant="white"
                className="text-azul font-black shadow-xl hover:shadow-2xl hover:scale-105 transition-all px-12 py-5 text-lg"
              >
                Sumarme ahora
              </Button>
              <Button
                variant="outline"
                onClick={scrollToPlanes}
                className="border-white text-white hover:bg-white/10 px-12 py-5 backdrop-blur-sm text-lg transition-all"
              >
                Conocé nuestros planes
              </Button>
            </div>

            {/* Badges de confianza sutiles */}
            <div className="flex flex-wrap gap-6 justify-center lg:justify-start pt-8 text-white/80">
              <div className="flex items-center gap-2">
                <Smartphone size={20} />
                <span className="text-sm font-medium">App Propia</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={20} />
                <span className="text-sm font-medium">Gestión Simple</span>
              </div>
            </div>
          </div>

          {/* LADO DERECHO: CARRUSEL STACKED */}
          <div className="relative flex flex-col items-center justify-center">
            <div className="relative w-full h-[600px] flex items-center justify-center">
              {MOCK_NEWS.map((item, index) => {
                let position = index - currentIndex;
                if (position < 0) position += MOCK_NEWS.length;

                const isActive = position === 0;
                const isNext = position === 1 || (currentIndex === MOCK_NEWS.length - 1 && index === 0);

                return (
                  <div
                    key={item.id}
                    className={`absolute w-full max-w-[500px] transition-all duration-700 cubic-bezier(0.4, 0, 0.2, 1) transform 
                      ${isActive
                        ? 'z-30 opacity-100 translate-x-0 translate-y-0 scale-100 rotate-0'
                        : isNext
                          ? 'z-20 opacity-40 translate-x-12 translate-y-8 scale-90 rotate-2'
                          : 'z-10 opacity-0 translate-x-24 scale-75'
                      }`}
                  >
                    <div className={`bg-white rounded-[2.5rem] overflow-hidden shadow-2xl ${isActive ? 'shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)]' : ''}`}>
                      <div className="h-[380px] w-full relative overflow-hidden bg-gray-100">
                        <InnerCardCarousel images={item.images} isActiveCard={isActive} />
                        <div className="absolute top-6 left-6 z-20">
                          <span className="px-4 py-1.5 text-xs font-bold text-white bg-celeste backdrop-blur-md rounded-full uppercase tracking-widest shadow-md">
                            {item.id === 1 ? 'Destacado' : 'Novedades'}
                          </span>
                        </div>
                      </div>

                      <div className="p-8 bg-white min-h-[180px] flex flex-col justify-center border-t border-gray-50">
                        <h3 className="text-2xl font-black text-slate-800 mb-2 leading-tight">
                          {item.title}
                        </h3>
                        <p className="text-base text-gray-500 leading-relaxed font-normal">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CONTROLES */}
            <div className="flex gap-6 mt-4 z-40">
              <button
                onClick={prevSlide}
                className="p-4 rounded-full bg-white/20 text-white backdrop-blur-xl border border-white/30 hover:bg-white/40 transition-all shadow-xl active:scale-90"
              >
                <ChevronLeft size={30} />
              </button>
              <button
                onClick={nextSlide}
                className="p-4 rounded-full bg-white/20 text-white backdrop-blur-xl border border-white/30 hover:bg-white/40 transition-all shadow-xl active:scale-90"
              >
                <ChevronRight size={30} />
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};