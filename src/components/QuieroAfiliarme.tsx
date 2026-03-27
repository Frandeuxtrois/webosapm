import React, { useState } from 'react';
import { Button } from './ui/Button';
import { UserPlus, Mail, Phone, MessageSquare, ShieldCheck, Clock, HeartPulse } from 'lucide-react';
import { apiService } from '../services/api';

const CONDICIONES = [
  'Visitador Médico',
  'Relación de Dependencia',
  'Monotributista',
] as const;

interface FormData {
  nombre: string;
  email: string;
  telefono: string;
  condicion: string;
  mensaje: string;
}

export const QuieroAfiliarme: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    email: '',
    telefono: '',
    condicion: '',
    mensaje: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.nombre.trim()) newErrors.nombre = 'Este campo es obligatorio.';
    if (!formData.email.trim()) {
      newErrors.email = 'Este campo es obligatorio.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Ingresá un email válido.';
    }
    if (!formData.telefono.trim()) {
      newErrors.telefono = 'Este campo es obligatorio.';
    } else if (!/^[\d\s\-+()]{7,20}$/.test(formData.telefono)) {
      newErrors.telefono = 'Ingresá un teléfono válido.';
    }
    if (!formData.condicion) newErrors.condicion = 'Seleccioná una condición.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await apiService.submitAffiliationForm(formData);
      setSuccess(true);
      setFormData({ nombre: '', email: '', telefono: '', condicion: '', mensaje: '' });
    } catch (err) {
      console.error('Error al enviar formulario de afiliación:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const inputClass = (field: keyof FormData) =>
    `w-full px-3 py-2 rounded-xl border ${
      errors[field] ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:border-[#00AEEF] focus:ring-[#00AEEF]/20'
    } focus:ring-2 outline-none transition-all text-[#1C75BB] placeholder-gray-400 bg-white text-sm`;

  return (
    <section className="py-10 bg-white min-h-screen flex items-center">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 w-full">

        {/* Encabezado */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-[#00AEEF]/10 rounded-full mb-3">
            <UserPlus className="w-6 h-6 text-[#00AEEF]" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#1C75BB] mb-1">
            Quiero Afiliarme
          </h1>
          <p className="text-gray-500 text-sm max-w-sm mx-auto">
            Completá el formulario y un asesor se comunicará con vos a la brevedad.
          </p>
        </div>

        {/* Chips de beneficios */}
        <div className="flex flex-wrap justify-center gap-2 mb-5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#00AEEF]/10 text-[#1C75BB] text-xs font-semibold rounded-full">
            <ShieldCheck className="w-3.5 h-3.5" /> Sin costo de afiliación
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#00AEEF]/10 text-[#1C75BB] text-xs font-semibold rounded-full">
            <Clock className="w-3.5 h-3.5" /> Respuesta en 24–48 hs
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#00AEEF]/10 text-[#1C75BB] text-xs font-semibold rounded-full">
            <HeartPulse className="w-3.5 h-3.5" /> Cobertura inmediata
          </span>
        </div>

        {/* Card del formulario */}
        <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
          {success ? (
            <div className="flex flex-col items-center justify-center text-center space-y-3 py-8">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#1C75BB]">¡Solicitud enviada!</h3>
              <p className="text-gray-500 text-sm">
                Gracias por tu interés. Un asesor se comunicará con vos a la brevedad.
              </p>
              <button
                onClick={() => setSuccess(false)}
                className="mt-2 text-sm text-[#00AEEF] hover:underline font-semibold"
              >
                Enviar otra solicitud
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5">

              {/* Nombre y Apellido */}
              <div>
                <label className="block text-xs font-semibold text-[#1C75BB] mb-1">
                  Nombre y Apellido <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className={inputClass('nombre')}
                  placeholder="Ej: Juan Pérez"
                />
                {errors.nombre && <p className="text-red-500 text-xs mt-0.5">{errors.nombre}</p>}
              </div>

              {/* Email y Teléfono en grilla */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#1C75BB] mb-1">
                    <span className="inline-flex items-center gap-1"><Mail className="w-3 h-3" /> Email</span> <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={inputClass('email')}
                    placeholder="juan@email.com"
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-0.5">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1C75BB] mb-1">
                    <span className="inline-flex items-center gap-1"><Phone className="w-3 h-3" /> Teléfono</span> <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    className={inputClass('telefono')}
                    placeholder="11 1234-5678"
                  />
                  {errors.telefono && <p className="text-red-500 text-xs mt-0.5">{errors.telefono}</p>}
                </div>
              </div>

              {/* Condición */}
              <div>
                <label className="block text-xs font-semibold text-[#1C75BB] mb-1">
                  Condición laboral <span className="text-red-400">*</span>
                </label>
                <select
                  name="condicion"
                  value={formData.condicion}
                  onChange={handleChange}
                  className={`${inputClass('condicion')} ${!formData.condicion ? 'text-gray-400' : ''} appearance-none bg-[url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%231C75BB' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")] bg-no-repeat bg-[right_0.75rem_center]`}
                >
                  <option value="" disabled>
                    Seleccioná tu condición
                  </option>
                  {CONDICIONES.map((cond) => (
                    <option key={cond} value={cond}>
                      {cond}
                    </option>
                  ))}
                </select>
                {errors.condicion && <p className="text-red-500 text-xs mt-0.5">{errors.condicion}</p>}
              </div>

              {/* Mensaje */}
              <div>
                <label className="block text-xs font-semibold text-[#1C75BB] mb-1">
                  <span className="inline-flex items-center gap-1"><MessageSquare className="w-3 h-3" /> Consulta</span> <span className="text-gray-400 font-normal">(opcional)</span>
                </label>
                <textarea
                  rows={2}
                  name="mensaje"
                  value={formData.mensaje}
                  onChange={handleChange}
                  className={`${inputClass('mensaje')} resize-none`}
                  placeholder="Contanos un poco sobre tu situación o dejanos tu consulta..."
                />
              </div>

              {/* Botón enviar */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 text-sm font-bold uppercase tracking-wider bg-[#00AEEF] text-white hover:bg-[#1C75BB] rounded-xl shadow-lg transition-all disabled:opacity-60"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Enviando...
                  </span>
                ) : (
                  'Enviar solicitud'
                )}
              </Button>

              {/* Nota de privacidad */}
              <p className="text-center text-xs text-gray-400 mt-1">
                <ShieldCheck className="inline w-3 h-3 mr-0.5 mb-0.5" />
                Tus datos son confidenciales y no serán compartidos con terceros.
              </p>

            </form>
          )}
        </div>

      </div>
    </section>
  );
};
