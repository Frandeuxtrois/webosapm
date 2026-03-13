import React from 'react';
import { SERVICES } from '../constants';

export const Services: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {SERVICES.map((service) => (
            <div key={service.id} className="group p-6 rounded-2xl border border-gray-100 hover:border-celeste/30 hover:shadow-xl transition-all duration-300 bg-white">
              <div className="mb-4 p-3 bg-celeste/10 rounded-xl w-fit group-hover:bg-celeste group-hover:text-white transition-colors duration-300">
                {/* Clone element to change color on hover if needed, or rely on text color inheritance */}
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