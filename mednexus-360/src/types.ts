export type BackendRole = 'PATIENT' | 'DOCTOR' | 'HOSPITAL_ADMIN';

export interface CurrentUser {
  id: number;
  email: string;
  role: BackendRole;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest extends LoginRequest {
  role: BackendRole;
}

export interface LoginResponse {
  access_token: string;
  token_type: 'bearer';
}

export interface MessageResponse {
  message: string;
}

export interface DoctorPayload {
  user_id: number;
  hospital_id: number;
  specialization: string;
  experience_years: number;
  consultation_fee: number;
  available_from: string;
  available_to: string;
}

export interface Doctor extends DoctorPayload {
  id: number;
}

export interface PatientPayload {
  user_id: number;
  age: number;
  gender: string;
  blood_group: string;
  emergency_contact: string;
}

export interface Patient extends PatientPayload {
  id: number;
}

export interface HospitalPayload {
  name: string;
  address: string;
  city: string;
}

export interface Hospital extends HospitalPayload {
  id: number;
  rating: number;
}

export interface AppointmentPayload {
  patient_id: number;
  doctor_id: number;
  appointment_time: string;
}

export interface Appointment {
  id: number | string;
  status: 'scheduled' | 'completed' | 'cancelled' | string;
  patient_id?: number;
  doctor_id?: number;
  appointment_time?: string;
  doctorName?: string;
  doctorRole?: string;
  doctorImage?: string;
  patientName?: string;
  patientId?: string;
  patientImage?: string;
  time?: string;
  date?: string;
  reason?: string;
}

export interface MedicalRecordPayload {
  patient_id: number;
  doctor_id: number;
  diagnosis: string;
  prescription: string;
  notes: string;
}

export interface MedicalRecord {
  id: number | string;
  patient_id?: number;
  doctor_id?: number;
  diagnosis?: string;
  prescription?: string;
  notes?: string;
  created_at?: string;
  reason?: string;
  date?: string;
  doctorName?: string;
  status?: string;
  vitalSigns?: string;
}

export interface Report {
  id: number;
  patient_id: number;
  report_name: string;
  file_path: string;
  uploaded_at: string;
}

export interface Notification {
  id: number;
  user_id: number;
  title: string;
  message: string;
  is_read: boolean;
}

export interface SymptomResponse {
  possible_conditions: string[];
  recommended_specialist: string;
  urgency_level: string;
}

export interface DoctorRecommendationResponse {
  recommended_specialist: string;
  doctors: Pick<Doctor, 'id' | 'specialization' | 'experience_years'>[];
}

export interface DashboardCounts {
  hospitals?: number;
  doctors?: number;
  patients?: number;
  appointments?: number;
  total_appointments?: number;
  scheduled?: number;
  completed?: number;
  cancelled?: number;
}

export type Role = 'Clinician' | 'Admin' | 'Analyst';

export interface UserSession {
  email: string;
  role: Role;
  name: string;
  title: string;
  avatar: string;
}

export interface ActivityLog {
  id: string;
  title: string;
  meta: string;
  time: string;
  type: string;
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  department?: string;
  status: string;
  avatar?: string;
  email?: string;
  avatarInitials?: string;
}

export interface PerformanceDoctor {
  id: string;
  name: string;
  specialty?: string;
  score?: number;
  patients?: number;
  avatar?: string;
  image?: string;
  rank?: number;
  rate?: string;
  cases?: number;
}
