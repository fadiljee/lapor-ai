const API_BASE_URL = '/api/v1';


async function fetchAPI(endpoint, options = {}) {
  const defaultHeaders = {};

  const token = localStorage.getItem('lapor_ai_token');
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  
  if (!(options.body instanceof FormData)) {
    defaultHeaders['Content-Type'] = 'application/json';
  }
  

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: { ...defaultHeaders, ...options.headers },
  });

  
  const text = await response.text();
  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { detail: text || `Server error ${response.status}` };
  }

  if (!response.ok) {
    const errorMessage = typeof data.detail === 'string' 
      ? data.detail 
      : JSON.stringify(data.detail || data) || `Server error ${response.status}`;
    
    const err = new Error(errorMessage);
    err.response = { data };
    throw err;
  }
  return data;
}


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

export const api = {
  
  login: (credentials) =>
    fetchAPI('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),

  register: (data) =>
    fetchAPI('/auth/register', { method: 'POST', body: JSON.stringify(data) }),

  verifyOTP: (data) =>
    fetchAPI('/verify-email', { method: 'POST', body: JSON.stringify(data) }),

  resendOTP: (data) =>
    fetchAPI('/resend-otp', { method: 'POST', body: JSON.stringify(data) }),

  
  createReport: (reportData) =>
    fetchAPI('/reports', { 
      method: 'POST', 
      body: reportData instanceof FormData ? reportData : JSON.stringify(reportData) 
    }),

  submitReport: (reportData, attachment) => {
    if (reportData instanceof FormData) {
      return fetchAPI('/reports', { method: 'POST', body: reportData });
    }
    const formData = new FormData();
    Object.entries(reportData).forEach(([k, v]) => {
      if (v !== null && v !== undefined) formData.append(k, v);
    });
    if (attachment) {
      formData.append('lampiran', attachment);
    }
    return fetchAPI('/reports', { method: 'POST', body: formData });
  },

  getReports: (params = {}) => {
    const clean = Object.fromEntries(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== '')
    );
    const query = new URLSearchParams(clean).toString();
    return fetchAPI(`/reports${query ? `?${query}` : ''}`);
  },

  getReportDetail: (id) => fetchAPI(`/reports/${id}`),

  overrideReport: (id, updateData) =>
    fetchAPI(`/reports/${id}`, { method: 'PATCH', body: JSON.stringify(updateData) }),

  getDashboardStats: () => fetchAPI('/dashboard'),

  getAuditLogs: () => fetchAPI('/audit-logs'),

  
  getUsers: () => fetchAPI('/users'),
  createUser: (data) => fetchAPI('/users', { method: 'POST', body: JSON.stringify(data) }),
  updateUser: (id, data) => fetchAPI(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteUser: (id) => fetchAPI(`/users/${id}`, { method: 'DELETE' }),

  // Instansi API
  getInstansi: () => fetchAPI('/instansi'),
  createInstansi: (data) => fetchAPI('/instansi', { method: 'POST', body: JSON.stringify(data) }),
  updateInstansi: (id, data) => fetchAPI(`/instansi/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteInstansi: (id) => fetchAPI(`/instansi/${id}`, { method: 'DELETE' }),

  // Support Email API
  submitSupportContact: (data) => fetchAPI('/support/contact', { method: 'POST', body: JSON.stringify(data) }),
};