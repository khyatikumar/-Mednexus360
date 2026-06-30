import React, { useState } from 'react';
import { authApi } from '../services/api';
import type { BackendRole, CurrentUser } from '../types';

interface LoginProps {
  onAuthenticated: (user: CurrentUser) => void;
}

const roles: { value: BackendRole; label: string; icon: string }[] = [
  { value: 'PATIENT', label: 'Patient', icon: 'personal_injury' },
  { value: 'DOCTOR', label: 'Doctor', icon: 'stethoscope' },
  { value: 'HOSPITAL_ADMIN', label: 'Admin', icon: 'admin_panel_settings' },
];

export default function Login({ onAuthenticated }: LoginProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [role, setRole] = useState<BackendRole>('PATIENT');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setMessage(null);

    if (!email.trim() || !password.trim()) {
      setError('Email and password are required.');
      return;
    }

    setIsLoading(true);
    try {
      if (mode === 'register') {
        await authApi.register({ email, password, role });
        setMessage('Account created. Signing you in now.');
      }

      await authApi.login({ email, password });
      const user = await authApi.me();
      onAuthenticated(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen grid lg:grid-cols-[1fr_480px] bg-[#f8f9ff]">
      <section className="hidden lg:flex relative bg-[#213145] text-white p-10 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center opacity-25" />
        <div className="relative z-10 flex flex-col justify-between max-w-xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#316bf3] rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl">medical_services</span>
            </div>
            <div>
              <p className="text-2xl font-bold">MedNexus 360</p>
              <p className="text-xs font-bold uppercase tracking-wider text-[#6ffbbe]">Clinical Suite</p>
            </div>
          </div>
          <div>
            <h1 className="text-5xl font-bold leading-tight">Secure care operations, connected.</h1>
            <p className="mt-5 text-sm leading-7 text-[#dce9ff]">
              Sign in to coordinate patient visits, clinician schedules, medical records,
              reports, notifications, and guided care support in one secure place.
            </p>
          </div>
          <p className="text-xs text-[#dce9ff]/70">Trusted care coordination for modern clinics</p>
        </div>
      </section>

      <section className="bg-white flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-sm">
          <header className="mb-8">
            <div className="lg:hidden flex items-center gap-2 mb-8">
              <span className="material-symbols-outlined text-[#0051d5]">medical_services</span>
              <span className="font-bold">MedNexus 360</span>
            </div>
            <h2 className="text-3xl font-bold text-[#0b1c30]">
              {mode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-sm text-[#45464d] mt-2">
              {mode === 'login' ? 'Access your secure care workspace.' : 'Create a secure profile for your care role.'}
            </p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="text-xs font-bold text-[#45464d] uppercase">Role</label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {roles.map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => setRole(item.value)}
                      className={`h-20 rounded-lg border text-xs font-bold flex flex-col items-center justify-center gap-1 ${
                        role === item.value
                          ? 'border-[#0051d5] bg-[#eff4ff] text-[#0051d5]'
                          : 'border-[#c6c6cd] text-[#45464d] hover:bg-[#f8f9ff]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-lg">{item.icon}</span>
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="text-xs font-bold text-[#45464d]">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-1 w-full h-11 px-3 rounded-lg border border-[#c6c6cd] text-sm outline-none focus:ring-2 focus:ring-[#0051d5]"
                autoComplete="email"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="text-xs font-bold text-[#45464d]">
                Password
              </label>
              <div className="relative mt-1">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full h-11 pl-3 pr-10 rounded-lg border border-[#c6c6cd] text-sm outline-none focus:ring-2 focus:ring-[#0051d5]"
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-[#45464d]"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <span className="material-symbols-outlined text-lg">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 text-red-700 p-3 text-xs font-semibold">
                {error}
              </div>
            )}
            {message && (
              <div className="rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 text-xs font-semibold">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 rounded-lg bg-[#0051d5] text-white text-sm font-bold hover:bg-[#00174b] disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {isLoading && <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />}
              {mode === 'login' ? 'Sign In' : 'Register and Sign In'}
            </button>
          </form>

          <button
            type="button"
            onClick={() => {
              setMode((value) => (value === 'login' ? 'register' : 'login'));
              setError(null);
              setMessage(null);
            }}
            className="mt-6 w-full text-xs font-bold text-[#0051d5] hover:underline"
          >
            {mode === 'login' ? 'Need an account? Register' : 'Already registered? Sign in'}
          </button>
        </div>
      </section>
    </main>
  );
}
