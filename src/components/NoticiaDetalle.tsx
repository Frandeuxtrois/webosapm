import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Calendar, Clock, ImageOff, ChevronRight, X, ZoomIn, ZoomOut } from 'lucide-react';
import { apiService, Noticia, BACKOFFICE_API_BASE_URL } from '../services/api';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800';

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' });

const readingTime = (html: string) =>
  Math.max(1, Math.round(html.replace(/<[^>]+>/g, '').split(/\s+/).filter(Boolean).length / 200));

const getImg = (n: Noticia) =>
  n.imagenes?.length ? `${BACKOFFICE_API_BASE_URL}${n.imagenes[0].rutaImagen}` : '';

const Lightbox: React.FC<{ src: string; alt: string; onClose: () => void }> = ({ src, alt, onClose }) => {
  const [zoom, setZoom] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const dragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const posRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [onClose]);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setZoom((z) => Math.min(5, Math.max(1, z - e.deltaY * 0.001)));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom === 1) return;
    dragging.current = true;
    dragStart.current = { x: e.clientX - posRef.current.x, y: e.clientY - posRef.current.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging.current) return;
    const nx = e.clientX - dragStart.current.x;
    const ny = e.clientY - dragStart.current.y;
    posRef.current = { x: nx, y: ny };
    setPos({ x: nx, y: ny });
  };

  const handleMouseUp = () => { dragging.current = false; };

  const resetZoom = () => { setZoom(1); setPos({ x: 0, y: 0 }); posRef.current = { x: 0, y: 0 }; };

  return (
    <div
      className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      onWheel={handleWheel}
    >
      {/* Controles */}
      <div className="absolute top-4 right-4 flex gap-2 z-10">
        <button onClick={() => setZoom((z) => Math.min(5, z + 0.5))} className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors">
          <ZoomIn size={20} />
        </button>
        <button onClick={() => { zoom > 1 ? setZoom((z) => Math.max(1, z - 0.5)) : null; if (zoom <= 1.5) resetZoom(); }} className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors">
          <ZoomOut size={20} />
        </button>
        <button onClick={onClose} className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors">
          <X size={20} />
        </button>
      </div>

      {zoom > 1 && (
        <button onClick={resetZoom} className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/50 text-xs hover:text-white transition-colors">
          Restablecer zoom
        </button>
      )}

      <img
        src={src}
        alt={alt}
        draggable={false}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{
          transform: `scale(${zoom}) translate(${pos.x / zoom}px, ${pos.y / zoom}px)`,
          cursor: zoom > 1 ? (dragging.current ? 'grabbing' : 'grab') : 'default',
          transition: dragging.current ? 'none' : 'transform 0.2s ease',
          maxWidth: '90vw',
          maxHeight: '90vh',
          objectFit: 'contain',
          userSelect: 'none',
        }}
      />
    </div>
  );
};

