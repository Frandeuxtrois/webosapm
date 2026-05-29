import React, { useState, useEffect, useCallback } from 'react';
import DOMPurify from 'dompurify';
import { BookOpen, Search, ArrowLeft, Loader2, AlertTriangle, FileText, Calendar, X } from 'lucide-react';
import { NormativaDto, NormativaDetalleDto, apiService } from '../../services/api';

interface NormativasProps {
    onSessionExpired: () => void;
}

export const Normativas: React.FC<NormativasProps> = ({ onSessionExpired }) => {
    const [normativas, setNormativas] = useState<NormativaDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [keyword, setKeyword] = useState('');
    const [inputValue, setInputValue] = useState('');

    const [detalle, setDetalle] = useState<NormativaDetalleDto | null>(null);
    const [loadingDetalle, setLoadingDetalle] = useState(false);
    const [errorDetalle, setErrorDetalle] = useState<string | null>(null);

    const fetchLista = useCallback(async (kw: string) => {
        setLoading(true);
        setError(null);
        try {
            const result = await apiService.getNormativas(kw || undefined);
            setNormativas(result);
        } catch (err: any) {
            if (err.message === 'SESSION_EXPIRED') { onSessionExpired(); return; }
            setError(`Error al cargar normativas (${err.message}).`);
        } finally {
            setLoading(false);
        }
    }, [onSessionExpired]);

    useEffect(() => { fetchLista(''); }, [fetchLista]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setKeyword(inputValue);
        fetchLista(inputValue);
    };

    const handleClearSearch = () => {
        setInputValue('');
        setKeyword('');
        fetchLista('');
    };

    const handleVerDetalle = async (uuid: string) => {
        setLoadingDetalle(true);
        setErrorDetalle(null);
        setDetalle(null);
        try {
            const result = await apiService.getNormativa(uuid);
            setDetalle(result);
        } catch (err: any) {
            if (err.message === 'SESSION_EXPIRED') { onSessionExpired(); return; }
            if (err.message === '404') setErrorDetalle('Normativa no encontrada.');
            else setErrorDetalle(`Error al cargar el detalle (${err.message}).`);
        } finally {
            setLoadingDetalle(false);
        }
    };

    const formatFecha = (iso: string) =>
        new Date(iso).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });

    
    if (loadingDetalle) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 text-[#1C75BB]">
                <Loader2 size={36} className="animate-spin text-[#00AEEF]" />
                <p className="font-black text-xs uppercase tracking-widest text-gray-400">Cargando normativa...</p>
            </div>
        );
    }

    if (detalle) {
        return (
            <div className="space-y-6">
                <button
                    onClick={() => setDetalle(null)}
                    className="flex items-center gap-2 text-sm font-black text-[#1C75BB] hover:text-[#00AEEF] transition-colors uppercase tracking-wider"
                >
                    <ArrowLeft size={16} /> Volver a normativas
                </button>

                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                    <div className="flex items-start gap-4 mb-6 pb-6 border-b border-gray-100">
                        <div className="w-12 h-12 bg-[#00AEEF]/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                            <FileText size={22} className="text-[#00AEEF]" />
                        </div>
                        <div className="flex-1">
                            <h2 className="font-black text-[#1C75BB] text-lg uppercase tracking-tighter leading-tight">{detalle.title}</h2>
                            {detalle.description && (
                                <p className="text-gray-400 text-sm mt-1">{detalle.description}</p>
                            )}
                            <div className="flex items-center gap-1.5 text-gray-400 text-xs mt-2">
                                <Calendar size={11} />
                                {formatFecha(detalle.creationTime)}
                            </div>
                        </div>
                    </div>

                    {errorDetalle ? (
                        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 font-semibold text-sm">
                            <AlertTriangle size={18} /> {errorDetalle}
                        </div>
                    ) : (
                        <div
                            className="prose prose-sm max-w-none text-gray-700 leading-relaxed
                                [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1
                                [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1
                                [&_p]:mb-3 [&_h2]:font-black [&_h2]:text-[#1C75BB] [&_h2]:uppercase [&_h2]:mt-6
                                [&_h3]:font-black [&_h3]:text-[#1C75BB] [&_h3]:mt-4
                                [&_strong]:text-[#1C75BB] [&_a]:text-[#00AEEF] [&_a]:underline"
                            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(detalle.content) }}
                        />
                    )}
                </div>
            </div>
        );
    }

    
    return (
        <div className="space-y-6">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-black mb-1 flex items-center gap-3 uppercase tracking-tighter text-[#1C75BB]">
                    <span className="w-1.5 h-6 bg-[#00AEEF] rounded-full"></span>
                    Normativas
                </h2>
                <p className="text-xs text-gray-400 font-medium mb-5">
                    Normativas aplicables a tu convenio, filtradas automáticamente.
                </p>

                <form onSubmit={handleSearch} className="flex gap-3">
                    <div className="flex-1 relative">
                        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Buscar por título o contenido..."
                            value={inputValue}
                            onChange={e => setInputValue(e.target.value)}
                            className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl pl-10 pr-10 py-3 font-medium outline-none focus:border-[#00AEEF] transition-colors text-[#111111] text-sm"
                        />
                        {inputValue && (
                            <button type="button" onClick={handleClearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                <X size={15} />
                            </button>
                        )}
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-3 bg-[#00AEEF] text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md hover:bg-[#1C75BB] transition-colors disabled:opacity-50"
                    >
                        <Search size={14} /> Buscar
                    </button>
                </form>

                {keyword && (
                    <p className="text-xs text-gray-400 mt-3">
                        Resultados para <span className="font-black text-[#1C75BB]">"{keyword}"</span> — {normativas.length} encontradas
                    </p>
                )}
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-12 space-y-3">
                        {[1,2,3,4].map(i => (
                            <div key={i} className="h-16 bg-slate-100 rounded-2xl animate-pulse" />
                        ))}
                    </div>
                ) : error ? (
                    <div className="p-12 flex items-center justify-center gap-3 text-red-500 font-bold text-sm">
                        <AlertTriangle size={18} /> {error}
                    </div>
                ) : normativas.length === 0 ? (
                    <div className="p-16 text-center">
                        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <BookOpen size={32} className="text-slate-300" />
                        </div>
                        <p className="font-black text-gray-400 uppercase tracking-widest text-xs">
                            {keyword ? 'No se encontraron normativas para esa búsqueda' : 'No hay normativas aplicables'}
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {normativas.map((n) => (
                            <button
                                key={n.uuid}
                                onClick={() => handleVerDetalle(n.uuid)}
                                className="w-full flex items-center gap-5 px-7 py-5 hover:bg-slate-50 transition-colors text-left group"
                            >
                                <div className="w-10 h-10 bg-[#00AEEF]/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-[#00AEEF] transition-colors">
                                    <FileText size={16} className="text-[#00AEEF] group-hover:text-white transition-colors" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-black text-[#1C75BB] text-sm group-hover:text-[#00AEEF] transition-colors leading-tight">
                                        {n.title}
                                    </p>
                                    <div className="flex items-center gap-1.5 text-gray-400 text-[10px] mt-1">
                                        <Calendar size={10} />
                                        {formatFecha(n.creationTime)}
                                    </div>
                                </div>
                                <ArrowLeft size={14} className="text-slate-300 group-hover:text-[#00AEEF] rotate-180 flex-shrink-0 transition-colors" />
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
