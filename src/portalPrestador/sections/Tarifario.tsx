import React, { useState, useEffect, useMemo } from 'react';
import { Search, Download, ClipboardList, ChevronLeft, ChevronRight, X, Check, CalendarClock, Loader2 } from 'lucide-react';
import { Prestacion, apiService } from '../../services/api';

interface TarifarioProps {
  onSessionExpired: () => void;
}

const PAGE_SIZE = 20;

// 0 = no atiende, 1 = atiende, 2 = requiere autorización
const PlanCell: React.FC<{ value: number }> = ({ value }) => {
  if (value === 1) return <Check size={14} className="text-[#00AEEF] mx-auto" strokeWidth={3} />;
  if (value === 2) return <CalendarClock size={13} className="text-amber-500 mx-auto" />;
  return <X size={13} className="text-red-400 mx-auto" strokeWidth={2.5} />;
};

const PLANES = [
  { label: '1000',  cols: ['plan1KAmb',  'plan1KInt',  'plan1KGuard']  },
  { label: '3000',  cols: ['plan3KAmb',  'plan3KInt',  'plan3KGuard']  },
  { label: '5000',  cols: ['plan5KAmb',  'plan5KInt',  'plan5KGuard']  },
  { label: '5000P', cols: ['plan5KPAmb', 'plan5KPInt', 'plan5KPGuard'] },
  { label: 'P',     cols: ['planPAmb',   'planPInt',   'planPGuard']   },
] as const;

export const Tarifario: React.FC<TarifarioProps> = ({ onSessionExpired }) => {
  const [data, setData] = useState<Prestacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [downloading, setDownloading] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const result = await apiService.getPrestacionesContratadas();
        const arr = Array.isArray(result) ? result : (result as any)?.data ?? [];
        setData(arr);
      } catch (err: any) {
        if (err.message === 'SESSION_EXPIRED') { onSessionExpired(); return; }
        setError(`Error al cargar las prestaciones (${err.message}).`);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return data;
    const q = search.toLowerCase();
    return data.filter(p =>
      p.descripcion?.toLowerCase().includes(q) ||
      p.prestadorDescripcion?.toLowerCase().includes(q) ||
      p.codigoApm?.toLowerCase().includes(q) ||
      p.equivalencia?.toLowerCase().includes(q)
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-5">
        <div className="flex items-center gap-3 px-8 py-4 bg-[#1C75BB] text-white rounded-2xl shadow-lg">
          <Loader2 size={20} className="animate-spin" />
          <span className="font-black text-sm uppercase tracking-widest">Cargando prestaciones...</span>
        </div>
        <p className="text-xs text-gray-400 font-medium">Esto puede demorar unos segundos</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controles */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por descripción, código o equivalencia..."
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

        {/* Leyenda */}
        <div className="flex items-center gap-5 mt-4 pt-4 border-t border-gray-100">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Referencia:</span>
          <span className="flex items-center gap-1.5 text-xs font-bold text-red-400"><X size={12} strokeWidth={2.5} /> No Atiende</span>
          <span className="flex items-center gap-1.5 text-xs font-bold text-[#00AEEF]"><Check size={12} strokeWidth={3} /> Atiende</span>
          <span className="flex items-center gap-1.5 text-xs font-bold text-amber-500"><CalendarClock size={12} /> Requiere autorización</span>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 space-y-3">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="h-10 bg-slate-100 rounded-xl animate-pulse" />
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
                  {/* Fila agrupadora de planes */}
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-2" colSpan={4} />
                    {PLANES.map(({ label }) => (
                      <th key={label} colSpan={3} className="px-2 py-2 text-center border-l border-gray-200 text-[#1C75BB]">
                        Plan {label}
                      </th>
                    ))}
                  </tr>
                  {/* Fila de columnas */}
                  <tr>
                    <th className="px-4 py-3 whitespace-nowrap">Cód. APM</th>
                    <th className="px-4 py-3 whitespace-nowrap">Equiv.</th>
                    <th className="px-4 py-3 min-w-[220px]">Descripción</th>
                    <th className="px-4 py-3 text-right whitespace-nowrap">Importe</th>
                    {PLANES.map(({ label }) => (
                      <React.Fragment key={label}>
                        <th className="px-3 py-3 text-center border-l border-gray-200 whitespace-nowrap">Amb</th>
                        <th className="px-3 py-3 text-center whitespace-nowrap">Int</th>
                        <th className="px-3 py-3 text-center whitespace-nowrap">Guard</th>
                      </React.Fragment>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paged.map((p, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-mono font-bold text-[#1C75BB] whitespace-nowrap">{p.codigoApm}</td>
                      <td className="px-4 py-3 font-mono text-gray-500 whitespace-nowrap">{p.equivalencia}</td>
                      <td className="px-4 py-3 leading-snug">
                        <p className="font-medium text-gray-800">{p.descripcion}</p>
                        {p.prestadorDescripcion && p.prestadorDescripcion !== p.descripcion && (
                          <p className="text-[10px] text-gray-400 mt-0.5">{p.prestadorDescripcion}</p>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right font-black text-gray-900 whitespace-nowrap">
                        {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(p.importe)}
                      </td>
                      {PLANES.map(({ label, cols }) => (
                        <React.Fragment key={label}>
                          <td className="px-3 py-3 text-center border-l border-gray-100"><PlanCell value={p[cols[0] as keyof Prestacion] as number} /></td>
                          <td className="px-3 py-3 text-center"><PlanCell value={p[cols[1] as keyof Prestacion] as number} /></td>
                          <td className="px-3 py-3 text-center"><PlanCell value={p[cols[2] as keyof Prestacion] as number} /></td>
                        </React.Fragment>
                      ))}
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
                  className="p-2 rounded-xl bg-white border border-gray-200 text-[#1C75BB] hover:bg-[#00AEEF] hover:text-white transition-colors disabled:opacity-30 shadow-sm"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-2 rounded-xl bg-white border border-gray-200 text-[#1C75BB] hover:bg-[#00AEEF] hover:text-white transition-colors disabled:opacity-30 shadow-sm"
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
