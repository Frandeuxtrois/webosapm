import React, { useState } from 'react';
import { KeyRound, Eye, EyeOff, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import { apiService } from '../../services/api';

interface CambiarClaveProps {
    onSessionExpired: () => void;
}

export const CambiarClave: React.FC<CambiarClaveProps> = ({ onSessionExpired }) => {
    const [form, setForm] = useState({ claveActual: '', nuevaClave: '', confirmar: '' });
    const [show, setShow] = useState({ actual: false, nueva: false, confirmar: false });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (form.nuevaClave !== form.confirmar) {
            setError('La nueva contraseña y la confirmación no coinciden.');
            return;
        }
        if (form.nuevaClave.length < 6) {
            setError('La nueva contraseña debe tener al menos 6 caracteres.');
            return;
        }
        setLoading(true);
        setError(null);
        try {
            await apiService.cambiarClavePrestador(form.claveActual, form.nuevaClave);
            setSuccess(true);
            setForm({ claveActual: '', nuevaClave: '', confirmar: '' });
        } catch (err: any) {
            if (err.message === 'SESSION_EXPIRED') { onSessionExpired(); return; }
            if (err.message === '400') {
                setError('La contraseña actual es incorrecta.');
            } else {
                setError('Error al cambiar la contraseña. Intentá de nuevo.');
            }
        } finally {
            setLoading(false);
        }
    };

    const inputClass = "w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 pr-12 font-medium outline-none focus:border-[#00AEEF] transition-colors text-[#111111] text-sm";

    const ToggleBtn = ({ field }: { field: keyof typeof show }) => (
        <button
            type="button"
            onClick={() => setShow(prev => ({ ...prev, [field]: !prev[field] }))}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#1C75BB] transition-colors"
        >
            {show[field] ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
    );

    return (
        <div className="max-w-md">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                <h2 className="text-xl font-black mb-1 flex items-center gap-3 uppercase tracking-tighter text-[#1C75BB]">
                    <span className="w-1.5 h-6 bg-[#00AEEF] rounded-full"></span>
                    Cambiar contraseña
                </h2>
                <p className="text-xs text-gray-400 font-medium mb-8">
                    Ingresá tu contraseña actual y luego la nueva.
                </p>

                {success ? (
                    <div className="flex flex-col items-center text-center py-6 gap-4">
                        <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center">
                            <CheckCircle2 size={28} className="text-green-600" />
                        </div>
                        <div>
                            <p className="font-black text-[#1C75BB] uppercase tracking-tight">¡Contraseña actualizada!</p>
                            <p className="text-xs text-gray-400 mt-1">Tu contraseña fue cambiada correctamente.</p>
                        </div>
                        <button
                            onClick={() => setSuccess(false)}
                            className="text-xs text-[#00AEEF] font-black uppercase tracking-widest hover:underline"
                        >
                            Cambiar de nuevo
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-xs font-black text-[#1C75BB] uppercase tracking-wider mb-2">
                                Contraseña actual
                            </label>
                            <div className="relative">
                                <input
                                    type={show.actual ? 'text' : 'password'}
                                    name="claveActual"
                                    value={form.claveActual}
                                    onChange={handleChange}
                                    className={inputClass}
                                    placeholder="••••••••"
                                    required
                                />
                                <ToggleBtn field="actual" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-black text-[#1C75BB] uppercase tracking-wider mb-2">
                                Nueva contraseña
                            </label>
                            <div className="relative">
                                <input
                                    type={show.nueva ? 'text' : 'password'}
                                    name="nuevaClave"
                                    value={form.nuevaClave}
                                    onChange={handleChange}
                                    className={inputClass}
                                    placeholder="••••••••"
                                    required
                                />
                                <ToggleBtn field="nueva" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-black text-[#1C75BB] uppercase tracking-wider mb-2">
                                Confirmar nueva contraseña
                            </label>
                            <div className="relative">
                                <input
                                    type={show.confirmar ? 'text' : 'password'}
                                    name="confirmar"
                                    value={form.confirmar}
                                    onChange={handleChange}
                                    className={inputClass}
                                    placeholder="••••••••"
                                    required
                                />
                                <ToggleBtn field="confirmar" />
                            </div>
                        </div>

                        {error && (
                            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 font-semibold text-sm">
                                <AlertTriangle size={16} className="flex-shrink-0" />
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading || !form.claveActual || !form.nuevaClave || !form.confirmar}
                            className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#00AEEF] text-white font-black text-sm uppercase tracking-wider rounded-xl shadow-lg hover:bg-[#1C75BB] transition-colors disabled:opacity-50"
                        >
                            {loading ? <Loader2 size={16} className="animate-spin" /> : <KeyRound size={16} />}
                            {loading ? 'Guardando...' : 'Cambiar contraseña'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};
