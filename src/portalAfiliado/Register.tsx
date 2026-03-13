import React, { useState } from 'react';
import { Eye, EyeOff, ArrowRight, Loader2, UserPlus, CalendarDays } from 'lucide-react';
import { API_BASE_URL, API_ENDPOINTS } from '../services/apiConfig';

import loginLogo from '../assets/login-logo.png';

interface RegisterProps {
  onBack: () => void;
  onRegisterSuccess: () => void;
  onGoToLogin: () => void;
}

export const Register: React.FC<RegisterProps> = ({ onBack, onRegisterSuccess, onGoToLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    dni: '',
    email: '',
    password: '',
    confirmPassword: '',
    fechaNacimiento: '',
  });

  const handleDniChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 14) {
      setFormData({ ...formData, dni: value });
    }
  };

  const validate = (): string | null => {
    if (!formData.dni || formData.dni.length < 7) return 'Ingresá un DNI válido (mínimo 7 dígitos).';
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return 'Ingresá un email válido.';
    if (!formData.fechaNacimiento) return 'Ingresá tu fecha de nacimiento.';
    if (!formData.password || formData.password.length < 6) return 'La contraseña debe tener al menos 6 caracteres.';
    if (formData.password !== formData.confirmPassword) return 'Las contraseñas no coinciden.';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.REGISTRO}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dni: formData.dni,
          email: formData.email,
          password: formData.password,
          fechaNacimiento: new Date(formData.fechaNacimiento).toISOString(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
      } else {
        setError(data.message || data.error || 'No se pudo completar el registro. Verificá los datos ingresados.');
      }
    } catch (err) {
      setError('Error de conexión con el servidor. Intentá nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrength = () => {
    const len = formData.password.length;
    if (len === 0) return 0;
    if (len < 4) return 1;
    if (len < 6) return 2;
    if (len < 8) return 3;
    return 4;
  };

  const strengthColors = ['bg-slate-200', 'bg-red-500', 'bg-orange-400', 'bg-[#00AEEF]', 'bg-green-500'];

  const inputClass = (field: string) =>
    `relative w-full bg-gradient-to-br from-slate-50 to-[#00AEEF]/5 border-2 rounded-xl py-4 px-5 transition-all outline-none text-[#111111] font-medium placeholder:text-slate-400 ${
      focusedField === field
        ? 'border-[#00AEEF] bg-white shadow-lg shadow-[#00AEEF]/10 scale-[1.02]'
        : 'border-slate-200 hover:border-[#00AEEF]/50'
    }`;

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 via-cyan-50 to-slate-100 relative overflow-hidden">

      {/* Elementos decorativos */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-72 h-72 bg-[#00AEEF]/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-[#1C75BB]/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00AEEF]/10 rounded-full blur-3xl"></div>
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: 'radial-gradient(circle, #1C75BB 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }}></div>
      </div>

      <div className="w-full max-w-md relative z-10">

        {/* Header */}
        <div className="text-center mb-8 space-y-4">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-br from-[#00AEEF] to-[#1C75BB] rounded-3xl blur-xl opacity-40 animate-pulse"></div>
            <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white shadow-2xl shadow-[#00AEEF]/20 border-4 border-slate-50">
              <img src={loginLogo} alt="OSAPM" className="h-12 w-auto object-contain" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#00AEEF] to-[#1C75BB] bg-clip-text text-transparent mb-2">Crear Cuenta</h1>
            <p className="text-sm text-slate-600 font-medium">Registrate en el Portal de Afiliados OSAPM</p>
          </div>
        </div>

        {/* Card */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-[#00AEEF] via-[#1C75BB] to-[#00AEEF] rounded-3xl blur-sm opacity-30"></div>
          <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl shadow-[#00AEEF]/20 p-8 border border-white/60">

            {success ? (
              <div className="flex flex-col items-center justify-center text-center space-y-4 py-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#1C75BB]">¡Registro exitoso!</h3>
                <p className="text-slate-500 text-sm">Tu cuenta fue creada correctamente. Ya podés iniciar sesión con tu DNI y contraseña.</p>
                <button
                  onClick={onGoToLogin}
                  className="mt-4 inline-flex items-center gap-2 bg-gradient-to-r from-[#00AEEF] to-[#1C75BB] text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:shadow-[#00AEEF]/40 transition-all"
                >
                  Ir a Iniciar Sesión <ArrowRight size={18} />
                </button>
              </div>
            ) : (
              <>
                {error && (
                  <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 text-red-700 text-sm rounded-2xl flex items-start gap-3 shadow-lg">
                    <span className="text-xl">⚠️</span>
                    <div>
                      <p className="font-semibold mb-1">Error en el registro</p>
                      <p className="text-xs opacity-90">{error}</p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">

                  {/* DNI */}
                  <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-[#111111]">DNI</label>
                    <div className="relative group">
                      <div className={`absolute inset-0 bg-gradient-to-r from-[#00AEEF] to-[#1C75BB] rounded-xl blur-md opacity-0 group-hover:opacity-20 transition-opacity ${focusedField === 'dni' ? 'opacity-30' : ''}`}></div>
                      <input
                        type="text"
                        inputMode="numeric"
                        required
                        className={inputClass('dni')}
                        placeholder="Sin puntos ni espacios"
                        value={formData.dni}
                        onChange={handleDniChange}
                        onFocus={() => setFocusedField('dni')}
                        onBlur={() => setFocusedField(null)}
                      />
                      {focusedField === 'dni' && formData.dni && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-xs text-green-600 font-medium">{formData.dni.length} dígitos</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-[#111111]">Email</label>
                    <div className="relative group">
                      <div className={`absolute inset-0 bg-gradient-to-r from-[#00AEEF] to-[#1C75BB] rounded-xl blur-md opacity-0 group-hover:opacity-20 transition-opacity ${focusedField === 'email' ? 'opacity-30' : ''}`}></div>
                      <input
                        type="email"
                        required
                        className={inputClass('email')}
                        placeholder="tu@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField(null)}
                      />
                    </div>
                  </div>

                  {/* Fecha de Nacimiento */}
                  <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-[#111111]">Fecha de Nacimiento</label>
                    <div className="relative group">
                      <div className={`absolute inset-0 bg-gradient-to-r from-[#00AEEF] to-[#1C75BB] rounded-xl blur-md opacity-0 group-hover:opacity-20 transition-opacity ${focusedField === 'fecha' ? 'opacity-30' : ''}`}></div>
                      <input
                        type="date"
                        required
                        className={`${inputClass('fecha')} ${!formData.fechaNacimiento ? 'text-slate-400' : ''}`}
                        value={formData.fechaNacimiento}
                        onChange={(e) => setFormData({ ...formData, fechaNacimiento: e.target.value })}
                        onFocus={() => setFocusedField('fecha')}
                        onBlur={() => setFocusedField(null)}
                        max={new Date().toISOString().split('T')[0]}
                      />
                      <CalendarDays className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
                    </div>
                  </div>

                  {/* Contraseña */}
                  <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-[#111111]">Contraseña</label>
                    <div className="relative group">
                      <div className={`absolute inset-0 bg-gradient-to-r from-[#1C75BB] to-[#00AEEF] rounded-xl blur-md opacity-0 group-hover:opacity-20 transition-opacity ${focusedField === 'password' ? 'opacity-30' : ''}`}></div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        className={`${inputClass('password')} pr-12`}
                        placeholder="Mínimo 6 caracteres"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        onFocus={() => setFocusedField('password')}
                        onBlur={() => setFocusedField(null)}
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#1C75BB] transition-colors p-1 hover:bg-slate-100 rounded-lg">
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    {formData.password && (
                      <div className="flex gap-1 mt-2">
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= getPasswordStrength() ? strengthColors[getPasswordStrength()] : 'bg-slate-200'}`}></div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Confirmar Contraseña */}
                  <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-[#111111]">Confirmar Contraseña</label>
                    <div className="relative group">
                      <div className={`absolute inset-0 bg-gradient-to-r from-[#1C75BB] to-[#00AEEF] rounded-xl blur-md opacity-0 group-hover:opacity-20 transition-opacity ${focusedField === 'confirm' ? 'opacity-30' : ''}`}></div>
                      <input
                        type={showConfirm ? 'text' : 'password'}
                        required
                        className={`${inputClass('confirm')} pr-12`}
                        placeholder="Repetí tu contraseña"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        onFocus={() => setFocusedField('confirm')}
                        onBlur={() => setFocusedField(null)}
                      />
                      <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#1C75BB] transition-colors p-1 hover:bg-slate-100 rounded-lg">
                        {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                      <p className="text-red-500 text-xs mt-1 font-medium">Las contraseñas no coinciden</p>
                    )}
                    {formData.confirmPassword && formData.password === formData.confirmPassword && formData.confirmPassword.length > 0 && (
                      <p className="text-green-600 text-xs mt-1 font-medium flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full inline-block"></span> Las contraseñas coinciden
                      </p>
                    )}
                  </div>

                  {/* Botón Registrarse */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="relative w-full bg-gradient-to-r from-[#00AEEF] via-[#1C75BB] to-[#00AEEF] text-white font-bold py-4 rounded-xl shadow-xl hover:shadow-[#00AEEF]/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group mt-4 overflow-hidden"
                    style={{ backgroundSize: '200% 100%' }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    {isLoading ? (
                      <Loader2 className="animate-spin relative z-10" size={22} />
                    ) : (
                      <>
                        <UserPlus size={20} className="relative z-10" />
                        <span className="relative z-10">Crear mi cuenta</span>
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-8 pt-6 border-t-2 border-slate-100 text-center">
                  <p className="text-sm text-slate-600 mb-3">¿Ya tenés cuenta?</p>
                  <button
                    onClick={onGoToLogin}
                    className="inline-flex items-center gap-2 text-[#1C75BB] font-bold hover:text-[#00AEEF] transition-colors px-4 py-2 rounded-lg hover:bg-[#00AEEF]/5"
                  >
                    <span>Iniciá sesión</span> <ArrowRight size={16} />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <button
          onClick={(e) => { e.preventDefault(); onBack(); }}
          className="mt-8 w-full text-slate-700 hover:text-[#111111] transition-colors text-sm font-semibold flex items-center justify-center gap-2 py-3 rounded-xl hover:bg-white/50 backdrop-blur-sm"
        >
          ← Volver al sitio web
        </button>
      </div>
    </div>
  );
};
