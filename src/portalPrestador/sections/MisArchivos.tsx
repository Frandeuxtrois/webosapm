import React, { useState, useEffect, useRef } from 'react';
import { Upload, Trash2, FolderOpen, Loader2, FileText, AlertTriangle, Download } from 'lucide-react';
import { ArchivoPrestador, apiService } from '../../services/api';

interface MisArchivosProps {
  onSessionExpired: () => void;
}

const formatSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const MisArchivos: React.FC<MisArchivosProps> = ({ onSessionExpired }) => {
  const [archivos, setArchivos] = useState<ArchivoPrestador[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchArchivos = async () => {
    setLoading(true);
    try {
      const result = await apiService.getArchivos();
      setArchivos(result);
    } catch (err: any) {
      if (err.message === 'SESSION_EXPIRED') { onSessionExpired(); return; }
      setError('Error al cargar los archivos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArchivos();
  }, []);

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const fileArray = Array.from(files);
    setUploading(true);
    setError(null);
    try {
      await apiService.subirArchivos(fileArray);
      await fetchArchivos();
    } catch (err: any) {
      if (err.message === 'SESSION_EXPIRED') { onSessionExpired(); return; }
      setError('Error al subir los archivos. Intentá de nuevo.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    setError(null);
    try {
      await apiService.deleteArchivo(id);
      setArchivos(prev => prev.filter(a => a.id !== id));
    } catch (err: any) {
      if (err.message === 'SESSION_EXPIRED') { onSessionExpired(); return; }
      setError('Error al eliminar el archivo.');
    } finally {
      setDeletingId(null);
      setConfirmDeleteId(null);
    }
  };

  const handleDownload = async (archivo: ArchivoPrestador) => {
    setDownloadingId(archivo.id);
    setError(null);
    try {
      await apiService.downloadArchivo(archivo.id, archivo.nombreMostrar);
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

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  return (
    <div className="space-y-6">
      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 font-semibold text-sm">
          <AlertTriangle size={18} />
          {error}
        </div>
      )}

      {/* Zona de upload */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !uploading && fileInputRef.current?.click()}
        className={`bg-white rounded-3xl shadow-sm border-2 border-dashed p-12 cursor-pointer transition-all text-center ${
          isDragging
            ? 'border-[#00AEEF] bg-[#00AEEF]/5 scale-[1.01]'
            : 'border-slate-200 hover:border-[#00AEEF] hover:bg-[#00AEEF]/5'
        } ${uploading ? 'cursor-not-allowed opacity-60' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={e => handleUpload(e.target.files)}
          disabled={uploading}
        />
        <div className="flex flex-col items-center gap-3">
          {uploading ? (
            <>
              <Loader2 size={40} className="text-[#00AEEF] animate-spin" />
              <p className="font-black text-[#1C75BB] uppercase tracking-widest text-xs">Subiendo archivos...</p>
            </>
          ) : (
            <>
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors ${isDragging ? 'bg-[#00AEEF] text-white' : 'bg-[#00AEEF]/10 text-[#00AEEF]'}`}>
                <Upload size={28} />
              </div>
              <div>
                <p className="font-black text-[#1C75BB] text-sm">Arrastrá archivos aquí o hacé clic para seleccionar</p>
                <p className="text-xs text-gray-400 mt-1">Podés subir múltiples archivos a la vez</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Lista de archivos */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-black text-[#1C75BB] text-xs uppercase tracking-widest">Mis archivos</h3>
          <span className="text-xs text-gray-400 font-bold">{archivos.length} archivo{archivos.length !== 1 ? 's' : ''}</span>
        </div>

        {loading ? (
          <div className="p-8 space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-14 bg-slate-100 rounded-xl animate-pulse"></div>
            ))}
          </div>
        ) : archivos.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FolderOpen size={32} className="text-slate-300" />
            </div>
            <p className="font-black text-gray-400 uppercase tracking-widest text-xs">No tenés archivos subidos</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {archivos.map(archivo => (
              <li key={archivo.id} className="px-6 py-4 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                <div className="w-10 h-10 bg-[#00AEEF]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FileText size={18} className="text-[#00AEEF]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[#1C75BB] text-sm truncate">{archivo.nombreMostrar}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(archivo.fechaSubida).toLocaleDateString('es-AR')} — {formatSize(archivo.tamaño)}
                  </p>
                </div>

                {confirmDeleteId === archivo.id ? (
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs font-bold text-red-600">¿Eliminar?</span>
                    <button
                      onClick={() => handleDelete(archivo.id)}
                      disabled={deletingId === archivo.id}
                      className="px-3 py-1.5 bg-red-500 text-white text-xs font-black rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                    >
                      {deletingId === archivo.id ? <Loader2 size={12} className="animate-spin" /> : 'Sí'}
                    </button>
                    <button
                      onClick={() => setConfirmDeleteId(null)}
                      className="px-3 py-1.5 bg-slate-100 text-gray-600 text-xs font-black rounded-lg hover:bg-slate-200 transition-colors"
                    >
                      No
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => handleDownload(archivo)}
                      disabled={downloadingId === archivo.id}
                      className="p-2 text-slate-400 hover:text-[#00AEEF] hover:bg-[#00AEEF]/10 rounded-xl transition-colors flex-shrink-0"
                      title="Descargar archivo"
                    >
                      {downloadingId === archivo.id
                        ? <Loader2 size={16} className="animate-spin" />
                        : <Download size={16} />}
                    </button>
                    <button
                      onClick={() => setConfirmDeleteId(archivo.id)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors flex-shrink-0"
                      title="Eliminar archivo"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
