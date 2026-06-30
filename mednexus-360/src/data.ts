/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Appointment, MedicalRecord, ActivityLog, StaffMember, PerformanceDoctor } from './types';

export const initialAppointments: Appointment[] = [
  {
    id: 'apt-1',
    doctorName: 'Dr. Sarah Jenkins',
    doctorRole: 'General Cardiology',
    doctorImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCfUBjMkV-GtNauRwnwikyxvDgtfpgEX6OXhlwQ2Va2A8UvhiR76bKNxoLncHqTYiWjLYQcb8zqysR3335fOHtYir6rBH35GS1NUKCzHx5MVJCuB_Dl7J9qYmXm_2uz_LvEZN1EZ5FhUztT6Im1CbtnBZRJ67dtGWL0VbAItxqh9HBym0iZf606J6Yi3K-jDNMwzAqqmHq6wrEbrK7IvqZwHAPS8pphaWqXjIqyPGBIfpoZBWQ0v7639UdmTvy6lh7znAyryQ_mJMA',
    patientName: 'Sarah Jenkins',
    patientId: '#NX-1129',
    patientImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC8lIbhDDsZ6VXKS4PKF7W7fmlJX_bmyKp1PSSwTZ7QyDo781oolhBNLaxs9Ja0fZ2DtK6OVy11UtYmUqtDcxRY21Msf2N4_bzA4EGkTqV5ZlvRteqHWgrF_uCnttiOIzpqZNcAF1woRRc3a_-K7WHAzFhlBz308voPGQtzCymk6w_BjbcmzeFkJMlC0JhwbsQPxo_mkn_2IwkNbz6iHcSC5c6aA6g55HZHpmtV8moU1xrJ6nlOB7JYiQMwsyg1YubarS9Kbiv0xU0',
    time: '09:00 AM',
    date: 'Oct 24, 2023',
    status: 'Completed',
    reason: 'Routine Cardiology Follow-up'
  },
  {
    id: 'apt-2',
    doctorName: 'Dr. Michael Chen',
    doctorRole: 'Dermatology',
    doctorImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAocmXSYUqylpfvuW9StBlPpMRriiPmU3ng9-YoEMPukPUY4V27becb9_UnH8R1DVlwwry_wlvMcm5ymqHxSnHAfYLc4iDy8R-zUUQmck05IL6xF2MemZyG_8GcJ02eQzd2e9H-fZ2oPTdy1tY8nKKSZ8XAbHrt26cPLxqX564V-cZ0C7N1x87ZpTbLciTpYE2LSEFyovFqGqzaxY570JTpXEQuEKZ32tXxQYaIyqeoTsXol-jayEiq0X1awE4hdAKAz4oWPHx4d88',
    patientName: 'David Chen',
    patientId: '#NX-4402',
    patientImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDeStu4jzvYa3mv5uPI20q-uC795TdWWELIBO47Zmjd-fRa-C9BZmqBDl_6krCerSMDNPycaxeh8YFMTtzF6QKiwZ9_9RHYzgkRsqGm7A2l3MaKqw0A5Zawxfmm0V5_TkIFdqeIMDQFkucwKvnGpSApvqCDzKRc9z8KJmDbk2Lhfj0ZewTuxFjMf8SbL_fxlKwQWfJSoLbTzb-IWNhSqQGtyq4BK0Q8C4t2ADwjEhNUnVSu5ErX2rFy_-Rj0sQrjmaiC-spl-hSuHg',
    time: '02:15 PM',
    date: 'Nov 02, 2023',
    status: 'Active',
    reason: 'Pre-surgery consultation'
  },
  {
    id: 'apt-3',
    doctorName: 'Dr. Marcus Thorne',
    doctorRole: 'Post-Op Consultation',
    doctorImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJEIceDb3kG1la0Lr9nCVc-C-zEt81_vLreqWa2A3pCSv1FLLVlHRwBM4Xdc-jJx7t2g60a3NyLEY1VWa09tdGXiWR5oZb3P3IVRq2B8YreQtp-A0LTrpo1_sPgS1-XG1vqtCmG30oj6uhzF9W68vhymfE-NKmaNcPQBSmeMkFtN7yV32F0_uReMmCzN-tD8m8pkfgADM03KrFtOjDK6pqtLxS7jaYwuDJuYbKQ86O9HJostX02dqaxXWdSA3yF7XHKUb4D2JKUow',
    patientName: 'Marcus Thorne',
    patientId: '#NX-2281',
    patientImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJEIceDb3kG1la0Lr9nCVc-C-zEt81_vLreqWa2A3pCSv1FLLVlHRwBM4Xdc-jJx7t2g60a3NyLEY1VWa09tdGXiWR5oZb3P3IVRq2B8YreQtp-A0LTrpo1_sPgS1-XG1vqtCmG30oj6uhzF9W68vhymfE-NKmaNcPQBSmeMkFtN7yV32F0_uReMmCzN-tD8m8pkfgADM03KrFtOjDK6pqtLxS7jaYwuDJuYbKQ86O9HJostX02dqaxXWdSA3yF7XHKUb4D2JKUow',
    time: '10:30 AM',
    date: 'Oct 25, 2023',
    status: 'Active',
    reason: 'Post-Op Consultation'
  },
  {
    id: 'apt-4',
    doctorName: 'Dr. Arthur McMillian',
    doctorRole: 'General Health',
    doctorImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDqpSZsKNUZZSyXi3ZCX4oiKLCWY6TxW2OLAAybDHnd-W64O30ha1faARZSK2Qj4vzmfjHVknUGWpOaHYCDbQSH78bll6HuuZCPUuOP5WHySmieQgOF0Oyb23VgNajsTE6U5mAW92fqrdt_W99tyAwFlI9f5VMATfQEj6fcYrA14dKyrZI6-99Ci-Cq0BjZCy9AYqRuu8Oy9OMOA40EJJhB_cfoxZvtSnb7yw8mePA0_6wyV2FhEn9N4WqTpn17d2HoMqQbtZhQcEI',
    patientName: 'Arthur McMillian',
    patientId: '#NX-9912',
    patientImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDqpSZsKNUZZSyXi3ZCX4oiKLCWY6TxW2OLAAybDHnd-W64O30ha1faARZSK2Qj4vzmfjHVknUGWpOaHYCDbQSH78bll6HuuZCPUuOP5WHySmieQgOF0Oyb23VgNajsTE6U5mAW92fqrdt_W99tyAwFlI9f5VMATfQEj6fcYrA14dKyrZI6-99Ci-Cq0BjZCy9AYqRuu8Oy9OMOA40EJJhB_cfoxZvtSnb7yw8mePA0_6wyV2FhEn9N4WqTpn17d2HoMqQbtZhQcEI',
    time: '11:15 AM',
    date: 'Oct 25, 2023',
    status: 'Waiting',
    reason: 'Annual Physical'
  }
];

