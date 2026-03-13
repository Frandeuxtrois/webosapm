import React from 'react';
import { Shield, Users, Building } from 'lucide-react';

export const Institutional: React.FC = () => {
  return (
    <section id="institucional" className="py-20 bg-oscuro text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-celeste">
              Más de 70 años cuidando lo más importante
            </h2>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Somos una Obra Social comprometida con la excelencia médica y la calidez humana.
              Nuestra misión es brindar acceso a la salud de calidad a miles de familias,
              innovando constantemente en nuestros servicios y atención.
            </p>
            <p className="text-gray-300 mb-8 leading-relaxed">
              Contamos con convenios en las instituciones más prestigiosas del país y una red
              de profesionales de primer nivel.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10">
              <Users className="w-10 h-10 text-celeste mx-auto mb-4" />
              <div className="text-3xl font-bold mb-1">+6k</div>
              <div className="text-sm text-gray-400">Afiliados</div>
            </div>
            <div className="text-center p-6 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10">
              <Building className="w-10 h-10 text-celeste mx-auto mb-4" />
              <div className="text-3xl font-bold mb-1">+1</div>
              <div className="text-sm text-gray-400">Centros Médicos</div>
            </div>
            <div className="text-center p-6 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10">
              <Shield className="w-10 h-10 text-celeste mx-auto mb-4" />
              <div className="text-3xl font-bold mb-1">100%</div>
              <div className="text-sm text-gray-400">Compromiso</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};