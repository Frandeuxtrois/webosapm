import React, { useState } from 'react';
import { Button } from './ui/Button';
import { UserPlus } from 'lucide-react';
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
    `w-full px-4 py-3 rounded-[1rem] border ${
      errors[field] ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:border-[#00AEEF] focus:ring-[#00AEEF]/20'
    } focus:ring-2 outline-none transition-all text-[#1C75BB] placeholder-gray-400 bg-white`;

  return (
    <section className="py-24 bg-white">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">

        {/* Encabezado */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#00AEEF]/10 rounded-full mb-6">
            <UserPlus className="w-8 h-8 text-[#00AEEF]" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#1C75BB] mb-4">
            Quiero Afiliarme
          </h1>
          <p className="text-gray-500 text-base max-w-md mx-auto">
            Dejanos tus datos, y un asesor se estará comunicando con vos en la brevedad.
          </p>
        </div>

        {/* Card del formulario */}
        <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-xl border border-gray-100">
          {success ? (
            <div className="flex flex-col items-center justify-center text-center space-y-4 py-10">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#1C75BB]">¡Solicitud enviada!</h3>
              <p className="text-gray-500">
                Gracias por tu interés. Un asesor se comunicará con vos a la brevedad.
              </p>
              <button
                onClick={() => setSuccess(false)}
                className="mt-4 text-sm text-[#00AEEF] hover:underline font-semibold"
              >
                Enviar otra solicitud
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Nombre y Apellido */}
              <div>
                <label className="block text-sm font-semibold text-[#1C75BB] mb-1.5">
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
                {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-[#1C75BB] mb-1.5">
                  Email <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={inputClass('email')}
                  placeholder="juan@email.com"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              {/* Teléfono */}
              <div>
                <label className="block text-sm font-semibold text-[#1C75BB] mb-1.5">
                  Teléfono <span className="text-red-400">*</span>
                </label>
                <input
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  className={inputClass('telefono')}
                  placeholder="11 1234-5678"
                />
                {errors.telefono && <p className="text-red-500 text-xs mt-1">{errors.telefono}</p>}
              </div>

              {/* Condición */}
              <div>
                <label className="block text-sm font-semibold text-[#1C75BB] mb-1.5">
                  Condición <span className="text-red-400">*</span>
                </label>
                <select
                  name="condicion"
                  value={formData.condicion}
                  onChange={handleChange}
                  className={`${inputClass('condicion')} ${!formData.condicion ? 'text-gray-400' : ''} appearance-none bg-[url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%231C75BB' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")] bg-no-repeat bg-[right_1rem_center]`}
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
                {errors.condicion && <p className="text-red-500 text-xs mt-1">{errors.condicion}</p>}
              </div>

              {/* Mensaje */}
              <div>
                <label className="block text-sm font-semibold text-[#1C75BB] mb-1.5">
                  Su mensaje <span className="text-gray-400 font-normal">(opcional)</span>
                </label>
                <textarea
                  rows={4}
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
                className="w-full py-4 text-sm font-bold uppercase tracking-wider bg-[#00AEEF] text-white hover:bg-[#1C75BB] rounded-[1rem] shadow-lg transition-all disabled:opacity-60"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Enviando...
                  </span>
                ) : (
                  'Enviar solicitud'
                )}
              </Button>
            </form>
          )}
        </div>

      </div>
    </section>
  );
};
