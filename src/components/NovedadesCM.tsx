import React, { useState, useEffect } from 'react';
import { Newspaper, ArrowLeft } from 'lucide-react';
import { apiService, Noticia, BACKOFFICE_API_BASE_URL } from '../services/api';

const PLACEHOLDER_IMG = 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800';

const getImg = (n: Noticia) =>
    n.imagenes?.length ? `${BACKOFFICE_API_BASE_URL}${n.imagenes[0].rutaImagen}` : PLACEHOLDER_IMG;

const stripHtml = (html: string) => html.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim();

const formatFecha = (d: string) =>
    new Date(d).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' });

interface NovedadesCMProps {
    onNoticiaClick?: (id: number) => void;
    onBack?: () => void;
}

export const NovedadesCM: React.FC<NovedadesCMProps> = ({ onNoticiaClick, onBack }) => {
    const [noticias, setNoticias] = useState<Noticia[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        apiService.getNoticias(4)
            .then(setNoticias)
            .catch(() => setNoticias([]))
            .finally(() => setLoading(false));
    }, []);

    return (
        <section className="pt-20 min-h-screen bg-slate-50 font-sans animate-in fade-in duration-500">

            <div className="bg-[#1C75BB] px-6 md:px-12 py-10">
                <div className="flex flex-col items-center text-center gap-3">
                    <div className="p-3 bg-white/10 rounded-2xl">
                        <Newspaper size={28} className="text-[#00AEEF]" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-white leading-none">
                        Novedades <span className="text-[#00AEEF]">Centro Médico</span>
                    </h1>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-12">
                {onBack && (
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#1C75BB] hover:text-[#00AEEF] transition-colors mb-10"
                    >
                        <ArrowLeft size={16} /> Volver al Centro Médico
                    </button>
                )}

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-white rounded-3xl overflow-hidden animate-pulse">
                                <div className="aspect-[16/9] bg-gray-200" />
                                <div className="p-6 space-y-3">
                                    <div className="h-3 w-24 bg-gray-200 rounded-full" />
                                    <div className="h-5 w-3/4 bg-gray-200 rounded-full" />
                                    <div className="h-3 w-full bg-gray-200 rounded-full" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : noticias.length === 0 ? (
                    <div className="flex flex-col items-center justify-center min-h-[300px] gap-4 text-center">
                        <Newspaper size={40} className="text-gray-200" />
                        <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">No hay novedades publicadas aún.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {noticias.map(n => (
                            <div
                                key={n.idNoticia}
                                onClick={() => onNoticiaClick?.(n.idNoticia)}
                                className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                            >
                                <div className="aspect-[16/9] overflow-hidden">
                                    <img src={getImg(n)} alt={n.titulo} className="w-full h-full object-cover" />
                                </div>
                                <div className="p-6">
                                    <p className="text-[12px] font-black uppercase tracking-widest text-[#00AEEF] mb-2">
                                        {formatFecha(n.vigenciaDesde)}
                                    </p>
                                    <h3 className="font-black text-[#1C75BB] text-base uppercase tracking-tight leading-tight mb-2 line-clamp-2">{n.titulo}</h3>
                                    <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">{stripHtml(n.copete)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};
