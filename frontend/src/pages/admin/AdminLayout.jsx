import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Shield,
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  FileText,
  UploadCloud,
  HelpCircle,
  FileArchive,
  Briefcase,
  Megaphone,
  BellRing,
  AlertTriangle,
  History,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Sparkles
} from 'lucide-react';
import { api, authStorage } from '../../services/api';
import adminBg from '../../assets/backgrounds/admin-bg.jpg';

export const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const user = authStorage.getUser();

  const handleLogout = () => {
    api.auth.logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Admin Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={18} /> },
    { label: 'User Management', path: '/admin/users', icon: <Users size={18} /> },
    { label: 'Semesters', path: '/admin/semesters', icon: <GraduationCap size={18} /> },
    { label: 'Subjects', path: '/admin/subjects', icon: <BookOpen size={18} /> },
    { label: 'Notes Catalog', path: '/admin/notes', icon: <FileText size={18} /> },
    { label: 'Upload Notes PDF', path: '/admin/notes/upload', icon: <UploadCloud size={18} /> },
    { label: 'Question Banks', path: '/admin/question-banks', icon: <HelpCircle size={18} /> },
    { label: 'Previous Papers', path: '/admin/previous-papers', icon: <FileArchive size={18} /> },
    { label: 'Placements', path: '/admin/placements', icon: <Briefcase size={18} /> },
    { label: 'Advertisements', path: '/admin/advertisements', icon: <Megaphone size={18} /> },
    { label: 'Announcements', path: '/admin/announcements', icon: <BellRing size={18} /> },
    { label: 'Chat Moderation', path: '/admin/chat-moderation', icon: <AlertTriangle size={18} /> },
    { label: 'Audit Logs', path: '/admin/audit-logs', icon: <History size={18} /> },
    { label: 'System Settings', path: '/admin/settings', icon: <Settings size={18} /> }
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundImage: `linear-gradient(rgba(5, 10, 24, 0.85), rgba(5, 10, 24, 0.95)), url(${adminBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        color: '#F8FAFC',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      
      {/* Top Admin Header */}
      <header
        style={{
          height: '66px',
          background: 'rgba(9, 13, 26, 0.95)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(239, 68, 68, 0.25)',
          position: 'sticky',
          top: 0,
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden"
            style={{ background: 'transparent', border: 'none', color: '#FFFFFF', cursor: 'pointer' }}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <Link to="/admin/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF'
              }}
            >
              <Shield size={20} />
            </div>
            <div>
              <span style={{ fontSize: '15px', fontWeight: '800', color: '#F8FAFC' }}>
                VTU Connect Admin
              </span>
              <span style={{ fontSize: '10px', display: 'block', color: '#EF4444', fontWeight: '800', textTransform: 'uppercase' }}>
                Administrative Control Console
              </span>
            </div>
          </Link>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <Link
            to="/dashboard"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#CBD5E1',
              padding: '6px 14px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: '700',
              textDecoration: 'none'
            }}
          >
            <ExternalLink size={14} /> Student View
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                background: '#DC2626',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                fontWeight: '800',
                fontSize: '13px'
              }}
            >
              AD
            </div>
            <div className="hidden sm:block">
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#F8FAFC' }}>
                {user?.fullName || 'Super Administrator'}
              </div>
              <div style={{ fontSize: '10px', color: '#EF4444', fontWeight: '800' }}>
                SECURITY ROLE: ADMIN
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94A3B8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: '6px'
            }}
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {/* Body Layout: Left Admin Sidebar + Main Content */}
      <div style={{ display: 'flex', flex: 1, minHeight: 'calc(100vh - 66px)' }}>
        
        {/* Admin Navigation Sidebar */}
        <aside
          style={{
            width: '260px',
            background: 'rgba(11, 16, 32, 0.95)',
            borderRight: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '20px 14px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'sticky',
            top: '66px',
            height: 'calc(100vh - 66px)',
            overflowY: 'auto',
            flexShrink: 0
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ padding: '0 12px 10px', fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', color: '#64748B', letterSpacing: '0.05em' }}>
              Management System
            </div>

            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    background: isActive ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.25) 0%, rgba(185, 28, 28, 0.15) 100%)' : 'transparent',
                    border: isActive ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid transparent',
                    color: isActive ? '#FFFFFF' : '#94A3B8',
                    fontSize: '13px',
                    fontWeight: isActive ? '700' : '600',
                    textDecoration: 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span style={{ color: isActive ? '#EF4444' : '#64748B' }}>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div style={{ paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '12px' }}>
              <div style={{ fontSize: '11px', fontWeight: '800', color: '#F87171', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Shield size={12} /> Jakarta Servlet Auth
              </div>
              <p style={{ fontSize: '10px', color: '#94A3B8', margin: '4px 0 0 0', lineHeight: 1.4 }}>
                Backend AdminFilter enforced (HTTP 403 Forbidden for students).
              </p>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <main style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
          {children}
        </main>
      </div>

    </div>
  );
};
