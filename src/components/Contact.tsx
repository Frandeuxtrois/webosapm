import React, { useState } from 'react';
import { Button } from './ui/Button';
import { Phone, Mail, MapPin } from 'lucide-react';
import { apiService } from '../services/api';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({ nombre: '', email: '', mensaje: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const emailValido = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!formData.nombre.trim() || !formData.email.trim() || !formData.mensaje.trim()) {
      setError('Completá todos los campos antes de enviar.');
      return;
    }
    if (!emailValido(formData.email)) {
      setError('El email no tiene un formato válido.');
      return;
    }
    setLoading(true);
    try {
      await apiService.submitContactForm(formData);
      setSuccess(true);
      setFormData({ nombre: '', email: '', mensaje: '' });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err: any) {
      if (err?.status === 429) {
        setError('Demasiados intentos. Aguardá unos minutos antes de enviar otra consulta.');
      } else {
        setError('No pudimos enviar tu mensaje. Intentá de nuevo o escribinos a osapm@apm.org.ar.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <section id="contacto" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-celeste/5 rounded-[3rem] p-8 md:p-16">
          <div className="grid lg:grid-cols-2 gap-16">

            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-oscuro">Estamos para ayudarte</h2>
              <p className="text-gray-600">
                Si tenés dudas sobre nuestros planes o necesitás asistencia, completá el formulario
                y un asesor se pondrá en contacto con vos a la brevedad.
              </p>

              <div className="space-y-6 pt-4">
                <div className="flex items-start">
                  <div className="bg-white p-3 rounded-full shadow-sm text-celeste">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <h4 className="font-bold text-oscuro">Atención Telefónica</h4>
                    <p className="text-gray-600">0800-555-SALUD (72583)</p>
                    <p className="text-sm text-gray-500">Lun a Vie de 8 a 20hs</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-white p-3 rounded-full shadow-sm text-celeste">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <h4 className="font-bold text-oscuro">Sede Central</h4>
                    <p className="text-gray-600">Av. Avellaneda 2144, CABA</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-white p-3 rounded-full shadow-sm text-celeste">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <h4 className="font-bold text-oscuro">Email</h4>
                    <a href="mailto:osapm@apm.org.ar" className="text-gray-600 hover:text-celeste transition-colors">osapm@apm.org.ar</a>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-lg">
              {success ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  <h3 className="text-xl font-bold text-oscuro">¡Mensaje enviado!</h3>
                  <p className="text-gray-600">Gracias por contactarnos. Te responderemos pronto.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-celeste focus:ring-2 focus:ring-celeste/20 outline-none transition-all"
                      placeholder="Juan Pérez"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-celeste focus:ring-2 focus:ring-celeste/20 outline-none transition-all"
                      placeholder="juan@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Consulta</label>
                    <textarea
                      rows={4}
                      name="mensaje"
                      value={formData.mensaje}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-celeste focus:ring-2 focus:ring-celeste/20 outline-none transition-all"
                      placeholder="Escribí tu mensaje aquí..."
                    ></textarea>
                  </div>
                  {error && (
                    <p className="text-sm font-medium text-red-500">{error}</p>
                  )}
                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? 'Enviando...' : 'Enviar mensaje'}
                  </Button>
                </form>
              )}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};