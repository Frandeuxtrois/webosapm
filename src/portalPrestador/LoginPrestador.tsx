import React, { useState } from 'react';
import { Eye, EyeOff, ArrowRight, Loader2, Lock, Mail, KeyRound } from 'lucide-react';
import { apiService } from '../services/api';
import loginLogo from '../assets/login-logo.png';

interface LoginPrestadorProps {
  onLoginSuccess: () => void;
  onBack: () => void;
}

type Step = 'login' | 'olvide' | 'reset' | 'solicitar';

export const LoginPrestador: React.FC<LoginPrestadorProps> = ({ onLoginSuccess, onBack }) => {
  const [step, setStep] = useState<Step>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const [cuit, setCuit] = useState('');
  const [password, setPassword] = useState('');

  const [olvideEmail, setOlvideEmail] = useState('');
  const [olvideCuit, setOlvideCuit] = useState('');

  const [resetCuit, setResetCuit] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [solicitarCuit, setSolicitarCuit] = useState('');
  const [solicitarEmail, setSolicitarEmail] = useState('');
  const [solicitarResult, setSolicitarResult] = useState<{ estado: string; mensaje: string } | null>(null);

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

  const handleSolicitar = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSolicitarResult(null);
    try {
      const res = await apiService.solicitarAccesoPrestador(solicitarCuit.replace(/\D/g, ''), solicitarEmail.trim());
      setSolicitarResult(res);
    } catch {
      setError('Error de conexión con el servidor');
    } finally {
      setIsLoading(false);
    }
  };

  const inputCls = (field: string) =>
    `w-full bg-slate-50 border-2 rounded-xl py-3.5 px-4 transition-all outline-none text-[#111111] font-medium placeholder:text-slate-400 text-sm ${
      focusedField === field ? 'border-[#00AEEF] bg-white' : 'border-slate-200 hover:border-slate-300'
    }`;

  const errorBanner = error && (
    <div className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl flex items-start gap-2.5 font-medium">
      <span className="shrink-0">⚠️</span>
      <span>{error}</span>
    </div>
  );

  const leftPanel = (
    <div className="hidden lg:flex flex-col justify-between bg-[#1C75BB] p-12 relative overflow-hidden">
      <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/5 rounded-full" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#00AEEF]/15 rounded-full" />
      <div className="absolute top-1/2 right-12 w-24 h-24 bg-white/5 rounded-full -translate-y-1/2" />

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-16">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-xl">
            <img src={loginLogo} alt="OSAPM" className="h-8 w-auto object-contain" />
          </div>
          <p className="text-white font-semibold text-sm leading-snug max-w-[160px]">
            Obra Social de Agentes de Propaganda Médica
          </p>
        </div>

        <h2 className="text-[2.75rem] font-black text-white leading-[1.1] mb-5">
          Portal<br /><span className="text-[#00AEEF]">Prestadores</span>
        </h2>
        <p className="text-white/60 text-sm font-medium leading-relaxed max-w-xs">
          Gestioná todo acá.
        </p>
      </div>

      <div />
    </div>
  );

  const mobileLogo = (
    <p className="lg:hidden text-[#1C75BB] font-black text-sm mb-8 leading-snug">
      Obra Social de Agentes de Propaganda Médica
    </p>
  );

  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-[70%_30%]">
      {leftPanel}
      <div className="flex flex-col justify-center min-h-screen bg-white px-6 lg:px-10 py-12">
        {mobileLogo}
        <div className="w-full max-w-sm mx-auto">

          {step === 'login' && (
            <>
              <div className="mb-8 text-center">
                <img src={loginLogo} alt="OSAPM" className="h-20 w-auto object-contain mb-5 mx-auto" />
                <h1 className="text-2xl font-black text-[#1C75BB] mb-1">Bienvenido</h1>
                <p className="text-sm text-slate-500 font-medium">Ingresá con tu CUIT y contraseña</p>
              </div>

              {errorBanner}

              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-[#111111]">CUIT</label>
                  <input
                    type="text" inputMode="numeric" required
                    className={inputCls('cuit')}
                    placeholder="20-12345678-9"
                    value={cuit}
                    onChange={(e) => setCuit(formatCuit(e.target.value))}
                    onFocus={() => setFocusedField('cuit')}
                    onBlur={() => setFocusedField(null)}
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-semibold text-[#111111]">Contraseña</label>
                    <button type="button" onClick={() => { setStep('olvide'); setError(null); setOlvideCuit(cuit); }}
                      className="text-xs text-[#1C75BB] hover:text-[#00AEEF] font-semibold hover:underline flex items-center gap-1 transition-colors">
                      <Lock size={11} />¿Olvidaste tu clave?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'} required
                      className={`${inputCls('password')} pr-11`}
                      placeholder="Ingresá tu contraseña"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField(null)}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#1C75BB] transition-colors">
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <button type="submit" disabled={isLoading}
                  className="w-full bg-[#1C75BB] hover:bg-[#1565a8] text-white font-bold py-3.5 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm mt-2 group">
                  {isLoading
                    ? <Loader2 className="animate-spin" size={18} />
                    : <><span>Iniciar Sesión</span><ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" /></>
                  }
                </button>
              </form>

              <div className="mt-6 pt-5 border-t border-slate-100 text-center">
                <p className="text-xs text-slate-500 mb-2">¿Sos prestador y todavía no tenés cuenta?</p>
                <button onClick={() => { setStep('solicitar'); setError(null); setSolicitarResult(null); setSolicitarCuit(cuit); }}
                  className="text-sm text-[#1C75BB] hover:text-[#00AEEF] font-bold hover:underline transition-colors">
                  Solicitar acceso al portal
                </button>
              </div>

              <button onClick={onBack}
                className="mt-6 w-full text-center text-sm text-slate-400 hover:text-slate-600 font-semibold transition-colors">
                ← Volver al sitio web
              </button>
            </>
          )}

          {step === 'olvide' && (
            <>
              <div className="mb-8">
                <h1 className="text-2xl font-black text-[#1C75BB] mb-1">Recuperar contraseña</h1>
                <p className="text-sm text-slate-500 font-medium">Ingresá tu CUIT y email registrado</p>
              </div>

              {errorBanner}

              <form onSubmit={handleOlvideClave} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-[#111111]">CUIT</label>
                  <input
                    type="text" inputMode="numeric" required
                    className={inputCls('olvideCuit')}
                    placeholder="20-12345678-9"
                    value={olvideCuit}
                    onChange={(e) => setOlvideCuit(formatCuit(e.target.value))}
                    onFocus={() => setFocusedField('olvideCuit')}
                    onBlur={() => setFocusedField(null)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-[#111111]">Email registrado</label>
                  <div className="relative">
                    <input
                      type="email" required
                      className={`${inputCls('olvideEmail')} pr-11`}
                      placeholder="tu@email.com"
                      value={olvideEmail}
                      onChange={(e) => setOlvideEmail(e.target.value)}
                      onFocus={() => setFocusedField('olvideEmail')}
                      onBlur={() => setFocusedField(null)}
                    />
                    <Mail size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                <button type="submit" disabled={isLoading}
                  className="w-full bg-[#1C75BB] hover:bg-[#1565a8] text-white font-bold py-3.5 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm">
                  {isLoading
                    ? <Loader2 className="animate-spin" size={18} />
                    : <><span>Enviar código</span><ArrowRight size={16} /></>
                  }
                </button>
              </form>

              <button onClick={() => { setStep('login'); setError(null); }}
                className="mt-6 text-sm text-slate-400 hover:text-slate-600 font-semibold flex items-center gap-1.5 transition-colors">
                ← Volver al inicio de sesión
              </button>
            </>
          )}

          {step === 'reset' && (
            <>
              <div className="mb-8">
                <h1 className="text-2xl font-black text-[#1C75BB] mb-1">Nueva contraseña</h1>
                <p className="text-sm text-slate-500 font-medium">Ingresá el código que recibiste por email</p>
              </div>

              {errorBanner}

              <form onSubmit={handleReset} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-[#111111]">Código OTP</label>
                  <input
                    type="text" inputMode="numeric" required maxLength={6}
                    className={`${inputCls('otp')} text-center tracking-[0.5em]`}
                    placeholder="• • • • • •"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    onFocus={() => setFocusedField('otp')}
                    onBlur={() => setFocusedField(null)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-[#111111]">Nueva contraseña</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'} required
                      className={`${inputCls('newPass')} pr-11`}
                      placeholder="Mínimo 8 caracteres"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      onFocus={() => setFocusedField('newPass')}
                      onBlur={() => setFocusedField(null)}
                    />
                    <button type="button" onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#1C75BB] transition-colors">
                      {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-[#111111]">Confirmar contraseña</label>
                  <div className="relative">
                    <input
                      type="password" required
                      className={`${inputCls('confirmPass')} pr-11`}
                      placeholder="Repetí la contraseña"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      onFocus={() => setFocusedField('confirmPass')}
                      onBlur={() => setFocusedField(null)}
                    />
                    <KeyRound size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                <button type="submit" disabled={isLoading || otp.length < 6 || !newPassword || !confirmPassword}
                  className="w-full bg-[#1C75BB] hover:bg-[#1565a8] text-white font-bold py-3.5 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm">
                  {isLoading
                    ? <Loader2 className="animate-spin" size={18} />
                    : <><span>Cambiar contraseña</span><ArrowRight size={16} /></>
                  }
                </button>
              </form>

              <button onClick={() => { setStep('olvide'); setError(null); }}
                className="mt-6 text-sm text-slate-400 hover:text-slate-600 font-semibold flex items-center gap-1.5 transition-colors">
                ← Volver
              </button>
            </>
          )}

          {step === 'solicitar' && (
            <>
              <div className="mb-8">
                <h1 className="text-2xl font-black text-[#1C75BB] mb-1">Solicitar acceso</h1>
                <p className="text-sm text-slate-500 font-medium">Ingresá tu CUIT y un email de contacto. Verificaremos tu condición de prestador y te contactaremos.</p>
              </div>

              {errorBanner}

              {solicitarResult ? (
                <div className="space-y-5">
                  <div className={`p-4 rounded-xl text-sm font-medium border ${
                    solicitarResult.estado === 'OK'
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : solicitarResult.estado === 'NO_ACTIVO'
                        ? 'bg-red-50 border-red-200 text-red-700'
                        : 'bg-sky-50 border-sky-200 text-sky-800'
                  }`}>
                    {solicitarResult.mensaje}
                  </div>
                  <button onClick={() => { setStep('login'); setError(null); setSolicitarResult(null); }}
                    className="w-full bg-[#1C75BB] hover:bg-[#1565a8] text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 text-sm">
                    Volver al inicio de sesión
                  </button>
                </div>
              ) : (
                <>
                  <form onSubmit={handleSolicitar} className="space-y-5">
                    <div className="space-y-1.5">
                      <label className="block text-sm font-semibold text-[#111111]">CUIT</label>
                      <input
                        type="text" inputMode="numeric" required
                        className={inputCls('solicitarCuit')}
                        placeholder="20-12345678-9"
                        value={solicitarCuit}
                        onChange={(e) => setSolicitarCuit(formatCuit(e.target.value))}
                        onFocus={() => setFocusedField('solicitarCuit')}
                        onBlur={() => setFocusedField(null)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-sm font-semibold text-[#111111]">Email de contacto</label>
                      <div className="relative">
                        <input
                          type="email" required
                          className={`${inputCls('solicitarEmail')} pr-11`}
                          placeholder="tu@email.com"
                          value={solicitarEmail}
                          onChange={(e) => setSolicitarEmail(e.target.value)}
                          onFocus={() => setFocusedField('solicitarEmail')}
                          onBlur={() => setFocusedField(null)}
                        />
                        <Mail size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                    <button type="submit" disabled={isLoading || solicitarCuit.replace(/\D/g, '').length !== 11 || !solicitarEmail}
                      className="w-full bg-[#1C75BB] hover:bg-[#1565a8] text-white font-bold py-3.5 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm">
                      {isLoading
                        ? <Loader2 className="animate-spin" size={18} />
                        : <><span>Enviar solicitud</span><ArrowRight size={16} /></>
                      }
                    </button>
                  </form>

                  <button onClick={() => { setStep('login'); setError(null); }}
                    className="mt-6 text-sm text-slate-400 hover:text-slate-600 font-semibold flex items-center gap-1.5 transition-colors">
                    ← Volver al inicio de sesión
                  </button>
                </>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  );
};
