/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Appointment, MedicalRecord, ActivityLog } from '../types';

interface PatientDashboardProps {
  appointments: Appointment[];
  records: MedicalRecord[];
  logs: ActivityLog[];
  onNavigateToTab: (tab: string) => void;
  onNewConsultation: () => void;
}

export default function PatientDashboard({ 
  appointments, 
  records, 
  logs, 
  onNavigateToTab, 
  onNewConsultation 
}: PatientDashboardProps) {

  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [telehealthCall, setTelehealthCall] = useState<Appointment | null>(null);
  const [reminderSet, setReminderSet] = useState<string | null>(null);

  const handleSetReminder = (aptId: string, docName: string) => {
    setReminderSet(docName);
    setTimeout(() => setReminderSet(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-[#0b1c30] tracking-tight">Good morning, Alex.</h2>
          <p className="text-base text-[#45464d]">Your health at a glance today.</p>
        </div>
        <div className="flex gap-2 self-start md:self-auto">
          <span className="px-3 py-1 bg-[#6ffbbe]/20 text-[#005236] rounded-full text-xs font-semibold flex items-center gap-1 border border-[#6ffbbe]/30">
            <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
            Account Verified
          </span>
          <span className="px-3 py-1 bg-[#d3e4fe] text-[#003ea8] rounded-full text-xs font-medium">Last sync: 2 mins ago</span>
        </div>
      </section>

      {/* Reminder Alert Notification */}
      {reminderSet && (
        <div className="p-4 rounded-xl bg-[#6ffbbe]/15 border border-[#4edea3]/40 text-[#002113] flex items-center justify-between animate-fade-in shadow-sm">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#009668]">notifications_active</span>
            <span className="text-sm font-medium">Reminder successfully registered for consultation with {reminderSet}! We will notify you 15m prior.</span>
          </div>
          <button onClick={() => setReminderSet(null)} className="text-xs hover:underline font-bold">Dismiss</button>
        </div>
      )}

      {/* Statistics Grid (Bento Style) */}
      <section className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {/* AI Health Score */}
        <div className="bg-white border border-[#c6c6cd] rounded-xl p-5 hover:shadow-md transition-all ai-glow relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold text-[#45464d] uppercase tracking-wider">Health Score</span>
            <span className="material-symbols-outlined text-[#009668] animate-pulse" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative w-20 h-20 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90">
                <circle className="text-[#eff4ff]" cx="40" cy="40" fill="transparent" r="34" stroke="currentColor" strokeWidth="6"></circle>
                <circle className="text-[#009668]" cx="40" cy="40" fill="transparent" r="34" stroke="currentColor" strokeDasharray="213" strokeDashoffset="38" strokeWidth="6" strokeLinecap="round"></circle>
              </svg>
              <span className="absolute text-xl font-bold text-[#0b1c30]">82</span>
            </div>
            <div>
              <p className="text-lg font-bold text-[#009668]">Optimized</p>
              <p className="text-xs text-[#45464d]">+4% from last month</p>
            </div>
          </div>
        </div>

        {/* Next Appointment Card */}
        <div className="bg-white border border-[#c6c6cd] rounded-xl p-5 flex flex-col justify-between hover:shadow-md transition-all">
          <span className="text-xs font-bold text-[#45464d] uppercase tracking-wider mb-2 block">Next Appointment</span>
          <div>
            <h3 className="text-2xl font-bold text-[#0b1c30]">Oct 24, 2023</h3>
            <p className="text-xs text-[#45464d] font-semibold mt-1">10:30 AM • Dr. Sarah Jenkins</p>
          </div>
          <div 
            onClick={() => handleSetReminder('apt-1', 'Dr. Sarah Jenkins')}
            className="mt-4 flex items-center gap-1 text-[#0051d5] font-bold text-xs cursor-pointer hover:underline"
          >
            Set Reminder <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </div>
        </div>

        {/* Latest Lab Result */}
        <div className="bg-white border border-[#c6c6cd] rounded-xl p-5 flex flex-col justify-between hover:shadow-md transition-all">
          <span className="text-xs font-bold text-[#45464d] uppercase tracking-wider mb-2 block">Latest Lab Result</span>
          <div>
            <h3 className="text-2xl font-bold text-[#0b1c30]">Metabolic Panel</h3>
            <p className="text-xs text-[#009668] flex items-center gap-1 font-semibold mt-1">
              <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              All in normal range
            </p>
          </div>
          <div 
            onClick={() => setSelectedRecord(records[1] || records[0])}
            className="mt-4 flex items-center gap-1 text-[#45464d] font-bold text-xs cursor-pointer hover:text-[#0b1c30] hover:underline"
          >
            View Report <span className="material-symbols-outlined text-sm">open_in_new</span>
          </div>
        </div>

        {/* Activity Trends (Bar graph mockup matching Image 2 exactly) */}
        <div className="xl:flex bg-white border border-[#c6c6cd] rounded-xl p-5 flex-col justify-between hover:shadow-md transition-all relative overflow-hidden">
          <span className="text-xs font-bold text-[#45464d] uppercase tracking-wider mb-4 block">Activity Trends</span>
          <div className="h-16 w-full flex items-end gap-1.5 px-1">
            <div className="w-full bg-[#dbe1ff] rounded-t h-[40%] hover:brightness-95 transition-all"></div>
            <div className="w-full bg-[#dbe1ff] rounded-t h-[60%] hover:brightness-95 transition-all"></div>
            <div className="w-full bg-[#0051d5] rounded-t h-[85%] hover:brightness-95 transition-all"></div>
            <div className="w-full bg-[#dbe1ff] rounded-t h-[55%] hover:brightness-95 transition-all"></div>
            <div className="w-full bg-[#dbe1ff] rounded-t h-[70%] hover:brightness-95 transition-all"></div>
            <div className="w-full bg-[#dbe1ff] rounded-t h-[45%] hover:brightness-95 transition-all"></div>
            <div className="w-full bg-[#dbe1ff] rounded-t h-[30%] hover:brightness-95 transition-all"></div>
          </div>
          <p className="text-[11px] font-semibold text-[#45464d] mt-2 text-center">Steps: 8.4k avg</p>
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Appointments & Records */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Upcoming Appointments */}
          <section className="bg-white border border-[#c6c6cd] rounded-xl overflow-hidden shadow-sm">
            <div className="p-5 border-b border-[#c6c6cd] flex justify-between items-center bg-[#f8f9ff]">
              <h3 className="text-lg font-bold text-[#0b1c30]">Upcoming Appointments</h3>
              <button 
                onClick={() => onNavigateToTab('Appointments')}
                className="text-[#0051d5] hover:underline text-xs font-bold cursor-pointer"
              >
                View Calendar
              </button>
            </div>
            <div className="divide-y divide-[#c6c6cd]">
              {appointments.slice(0, 2).map((apt) => (
                <div key={apt.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#eff4ff] transition-colors duration-150">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-[#eff4ff] overflow-hidden border border-[#c6c6cd] shrink-0">
                      <img className="w-full h-full object-cover" src={apt.doctorImage} alt={apt.doctorName} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#0b1c30]">{apt.doctorName}</h4>
                      <p className="text-xs text-[#45464d]">{apt.doctorRole} • {apt.date}, {apt.time}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 self-start sm:self-auto">
                    <button 
                      onClick={() => setTelehealthCall(apt)}
                      className="bg-[#0051d5] text-white hover:bg-[#00174b] px-4 py-2 rounded-lg font-bold text-xs shadow-sm transition-all active:scale-95 cursor-pointer"
                    >
                      Join Call
                    </button>
                    <button 
                      onClick={() => alert(`Reschedule workflow selected for ${apt.doctorName}. Our coordinator will contact you via email shortly.`)}
                      className="border border-[#c6c6cd] text-[#45464d] hover:bg-[#eaf1ff] px-4 py-2 rounded-lg font-bold text-xs transition-colors cursor-pointer"
                    >
                      Reschedule
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Recent Medical Records */}
          <section className="bg-white border border-[#c6c6cd] rounded-xl overflow-hidden shadow-sm">
            <div className="p-5 border-b border-[#c6c6cd] flex justify-between items-center bg-[#f8f9ff]">
              <h3 className="text-lg font-bold text-[#0b1c30]">Recent Medical Records</h3>
              <button 
                onClick={() => {
                  alert("Preparing complete encrypted clinical records ZIP... Download started!");
                }}
                className="text-[#45464d] hover:text-[#0b1c30] text-xs font-bold cursor-pointer hover:underline"
              >
                Download All
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#eff4ff]">
                  <tr>
                    <th className="p-4 text-xs font-bold text-[#45464d] uppercase tracking-wider">Date</th>
                    <th className="p-4 text-xs font-bold text-[#45464d] uppercase tracking-wider">Doctor</th>
                    <th className="p-4 text-xs font-bold text-[#45464d] uppercase tracking-wider">Reason</th>
                    <th className="p-4 text-xs font-bold text-[#45464d] uppercase tracking-wider">Status</th>
                    <th className="p-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#c6c6cd]">
                  {records.map((rec) => (
                    <tr 
                      key={rec.id} 
                      onClick={() => setSelectedRecord(rec)}
                      className="hover:bg-[#eaf1ff] transition-colors cursor-pointer group"
                    >
                      <td className="p-4 text-xs text-[#0b1c30]">{rec.date}</td>
                      <td className="p-4 text-xs font-bold text-[#0b1c30]">{rec.doctorName}</td>
                      <td className="p-4 text-xs text-[#0b1c30]">{rec.reason}</td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 bg-[#dce9ff] text-[#00174b] rounded-full text-[10px] font-semibold">
                          {rec.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <span className="material-symbols-outlined text-[#76777d] group-hover:text-[#0051d5] transition-colors text-lg">
                          visibility
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* Right Column: AI Insights & Activity Timeline */}
        <div className="lg:col-span-4 space-y-6">
          {/* AI Health Insights */}
          <section className="bg-[#213145] text-white rounded-xl p-5 relative overflow-hidden ai-glow">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#4edea3] rounded-full blur-[60px] opacity-20"></div>
            <div className="flex items-center gap-2 mb-4 text-[#4edea3]">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                auto_awesome
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider">AI Insight</span>
            </div>
            <h3 className="text-lg font-bold mb-2">Time for a Check-up?</h3>
            <p className="text-xs text-[#dce9ff] opacity-80 mb-6 leading-relaxed">
              Based on your recent wearable data and lab trends, we recommend scheduling a follow-up metabolic screening. Your vitamin D levels showed a downward trend last quarter.
            </p>
            <button 
              onClick={() => onNavigateToTab('Symptom Checker')}
              className="w-full bg-[#4edea3] hover:bg-[#6ffbbe] text-[#002113] py-2.5 rounded-lg font-bold text-xs shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              Consult Symptom Checker AI
            </button>
          </section>

          {/* Activity Feed */}
          <section className="bg-white border border-[#c6c6cd] rounded-xl p-5 shadow-sm">
            <h3 className="text-base font-bold text-[#0b1c30] mb-5">Recent Activity</h3>
            <div className="space-y-6 relative before:content-[''] before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[1.5px] before:bg-[#c6c6cd]">
              
              {/* Item 1 */}
              <div className="relative pl-8">
                <div className="absolute left-0 top-0.5 w-6 h-6 rounded-full bg-[#316bf3] flex items-center justify-center text-white ring-4 ring-white">
                  <span className="material-symbols-outlined text-[14px]">description</span>
                </div>
                <p className="text-xs font-bold text-[#0b1c30]">New report uploaded</p>
                <p className="text-[11px] text-[#45464d] mt-0.5">Cardiology Results from Dr. Jenkins</p>
                <p className="text-[10px] text-[#76777d]/80 font-semibold mt-1">2 hours ago</p>
              </div>

              {/* Item 2 */}
              <div className="relative pl-8">
                <div className="absolute left-0 top-0.5 w-6 h-6 rounded-full bg-[#eff4ff] flex items-center justify-center text-[#0051d5] ring-4 ring-white border border-[#c6c6cd]">
                  <span className="material-symbols-outlined text-[14px]">notifications_active</span>
                </div>
                <p className="text-xs font-bold text-[#0b1c30]">Prescription renewed</p>
                <p className="text-[11px] text-[#45464d] mt-0.5">Lisinopril 10mg - Refills: 3</p>
                <p className="text-[10px] text-[#76777d]/80 font-semibold mt-1">Yesterday</p>
              </div>

              {/* Item 3 */}
              <div className="relative pl-8">
                <div className="absolute left-0 top-0.5 w-6 h-6 rounded-full bg-[#002113] flex items-center justify-center text-[#6ffbbe] ring-4 ring-white">
                  <span className="material-symbols-outlined text-[14px]">calendar_month</span>
                </div>
                <p className="text-xs font-bold text-[#0b1c30]">Appointment confirmed</p>
                <p className="text-[11px] text-[#45464d] mt-0.5">With Dr. Michael Chen</p>
                <p className="text-[10px] text-[#76777d]/80 font-semibold mt-1">Oct 20, 2023</p>
              </div>
            </div>
          </section>

          {/* Profile Quick Actions */}
          <div 
            onClick={() => onNavigateToTab('Settings')}
            className="bg-white border border-[#c6c6cd] rounded-xl p-4 flex items-center justify-between hover:bg-[#eff4ff] transition-colors cursor-pointer shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#dae2fd] flex items-center justify-center text-[#00174b]">
                <span className="material-symbols-outlined">shield</span>
              </div>
              <div>
                <p className="text-xs font-bold text-[#0b1c30]">Privacy Settings</p>
                <p className="text-[10px] text-[#45464d]">Manage data sharing, consent logs</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-[#76777d]">chevron_right</span>
          </div>
        </div>
      </div>

      {/* Record Inspection Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-[#c6c6cd]">
            <div className="p-6 bg-[#eff4ff] border-b border-[#c6c6cd] flex justify-between items-center">
              <div>
                <span className="px-2.5 py-1 bg-[#dce9ff] text-[#00174b] rounded-full text-[10px] font-bold uppercase">
                  {selectedRecord.status}
                </span>
                <h3 className="text-lg font-bold text-[#0b1c30] mt-2">{selectedRecord.reason}</h3>
              </div>
              <button 
                onClick={() => setSelectedRecord(null)}
                className="w-8 h-8 rounded-full bg-white hover:bg-[#cbdbf5] flex items-center justify-center text-[#0b1c30] transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <p className="text-xs text-[#76777d] font-semibold uppercase">Consulting Generalist</p>
                <p className="text-sm font-bold text-[#0b1c30] mt-0.5">{selectedRecord.doctorName}</p>
              </div>
              <div>
                <p className="text-xs text-[#76777d] font-semibold uppercase">Registered Date</p>
                <p className="text-sm text-[#0b1c30] mt-0.5">{selectedRecord.date}</p>
              </div>
              {selectedRecord.vitalSigns && (
                <div className="p-3 rounded-lg bg-[#f8f9ff] border border-[#c6c6cd]">
                  <p className="text-xs text-[#0051d5] font-bold">Vitals & Readings</p>
                  <p className="text-xs text-[#0b1c30] font-mono mt-1 font-semibold">{selectedRecord.vitalSigns}</p>
                </div>
              )}
              <div>
                <p className="text-xs text-[#76777d] font-semibold uppercase">Clinical Notes</p>
                <p className="text-xs text-[#45464d] mt-1 leading-relaxed bg-[#f8f9ff] p-3 rounded-lg border border-[#c6c6cd]">
                  {selectedRecord.notes || "No extra medical files attached."}
                </p>
              </div>
            </div>
            <div className="p-4 bg-[#f8f9ff] border-t border-[#c6c6cd] flex justify-end gap-2">
              <button 
                onClick={() => alert("Printing formatted report PDF...")}
                className="px-4 py-2 bg-white hover:bg-[#eff4ff] border border-[#c6c6cd] text-[#0b1c30] text-xs font-bold rounded-lg cursor-pointer transition-colors"
              >
                Print PDF
              </button>
              <button 
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-2 bg-[#0051d5] text-white hover:bg-[#00174b] text-xs font-bold rounded-lg cursor-pointer transition-colors"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Telehealth Call Room Modal */}
      {telehealthCall && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#131b2e]/90 backdrop-blur-md">
          <div className="bg-[#131b2e] text-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-white/15">
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
                <h3 className="text-base font-bold">Clinical Care Session (Encrypted Room)</h3>
              </div>
              <p className="text-xs text-white/60">Partner ID: {telehealthCall.id}</p>
            </div>
            
            {/* Visual Call Grid mockup */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-950/40">
              <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 bg-slate-900">
                <img className="w-full h-full object-cover opacity-80" src={telehealthCall.doctorImage} alt={telehealthCall.doctorName} />
                <div className="absolute bottom-3 left-3 bg-[#131b2e]/80 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-semibold">
                  {telehealthCall.doctorName} (Cardiologist)
                </div>
              </div>
              <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 bg-slate-900 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-[#0051d5] text-white flex items-center justify-center font-bold text-xl uppercase">
                  AX
                </div>
                <div className="absolute bottom-3 left-3 bg-[#131b2e]/80 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-semibold">
                  You (Alex - Patient)
                </div>
                <div className="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                  Muted
                </div>
              </div>
            </div>

            <div className="p-6 flex flex-col md:flex-row items-center justify-between gap-4 bg-[#131b2e] border-t border-white/10">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#6ffbbe]">shield_with_heart</span>
                <span className="text-xs text-white/80">AES-256 peer-to-peer session completely HIPAA-compliant.</span>
              </div>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => alert("Toggling microphone")}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center cursor-pointer transition-all"
                >
                  <span className="material-symbols-outlined text-white text-lg">mic_off</span>
                </button>
                <button 
                  onClick={() => alert("Toggling camera")}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center cursor-pointer transition-all"
                >
                  <span className="material-symbols-outlined text-white text-lg">videocam</span>
                </button>
                <button 
                  onClick={() => setTelehealthCall(null)}
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl cursor-pointer transition-all"
                >
                  Leave Call
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
