const API_BASE_URL = '/api/v1';

// ─── Core fetch wrapper ───────────────────────────────────────────────────────
async function fetchAPI(endpoint, options = {}) {
  const defaultHeaders = { 'Content-Type': 'application/json' };

  const token = localStorage.getItem('lapor_ai_token');
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: { ...defaultHeaders, ...options.headers },
  });

  // Handle empty body (204, etc.)
  const text = await response.text();
  const data = text ? JSON.parse(text) : {};

  if (!response.ok) {
    throw new Error(data.detail || `Server error ${response.status}`);
  }
  return data;
}

// ─── Auth helpers ─────────────────────────────────────────────────────────────
export function getStoredToken() {
  return localStorage.getItem('lapor_ai_token');
}
export function getStoredRole() {
  return localStorage.getItem('lapor_ai_role') || 'warga';
}
export function getStoredNama() {
  return localStorage.getItem('lapor_ai_nama') || 'Pengguna';
}
export function isLoggedIn() {
  return !!localStorage.getItem('lapor_ai_token');
}
export function logout() {
  localStorage.removeItem('lapor_ai_token');
  localStorage.removeItem('lapor_ai_role');
  localStorage.removeItem('lapor_ai_nama');
}

// ─── API methods ──────────────────────────────────────────────────────────────
export const api = {
  // ── Auth & OTP
  login: (credentials) =>
    fetchAPI('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),

  register: (data) =>
    fetchAPI('/auth/register', { method: 'POST', body: JSON.stringify(data) }),

  verifyOTP: (data) =>
    fetchAPI('/verify-email', { method: 'POST', body: JSON.stringify(data) }),

  resendOTP: (data) =>
    fetchAPI('/resend-otp', { method: 'POST', body: JSON.stringify(data) }),

  // ── Reports
  createReport: (reportData) =>
    fetchAPI('/reports', { method: 'POST', body: JSON.stringify(reportData) }),

  /**
   * @param {Object} params - Optional filters: urgensi, kategori, status, search
   */
  getReports: (params = {}) => {
    // Remove undefined/empty keys before building query string
    const clean = Object.fromEntries(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== '')
    );
    const query = new URLSearchParams(clean).toString();
    return fetchAPI(`/reports${query ? `?${query}` : ''}`);
  },

  getReportDetail: (id) => fetchAPI(`/reports/${id}`),

  overrideReport: (id, updateData) =>
    fetchAPI(`/reports/${id}`, { method: 'PATCH', body: JSON.stringify(updateData) }),

  // ── Dashboard & Analytics
  getDashboardStats: () => fetchAPI('/dashboard'),

  // ── Audit Log
  getAuditLogs: () => fetchAPI('/audit-logs'),
};
