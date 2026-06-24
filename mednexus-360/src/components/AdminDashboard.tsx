/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { StaffMember, ActivityLog, PerformanceDoctor } from '../types';

interface AdminDashboardProps {
  staff: StaffMember[];
  logs: ActivityLog[];
  topPerformers: PerformanceDoctor[];
  onStaffUpdate: (newStaff: StaffMember[]) => void;
  onNewConsultation: () => void;
}

export default function AdminDashboard({ 
  staff, 
  logs, 
  topPerformers, 
  onStaffUpdate,
  onNewConsultation 
}: AdminDashboardProps) {

  const [localStaff, setLocalStaff] = useState<StaffMember[]>(staff);
  const [selectedRange, setSelectedRange] = useState<'Last 30 Days' | 'Last Quarter' | 'Year'>('Last 30 Days');
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [newStaffModal, setNewStaffModal] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // New staff inputs state
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffRole, setNewStaffRole] = useState('Senior Surgeon');
  const [newStaffStatus, setNewStaffStatus] = useState<'Active' | 'On Duty' | 'Away'>('Active');

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const handleToggleStatus = (id: string) => {
    const updated = localStaff.map((s) => {
      if (s.id === id) {
        let nextStatus: 'Active' | 'On Duty' | 'Away' = 'Active';
        if (s.status === 'Active') nextStatus = 'On Duty';
        else if (s.status === 'On Duty') nextStatus = 'Away';
        return { ...s, status: nextStatus };
      }
      return s;
    });
    setLocalStaff(updated);
    onStaffUpdate(updated);
    showToast("Staff member status rotated successfully!");
  };

  const handleOpenEdit = (member: StaffMember) => {
    setEditingStaff(member);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStaff) return;

    const updated = localStaff.map((s) => (s.id === editingStaff.id ? editingStaff : s));
    setLocalStaff(updated);
    onStaffUpdate(updated);
    setEditingStaff(null);
    showToast("Staff metadata updated client-side!");
  };

  const handleCreateStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffName || !newStaffEmail) {
      alert("Name and email are required parameters.");
      return;
    }

    const initials = newStaffName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    const newMember: StaffMember = {
      id: `staff-${Date.now()}`,
      name: newStaffName,
      email: newStaffEmail,
      role: newStaffRole,
      status: newStaffStatus,
      avatarInitials: initials || 'MD'
    };

    const updated = [...localStaff, newMember];
    setLocalStaff(updated);
    onStaffUpdate(updated);
    
    // reset inputs
    setNewStaffName('');
    setNewStaffEmail('');
    setNewStaffRole('Senior Surgeon');
    setNewStaffStatus('Active');
    setNewStaffModal(false);
    showToast(`${newMember.name} joined clinical roster!`);
  };

  const departmentVolumes = [
    { name: 'Cardiology', height: '85%' },
    { name: 'Pediatrics', height: '60%' },
    { name: 'Neurology', height: '45%' },
    { name: 'Oncology', height: '72%' },
    { name: 'Orthopedics', height: '30%' },
    { name: 'Gastro', height: '55%' },
    { name: 'Emergency', height: '92%' }
  ];

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-4 right-4 z-50 p-4 rounded-xl shadow-2xl bg-[#0b1c30] text-[#6ffbbe] border border-[#009668] flex items-center gap-2 animate-bounce flex-row">
          <span className="material-symbols-outlined text-[#009668]">health_and_safety</span>
          <span className="text-sm font-semibold">{successToast}</span>
        </div>
      )}

      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-[#0b1c30] tracking-tight">Hospital Overview</h2>
          <p className="text-base text-[#45464d]">Good morning, Dr. Aris. Here is what's happening today.</p>
        </div>
        <div className="flex gap-2 self-start md:self-auto">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#c6c6cd] rounded-lg text-xs font-bold text-[#45464d] hover:bg-[#eff4ff] transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-base">calendar_month</span>
            May 24, 2024
          </button>
          <button 
            onClick={() => alert("Generating unified Clinical metrics PDF... Download initiated!")}
            className="flex items-center gap-2 px-4 py-2 bg-[#0051d5] hover:bg-[#00174b] text-white rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">download</span>
            Export Report
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Doctors */}
        <div className="bg-white p-5 rounded-xl border border-[#c6c6cd] hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2.5 bg-[#eff4ff] rounded-lg">
              <span className="material-symbols-outlined text-[#0051d5]">medical_services</span>
            </div>
            <span className="text-[#005236] bg-[#6ffbbe]/20 px-2.5 py-0.5 rounded text-xs font-bold border border-[#6ffbbe]/30">+4%</span>
          </div>
          <p className="text-[#45464d] text-xs font-bold uppercase tracking-wider">Total Doctors</p>
          <h3 className="text-3xl font-bold text-[#0b1c30] mt-1">1,284</h3>
        </div>

        {/* Active Patients */}
        <div className="bg-white p-5 rounded-xl border border-[#c6c6cd] hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2.5 bg-[#eff4ff] rounded-lg">
              <span className="material-symbols-outlined text-[#0051d5]">personal_injury</span>
            </div>
            <span className="text-[#005236] bg-[#6ffbbe]/20 px-2.5 py-0.5 rounded text-xs font-bold border border-[#6ffbbe]/30">+12%</span>
          </div>
          <p className="text-[#45464d] text-xs font-bold uppercase tracking-wider">Active Patients</p>
          <h3 className="text-3xl font-bold text-[#0b1c30] mt-1">42,890</h3>
        </div>

        {/* Revenue Growth (With visual sparkline graph!) */}
        <div className="bg-white p-5 rounded-xl border border-[#c6c6cd] hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="flex justify-between items-start mb-2">
            <div className="p-2.5 bg-[#eff4ff] rounded-lg">
              <span className="material-symbols-outlined text-[#0051d5]">trending_up</span>
            </div>
          </div>
          <p className="text-[#45464d] text-xs font-bold uppercase tracking-wider">Revenue Growth</p>
          <h3 className="text-3xl font-bold text-[#0b1c30] mt-1">$4.2M</h3>
          {/* Sparkline background matching Image 4 */}
          <div className="absolute bottom-0 left-0 w-full h-8 flex items-end opacity-20">
            <div className="w-1/6 bg-[#0051d5] h-2"></div>
            <div className="w-1/6 bg-[#0051d5] h-4"></div>
            <div className="w-1/6 bg-[#0051d5] h-3"></div>
            <div className="w-1/6 bg-[#0051d5] h-6"></div>
            <div className="w-1/6 bg-[#0051d5] h-5"></div>
            <div className="w-1/6 bg-[#0051d5] h-8"></div>
          </div>
        </div>

        {/* Bed Occupancy */}
        <div className="bg-white p-5 rounded-xl border border-[#c6c6cd] hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2.5 bg-[#eff4ff] rounded-lg">
              <span className="material-symbols-outlined text-[#0051d5]">bed</span>
            </div>
            <span className="text-[#ba1a1a] bg-[#ffdad6] px-2.5 py-0.5 rounded text-xs font-bold">High</span>
          </div>
          <p className="text-[#45464d] text-xs font-bold uppercase tracking-wider">Bed Occupancy</p>
          <h3 className="text-3xl font-bold text-[#0b1c30] mt-1 font-sans">94.2%</h3>
          <div className="w-full bg-[#eff4ff] h-2 rounded-full mt-3 overflow-hidden border border-[#c6c6cd]">
            <div className="bg-[#0051d5] h-full rounded-full" style={{ width: '94.2%' }}></div>
          </div>
        </div>
      </div>

      {/* Main Analytics Section (Volume graph & System Log) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Department Volume (8 Columns) */}
        <div className="col-span-12 lg:col-span-8 bg-white p-5 rounded-xl border border-[#c6c6cd] shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-base font-bold text-[#0b1c30]">Patient Volume by Department</h4>
            <select 
              value={selectedRange}
              onChange={(e) => setSelectedRange(e.target.value as any)}
              className="bg-[#eff4ff] border border-[#c6c6cd] rounded-lg text-xs font-bold p-1.5 text-[#0b1c30] focus:ring-2 focus:ring-[#0051d5] outline-none cursor-pointer"
            >
              <option>Last 30 Days</option>
              <option>Last Quarter</option>
              <option>Year</option>
            </select>
          </div>

          <div className="flex items-end gap-3 h-64 mt-8 px-2 border-b border-[#c6c6cd]">
            {departmentVolumes.map((item, index) => (
              <div key={item.name} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                <div 
                  className="w-full bg-[#316bf3] hover:bg-[#0051d5] rounded-t-lg transition-all duration-300" 
                  style={{ height: item.height }}
                />
                <span className="text-[10px] font-bold text-[#45464d] truncate w-full text-center group-hover:text-[#0b1c30]">
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* System Activity Log (4 Columns) */}
        <div className="col-span-12 lg:col-span-4 bg-white p-5 rounded-xl border border-[#c6c6cd] flex flex-col shadow-sm">
          <h4 className="text-base font-bold text-[#0b1c30] mb-4">System Activity Log</h4>
          
          <div className="space-y-4 flex-grow overflow-y-auto max-h-[300px] pr-1">
            {logs.map((log) => {
              let borderClass = 'border-[#eff4ff]';
              let dotClass = 'bg-[#76777d]';
              if (log.type === 'success') {
                borderClass = 'border-[#6ffbbe]';
                dotClass = 'bg-[#009668]';
              } else if (log.type === 'alert') {
                borderClass = 'border-[#ffdad6]';
                dotClass = 'bg-[#ba1a1a]';
              } else if (log.type === 'system') {
                borderClass = 'border-[#dae2fd]';
                dotClass = 'bg-[#0051d5]';
              }

              return (
                <div key={log.id} className={`flex gap-3 border-l-2 ${borderClass} pl-4 relative py-1`}>
                  <div className={`absolute -left-[5px] top-2 w-2 h-2 rounded-full ${dotClass}`}></div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-[#0b1c30]">{log.title}</p>
                    <p className="text-[10px] text-[#45464d]">{log.meta} • <span className="font-semibold">{log.time}</span></p>
                  </div>
                </div>
              );
            })}
          </div>

          <button 
            type="button"
            onClick={() => alert("Directing to complete secure hospital audit logger...")}
            className="mt-4 text-[#0051d5] text-xs font-bold hover:underline self-start cursor-pointer"
          >
            View All Logs
          </button>
        </div>
      </div>

      {/* Active Medical Staff CRUD table & Doctors Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* CRUD Table (2 Columns) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-[#c6c6cd] overflow-hidden shadow-sm">
          <div className="p-5 border-b border-[#c6c6cd] flex justify-between items-center bg-[#f8f9ff]">
            <h4 className="text-base font-bold text-[#0b1c30]">Active Medical Staff</h4>
            <div className="flex gap-2">
              <button 
                onClick={() => setNewStaffModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#eff4ff] hover:bg-[#cbdbf5] text-[#0051d5] rounded-lg text-xs font-bold cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                Add Staff
              </button>
            </div>
          </div>

          <table className="w-full text-left border-collapse">
            <thead className="bg-[#eff4ff] border-b border-[#c6c6cd]">
              <tr>
                <th className="px-4 py-3 text-xs font-bold text-[#45464d] uppercase tracking-wider">User</th>
                <th className="px-4 py-3 text-xs font-bold text-[#45464d] uppercase tracking-wider whitespace-nowrap">Role</th>
                <th className="px-4 py-3 text-xs font-bold text-[#45464d] uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-xs font-bold text-[#45464d] uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c6c6cd]">
              {localStaff.map((member) => (
                <tr key={member.id} className="hover:bg-[#eff4ff] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#dae2fd] flex items-center justify-center text-[#0051d5] font-bold text-sm shrink-0 uppercase">
                        {member.avatarInitials}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#0b1c30]">{member.name}</p>
                        <p className="text-[10px] text-[#45464d]">{member.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2.5 py-1 bg-[#eff4ff] text-[#0051d5] text-[10px] font-bold rounded-full border border-[#c6c6cd]">
                      {member.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button 
                      type="button"
                      onClick={() => handleToggleStatus(member.id)}
                      title="Click to cycle status"
                      className="flex items-center gap-2 hover:bg-[#eff4ff] p-1.5 rounded-lg border border-[#c6c6cd] transition-all cursor-pointer"
                    >
                      <span className={`w-2 h-2 rounded-full ${
                        member.status === 'Active' || member.status === 'On Duty' ? 'bg-[#4edea3]' : 'bg-red-500'
                      }`} />
                      <span className="text-xs font-bold text-[#0b1c30]">{member.status}</span>
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex gap-1 justify-end">
                      <button 
                        onClick={() => handleOpenEdit(member)}
                        className="p-1 hover:bg-[#cbdbf5] rounded-full text-[#0051d5] cursor-pointer"
                        title="Edit member parameters"
                      >
                        <span className="material-symbols-outlined text-sm">edit</span>
                      </button>
                      <button 
                        onClick={() => {
                          if (confirm(`Remove ${member.name} from global medical registry?`)) {
                            const updated = localStaff.filter(s => s.id !== member.id);
                            setLocalStaff(updated);
                            onStaffUpdate(updated);
                            showToast("Staff record finalized/removed successfully.");
                          }
                        }}
                        className="p-1 hover:bg-[#ffdad6] rounded-full text-red-600 cursor-pointer"
                        title="Remove staff record"
                      >
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="p-4 flex justify-center border-t border-[#c6c6cd]">
            <button 
              onClick={() => alert("Loading full corporate clinic personnel registry database... Authorized operations only.")}
              className="text-[#0051d5] font-bold text-xs hover:underline cursor-pointer"
            >
              See all staff members
            </button>
          </div>
        </div>

        {/* Top Doctors Performance (1 Column) */}
        <div className="bg-white p-5 rounded-xl border border-[#c6c6cd] shadow-sm flex flex-col justify-between">
          <div>
            <h4 className="text-base font-bold text-[#0b1c30] mb-5">Top Performance</h4>
            
            <div className="space-y-4">
              {topPerformers.map((doc) => (
                <div key={doc.id} className="flex items-center gap-3 hover:bg-[#f8f9ff] p-1 rounded-lg">
                  <div className="relative shrink-0">
                    <img className="w-12 h-12 rounded-full object-cover border border-[#c6c6cd]" src={doc.image} alt={doc.name} />
                    <div className="absolute -bottom-1 -right-1 bg-[#4edea3] text-[#002113] w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-white">
                      {doc.rank}
                    </div>
                  </div>
                  <div className="flex-grow">
                    <p className="text-xs font-bold text-[#0b1c30]">{doc.name}</p>
                    <p className="text-[10px] text-[#45464d] font-semibold">{doc.rate}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-[#0051d5] shrink-0 bg-[#eff4ff] px-2 py-1 rounded-md border border-[#cbdbf5]">
                      {doc.cases} Cases
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-[#c6c6cd]">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-[#45464d]">Efficiency Goal Achievement</span>
              <span className="text-xs font-bold text-[#0b1c30]">88%</span>
            </div>
            <div className="w-full bg-[#eff4ff] h-2 rounded-full overflow-hidden border border-[#c6c6cd]">
              <div className="bg-[#4edea3] h-full rounded-full" style={{ width: '88%' }}></div>
            </div>
          </div>
        </div>

      </div>

      {/* Add New Staff Modal */}
      {newStaffModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-[#c6c6cd]">
            <div className="p-6 bg-[#eff4ff] border-b border-[#c6c6cd] flex justify-between items-center">
              <h3 className="text-base font-bold text-[#0b1c30]">Onboard Medical Personnel</h3>
              <button 
                onClick={() => setNewStaffModal(false)}
                className="w-8 h-8 rounded-full bg-white hover:bg-[#cbdbf5] flex items-center justify-center text-[#0b1c30] cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateStaff} className="p-6 space-y-4 text-left">
              <div>
                <label className="text-xs font-bold text-[#45464d] block mb-1">Full Doctor Name</label>
                <input 
                  type="text" 
                  value={newStaffName} 
                  onChange={(e) => setNewStaffName(e.target.value)}
                  placeholder="Dr. James Carter"
                  className="w-full p-2.5 rounded-lg border border-[#c6c6cd] text-xs focus:ring-2 focus:ring-[#0051d5]"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#45464d] block mb-1">Credentials Email</label>
                <input 
                  type="email" 
                  value={newStaffEmail} 
                  onChange={(e) => setNewStaffEmail(e.target.value)}
                  placeholder="j.carter@mednexus.com"
                  className="w-full p-2.5 rounded-lg border border-[#c6c6cd] text-xs focus:ring-2 focus:ring-[#0051d5]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#45464d] block mb-1">Department Role</label>
                  <select 
                    value={newStaffRole}
                    onChange={(e) => setNewStaffRole(e.target.value)}
                    className="w-full p-2 rounded-lg border border-[#c6c6cd] text-xs focus:ring-2 focus:ring-[#0051d5]"
                  >
                    <option>Senior Surgeon</option>
                    <option>Head Nurse</option>
                    <option>Generalist Cardiologist</option>
                    <option>Dermatologist Pro</option>
                    <option>IT Administrator</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-[#45464d] block mb-1">Initial Status</label>
                  <select 
                    value={newStaffStatus}
                    onChange={(e) => setNewStaffStatus(e.target.value as any)}
                    className="w-full p-2 rounded-lg border border-[#c6c6cd] text-xs focus:ring-2 focus:ring-[#0051d5]"
                  >
                    <option>Active</option>
                    <option>On Duty</option>
                    <option>Away</option>
                  </select>
                </div>
              </div>

              <div className="p-4 bg-[#f8f9ff] border-t border-[#c6c6cd] -mx-6 -mb-6 flex justify-end gap-2 mt-6">
                <button 
                  type="button" 
                  onClick={() => setNewStaffModal(false)}
                  className="px-4 py-2 text-xs font-bold text-[#45464d] hover:bg-[#eff4ff] rounded"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-[#0051d5] text-white text-xs font-bold rounded hover:bg-[#00174b]"
                >
                  Confirm Joining
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Staff Modal */}
      {editingStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-[#c6c6cd]">
            <div className="p-6 bg-[#eff4ff] border-b border-[#c6c6cd] flex justify-between items-center">
              <h3 className="text-base font-bold text-[#0b1c30]">Modify Clinical Profile</h3>
              <button 
                onClick={() => setEditingStaff(null)}
                className="w-8 h-8 rounded-full bg-white hover:bg-[#cbdbf5] flex items-center justify-center text-[#0b1c30] cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 space-y-4 text-left">
              <div>
                <label className="text-xs font-bold text-[#45464d] block mb-1">Clinic Name</label>
                <input 
                  type="text" 
                  value={editingStaff.name} 
                  onChange={(e) => setEditingStaff({ ...editingStaff, name: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-[#c6c6cd] text-xs"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#45464d] block mb-1">Roster Email</label>
                <input 
                  type="email" 
                  value={editingStaff.email} 
                  onChange={(e) => setEditingStaff({ ...editingStaff, email: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-[#c6c6cd] text-xs"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#45464d] block mb-1">Roster Role</label>
                <input 
                  type="text" 
                  value={editingStaff.role} 
                  onChange={(e) => setEditingStaff({ ...editingStaff, role: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-[#c6c6cd] text-xs"
                  required
                />
              </div>

              <div className="p-4 bg-[#f8f9ff] border-t border-[#c6c6cd] -mx-6 -mb-6 flex justify-end gap-2 mt-6">
                <button 
                  type="button" 
                  onClick={() => setEditingStaff(null)}
                  className="px-4 py-2 text-xs font-bold text-[#45464d] hover:bg-[#eff4ff] rounded"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-[#0051d5] text-white text-xs font-bold rounded hover:bg-[#00174b]"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
