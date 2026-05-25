import './App.css';
import { useState } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

import CinematicSceneShowcase from './components/pages/variant-2/cinematic-scene-showcase';
import ProjectsPage           from './components/pages/architect/ProjectsPage';
import ProjectDetailPage      from './components/pages/architect/ProjectDetailPage';
import AboutPage              from './components/pages/architect/AboutPage';
import ContactPage            from './components/pages/architect/ContactPage';
import Preloader              from './components/Preloader';
import { TransitionProvider, usePageTransition } from './context/TransitionContext';

function ScrollTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function SiteNav() {
  const location   = useLocation();
  const { navigateTo } = usePageTransition();
  const isHome     = location.pathname === '/';
  if (isHome) return null;

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-[200] flex items-center justify-between px-8 h-14"
      style={{
        background:    'rgba(245,242,237,0.92)',
        backdropFilter: 'blur(8px)',
        borderBottom:  '1px solid rgba(26,26,26,0.06)',
      }}
    >
      <button
        onClick={() => navigateTo('/')}
        style={{
          fontFamily:    "'Space Grotesk', sans-serif",
          fontWeight:    700,
          fontSize:      'clamp(13px, 1vw, 16px)',
          letterSpacing: '-0.01em',
          color:         '#1a1a1a',
        }}
      >
        Forma
      </button>
      <div className="flex items-center gap-6">
        {[
          { label: 'Projects', path: '/projects' },
          { label: 'About',    path: '/about'    },
          { label: 'Contact',  path: '/contact'  },
        ].map(({ label, path }) => (
          <button
            key={label}
            onClick={() => navigateTo(path)}
            className="font-mono tracking-[0.22em] uppercase transition-colors duration-200"
            style={{ fontSize: '8px', color: 'rgba(26,26,26,0.4)' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'rgba(26,26,26,0.9)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(26,26,26,0.4)')}
          >
            {label}
          </button>
        ))}
      </div>
    </nav>
  );
}

function App() {
  const [preloaderDone, setPreloaderDone] = useState(
    () => sessionStorage.getItem('forma-v1') === '1'
  );

  function handlePreloaderDone() {
    sessionStorage.setItem('forma-v1', '1');
    setPreloaderDone(true);
  }

  return (
    <Router>
      <TransitionProvider>
        {!preloaderDone && <Preloader onDone={handlePreloaderDone} />}
        <ScrollTop />
        <SiteNav />
        <Routes>
          <Route path="/"               element={<CinematicSceneShowcase />} />
          <Route path="/projects"       element={<ProjectsPage />} />
          <Route path="/project/:slug"  element={<ProjectDetailPage />} />
          <Route path="/about"          element={<AboutPage />} />
          <Route path="/contact"        element={<ContactPage />} />
        </Routes>
      </TransitionProvider>
    </Router>
  );
}

export default App;
