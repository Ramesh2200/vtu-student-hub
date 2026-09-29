import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { authStorage } from './services/api';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';

// Public Pages
import { LandingPage } from './pages/public/LandingPage';
import { LoginPage } from './pages/public/LoginPage';
import { RegisterPage } from './pages/public/RegisterPage';
import { ForgotPasswordPage } from './pages/public/ForgotPasswordPage';
import { OtpPage } from './pages/public/OtpPage';
import { AdminLoginPage } from './pages/public/AdminLoginPage';
import { AboutPage } from './pages/public/AboutPage';
import { HelpPage } from './pages/public/HelpPage';

// Student Pages
import { StudentDashboard } from './pages/student/StudentDashboard';
import { SemestersPage } from './pages/student/SemestersPage';
import { SemesterDetailsPage } from './pages/student/SemesterDetailsPage';
import { SubjectDetailsPage } from './pages/student/SubjectDetailsPage';
import { NotesPage } from './pages/student/NotesPage';
import { PdfViewerPage } from './pages/student/PdfViewerPage';
import { QuestionBanksPage } from './pages/student/QuestionBanksPage';
import { PreviousPapersPage } from './pages/student/PreviousPapersPage';
import { PlacementsPage } from './pages/student/PlacementsPage';
import { PlacementDetailsPage } from './pages/student/PlacementDetailsPage';
import { StudentChatPage } from './pages/student/StudentChatPage';
import { AskQuestionPage } from './pages/student/AskQuestionPage';
import { NotificationsPage } from './pages/student/NotificationsPage';
import { BookmarksPage } from './pages/student/BookmarksPage';
import { DownloadsPage } from './pages/student/DownloadsPage';
import { ProfilePage } from './pages/student/ProfilePage';
import { EditProfilePage } from './pages/student/EditProfilePage';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { UserManagementPage } from './pages/admin/UserManagementPage';
import { SemesterManagementPage } from './pages/admin/SemesterManagementPage';
import { SubjectManagementPage } from './pages/admin/SubjectManagementPage';
import { NotesManagementPage } from './pages/admin/NotesManagementPage';
import { NotesPdfUploadPage } from './pages/admin/NotesPdfUploadPage';
import { QuestionBankManagementPage } from './pages/admin/QuestionBankManagementPage';
import { PreviousPaperManagementPage } from './pages/admin/PreviousPaperManagementPage';
import { PlacementManagementPage } from './pages/admin/PlacementManagementPage';
import { AdvertisementManagementPage } from './pages/admin/AdvertisementManagementPage';
import { AnnouncementManagementPage } from './pages/admin/AnnouncementManagementPage';
import { ChatModerationPage } from './pages/admin/ChatModerationPage';
import { AuditLogsPage } from './pages/admin/AuditLogsPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

