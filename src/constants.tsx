import React from 'react';
import { NavGroup, Plan, Service, Procedure } from './types';
import { Activity, Heart, Stethoscope, Activity as EmergencyIcon } from 'lucide-react';

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
    cobertura: [
      'Atención ambulatoria en todas las especialidades establecidas en el PMO con coseguros (Res SSSalud)',
      'Servicio de emergencias médicas las 24 hs. en el ámbito de cobertura de la OSAPMRA',
      'Servicio de urgencias psiquiátricas las 24 hs.',
      'Internación Clínica y Quirúrgica (al 100%) en prestadores de cartilla del ámbito de cobertura de la OSAPMRA',
      'Maternidad cobertura en habitación compartida',
      'Estudios complementarios (baja, mediana y alta complejidad)',
      'Odontología en centros odontológicos propios en AMBA, instalaciones aptas para pacientes con capacidades diferentes',
      'Urgencias Odontológicas',
      'Prótesis odontológicas aranceles preferenciales',
      'Cobertura integral Plan Materno Infantil',
      'Rehabilitación kinésica, Rehabilitación cardiovascular, fonoaudiología',
      'Trasplantes en el ámbito de cobertura de la OSAPMRA',
      'Colocación y provisión de DIU convencional',
    ],
    beneficios: [
      'Urgencias médicas domiciliarias',
      'Descuentos de hasta el 70% en medicamentos — Programa Nacional de Cronicidad',
      'Cobertura en diabetes de acuerdo a Ley Nacional de Diabetes',
      'Leche maternizada, de acuerdo a Plan Materno Infantil',
      'Psiquiatría y Psicología',
      'Internaciones Psiquiátricas',
      'Fertilidad',
      'Cobertura en ópticas para menores de 15 años',
    ],
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
    cobertura: [
      'Atención ambulatoria en todas las especialidades',
      'Servicio de emergencias médicas las 24 hs. en todo el país',
      'Servicio de urgencias Psiquiátricas las 24 hs.',
      'Internación Clínica y Quirúrgica',
      'Maternidad cobertura en habitación Individual, según disponibilidad',
      'Prestadores para internación de primer nivel en todo el País',
      'Estudios complementarios (baja, mediana y Alta Complejidad)',
      'Odontología: instalaciones aptas para pacientes con capacidades diferentes',
      'Urgencias Odontológicas',
      'Obturaciones con material estético (lámpara halógena) en todas las piezas',
      'Consultas para tratamiento de Ortodoncia sin límite de edad',
      'Cirugía refractiva',
      'Cobertura integral Plan Materno Infantil',
      'Rehabilitación kinésica, RPG, Rehabilitación cardiovascular, cardiopulmonar, fonoaudiología',
      'Trasplantes en todo el país',
      'Colocación y provisión de DIU convencional',
      'Cartilla con prestadores de primer nivel en todo el país',
    ],
    beneficios: [
      'Urgencias médicas domiciliarias',
      'Descuentos en medicamentos: Programa Nacional de Cronicidad',
      'Mayores descuentos para tratamiento de Diabetes',
      'Leche maternizada',
      'Prótesis odontológicas aranceles preferenciales',
      'Psicología y psicopedagogía',
      'Internaciones Psiquiátricas',
      'Fertilidad',
      'Ortesis',
      'Blanqueamiento dental aranceles preferenciales',
      'Implantes odontológicos',
      'Rx. Odontológicas con fotos en CD para ortodoncia',
      'Rehabilitación protética de baja y alta complejidad',
      'Composturas prótesis odontológicas en 24 hs.',
      'Turismo y recreación',
    ],
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
    cobertura: [
      'Atención ambulatoria en todas las especialidades',
      'Servicio de emergencias las 24 hs. en todo el país',
      'Servicio de urgencias Psiquiátricas las 24 hs.',
      'Internación Clínica y Quirúrgica',
      'Prestadores para internación de primer nivel en todo el País',
      'Estudios complementarios (baja, mediana y Alta complejidad)',
      'Odontología instalaciones aptas para pacientes con capacidades diferentes',
      'Urgencias odontológicas',
      'Consulta para tratamiento de ortodoncia sin límite de edad',
      'Cobertura integral Plan Materno Infantil',
      'Rehabilitación cardiovascular, RPG',
      'Trasplantes en todo el país',
      'Colocación y provisión de DIU convencional',
    ],
    beneficios: [
      'Urgencias médicas domiciliarias',
      'Descuentos en medicamentos, programa Nacional de Cronicidad y Diabetes',
      'Prótesis odontológicas aranceles preferenciales',
      'Blanqueamiento odontológico valores preferenciales',
      'Psicología y psicopedagogía',
      'Internaciones psiquiátricas',
      'Cobertura en Ortesis',
    ],
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
    id: 'emergencias',
    title: 'Emergencias 24hs',
    description: 'Contamos con un callcenter las 24hs.',
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