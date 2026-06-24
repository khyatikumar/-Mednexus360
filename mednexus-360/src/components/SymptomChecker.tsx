import React, { useState } from 'react';
import { aiApi } from '../services/api';
import type { DoctorRecommendationResponse, SymptomResponse } from '../types';

export default function SymptomChecker() {
  const [symptoms, setSymptoms] = useState('');
  const [analysis, setAnalysis] = useState<SymptomResponse | null>(null);
  const [recommendation, setRecommendation] = useState<DoctorRecommendationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setAnalysis(null);
    setRecommendation(null);

    if (symptoms.trim().length < 6) {
      setError('Please describe symptoms in a little more detail.');
      return;
    }

    setLoading(true);
    try {
      const [symptomResult, doctorResult] = await Promise.all([
        aiApi.symptoms(symptoms),
        aiApi.recommendDoctor(symptoms),
      ]);
      setAnalysis(symptomResult);
      setRecommendation(doctorResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to analyze symptoms.');
    } finally {
      setLoading(false);
    }
  };

  const urgent = analysis?.urgency_level.toLowerCase().includes('high') || analysis?.urgency_level.toLowerCase().includes('urgent');

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-3xl font-bold">AI Tools</h2>
        <p className="text-sm text-[#45464d]">Calls `/symptom-checker/` and `/doctor-recommendation/` with the same symptom text.</p>
      </header>

      <section className="bg-white border border-[#c6c6cd] rounded-lg p-5">
        <form onSubmit={submit} className="space-y-4">
          <label className="block text-xs font-bold text-[#45464d] uppercase">
            Symptoms
            <textarea
              value={symptoms}
              onChange={(event) => setSymptoms(event.target.value)}
              rows={5}
              className="mt-2 w-full p-4 rounded-lg border border-[#c6c6cd] text-sm outline-none focus:ring-2 focus:ring-[#0051d5]"
              placeholder="Example: Fever, dry cough, chest tightness, and fatigue for two days..."
              required
            />
          </label>
          {error && <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm font-semibold">{error}</div>}
          <button disabled={loading} className="h-11 px-5 bg-[#0051d5] text-white rounded-lg text-xs font-bold disabled:opacity-70 flex items-center gap-2">
            {loading && <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />}
            Analyze Symptoms
          </button>
        </form>
      </section>

      {loading && (
        <div className="grid md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, index) => <div key={index} className="h-36 rounded-lg bg-[#eff4ff] animate-pulse" />)}
        </div>
      )}

      {analysis && (
        <section className="grid xl:grid-cols-[1fr_380px] gap-6">
          <div className="bg-white border border-[#c6c6cd] rounded-lg p-5 space-y-5">
            <div className={`rounded-lg p-4 border ${urgent ? 'bg-red-50 border-red-200 text-red-800' : 'bg-emerald-50 border-emerald-200 text-emerald-800'}`}>
              <p className="text-xs font-bold uppercase">Urgency Level</p>
              <p className="text-2xl font-bold mt-1">{analysis.urgency_level}</p>
            </div>
            <div>
              <h3 className="font-bold">Possible Conditions</h3>
              <div className="mt-3 grid sm:grid-cols-2 gap-3">
                {analysis.possible_conditions.map((condition) => (
                  <div key={condition} className="p-4 rounded-lg bg-[#f8f9ff] border border-[#c6c6cd] text-sm font-semibold">{condition}</div>
                ))}
              </div>
            </div>
          </div>

          <aside className="bg-white border border-[#c6c6cd] rounded-lg p-5 space-y-4">
            <div>
              <p className="text-xs font-bold uppercase text-[#45464d]">Recommended Specialist</p>
              <p className="text-2xl font-bold text-[#0051d5] mt-1">{analysis.recommended_specialist}</p>
            </div>
            {recommendation && (
              <div>
                <p className="text-xs font-bold uppercase text-[#45464d]">Matching Doctors</p>
                <div className="mt-3 space-y-3">
                  {recommendation.doctors.length ? recommendation.doctors.map((doctor) => (
                    <div key={doctor.id} className="p-3 rounded-lg bg-[#f8f9ff] border border-[#c6c6cd]">
                      <p className="font-bold">Doctor #{doctor.id}</p>
                      <p className="text-sm text-[#45464d]">{doctor.specialization} · {doctor.experience_years} years experience</p>
                      <p className="text-xs text-emerald-700 font-bold mt-2">Availability: check appointments module</p>
                    </div>
                  )) : (
                    <p className="text-sm text-[#45464d]">No matching doctors returned by the backend.</p>
                  )}
                </div>
              </div>
            )}
          </aside>
        </section>
      )}
    </div>
  );
}
