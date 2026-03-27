import React, { useState } from 'react';
import { Search, Loader2, AlertTriangle, UserCheck, UserX } from 'lucide-react';
import { Afiliado, apiService } from '../../services/api';

interface BuscadorAfiliadosProps {
  onSessionExpired: () => void;
}

const parseQuery = (raw: string): { afiliadoId: string; parentescoId: number } | null => {
  // Accept formats: "123456-00" or "12345600"
  const cleaned = raw.trim().replace('-', '');
  if (cleaned.length < 7 || !/^\d+$/.test(cleaned)) return null;
  const afiliadoId = cleaned.slice(0, cleaned.length - 2);
  const parentescoId = parseInt(cleaned.slice(-2), 10);
  if (!afiliadoId || isNaN(parentescoId)) return null;
  return { afiliadoId, parentescoId };
};

export const BuscadorAfiliados: React.FC<BuscadorAfiliadosProps> = ({ onSessionExpired }) => {
  const [query, setQuery] = useState('');
  const [afiliado, setAfiliado] = useState<Afiliado | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setAfiliado(null);
    setNotFound(false);

    const parsed = parseQuery(query);
    if (!parsed) {
      setError('Ingresá un número de afiliado válido (ej: 123456-00).');
      return;
    }

    setLoading(true);
    try {
      const result = await apiService.getAfiliado(parsed.afiliadoId, parsed.parentescoId);
      setAfiliado(result);
    } catch (err: any) {
      if (err.message === 'SESSION_EXPIRED') { onSessionExpired(); return; }
      if (err.message === '404') {
        setNotFound(true);
      } else {
        setError('Error al buscar el afiliado. Intentá de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Buscador */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        <h2 className="text-xl font-black mb-2 flex items-center gap-3 uppercase tracking-tighter text-[#1C75BB]">
          <span className="w-1.5 h-6 bg-[#00AEEF] rounded-full"></span>
          Buscador de afiliados
        </h2>
        <p className="text-xs text-gray-400 font-medium mb-6">
          Ingresá el número de afiliado para consultar su información.
        </p>

        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Ej: 123456-00"
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl pl-10 pr-4 py-3.5 font-medium outline-none focus:border-[#00AEEF] transition-colors text-[#111111] text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="flex items-center gap-2 px-6 py-3.5 bg-[#00AEEF] text-white font-black text-sm uppercase tracking-wider rounded-xl shadow-lg hover:bg-[#1C75BB] transition-colors disabled:opacity-50 flex-shrink-0"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
            Buscar
          </button>
        </form>

        {error && (
          <div className="mt-4 flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 font-semibold text-sm">
            <AlertTriangle size={18} />
            {error}
          </div>
        )}
      </div>

      {/* Not found */}
      {notFound && (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <UserX size={32} className="text-slate-400" />
          </div>
          <p className="font-black text-gray-500 uppercase tracking-widest text-xs">Afiliado no encontrado</p>
          <p className="text-xs text-gray-400 mt-2">Verificá el número ingresado e intentá de nuevo.</p>
        </div>
      )}

      {/* Resultado */}
      {afiliado && (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#00AEEF]/10 flex items-center justify-center flex-shrink-0">
                <UserCheck size={22} className="text-[#00AEEF]" />
              </div>
              <div>
                <h3 className="font-black text-[#1C75BB] text-lg leading-tight">{afiliado.apellidoNombre}</h3>
                <p className="text-xs text-gray-400 font-medium mt-0.5">Afiliado encontrado</p>
              </div>
            </div>
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider flex-shrink-0 ${
                afiliado.estaActivo
                  ? 'bg-green-100 text-green-700 border border-green-200'
                  : 'bg-red-100 text-red-700 border border-red-200'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${afiliado.estaActivo ? 'bg-green-500' : 'bg-red-500'}`}></span>
              {afiliado.estaActivo ? 'Activo' : 'Inactivo'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-slate-50 rounded-2xl p-5">
              <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">Plan</p>
              <p className="font-bold text-[#1C75BB] text-sm">{afiliado.planNombre || '—'}</p>
            </div>
            <div className="bg-slate-50 rounded-2xl p-5">
              <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">Seccional</p>
              <p className="font-bold text-[#1C75BB] text-sm">{afiliado.seccionalNombre || '—'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
