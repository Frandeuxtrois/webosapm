import React, { useState, useRef } from 'react';
import {
    Upload, Download, Loader2, AlertTriangle, FolderOpen,
    FileText, Search, X, CheckCircle2
} from 'lucide-react';
import { ArchivoPrestador, apiService } from '../../services/api';

interface ArchivoDiscapacidadProps {
    onSessionExpired: () => void;
}

const MAX_FILES = 6;
const MAX_MB    = 4;
const ALLOWED   = ['jpg','bmp','png','tiff','gif','pdf','xls','xlsx','doc','docx'];

const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const validateFiles = (files: File[]): string | null => {
    if (files.length > MAX_FILES) return `Máximo ${MAX_FILES} archivos por vez.`;
    for (const f of files) {
        if (f.size > MAX_MB * 1024 * 1024) return `"${f.name}" supera los ${MAX_MB} MB.`;
        const ext = f.name.split('.').pop()?.toLowerCase() ?? '';
        if (!ALLOWED.includes(ext)) return `Extensión ".${ext}" no permitida.`;
    }
    return null;
};

export const ArchivoDiscapacidad: React.FC<ArchivoDiscapacidadProps> = ({ onSessionExpired }) => {
    const [afiliadoId, setAfiliadoId]     = useState('');
    const [buscado, setBuscado]           = useState('');
    const [archivos, setArchivos]         = useState<ArchivoPrestador[]>([]);
    const [loading, setLoading]           = useState(false);
    const [uploading, setUploading]       = useState(false);
    const [downloadingId, setDownloadingId] = useState<number | null>(null);
    const [error, setError]               = useState<string | null>(null);
    const [success, setSuccess]           = useState<string | null>(null);
    const [isDragging, setIsDragging]     = useState(false);
    const fileInputRef                    = useRef<HTMLInputElement>(null);

    const fetchArchivos = async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            const data = await apiService.getArchivosDiscapacidad(id);
            setArchivos(data);
        } catch (err: any) {
            if (err.message === 'SESSION_EXPIRED') { onSessionExpired(); return; }
            setError('Error al cargar los archivos del afiliado.');
        } finally {
            setLoading(false);
        }
    };

    const handleBuscar = (e: React.FormEvent) => {
        e.preventDefault();
        if (!afiliadoId.trim()) return;
        setBuscado(afiliadoId.trim());
        fetchArchivos(afiliadoId.trim());
    };

    const handleUpload = async (files: FileList | null) => {
        if (!files || files.length === 0 || !buscado) return;
        const arr = Array.from(files);
        const validErr = validateFiles(arr);
        if (validErr) { setError(validErr); return; }

        setUploading(true);
        setError(null);
        setSuccess(null);
        try {
            const res = await apiService.subirArchivosDiscapacidad(buscado, arr);
            setSuccess(res.message ?? 'Archivos subidos correctamente.');
            await fetchArchivos(buscado);
        } catch (err: any) {
            if (err.message === 'SESSION_EXPIRED') { onSessionExpired(); return; }
            setError('Error al subir los archivos.');
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleDownload = async (id: number, nombre: string) => {
        setDownloadingId(id);
        try {
            await apiService.downloadArchivoDiscapacidad(id, nombre);
        } catch (err: any) {
            if (err.message === 'SESSION_EXPIRED') { onSessionExpired(); return; }
            setError('Error al descargar el archivo.');
        } finally {
            setDownloadingId(null);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        handleUpload(e.dataTransfer.files);
    };

    return (
        <div className="space-y-6">

            {/* Buscador de afiliado */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-black mb-1 flex items-center gap-3 uppercase tracking-tighter text-[#1C75BB]">
                    <span className="w-1.5 h-6 bg-[#00AEEF] rounded-full"></span>
                    Archivos de Discapacidad
                </h2>
                <p className="text-xs text-gray-400 font-medium mb-5">
                    Ingresá el número de afiliado para ver y subir archivos de discapacidad.
                </p>

                <form onSubmit={handleBuscar} className="flex gap-3">
                    <div className="flex-1 relative">
                        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Ej: 123456-00"
                            value={afiliadoId}
                            onChange={e => { setAfiliadoId(e.target.value); setError(null); }}
                            className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl pl-10 pr-4 py-3.5 font-medium outline-none focus:border-[#00AEEF] transition-colors text-[#111111] text-sm"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading || !afiliadoId.trim()}
                        className="flex items-center gap-2 px-6 py-3.5 bg-[#00AEEF] text-white font-black text-sm uppercase tracking-wider rounded-xl shadow-lg hover:bg-[#1C75BB] transition-colors disabled:opacity-50 flex-shrink-0"
                    >
                        {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                        Buscar
                    </button>
                </form>
            </div>

            {/* Contenido — solo si hay afiliado buscado */}
            {buscado && (
                <>
                    {/* Mensajes */}
                    {error && (
                        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 font-semibold text-sm">
                            <AlertTriangle size={18} className="flex-shrink-0" /> {error}
                            <button onClick={() => setError(null)} className="ml-auto"><X size={14} /></button>
                        </div>
                    )}
                    {success && (
                        <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-2xl text-green-700 font-semibold text-sm">
                            <CheckCircle2 size={18} className="flex-shrink-0" /> {success}
                            <button onClick={() => setSuccess(null)} className="ml-auto"><X size={14} /></button>
                        </div>
                    )}

                    {/* Zona de upload */}
                    <div
                        onDrop={handleDrop}
                        onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                        onDragLeave={() => setIsDragging(false)}
                        onClick={() => !uploading && fileInputRef.current?.click()}
                        className={`bg-white rounded-3xl border-2 border-dashed p-10 cursor-pointer transition-all text-center ${
                            isDragging ? 'border-[#00AEEF] bg-[#00AEEF]/5 scale-[1.01]'
                                       : 'border-slate-200 hover:border-[#00AEEF] hover:bg-[#00AEEF]/5'
                        } ${uploading ? 'cursor-not-allowed opacity-60' : ''}`}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            accept=".jpg,.bmp,.png,.tiff,.gif,.pdf,.xls,.xlsx,.doc,.docx"
                            className="hidden"
                            onChange={e => handleUpload(e.target.files)}
                            disabled={uploading}
                        />
                        <div className="flex flex-col items-center gap-3">
                            {uploading ? (
                                <>
                                    <Loader2 size={36} className="text-[#00AEEF] animate-spin" />
                                    <p className="font-black text-[#1C75BB] uppercase tracking-widest text-xs">Subiendo archivos...</p>
                                </>
                            ) : (
                                <>
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${isDragging ? 'bg-[#00AEEF] text-white' : 'bg-[#00AEEF]/10 text-[#00AEEF]'}`}>
                                        <Upload size={24} />
                                    </div>
                                    <div>
                                        <p className="font-black text-[#1C75BB] text-sm">Arrastrá archivos o hacé clic para seleccionar</p>
                                        <p className="text-xs text-gray-400 mt-1">Máx. {MAX_FILES} archivos · {MAX_MB} MB c/u · jpg, png, pdf, doc, xls...</p>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Lista de archivos */}
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="font-black text-[#1C75BB] text-xs uppercase tracking-widest">
                                Archivos — afiliado {buscado}
                            </h3>
                            <span className="text-xs text-gray-400 font-bold">{archivos.length} archivo{archivos.length !== 1 ? 's' : ''}</span>
                        </div>

                        {loading ? (
                            <div className="p-8 space-y-3">
                                {[1,2,3].map(i => <div key={i} className="h-14 bg-slate-100 rounded-xl animate-pulse" />)}
                            </div>
                        ) : archivos.length === 0 ? (
                            <div className="p-14 text-center">
                                <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <FolderOpen size={28} className="text-slate-300" />
                                </div>
                                <p className="font-black text-gray-400 uppercase tracking-widest text-xs">No hay archivos para este afiliado</p>
                            </div>
                        ) : (
                            <ul className="divide-y divide-gray-100">
                                {archivos.map(a => (
                                    <li key={a.id} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors">
                                        <div className="w-9 h-9 bg-[#00AEEF]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <FileText size={16} className="text-[#00AEEF]" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-[#1C75BB] text-sm truncate">{a.nombreMostrar}</p>
                                            <p className="text-[10px] text-gray-400 mt-0.5">
                                                {formatSize(a.tamaño)} · {new Date(a.fechaSubida).toLocaleDateString('es-AR')}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => handleDownload(a.id, a.nombreMostrar)}
                                            disabled={downloadingId === a.id}
                                            className="flex items-center gap-1.5 px-4 py-2 bg-slate-50 border border-gray-200 text-[#1C75BB] rounded-xl text-xs font-black hover:bg-[#00AEEF] hover:text-white hover:border-[#00AEEF] transition-all disabled:opacity-50"
                                        >
                                            {downloadingId === a.id
                                                ? <Loader2 size={13} className="animate-spin" />
                                                : <Download size={13} />
                                            }
                                            Descargar
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};
