import React, { useState, useEffect } from 'react';
import { Send, CheckCircle2, Loader2, Paperclip, MessageCircle } from 'lucide-react';
import { ArchivoPrestador, apiService } from '../../services/api';

interface ContactoPrestadorProps {
  onSessionExpired: () => void;
}

export const ContactoPrestador: React.FC<ContactoPrestadorProps> = ({ onSessionExpired }) => {
  const [archivos, setArchivos] = useState<ArchivoPrestador[]>([]);
  const [loadingArchivos, setLoadingArchivos] = useState(true);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [asunto, setAsunto] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const result = await apiService.getArchivos();
        setArchivos(result);
      } catch (err: any) {
        if (err.message === 'SESSION_EXPIRED') { onSessionExpired(); return; }
      } finally {
        setLoadingArchivos(false);
      }
    };
    fetch();
  }, []);

  const toggleArchivo = (id: number) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!asunto.trim() || !mensaje.trim()) return;
    setSending(true);
    setError(null);
    try {
      await apiService.enviarMensaje(asunto, mensaje, selectedIds);
      setSent(true);
      setAsunto('');
      setMensaje('');
      setSelectedIds([]);
    } catch (err: any) {
      if (err.message === 'SESSION_EXPIRED') { onSessionExpired(); return; }
      setError('Error al enviar el mensaje. Intentá de nuevo.');
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-16 text-center">
        <div className="w-20 h-20 bg-green-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={40} className="text-green-500" />
        </div>
        <h3 className="font-black text-xl text-[#1C75BB] mb-2">Mensaje enviado</h3>
        <p className="text-sm text-gray-500 mb-8">Tu consulta fue recibida. Te responderemos a la brevedad.</p>
        <button
          onClick={() => setSent(false)}
          className="px-8 py-3 bg-[#00AEEF] text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-md hover:bg-[#1C75BB] transition-colors"
        >
          Enviar otro mensaje
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        <h2 className="text-xl font-black mb-6 flex items-center gap-3 uppercase tracking-tighter text-[#1C75BB]">
          <span className="w-1.5 h-6 bg-[#00AEEF] rounded-full"></span>
          Contactar a OSAPM
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Asunto</label>
            <input
              type="text"
              required
              className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl p-4 font-medium outline-none focus:border-[#00AEEF] transition-colors text-[#111111] text-sm"
              placeholder="Asunto de tu consulta"
              value={asunto}
              onChange={e => setAsunto(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Mensaje</label>
            <textarea
              required
              rows={5}
              className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl p-4 font-medium outline-none focus:border-[#00AEEF] transition-colors text-[#111111] text-sm resize-none"
              placeholder="Escribí tu consulta aquí..."
              value={mensaje}
              onChange={e => setMensaje(e.target.value)}
            />
          </div>

          {/* Adjuntar archivos */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
              <Paperclip size={14} /> Adjuntar archivos subidos
            </label>

            {loadingArchivos ? (
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Loader2 size={16} className="animate-spin" />
                Cargando archivos...
              </div>
            ) : archivos.length === 0 ? (
              <p className="text-xs text-gray-400 italic">
                No tenés archivos subidos. Podés subir archivos desde la sección "Mis Archivos".
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {archivos.map(archivo => (
                  <label
                    key={archivo.id}
                    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer border-2 transition-all ${
                      selectedIds.includes(archivo.id)
                        ? 'border-[#00AEEF] bg-[#00AEEF]/5'
                        : 'border-slate-100 hover:border-slate-200 bg-slate-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="w-4 h-4 accent-[#00AEEF]"
                      checked={selectedIds.includes(archivo.id)}
                      onChange={() => toggleArchivo(archivo.id)}
                    />
                    <span className="text-xs font-bold text-[#1C75BB] truncate">{archivo.nombreMostrar}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={sending || !asunto.trim() || !mensaje.trim()}
            className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#00AEEF] to-[#1C75BB] text-white font-black text-sm uppercase tracking-widest rounded-xl shadow-lg hover:shadow-[#00AEEF]/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            {sending ? 'Enviando...' : 'Enviar mensaje'}
          </button>
        </form>
      </div>

      <div className="bg-[#00AEEF]/5 rounded-3xl border border-[#00AEEF]/20 p-6 flex items-start gap-4">
        <MessageCircle size={24} className="text-[#00AEEF] flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-black text-[#1C75BB] text-sm mb-1">Tiempos de respuesta</p>
          <p className="text-xs text-gray-500 leading-relaxed">
            Respondemos consultas en el horario de atención (lunes a viernes de 8:00 a 16:00 hs).
            Las consultas recibidas fuera del horario serán atendidas el siguiente día hábil.
          </p>
        </div>
      </div>
    </div>
  );
};
