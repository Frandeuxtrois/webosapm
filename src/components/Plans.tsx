import React, { useState } from 'react';
import { PLANS } from '../constants';
import { Check, ArrowRight, X } from 'lucide-react';
import { Plan } from '../types';

export const Plans: React.FC<{ onPlanClick?: () => void }> = ({ onPlanClick }) => {
  const [selected, setSelected] = useState<Plan | null>(null);

  return (
    <section id="planes" className="py-24 bg-gray-50 scroll-mt-16 relative overflow-hidden">
      <img
        src="/biglogo.png"
        alt=""
        aria-hidden="true"
        className="absolute -right-16 -bottom-20 w-[580px] opacity-40 pointer-events-none select-none"
        style={{ transform: 'rotate(12deg)' }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-oscuro mb-4">Planes diseñados para vos</h2>
          <p className="text-gray-600 text-lg">
            Elegí la cobertura que mejor se adapta a tus necesidades y a tu presupuesto.
            Sin letra chica, con total transparencia.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-start">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              onClick={() => setSelected(plan)}
              className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl hover:-translate-y-2 hover:ring-2 hover:ring-celeste transition-all duration-300 flex flex-col overflow-hidden cursor-pointer"
            >
              <div className="p-8 flex-grow">
                <h3 className="text-2xl font-bold text-azul mb-6 group-hover:text-celeste transition-colors duration-300">{plan.name}</h3>

                <ul className="space-y-4">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <Check className="h-5 w-5 text-celeste shrink-0 mt-0.5" />
                      <span className="ml-3 text-gray-700 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="px-8 pb-8">
                <div className="flex items-center gap-2 text-celeste font-bold text-sm group-hover:gap-3 transition-all duration-200">
                  Ver detalle del plan <ArrowRight size={15} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* OVERLAY */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-8 pt-8 pb-4 border-b border-gray-100 flex-shrink-0">
              <div>
                <h2 className="text-2xl font-black text-azul">{selected.name}</h2>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="p-2 rounded-xl hover:bg-slate-100 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
              >
                <X size={20} />
              </button>
            </div>

            {/* Contenido scrolleable */}
            <div className="overflow-y-auto px-8 py-6 space-y-6 flex-1">

              {/* Cobertura */}
              {selected.cobertura && (
                <div>
                  <p className="text-[11px] font-black uppercase tracking-widest text-[#1C75BB] mb-3 border-l-4 border-celeste pl-3">
                    100% de cobertura con prestadores contratados
                  </p>
                  <ul className="space-y-2.5">
                    {selected.cobertura.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Check size={15} className="text-celeste shrink-0 mt-0.5" />
                        <span className="text-gray-700 text-sm leading-snug">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Beneficios */}
              {selected.beneficios && (
                <div>
                  <p className="text-[11px] font-black uppercase tracking-widest text-[#1C75BB] mb-3 border-l-4 border-celeste pl-3">
                    Entre otros beneficios
                  </p>
                  <ul className="space-y-2.5">
                    {selected.beneficios.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Check size={15} className="text-celeste shrink-0 mt-0.5" />
                        <span className="text-gray-700 text-sm leading-snug">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Footer */}
            {!selected.recommended && (
              <div className="px-8 py-5 border-t border-gray-100 flex-shrink-0">
                <button
                  onClick={() => { setSelected(null); onPlanClick?.(); }}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-[#1C75BB] text-white font-black text-sm uppercase tracking-wider rounded-2xl hover:bg-[#00AEEF] transition-colors shadow-lg"
                >
                  Me interesa este plan <ArrowRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
