import React, { useState } from 'react';
import { Building2, MapPin, Mail, Phone, ChevronDown, ChevronUp, Save, Loader2, CheckCircle2, Info } from 'lucide-react';
import { DatosPrestador, PlanPrestador, apiService } from '../../services/api';

interface PerfilPrestadorProps {
  datos: DatosPrestador | null;
  onUpdate: () => void;
}

// 0=No atiende (gris/tachado), 1=Atiende (verde), 2=Requiere autorización (amarillo)
const AttendanceIcon: React.FC<{ value: number; label: string }> = ({ value, label }) => {
  if (value === 0) {
    return (
      <span className="inline-flex items-center gap-1 text-[9px] font-bold text-slate-400 line-through" title={`${label}: No atiende`}>
        {label}
      </span>
    );
  }
  if (value === 1) {
    return (
      <span className="inline-flex items-center gap-1 text-[9px] font-bold text-green-600" title={`${label}: Atiende`}>
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0"></span>
        {label}
      </span>
    );
  }
  // value === 2
  return (
    <span className="inline-flex items-center gap-1 text-[9px] font-bold text-amber-600" title={`${label}: Requiere autorización`}>
      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0"></span>
      {label}
    </span>
  );
};

const PlanChip: React.FC<{ plan: PlanPrestador }> = ({ plan }) => (
  <div className="flex flex-col items-start gap-1">
    <span className="px-3 py-1.5 bg-[#00AEEF]/10 text-[#00AEEF] text-xs font-black uppercase tracking-wider rounded-full border border-[#00AEEF]/20">
      {plan.planNombre}
    </span>
    <div className="flex items-center gap-2 pl-1">
      <AttendanceIcon value={plan.ambulatorio} label="Amb." />
      <AttendanceIcon value={plan.internacion} label="Int." />
      <AttendanceIcon value={plan.guardia} label="Gdia." />
    </div>
  </div>
);

export const PerfilPrestador: React.FC<PerfilPrestadorProps> = ({ datos, onUpdate }) => {
  const [editOpen, setEditOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    email: datos?.email ?? '',
    telefono: datos?.telefono ?? '',
    direccion: datos?.direccion ?? '',
  });

  React.useEffect(() => {
    if (datos) {
      setForm({ email: datos.email, telefono: datos.telefono, direccion: datos.direccion });
    }
  }, [datos]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await apiService.updateDatosPrestador(form);
      setSuccess(true);
      setEditOpen(false);
      onUpdate();
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError('Error al guardar los cambios. Intentá de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!datos) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm animate-pulse">
            <div className="h-5 bg-slate-200 rounded w-1/3 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-12 bg-slate-100 rounded-xl"></div>
              <div className="h-12 bg-slate-100 rounded-xl"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {success && (
        <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-2xl text-green-700 font-semibold text-sm">
          <CheckCircle2 size={20} />
          Datos actualizados correctamente
        </div>
      )}

      {/* Datos principales */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        <h2 className="text-xl font-black mb-6 flex items-center gap-3 uppercase tracking-tighter text-[#1C75BB]">
          <span className="w-1.5 h-6 bg-[#00AEEF] rounded-full"></span>
          {datos.nombre}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoRow icon={Building2} label="Dirección" value={datos.direccion} />
          <InfoRow icon={MapPin} label="Localidad" value={`${datos.localidad}, ${datos.provinciaNombre}`} />
          <InfoRow icon={Mail} label="Email" value={datos.email} />
          <InfoRow icon={Phone} label="Teléfono" value={datos.telefono} />
        </div>

        {/* Planes */}
        {datos.planes && datos.planes.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Planes contratados</p>
            <div className="flex flex-wrap gap-4">
              {datos.planes.map((plan, i) => (
                <PlanChip key={plan.planId ?? i} plan={plan} />
              ))}
            </div>
          </div>
        )}

        {/* Datos anexos */}
        {datos.datosAnexos && datos.datosAnexos.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Información adicional</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {datos.datosAnexos.map((anexo, i) => (
                <InfoRow
                  key={i}
                  icon={Info}
                  label={anexo.prestadorDatoaAnexoTipoNombre}
                  value={anexo.texto}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Edición */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <button
          onClick={() => setEditOpen(!editOpen)}
          className="w-full flex items-center justify-between px-8 py-5 text-[#1C75BB] font-black text-sm uppercase tracking-wider hover:bg-slate-50 transition-colors"
        >
          <span>Editar datos de contacto</span>
          {editOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

        {editOpen && (
          <form onSubmit={handleSave} className="px-8 pb-8 space-y-5 border-t border-gray-100 pt-6">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">{error}</div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Email</label>
                <input
                  type="email"
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl p-4 font-medium outline-none focus:border-[#00AEEF] focus:ring-0 transition-colors text-[#111111]"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Teléfono</label>
                <input
                  type="tel"
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl p-4 font-medium outline-none focus:border-[#00AEEF] focus:ring-0 transition-colors text-[#111111]"
                  value={form.telefono}
                  onChange={e => setForm({ ...form, telefono: e.target.value })}
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Dirección</label>
                <input
                  type="text"
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl p-4 font-medium outline-none focus:border-[#00AEEF] focus:ring-0 transition-colors text-[#111111]"
                  value={form.direccion}
                  onChange={e => setForm({ ...form, direccion: e.target.value })}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-8 py-3.5 bg-[#00AEEF] text-white font-black text-sm uppercase tracking-wider rounded-xl shadow-lg hover:bg-[#1C75BB] transition-colors disabled:opacity-50"
            >
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              Guardar cambios
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

const InfoRow: React.FC<{ icon: any; label: string; value: string }> = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-4">
    <div className="w-10 h-10 rounded-2xl bg-[#00AEEF]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
      <Icon size={18} className="text-[#00AEEF]" />
    </div>
    <div>
      <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-0.5">{label}</p>
      <p className="font-bold text-[#1C75BB] text-sm leading-tight">{value || '—'}</p>
    </div>
  </div>
);
