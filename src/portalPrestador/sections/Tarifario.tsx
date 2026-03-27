import React, { useState, useEffect, useMemo } from 'react';
import { Search, Download, ClipboardList, ChevronLeft, ChevronRight } from 'lucide-react';
import { Prestacion, apiService } from '../../services/api';

interface TarifarioProps {
  onSessionExpired: () => void;
}

const PAGE_SIZE = 20;

const Check: React.FC<{ value: boolean }> = ({ value }) =>
  value ? (
    <span className="text-[#00AEEF] font-black text-sm">✓</span>
  ) : (
    <span className="text-slate-300 text-sm">✗</span>
  );

export const Tarifario: React.FC<TarifarioProps> = ({ onSessionExpired }) => {
  const [data, setData] = useState<Prestacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [downloading, setDownloading] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const result = await apiService.getPrestacionesContratadas();
        setData(result);
      } catch (err: any) {
        if (err.message === 'SESSION_EXPIRED') { onSessionExpired(); return; }
        setError('Error al cargar el tarifario.');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return data;
    const q = search.toLowerCase();
    return data.filter(
      p =>
        p.descripcion.toLowerCase().includes(q) ||
        p.codigoApm.toLowerCase().includes(q) ||
        p.equivalencia.toLowerCase().includes(q)
    );
  }, [data, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleDescargar = async (tipo: 'general' | 'conceptos') => {
    setDownloading(tipo);
    try {
      if (tipo === 'general') await apiService.descargarTarifario();
      else await apiService.descargarTarifarioPorConceptos();
    } catch (err: any) {
      if (err.message === 'SESSION_EXPIRED') { onSessionExpired(); return; }
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Controles */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por descripción o código..."
              className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl py-3 pl-10 pr-4 font-medium outline-none focus:border-[#00AEEF] transition-colors text-[#111111] text-sm"
              value={search}
              onChange={handleSearch}
            />
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={() => handleDescargar('general')}
              disabled={downloading !== null}
              className="flex items-center gap-2 px-4 py-3 bg-[#1C75BB] text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-md hover:bg-[#00AEEF] transition-colors disabled:opacity-50 whitespace-nowrap"
            >
              <Download size={14} />
              {downloading === 'general' ? 'Descargando...' : 'Tarifario general'}
            </button>
            <button
              onClick={() => handleDescargar('conceptos')}
              disabled={downloading !== null}
              className="flex items-center gap-2 px-4 py-3 bg-slate-700 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-md hover:bg-slate-900 transition-colors disabled:opacity-50 whitespace-nowrap"
            >
              <Download size={14} />
              {downloading === 'conceptos' ? 'Descargando...' : 'Por conceptos'}
            </button>
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 space-y-3">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-10 bg-slate-100 rounded-xl animate-pulse"></div>
            ))}
          </div>
        ) : error ? (
          <div className="p-12 text-center text-red-500 font-bold text-sm">{error}</div>
        ) : data.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ClipboardList size={32} className="text-slate-300" />
            </div>
            <p className="font-black text-gray-400 uppercase tracking-widest text-xs">No hay prestaciones contratadas</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-[10px] font-black uppercase tracking-widest text-[#1C75BB]">
                  <tr>
                    <th className="px-4 py-3 whitespace-nowrap">Cód. APM</th>
                    <th className="px-4 py-3 whitespace-nowrap">Equiv.</th>
                    <th className="px-4 py-3 min-w-[200px]">Descripción</th>
                    <th className="px-4 py-3 text-right whitespace-nowrap">Importe</th>
                    <th className="px-4 py-3 text-center whitespace-nowrap">1K-Amb</th>
                    <th className="px-4 py-3 text-center whitespace-nowrap">1K-Int</th>
                    <th className="px-4 py-3 text-center whitespace-nowrap">1K-Gdía</th>
                    <th className="px-4 py-3 text-center whitespace-nowrap">3K-Amb</th>
                    <th className="px-4 py-3 text-center whitespace-nowrap">3K-Int</th>
                    <th className="px-4 py-3 text-center whitespace-nowrap">3K-Gdía</th>
                    <th className="px-4 py-3 text-center whitespace-nowrap">5K-Amb</th>
                    <th className="px-4 py-3 text-center whitespace-nowrap">5K-Int</th>
                    <th className="px-4 py-3 text-center whitespace-nowrap">5K-Gdía</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paged.map((p, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-mono font-bold text-[#1C75BB]">{p.codigoApm}</td>
                      <td className="px-4 py-3 font-mono text-gray-500">{p.equivalencia}</td>
                      <td className="px-4 py-3 font-medium text-gray-800 text-xs leading-snug">{p.descripcion}</td>
                      <td className="px-4 py-3 text-right font-black text-gray-900">
                        {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(p.importe)}
                      </td>
                      <td className="px-4 py-3 text-center"><Check value={p.plan1KAmb} /></td>
                      <td className="px-4 py-3 text-center"><Check value={p.plan1KInt} /></td>
                      <td className="px-4 py-3 text-center"><Check value={p.plan1KGdia} /></td>
                      <td className="px-4 py-3 text-center"><Check value={p.plan3KAmb} /></td>
                      <td className="px-4 py-3 text-center"><Check value={p.plan3KInt} /></td>
                      <td className="px-4 py-3 text-center"><Check value={p.plan3KGdia} /></td>
                      <td className="px-4 py-3 text-center"><Check value={p.plan5KAmb} /></td>
                      <td className="px-4 py-3 text-center"><Check value={p.plan5KInt} /></td>
                      <td className="px-4 py-3 text-center"><Check value={p.plan5KGdia} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Paginación */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-slate-50">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                {filtered.length} resultados — pág. {page} de {totalPages}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 rounded-xl bg-white border border-gray-200 text-[#1C75BB] hover:bg-[#00AEEF] hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-2 rounded-xl bg-white border border-gray-200 text-[#1C75BB] hover:bg-[#00AEEF] hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
