/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';

export default function AnalyticsPage() {
  const [selectedSubTab, setSelectedSubTab] = useState<'Departmental' | 'Vitals' | 'Resource'>('Departmental');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const deptData = [
    { name: 'Cardiology', patients: 1240, color: '#316bf3', height: '80%' },
    { name: 'Oncology', patients: 980, color: '#0051d5', height: '65%' },
    { name: 'Pediatrics', patients: 1450, color: '#4edea3', height: '95%' },
    { name: 'Surgery', patients: 720, color: '#ba1a1a', height: '48%' },
    { name: 'Orthopedics', patients: 610, color: '#76777d', height: '40%' }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-bold text-[#0b1c30] tracking-tight font-sans">Clinical Performance Metrics</h2>
          <p className="text-sm text-[#45464d]">Review patient volume, care capacity, and staffing effectiveness across departments.</p>
        </div>
        <div className="flex bg-[#eff4ff] p-1 rounded-lg border border-[#c6c6cd]">
          {['Departmental', 'Vitals', 'Resource'].map((item) => (
            <button
              key={item}
              onClick={() => setSelectedSubTab(item as any)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedSubTab === item ? 'bg-white text-[#0051d5] shadow-sm' : 'text-[#45464d] hover:text-[#0b1c30]'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Analytics Main Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Chart View (8 Columns) */}
        <section className="lg:col-span-8 bg-white border border-[#c6c6cd] rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-[#0b1c30] mb-1">
              {selectedSubTab === 'Departmental' ? 'Patient Volume Comparison' : selectedSubTab === 'Vitals' ? 'Mean Systolic Trends (24h)' : 'Bed Allocation Metrics'}
            </h3>
            <p className="text-xs text-[#45464d] mb-6">Visualized statistics aggregated across all clinics during the active quarter.</p>
          </div>

          {selectedSubTab === 'Departmental' ? (
            <div className="h-64 w-full flex items-end justify-between gap-4 border-b border-[#c6c6cd] pb-4 px-2 relative pt-8">
              {deptData.map((item, index) => (
                <div 
                  key={item.name} 
                  className="flex-1 flex flex-col items-center gap-2 group cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <div 
                    className="w-full rounded-t-lg transition-all duration-300 relative"
                    style={{ 
                      height: item.height, 
                      backgroundColor: hoveredIndex === index ? '#00174b' : item.color 
                    }}
                  >
                    {hoveredIndex === index && (
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#0b1c30] text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg z-20 whitespace-nowrap">
                        {item.patients} Inpatients
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] font-bold text-[#45464d] truncate w-full text-center group-hover:text-[#0b1c30]">
                    {item.name}
                  </span>
                </div>
              ))}
            </div>
          ) : selectedSubTab === 'Vitals' ? (
            <div className="h-64 w-full flex items-end justify-between relative border-b border-[#c6c6cd] pb-4 bg-slate-50/50 p-4 rounded-xl">
              <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
                {/* SVG Line chart representing vitals tracking */}
                <path 
                  d="M 10 150 Q 80 120, 150 90 T 290 80 T 400 130 T 490 60" 
                  fill="none" 
                  stroke="#0051d5" 
                  strokeWidth="3"
                />
                {/* Dots along line */}
                <circle cx="10" cy="150" r="5" fill="#316bf3" />
                <circle cx="150" cy="90" r="5" fill="#316bf3" />
                <circle cx="290" cy="80" r="5" fill="#316bf3" />
                <circle cx="400" cy="130" r="5" fill="#316bf3" />
                <circle cx="490" cy="60" r="5" fill="#316bf3" />
              </svg>
              <div className="absolute inset-0 flex justify-between p-2 text-[9px] text-[#76777d]/90 font-mono pointer-events-none">
                <div className="flex flex-col justify-between">
                  <span>140 mmHg</span>
                  <span>120 mmHg</span>
                  <span>80 mmHg</span>
                </div>
                <div className="flex self-end justify-between w-full pl-12">
                  <span>08:00 AM</span>
                  <span>12:00 PM</span>
                  <span>04:00 PM</span>
                  <span>08:00 PM</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center">
              <div className="relative w-44 h-44 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90">
                  <circle className="text-[#eff4ff]" cx="88" cy="88" fill="transparent" r="70" stroke="currentColor" strokeWidth="12"></circle>
                  <circle className="text-[#ba1a1a]" cx="88" cy="88" fill="transparent" r="70" stroke="currentColor" strokeDasharray="440" strokeDashoffset="26" strokeWidth="12" strokeLinecap="round"></circle>
                </svg>
                <div className="absolute text-center">
                  <p className="text-3xl font-black text-[#0b1c30]">94.2%</p>
                  <p className="text-[10px] text-[#45464d] font-bold uppercase mt-0.5">ICU & ER Limit</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between text-xs text-[#45464d] font-semibold mt-4">
            <span>Clinical operations summary</span>
            <span>Refreshed: 14s ago</span>
          </div>
        </section>

        {/* Support Stats Column (4 Columns) */}
        <section className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-[#c6c6cd] rounded-xl p-5 shadow-sm">
            <h4 className="font-bold text-sm text-[#0b1c30] mb-4">Patient Demographics</h4>
            <div className="space-y-4 text-xs font-semibold">
              <div>
                <div className="flex justify-between mb-1.5">
                  <span className="text-[#45464d]">Geriatric Care [Age 65+]</span>
                  <span className="text-[#0b1c30]">42%</span>
                </div>
                <div className="w-full bg-[#eff4ff] h-2 rounded-full overflow-hidden border border-[#c6c6cd]">
                  <div className="bg-[#0051d5] h-full" style={{ width: '42%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1.5">
                  <span className="text-[#45464d]">Adults [Age 18 - 64]</span>
                  <span className="text-[#0b1c30]">48%</span>
                </div>
                <div className="w-full bg-[#eff4ff] h-2 rounded-full overflow-hidden border border-[#c6c6cd]">
                  <div className="bg-[#316bf3] h-full" style={{ width: '48%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1.5">
                  <span className="text-[#45464d]">Pediatrics [Age Under 18]</span>
                  <span className="text-[#0b1c30]">10%</span>
                </div>
                <div className="w-full bg-[#eff4ff] h-2 rounded-full overflow-hidden border border-[#c6c6cd]">
                  <div className="bg-[#4edea3] h-full" style={{ width: '10%' }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#c6c6cd] rounded-xl p-5 shadow-sm space-y-4">
            <h4 className="font-bold text-sm text-[#0b1c30]">Target Goals Audit</h4>
            <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
              <p className="text-[11px] font-bold text-emerald-800">Operational Goals Passed</p>
              <p className="text-xs text-emerald-900 mt-1 leading-relaxed">Average discharge delay reduced by 14m under hospital operations mandate.</p>
            </div>
            <button 
              onClick={() => alert("Loading hospital audit timelines...")}
              className="w-full bg-[#316bf3] hover:bg-[#0051d5] text-white py-2 rounded-lg font-bold text-xs transition-colors cursor-pointer"
            >
              Open Operations Blueprint
            </button>
          </div>
        </section>

      </div>
    </div>
  );
}
