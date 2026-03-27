import React, { useState, useEffect } from 'react';
import { Loader2, ReceiptText, CalendarDays } from 'lucide-react';
import { Liquidacion, apiService } from '../../services/api';

interface LiquidacionesProps {
  onSessionExpired: () => void;
}

const formatARS = (n: number) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(n);

const defaultDesde = () => {
  const d = new Date();
  d.setFullYear(d.getFullYear() - 1);
  return d.toISOString().split('T')[0];
};

export const Liquidaciones: React.FC<LiquidacionesProps> = ({ onSessionExpired }) => {
  const [fechaDesde, setFechaDesde] = useState(defaultDesde());
  const [data, setData] = useState<Liquidacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (desde: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiService.getLiquidaciones(desde);
      setData(result);
    } catch (err: any) {
      if (err.message === 'SESSION_EXPIRED') { onSessionExpired(); return; }
      setError('Error al cargar las liquidaciones.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(fechaDesde);
  }, []);

  const handleFechaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFechaDesde(e.target.value);
  };

  const handleBuscar = () => {
    fetchData(fechaDesde);
  };

  return (
    <div className="space-y-6">
      {/* Filtro */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="space-y-2 flex-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
              <CalendarDays size={14} /> Desde
            </label>
            <input
              type="date"
              className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl p-3 font-medium outline-none focus:border-[#00AEEF] transition-colors text-[#111111] text-sm"
              value={fechaDesde}
              onChange={handleFechaChange}
            />
          </div>
          <button
            onClick={handleBuscar}
            disabled={loading}
            className="px-8 py-3 bg-[#00AEEF] text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-md hover:bg-[#1C75BB] transition-colors disabled:opacity-50 whitespace-nowrap"
          >
            Buscar
          </button>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-12 bg-slate-100 rounded-xl animate-pulse"></div>
            ))}
          </div>
        ) : error ? (
          <div className="p-12 text-center text-red-500 font-bold text-sm">{error}</div>
        ) : data.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ReceiptText size={32} className="text-slate-300" />
            </div>
            <p className="font-black text-gray-400 uppercase tracking-widest text-xs">No hay liquidaciones en el período seleccionado</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-[10px] font-black uppercase tracking-widest text-[#1C75BB]">
                <tr>
                  <th className="px-6 py-4">Fecha</th>
                  <th className="px-6 py-4">Comprobante</th>
                  <th className="px-6 py-4 text-right">Importe Total</th>
                  <th className="px-6 py-4 text-right">Ajuste</th>
                  <th className="px-6 py-4 text-right">Liquidado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.map((liq, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-bold text-[#1C75BB]">
                      {new Date(liq.fecha).toLocaleDateString('es-AR')}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-[#1C75BB]">{liq.comprobante}</td>
                    <td className="px-6 py-4 text-right font-black text-gray-900 text-sm">{formatARS(liq.importeTotal)}</td>
                    <td className={`px-6 py-4 text-right font-bold text-sm ${liq.importeAjuste < 0 ? 'text-red-500' : 'text-green-600'}`}>
                      {formatARS(liq.importeAjuste)}
                    </td>
                    <td className="px-6 py-4 text-right font-black text-[#00AEEF] text-sm">{formatARS(liq.importeLiquidado)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
