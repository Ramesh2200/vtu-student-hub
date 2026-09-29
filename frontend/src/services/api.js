/**
 * VTU Student Connect — API Service Client
 * Connects directly to Java Jakarta Servlets backend at http://localhost:8080/api
 * Includes automatic token injection, session handling, error formatting, and resilient fallback.
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export const authStorage = {
  getToken: () => localStorage.getItem('vtu_token'),
  getUser: () => {
    try {
      const u = localStorage.getItem('vtu_user');
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  },
  getRole: () => localStorage.getItem('vtu_role') || 'STUDENT',
  setAuth: (user, token, role) => {
    if (user) localStorage.setItem('vtu_user', JSON.stringify(user));
    if (token) localStorage.setItem('vtu_token', token);
    if (role) localStorage.setItem('vtu_role', role);
    localStorage.setItem('vtu_is_auth', 'true');
  },
  clearAuth: () => {
    localStorage.removeItem('vtu_user');
    localStorage.removeItem('vtu_token');
    localStorage.removeItem('vtu_role');
    localStorage.removeItem('vtu_is_auth');
  }
};

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const token = authStorage.getToken();
  const role = authStorage.getRole();

  const headers = new Headers(options.headers || {});
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
    headers.set('X-User-Id', token.replace('uid-', ''));
  }
  if (role) {
    headers.set('X-User-Role', role);
  }

  try {
    const res = await fetch(url, {
      ...options,
      headers
    });

    const data = await res.json();
    if (!res.ok || data.success === false) {
      throw new Error(data.message || data.error || `HTTP error ${res.status}`);
    }
    return data;
  } catch (err) {
    console.warn(`[VTU-API] Error requesting ${endpoint}:`, err.message);
    throw err;
  }
}

export const api = {
  // Authentication
  auth: {
    login: async (email, password) => {
      const res = await request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      if (res.data) {
        authStorage.setAuth(res.data.user, res.data.token, res.data.role);
      }
      return res.data;
    },
    register: async (payload) => {
      const res = await request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      if (res.data) {
        authStorage.setAuth(res.data.user, res.data.token, res.data.role);
      }
      return res.data;
    },
    logout: async () => {
      try {
        await request('/auth/logout', { method: 'POST' });
      } catch (e) {
        console.warn(e);
      } finally {
        authStorage.clearAuth();
      }
    },
    forgotPassword: async (email, newPassword) => {
      return request('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ email, newPassword })
      });
    },
    sendOtp: async (email) => {
      const res = await request('/auth/send-otp', {
        method: 'POST',
        body: JSON.stringify({ email })
      });
      return res.data;
    },
    verifyOtp: async (email, otp) => {
      const res = await request('/auth/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ email, otp })
      });
      return res.data;
    }
  },

  // Profile
  profile: {
    get: async (userId) => {
      const q = userId ? `?userId=${userId}` : '';
      const res = await request(`/profile${q}`);
      return res.data;
    },
    update: async (profileData) => {
      const res = await request('/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData)
      });
      return res.data;
    }
  },

  // Semesters & Subjects
  semesters: {
    getAll: async () => {
      const res = await request('/semesters');
      return res.data || [];
    },
    getById: async (id) => {
      const res = await request(`/semesters/${id}`);
      return res.data;
    },
    getSubjects: async (semesterId) => {
      const res = await request(`/semesters/${semesterId}/subjects`);
      return res.data || [];
    }
  },

  subjects: {
    getAll: async (semesterId) => {
      const q = semesterId ? `?semesterId=${semesterId}` : '';
      const res = await request(`/subjects${q}`);
      return res.data || [];
    },
    getById: async (id) => {
      const res = await request(`/subjects/${id}`);
      return res.data;
    }
  },

  // Notes
  notes: {
    getAll: async (params = {}) => {
      const q = new URLSearchParams(params).toString();
      const res = await request(`/notes?${q}`);
      return res.data || [];
    },
    getById: async (id) => {
      const res = await request(`/notes/${id}`);
      return res.data;
    },
    download: async (id, title = 'VTU_Lecture_Note') => {
      try {
        const res = await fetch(`${API_BASE}/notes/${id}/download`);
        if (!res.ok) throw new Error('Download failed');
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `${title.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        return true;
      } catch {
        window.location.href = `${API_BASE}/notes/${id}/download`;
        return true;
      }
    },
    viewUrl: (id) => `${API_BASE}/notes/${id}/view`,
    downloadUrl: (id) => `${API_BASE}/notes/${id}/download`,
    bookmark: async (id) => {
      const res = await request('/bookmarks', {
        method: 'POST',
        body: JSON.stringify({ resourceType: 'NOTE', resourceId: id })
      });
      return res.data;
    }
  },

  // Bookmarks
  bookmarks: {
    getAll: async () => {
      const res = await request('/bookmarks');
      return res.data || [];
    },
    toggle: async (resourceType, resourceId) => {
      const res = await request('/bookmarks', {
        method: 'POST',
        body: JSON.stringify({ resourceType, resourceId })
      });
      return res.data;
    }
  },

  // Question Banks
  questionBanks: {
    getAll: async (params = {}) => {
      const q = new URLSearchParams(params).toString();
      const res = await request(`/question-banks?${q}`);
      return res.data || [];
    },
    getById: async (id) => {
      const res = await request(`/question-banks/${id}`);
      return res.data;
    },
    download: async (id, title = 'VTU_Question_Bank') => {
      try {
        const res = await fetch(`${API_BASE}/question-banks/${id}/download`);
        if (!res.ok) throw new Error('Download failed');
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `${title.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      } catch (err) {
        window.open(`${API_BASE}/question-banks/${id}/download`, '_blank');
      }
    },
    getViewUrl: (id) => `${API_BASE}/question-banks/${id}/view`,
    getDownloadUrl: (id) => `${API_BASE}/question-banks/${id}/download`
  },

  // Previous Papers
  previousPapers: {
    getAll: async (params = {}) => {
      const q = new URLSearchParams(params).toString();
      const res = await request(`/previous-papers?${q}`);
      return res.data || [];
    },
    getById: async (id) => {
      const res = await request(`/previous-papers/${id}`);
      return res.data;
    },
    download: async (id, title = 'VTU_Question_Paper') => {
      try {
        const res = await fetch(`${API_BASE}/previous-papers/${id}/download`);
        if (!res.ok) throw new Error('Download failed');
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `${title.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        return true;
      } catch {
        window.location.href = `${API_BASE}/previous-papers/${id}/download`;
        return true;
      }
    },
    viewUrl: (id) => `${API_BASE}/previous-papers/${id}/view`,
    downloadUrl: (id) => `${API_BASE}/previous-papers/${id}/download`
  },

  // Placements
  placements: {
    getAll: async (params = {}) => {
      const q = new URLSearchParams(params).toString();
      const res = await request(`/placements?${q}`);
      return res.data || [];
    },
    getById: async (id) => {
      const res = await request(`/placements/${id}`);
      return res.data;
    },
    apply: async (id, data = {}) => {
      const isFormData = data instanceof FormData;
      const res = await request(`/placements/${id}/apply`, {
        method: 'POST',
        body: isFormData ? data : JSON.stringify(data)
      });
      return res.data;
    },
    uploadResume: async (file) => {
      const formData = new FormData();
      formData.append('resume', file);
      const res = await request('/placements/upload-resume', {
        method: 'POST',
        body: formData
      });
      return res.data;
    },
    getMyResume: async () => {
      try {
        const res = await request('/placements/my-resume');
        return res.data;
      } catch {
        return null;
      }
    },
    getMyApplications: async () => {
      const res = await request('/placements/my-applications');
      return res.data || [];
    },
    resumeViewUrl: (file) => {
      const name = (file || 'VTU_Student_Resume.pdf').split('/').pop();
      return `${API_BASE}/placements/resumes/view?file=${encodeURIComponent(name)}`;
    },
    resumeDownloadUrl: (file) => {
      const name = (file || 'VTU_Student_Resume.pdf').split('/').pop();
      return `${API_BASE}/placements/resumes/download?file=${encodeURIComponent(name)}`;
    },
    downloadResume: async (file, title = 'VTU_Student_Resume') => {
      const name = (file || 'VTU_Student_Resume.pdf').split('/').pop();
      try {
        const res = await fetch(`${API_BASE}/placements/resumes/download?file=${encodeURIComponent(name)}`);
        if (!res.ok) throw new Error('Download failed');
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `${title.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        return true;
      } catch {
        window.open(`${API_BASE}/placements/resumes/download?file=${encodeURIComponent(name)}`, '_blank');
        return true;
      }
    }
  },

  // Community Chat
  chat: {
    getRooms: async () => {
      const res = await request('/chat/rooms');
      return res.data || [];
    },
    getMessages: async (roomId, limit = 50, beforeId = null) => {
      let q = `roomId=${roomId}&limit=${limit}`;
      if (beforeId) q += `&beforeId=${beforeId}`;
      const res = await request(`/chat/messages?${q}`);
      return res.data || [];
    },
    sendMessage: async (roomOrData, messageText, extra = {}) => {
      let bodyData;
      if (typeof roomOrData === 'object' && roomOrData !== null) {
        bodyData = roomOrData;
      } else {
        bodyData = {
          roomId: roomOrData,
          message: messageText,
          content: messageText,
          ...extra
        };
      }
      const res = await request('/chat/messages', {
        method: 'POST',
        body: JSON.stringify(bodyData)
      });
      return res.data;
    },
    report: async (messageId, reason) => {
      const res = await request('/chat/report', {
        method: 'POST',
        body: JSON.stringify({ messageId, reason })
      });
      return res.data;
    },
    reportMessage: async (messageId, reason) => {
      const res = await request('/chat/report', {
        method: 'POST',
        body: JSON.stringify({ messageId, reason })
      });
      return res.data;
    }
  },

  // Advertisements
  ads: {
    getActive: async () => {
      const res = await request('/advertisements');
      return res.data || [];
    },
    recordClick: async (id) => {
      try {
        await request(`/advertisements/${id}/click`, { method: 'POST' });
      } catch (e) {
        console.warn(e);
      }
    }
  },

  // Notifications
  notifications: {
    getAll: async () => {
      const res = await request('/notifications');
      return res.data || [];
    },
    markRead: async (id) => {
      const res = await request(`/notifications/${id}`, { method: 'PUT' });
      return res.data;
    },
    markAllRead: async () => {
      const res = await request('/notifications/read-all', { method: 'PUT' });
      return res.data;
    }
  },

  // Announcements
  announcements: {
    getActive: async () => {
      const res = await request('/announcements');
      return res.data || [];
    }
  },

  // Bookmarks
  bookmarks: {
    getAll: async () => {
      const res = await request('/bookmarks');
      return res.data || [];
    },
    toggle: async (resourceType, resourceId) => {
      const res = await request('/bookmarks', {
        method: 'POST',
        body: JSON.stringify({ resourceType, resourceId })
      });
      return res.data;
    }
  },

  // Downloads
  downloads: {
    getAll: async () => {
      const res = await request('/downloads');
      return res.data || [];
    }
  },

  // Global Search
  search: {
    global: async (query) => {
      const res = await request(`/search?q=${encodeURIComponent(query)}`);
      return res.data || { notes: [], questionBanks: [], previousPapers: [] };
    }
  },

  // Admin Portal Endpoints
  admin: {
    getStats: async () => {
      const res = await request('/admin/stats');
      return res.data || {};
    },
    // Notes
    getNotes: async (params = {}) => {
      const q = new URLSearchParams(params).toString();
      const res = await request(`/admin/notes?${q}`);
      return res.data || [];
    },
    uploadNotePdf: async (formData) => {
      const res = await request('/admin/notes', {
        method: 'POST',
        body: formData
      });
      return res.data;
    },
    updateNote: async (id, data) => {
      const res = await request(`/admin/notes/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
      return res.data;
    },
    deleteNote: async (id) => {
      const res = await request(`/admin/notes/${id}`, { method: 'DELETE' });
      return res.data;
    },
    toggleNoteStatus: async (id, status) => {
      const res = await request(`/admin/notes/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status })
      });
      return res.data;
    },

    // Question Banks
    getQuestionBanks: async (params = {}) => {
      const q = new URLSearchParams(params).toString();
      const res = await request(`/admin/question-banks?${q}`);
      return res.data || [];
    },
    createQuestionBank: async (data) => {
      const res = await request('/admin/question-banks', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      return res.data;
    },
    uploadQuestionBankPdf: async (formData) => {
      const res = await request('/admin/question-banks', {
        method: 'POST',
        body: formData
      });
      return res.data;
    },
    updateQuestionBank: async (id, data) => {
      const res = await request(`/admin/question-banks/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
      return res.data;
    },
    deleteQuestionBank: async (id) => {
      const res = await request(`/admin/question-banks/${id}`, { method: 'DELETE' });
      return res.data;
    },

    // Previous Papers
    getPreviousPapers: async (params = {}) => {
      const q = new URLSearchParams(params).toString();
      const res = await request(`/admin/previous-papers?${q}`);
      return res.data || [];
    },
    uploadPaperPdf: async (formData) => {
      const res = await request('/admin/previous-papers', {
        method: 'POST',
        body: formData
      });
      return res.data;
    },
    updatePaper: async (id, data) => {
      const res = await request(`/admin/previous-papers/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
      return res.data;
    },
    deletePaper: async (id) => {
      const res = await request(`/admin/previous-papers/${id}`, { method: 'DELETE' });
      return res.data;
    },

    // Placements
    getPlacements: async () => {
      const res = await request('/admin/placements');
      return res.data || [];
    },
    createPlacement: async (data) => {
      const res = await request('/admin/placements', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      return res.data;
    },
    updatePlacement: async (id, data) => {
      const res = await request(`/admin/placements/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
      return res.data;
    },
    deletePlacement: async (id) => {
      const res = await request(`/admin/placements/${id}`, { method: 'DELETE' });
      return res.data;
    },
    getApplicants: async (placementId) => {
      const res = await request(`/admin/placements/${placementId}/applicants`);
      return res.data || [];
    },
    updateApplicantStatus: async (appId, status) => {
      const res = await request(`/admin/placements/applications/${appId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status })
      });
      return res.data;
    },

    // Advertisements
    getAds: async () => {
      const res = await request('/admin/advertisements');
      return res.data || [];
    },
    createAd: async (data) => {
      const res = await request('/admin/advertisements', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      return res.data;
    },
    updateAd: async (id, data) => {
      const res = await request(`/admin/advertisements/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
      return res.data;
    },
    deleteAd: async (id) => {
      const res = await request(`/admin/advertisements/${id}`, { method: 'DELETE' });
      return res.data;
    },

    // Announcements
    getAnnouncements: async () => {
      const res = await request('/admin/announcements');
      return res.data || [];
    },
    createAnnouncement: async (data) => {
      const res = await request('/admin/announcements', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      return res.data;
    },
    updateAnnouncement: async (id, data) => {
      const res = await request(`/admin/announcements/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
      return res.data;
    },
    deleteAnnouncement: async (id) => {
      const res = await request(`/admin/announcements/${id}`, { method: 'DELETE' });
      return res.data;
    },

    // Users
    getUsers: async () => {
      const res = await request('/admin/users');
      return res.data || [];
    },
    updateUserStatus: async (userId, status) => {
      const res = await request(`/admin/users/${userId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status })
      });
      return res.data;
    },

    // Chat Moderation
    getChatReports: async (status) => {
      const q = status ? `?status=${status}` : '';
      const res = await request(`/admin/chat/reports${q}`);
      return res.data || [];
    },
    reviewChatReport: async (reportId, payload) => {
      const res = await request(`/admin/chat/reports/${reportId}`, {
        method: 'PUT',
        body: JSON.stringify(payload)
      });
      return res.data;
    },

    // Audit Logs
    getAuditLogs: async (limit = 100) => {
      const res = await request(`/admin/audit-logs?limit=${limit}`);
      return res.data || [];
    },

    // Semesters & Subjects
    getAllSemesters: async () => {
      const res = await request('/admin/semesters');
      return res.data || [];
    },
    createSemester: async (data) => {
      const res = await request('/admin/semesters', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      return res.data;
    },
    updateSemester: async (id, data) => {
      const res = await request(`/admin/semesters/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
      return res.data;
    },
    toggleSemesterStatus: async (id, isActive) => {
      const res = await request(`/admin/semesters/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ active: isActive })
      });
      return res.data;
    },
    deleteSemester: async (id) => {
      const res = await request(`/admin/semesters/${id}`, { method: 'DELETE' });
      return res.data;
    },
    createSubject: async (data) => {
      const res = await request('/admin/subjects', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      return res.data;
    },
    updateSubject: async (id, data) => {
      const res = await request(`/admin/subjects/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
      return res.data;
    },
    deleteSubject: async (id) => {
      const res = await request(`/admin/subjects/${id}`, { method: 'DELETE' });
      return res.data;
    },

    // Get all subjects (used in notes upload, paper upload, subject management)
    getSubjects: async (semesterId) => {
      const q = semesterId ? `?semesterId=${semesterId}` : '';
      const res = await request(`/admin/subjects${q}`);
      return res.data || [];
    },

    // Alias: uploadNote → uploadNotePdf (for NotesPdfUploadPage)
    uploadNote: async (formData) => {
      const res = await request('/admin/notes', {
        method: 'POST',
        body: formData
      });
      return res.data;
    },

    // Previous Papers CRUD (used in PreviousPaperManagementPage)
    createPreviousPaper: async (data) => {
      const res = await request('/admin/previous-papers', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      return res.data;
    },
    deletePreviousPaper: async (id) => {
      const res = await request(`/admin/previous-papers/${id}`, { method: 'DELETE' });
      return res.data;
    }
  }
};
