import React from 'react';
import { Newspaper, Clock } from 'lucide-react';

export const NovedadesCM: React.FC = () => (
    <section className="pt-20 min-h-screen bg-slate-50 font-sans animate-in fade-in duration-500">

        <div className="bg-[#1C75BB] px-6 md:px-12 py-10">
            <div className="flex flex-col items-center text-center gap-3">
                <div className="p-3 bg-white/10 rounded-2xl">
                    <Newspaper size={28} className="text-[#00AEEF]" />
                </div>
                <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-white leading-none">
                    Novedades <span className="text-[#00AEEF]">Centro Médico</span>
                </h1>
            </div>
        </div>

        <div className="flex flex-col items-center justify-center min-h-[400px] gap-5 px-6">
            <div className="w-20 h-20 bg-[#00AEEF]/10 rounded-3xl flex items-center justify-center">
                <Clock className="text-[#00AEEF]" size={36} />
            </div>
            <div className="text-center">
                <p className="text-2xl font-black uppercase tracking-tighter text-[#1C75BB] mb-2">Sección en construcción</p>
                <p className="text-gray-400 text-sm max-w-xs">Próximamente vas a poder ver todas las novedades del Centro Médico OSAPM desde acá.</p>
            </div>
        </div>

    </section>
);
