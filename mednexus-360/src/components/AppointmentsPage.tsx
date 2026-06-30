import React, { useEffect, useMemo, useState } from 'react';
import { appointmentsApi, doctorsApi, patientsApi } from '../services/api';
import type { Appointment, AppointmentPayload, Doctor, Patient } from '../types';

const emptyAppointment: AppointmentPayload = {
  patient_id: 0,
  doctor_id: 0,
  appointment_time: '',
};

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [form, setForm] = useState<AppointmentPayload>(emptyAppointment);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [appointmentData, patientData, doctorData] = await Promise.all([
        appointmentsApi.list(),
        patientsApi.list(),
        doctorsApi.list(),
      ]);
      setAppointments(appointmentData);
      setPatients(patientData);
      setDoctors(doctorData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load appointments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    if (filter === 'all') return appointments;
    return appointments.filter((appointment) => appointment.status === filter);
  }, [appointments, filter]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!form.patient_id || !form.doctor_id || !form.appointment_time) {
      setError('Patient, doctor, and appointment time are required.');
      return;
    }

    setSaving(true);
    try {
      await appointmentsApi.create({
        ...form,
        appointment_time: new Date(form.appointment_time).toISOString(),
      });
      setForm(emptyAppointment);
      setSuccess('Appointment created successfully.');
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create appointment.');
    } finally {
      setSaving(false);
    }
  };

  const transition = async (appointment: Appointment, action: 'cancel' | 'complete') => {
    setError(null);
    setSuccess(null);
    try {
      if (action === 'cancel') await appointmentsApi.cancel(Number(appointment.id));
      else await appointmentsApi.complete(Number(appointment.id));
      setSuccess(`Appointment ${action === 'cancel' ? 'cancelled' : 'completed'} successfully.`);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to update appointment.');
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-3xl font-bold">Appointments</h2>
        <p className="text-sm text-[#45464d]">Schedule consultations, track visit status, and keep care teams aligned.</p>
      </header>

      {(error || success) && <div className={`p-3 rounded-lg border text-sm font-semibold ${error ? 'bg-red-50 border-red-200 text-red-700' : 'bg-emerald-50 border-emerald-200 text-emerald-800'}`}>{error ?? success}</div>}

      <section className="bg-white border border-[#c6c6cd] rounded-lg p-5">
        <form onSubmit={submit} className="grid md:grid-cols-4 gap-3 items-end">
          <label className="text-xs font-bold text-[#45464d]">
            Patient
            <select value={form.patient_id || ''} onChange={(event) => setForm({ ...form, patient_id: Number(event.target.value) })} className="mt-1 w-full h-10 px-3 rounded-lg border border-[#c6c6cd] text-sm" required>
              <option value="">Select patient</option>
              {patients.map((patient) => <option key={patient.id} value={patient.id}>Patient #{patient.id} | profile {patient.user_id}</option>)}
            </select>
          </label>
          <label className="text-xs font-bold text-[#45464d]">
            Doctor
            <select value={form.doctor_id || ''} onChange={(event) => setForm({ ...form, doctor_id: Number(event.target.value) })} className="mt-1 w-full h-10 px-3 rounded-lg border border-[#c6c6cd] text-sm" required>
              <option value="">Select doctor</option>
              {doctors.map((doctor) => <option key={doctor.id} value={doctor.id}>Doctor #{doctor.id} | {doctor.specialization}</option>)}
            </select>
          </label>
          <label className="text-xs font-bold text-[#45464d]">
            Appointment Time
            <input type="datetime-local" value={form.appointment_time} onChange={(event) => setForm({ ...form, appointment_time: event.target.value })} className="mt-1 w-full h-10 px-3 rounded-lg border border-[#c6c6cd] text-sm" required />
          </label>
          <button disabled={saving} className="h-10 bg-[#0051d5] text-white rounded-lg text-xs font-bold disabled:opacity-70">
            {saving ? 'Booking...' : 'Book Appointment'}
          </button>
        </form>
      </section>

      <div className="flex gap-2 overflow-x-auto">
        {['all', 'scheduled', 'completed', 'cancelled'].map((value) => (
          <button key={value} onClick={() => setFilter(value)} className={`px-4 h-9 rounded-lg text-xs font-bold border ${filter === value ? 'bg-[#0051d5] text-white border-[#0051d5]' : 'bg-white border-[#c6c6cd] text-[#45464d]'}`}>
            {value.toUpperCase()}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-44 rounded-lg bg-[#eff4ff] animate-pulse" />)}</div>
      ) : (
        <section className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((appointment) => (
            <article key={appointment.id} className="bg-white border border-[#c6c6cd] rounded-lg p-5 space-y-4">
              <div className="flex items-center justify-between">
                <p className="font-bold">Appointment #{appointment.id}</p>
                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${appointment.status === 'completed' ? 'bg-emerald-50 text-emerald-700' : appointment.status === 'cancelled' ? 'bg-red-50 text-red-700' : 'bg-[#eff4ff] text-[#0051d5]'}`}>{appointment.status}</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <Info label="Patient ID" value={appointment.patient_id} />
                <Info label="Doctor ID" value={appointment.doctor_id} />
                <Info label="Time" value={appointment.appointment_time ? new Date(appointment.appointment_time).toLocaleString() : 'Not set'} />
              </div>
              <div className="flex gap-2">
                <button disabled={appointment.status !== 'scheduled'} onClick={() => transition(appointment, 'complete')} className="flex-1 h-9 rounded-lg bg-emerald-600 text-white text-xs font-bold disabled:opacity-40">Complete</button>
                <button disabled={appointment.status !== 'scheduled'} onClick={() => transition(appointment, 'cancel')} className="flex-1 h-9 rounded-lg bg-red-600 text-white text-xs font-bold disabled:opacity-40">Cancel</button>
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}

function Info({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="p-3 rounded-lg bg-[#f8f9ff] border border-[#c6c6cd]">
      <p className="text-[10px] font-bold uppercase text-[#45464d]">{label}</p>
      <p className="font-bold mt-1">{value}</p>
    </div>
  );
}
