const API_BASE_URL = '/api/v1';

async function fetchAPI(endpoint, options = {}) {
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };
  
  const token = localStorage.getItem('lapor_ai_token');
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || 'Terjadi kesalahan pada server');
  }
  return data;
}

export const api = {
  // Reports
  createReport: (reportData) => fetchAPI('/reports', { method: 'POST', body: JSON.stringify(reportData) }),
  getReports: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchAPI(`/reports?${query}`);
  },
  getReportDetail: (id) => fetchAPI(`/reports/${id}`),
  overrideReport: (id, updateData) => fetchAPI(`/reports/${id}`, { method: 'PATCH', body: JSON.stringify(updateData) }),

  // Auth & OTP
  login: (credentials) => fetchAPI('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  verifyOTP: (data) => fetchAPI('/verify-email', { method: 'POST', body: JSON.stringify(data) }),
  resendOTP: (data) => fetchAPI('/resend-otp', { method: 'POST', body: JSON.stringify(data) }),

  // Dashboard & Audit
  getDashboardStats: () => fetchAPI('/dashboard'),
  getAuditLogs: () => fetchAPI('/audit-logs'),
};
