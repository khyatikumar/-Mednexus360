import React, { useEffect, useState } from 'react';
import { patientsApi, reportsApi } from '../services/api';
import type { Patient, Report } from '../types';

export default function ReportsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [patientId, setPatientId] = useState<number>(0);
  const [reports, setReports] = useState<Report[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    async function loadPatients() {
      try {
        const data = await patientsApi.list();
        setPatients(data);
        setPatientId(data[0]?.id ?? 0);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load patients.');
      } finally {
        setLoading(false);
      }
    }
    loadPatients();
  }, []);

  useEffect(() => {
    if (!patientId) return;
    reportsApi.byPatient(patientId).then(setReports).catch((err: unknown) => {
      setError(err instanceof Error ? err.message : 'Unable to load reports.');
    });
  }, [patientId]);

  const upload = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    if (!patientId || !file) {
      setError('Select a patient and PDF report before uploading.');
      return;
    }

    setUploading(true);
    setProgress(0);
    try {
      await reportsApi.upload(patientId, file, setProgress);
      setSuccess('Report uploaded successfully.');
      setFile(null);
      setReports(await reportsApi.byPatient(patientId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to upload report.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-3xl font-bold">Reports</h2>
        <p className="text-sm text-[#45464d]">Upload and review patient lab reports, scans, and discharge summaries as PDF files.</p>
      </header>
      {(error || success) && <div className={`p-3 rounded-lg border text-sm font-semibold ${error ? 'bg-red-50 border-red-200 text-red-700' : 'bg-emerald-50 border-emerald-200 text-emerald-800'}`}>{error ?? success}</div>}

      <section className="bg-white border border-[#c6c6cd] rounded-lg p-5">
        <form onSubmit={upload} className="grid md:grid-cols-[1fr_1fr_auto] gap-3 items-end">
          <label className="text-xs font-bold text-[#45464d]">
            Patient
            <select disabled={loading} value={patientId || ''} onChange={(event) => setPatientId(Number(event.target.value))} className="mt-1 w-full h-10 px-3 rounded-lg border border-[#c6c6cd] text-sm">
              <option value="">Select patient</option>
              {patients.map((patient) => <option key={patient.id} value={patient.id}>Patient #{patient.id}</option>)}
            </select>
          </label>
          <label className="text-xs font-bold text-[#45464d]">
            PDF Report
            <input type="file" accept="application/pdf" onChange={(event) => setFile(event.target.files?.[0] ?? null)} className="mt-1 w-full h-10 text-sm file:h-10 file:px-4 file:rounded-lg file:border-0 file:bg-[#eff4ff] file:text-[#0051d5] file:font-bold" />
          </label>
          <button disabled={uploading} className="h-10 px-5 bg-[#0051d5] text-white rounded-lg text-xs font-bold disabled:opacity-70">{uploading ? 'Uploading...' : 'Upload'}</button>
        </form>
        {uploading && <div className="mt-4 h-2 rounded bg-[#eff4ff] overflow-hidden"><div className="h-full bg-[#0051d5]" style={{ width: `${progress}%` }} /></div>}
      </section>

      <section className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {reports.map((report) => (
          <article key={report.id} className="bg-white border border-[#c6c6cd] rounded-lg p-5">
            <p className="text-xs font-bold text-[#0051d5]">Report #{report.id}</p>
            <h3 className="font-bold mt-1 break-words">{report.report_name}</h3>
            <p className="text-sm text-[#45464d] mt-2">Uploaded {new Date(report.uploaded_at).toLocaleString()}</p>
            <p className="mt-4 text-xs font-bold text-[#0051d5] break-words">
              Secure file reference: {report.file_path}
            </p>
            <p className="mt-1 text-[11px] text-[#45464d]">
              Download access is not available for this report yet.
            </p>
          </article>
        ))}
      </section>
    </div>
  );
}
