/* ============================================================
   ZORVYN API SERVICE LAYER
   Central place for all HTTP calls to the backend.
   The Vite proxy forwards /api/* → http://localhost:5000/api/*
   ============================================================ */

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ── Helpers ────────────────────────────────────────────────

function getToken(): string | null {
  return localStorage.getItem('zorvyn_token');
}

function authHeaders(): HeadersInit {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function handleResponse<T>(res: Response): Promise<T> {
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((json as any)?.message || `HTTP ${res.status}`);
  }
  return (json as any)?.data ?? json;
}

// ── Auth ───────────────────────────────────────────────────

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  role?: 'ADMIN' | 'ANALYST' | 'VIEWER';
}

export interface AuthResponse {
  token: string;
  user: {
    _id: string;
    email: string;
    role: 'ADMIN' | 'ANALYST' | 'VIEWER';
    status: string;
  };
}

export const authApi = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const res = await fetch(`${BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return handleResponse<AuthResponse>(res);
  },

  register: async (payload: RegisterPayload): Promise<AuthResponse['user']> => {
    const res = await fetch(`${BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return handleResponse<AuthResponse['user']>(res);
  },
};

// ── Dashboard ──────────────────────────────────────────────

export interface DashboardSummary {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  recordCount: number;
}

export const dashboardApi = {
  getSummary: async (): Promise<DashboardSummary> => {
    const res = await fetch(`${BASE}/dashboard/summary`, {
      headers: authHeaders(),
    });
    return handleResponse<DashboardSummary>(res);
  },
};

// ── Financial Records ──────────────────────────────────────

export type RecordType = 'INCOME' | 'EXPENSE';

export interface FinancialRecord {
  _id: string;
  amount: number;
  type: RecordType;
  category: string;
  date: string;
  notes?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRecordPayload {
  amount: number;
  type: RecordType;
  category: string;
  date: string;
  notes?: string;
}

export const recordsApi = {
  getAll: async (): Promise<FinancialRecord[]> => {
    const res = await fetch(`${BASE}/records`, {
      headers: authHeaders(),
    });
    return handleResponse<FinancialRecord[]>(res);
  },

  create: async (payload: CreateRecordPayload): Promise<FinancialRecord> => {
    const res = await fetch(`${BASE}/records`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(payload),
    });
    return handleResponse<FinancialRecord>(res);
  },

  update: async (id: string, payload: Partial<CreateRecordPayload>): Promise<FinancialRecord> => {
    const res = await fetch(`${BASE}/records/${id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(payload),
    });
    return handleResponse<FinancialRecord>(res);
  },

  delete: async (id: string): Promise<void> => {
    const res = await fetch(`${BASE}/records/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    return handleResponse<void>(res);
  },
};
