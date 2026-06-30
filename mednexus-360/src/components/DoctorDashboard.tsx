/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Appointment, ActivityLog, MedicalRecord } from '../types';

interface DoctorDashboardProps {
  appointments: Appointment[];
  logs: ActivityLog[];
  onNavigateToTab: (tab: string) => void;
  onNewConsultation: () => void;
}

export default function DoctorDashboard({ 
  appointments, 
  logs, 
  onNavigateToTab, 
  onNewConsultation 
}: DoctorDashboardProps) {

  const [activeConsultation, setActiveConsultation] = useState<Appointment | null>(null);
  const [activeTab, setActiveTab] = useState<'Weekly' | 'Monthly'>('Weekly');
  const [hoveredTrend, setHoveredTrend] = useState<string | null>(null);
  
  // Quick clinical notes context helper
  const [prescriptions, setPrescriptions] = useState<string>('Lisinopril 10mg daily, follow-up metabolic Panel');
  const [consultNotes, setConsultNotes] = useState<string>('Recovering well. Scars cleanly healed. Vitals stable.');

  const trends = [
    { day: 'Mon', value: 12, height: '60%' },
    { day: 'Tue', value: 18, height: '85%' },
    { day: 'Wed', value: 22, height: '100%', highlight: true },
    { day: 'Thu', value: 14, height: '70%' },
    { day: 'Fri', value: 11, height: '55%' },
    { day: 'Sat', value: 6, height: '30%' },
    { day: 'Sun', value: 4, height: '20%' },
  ];

  const handleStartConsultation = (apt: Appointment) => {
    setActiveConsultation(apt);
  };

  const handleFinishConsultation = () => {
    alert("Consultation notes signed and added to the patient's care record.");
    setActiveConsultation(null);
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-[#0b1c30] tracking-tight">Doctor Dashboard</h2>
          <p className="text-sm text-[#45464d] font-medium">
            Wednesday, October 25th — You have 12 appointments today.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button 
            type="button"
            className="flex items-center gap-2 px-3 py-2 bg-white border border-[#c6c6cd] rounded-lg text-xs font-semibold hover:bg-[#eff4ff] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">event</span>
            Oct 25, 2023
          </button>
          <button 
            type="button"
            onClick={() => alert("Dashboard filters: All Specialties selected.")}
            className="flex items-center gap-2 px-3 py-2 bg-white border border-[#c6c6cd] rounded-lg text-xs font-semibold hover:bg-[#eff4ff] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">filter_list</span>
            Filter
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-[#c6c6cd] flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-full bg-[#316bf3]/15 flex items-center justify-center text-[#316bf3]">
            <span className="material-symbols-outlined">calendar_month</span>
          </div>
          <div>
            <p className="text-[11px] font-bold text-[#45464d] uppercase tracking-wider">Appointments Today</p>
            <p className="text-2xl font-bold text-[#0b1c30]">12</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#c6c6cd] flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-full bg-[#e5eeff] flex items-center justify-center text-[#0051d5]">
            <span className="material-symbols-outlined">person_check</span>
          </div>
          <div>
            <p className="text-[11px] font-bold text-[#45464d] uppercase tracking-wider">Patients Seen</p>
            <p className="text-2xl font-bold text-[#0b1c30]">08 <span className="text-sm font-normal text-[#45464d]">/ 12</span></p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#c6c6cd] flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-full bg-[#ffdad6] flex items-center justify-center text-[#ba1a1a]">
            <span className="material-symbols-outlined text-red-600">pending_actions</span>
          </div>
          <div>
            <p className="text-[11px] font-bold text-[#45464d] uppercase tracking-wider">Pending Records</p>
            <p className="text-2xl font-bold text-[#0b1c30]">04</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#c6c6cd] flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-full bg-[#6ffbbe]/25 flex items-center justify-center text-[#005236]">
            <span className="material-symbols-outlined text-emerald-600" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
          </div>
          <div>
            <p className="text-[11px] font-bold text-[#45464d] uppercase tracking-wider">Avg. Rating</p>
            <p className="text-2xl font-bold text-[#0b1c30]">4.92</p>
          </div>
        </div>
      </div>

      {/* Bento Grid Layout (Today's Schedule & Quick Actions) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* Today's Schedule (8 Columns) */}
        <div className="xl:col-span-8 bg-white border border-[#c6c6cd] rounded-xl overflow-hidden flex flex-col shadow-sm">
          <div className="p-5 border-b border-[#c6c6cd] flex items-center justify-between bg-[#f8f9ff]">
            <h3 className="text-base font-bold text-[#0b1c30]">Today's Schedule</h3>
            <div className="flex gap-1">
              <button className="p-2 rounded-full border border-[#c6c6cd] hover:bg-[#eff4ff] cursor-pointer">
                <span className="material-symbols-outlined text-sm">chevron_left</span>
              </button>
              <button className="p-2 rounded-full border border-[#c6c6cd] hover:bg-[#eff4ff] cursor-pointer">
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className="relative pl-8 before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[1.5px] before:bg-[#c6c6cd]">
              
              {/* Timeline Item 1 - Sarah Jenkins Completed */}
              <div className="relative mb-6">
                <div className="absolute -left-[25px] top-1.5 w-4 h-4 rounded-full bg-[#0051d5] border-4 border-white z-10"></div>
                <div className="bg-white border border-[#c6c6cd] hover:border-[#0051d5] p-4 rounded-xl flex flex-wrap items-center justify-between gap-4 transition-all duration-150">
                  <div className="flex items-center gap-3">
                    <div className="text-center min-w-[50px] border-r border-[#c6c6cd] pr-3">
                      <p className="font-bold text-[#0051d5] text-sm">09:00</p>
                      <p className="text-[10px] text-[#45464d] uppercase font-semibold">AM</p>
                    </div>
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-[#cbdbf5]">
                      <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC8lIbhDDsZ6VXKS4PKF7W7fmlJX_bmyKp1PSSwTZ7QyDo781oolhBNLaxs9Ja0fZ2DtK6OVy11UtYmUqtDcxRY21Msf2N4_bzA4EGkTqV5ZlvRteqHWgrF_uCnttiOIzpqZNcAF1woRRc3a_-K7WHAzFhlBz308voPGQtzCymk6w_BjbcmzeFkJMlC0JhwbsQPxo_mkn_2IwkNbz6iHcSC5c6aA6g55HZHpmtV8moU1xrJ6nlOB7JYiQMwsyg1YubarS9Kbiv0xU0" alt="Sarah Jenkins" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#0b1c30]">Sarah Jenkins</p>
                      <p className="text-xs text-[#45464d]">Routine Cardiology Follow-up</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-[#6ffbbe]/25 text-[#005236] rounded-full text-[10px] font-bold">COMPLETED</span>
                    <button className="p-1 hover:bg-[#eff4ff] rounded-full text-[#45464d] cursor-pointer">
                      <span className="material-symbols-outlined text-lg">more_vert</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Timeline Item 2 - Marcus Thorne Active */}
              <div className="relative mb-6">
                <div className="absolute -left-[25px] top-1.5 w-4 h-4 rounded-full bg-red-600 border-4 border-white z-10 animate-pulse"></div>
                <div className="bg-[#316bf3]/10 border border-[#0051d5] p-4 rounded-xl flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="text-center min-w-[50px] border-r border-[#0051d5]/30 pr-3">
                      <p className="font-bold text-[#0b1c30] text-sm">10:30</p>
                      <p className="text-[10px] text-[#ob1c30]/80 uppercase font-semibold">AM</p>
                    </div>
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-white">
                      <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAJEIceDb3kG1la0Lr9nCVc-C-zEt81_vLreqWa2A3pCSv1FLLVlHRwBM4Xdc-jJx7t2g60a3NyLEY1VWa09tdGXiWR5oZb3P3IVRq2B8YreQtp-A0LTrpo1_sPgS1-XG1vqtCmG30oj6uhzF9W68vhymfE-NKmaNcPQBSmeMkFtN7yV32F0_uReMmCzN-tD8m8pkfgADM03KrFtOjDK6pqtLxS7jaYwuDJuYbKQ86O9HJostX02dqaxXWdSA3yF7XHKUb4D2JKUow" alt="Marcus Thorne" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#0b1c30]">Marcus Thorne</p>
                      <p className="text-xs text-[#00174b] font-medium">Post-Op Consultation</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleStartConsultation({
                        id: 'apt-3',
                        doctorName: 'Dr. Julian Vance',
                        doctorRole: 'Chief Surgeon',
                        doctorImage: '',
                        patientName: 'Marcus Thorne',
                        patientId: '#NX-2281',
                        patientImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJEIceDb3kG1la0Lr9nCVc-C-zEt81_vLreqWa2A3pCSv1FLLVlHRwBM4Xdc-jJx7t2g60a3NyLEY1VWa09tdGXiWR5oZb3P3IVRq2B8YreQtp-A0LTrpo1_sPgS1-XG1vqtCmG30oj6uhzF9W68vhymfE-NKmaNcPQBSmeMkFtN7yV32F0_uReMmCzN-tD8m8pkfgADM03KrFtOjDK6pqtLxS7jaYwuDJuYbKQ86O9HJostX02dqaxXWdSA3yF7XHKUb4D2JKUow',
                        time: '10:30 AM',
                        date: 'Oct 25, 2023',
                        status: 'Active',
                        reason: 'Post-Op surgical follow-up'
                      })}
                      className="px-4 py-2 bg-[#0051d5] text-white hover:bg-[#00174b] rounded-lg font-bold text-xs shadow-sm transition-all active:scale-95 cursor-pointer"
                    >
                      Start Consultation
                    </button>
                    <button 
                      onClick={() => alert("Loading patient history timelines...")}
                      className="px-4 py-2 border border-[#0051d5]/40 text-[#0051d5] hover:bg-[#316bf3]/10 rounded-lg font-bold text-xs transition-all cursor-pointer"
                    >
                      View History
                    </button>
                  </div>
                </div>
              </div>

              {/* Timeline Item 3 - Arthur McMillian Waiting */}
              <div className="relative">
                <div className="absolute -left-[25px] top-1.5 w-4 h-4 rounded-full bg-[#76777d] border-4 border-white z-10"></div>
                <div className="bg-white border border-[#c6c6cd] hover:border-[#0051d5] p-4 rounded-xl flex flex-wrap items-center justify-between gap-4 opacity-75">
                  <div className="flex items-center gap-3">
                    <div className="text-center min-w-[50px] border-r border-[#c6c6cd] pr-3">
                      <p className="font-bold text-[#45464d] text-sm">11:15</p>
                      <p className="text-[10px] text-[#45464d] uppercase font-semibold">AM</p>
                    </div>
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-[#eff4ff]">
                      <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDqpSZsKNUZZSyXi3ZCX4oiKLCWY6TxW2OLAAybDHnd-W64O30ha1faARZSK2Qj4vzmfjHVknUGWpOaHYCDbQSH78bll6HuuZCPUuOP5WHySmieQgOF0Oyb23VgNajsTE6U5mAW92fqrdt_W99tyAwFlI9f5VMATfQEj6fcYrA14dKyrZI6-99Ci-Cq0BjZCy9AYqRuu8Oy9OMOA40EJJhB_cfoxZvtSnb7yw8mePA0_6wyV2FhEn9N4WqTpn17d2HoMqQbtZhQcEI" alt="Arthur McMillian" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#0b1c30]">Arthur McMillian</p>
                      <p className="text-xs text-[#45464d]">Annual Physical Exam</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-[#cbdbf5] text-[#00174b] rounded-full text-[10px] font-bold">WAITING</span>
                    <button className="p-1 hover:bg-[#eff4ff] rounded-full text-[#45464d] cursor-pointer">
                      <span className="material-symbols-outlined text-lg">more_vert</span>
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
          
          <div className="mt-auto p-4 bg-[#eff4ff] border-t border-[#c6c6cd] text-center">
            <button 
              onClick={() => onNavigateToTab('Appointments')}
              className="text-[#0051d5] font-bold text-xs hover:underline cursor-pointer"
            >
              View Full Schedule List
            </button>
          </div>
        </div>

        {/* Right Columns: Quick Actions & Patients (4 Columns) */}
        <div className="xl:col-span-4 flex flex-col gap-6">
          {/* Quick Actions */}
          <div className="bg-white border border-[#c6c6cd] rounded-xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-[#0b1c30] tracking-wide mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={onNewConsultation}
                className="flex flex-col items-center justify-center p-4 bg-[#eff4ff] border border-[#c6c6cd] rounded-lg hover:border-[#0051d5] hover:text-[#0051d5] transition-all gap-2 group cursor-pointer"
              >
                <span className="material-symbols-outlined text-2xl group-hover:scale-110 transition-transform">add_box</span>
                <span className="text-xs text-center font-bold">New Record</span>
              </button>
              <button 
                onClick={() => alert("Consulting scheduling coordinator... Schedule Block active for next 2 hours.")}
                className="flex flex-col items-center justify-center p-4 bg-[#eff4ff] border border-[#c6c6cd] rounded-lg hover:border-[#0051d5] hover:text-[#0051d5] transition-all gap-2 group cursor-pointer"
              >
                <span className="material-symbols-outlined text-2xl group-hover:scale-110 transition-transform">block</span>
                <span className="text-xs text-center font-bold">Block Day</span>
              </button>
              <button 
                onClick={() => alert("Cross-specialty medical referral form requested. Choose Patient.")}
                className="flex flex-col items-center justify-center p-4 bg-[#eff4ff] border border-[#c6c6cd] rounded-lg hover:border-[#0051d5] hover:text-[#0051d5] transition-all gap-2 group cursor-pointer"
              >
                <span className="material-symbols-outlined text-2xl group-hover:scale-110 transition-transform">send</span>
                <span className="text-xs text-center font-bold">Refer Patient</span>
              </button>
              <button 
                onClick={() => onNavigateToTab('Symptom Checker')}
                className="flex flex-col items-center justify-center p-4 bg-[#eff4ff] border border-[#c6c6cd] rounded-lg hover:border-[#0051d5] hover:text-[#0051d5] transition-all gap-2 group cursor-pointer"
              >
                <span className="material-symbols-outlined text-2xl group-hover:scale-110 transition-transform">video_call</span>
                <span className="text-xs text-center font-bold">Telehealth</span>
              </button>
            </div>
          </div>

          {/* Recent Patients List Box */}
          <div className="bg-white border border-[#c6c6cd] rounded-xl flex-1 flex flex-col overflow-hidden shadow-sm">
            <div className="p-5 border-b border-[#c6c6cd] flex items-center justify-between bg-[#f8f9ff]">
              <h3 className="text-sm font-bold text-[#0b1c30]">Recent Patients</h3>
              <button 
                onClick={() => onNavigateToTab('Patients')}
                className="text-[#0051d5] hover:underline text-xs font-bold cursor-pointer"
              >
                See All
              </button>
            </div>
            
            <div className="divide-y divide-[#c6c6cd] overflow-y-auto max-h-[300px]">
              
              <div 
                onClick={() => onNavigateToTab('Patients')}
                className="p-4 hover:bg-[#eff4ff] transition-colors flex items-center gap-3 cursor-pointer"
              >
                <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0">
                  <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuArhSisnuMdiBSv75zm_U402Ze2gsW0y7xVhHu-itS5wEdAoxRFtWYPJprNUPgS_CSsWfW_yUngTS4jAwM_9EszTfyJ4Lek_QolsUJTIEH6pGv2Yt9bdMqwAztHnjPoFElPtoYgQV9nlAoEi02VeQeWIFNKoaGz80FRKC3C-aMQznxNJowlQQNpS2H5MkDBKS0vrIg0J0BKpYETbB7dmiySzUC_nN4Kc9WXaYqVDhdJ_OX753CNItqRTswZLai2p4ijMvVnuY9PRBY" alt="Patient 1" />
                </div>
                <div className="flex-grow">
                  <p className="text-xs font-bold text-[#0b1c30]">Elena Rodriguez</p>
                  <p className="text-[10px] text-[#45464d]">Patient ID: #NX-8821</p>
                </div>
                <span className="w-1.5 h-1.5 rounded-full bg-[#009668]"></span>
              </div>

              <div 
                onClick={() => onNavigateToTab('Patients')}
                className="p-4 hover:bg-[#eff4ff] transition-colors flex items-center gap-3 cursor-pointer"
              >
                <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0">
                  <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDeStu4jzvYa3mv5uPI20q-uC795TdWWELIBO47Zmjd-fRa-C9BZmqBDl_6krCerSMDNPycaxeh8YFMTtzF6QKiwZ9_9RHYzgkRsqGm7A2l3MaKqw0A5Zawxfmm0V5_TkIFdqeIMDQFkucwKvnGpSApvqCDzKRc9z8KJmDbk2Lhfj0ZewTuxFjMf8SbL_fxlKwQWfJSoLbTzb-IWNhSqQGtyq4BK0Q8C4t2ADwjEhNUnVSu5ErX2rFy_-Rj0sQrjmaiC-spl-hSuHg" alt="Patient 2" />
                </div>
                <div className="flex-grow">
                  <p className="text-xs font-bold text-[#0b1c30]">David Chen</p>
                  <p className="text-[10px] text-[#45464d]">Patient ID: #NX-4402</p>
                </div>
                <span className="w-1.5 h-1.5 rounded-full bg-[#76777d]"></span>
              </div>

              <div 
                onClick={() => onNavigateToTab('Patients')}
                className="p-4 hover:bg-[#eff4ff] transition-colors flex items-center gap-3 cursor-pointer"
              >
                <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0">
                  <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAwx8_Vd9tLIHvP5pIut34M0NOxjsPIyjGuS2Crqre_XJWMsIt9KDJfXal2iCVMimpvAezv--mdecI5XngoP03VO18Flh8uJU9gwjbzm26PMVFmW3ZEo9xGDOUSfjCbaXkd41OyVV-gluytzbPCTTI7MD-4WRvpby6Nq23xGCBmyUxQaHnnSxf2I2d02RB06LOP_S-iRCJlEbToWCKkwF4RmYPlbsmNvcNRHah35oB55FGx6-OUJOlRWw3KtXiU5022BWYfMIiaYNc" alt="Patient 3" />
                </div>
                <div className="flex-grow">
                  <p className="text-xs font-bold text-[#0b1c30]">Sarah Jenkins</p>
                  <p className="text-[10px] text-[#45464d]">Patient ID: #NX-1129</p>
                </div>
                <span className="w-1.5 h-1.5 rounded-full bg-[#009668]"></span>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Analytics Chart Block */}
      <div className="bg-white border border-[#c6c6cd] rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-3">
          <div>
            <h3 className="text-base font-bold text-[#0b1c30]">Weekly Appointment Trends</h3>
            <p className="text-xs text-[#45464d]">Patient throughput and clinical flow across all hospital departments</p>
          </div>
          <div className="flex bg-[#eff4ff] p-1 rounded-lg self-start">
            <button 
              onClick={() => setActiveTab('Weekly')}
              className={`px-3 py-1 rounded-md text-xs font-bold cursor-pointer transition-all ${activeTab === 'Weekly' ? 'bg-white shadow-sm text-[#0051d5]' : 'text-[#45464d]'}`}
            >
              Weekly
            </button>
            <button 
              onClick={() => setActiveTab('Monthly')}
              className={`px-3 py-1 rounded-md text-xs font-bold cursor-pointer transition-all ${activeTab === 'Monthly' ? 'bg-white shadow-sm text-[#0051d5]' : 'text-[#45464d]'}`}
            >
              Monthly
            </button>
          </div>
        </div>

        <div className="h-64 w-full relative flex items-end justify-between gap-3 px-2 pt-10">
          {trends.map((item) => (
            <div 
              key={item.day} 
              className="flex-1 flex flex-col items-center gap-2 group cursor-pointer"
              onMouseEnter={() => setHoveredTrend(item.day)}
              onMouseLeave={() => setHoveredTrend(null)}
            >
              <div 
                className={`w-full rounded-t-lg relative transition-all duration-300 ${
                  hoveredTrend === item.day || item.highlight 
                    ? 'bg-[#0051d5]' 
                    : 'bg-[#dae2fd]'
                }`}
                style={{ height: item.height }}
              >
                {/* Tooltip */}
                <div className={`absolute -top-10 left-1/2 -translate-x-1/2 bg-[#0b1c30] text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg transition-opacity pointer-events-none ${
                  hoveredTrend === item.day || item.highlight ? 'opacity-100' : 'opacity-0'
                }`}>
                  {item.value} Patients
                </div>
              </div>
              <p className={`text-xs font-medium ${item.highlight ? 'text-[#0b1c30] font-bold' : 'text-[#45464d]'}`}>
                {item.day}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Consultation Active Virtual Session Modal */}
      {activeConsultation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-[#c6c6cd]">
            <div className="p-6 bg-[#eff4ff] border-b border-[#c6c6cd] flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-red-600 animate-ping"></span>
                <h3 className="text-lg font-bold text-[#0b1c30]">Consultation in Progress: {activeConsultation.patientName}</h3>
              </div>
              <button 
                onClick={() => setActiveConsultation(null)}
                className="w-8 h-8 rounded-full bg-white hover:bg-[#cbdbf5] flex items-center justify-center text-[#0b1c30] cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex gap-4 p-4 rounded-2xl bg-[#eff4ff]/40 border border-[#cbdbf5] items-center">
                <div className="w-14 h-14 rounded-full overflow-hidden border border-[#c6c6cd]">
                  <img className="w-full h-full object-cover" src={activeConsultation.patientImage} alt={activeConsultation.patientName} />
                </div>
                <div>
                  <h4 className="text-base font-bold text-[#0b1c30]">{activeConsultation.patientName}</h4>
                  <p className="text-xs text-[#45464d]">Patient ID: {activeConsultation.patientId} • Primary Reason: {activeConsultation.reason}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#45464d] uppercase tracking-wider block">Clinical Notes</label>
                  <textarea 
                    value={consultNotes}
                    onChange={(e) => setConsultNotes(e.target.value)}
                    className="w-full p-3 rounded-lg border border-[#c6c6cd] text-xs h-32 focus:ring-2 focus:ring-[#0051d5] outline-none"
                    placeholder="Enter diagnostic details, pathology reports, vitals..."
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#45464d] uppercase tracking-wider block">Prescription Orders</label>
                  <textarea 
                    value={prescriptions}
                    onChange={(e) => setPrescriptions(e.target.value)}
                    className="w-full p-3 rounded-lg border border-[#c6c6cd] text-xs h-32 focus:ring-2 focus:ring-[#0051d5] outline-none"
                    placeholder="E.g., Lisinopril 10mg once daily..."
                  />
                </div>
              </div>

              {/* Patient details quick access */}
              <div className="p-3 bg-[#f8f9ff] rounded-xl border border-[#c6c6cd] flex justify-between text-xs">
                <div>
                  <span className="font-bold text-[#45464d]">Age:</span> <span className="text-[#0b1c30] font-semibold">44 y/o</span>
                </div>
                <div>
                  <span className="font-bold text-[#45464d]">Blood Type:</span> <span className="text-[#0b1c30] font-semibold">O+</span>
                </div>
                <div>
                  <span className="font-bold text-[#45464d]">Last Audit:</span> <span className="text-[#009668] font-bold">Passed</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#f8f9ff] border-t border-[#c6c6cd] flex justify-end gap-2">
              <button 
                onClick={() => setActiveConsultation(null)}
                className="px-4 py-2 bg-white hover:bg-[#eff4ff] border border-[#c6c6cd] text-[#45464d] text-xs font-bold rounded-lg cursor-pointer"
              >
                Cancel Session
              </button>
              <button 
                onClick={handleFinishConsultation}
                className="px-5 py-2 bg-[#0051d5] text-white hover:bg-[#00174b] text-xs font-bold rounded-lg cursor-pointer"
              >
                Sign & Finalize Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