// Role Guard for Students
const StudentRoute = ({ children }) => {
  const token = authStorage.getToken();
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Role Guard for Admins
const AdminRoute = ({ children }) => {
  const token = authStorage.getToken();
  const role = authStorage.getRole();
  if (!token) {
    return <Navigate to="/login?role=admin" replace />;
  }
  if (role !== 'ADMIN') {
    return (
      <div style={{ minHeight: '100vh', background: '#0B1020', color: '#F8FAFC', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', textAlign: 'center' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: 'rgba(239, 68, 68, 0.2)', border: '1px solid rgba(239, 68, 68, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EF4444', fontSize: '28px', marginBottom: '16px', fontWeight: '900' }}>
          403
        </div>
        <h1 style={{ fontSize: '24px', fontWeight: '900', margin: '0 0 8px 0' }}>Access Forbidden</h1>
        <p style={{ color: '#94A3B8', maxWidth: '440px', fontSize: '14px', lineHeight: 1.6, margin: '0 0 24px 0' }}>
          Administrative privileges required. Your current session role (STUDENT) is not authorized to access this resource.
        </p>
        <a
          href="/dashboard"
          style={{
            background: 'linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)',
            color: '#FFFFFF',
            padding: '10px 20px',
            borderRadius: '10px',
            textDecoration: 'none',
            fontSize: '13px',
            fontWeight: '700'
          }}
        >
          Return to Student Dashboard
        </a>
      </div>
    );
  }
  return children;
};

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/verify-otp" element={<OtpPage />} />
            <Route path="/otp" element={<OtpPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />

            {/* Student Routes */}
            <Route path="/dashboard" element={<StudentRoute><StudentDashboard /></StudentRoute>} />
            <Route path="/semesters" element={<StudentRoute><SemestersPage /></StudentRoute>} />
            <Route path="/semesters/:id" element={<StudentRoute><SemesterDetailsPage /></StudentRoute>} />
            <Route path="/subjects/:id" element={<StudentRoute><SubjectDetailsPage /></StudentRoute>} />
            <Route path="/notes" element={<StudentRoute><NotesPage /></StudentRoute>} />
            <Route path="/notes/:id" element={<StudentRoute><PdfViewerPage /></StudentRoute>} />
            <Route path="/pdf/:id" element={<StudentRoute><PdfViewerPage /></StudentRoute>} />
            <Route path="/question-banks" element={<StudentRoute><QuestionBanksPage /></StudentRoute>} />
            <Route path="/previous-papers" element={<StudentRoute><PreviousPapersPage /></StudentRoute>} />
            <Route path="/placements" element={<StudentRoute><PlacementsPage /></StudentRoute>} />
            <Route path="/placements/:id" element={<StudentRoute><PlacementDetailsPage /></StudentRoute>} />
            <Route path="/chat" element={<StudentRoute><StudentChatPage /></StudentRoute>} />
            <Route path="/ask" element={<StudentRoute><AskQuestionPage /></StudentRoute>} />
            <Route path="/notifications" element={<StudentRoute><NotificationsPage /></StudentRoute>} />
            <Route path="/bookmarks" element={<StudentRoute><BookmarksPage /></StudentRoute>} />
            <Route path="/downloads" element={<StudentRoute><DownloadsPage /></StudentRoute>} />
            <Route path="/profile" element={<StudentRoute><ProfilePage /></StudentRoute>} />
            <Route path="/edit-profile" element={<StudentRoute><EditProfilePage /></StudentRoute>} />

            {/* Admin Routes */}
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/users" element={<AdminRoute><UserManagementPage /></AdminRoute>} />
            <Route path="/admin/semesters" element={<AdminRoute><SemesterManagementPage /></AdminRoute>} />
            <Route path="/admin/subjects" element={<AdminRoute><SubjectManagementPage /></AdminRoute>} />
            <Route path="/admin/notes" element={<AdminRoute><NotesManagementPage /></AdminRoute>} />
            <Route path="/admin/notes/upload" element={<AdminRoute><NotesPdfUploadPage /></AdminRoute>} />
            <Route path="/admin/question-banks" element={<AdminRoute><QuestionBankManagementPage /></AdminRoute>} />
            <Route path="/admin/previous-papers" element={<AdminRoute><PreviousPaperManagementPage /></AdminRoute>} />
            <Route path="/admin/placements" element={<AdminRoute><PlacementManagementPage /></AdminRoute>} />
            <Route path="/admin/advertisements" element={<AdminRoute><AdvertisementManagementPage /></AdminRoute>} />
            <Route path="/admin/announcements" element={<AdminRoute><AnnouncementManagementPage /></AdminRoute>} />
            <Route path="/admin/chat-moderation" element={<AdminRoute><ChatModerationPage /></AdminRoute>} />
            <Route path="/admin/audit-logs" element={<AdminRoute><AuditLogsPage /></AdminRoute>} />
            <Route path="/admin/settings" element={<AdminRoute><AdminSettingsPage /></AdminRoute>} />

            {/* Catch-all 404 Route */}
            <Route
              path="*"
              element={
                <div style={{ minHeight: '100vh', background: '#0B1020', color: '#F8FAFC', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', textAlign: 'center' }}>
                  <h1 style={{ fontSize: '36px', fontWeight: '900', color: '#38BDF8', margin: '0 0 12px 0' }}>404 Not Found</h1>
                  <p style={{ color: '#94A3B8', maxWidth: '440px', fontSize: '15px', lineHeight: 1.6, margin: '0 0 24px 0' }}>
                    The VTU portal page or academic resource you are looking for does not exist or has been moved.
                  </p>
                  <a
                    href="/dashboard"
                    style={{
                      background: 'linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)',
                      color: '#FFFFFF',
                      padding: '12px 24px',
                      borderRadius: '12px',
                      textDecoration: 'none',
                      fontSize: '14px',
                      fontWeight: '700'
                    }}
                  >
                    Return to Dashboard
                  </a>
                </div>
              }
            />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
