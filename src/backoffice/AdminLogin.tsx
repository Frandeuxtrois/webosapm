import React, { useState } from 'react';
import { Lock, User, Loader2, ShieldAlert } from 'lucide-react';
import headerLogo from '../assets/headerlogo.png';

interface AdminLoginProps {
    onLoginSuccess: () => void;
    onBack: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onBack }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({ user: '', pass: '' });
    const [error, setError] = useState("");

    const handleAdminLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        // SIMULACIÓN DE LOGIN (Cambiá 'admin' por lo que quieras)
        setTimeout(() => {
            if (formData.user === 'admin' && formData.pass === 'osapm2024') {
                localStorage.setItem('admin_token', 'secret-admin-session');
                onLoginSuccess(); // <--- ESTO LE AVISA A APP.TSX
            } else {
                setError("Usuario o clave de administrador incorrectos");
            }
            setIsLoading(false);
        }, 1000);
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#0f172a] p-6 font-sans">
            <div className="w-full max-w-[400px] space-y-8">
                <div className="text-center">
                    <img src={headerLogo} alt="Logo" className="h-12 mx-auto mb-6 brightness-0 invert" />
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full text-red-400 mb-4">
                        <ShieldAlert size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Acceso Administrativo</span>
                    </div>
                </div>

                <div className="bg-slate-900 rounded-[2.5rem] p-10 shadow-2xl border border-slate-800">
                    {error && <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 text-red-400 text-xs rounded-xl text-center font-bold uppercase tracking-tight">{error}</div>}

                    <form onSubmit={handleAdminLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Usuario</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                                <input
                                    type="text" required
                                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white font-bold outline-none focus:border-[#00AEEF] transition-all"
                                    placeholder="admin"
                                    value={formData.user}
                                    onChange={e => setFormData({ ...formData, user: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Contraseña</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                                <input
                                    type="password" required
                                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white font-bold outline-none focus:border-[#00AEEF] transition-all"
                                    placeholder="••••••••"
                                    value={formData.pass}
                                    onChange={e => setFormData({ ...formData, pass: e.target.value })}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#1C75BB] text-white font-black py-4 rounded-2xl shadow-xl hover:bg-[#00AEEF] transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-2"
                        >
                            {isLoading ? <Loader2 className="animate-spin" /> : 'Entrar al Panel'}
                        </button>
                    </form>
                </div>

                <button onClick={onBack} className="w-full text-center text-slate-500 hover:text-white font-bold uppercase text-[10px] tracking-widest transition-colors">
                    ← Volver a la web pública
                </button>
            </div>
        </div>
    );
};