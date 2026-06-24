import React, { useEffect, useState } from 'react';
import { hospitalsApi } from '../services/api';
import type { Hospital, HospitalPayload } from '../types';

const emptyHospital: HospitalPayload = { name: '', address: '', city: '' };

export default function HospitalsPage({ canMutate }: { canMutate: boolean }) {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [form, setForm] = useState<HospitalPayload>(emptyHospital);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      setHospitals(await hospitalsApi.list());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load hospitals.');
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
    setNotice(null);
    setSaving(true);
    try {
      if (editingId) {
        await hospitalsApi.update(editingId, form);
        setNotice('Hospital updated successfully.');
      } else {
        await hospitalsApi.create(form);
        setNotice('Hospital created successfully.');
      }
      setEditingId(null);
      setForm(emptyHospital);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save hospital.');
    } finally {
      setSaving(false);
    }
  };

  const edit = (hospital: Hospital) => {
    setEditingId(hospital.id);
    setForm({ name: hospital.name, address: hospital.address, city: hospital.city });
  };

  const remove = async (hospital: Hospital) => {
    if (!window.confirm(`Delete ${hospital.name}?`)) return;
    try {
      await hospitalsApi.remove(hospital.id);
      setNotice('Hospital deleted successfully.');
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to delete hospital.');
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-3xl font-bold">Hospitals</h2>
        <p className="text-sm text-[#45464d]">Live data from `/hospitals/`.</p>
      </header>
      {(error || notice) && <div className={`p-3 rounded-lg border text-sm font-semibold ${error ? 'bg-red-50 border-red-200 text-red-700' : 'bg-emerald-50 border-emerald-200 text-emerald-800'}`}>{error ?? notice}</div>}
      <div className="grid xl:grid-cols-[1fr_360px] gap-6">
        <section className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-36 bg-[#eff4ff] rounded-lg animate-pulse" />)
            : hospitals.map((hospital) => (
                <article key={hospital.id} className="bg-white border border-[#c6c6cd] rounded-lg p-5">
                  <p className="text-xs font-bold text-[#0051d5]">Hospital #{hospital.id}</p>
                  <h3 className="text-lg font-bold mt-1">{hospital.name}</h3>
                  <p className="text-sm text-[#45464d] mt-2">{hospital.address}</p>
                  <div className="mt-4 flex items-center justify-between text-xs font-bold">
                    <span>{hospital.city}</span>
                    <span>Rating {hospital.rating ?? 'N/A'}</span>
                  </div>
                  {canMutate && (
                    <div className="mt-4 flex gap-3 text-xs font-bold">
                      <button className="text-[#0051d5]" onClick={() => edit(hospital)}>Edit</button>
                      <button className="text-red-600" onClick={() => remove(hospital)}>Delete</button>
                    </div>
                  )}
                </article>
              ))}
        </section>

        {canMutate && (
          <form onSubmit={submit} className="bg-white border border-[#c6c6cd] rounded-lg p-5 space-y-3 h-fit">
            <h3 className="font-bold">{editingId ? `Edit Hospital #${editingId}` : 'Create Hospital'}</h3>
            <Field label="Name" value={form.name} onChange={(name) => setForm({ ...form, name })} />
            <Field label="Address" value={form.address} onChange={(address) => setForm({ ...form, address })} />
            <Field label="City" value={form.city} onChange={(city) => setForm({ ...form, city })} />
            <button disabled={saving} className="w-full h-10 bg-[#0051d5] text-white rounded-lg text-xs font-bold disabled:opacity-70">
              {saving ? 'Saving...' : editingId ? 'Update Hospital' : 'Create Hospital'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block text-xs font-bold text-[#45464d]">
      {label}
      <input value={value} onChange={(event) => onChange(event.target.value)} className="mt-1 w-full h-10 px-3 rounded-lg border border-[#c6c6cd] text-sm" required />
    </label>
  );
}
