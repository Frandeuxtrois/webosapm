import React from 'react';
import { PROCEDURES } from '../constants';
import { ChevronRight } from 'lucide-react';

export const Procedures: React.FC = () => {
  return (
    <section id="tramites" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div>
             <h2 className="text-3xl font-bold text-oscuro mb-2">Trámites Frecuentes</h2>
             <p className="text-gray-600">Resolvé tus gestiones de manera online, rápida y segura.</p>
          </div>
          <a href="#" className="hidden md:flex items-center text-celeste font-semibold hover:text-azul transition-colors mt-4 md:mt-0">
            Ver todos los trámites <ChevronRight className="ml-1 h-5 w-5" />
          </a>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PROCEDURES.map((proc) => (
            <a 
              key={proc.id} 
              href={proc.href}
              className="group bg-white p-6 rounded-xl shadow-sm hover:shadow-md border border-gray-100 hover:border-celeste transition-all duration-200 flex items-center justify-between"
            >
              <span className="font-medium text-oscuro group-hover:text-azul">{proc.title}</span>
              <div className="bg-gray-50 p-2 rounded-full group-hover:bg-celeste group-hover:text-white transition-colors">
                 <ChevronRight className="h-4 w-4" />
              </div>
            </a>
          ))}
        </div>
        
        <div className="mt-8 text-center md:hidden">
             <a href="#" className="inline-flex items-center text-celeste font-semibold hover:text-azul transition-colors">
            Ver todos los trámites <ChevronRight className="ml-1 h-5 w-5" />
          </a>
        </div>
      </div>
    </section>
  );
};