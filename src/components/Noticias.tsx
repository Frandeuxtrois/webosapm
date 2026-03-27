import React, { useState, useEffect } from 'react';
import { Calendar, Clock, ArrowRight, Newspaper } from 'lucide-react';
import { apiService, Noticia, BACKOFFICE_API_BASE_URL } from '../services/api';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800';

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' });

const readingTime = (html: string) => {
  const words = html.replace(/<[^>]+>/g, '').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
};

const getImg = (n: Noticia) =>
  n.imagenes?.length ? `${BACKOFFICE_API_BASE_URL}${n.imagenes[0].rutaImagen}` : PLACEHOLDER;

const SkeletonCard = ({ big = false }: { big?: boolean }) => (
  <div className={`bg-white rounded-3xl overflow-hidden animate-pulse ${big ? 'h-[500px]' : 'h-72'}`}>
    <div className={`bg-gray-200 ${big ? 'h-72' : 'h-40'}`} />
    <div className="p-5 space-y-3">
      <div className="h-3 w-20 bg-gray-200 rounded-full" />
      <div className="h-5 w-3/4 bg-gray-200 rounded-full" />
      <div className="h-3 w-full bg-gray-200 rounded-full" />
    </div>
  </div>
);

export const Noticias: React.FC<{ onNoticiaClick: (id: number) => void }> = ({ onNoticiaClick }) => {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiService.getNoticias(3)
      .then(setNoticias)
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const [destacada, ...resto] = noticias;

  return (
    <section className="min-h-screen bg-gray-50 pt-28 pb-16 px-4">
      <div className="max-w-6xl mx-auto">

        {/* ENCABEZADO */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <Newspaper size={22} className="text-celeste" />
            <span className="text-xs font-black uppercase tracking-widest text-celeste">Portal de noticias</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-azul leading-tight">
            Noticias
            <span className="block w-16 h-1 bg-celeste mt-3 rounded-full" />
          </h1>
          {!loading && noticias.length > 0 && (
            <p className="text-gray-400 text-sm mt-3">
              {noticias.length} {noticias.length === 1 ? 'noticia' : 'noticias'} publicadas
            </p>
          )}
        </div>

        {/* SKELETON */}
        {loading && (
          <div className="space-y-6">
            <SkeletonCard big />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <SkeletonCard /><SkeletonCard /><SkeletonCard />
            </div>
          </div>
        )}

        {/* SIN NOTICIAS */}
        {!loading && noticias.length === 0 && (
          <div className="text-center py-24 text-gray-400">
            <Newspaper size={48} className="mx-auto mb-4 opacity-30" />
            <p className="font-semibold">No hay noticias publicadas aún.</p>
          </div>
        )}

        {/* NOTICIA DESTACADA */}
        {!loading && destacada && (
          <div
            onClick={() => onNoticiaClick(destacada.idNoticia)}
            className="relative rounded-3xl overflow-hidden h-[480px] mb-8 cursor-pointer group shadow-xl"
          >
            <img
              src={getImg(destacada)}
              alt={destacada.titulo}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

            <div className="absolute top-6 left-6">
              <span className="px-4 py-1.5 bg-celeste text-white text-xs font-black uppercase tracking-widest rounded-full shadow">
                Destacado
              </span>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="flex items-center gap-4 text-white/70 text-sm mb-3">
                <span className="flex items-center gap-1.5"><Calendar size={13} />{formatDate(destacada.vigenciaDesde)}</span>
                {destacada.cuerpo && <span className="flex items-center gap-1.5"><Clock size={13} />{readingTime(destacada.cuerpo)} min de lectura</span>}
              </div>
              <h2 className="text-2xl md:text-4xl font-black text-white leading-tight mb-2 group-hover:text-celeste transition-colors">
                {destacada.titulo}
              </h2>
              {destacada.copete && (
                <p className="text-white/80 text-base line-clamp-2 max-w-2xl">{destacada.copete}</p>
              )}
              <div className="inline-flex items-center gap-2 mt-4 text-celeste font-bold text-sm group-hover:gap-3 transition-all">
                Leer nota completa <ArrowRight size={15} />
              </div>
            </div>
          </div>
        )}

        {/* GRILLA DE NOTICIAS */}
        {!loading && resto.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resto.map((n) => (
              <div
                key={n.idNoticia}
                onClick={() => onNoticiaClick(n.idNoticia)}
                className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group"
              >
                {/* Imagen con overlay */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={getImg(n)}
                    alt={n.titulo}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <span className="absolute top-4 left-4 px-3 py-1 bg-celeste text-white text-[10px] font-black uppercase tracking-widest rounded-full">
                    Novedad
                  </span>
                </div>

                {/* Separador */}
                <div className="h-1 w-full bg-gradient-to-r from-celeste via-azul to-celeste" />

                {/* Contenido */}
                <div className="p-5">
                  <div className="flex items-center gap-3 text-gray-400 text-xs mb-2">
                    <span className="flex items-center gap-1"><Calendar size={11} />{formatDate(n.vigenciaDesde)}</span>
                    {n.cuerpo && <span className="flex items-center gap-1"><Clock size={11} />{readingTime(n.cuerpo)} min</span>}
                  </div>
                  <h3 className="text-base font-black text-slate-800 leading-snug mb-1 group-hover:text-celeste transition-colors line-clamp-2">
                    {n.titulo}
                  </h3>
                  {n.copete && (
                    <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">{n.copete}</p>
                  )}
                  <div className="inline-flex items-center gap-1 mt-3 text-celeste text-xs font-bold group-hover:gap-2 transition-all">
                    Leer más <ArrowRight size={12} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
