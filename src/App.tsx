import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Plans } from './components/Plans';
import { Services } from './components/Services';
import { Procedures } from './components/Procedures';
import { Institutional } from './components/Institutional';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { Login } from './portalAfiliado/Login';
import { Register } from './portalAfiliado/Register';
import { Dashboard } from './portalAfiliado/Dashboard';
import { CentroMedico } from './components/CentroMedico';
import { NovedadesCM } from './components/NovedadesCM';
import { Seccionales } from './components/Seccionales';
import { TelefonosUtiles } from './components/TelefonosUtiles';
import { Tramites } from './components/Tramites';
import { PreguntasFrecuentes } from './components/PreguntasFrecuentes';
import { QuieroAfiliarme } from './components/QuieroAfiliarme';
import { NoticiaDetalle } from './components/NoticiaDetalle';
import { Noticias } from './components/Noticias';
import { FormularioSalud } from './components/FormularioSalud';
import { FormularioPrestador } from './components/FormularioPrestador';
import { CartillaPublica } from './components/CartillaPublica';

import { AdminLogin } from './backoffice/AdminLogin';
import { AdminDashboard } from './backoffice/AdminDashboard';

import { LoginPrestador } from './portalPrestador/LoginPrestador';
import { DashboardPrestador } from './portalPrestador/DashboardPrestador';

import { AuthProvider, useAuth } from './context/authContext';

