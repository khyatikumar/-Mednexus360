import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import type {
  Appointment,
  AppointmentPayload,
  CurrentUser,
  Doctor,
  DoctorPayload,
  DoctorRecommendationResponse,
  Hospital,
  HospitalPayload,
  LoginRequest,
  LoginResponse,
  MedicalRecord,
  MedicalRecordPayload,
  MessageResponse,
  Notification,
  Patient,
  PatientPayload,
  RegisterRequest,
  Report,
  SymptomResponse,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api';
const TOKEN_KEY = 'mednexus_access_token';

export class ApiError extends Error {
  status?: number;
  details?: unknown;

  constructor(message: string, status?: number, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

export const tokenStorage = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = tokenStorage.get();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ detail?: unknown; message?: string }>) => {
    const status = error.response?.status;
    const detail = error.response?.data?.detail ?? error.response?.data?.message;
    const message = normalizeApiMessage(status, detail, error.message);

    if (status === 401) {
      tokenStorage.clear();
      window.dispatchEvent(new Event('mednexus:unauthorized'));
    }

    return Promise.reject(new ApiError(message, status, detail));
  },
);

function normalizeApiMessage(status: number | undefined, detail: unknown, fallback: string): string {
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail)) {
    return detail
      .map((item) => {
        if (typeof item === 'object' && item && 'msg' in item) return String(item.msg);
        return String(item);
      })
      .join(', ');
  }

  if (status === 401) return 'Your session has expired. Please sign in again.';
  if (status === 403) return 'You do not have permission to perform this action.';
  if (status === 404) return 'The requested record was not found.';
  if (status === 422) return 'Please check the form values and try again.';
  if (status && status >= 500) return 'The server could not complete the request. Please try again.';

  return fallback || 'Something went wrong.';
}

async function request<T>(config: AxiosRequestConfig): Promise<T> {
  const response = await api.request<T>(config);
  return response.data;
}

export const authApi = {
  register: (payload: RegisterRequest) =>
    request<MessageResponse & { user_id: number }>({ method: 'POST', url: '/auth/register', data: payload }),
  login: async (payload: LoginRequest) => {
    const data = await request<LoginResponse>({ method: 'POST', url: '/auth/login', data: payload });
    tokenStorage.set(data.access_token);
    return data;
  },
  me: () => request<CurrentUser>({ method: 'GET', url: '/auth/me' }),
  logout: () => tokenStorage.clear(),
};

export const doctorsApi = {
  list: () => request<Doctor[]>({ method: 'GET', url: '/doctors/' }),
  get: (id: number) => request<Doctor>({ method: 'GET', url: `/doctors/${id}` }),
  create: (payload: DoctorPayload) => request<Doctor>({ method: 'POST', url: '/doctors/', data: payload }),
  update: (id: number, payload: DoctorPayload) =>
    request<MessageResponse>({ method: 'PUT', url: `/doctors/${id}`, data: payload }),
  remove: (id: number) => request<MessageResponse>({ method: 'DELETE', url: `/doctors/${id}` }),
};

export const patientsApi = {
  list: () => request<Patient[]>({ method: 'GET', url: '/patients/' }),
  get: (id: number) => request<Patient>({ method: 'GET', url: `/patients/${id}` }),
  create: (payload: PatientPayload) => request<Patient>({ method: 'POST', url: '/patients/', data: payload }),
  update: (id: number, payload: PatientPayload) =>
    request<MessageResponse>({ method: 'PUT', url: `/patients/${id}`, data: payload }),
  remove: (id: number) => request<MessageResponse>({ method: 'DELETE', url: `/patients/${id}` }),
};

export const hospitalsApi = {
  list: () => request<Hospital[]>({ method: 'GET', url: '/hospitals/' }),
  get: (id: number) => request<Hospital>({ method: 'GET', url: `/hospitals/${id}` }),
  create: (payload: HospitalPayload) => request<Hospital>({ method: 'POST', url: '/hospitals/', data: payload }),
  update: (id: number, payload: HospitalPayload) =>
    request<MessageResponse>({ method: 'PUT', url: `/hospitals/${id}`, data: payload }),
  remove: (id: number) => request<MessageResponse>({ method: 'DELETE', url: `/hospitals/${id}` }),
};

export const appointmentsApi = {
  list: () => request<Appointment[]>({ method: 'GET', url: '/appointments/' }),
  get: (id: number) => request<Appointment>({ method: 'GET', url: `/appointments/${id}` }),
  create: (payload: AppointmentPayload) =>
    request<Appointment>({ method: 'POST', url: '/appointments/', data: payload }),
  cancel: (id: number) => request<MessageResponse>({ method: 'PUT', url: `/appointments/${id}/cancel` }),
  complete: (id: number) => request<MessageResponse>({ method: 'PUT', url: `/appointments/${id}/complete` }),
  byDoctor: (doctorId: number) => request<Appointment[]>({ method: 'GET', url: `/appointments/doctor/${doctorId}` }),
  byPatient: (patientId: number) =>
    request<Appointment[]>({ method: 'GET', url: `/appointments/patient/${patientId}` }),
};

export const medicalRecordsApi = {
  list: () => request<MedicalRecord[]>({ method: 'GET', url: '/medical-records/' }),
  byPatient: (patientId: number) =>
    request<MedicalRecord[]>({ method: 'GET', url: `/medical-records/patient/${patientId}` }),
  create: (payload: MedicalRecordPayload) =>
    request<MedicalRecord>({ method: 'POST', url: '/medical-records/', data: payload }),
};

export const reportsApi = {
  byPatient: (patientId: number) => request<Report[]>({ method: 'GET', url: `/reports/patient/${patientId}` }),
  upload: (patientId: number, file: File, onUploadProgress?: (progress: number) => void) => {
    const data = new FormData();
    data.append('file', file);
    return request<Report>({
      method: 'POST',
      url: `/reports/upload/${patientId}`,
      data,
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (event) => {
        if (!event.total || !onUploadProgress) return;
        onUploadProgress(Math.round((event.loaded / event.total) * 100));
      },
    });
  },
};

export const notificationsApi = {
  byUser: (userId: number) => request<Notification[]>({ method: 'GET', url: `/notifications/user/${userId}` }),
  unread: (userId: number) =>
    request<Notification[]>({ method: 'GET', url: `/notifications/user/${userId}/unread` }),
  markRead: (id: number) => request<MessageResponse>({ method: 'PUT', url: `/notifications/${id}/read` }),
  markAllRead: (userId: number) =>
    request<MessageResponse>({ method: 'PUT', url: `/notifications/user/${userId}/read-all` }),
};

export const aiApi = {
  symptoms: (symptoms: string) =>
    request<SymptomResponse>({ method: 'POST', url: '/symptom-checker/', data: { symptoms } }),
  recommendDoctor: (symptoms: string) =>
    request<DoctorRecommendationResponse>({
      method: 'POST',
      url: '/doctor-recommendation/',
      data: { symptoms },
    }),
};
