import React from 'react';
import { RefreshCw, Download } from 'lucide-react';
import headerLogo from '../assets/headerlogo.png';

interface CredencialData {
    nombreCompleto: string;
    nroCarnet: string;
    documento: number;
    planNombre: string;
    fechaVencimiento: string;
    gravado: string;
}

interface CredencialProps {
    data: CredencialData[];
    token: string;
    loading: boolean;
    onRefresh: () => void;
}

export const Credencial: React.FC<CredencialProps> = ({ data, token, loading, onRefresh }) => {
    return (
        <div className="flex flex-col items-center gap-6 py-4 animate-in fade-in duration-500 font-sans">

            {/* BOTÓN ACTUALIZAR */}
            <div className="w-full max-w-[600px] flex justify-end">
                <button
                    onClick={onRefresh}
                    className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg font-bold text-gray-400 hover:text-[#00AEEF] transition-all text-[9px] uppercase tracking-widest shadow-sm"
                >
                    <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
                    Actualizar Token
                </button>
            </div>

            {/* LISTADO DE CREDENCIALES */}
            <div className="flex flex-col gap-8 w-full items-center">
                {data.map((item, index) => {
                    const [apellido, nombres] = item.nombreCompleto.split(',').map(s => s.trim());

                    return (
                        <div key={index} className="relative group">
                            {/* LA TARJETA */}
                            <div className="w-[600px] h-[340px] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col">

                                {/* FRANJA SUPERIOR CELESTE */}
                                <div className="h-4 bg-[#39B5E6]"></div>

                                {/* SECCIÓN BLANCA CON LOGO */}
                                <div className="bg-white h-[90px] flex items-center justify-center px-8">
                                    <img
                                        src={headerLogo}
                                        className="h-[60px] object-contain"
                                        alt="OSAPM"
                                    />
                                </div>

                                {/* LÍNEA SEPARADORA HORIZONTAL */}
                                <div className="h-[7px] bg-[#39B5E6]"></div>

                                {/* ESPACIO BLANCO */}
                                <div className="h-1 bg-white"></div>

                                {/* LÍNEA EMBELLECEDORA DELGADA */}
                                <div className="h-[1px] bg-[#39B5E6]"></div>

                                {/* SECCIÓN CELESTE CON TODOS LOS DATOS */}
                                <div className="flex-1 bg-[#39B5E6] px-8 py-6 flex justify-between items-start">

                                    {/* COLUMNA IZQUIERDA - DATOS PERSONALES */}
                                    <div className="flex-1">
                                        <div className="mb-3">
                                            <h3 className="text-[28px] font-black leading-tight uppercase text-black">
                                                {apellido},
                                            </h3>
                                            {nombres && (
                                                <h4 className="text-[24px] font-black leading-tight uppercase text-black">
                                                    {nombres}
                                                </h4>
                                            )}
                                        </div>

                                        <div className="space-y-0.5">
                                            <p className="text-[16px] font-extrabold text-black">
                                                {item.nroCarnet} D.N.I. {item.documento}
                                            </p>
                                            <p className="text-[16px] font-extrabold uppercase text-black">
                                                VENCIMIENTO: {item.fechaVencimiento}
                                            </p>
                                        </div>
                                    </div>

                                    {/* COLUMNA DERECHA - PLAN Y TOKEN */}
                                    <div className="flex flex-col justify-between items-end h-full">
                                        <div className="text-right">
                                            <p className="text-[30px] font-black leading-none uppercase text-black mb-1">
                                                {item.planNombre}
                                            </p>
                                            <p className="text-[13px] font-black uppercase text-black">
                                                {item.gravado}
                                            </p>
                                        </div>

                                        {/* TOKEN DE VALIDACIÓN */}
                                        <div className="bg-white/30 backdrop-blur-sm px-4 py-2 rounded-xl">
                                            <p className="text-[8px] font-black text-black/70 uppercase text-center mb-0.5 tracking-widest">
                                                TOKEN DE VALIDACIÓN
                                            </p>
                                            <p className="text-[26px] font-black text-black font-mono leading-none text-center">
                                                {token || '------'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* FRANJA INFERIOR CELESTE */}
                                <div className="h-2 bg-[#39B5E6]"></div>
                            </div>

                            {/* BOTÓN DESCARGAR */}
                            <button className="absolute -bottom-3 -right-3 w-12 h-12 bg-gradient-to-br from-[#00AEEF] to-[#1c75bb] text-white rounded-full flex items-center justify-center shadow-xl opacity-0 group-hover:opacity-100 transition-all hover:scale-110 z-20">
                                <Download size={18} />
                            </button>
                        </div>
                    );
                })}
            </div>

            <p className="text-gray-400 text-[8px] font-bold uppercase tracking-[0.4em] opacity-60 mt-2">
                Credencial Digital • Uso Oficial OSAPM
            </p>
        </div>
    );
};