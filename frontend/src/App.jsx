import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

function AuthGate() {
  const { isAuthenticated, loading } = useAuth();
  const [authView, setAuthView] = useState('login'); // 'login' or 'register'

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-200">
        <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-4 shadow-glow-indigo" />
        <p className="text-xs text-slate-400 font-mono tracking-widest uppercase">
          Initializing SkillMap AI Gateway...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    if (authView === 'register') {
      return <Register onSwitchToLogin={() => setAuthView('login')} />;
    }
    return <Login onSwitchToRegister={() => setAuthView('register')} />;
  }

  return <Dashboard />;
}

export default function App() {
  return (
    <AuthProvider>
      <div className="hacker-shell">
        <div className="hacker-shell__grid" aria-hidden="true" />
        <div className="hacker-shell__vignette" aria-hidden="true" />
        <div className="hacker-shell__scanlines" aria-hidden="true" />
        <div className="hacker-shell__signal" aria-hidden="true" />
        <div className="hacker-shell__corner hacker-shell__corner--tl" aria-hidden="true" />
        <div className="hacker-shell__corner hacker-shell__corner--tr" aria-hidden="true" />
        <div className="hacker-shell__corner hacker-shell__corner--bl" aria-hidden="true" />
        <div className="hacker-shell__corner hacker-shell__corner--br" aria-hidden="true" />
        <div className="hacker-shell__hud" aria-hidden="true">
          <span>GEN-ALPHA</span>
          <span className="pulse-dot" />
          <span>LIVE</span>
        </div>
        <div className="hacker-shell__status" aria-hidden="true">
          <span>ACCESS GRID</span>
          <span className="hacker-shell__status--divider" />
          <span>STABLE</span>
        </div>
        <AuthGate />
      </div>
    </AuthProvider>
  );
}
