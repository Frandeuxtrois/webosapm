import React, { useState } from 'react';
import { Eye, EyeOff, ArrowRight, Loader2, Lock, CheckCircle, Shield, FileText } from 'lucide-react';
import { useAuth } from '../context/authContext';
import { API_BASE_URL, API_ENDPOINTS } from '../services/apiConfig';

import loginLogo from '../assets/login-logo.png';

interface LoginProps {
  onBack: () => void;
  onLoginSuccess: () => void;
  onGoToRegister?: () => void;
}

type Step = 'login' | 'recuperar' | 'reset' | 'exito';

export const Login: React.FC<LoginProps> = ({ onBack, onLoginSuccess, onGoToRegister }) => {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [step, setStep] = useState<Step>('login');

  const [formData, setFormData] = useState({ dni: '', password: '' });
  const [recDni, setRecDni] = useState('');
  const [recEmail, setRecEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [resetPassword, setResetPassword] = useState('');
  const [resetPasswordConfirm, setResetPasswordConfirm] = useState('');

  const handleSolicitarReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.OLVIDE_CLAVE}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ DNI: recDni, Email: recEmail }),
      });
      if (res.ok) {
        setResetToken('');
        setStep('reset');
      } else if (res.status === 429) {
        setError('Demasiados intentos. Aguardá unos minutos antes de pedir otro código.');
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.mensaje || 'Los datos no coinciden con nuestros registros.');
      }
    } catch {
      setError('Error de conexión con el servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEjecutarReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (resetPassword !== resetPasswordConfirm) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.EJECUTAR_RESET}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ DNI: recDni, Token: resetToken, NuevaPassword: resetPassword }),
      });
      if (res.ok) {
        setStep('exito');
      } else if (res.status === 429) {
        setError('Demasiados intentos. Aguardá unos minutos e intentá de nuevo.');
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.mensaje || 'El código es inválido o ha expirado. Pedí uno nuevo.');
      }
    } catch {
      setError('Error de conexión con el servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDniChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 14) {
      setFormData({ ...formData, dni: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const res = await login(formData.dni, formData.password);
      if (res.ok) {
        onLoginSuccess();
      } else {
        setError(res.data.message || res.data.error || 'Credenciales incorrectas');
      }
    } catch {
      setError('Error de conexión con el servidor');
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    { icon: <Shield size={15} />, label: 'Cartilla médica online' },
    { icon: <FileText size={15} />, label: 'Gestión de trámites' },
  ];

  const leftPanel = (
    <div
      className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: "url('/familiaportal.png')" }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#1C75BB]/65 via-[#1C75BB]/55 to-[#1C75BB]/35" />

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-16">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-xl">
            <img src={loginLogo} alt="OSAPM" className="h-8 w-auto object-contain" />
          </div>
          <p className="text-white font-semibold text-sm leading-snug max-w-[160px]">
            Obra Social de Agentes de Propaganda Médica
          </p>
        </div>

      </div>

      <div className="relative z-10 space-y-3">
        {features.map(({ icon, label }) => (
          <div key={label} className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-[#00AEEF] shrink-0">
              {icon}
            </div>
            <span className="text-white/80 text-sm font-semibold">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const mobileLogo = (
    <p className="lg:hidden text-[#1C75BB] font-black text-sm mb-8 leading-snug">
      Obra Social de Agentes de Propaganda Médica
    </p>
  );

  const errorBanner = error && (
    <div className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl flex items-start gap-2.5 font-medium">
      <span className="shrink-0">⚠️</span>
      <span>{error}</span>
    </div>
  );

  if (step === 'recuperar') return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-[70%_30%]">
      {leftPanel}
      <div className="flex flex-col justify-center min-h-screen bg-white px-6 lg:px-10 py-12">
        {mobileLogo}
        <div className="w-full max-w-sm mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-black text-[#1C75BB] mb-1">Recuperar contraseña</h1>
            <p className="text-sm text-slate-500 font-medium">Te enviamos un código al email asociado a tu DNI</p>
          </div>
          {errorBanner}
          <form onSubmit={handleSolicitarReset} className="space-y-5">
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-[#111111]">DNI</label>
              <input
                type="text" inputMode="numeric" required
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl py-3.5 px-4 outline-none font-medium text-[#111111] focus:border-[#00AEEF] transition-all placeholder:text-slate-400 text-sm"
                placeholder="Sin puntos ni espacios"
                value={recDni}
                onChange={e => setRecDni(e.target.value.replace(/\D/g, ''))}
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-[#111111]">Email</label>
              <input
                type="email" required
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl py-3.5 px-4 outline-none font-medium text-[#111111] focus:border-[#00AEEF] transition-all placeholder:text-slate-400 text-sm"
                placeholder="El email asociado a tu cuenta"
                value={recEmail}
                onChange={e => setRecEmail(e.target.value)}
              />
            </div>
            <button type="submit" disabled={isLoading || !recDni || !recEmail}
              className="w-full bg-[#1C75BB] hover:bg-[#1565a8] text-white font-bold py-3.5 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm">
              {isLoading ? <Loader2 className="animate-spin" size={18} /> : <><span>Enviar código</span><ArrowRight size={16} /></>}
            </button>
          </form>
          <button onClick={() => { setStep('login'); setError(null); }}
            className="mt-6 text-sm text-slate-400 hover:text-slate-600 font-semibold flex items-center gap-1.5 transition-colors">
            ← Volver al inicio de sesión
          </button>
        </div>
      </div>
    </div>
  );

  if (step === 'reset') return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-[70%_30%]">
      {leftPanel}
      <div className="flex flex-col justify-center min-h-screen bg-white px-6 lg:px-10 py-12">
        {mobileLogo}
        <div className="w-full max-w-sm mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-black text-[#1C75BB] mb-1">Nueva contraseña</h1>
            <p className="text-sm text-slate-500 font-medium">Ingresá el código que recibiste por email</p>
          </div>
          {errorBanner}
          <form onSubmit={handleEjecutarReset} className="space-y-5">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-semibold text-[#111111]">Código recibido</label>
                <button
                  type="button"
                  onClick={() => { setError(null); handleSolicitarReset({ preventDefault: () => {} } as React.FormEvent); }}
                  className="text-xs text-[#00AEEF] hover:underline font-semibold">
                  Reenviar código
                </button>
              </div>
              <input
                type="text" inputMode="numeric" required maxLength={6}
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl py-3.5 px-4 outline-none font-medium text-[#111111] focus:border-[#00AEEF] transition-all tracking-[0.5em] text-center text-sm"
                placeholder="• • • • • •"
                value={resetToken}
                onChange={e => setResetToken(e.target.value.replace(/\D/g, '').slice(0, 6))}
              />
              <p className="text-[11px] text-gray-400 font-medium">El código vence a los 15 minutos.</p>
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-[#111111]">Nueva contraseña</label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'} required
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl py-3.5 px-4 pr-11 outline-none font-medium text-[#111111] focus:border-[#1C75BB] transition-all placeholder:text-slate-400 text-sm"
                  placeholder="Mínimo 8 caracteres"
                  value={resetPassword}
                  onChange={e => setResetPassword(e.target.value)}
                />
                <button type="button" onClick={() => setShowNewPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#1C75BB] transition-colors">
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-[#111111]">Confirmar contraseña</label>
              <input
                type="password" required
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl py-3.5 px-4 outline-none font-medium text-[#111111] focus:border-[#1C75BB] transition-all placeholder:text-slate-400 text-sm"
                placeholder="Repetí la nueva contraseña"
                value={resetPasswordConfirm}
                onChange={e => setResetPasswordConfirm(e.target.value)}
              />
            </div>
            <button type="submit" disabled={isLoading || resetToken.length < 6 || !resetPassword || !resetPasswordConfirm}
              className="w-full bg-[#1C75BB] hover:bg-[#1565a8] text-white font-bold py-3.5 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm">
              {isLoading ? <Loader2 className="animate-spin" size={18} /> : <><span>Cambiar contraseña</span><ArrowRight size={16} /></>}
            </button>
          </form>
          <button onClick={() => { setStep('recuperar'); setError(null); }}
            className="mt-6 text-sm text-slate-400 hover:text-slate-600 font-semibold flex items-center gap-1.5 transition-colors">
            ← Volver
          </button>
        </div>
      </div>
    </div>
  );

  if (step === 'exito') return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-[70%_30%]">
      {leftPanel}
      <div className="flex flex-col justify-center min-h-screen bg-white px-6 lg:px-10 py-12">
        {mobileLogo}
        <div className="w-full max-w-sm mx-auto">
          <div className="w-14 h-14 bg-[#00AEEF]/10 rounded-2xl flex items-center justify-center mb-6">
            <CheckCircle size={28} className="text-[#00AEEF]" />
          </div>
          <h2 className="text-2xl font-black text-[#1C75BB] mb-2">¡Contraseña actualizada!</h2>
          <p className="text-slate-500 text-sm font-medium mb-8">Ya podés iniciar sesión con tu nueva contraseña.</p>
          <button onClick={() => { setStep('login'); setError(null); }}
            className="w-full bg-[#1C75BB] hover:bg-[#1565a8] text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 text-sm">
            Ir al inicio de sesión <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-[70%_30%]">
      {leftPanel}
      <div className="flex flex-col justify-center min-h-screen bg-white px-6 lg:px-10 py-12">
        {mobileLogo}
        <div className="w-full max-w-sm mx-auto">
          <div className="mb-8 text-center">
            <img src={loginLogo} alt="OSAPM" className="h-20 w-auto object-contain mb-5 mx-auto" />
            <h1 className="text-2xl font-black text-[#1C75BB] mb-1">Bienvenido</h1>
            <p className="text-sm text-slate-500 font-medium">Ingresá con tu DNI y contraseña</p>
          </div>

          {errorBanner}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-[#111111]">DNI</label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  required
                  className={`w-full bg-slate-50 border-2 rounded-xl py-3.5 px-4 transition-all outline-none text-[#111111] font-medium placeholder:text-slate-400 text-sm ${focusedField === 'dni' ? 'border-[#00AEEF] bg-white' : 'border-slate-200 hover:border-slate-300'}`}
                  placeholder="Sin puntos ni espacios"
                  value={formData.dni}
                  onChange={handleDniChange}
                  onFocus={() => setFocusedField('dni')}
                  onBlur={() => setFocusedField(null)}
                />
                {focusedField === 'dni' && formData.dni && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-[#00AEEF] rounded-full animate-pulse" />
                    <span className="text-[11px] text-[#00AEEF] font-semibold">{formData.dni.length} dígitos</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-[#111111]">Contraseña</label>
                <button type="button" onClick={() => { setError(null); setRecDni(formData.dni); setStep('recuperar'); }}
                  className="text-xs text-[#1C75BB] hover:text-[#00AEEF] font-semibold hover:underline flex items-center gap-1 transition-colors">
                  <Lock size={11} />¿Olvidaste tu clave?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  className={`w-full bg-slate-50 border-2 rounded-xl py-3.5 px-4 pr-11 transition-all outline-none text-[#111111] font-medium placeholder:text-slate-400 text-sm ${focusedField === 'password' ? 'border-[#1C75BB] bg-white' : 'border-slate-200 hover:border-slate-300'}`}
                  placeholder="Ingresá tu contraseña"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#1C75BB] transition-colors">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {formData.password && (
                <div className="flex gap-1 mt-1.5">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className={`h-1 flex-1 rounded-full transition-all ${
                      formData.password.length >= i * 2
                        ? formData.password.length >= 8 ? 'bg-[#00AEEF]' : 'bg-[#1C75BB]/50'
                        : 'bg-slate-200'
                    }`} />
                  ))}
                </div>
              )}
            </div>

            <button type="submit" disabled={isLoading}
              className="w-full bg-[#1C75BB] hover:bg-[#1565a8] text-white font-bold py-3.5 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm mt-2 group">
              {isLoading
                ? <Loader2 className="animate-spin" size={18} />
                : <><span>Iniciar Sesión</span><ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" /></>
              }
            </button>
          </form>

          <div className="mt-7 pt-6 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500 mb-2">¿No tenés cuenta?</p>
            <button onClick={onGoToRegister}
              className="inline-flex items-center gap-1.5 text-[#1C75BB] font-bold hover:text-[#00AEEF] transition-colors text-sm">
              <span>Registrate ahora</span><ArrowRight size={14} />
            </button>
          </div>

          <button onClick={(e) => { e.preventDefault(); onBack(); }}
            className="mt-6 w-full text-center text-sm text-slate-400 hover:text-slate-600 font-semibold transition-colors">
            ← Volver al sitio web
          </button>
        </div>
      </div>
    </div>
  );
};
