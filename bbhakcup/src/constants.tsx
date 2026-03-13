import React from 'react';
import { NavGroup, Plan, Service, Procedure } from './types';
import { Activity, Heart, Stethoscope, FileText, Activity as EmergencyIcon } from 'lucide-react';

export const NAV_STRUCTURE: NavGroup[] = [
  { label: 'Planes', href: '#planes' },
  {
    label: 'Información',
    items: [
      { label: 'Trámites', href: '#tramites' },
      { label: 'Formulario de Afiliación', href: '#afiliacion' },
      { label: 'Formulario de Salud', href: '#salud' },
      { label: 'Formulario de Prestador', href: '#prestador' },
      { label: 'Preguntas Frecuentes', href: '#faq' },
      { label: 'Institucional', href: '#institucional' },
    ],
  },
  {
    label: 'Contacto',
    items: [
      { label: 'Seccionales', href: '#seccionales' },
      { label: 'Teléfonos Útiles', href: '#telefonos' },
      { label: 'Contacto', href: '#contacto' },
    ],
  }
];

export const PLANS: Plan[] = [
  {
    id: 'plan-1000',
    name: 'Plan 1000',
    description: 'Cobertura integral con prestadores de cartilla bajo Programa Médico Obligatorio.',
    features: [
      'Atención ambulatoria PMO con coseguros',
      'Emergencias 24 hs (Ámbito OSAPMRA)',
      'Internación Clínica y Quirúrgica al 100%',
      'Maternidad en Habitación Compartida',
      'Odontología en Centros Propios (AMBA)',
      'Descuentos hasta 70% en Cronicidad',
      'Ópticas para menores de 15 años'
    ],
    recommended: false,
  },
  {
    id: 'plan-5000APM',
    name: 'Plan 5000 APM',
    description: 'Nuestra cobertura de mayor nivel con beneficios exclusivos y red premium nacional.',
    features: [
      'Maternidad en Habitación Individual',
      'Ortodoncia sin límite de edad',
      'Cirugía Refractiva y Trasplantes',
      'Rehabilitación (RPG, Cardio, Fono)',
      'Prótesis e Implantes Odontológicos',
      'Urgencias Médicas Domiciliarias',
      'Turismo y Recreación'
    ],
    recommended: true,
  },
  {
    id: 'plan-5000',
    name: 'Plan 5000',
    description: '100% de cobertura en prestadores contratados para una protección total familiar.',
    features: [
      'Atención ambulatoria en todas las especialidades',
      'Emergencias y Urgencias Psiquiátricas 24 hs',
      'Estudios de Alta Complejidad al 100%',
      'Odontología apta para capacidades diferentes',
      'Plan Materno Infantil Integral',
      'Provisión de DIU convencional',
      'Psicología y Psicopedagogía'
    ],
    recommended: false,
  },
];

export const SERVICES: Service[] = [
  {
    id: 'cartilla',
    title: 'Cartilla Médica',
    description: 'Encontrá a tu especialista o centro médico más cercano en nuestra amplia red.',
    icon: <Stethoscope className="w-8 h-8 text-azul" />,
  },
  {
    id: 'autorizaciones',
    title: 'Autorizaciones Online',
    description: 'Gestioná tus órdenes y prácticas médicas desde la comodidad de tu casa.',
    icon: <FileText className="w-8 h-8 text-azul" />,
  },
  {
    id: 'emergencias',
    title: 'Emergencias 24hs',
    description: 'Contamos con una flota moderna para asistirte cuando más lo necesites.',
    icon: <EmergencyIcon className="w-8 h-8 text-azul" />,
  },
  {
    id: 'prevencion',
    title: 'Programas Preventivos',
    description: 'Campañas de vacunación, control de diabetes y salud materno-infantil.',
    icon: <Heart className="w-8 h-8 text-azul" />,
  },
];

export const PROCEDURES: Procedure[] = [
  { id: '1', title: 'Alta de Afiliado', href: '#' },
  { id: '2', title: 'Cambio de Plan', href: '#' },
  { id: '3', title: 'Reintegros', href: '#' },
  { id: '4', title: 'Baja de Servicio', href: '#' },
];