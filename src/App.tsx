import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Plans } from './components/Plans';
import { Services } from './components/Services';
import { Institutional } from './components/Institutional';
import { Procedures } from './components/Procedures';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { Login } from './portalAfiliado/Login';
import { Register } from './portalAfiliado/Register';
import { Dashboard } from './portalAfiliado/Dashboard';
import { CentroMedico } from './components/CentroMedico';
import { Seccionales } from './components/Seccionales';
import { TelefonosUtiles } from './components/TelefonosUtiles';
import { Tramites } from './components/Tramites';
import { PreguntasFrecuentes } from './components/PreguntasFrecuentes';
import { QuieroAfiliarme } from './components/QuieroAfiliarme';

// ADMIN IMPORTS
import { AdminLogin } from './backoffice/AdminLogin';
import { AdminDashboard } from './backoffice/AdminDashboard';

import { AuthProvider, useAuth } from './context/authContext';

function AppContent() {
  const { isLoggedIn, loading, logout } = useAuth();
  const [currentView, setCurrentView] = useState<string>('home');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(!!localStorage.getItem('admin_token'));

  useEffect(() => {
    const path = window.location.pathname.replace('/', '');
    if (path) setCurrentView(path);

    const handlePopState = (event: PopStateEvent) => {
      setCurrentView(event.state?.view || 'home');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (view: string) => {
    setCurrentView(view);
    const url = view === 'home' ? '/' : `/${view}`;
    window.history.pushState({ view }, '', url);
    window.scrollTo(0, 0);
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('admin_token');
    setIsAdminLoggedIn(false);
    navigateTo('home');
  };

  if (loading) return null;

  // --- LOGICA BACKOFFICE ---
  if (currentView === 'admin-dashboard') {
    if (!isAdminLoggedIn) {
      return <AdminLogin onLoginSuccess={() => setIsAdminLoggedIn(true)} onBack={() => navigateTo('home')} />;
    }
    return <AdminDashboard onLogout={handleAdminLogout} />;
  }

  // --- LOGICA PORTALES ---
  if (currentView === 'portal-afiliado' && isLoggedIn) {
    return <Dashboard onLogout={() => { logout(); navigateTo('home'); }} />;
  }

  if ((currentView === 'login-afiliado' || currentView === 'login-prestador') && !isLoggedIn) {
    return <Login onBack={() => navigateTo('home')} onLoginSuccess={() => navigateTo('home')} onGoToRegister={() => navigateTo('registro')} />;
  }

  if (currentView === 'registro' && !isLoggedIn) {
    return <Register onBack={() => navigateTo('home')} onRegisterSuccess={() => navigateTo('login-afiliado')} onGoToLogin={() => navigateTo('login-afiliado')} />;
  }

  // Redirección si ya está logueado
  if (isLoggedIn && (currentView === 'login-afiliado' || currentView === 'login-prestador')) {
    navigateTo('home');
  }

  return (
    <div className="min-h-screen bg-white font-sans text-[#1C75BB]">
      <Header
        isLoggedIn={isLoggedIn}
        onActionClick={(type) => navigateTo(isLoggedIn ? 'portal-afiliado' : `login-${type}`)}
        onAfiliarseClick={() => navigateTo('quiero-afiliarme')}
        onCentroMedicoClick={() => navigateTo('centro-medico')}
        onHomeClick={() => navigateTo('home')}
        onSectionClick={(hash) => {
          if (hash === '#tramites') return navigateTo('tramites');
          if (hash === '#seccionales') return navigateTo('seccionales');
          if (hash === '#telefonos') return navigateTo('telefonos-utiles');
          if (hash === '#faq') return navigateTo('preguntas-frecuentes');

          if (currentView !== 'home') {
            setCurrentView('home');
            window.history.pushState({ view: 'home' }, '', '/');
          }
          setTimeout(() => document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' }), 100);
        }}
      />

      <main>
        {/* CORRECCIÓN: Agregados Institutional y Procedures al renderizado de la Home */}
        {currentView === 'home' && (
          <>
            <Hero />
            <Plans />
            <Services />
            <Institutional />
            <Procedures />
            <Contact />
          </>
        )}

        {currentView === 'centro-medico' && <CentroMedico />}
        {currentView === 'seccionales' && <Seccionales />}
        {currentView === 'telefonos-utiles' && <TelefonosUtiles />}
        {currentView === 'tramites' && <Tramites />}
        {currentView === 'preguntas-frecuentes' && <PreguntasFrecuentes />}
        {currentView === 'quiero-afiliarme' && <QuieroAfiliarme />}
      </main>

      <Footer />
      <button onClick={() => navigateTo('admin-dashboard')} className="fixed bottom-2 left-2 opacity-0 hover:opacity-100 text-[10px] text-slate-300">ADMIN</button>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}