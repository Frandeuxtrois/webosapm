// This file simulates the service layer connecting to an external API.
// In a production environment, this would use fetch or axios.

import { Plan } from '../types';
import { PLANS } from '../constants';

const API_BASE_URL = 'https://api.obrasocial.com/v1';

export const apiService = {
  getPlans: async (): Promise<Plan[]> => {
    // Simulated API Call
    // const response = await fetch(`${API_BASE_URL}/plans`);
    // return response.json();
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(PLANS);
      }, 500);
    });
  },

  submitContactForm: async (data: { name: string; email: string; message: string }) => {
    console.log('Sending data to endpoint:', `${API_BASE_URL}/contact`, data);
    // const response = await fetch(`${API_BASE_URL}/contact`, {
    //   method: 'POST',
    //   body: JSON.stringify(data),
    //   headers: { 'Content-Type': 'application/json' }
    // });
    // return response.json();

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: 'Consulta enviada correctamente.' });
      }, 800);
    });
  },

  submitAffiliationForm: async (data: { nombre: string; email: string; telefono: string; condicion: string; mensaje: string }) => {
    console.log('Sending affiliation data to endpoint:', `${API_BASE_URL}/afiliacion`, data);
    // const response = await fetch(`${API_BASE_URL}/afiliacion`, {
    //   method: 'POST',
    //   body: JSON.stringify(data),
    //   headers: { 'Content-Type': 'application/json' }
    // });
    // return response.json();

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: 'Solicitud de afiliación enviada correctamente.' });
      }, 800);
    });
  }
};