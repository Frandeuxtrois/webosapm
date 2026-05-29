import React from 'react';
import { Stethoscope } from 'lucide-react';
import { Cartilla } from '../portalAfiliado/Cartilla';

export const CartillaPublica: React.FC = () => (
    <section className="pt-20 min-h-screen bg-slate-50 font-sans animate-in fade-in duration-500">

        <div className="bg-[#1C75BB] px-6 md:px-12 py-10">
            <div className="flex flex-col items-center text-center gap-3">
                <div className="p-3 bg-white/10 rounded-2xl">
                    <Stethoscope size={28} className="text-[#00AEEF]" />
                </div>
                <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-white leading-none">
                    Cartilla <span className="text-[#00AEEF]">Médica</span>
                </h1>
                <p className="text-white/60 text-sm font-bold uppercase tracking-widest">Buscador oficial de prestadores OSAPM</p>
            </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-12">
            <Cartilla />
        </div>


    </section>
);
