import React, { useEffect, useState } from 'react';
import { doctorsApi, hospitalsApi } from '../services/api';
import type { Doctor, DoctorPayload, Hospital } from '../types';

const emptyDoctor: DoctorPayload = {
  user_id: 0,
  hospital_id: 0,
  specialization: '',
  experience_years: 0,
  consultation_fee: 0,
  available_from: '09:00',
  available_to: '17:00',
};

export default function DoctorsPage({ canMutate }: { canMutate: boolean }) {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [form, setForm] = useState<DoctorPayload>(emptyDoctor);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const [doctorData, hospitalData] = await Promise.all([
        doctorsApi.list(),
        hospitalsApi.list(),
      ]);
      setDoctors(doctorData);
      setHospitals(hospitalData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load doctors.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!form.user_id || !form.hospital_id || !form.specialization.trim()) {
      setError('User ID, Hospital ID, and Specialization are required.');
      return;
    }

    const duplicateUser = doctors.some((doctor) => doctor.user_id === form.user_id && doctor.id !== editingId);
    if (duplicateUser) {
      setError(`User ID ${form.user_id} already has a doctor profile. Use a different user ID or edit the existing doctor.`);
      return;
    }

    const hospitalExists = hospitals.some((hospital) => hospital.id === form.hospital_id);
    if (!hospitalExists) {
      setError(`Hospital ID ${form.hospital_id} does not exist. Create the hospital first or use an existing hospital ID.`);
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        await doctorsApi.update(editingId, form);
        setSuccess('Doctor updated successfully.');
      } else {
        await doctorsApi.create(form);
        setSuccess('Doctor created successfully.');
      }
      setEditingId(null);
      setForm(emptyDoctor);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save doctor.');
    } finally {
      setSaving(false);
    }
  };

  const edit = (doctor: Doctor) => {
    setEditingId(doctor.id);
    setForm({
      user_id: doctor.user_id,
      hospital_id: doctor.hospital_id,
      specialization: doctor.specialization,
      experience_years: doctor.experience_years,
      consultation_fee: doctor.consultation_fee,
      available_from: doctor.available_from.slice(0, 5),
      available_to: doctor.available_to.slice(0, 5),
    });
  };

  const remove = async (doctor: Doctor) => {
    if (!window.confirm(`Delete doctor #${doctor.id}?`)) return;
    try {
      await doctorsApi.remove(doctor.id);
      setSuccess('Doctor deleted successfully.');
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to delete doctor.');
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-3xl font-bold">Doctors</h2>
        <p className="text-sm text-[#45464d]">Live data from `/doctors/`.</p>
      </header>
      <Banner error={error} success={success} />
      <div className="grid xl:grid-cols-[1fr_380px] gap-6">
        <section className="bg-white border border-[#c6c6cd] rounded-lg overflow-hidden">
          {loading ? (
            <div className="p-4 space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-14 rounded bg-[#eff4ff] animate-pulse" />)}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-[#eff4ff] text-xs uppercase text-[#45464d]">
                  <tr>
                    <th className="p-4">ID</th>
                    <th className="p-4">User</th>
                    <th className="p-4">Hospital</th>
                    <th className="p-4">Specialization</th>
                    <th className="p-4">Experience</th>
                    <th className="p-4">Fee</th>
                    <th className="p-4">Availability</th>
                    {canMutate && <th className="p-4">Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#c6c6cd]">
                  {doctors.length === 0 ? (
                    <tr>
                      <td colSpan={canMutate ? 8 : 7} className="p-8 text-center text-[#45464d]">
                        No doctors found.
                      </td>
                    </tr>
                  ) : (
                    doctors.map((doctor) => (
                      <tr key={doctor.id} className="hover:bg-[#f8f9ff]">
                        <td className="p-4 font-bold">#{doctor.id}</td>
                        <td className="p-4">{doctor.user_id}</td>
                        <td className="p-4">{doctor.hospital_id}</td>
                        <td className="p-4">{doctor.specialization}</td>
                        <td className="p-4">{doctor.experience_years} years</td>
                        <td className="p-4">${doctor.consultation_fee}</td>
                        <td className="p-4">{doctor.available_from} - {doctor.available_to}</td>
                        {canMutate && (
                          <td className="p-4">
                            <button className="text-[#0051d5] font-bold text-xs mr-3" onClick={() => edit(doctor)}>Edit</button>
                            <button className="text-red-600 font-bold text-xs" onClick={() => remove(doctor)}>Delete</button>
                          </td>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {canMutate && (
          <form onSubmit={submit} className="bg-white border border-[#c6c6cd] rounded-lg p-5 space-y-3 h-fit">
            <h3 className="font-bold">{editingId ? `Edit Doctor #${editingId}` : 'Create Doctor'}</h3>
            <Field label="User ID" type="number" value={form.user_id || ''} onChange={(v) => setForm({ ...form, user_id: Number(v) })} />
            <label className="block text-xs font-bold text-[#45464d]">
              Hospital
              <select
                value={form.hospital_id || ''}
                onChange={(event) => setForm({ ...form, hospital_id: Number(event.target.value) })}
                className="mt-1 w-full h-10 px-3 rounded-lg border border-[#c6c6cd] text-sm"
                required
              >
                <option value="">Select hospital</option>
                {hospitals.map((hospital) => (
                  <option key={hospital.id} value={hospital.id}>
                    #{hospital.id} · {hospital.name}
                  </option>
                ))}
              </select>
            </label>
            <Field label="Specialization" value={form.specialization} onChange={(v) => setForm({ ...form, specialization: v })} />
            <Field label="Experience Years" type="number" value={form.experience_years || ''} onChange={(v) => setForm({ ...form, experience_years: Number(v) })} />
            <Field label="Consultation Fee" type="number" value={form.consultation_fee || ''} onChange={(v) => setForm({ ...form, consultation_fee: Number(v) })} />
            <Field label="Available From" type="time" value={form.available_from} onChange={(v) => setForm({ ...form, available_from: v })} />
            <Field label="Available To" type="time" value={form.available_to} onChange={(v) => setForm({ ...form, available_to: v })} />
            <button disabled={saving} className="w-full h-10 bg-[#0051d5] text-white rounded-lg text-xs font-bold disabled:opacity-70">
              {saving ? 'Saving...' : editingId ? 'Update Doctor' : 'Create Doctor'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = 'text' }: { label: string; value: string | number; onChange: (value: string) => void; type?: string }) {
  return (
    <label className="block text-xs font-bold text-[#45464d]">
      {label}
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} className="mt-1 w-full h-10 px-3 rounded-lg border border-[#c6c6cd] text-sm" required />
    </label>
  );
}

function Banner({ error, success }: { error: string | null; success: string | null }) {
  if (!error && !success) return null;
  return <div className={`p-3 rounded-lg border text-sm font-semibold ${error ? 'bg-red-50 border-red-200 text-red-700' : 'bg-emerald-50 border-emerald-200 text-emerald-800'}`}>{error ?? success}</div>;
}
