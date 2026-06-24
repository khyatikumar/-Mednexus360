import React, { useEffect, useMemo, useState } from 'react';
import { patientsApi } from '../services/api';
import type { Patient, PatientPayload } from '../types';

const emptyForm: PatientPayload = {
  user_id: 0,
  age: 0,
  gender: '',
  blood_group: '',
  emergency_contact: '',
};

export default function PatientsPage({
  canCreate = false,
  canManage = false,
}: {
  canCreate?: boolean;
  canManage?: boolean;
}) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selected, setSelected] = useState<Patient | null>(null);
  const [form, setForm] = useState<PatientPayload>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loadPatients = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await patientsApi.list();
      setPatients(data);
      setSelected((current) => current ?? data[0] ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load patients.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

  const filtered = useMemo(() => {
    const value = search.trim().toLowerCase();
    if (!value) return patients;
    return patients.filter((patient) =>
      [patient.id, patient.user_id, patient.gender, patient.blood_group, patient.emergency_contact]
        .join(' ')
        .toLowerCase()
        .includes(value),
    );
  }, [patients, search]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!editingId && !canCreate) {
      setError('Only patient users can create patient profiles in the current backend RBAC.');
      return;
    }

    if (editingId && !canManage) {
      setError('Only hospital admins can edit patient profiles from this screen.');
      return;
    }

    if (!form.user_id || !form.age || !form.gender || !form.blood_group || !form.emergency_contact) {
      setError('All patient fields are required.');
      return;
    }

    setIsSaving(true);
    try {
      if (editingId) {
        await patientsApi.update(editingId, form);
        setSuccess('Patient updated successfully.');
      } else {
        await patientsApi.create(form);
        setSuccess('Patient created successfully.');
      }
      setForm(emptyForm);
      setEditingId(null);
      await loadPatients();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save patient.');
    } finally {
      setIsSaving(false);
    }
  };

  const startEdit = (patient: Patient) => {
    setEditingId(patient.id);
    setForm({
      user_id: patient.user_id,
      age: patient.age,
      gender: patient.gender,
      blood_group: patient.blood_group,
      emergency_contact: patient.emergency_contact,
    });
  };

  const remove = async (patient: Patient) => {
    if (!canManage) return;
    if (!window.confirm(`Delete patient #${patient.id}?`)) return;
    setError(null);
    try {
      await patientsApi.remove(patient.id);
      setSuccess('Patient deleted successfully.');
      setSelected(null);
      await loadPatients();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to delete patient.');
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-3xl font-bold">Patients</h2>
        <p className="text-sm text-[#45464d]">Live data from `/patients/`.</p>
      </header>

      <Status error={error} success={success} />

      <div className="grid xl:grid-cols-[1fr_360px] gap-6">
        <section className="bg-white border border-[#c6c6cd] rounded-lg overflow-hidden">
          <div className="p-4 border-b border-[#c6c6cd]">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search patients by ID, gender, blood group, contact"
              className="w-full h-10 px-3 rounded-lg border border-[#c6c6cd] text-sm outline-none focus:ring-2 focus:ring-[#0051d5]"
            />
          </div>
          {isLoading ? (
            <SkeletonRows />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#eff4ff] text-xs uppercase text-[#45464d]">
                  <tr>
                    <th className="p-4">ID</th>
                    <th className="p-4">User</th>
                    <th className="p-4">Age</th>
                    <th className="p-4">Gender</th>
                    <th className="p-4">Blood</th>
                    <th className="p-4">Contact</th>
                    {canManage && <th className="p-4">Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#c6c6cd] text-sm">
                  {filtered.map((patient) => (
                    <tr
                      key={patient.id}
                      onClick={() => setSelected(patient)}
                      className="hover:bg-[#f8f9ff] cursor-pointer"
                    >
                      <td className="p-4 font-bold">#{patient.id}</td>
                      <td className="p-4">{patient.user_id}</td>
                      <td className="p-4">{patient.age}</td>
                      <td className="p-4">{patient.gender}</td>
                      <td className="p-4">{patient.blood_group}</td>
                      <td className="p-4">{patient.emergency_contact}</td>
                      {canManage && (
                        <td className="p-4">
                          <div className="flex gap-2">
                            <button className="text-[#0051d5] font-bold text-xs" onClick={() => startEdit(patient)}>
                              Edit
                            </button>
                            <button className="text-red-600 font-bold text-xs" onClick={() => remove(patient)}>
                              Delete
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <aside className="space-y-4">
          <section className="bg-white border border-[#c6c6cd] rounded-lg p-5">
            <h3 className="font-bold">Selected Patient</h3>
            {selected ? (
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <Info label="Patient ID" value={`#${selected.id}`} />
                <Info label="User ID" value={selected.user_id} />
                <Info label="Age" value={selected.age} />
                <Info label="Gender" value={selected.gender} />
                <Info label="Blood Group" value={selected.blood_group} />
                <Info label="Emergency" value={selected.emergency_contact} />
              </div>
            ) : (
              <p className="text-sm text-[#45464d] mt-3">Select a patient from the table.</p>
            )}
          </section>

          {(canCreate || editingId) && (
            <section className="bg-white border border-[#c6c6cd] rounded-lg p-5">
              <h3 className="font-bold">{editingId ? `Edit Patient #${editingId}` : 'Create Patient'}</h3>
              <form onSubmit={submit} className="mt-4 space-y-3">
                <NumberInput label="User ID" value={form.user_id} onChange={(user_id) => setForm({ ...form, user_id })} />
                <NumberInput label="Age" value={form.age} onChange={(age) => setForm({ ...form, age })} />
                <TextInput label="Gender" value={form.gender} onChange={(gender) => setForm({ ...form, gender })} />
                <TextInput label="Blood Group" value={form.blood_group} onChange={(blood_group) => setForm({ ...form, blood_group })} />
                <TextInput label="Emergency Contact" value={form.emergency_contact} onChange={(emergency_contact) => setForm({ ...form, emergency_contact })} />
                <button
                  disabled={isSaving}
                  className="w-full h-10 bg-[#0051d5] text-white rounded-lg text-xs font-bold disabled:opacity-70"
                >
                  {isSaving ? 'Saving...' : editingId ? 'Update Patient' : 'Create Patient'}
                </button>
              </form>
            </section>
          )}
        </aside>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="p-3 rounded-lg bg-[#f8f9ff] border border-[#c6c6cd]">
      <p className="text-[10px] font-bold uppercase text-[#45464d]">{label}</p>
      <p className="font-bold mt-1 break-words">{value}</p>
    </div>
  );
}

function TextInput({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block text-xs font-bold text-[#45464d]">
      {label}
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 w-full h-10 px-3 rounded-lg border border-[#c6c6cd] text-sm"
        required
      />
    </label>
  );
}

function NumberInput({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <label className="block text-xs font-bold text-[#45464d]">
      {label}
      <input
        type="number"
        value={value || ''}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-1 w-full h-10 px-3 rounded-lg border border-[#c6c6cd] text-sm"
        required
      />
    </label>
  );
}

function Status({ error, success }: { error: string | null; success: string | null }) {
  if (!error && !success) return null;
  return (
    <div className={`p-3 rounded-lg border text-sm font-semibold ${error ? 'bg-red-50 border-red-200 text-red-700' : 'bg-emerald-50 border-emerald-200 text-emerald-800'}`}>
      {error ?? success}
    </div>
  );
}

function SkeletonRows() {
  return (
    <div className="p-4 space-y-3">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="h-12 rounded-lg bg-[#eff4ff] animate-pulse" />
      ))}
    </div>
  );
}