export const initialRecords: MedicalRecord[] = [
  {
    id: 'rec-1',
    date: 'Sep 15, 2023',
    doctorName: 'Dr. Elena Rodriguez',
    reason: 'Annual Physical',
    status: 'Completed',
    notes: 'General checkup healthy. BP 120/80. Recommending seasonal checks.',
    vitalSigns: 'BP: 120/80 mmHg, HR: 72 bpm, Temp: 98.6°F'
  },
  {
    id: 'rec-2',
    date: 'Aug 22, 2023',
    doctorName: 'Dr. Marcus Thorne',
    reason: 'Blood Panel Results',
    status: 'Completed',
    notes: 'Metabolic panel values well within guidelines. Slight Vitamin D deficiency observed.',
    vitalSigns: 'Normal LDL/HDL ratio, Vitamin D: 22 ng/mL (Low)'
  },
  {
    id: 'rec-3',
    date: 'Jul 05, 2023',
    doctorName: 'Dr. Sarah Jenkins',
    reason: 'Initial Consultation',
    status: 'Completed',
    notes: 'Auscultation normal. Patient reporting occasional fatigue. Follow-up ECG arranged next quarter.',
    vitalSigns: 'BP: 118/76 mmHg, HR: 68 bpm'
  }
];

export const initialLogs: ActivityLog[] = [
  {
    id: 'log-1',
    title: 'Dr. Sarah Miller added a record',
    meta: 'Patient ID #88219',
    time: '2m ago',
    type: 'success'
  },
  {
    id: 'log-2',
    title: 'Care platform maintenance completed',
    meta: 'Clinical workspace refreshed',
    time: '14m ago',
    type: 'system'
  },
  {
    id: 'log-3',
    title: 'Emergency Alert: ICU Overload',
    meta: 'Ward 4B Occupancy at max limits',
    time: '1h ago',
    type: 'alert'
  },
  {
    id: 'log-4',
    title: 'New user created: Nurse Admin',
    meta: 'Privilege Level: Hospital Operations',
    time: '3h ago',
    type: 'info'
  }
];