export const NoticiaDetalle: React.FC<{ id: number; onBack: () => void; onNoticiaClick: (id: number) => void }> = ({ id, onBack, onNoticiaClick }) => {
  const [noticia, setNoticia] = useState<Noticia | null>(null);
  const [otras, setOtras] = useState<Noticia[]>([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const articleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoading(true);
    setNoticia(null);
    Promise.all([
      apiService.getNoticiaDetalle(id),
      apiService.getNoticias(3)
    ]).then(([detalle, todas]) => {
      setNoticia(detalle);
      setOtras(todas.filter((n) => n.idNoticia !== id).slice(0, 3));
    }).catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    const onScroll = () => {
      const el = articleRef.current;
      if (!el) return;
      const { top, height } = el.getBoundingClientRect();
      const visible = Math.max(0, -top);
      setProgress(Math.min(100, (visible / (height - window.innerHeight)) * 100));
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [noticia]);

  return (
    <div ref={articleRef} className="min-h-screen bg-gray-50">

      {/* BARRA DE PROGRESO */}
      <div className="fixed top-0 left-0 z-[60] h-1 bg-celeste transition-all duration-100" style={{ width: `${progress}%` }} />

      {/* HERO IMAGEN */}
      <div className="relative h-[70vh] min-h-[400px] w-full overflow-hidden">
        {loading ? (
          <div className="w-full h-full bg-gray-300 animate-pulse" />
        ) : noticia && getImg(noticia) ? (
          <img src={getImg(noticia)} alt={noticia?.titulo} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-celeste to-azul flex items-center justify-center">
            <ImageOff size={64} className="text-white/30" />
          </div>
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />

        {/* Botón volver */}
        <button
          onClick={onBack}
          className="absolute top-24 left-6 md:left-12 inline-flex items-center gap-2 text-white/80 hover:text-white font-semibold text-sm transition-all bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full"
        >
          <ArrowLeft size={16} /> Volver
        </button>

        {/* Título sobre imagen */}
        {!loading && noticia && (
          <div className="absolute bottom-0 left-0 right-0 px-6 md:px-16 pb-10">
            <div className="max-w-4xl mx-auto">
              <span className="inline-block px-4 py-1.5 bg-celeste text-white text-xs font-black uppercase tracking-widest rounded-full mb-4 shadow">
                Novedad
              </span>
              <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-4">
                {noticia.titulo}
              </h1>
              <div className="flex flex-wrap items-center gap-5 text-white/70 text-sm">
                <span className="flex items-center gap-1.5"><Calendar size={14} />{formatDate(noticia.vigenciaDesde)}</span>
                {noticia.cuerpo && <span className="flex items-center gap-1.5"><Clock size={14} />{readingTime(noticia.cuerpo)} min de lectura</span>}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CUERPO ARTÍCULO */}
      <div className="max-w-4xl mx-auto px-6 md:px-8 py-12">
        {loading && (
          <div className="space-y-4 animate-pulse">
            <div className="h-5 w-full bg-gray-200 rounded-full" />
            <div className="h-5 w-5/6 bg-gray-200 rounded-full" />
            <div className="h-5 w-4/6 bg-gray-200 rounded-full" />
            <div className="h-5 w-full bg-gray-200 rounded-full" />
            <div className="h-5 w-3/4 bg-gray-200 rounded-full" />
          </div>
        )}

        {!loading && noticia && (
          <>
            {/* Copete */}
            {noticia.copete && (
              <p className="text-xl text-gray-600 font-medium leading-relaxed border-l-4 border-celeste pl-5 mb-8">
                {noticia.copete}
              </p>
            )}

            {/* Cuerpo */}
            <div
              className="prose prose-lg prose-blue max-w-none text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: noticia.cuerpo }}
            />

            {/* Galería adicional */}
            {noticia.imagenes && noticia.imagenes.length > 1 && (
              <div className="mt-10 grid grid-cols-2 gap-4">
                {noticia.imagenes.slice(1).map((img) => {
                  const src = `${BACKOFFICE_API_BASE_URL}${img.rutaImagen}`;
                  return (
                    <div
                      key={img.idImagen}
                      className="relative h-52 rounded-2xl overflow-hidden shadow bg-gray-100 cursor-zoom-in group"
                      onClick={() => setLightboxSrc(src)}
                    >
                      <img src={src} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover scale-110 blur-md opacity-50" />
                      <img src={src} alt={img.epigrafe ?? ''} className="absolute inset-0 w-full h-full object-contain z-10 transition-transform duration-300 group-hover:scale-105" />
                      <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                        <ZoomIn size={32} className="text-white drop-shadow-lg" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>

      {/* LIGHTBOX */}
      {lightboxSrc && <Lightbox src={lightboxSrc} alt="" onClose={() => setLightboxSrc(null)} />}

      {/* OTRAS NOTICIAS */}
      {!loading && otras.length > 0 && (
        <div className="bg-white border-t border-gray-100 py-12 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl font-black text-azul mb-6 flex items-center gap-2">
              Otras noticias
              <span className="block w-8 h-1 bg-celeste rounded-full" />
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {otras.map((n) => (
                <div
                  key={n.idNoticia}
                  onClick={() => onNoticiaClick(n.idNoticia)}
                  className="flex gap-3 items-start cursor-pointer group hover:bg-gray-50 p-3 rounded-2xl transition-colors"
                >
                  <img
                    src={getImg(n) || PLACEHOLDER}
                    alt={n.titulo}
                    className="w-20 h-20 object-cover rounded-xl shrink-0"
                  />
                  <div>
                    <p className="text-xs text-gray-400 mb-1">{formatDate(n.vigenciaDesde)}</p>
                    <p className="text-sm font-bold text-slate-800 group-hover:text-celeste transition-colors line-clamp-3 leading-snug">
                      {n.titulo}
                    </p>
                    <span className="inline-flex items-center gap-1 text-celeste text-xs font-semibold mt-1">
                      Leer <ChevronRight size={11} />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
