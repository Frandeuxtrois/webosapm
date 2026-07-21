import React, { useState, useRef } from 'react';
import { Search, Loader2, AlertTriangle, Send, Trash2, CheckCircle2, Pill, HelpCircle, X, Users } from 'lucide-react';
import { AfiliadoPrescripcion, CandidatoAfiliado, MedicamentoVademecum, apiService } from '../../services/api';

interface Props { onSessionExpired: () => void; }

interface MedRow {
  nombreComercial: string; principioActivo: string; presentacion: string; laboratorio: string;
  dosisDiaria: string; cantidadMensual: string; duracion: string;
}

const fmtFecha = (s: string | null): string => {
  if (!s) return '';
  const d = new Date(s);
  if (isNaN(d.getTime())) return s;
  return d.toLocaleDateString('es-AR');
};

export const PrescripcionDiscapacidad: React.FC<Props> = ({ onSessionExpired }) => {
  const [query, setQuery] = useState('');
  const [buscando, setBuscando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [afil, setAfil] = useState<AfiliadoPrescripcion | null>(null);
  const [candidatos, setCandidatos] = useState<CandidatoAfiliado[] | null>(null); // modal cuando hay >1
  const [showHelp, setShowHelp] = useState(false);

  // Campos editables
  const [observaciones, setObservaciones] = useState('');
  const [meds, setMeds] = useState<MedRow[]>([]);
  const [profesional, setProfesional] = useState('');
  const [matricula, setMatricula] = useState('');

  // Búsqueda en el vademécum (elegir medicamento, no escribir a mano)
  const [medQuery, setMedQuery] = useState('');
  const [medResults, setMedResults] = useState<MedicamentoVademecum[]>([]);
  const [medBuscando, setMedBuscando] = useState(false);
  const [medOpen, setMedOpen] = useState(false);
  const medTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [enviando, setEnviando] = useState(false);
  const [okMsg, setOkMsg] = useState<string | null>(null);

  // Trae los datos completos de un afiliado por su N° (titular = cod, beneficiario = cod+parentesco).
  const cargarAfiliado = async (nroAfiliado: number) => {
    setCandidatos(null); setError(null); setBuscando(true);
    try {
      const res = await apiService.buscarAfiliadoPrescripcion(undefined, String(nroAfiliado));
      setAfil(res); setObservaciones(''); setMeds([]);
    } catch (err: any) {
      if (String(err?.message) === '401') { onSessionExpired(); return; }
      setError('No se pudieron traer los datos del afiliado.');
    } finally {
      setBuscando(false);
    }
  };

  const buscar = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); setOkMsg(null); setAfil(null); setCandidatos(null);
    const q = query.trim().replace(/[.\-\s]/g, '');
    if (!/^\d+$/.test(q)) { setError('Ingresá el DNI o el N° de afiliado (solo números).'); return; }
    setBuscando(true);
    try {
      const cands = await apiService.buscarCandidatosPrescripcion(q);
      if (cands.length === 0) { setError('No se encontró un afiliado con discapacidad para ese DNI o N° de afiliado.'); return; }
      if (cands.length === 1) { await cargarAfiliado(cands[0].nroAfiliado); return; }
      setCandidatos(cands); // más de uno en el grupo → elegir en el modal
    } catch (err: any) {
      if (String(err?.message) === '401') { onSessionExpired(); return; }
      setError('Ocurrió un error al buscar el afiliado.');
    } finally {
      setBuscando(false);
    }
  };

  const delMed = (i: number) => setMeds(m => m.filter((_, idx) => idx !== i));
  const setMed = (i: number, k: keyof MedRow, v: string) => setMeds(m => m.map((row, idx) => idx === i ? { ...row, [k]: v } : row));

  const onMedQuery = (v: string) => {
    setMedQuery(v);
    if (medTimer.current) clearTimeout(medTimer.current);
    if (v.trim().length < 2) { setMedResults([]); setMedOpen(false); return; }
    medTimer.current = setTimeout(async () => {
      setMedBuscando(true); setMedOpen(true);
      try { setMedResults(await apiService.buscarMedicamentoVademecum(v.trim())); }
      catch (err: any) { if (String(err?.message) === '401') onSessionExpired(); setMedResults([]); }
      finally { setMedBuscando(false); }
    }, 300);
  };

  const pickMed = (m: MedicamentoVademecum) => {
    setMeds(prev => [...prev, {
      nombreComercial: m.nombre ?? '', principioActivo: m.droga ?? '', presentacion: m.presentacion ?? '',
      laboratorio: m.laboratorio ?? '', dosisDiaria: '', cantidadMensual: '', duracion: '',
    }]);
    setMedQuery(''); setMedResults([]); setMedOpen(false);
  };

  const enviar = async () => {
    if (!afil) return;
    if (!profesional.trim()) { setError('Ingresá el profesional tratante.'); return; }
    setError(null); setEnviando(true); setOkMsg(null);

    try {
      const payload = {
        codAfiliado: afil.codAfiliado,
        nroParentesco: afil.nroParentesco,
        nombre: afil.nombre,
        dni: afil.dni,
        fechaNac: fmtFecha(afil.fechaNac),
        telefono: afil.telefono,
        domicilio: afil.domicilio,
        localidad: afil.localidad,
        provincia: afil.provincia,
        plan: afil.plan,
        email: afil.email,
        vtoCUD: fmtFecha(afil.vtoCUD),
        discapacidades: afil.discapacidades,
        observaciones,
        medicacion: meds,
        profesional: profesional.trim().slice(0, 100),
        matricula: matricula.trim().slice(0, 12),
      };
      const r = await apiService.enviarPrescripcion(payload);
      setOkMsg(r.mensaje || 'El formulario fue enviado correctamente.');
      // reset parcial
      setAfil(null); setQuery(''); setMeds([]);
      setProfesional(''); setMatricula('');
    } catch (err: any) {
      if (String(err?.message) === '401') { onSessionExpired(); return; }
      setError('Ocurrió un error al enviar el formulario. Intentá nuevamente.');
    } finally {
      setEnviando(false);
    }
  };

  const inputCls = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#0078c2] focus:border-[#0078c2] outline-none';
  const roCls = 'w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700';

  return (
    <div className="max-w-5xl mx-auto h-full max-h-[calc(100vh-160px)] flex flex-col">
      {/* Cabecera fija (no scrollea) */}
      <div className="shrink-0">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-[#0078c2]/10 p-2 rounded-lg"><Pill className="text-[#0078c2]" size={22} /></div>
          <div>
            <h2 className="text-lg font-black text-[#0f2044]">Prescripción de Medicamentos para Discapacidad</h2>
            <p className="text-xs text-gray-500">Buscá al afiliado por DNI o N° de afiliado y completá el formulario.</p>
          </div>
        </div>

        {okMsg && (
          <div className="mb-4 flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg px-4 py-3 text-sm">
            <CheckCircle2 size={18} /> {okMsg}
          </div>
        )}

        {/* Buscador */}
        <form onSubmit={buscar} className="flex gap-2 mb-4 relative">
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="DNI o N° de afiliado" className={inputCls + ' max-w-xs'} />
          <button type="submit" disabled={buscando} className="flex items-center gap-2 bg-[#0078c2] hover:bg-[#005596] text-white font-bold px-4 py-2 rounded-lg text-sm disabled:opacity-50">
            {buscando ? <Loader2 className="animate-spin" size={16} /> : <Search size={16} />} Buscar
          </button>
          <button type="button" onClick={() => setShowHelp(v => !v)} title="¿Cómo buscar?"
            className="flex items-center justify-center w-10 h-10 rounded-lg border border-[#0078c2]/40 text-[#0078c2] hover:bg-[#0078c2]/10">
            <HelpCircle size={18} />
          </button>
          {showHelp && (
            <div className="absolute z-20 top-full left-0 mt-2 w-[440px] max-w-[92vw] bg-white border border-[#0078c2]/30 rounded-lg shadow-xl p-4 text-sm text-slate-700">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-[#0a1f44]">¿Cómo buscar un afiliado?</span>
                <button type="button" onClick={() => setShowHelp(false)} className="text-slate-400 hover:text-slate-600"><X size={16} /></button>
              </div>
              <ul className="list-disc pl-5 space-y-1">
                <li>Por <b>DNI</b> del afiliado (titular o beneficiario).</li>
                <li>Por <b>N° de titular</b> (ej. <b>5427</b>). Si el titular tiene beneficiarios con discapacidad, te deja <b>elegir cuál</b>.</li>
                <li>Por <b>N° completo del beneficiario</b> = número del titular + los 2 dígitos del parentesco (ej. <b>16474</b> + <b>02</b> = <b>1647402</b>).</li>
              </ul>
              <p className="mt-2 text-xs text-slate-500">Solo aparecen afiliados con marca de discapacidad.</p>
            </div>
          )}
        </form>

        {/* Modal: elegir entre varios afiliados con discapacidad del grupo */}
        {candidatos && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
              <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200">
                <span className="flex items-center gap-2 font-bold text-[#0a1f44]"><Users size={18} className="text-[#0078c2]" /> Elegí el afiliado</span>
                <button onClick={() => setCandidatos(null)} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
              </div>
              <div className="p-3 max-h-[60vh] overflow-y-auto">
                <p className="text-xs text-slate-500 mb-2 px-1">Ese grupo familiar tiene varios afiliados con discapacidad. Elegí a quién prescribir:</p>
                {candidatos.map(c => (
                  <button key={c.nroAfiliado} onClick={() => cargarAfiliado(c.nroAfiliado)}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#0078c2]/10 border border-transparent hover:border-[#0078c2]/30 transition-colors">
                    <div className="font-semibold text-[#0a1f44]">{c.nombre}</div>
                    <div className="text-xs text-slate-500">
                      N° {c.nroAfiliado} · DNI {c.dni} · {c.esTitular ? 'Titular' : `Beneficiario (parentesco ${c.nroParentesco})`}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-4 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
            <AlertTriangle size={18} /> {error}
          </div>
        )}
      </div>

      {afil && (
        <div className="flex-1 min-h-0 overflow-y-auto pr-2 pb-4 space-y-6">
          {/* 1 - Datos del afiliado */}
          <section>
            <h3 className="bg-[#0f2044] text-white font-bold text-sm px-3 py-2 rounded-t-lg">1. Datos del afiliado</h3>
            <div className="border border-t-0 border-gray-200 rounded-b-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              <Campo label="N° Afiliado" value={`${afil.codAfiliado ?? ''}${afil.nroParentesco > 0 ? '/' + afil.nroParentesco : ''}`} cls={roCls} />
              <Campo label="Plan" value={afil.plan} cls={roCls} />
              <Campo label="Apellido y Nombre" value={afil.nombre} cls={roCls} />
              <Campo label="DNI" value={afil.dni} cls={roCls} />
              <Campo label="Fecha de Nacimiento" value={fmtFecha(afil.fechaNac)} cls={roCls} />
              <Campo label="Teléfono" value={afil.telefono} cls={roCls} />
              <Campo label="Domicilio" value={afil.domicilio} cls={roCls} />
              <Campo label="Localidad" value={afil.localidad} cls={roCls} />
              <Campo label="Provincia" value={afil.provincia} cls={roCls} />
              <Campo label="Vencimiento del CUD" value={fmtFecha(afil.vtoCUD)} cls={roCls} />
              <Campo label="Correo electrónico" value={afil.email} cls={roCls} />
            </div>
          </section>

          {/* 2 y 3 - Tipo de discapacidad y diagnóstico (solo lectura, de la DB) */}
          <section>
            <h3 className="bg-[#0f2044] text-white font-bold text-sm px-3 py-2 rounded-t-lg">2 y 3. Tipo de discapacidad y diagnóstico</h3>
            <div className="border border-t-0 border-gray-200 rounded-b-lg p-4">
              {afil.discapacidades && afil.discapacidades.length > 0 ? (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-600 border-b border-gray-200">
                      <th className="pb-2 pr-4 w-48">Tipo de discapacidad</th>
                      <th className="pb-2">Diagnóstico</th>
                    </tr>
                  </thead>
                  <tbody>
                    {afil.discapacidades.map((d, i) => (
                      <tr key={i} className="border-b border-gray-100">
                        <td className="py-2 pr-4 font-semibold text-[#0f2044]">{d.tipo}</td>
                        <td className="py-2 text-gray-700">{d.diagnostico || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-sm text-gray-400 italic">El afiliado no tiene discapacidades cargadas.</p>
              )}
            </div>
          </section>

          {/* Observaciones */}
          <section>
            <h3 className="bg-[#0078c2] text-white font-bold text-sm px-3 py-2 rounded-t-lg">Observaciones</h3>
            <div className="border border-t-0 border-gray-200 rounded-b-lg p-4">
              <textarea value={observaciones} onChange={e => setObservaciones(e.target.value)} rows={2} className={inputCls} placeholder="Observaciones (opcional)" />
            </div>
          </section>

          {/* 4 - Medicación (elegir del vademécum, no escribir a mano) */}
          <section>
            <h3 className="bg-[#0f2044] text-white font-bold text-sm px-3 py-2 rounded-t-lg">4. Medicación prescripta</h3>
            <div className="border border-t-0 border-gray-200 rounded-b-lg p-4">
              {/* Buscador de vademécum */}
              <div className="relative max-w-xl">
                <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2">
                  <Search size={16} className="text-gray-400" />
                  <input
                    value={medQuery}
                    onChange={e => onMedQuery(e.target.value)}
                    onFocus={() => { if (medResults.length) setMedOpen(true); }}
                    placeholder="Buscar por droga o nombre comercial…"
                    className="flex-1 text-sm outline-none"
                  />
                  {medBuscando && <Loader2 className="animate-spin text-gray-400" size={16} />}
                </div>
                {medOpen && medResults.length > 0 && (
                  <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                    {medResults.map(m => (
                      <button key={m.id} type="button" onClick={() => pickMed(m)}
                        className="w-full text-left px-3 py-2 hover:bg-[#0078c2]/5 border-b border-gray-100 text-sm">
                        <div className="font-semibold text-[#0f2044]">{m.nombre}</div>
                        <div className="text-xs text-gray-500">{m.droga} · {m.presentacion}</div>
                      </button>
                    ))}
                  </div>
                )}
                {medOpen && !medBuscando && medQuery.trim().length >= 2 && medResults.length === 0 && (
                  <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg px-3 py-2 text-sm text-gray-500">Sin resultados</div>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-1">Elegí el medicamento de la lista; el nombre y la presentación salen del vademécum.</p>

              {/* Medicamentos elegidos */}
              {meds.length > 0 ? (
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-left text-gray-600 border-b border-gray-200">
                        <th className="pb-2 pr-2">Medicamento</th>
                        <th className="pb-2 pr-2 w-24">Dosis diaria</th><th className="pb-2 pr-2 w-24">Cant. mensual</th>
                        <th className="pb-2 pr-2 w-28">Duración</th><th className="w-8"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {meds.map((m, i) => (
                        <tr key={i} className="border-b border-gray-100">
                          <td className="py-2 pr-2">
                            <div className="font-semibold text-[#0f2044]">{m.nombreComercial}</div>
                            <div className="text-[11px] text-gray-500">{m.principioActivo} · {m.presentacion}</div>
                          </td>
                          <td className="py-2 pr-2"><input value={m.dosisDiaria} onChange={e => setMed(i, 'dosisDiaria', e.target.value)} className={inputCls} /></td>
                          <td className="py-2 pr-2"><input value={m.cantidadMensual} onChange={e => setMed(i, 'cantidadMensual', e.target.value)} className={inputCls} /></td>
                          <td className="py-2 pr-2"><input value={m.duracion} onChange={e => setMed(i, 'duracion', e.target.value)} className={inputCls} /></td>
                          <td className="py-2"><button onClick={() => delMed(i)} className="text-red-500 hover:text-red-700"><Trash2 size={16} /></button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="mt-4 text-sm text-gray-400 italic">No hay medicamentos agregados todavía.</p>
              )}
            </div>
          </section>

          {/* Profesional tratante */}
          <section>
            <h3 className="bg-[#0f2044] text-white font-bold text-sm px-3 py-2 rounded-t-lg">Profesional tratante</h3>
            <div className="border border-t-0 border-gray-200 rounded-b-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Profesional</label>
                <input value={profesional} maxLength={100} onChange={e => setProfesional(e.target.value)} className={inputCls} placeholder="Nombre del profesional (máx. 100)" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Matrícula</label>
                <input value={matricula} maxLength={12} inputMode="numeric" onChange={e => setMatricula(e.target.value.replace(/\D/g, '').slice(0, 12))} className={inputCls} placeholder="Solo números (máx. 12)" />
              </div>
            </div>
          </section>

          <div className="flex justify-end">
            <button onClick={enviar} disabled={enviando} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-lg text-sm disabled:opacity-50">
              {enviando ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />} Enviar formulario
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const Campo: React.FC<{ label: string; value: string | null | undefined; cls: string }> = ({ label, value, cls }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
    <div className={cls}>{value || '—'}</div>
  </div>
);