export const initialStaff: StaffMember[] = [
  {
    id: 'staff-1',
    name: 'Dr. James Butler',
    email: 'j.butler@mednexus.com',
    role: 'Senior Surgeon',
    status: 'Active',
    avatarInitials: 'JB'
  },
  {
    id: 'staff-2',
    name: 'Nurse Ana Lopez',
    email: 'a.lopez@mednexus.com',
    role: 'Head Nurse',
    status: 'On Duty',
    avatarInitials: 'AL'
  },
  {
    id: 'staff-3',
    name: 'Mark Kovacs',
    email: 'm.kovacs@mednexus.com',
    role: 'Operations Coordinator',
    status: 'Away',
    avatarInitials: 'MK'
  }
];

export const initialTopPerformers: PerformanceDoctor[] = [
  {
    id: 'perf-1',
    name: 'Dr. Aris Thorne',
    rate: '98.5% Success Rate',
    cases: 420,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDD4axEZiSIqf2d-FdrcuViAi72ah3Ku6pVpLB9SXNOYaFhJEZv9OVZGEqetcwQgCx1wnAt9dXgIvubinIVnG8Oj_zOwpUDA527Mws-xxdHZs1S4QVQUQuTMV6AmpP2z5tEPWnjJE1HdVS55nLywPhoQjk5OaqqNFmOpYLUgyVXKvMKVu77gZUxZCpHMhjreQoe55HI27FcI46cvfd32voJbGDfxtwsPwv-oq4ZsxsvGX24qrX5vN3g5-yV45p6AJDlFPHO8B_d_eQ',
    rank: 1
  },
  {
    id: 'perf-2',
    name: 'Dr. Elena Rossi',
    rate: '97.2% Success Rate',
    cases: 385,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCG0RntrTZ1DTnyOzjRbRQ0hoB_ML4Xp679V7e2kcQmTMf8cnVNl8oJNTvuPqdyYazlSMgh6XzI-iMsiICLkRtoSjQ2I51htTyrIC_8tRdwUmHlhsDfi6HfV0U6ATa1FTCTN_3Dpmvx-cuAYVXkkWMAHo0Y-EdUU7MUMMK8R4hQM9iuQt8lQRV2Ar0at4TWO9wUpqOi-fjbGrQMuA7Ytl-LDrGPSj4VNADHfjr89DnpgeOg_S6ix493nxLOvzZEyqK_zHlVjf4dEl4',
    rank: 2
  },
  {
    id: 'perf-3',
    name: 'Dr. Samuel Chen',
    rate: '96.8% Success Rate',
    cases: 312,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC0HleXKrVaMEsqaBs32MX32MpbIKBZUbBa7DgeFiKF-tHxiJT2Lyb1nNk8im1jDOR8sMtWjgvK-SSq-K-U8y9vpIhLrO85H3qr69OiWNvHlvH8AZwKzOqXnnZ8DPFh2bnVmGiLZCQRUP1l2aFOQT8rlBfUz43nZhWhlsC0xSZJXUtpN3YcYrBgFyrZs_zNUX0TN_ipWiF-vzLqxGD67Rd3_-qP6dl_0Jp_FE0pwBkdDM6kjqN8y5dZ7wByr2Ru1AuvgM7EddTWJV8',
    rank: 3
  }
];
