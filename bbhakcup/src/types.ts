import React from 'react';

export interface UserDecoded {
  dni: string;
  afiliadoId: string;
  planId: string;
  seccionalId: string;
  nombre: string;
  planNombre: string;
  exp: number;
}

export interface NavGroup {
  label: string;
  items?: { label: string; href: string }[];
  href?: string;
}

export interface Plan {
  id: string;
  name: string;
  description: string;
  features: string[];
  recommended?: boolean;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export interface Procedure {
  id: string;
  title: string;
  href: string;
}