import React from 'react';
import { SERVICES } from '../constants';

interface ServicesProps {
    onCartillaClick?: () => void;
}

export const Services: React.FC<ServicesProps> = ({ onCartillaClick }) => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {SERVICES.map((service) => (
            <div
              key={service.id}
              onClick={service.id === 'cartilla' ? onCartillaClick : undefined}
              className={`group p-6 rounded-2xl border border-gray-100 hover:border-celeste/30 hover:shadow-xl transition-all duration-300 bg-white ${service.id === 'cartilla' ? 'cursor-pointer' : ''}`}
            >
              <div className="mb-4 p-3 bg-celeste/10 rounded-xl w-fit group-hover:bg-celeste group-hover:text-white transition-colors duration-300">
                <div className="group-hover:text-white transition-colors duration-300">
                    {service.icon}
                </div>
              </div>
              <h3 className="text-xl font-bold text-oscuro mb-3 group-hover:text-azul transition-colors">{service.title}</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};