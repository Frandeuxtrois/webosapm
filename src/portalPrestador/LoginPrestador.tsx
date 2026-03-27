import React, { useState } from 'react';
import { Eye, EyeOff, ArrowRight, Loader2, Lock, ArrowLeft, Mail, KeyRound } from 'lucide-react';
import { apiService } from '../services/api';
import loginLogo from '../assets/login-logo.png';

interface LoginPrestadorProps {
  onLoginSuccess: () => void;
  onBack: () => void;
}

type Step = 'login' | 'olvide' | 'reset';

export const LoginPrestador: React.FC<LoginPrestadorProps> = ({ onLoginSuccess, onBack }) => {
  const [step, setStep] = useState<Step>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Step 1
  const [cuit, setCuit] = useState('');
  const [password, setPassword] = useState('');

  // Step 2
  const [olvideEmail, setOlvideEmail] = useState('');
  const [olvideCuit, setOlvideCuit] = useState('');

  // Step 3
  const [resetCuit, setResetCuit] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const formatCuit = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 2) return digits;
    if (digits.length <= 10) return `${digits.slice(0, 2)}-${digits.slice(2)}`;
    return `${digits.slice(0, 2)}-${digits.slice(2, 10)}-${digits.slice(10)}`;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiService.loginPrestador(cuit.replace(/\D/g, ''), password);
      localStorage.setItem('prestador_token', data.token);
      localStorage.setItem('prestador_refresh_token', data.refreshToken);
      localStorage.setItem('prestador_cuit', cuit.replace(/\D/g, ''));
      onLoginSuccess();
    } catch (err: any) {
      const code = err.message;
      if (code === '401') setError('CUIT o contraseña incorrectos');
      else if (code === '404') setError('CUIT no registrado en el sistema');
      else setError('Error de conexión con el servidor');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOlvideClave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await apiService.olvideClavePrestador(olvideCuit.replace(/\D/g, ''), olvideEmail);
      setResetCuit(olvideCuit);
      setStep('reset');
    } catch (err: any) {
      const code = err.message;
      if (code === '400') setError('Los datos ingresados no coinciden con ninguna cuenta');
      else setError('Error de conexión con el servidor');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      await apiService.resetClavePrestador(resetCuit.replace(/\D/g, ''), otp, newPassword);
      setCuit(resetCuit);
      setStep('login');
      setError(null);
    } catch (err: any) {
      const code = err.message;
      if (code === '400') setError('El código ingresado es inválido o ha expirado');
      else setError('Error de conexión con el servidor');
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = (field: string) =>
    `relative w-full bg-gradient-to-br from-slate-50 to-[#00AEEF]/5 border-2 rounded-xl py-4 px-5 transition-all outline-none text-[#111111] font-medium placeholder:text-slate-400 ${
      focusedField === field
        ? 'border-[#00AEEF] bg-white shadow-lg shadow-[#00AEEF]/10 scale-[1.02]'
        : 'border-slate-200 hover:border-[#00AEEF]/50'
    }`;

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 via-cyan-50 to-slate-100 relative overflow-hidden">
      {/* Decorative elements */}
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
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#00AEEF] to-[#1C75BB] bg-clip-text text-transparent mb-2">
              Portal Prestadores
            </h1>
            <p className="text-sm text-slate-600 font-medium">Obra Social Agentes de Propaganda Médica</p>
          </div>
        </div>

        {/* Card */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-[#00AEEF] via-[#1C75BB] to-[#00AEEF] rounded-3xl blur-sm opacity-30"></div>
          <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl shadow-[#00AEEF]/20 p-8 border border-white/60">

            {error && (
              <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 text-red-700 text-sm rounded-2xl flex items-start gap-3 shadow-lg">
                <span className="text-xl">⚠</span>
                <div>
                  <p className="font-semibold mb-1">Error</p>
                  <p className="text-xs opacity-90">{error}</p>
                </div>
              </div>
            )}

            {/* STEP 1: LOGIN */}
            {step === 'login' && (
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-[#111111]">CUIT</label>
                  <div className="relative group">
                    <div className={`absolute inset-0 bg-gradient-to-r from-[#00AEEF] to-[#1C75BB] rounded-xl blur-md opacity-0 group-hover:opacity-20 transition-opacity ${focusedField === 'cuit' ? 'opacity-30' : ''}`}></div>
                    <input
                      type="text"
                      inputMode="numeric"
                      required
                      className={inputClass('cuit')}
                      placeholder="20-12345678-9"
                      value={cuit}
                      onChange={(e) => setCuit(formatCuit(e.target.value))}
                      onFocus={() => setFocusedField('cuit')}
                      onBlur={() => setFocusedField(null)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-semibold text-[#111111]">Contraseña</label>
                    <button
                      type="button"
                      onClick={() => { setStep('olvide'); setError(null); setOlvideCuit(cuit); }}
                      className="text-xs text-[#1C75BB] hover:text-[#00AEEF] font-semibold hover:underline flex items-center gap-1"
                    >
                      <Lock size={12} /> Olvidé mi clave
                    </button>
                  </div>
                  <div className="relative group">
                    <div className={`absolute inset-0 bg-gradient-to-r from-[#1C75BB] to-[#00AEEF] rounded-xl blur-md opacity-0 group-hover:opacity-20 transition-opacity ${focusedField === 'password' ? 'opacity-30' : ''}`}></div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      className={`${inputClass('password')} pr-12`}
                      placeholder="Ingresá tu contraseña"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField(null)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#1C75BB] transition-colors p-1 hover:bg-slate-100 rounded-lg"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="relative w-full bg-gradient-to-r from-[#00AEEF] via-[#1C75BB] to-[#00AEEF] text-white font-bold py-4 rounded-xl shadow-xl hover:shadow-[#00AEEF]/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group mt-8 overflow-hidden"
                  style={{ backgroundSize: '200% 100%' }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  {isLoading
                    ? <Loader2 className="animate-spin relative z-10" size={22} />
                    : <><span className="relative z-10">Iniciar sesión</span><ArrowRight size={20} className="group-hover:translate-x-1 transition-transform relative z-10" /></>
                  }
                </button>
              </form>
            )}

            {/* STEP 2: OLVIDE CLAVE */}
            {step === 'olvide' && (
              <form onSubmit={handleOlvideClave} className="space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <button type="button" onClick={() => { setStep('login'); setError(null); }} className="p-2 rounded-xl hover:bg-slate-100 text-[#1C75BB] transition-colors">
                    <ArrowLeft size={18} />
                  </button>
                  <div>
                    <h2 className="font-bold text-[#1C75BB] text-lg">Recuperar contraseña</h2>
                    <p className="text-xs text-slate-500">Ingresá tu CUIT y email registrado</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-[#111111]">CUIT</label>
                  <div className="relative group">
                    <div className={`absolute inset-0 bg-gradient-to-r from-[#00AEEF] to-[#1C75BB] rounded-xl blur-md opacity-0 group-hover:opacity-20 transition-opacity ${focusedField === 'olvideCuit' ? 'opacity-30' : ''}`}></div>
                    <input
                      type="text"
                      inputMode="numeric"
                      required
                      className={inputClass('olvideCuit')}
                      placeholder="20-12345678-9"
                      value={olvideCuit}
                      onChange={(e) => setOlvideCuit(formatCuit(e.target.value))}
                      onFocus={() => setFocusedField('olvideCuit')}
                      onBlur={() => setFocusedField(null)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-[#111111]">Email registrado</label>
                  <div className="relative group">
                    <div className={`absolute inset-0 bg-gradient-to-r from-[#00AEEF] to-[#1C75BB] rounded-xl blur-md opacity-0 group-hover:opacity-20 transition-opacity ${focusedField === 'olvideEmail' ? 'opacity-30' : ''}`}></div>
                    <input
                      type="email"
                      required
                      className={inputClass('olvideEmail')}
                      placeholder="tu@email.com"
                      value={olvideEmail}
                      onChange={(e) => setOlvideEmail(e.target.value)}
                      onFocus={() => setFocusedField('olvideEmail')}
                      onBlur={() => setFocusedField(null)}
                    />
                    <Mail size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="relative w-full bg-gradient-to-r from-[#00AEEF] via-[#1C75BB] to-[#00AEEF] text-white font-bold py-4 rounded-xl shadow-xl hover:shadow-[#00AEEF]/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group overflow-hidden"
                  style={{ backgroundSize: '200% 100%' }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  {isLoading
                    ? <Loader2 className="animate-spin relative z-10" size={22} />
                    : <><span className="relative z-10">Enviar código</span><ArrowRight size={20} className="group-hover:translate-x-1 transition-transform relative z-10" /></>
                  }
                </button>
              </form>
            )}

            {/* STEP 3: RESET */}
            {step === 'reset' && (
              <form onSubmit={handleReset} className="space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <button type="button" onClick={() => { setStep('olvide'); setError(null); }} className="p-2 rounded-xl hover:bg-slate-100 text-[#1C75BB] transition-colors">
                    <ArrowLeft size={18} />
                  </button>
                  <div>
                    <h2 className="font-bold text-[#1C75BB] text-lg">Restablecer contraseña</h2>
                    <p className="text-xs text-slate-500">Ingresá el código recibido por email</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-[#111111]">Código OTP (6 dígitos)</label>
                  <div className="relative group">
                    <div className={`absolute inset-0 bg-gradient-to-r from-[#00AEEF] to-[#1C75BB] rounded-xl blur-md opacity-0 group-hover:opacity-20 transition-opacity ${focusedField === 'otp' ? 'opacity-30' : ''}`}></div>
                    <input
                      type="text"
                      inputMode="numeric"
                      required
                      maxLength={6}
                      className={`${inputClass('otp')} text-center text-2xl font-black tracking-[0.4em]`}
                      placeholder="000000"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      onFocus={() => setFocusedField('otp')}
                      onBlur={() => setFocusedField(null)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-[#111111]">Nueva contraseña</label>
                  <div className="relative group">
                    <div className={`absolute inset-0 bg-gradient-to-r from-[#00AEEF] to-[#1C75BB] rounded-xl blur-md opacity-0 group-hover:opacity-20 transition-opacity ${focusedField === 'newPass' ? 'opacity-30' : ''}`}></div>
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      required
                      className={`${inputClass('newPass')} pr-12`}
                      placeholder="Nueva contraseña"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      onFocus={() => setFocusedField('newPass')}
                      onBlur={() => setFocusedField(null)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#1C75BB] transition-colors p-1 hover:bg-slate-100 rounded-lg"
                    >
                      {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-[#111111]">Confirmar contraseña</label>
                  <div className="relative group">
                    <div className={`absolute inset-0 bg-gradient-to-r from-[#00AEEF] to-[#1C75BB] rounded-xl blur-md opacity-0 group-hover:opacity-20 transition-opacity ${focusedField === 'confirmPass' ? 'opacity-30' : ''}`}></div>
                    <input
                      type="password"
                      required
                      className={inputClass('confirmPass')}
                      placeholder="Repetí la contraseña"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      onFocus={() => setFocusedField('confirmPass')}
                      onBlur={() => setFocusedField(null)}
                    />
                    <KeyRound size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="relative w-full bg-gradient-to-r from-[#00AEEF] via-[#1C75BB] to-[#00AEEF] text-white font-bold py-4 rounded-xl shadow-xl hover:shadow-[#00AEEF]/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group overflow-hidden"
                  style={{ backgroundSize: '200% 100%' }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  {isLoading
                    ? <Loader2 className="animate-spin relative z-10" size={22} />
                    : <><span className="relative z-10">Restablecer clave</span><ArrowRight size={20} className="group-hover:translate-x-1 transition-transform relative z-10" /></>
                  }
                </button>
              </form>
            )}
          </div>
        </div>

        <button
          onClick={onBack}
          className="mt-8 w-full text-slate-700 hover:text-[#111111] transition-colors text-sm font-semibold flex items-center justify-center gap-2 py-3 rounded-xl hover:bg-white/50 backdrop-blur-sm"
        >
          ← Volver al sitio web
        </button>
      </div>
    </div>
  );
};
