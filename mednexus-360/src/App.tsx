import React, { useEffect, useMemo, useState } from 'react';
import Login from './components/Login';
import PatientsPage from './components/PatientsPage';
import AppointmentsPage from './components/AppointmentsPage';
import MedicalRecordsPage from './components/MedicalRecordsPage';
import SymptomChecker from './components/SymptomChecker';
import DoctorsPage from './components/DoctorsPage';
import HospitalsPage from './components/HospitalsPage';
import ReportsPage from './components/ReportsPage';
import NotificationsPage from './components/NotificationsPage';
import { authApi, tokenStorage } from './services/api';
import type { BackendRole, CurrentUser } from './types';

type PageKey =
  | 'Dashboard'
  | 'Doctors'
  | 'Hospitals'
  | 'Patients'
  | 'Appointments'
  | 'Medical Records'
  | 'Reports'
  | 'AI Tools'
  | 'Notifications';

interface MenuItem {
  name: PageKey;
  icon: string;
  roles: BackendRole[];
}

const menuItems: MenuItem[] = [
  { name: 'Dashboard', icon: 'dashboard', roles: ['PATIENT', 'DOCTOR', 'HOSPITAL_ADMIN'] },
  { name: 'Doctors', icon: 'stethoscope', roles: ['PATIENT', 'HOSPITAL_ADMIN'] },
  { name: 'Hospitals', icon: 'local_hospital', roles: ['PATIENT', 'HOSPITAL_ADMIN'] },
  { name: 'Patients', icon: 'person_search', roles: ['PATIENT', 'DOCTOR', 'HOSPITAL_ADMIN'] },
  { name: 'Appointments', icon: 'calendar_month', roles: ['PATIENT', 'DOCTOR', 'HOSPITAL_ADMIN'] },
  { name: 'Medical Records', icon: 'clinical_notes', roles: ['PATIENT', 'DOCTOR'] },
  { name: 'Reports', icon: 'picture_as_pdf', roles: ['PATIENT', 'DOCTOR'] },
  { name: 'AI Tools', icon: 'psychology', roles: ['PATIENT', 'DOCTOR'] },
  { name: 'Notifications', icon: 'notifications', roles: ['PATIENT', 'DOCTOR', 'HOSPITAL_ADMIN'] },
];

const roleLabel: Record<BackendRole, string> = {
  PATIENT: 'Patient',
  DOCTOR: 'Doctor',
  HOSPITAL_ADMIN: 'Hospital Admin',
};

