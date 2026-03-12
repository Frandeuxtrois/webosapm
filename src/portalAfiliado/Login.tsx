import React, { useState } from 'react';
import { Eye, EyeOff, ArrowRight, Loader2, Lock } from 'lucide-react';
import { useAuth } from '../context/authContext'; // Importamos el contexto

// Importación de las imágenes
import loginLogo from '../assets/login-logo.png';

interface LoginProps {
  onBack: () => void;
  onLoginSuccess: () => void;
}

export const Login: React.FC<LoginProps> = ({ onBack, onLoginSuccess }) => {
  const { login } = useAuth(); // <--- Usamos la función del cerebro global
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    dni: '',
    password: ''
  });

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
      // LLAMAMOS AL LOGIN DEL CONTEXTO (Sincronizado)
      const res = await login(formData.dni, formData.password);

      if (res.ok) {
        onLoginSuccess();
      } else {
        setError(res.data.message || res.data.error || 'Credenciales incorrectas');
      }
    } catch (err: any) {
      setError("Error de conexión con el servidor");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 via-cyan-50 to-slate-100 relative overflow-hidden">

      {/* Elementos decorativos con colores OSAPM */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-72 h-72 bg-[#00AEEF]/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-[#1C75BB]/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00AEEF]/10 rounded-full blur-3xl"></div>

        {/* Patrón de puntos sutil */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: 'radial-gradient(circle, #1C75BB 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }}></div>
      </div>

      <div className="w-full max-w-md relative z-10">

        {/* Header con más presencia */}
        <div className="text-center mb-8 space-y-4">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-br from-[#00AEEF] to-[#1C75BB] rounded-3xl blur-xl opacity-40 animate-pulse"></div>
            <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white shadow-2xl shadow-[#00AEEF]/20 border-4 border-slate-50">
              <img src={loginLogo} alt="OSAPM" className="h-12 w-auto object-contain" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#00AEEF] to-[#1C75BB] bg-clip-text text-transparent mb-2">Portal Afiliado</h1>
            <p className="text-sm text-slate-600 font-medium">Obra Social Agentes de Propaganda Médica</p>
          </div>
        </div>

        {/* Card de login */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-[#00AEEF] via-[#1C75BB] to-[#00AEEF] rounded-3xl blur-sm opacity-30"></div>
          <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl shadow-[#00AEEF]/20 p-8 border border-white/60">

            {error && (
              <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 text-red-700 text-sm rounded-2xl flex items-start gap-3 shadow-lg">
                <span className="text-xl">⚠️</span>
                <div>
                  <p className="font-semibold mb-1">Error de autenticación</p>
                  <p className="text-xs opacity-90">{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-[#111111]">Documento Nacional de Identidad</label>
                <div className="relative group">
                  <div className={`absolute inset-0 bg-gradient-to-r from-[#00AEEF] to-[#1C75BB] rounded-xl blur-md opacity-0 group-hover:opacity-20 transition-opacity ${focusedField === 'dni' ? 'opacity-30' : ''}`}></div>
                  <input
                    type="text"
                    inputMode="numeric"
                    required
                    className={`relative w-full bg-gradient-to-br from-slate-50 to-[#00AEEF]/5 border-2 rounded-xl py-4 px-5 transition-all outline-none text-[#111111] font-medium placeholder:text-slate-400 ${focusedField === 'dni' ? 'border-[#00AEEF] bg-white shadow-lg shadow-[#00AEEF]/10 scale-[1.02]' : 'border-slate-200 hover:border-[#00AEEF]/50'}`}
                    placeholder="Ingresá tu DNI sin puntos"
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

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-[#111111]">Contraseña</label>
                  <button type="button" className="text-xs text-[#1C75BB] hover:text-[#00AEEF] font-semibold hover:underline flex items-center gap-1"><Lock size={12} />¿Olvidaste tu clave?</button>
                </div>
                <div className="relative group">
                  <div className={`absolute inset-0 bg-gradient-to-r from-[#1C75BB] to-[#00AEEF] rounded-xl blur-md opacity-0 group-hover:opacity-20 transition-opacity ${focusedField === 'password' ? 'opacity-30' : ''}`}></div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    className={`relative w-full bg-gradient-to-br from-slate-50 to-[#1C75BB]/5 border-2 rounded-xl py-4 px-5 pr-12 transition-all outline-none text-[#111111] font-medium placeholder:text-slate-400 ${focusedField === 'password' ? 'border-[#1C75BB] bg-white shadow-lg shadow-[#1C75BB]/10 scale-[1.02]' : 'border-slate-200 hover:border-[#1C75BB]/50'}`}
                    placeholder="Ingresá tu contraseña"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#1C75BB] transition-colors p-1 hover:bg-slate-100 rounded-lg">{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}</button>
                </div>
                {formData.password && (
                  <div className="flex gap-1 mt-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-all ${formData.password.length >= i * 2 ? formData.password.length >= 8 ? 'bg-green-500' : formData.password.length >= 6 ? 'bg-[#00AEEF]' : 'bg-red-500' : 'bg-slate-200'}`}></div>
                    ))}
                  </div>
                )}
              </div>

              <button type="submit" disabled={isLoading} className="relative w-full bg-gradient-to-r from-[#00AEEF] via-[#1C75BB] to-[#00AEEF] text-white font-bold py-4 rounded-xl shadow-xl hover:shadow-[#00AEEF]/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group mt-8 overflow-hidden" style={{ backgroundSize: '200% 100%' }}>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                {isLoading ? <Loader2 className="animate-spin relative z-10" size={22} /> : <><span className="relative z-10">Iniciar Sesión</span><ArrowRight size={20} className="group-hover:translate-x-1 transition-transform relative z-10" /></>}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t-2 border-slate-100 text-center">
              <p className="text-sm text-slate-600 mb-3">¿No tenés cuenta en nuestro portal?</p>
              <button className="inline-flex items-center gap-2 text-[#1C75BB] font-bold hover:text-[#00AEEF] transition-colors px-4 py-2 rounded-lg hover:bg-[#00AEEF]/5"><span>Registrate ahora</span><ArrowRight size={16} /></button>
            </div>
          </div>
        </div>
        <button onClick={(e) => { e.preventDefault(); onBack(); }} className="mt-8 w-full text-slate-700 hover:text-[#111111] transition-colors text-sm font-semibold flex items-center justify-center gap-2 py-3 rounded-xl hover:bg-white/50 backdrop-blur-sm">← Volver al sitio web</button>
      </div>
    </div>
  );
};