function AppContent() {
  const { isLoggedIn, loading, logout } = useAuth();
  const [currentView, setCurrentView] = useState<string>(() => {
    const path = window.location.pathname.replace(/^\//, '');
    if (path.startsWith('noticia/')) return 'noticia-detalle';
    return path || 'home';
  });
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(!!localStorage.getItem('admin_token'));
  const [isPrestadorLoggedIn, setIsPrestadorLoggedIn] = useState(!!localStorage.getItem('prestador_token'));
  const [selectedNoticiaId, setSelectedNoticiaId] = useState<number | null>(() => {
    const path = window.location.pathname.replace(/^\//, '');
    if (path.startsWith('noticia/')) {
      const id = parseInt(path.split('/')[1], 10);
      return isNaN(id) ? null : id;
    }
    return null;
  });

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      const view = event.state?.view || 'home';
      setCurrentView(view);
      if (view === 'noticia-detalle' && event.state?.id) {
        setSelectedNoticiaId(event.state.id);
      }
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

  const navigateToNoticia = (id: number) => {
    setSelectedNoticiaId(id);
    setCurrentView('noticia-detalle');
    window.history.pushState({ view: 'noticia-detalle', id }, '', `/noticia/${id}`);
    window.scrollTo(0, 0);
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('admin_token');
    setIsAdminLoggedIn(false);
    navigateTo('home');
  };

  if (loading) return null;

  
  if (currentView === 'admin-dashboard') {
    if (!isAdminLoggedIn) {
      return <AdminLogin onLoginSuccess={() => setIsAdminLoggedIn(true)} onBack={() => navigateTo('home')} />;
    }
    return <AdminDashboard onLogout={handleAdminLogout} />;
  }

  
  if (currentView === 'portal-afiliado' && isLoggedIn) {
    return <Dashboard onLogout={() => { logout(); navigateTo('home'); }} onGoHome={() => navigateTo('home')} />;
  }

  if (currentView === 'portal-prestador') {
    if (!isPrestadorLoggedIn) {
      return (
        <LoginPrestador
          onLoginSuccess={() => { setIsPrestadorLoggedIn(true); navigateTo('portal-prestador'); }}
          onBack={() => navigateTo('home')}
        />
      );
    }
    return (
      <DashboardPrestador
        onLogout={() => {
          localStorage.removeItem('prestador_token');
          localStorage.removeItem('prestador_refresh_token');
          localStorage.removeItem('prestador_cuit');
          setIsPrestadorLoggedIn(false);
          navigateTo('home');
        }}
      />
    );
  }

  if (currentView === 'login-afiliado' && !isLoggedIn) {
    return <Login onBack={() => navigateTo('home')} onLoginSuccess={() => navigateTo('portal-afiliado')} onGoToRegister={() => navigateTo('registro')} />;
  }

  if (currentView === 'registro' && !isLoggedIn) {
    return <Register onBack={() => navigateTo('home')} onRegisterSuccess={() => navigateTo('login-afiliado')} onGoToLogin={() => navigateTo('login-afiliado')} />;
  }

  
  if (isLoggedIn && currentView === 'login-afiliado') {
    navigateTo('home');
  }

  return (
    <div className="min-h-screen bg-white font-sans text-[#1C75BB]">
      <Header
        isLoggedIn={isLoggedIn}
        currentView={currentView}
        onActionClick={(type) => {
          if (type === 'prestador') {
            navigateTo('portal-prestador');
          } else {
            navigateTo(isLoggedIn ? 'portal-afiliado' : `login-${type}`);
          }
        }}
        onAfiliarseClick={() => navigateTo('quiero-afiliarme')}
        onCentroMedicoClick={() => navigateTo('centro-medico')}
        onNoticiasClick={() => navigateTo('noticias')}
        onHomeClick={() => navigateTo('home')}
        onSectionClick={(hash) => {
          if (hash === '#tramites') return navigateTo('tramites');
          if (hash === '#seccionales') return navigateTo('seccionales');
          if (hash === '#telefonos') return navigateTo('telefonos-utiles');
          if (hash === '#faq') return navigateTo('preguntas-frecuentes');
          if (hash === '#afiliacion') return navigateTo('quiero-afiliarme');
          if (hash === '#salud') return navigateTo('formulario-salud');
          if (hash === '#prestador') return navigateTo('formulario-prestador');

          if (currentView !== 'home') {
            setCurrentView('home');
            window.history.pushState({ view: 'home' }, '', '/');
          }
          setTimeout(() => document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' }), 100);
        }}
      />

      <main>
        {currentView === 'home' && (
          <>
            <Hero onNoticiaClick={(id) => { navigateToNoticia(id); }} />
            <Plans onPlanClick={() => navigateTo('quiero-afiliarme')} />
            <Services onCartillaClick={() => navigateTo('cartilla')} />
            <Institutional />
            <Contact />
          </>
        )}

        {currentView === 'cartilla' && <CartillaPublica />}
        {currentView === 'formulario-salud' && <FormularioSalud />}
        {currentView === 'formulario-prestador' && <FormularioPrestador />}
        {currentView === 'centro-medico' && <CentroMedico onNoticiasClick={() => navigateTo('novedades-cm')} />}
        {currentView === 'novedades-cm' && <NovedadesCM onNoticiaClick={(id) => navigateToNoticia(id)} onBack={() => navigateTo('centro-medico')} />}
        {currentView === 'seccionales' && <Seccionales />}
        {currentView === 'telefonos-utiles' && <TelefonosUtiles />}
        {currentView === 'tramites' && <Tramites />}
        {currentView === 'preguntas-frecuentes' && <PreguntasFrecuentes />}
        {currentView === 'quiero-afiliarme' && <QuieroAfiliarme />}
        {currentView === 'noticias' && (
          <Noticias onNoticiaClick={(id) => { navigateToNoticia(id); }} />
        )}
        {currentView === 'noticia-detalle' && selectedNoticiaId && (
          <NoticiaDetalle
            id={selectedNoticiaId}
            onBack={() => navigateTo('noticias')}
            onNoticiaClick={(id) => { navigateToNoticia(id); }}
          />
        )}
      </main>

      <Footer
        onNavigate={navigateTo}
        onSectionClick={(hash) => {
          if (currentView !== 'home') {
            setCurrentView('home');
            window.history.pushState({ view: 'home' }, '', '/');
          }
          setTimeout(() => document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' }), 100);
        }}
      />
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