export default function App() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [activePage, setActivePage] = useState<PageKey>('Dashboard');
  const [isBooting, setIsBooting] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function restoreSession() {
      if (!tokenStorage.get()) {
        setIsBooting(false);
        return;
      }

      try {
        const currentUser = await authApi.me();
        if (mounted) setUser(currentUser);
      } catch {
        authApi.logout();
      } finally {
        if (mounted) setIsBooting(false);
      }
    }

    restoreSession();

    const logoutOnUnauthorized = () => {
      setUser(null);
      setActivePage('Dashboard');
    };
    window.addEventListener('mednexus:unauthorized', logoutOnUnauthorized);

    return () => {
      mounted = false;
      window.removeEventListener('mednexus:unauthorized', logoutOnUnauthorized);
    };
  }, []);

  const allowedMenu = useMemo(
    () => (user ? menuItems.filter((item) => item.roles.includes(user.role)) : []),
    [user],
  );

  useEffect(() => {
    if (!user) return;
    const canSeeActive = allowedMenu.some((item) => item.name === activePage);
    if (!canSeeActive) setActivePage('Dashboard');
  }, [activePage, allowedMenu, user]);

  const handleLogout = () => {
    authApi.logout();
    setUser(null);
    setActivePage('Dashboard');
  };

  if (isBooting) {
    return (
      <div className="min-h-screen bg-[#f8f9ff] flex items-center justify-center text-[#0b1c30]">
        <div className="flex items-center gap-3 text-sm font-bold">
          <span className="w-5 h-5 rounded-full border-2 border-[#0051d5]/25 border-t-[#0051d5] animate-spin" />
          Restoring secure session...
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login onAuthenticated={setUser} />;
  }

  const nav = (
    <nav className="space-y-1.5">
      {allowedMenu.map((item) => {
        const active = activePage === item.name;
        return (
          <button
            key={item.name}
            onClick={() => {
              setActivePage(item.name);
              setMobileMenuOpen(false);
            }}
            className={`w-full h-11 px-3 rounded-lg flex items-center gap-3 text-xs font-bold transition-colors ${
              active ? 'bg-[#316bf3] text-white' : 'text-[#dce9ff]/80 hover:bg-white/10 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-lg">{item.icon}</span>
            {item.name}
          </button>
        );
      })}
    </nav>
  );

  return (
    <div className="h-screen flex bg-[#f8f9ff] text-[#0b1c30] overflow-hidden">
      <aside className="hidden lg:flex w-[260px] bg-[#213145] text-white p-6 flex-col justify-between shrink-0">
        <div className="space-y-8">
          <Brand />
          {nav}
        </div>
        <UserFooter user={user} onLogout={handleLogout} />
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-[72px] bg-white border-b border-[#c6c6cd] px-5 sm:px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg border border-[#c6c6cd]"
              aria-label="Open navigation"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
            <div className="min-w-0">
              <h1 className="text-lg font-bold truncate">{activePage}</h1>
              <p className="text-xs text-[#45464d] truncate">
                Signed in as {user.email} · {roleLabel[user.role]}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="h-10 px-3 rounded-lg border border-[#c6c6cd] text-xs font-bold hover:bg-[#eff4ff] flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-base">logout</span>
            Sign Out
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-5 sm:p-8">
          {activePage === 'Dashboard' && <Dashboard user={user} onNavigate={setActivePage} />}
          {activePage === 'Doctors' && <DoctorsPage canMutate={user.role === 'HOSPITAL_ADMIN'} />}
          {activePage === 'Hospitals' && <HospitalsPage canMutate={user.role === 'HOSPITAL_ADMIN'} />}
          {activePage === 'Patients' && (
            <PatientsPage
              canCreate={user.role === 'PATIENT'}
              canManage={user.role === 'HOSPITAL_ADMIN'}
            />
          )}
          {activePage === 'Appointments' && <AppointmentsPage />}
          {activePage === 'Medical Records' && <MedicalRecordsPage />}
          {activePage === 'Reports' && <ReportsPage />}
          {activePage === 'AI Tools' && <SymptomChecker />}
          {activePage === 'Notifications' && <NotificationsPage userId={user.id} />}
        </main>
      </div>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close navigation"
          />
          <aside className="relative w-[280px] h-full bg-[#213145] text-white p-6 flex flex-col justify-between">
            <div className="space-y-8">
              <Brand />
              {nav}
            </div>
            <UserFooter user={user} onLogout={handleLogout} />
          </aside>
        </div>
      )}
    </div>
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-[#316bf3] rounded-lg flex items-center justify-center">
        <span className="material-symbols-outlined text-white">medical_services</span>
      </div>
      <div>
        <p className="text-lg font-bold leading-tight">MedNexus 360</p>
        <p className="text-[10px] text-[#6ffbbe] font-bold uppercase tracking-wider">Clinical Suite</p>
      </div>
    </div>
  );
}

function UserFooter({ user, onLogout }: { user: CurrentUser; onLogout: () => void }) {
  return (
    <div className="border-t border-white/15 pt-5 space-y-4">
      <div className="min-w-0">
        <p className="text-xs font-bold truncate">{user.email}</p>
        <p className="text-[10px] text-[#6ffbbe] font-bold mt-1">{roleLabel[user.role]}</p>
      </div>
      <button
        onClick={onLogout}
        className="w-full h-10 rounded-lg bg-white/5 hover:bg-red-500/15 text-xs font-bold flex items-center justify-center gap-2"
      >
        <span className="material-symbols-outlined text-base">logout</span>
        Logout
      </button>
    </div>
  );
}

function Dashboard({ user, onNavigate }: { user: CurrentUser; onNavigate: (page: PageKey) => void }) {
  const quickActions: { label: string; page: PageKey; icon: string; roles: BackendRole[] }[] = [
    { label: 'Book Appointment', page: 'Appointments', icon: 'edit_calendar', roles: ['PATIENT', 'DOCTOR', 'HOSPITAL_ADMIN'] },
    { label: 'Manage Doctors', page: 'Doctors', icon: 'stethoscope', roles: ['HOSPITAL_ADMIN'] },
    { label: 'Patient Registry', page: 'Patients', icon: 'person_search', roles: ['PATIENT', 'DOCTOR', 'HOSPITAL_ADMIN'] },
    { label: 'AI Symptom Check', page: 'AI Tools', icon: 'psychology', roles: ['PATIENT', 'DOCTOR'] },
    { label: 'Upload Reports', page: 'Reports', icon: 'picture_as_pdf', roles: ['PATIENT', 'DOCTOR'] },
  ];

  return (
    <div className="space-y-6">
      <section className="bg-white border border-[#c6c6cd] rounded-lg p-6">
        <p className="text-xs font-bold uppercase tracking-wider text-[#0051d5]">{roleLabel[user.role]} Workspace</p>
        <h2 className="text-3xl font-bold mt-2">Welcome to MedNexus 360</h2>
        <p className="text-sm text-[#45464d] mt-2 max-w-2xl">
          Your frontend is now connected to the FastAPI backend. Use the modules below to call live
          endpoints with the JWT stored from `/auth/login`.
        </p>
      </section>

      <section className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {quickActions
          .filter((action) => action.roles.includes(user.role))
          .map((action) => (
            <button
              key={action.label}
              onClick={() => onNavigate(action.page)}
              className="bg-white border border-[#c6c6cd] rounded-lg p-5 text-left hover:border-[#0051d5] hover:shadow-sm transition-all"
            >
              <span className="material-symbols-outlined text-[#0051d5]">{action.icon}</span>
              <p className="font-bold mt-3">{action.label}</p>
              <p className="text-xs text-[#45464d] mt-1">Open live backend workflow</p>
            </button>
          ))}
      </section>
    </div>
  );
}
