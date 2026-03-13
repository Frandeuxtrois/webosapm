import React from 'react';
import { PLANS } from '../constants';
import { Check } from 'lucide-react';
import { Button } from './ui/Button';

export const Plans: React.FC = () => {
  return (
    /* 
       Cambiamos scroll-mt-24 por scroll-mt-16 para que suba un poco más.
       Si aún ves un hilito del Hero, podés probar con scroll-mt-12.
    */
    <section id="planes" className="py-24 bg-gray-50 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
              className={`relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col overflow-hidden ${plan.recommended ? 'ring-2 ring-celeste transform md:-translate-y-4' : ''
                }`}
            >
              {plan.recommended && (
                <div className="absolute top-0 left-0 right-0 bg-celeste text-white text-center text-xs font-bold uppercase tracking-wider py-1">
                  Más elegido
                </div>
              )}

              <div className="p-8 flex-grow">
                <h3 className="text-2xl font-bold text-azul mb-2">{plan.name}</h3>
                <p className="text-gray-500 mb-6 text-sm leading-relaxed">{plan.description}</p>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <div className="flex-shrink-0">
                        <Check className="h-5 w-5 text-celeste" />
                      </div>
                      <span className="ml-3 text-gray-700 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-6 bg-gray-50 border-t border-gray-100">
                <Button
                  variant={plan.recommended ? 'primary' : 'outline'}
                  className={`w-full ${plan.recommended ? 'bg-celeste' : 'border-gray-300 text-gray-600 hover:border-celeste hover:text-white'}`}
                >
                  Ver detalle
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};