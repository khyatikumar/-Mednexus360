import React, { useEffect, useState } from 'react';
import { medicalRecordsApi, doctorsApi, patientsApi } from '../services/api';
import type { Doctor, MedicalRecord, MedicalRecordPayload, Patient } from '../types';

const emptyRecord: MedicalRecordPayload = {
  patient_id: 0,
  doctor_id: 0,
  diagnosis: '',
  prescription: '',
  notes: '',
};

export default function MedicalRecordsPage() {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selected, setSelected] = useState<MedicalRecord | null>(null);
  const [form, setForm] = useState<MedicalRecordPayload>(emptyRecord);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const [recordData, patientData, doctorData] = await Promise.all([
        medicalRecordsApi.list(),
        patientsApi.list(),
        doctorsApi.list(),
      ]);
      setRecords(recordData);
      setPatients(patientData);
      setDoctors(doctorData);
      setSelected((current) => current ?? recordData[0] ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load medical records.');
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
    if (!form.patient_id || !form.doctor_id || !form.diagnosis || !form.prescription || !form.notes) {
      setError('All record fields are required.');
      return;
    }

    setSaving(true);
    try {
      await medicalRecordsApi.create(form);
      setForm(emptyRecord);
      setSuccess('Medical record created successfully.');
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create medical record.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-3xl font-bold">Medical Records</h2>
        <p className="text-sm text-[#45464d]">Live record creation and patient history from `/medical-records/`.</p>
      </header>
      {(error || success) && <div className={`p-3 rounded-lg border text-sm font-semibold ${error ? 'bg-red-50 border-red-200 text-red-700' : 'bg-emerald-50 border-emerald-200 text-emerald-800'}`}>{error ?? success}</div>}
      <div className="grid xl:grid-cols-[380px_1fr_380px] gap-6">
        <section className="bg-white border border-[#c6c6cd] rounded-lg overflow-hidden">
          <div className="p-4 border-b border-[#c6c6cd] font-bold">Record Index</div>
          {loading ? (
            <div className="p-4 space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-16 rounded bg-[#eff4ff] animate-pulse" />)}</div>
          ) : (
            <div className="divide-y divide-[#c6c6cd] max-h-[620px] overflow-y-auto">
              {records.map((record) => (
                <button key={record.id} onClick={() => setSelected(record)} className={`w-full text-left p-4 hover:bg-[#f8f9ff] ${selected?.id === record.id ? 'bg-[#eff4ff]' : ''}`}>
                  <p className="text-sm font-bold">{record.diagnosis ?? record.reason ?? 'Untitled record'}</p>
                  <p className="text-xs text-[#45464d] mt-1">Patient #{record.patient_id} · Doctor #{record.doctor_id}</p>
                  <p className="text-[10px] text-[#45464d] mt-1">{record.created_at ? new Date(record.created_at).toLocaleString() : record.date}</p>
                </button>
              ))}
            </div>
          )}
        </section>

        <section className="bg-white border border-[#c6c6cd] rounded-lg p-6 min-h-[360px]">
          {selected ? (
            <div className="space-y-5">
              <div>
                <p className="text-xs font-bold uppercase text-[#0051d5]">Record #{selected.id}</p>
                <h3 className="text-2xl font-bold mt-1">{selected.diagnosis ?? selected.reason ?? 'Untitled record'}</h3>
                <p className="text-sm text-[#45464d] mt-1">Created {selected.created_at ? new Date(selected.created_at).toLocaleString() : selected.date}</p>
              </div>
              <Block label="Prescription" value={selected.prescription ?? 'No prescription provided.'} />
              <Block label="Clinical Notes" value={selected.notes ?? 'No notes provided.'} />
              <div className="grid sm:grid-cols-2 gap-3">
                <Info label="Patient ID" value={selected.patient_id} />
                <Info label="Doctor ID" value={selected.doctor_id} />
              </div>
            </div>
          ) : (
            <p className="text-sm text-[#45464d]">Select a record to view details.</p>
          )}
        </section>

        <form onSubmit={submit} className="bg-white border border-[#c6c6cd] rounded-lg p-5 space-y-3 h-fit">
          <h3 className="font-bold">Create Record</h3>
          <label className="text-xs font-bold text-[#45464d] block">
            Patient
            <select value={form.patient_id || ''} onChange={(event) => setForm({ ...form, patient_id: Number(event.target.value) })} className="mt-1 w-full h-10 px-3 rounded-lg border border-[#c6c6cd] text-sm" required>
              <option value="">Select patient</option>
              {patients.map((patient) => <option key={patient.id} value={patient.id}>Patient #{patient.id}</option>)}
            </select>
          </label>
          <label className="text-xs font-bold text-[#45464d] block">
            Doctor
            <select value={form.doctor_id || ''} onChange={(event) => setForm({ ...form, doctor_id: Number(event.target.value) })} className="mt-1 w-full h-10 px-3 rounded-lg border border-[#c6c6cd] text-sm" required>
              <option value="">Select doctor</option>
              {doctors.map((doctor) => <option key={doctor.id} value={doctor.id}>Doctor #{doctor.id} · {doctor.specialization}</option>)}
            </select>
          </label>
          <TextArea label="Diagnosis" value={form.diagnosis} onChange={(diagnosis) => setForm({ ...form, diagnosis })} />
          <TextArea label="Prescription" value={form.prescription} onChange={(prescription) => setForm({ ...form, prescription })} />
          <TextArea label="Notes" value={form.notes} onChange={(notes) => setForm({ ...form, notes })} />
          <button disabled={saving} className="w-full h-10 bg-[#0051d5] text-white rounded-lg text-xs font-bold disabled:opacity-70">{saving ? 'Saving...' : 'Create Record'}</button>
        </form>
      </div>
    </div>
  );
}

function TextArea({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block text-xs font-bold text-[#45464d]">
      {label}
      <textarea value={value} onChange={(event) => onChange(event.target.value)} rows={3} className="mt-1 w-full p-3 rounded-lg border border-[#c6c6cd] text-sm" required />
    </label>
  );
}

function Block({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase text-[#45464d]">{label}</p>
      <p className="mt-2 p-4 rounded-lg bg-[#f8f9ff] border border-[#c6c6cd] text-sm leading-6">{value}</p>
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
