import React, { useState } from 'react';
import { Button } from './ui/Button';
import { Mail, Phone, MessageSquare, ShieldCheck, Clock, HeartPulse, FileText } from 'lucide-react';
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
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>();

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
    <section className="pt-20 min-h-screen bg-slate-50 font-sans animate-in fade-in duration-500">

      <div className="bg-[#1C75BB] px-6 md:px-12 py-10">
        <div className="flex flex-col items-center text-center gap-3">
          <div className="p-3 bg-white/10 rounded-2xl">
            <FileText size={28} className="text-[#00AEEF]" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-white leading-none">
              Formulario de <span className="text-[#00AEEF]">Afiliación</span>
            </h1>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center min-h-[400px] gap-5 px-6">
        <div className="w-20 h-20 bg-[#00AEEF]/10 rounded-3xl flex items-center justify-center">
          <Clock className="text-[#00AEEF]" size={36} />
        </div>
        <div className="text-center">
          <p className="text-2xl font-black uppercase tracking-tighter text-[#1C75BB] mb-2">Sección en construcción</p>
          <p className="text-gray-400 text-sm max-w-xs">Próximamente vas a poder completar tu solicitud de afiliación desde acá.</p>
        </div>
      </div>

    </section>
  );
};
