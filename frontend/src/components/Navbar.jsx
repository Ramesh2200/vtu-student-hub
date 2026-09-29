import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  GraduationCap,
  Bell,
  Search,
  User,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Compass,
  BookOpen,
  Calendar,
  Briefcase,
  Users,
  Shield,
  Layers,
  Sparkles
} from 'lucide-react';

export const Navbar = () => {
  const {
    currentUser,
    isAuthenticated,
    activeTab,
    setActiveTab,
    setShowAuthModal,
    setShowOnboardingModal,
    setShowNotificationsPanel,
    unreadNotificationsCount,
    logoutUser,
    switchRole,
    globalSearch,
    setGlobalSearch
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 transition-all duration-300" style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(11, 16, 32, 0.85)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
    }}>
      <div style={{
        maxWidth: '1440px',
        margin: '0 auto',
        padding: '0 24px',
        height: '72px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '20px'
      }}>
        {/* Left: Brand Logo & Tagline */}
        <div
          onClick={() => setActiveTab(isAuthenticated ? 'dashboard' : 'home')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer',
            userSelect: 'none'
          }}
        >
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #6C5CE7 0%, #4F8CFF 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(108, 92, 231, 0.5)'
          }}>
            <GraduationCap size={24} color="#FFFFFF" />
          </div>
          <div>
            <div style={{
              fontSize: '1.25rem',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <span>VTU</span>
              <span className="gradient-text">Student Connect</span>
            </div>
            <div style={{
              fontSize: '0.7rem',
              color: 'var(--text-muted)',
              fontWeight: 600,
              letterSpacing: '0.04em',
              textTransform: 'uppercase'
            }}>
              Learn • Connect • Grow
            </div>
          </div>
        </div>

        {/* Center: Main Navigation (Desktop) */}
        <nav style={{
          display: 'none',
          alignItems: 'center',
          gap: '8px'
        }} className="desktop-nav">
          <style>{`
            @media (min-width: 992px) {
              .desktop-nav { display: flex !important; }
              .mobile-toggle { display: none !important; }
            }
          `}</style>
          
          <button
            onClick={() => handleNavClick(isAuthenticated ? 'dashboard' : 'home')}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              color: activeTab === 'home' || activeTab === 'dashboard' ? '#FFFFFF' : 'var(--text-secondary)',
              fontWeight: 500,
              fontSize: '0.9rem',
              background: (activeTab === 'home' || activeTab === 'dashboard') ? 'rgba(108, 92, 231, 0.15)' : 'transparent',
              transition: 'all 0.2s ease'
            }}
          >
            {isAuthenticated ? 'Dashboard' : 'Home'}
          </button>

          <button
            onClick={() => handleNavClick('academics')}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              color: activeTab === 'academics' ? '#FFFFFF' : 'var(--text-secondary)',
              fontWeight: 500,
              fontSize: '0.9rem',
              background: activeTab === 'academics' ? 'rgba(108, 92, 231, 0.15)' : 'transparent',
              transition: 'all 0.2s ease'
            }}
          >
            Academics
          </button>

          <button
            onClick={() => handleNavClick('notes')}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              color: activeTab === 'notes' ? '#FFFFFF' : 'var(--text-secondary)',
              fontWeight: 500,
              fontSize: '0.9rem',
              background: activeTab === 'notes' ? 'rgba(108, 92, 231, 0.15)' : 'transparent',
              transition: 'all 0.2s ease'
            }}
          >
            Notes & Papers
          </button>

          <button
            onClick={() => handleNavClick('community')}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              color: activeTab === 'community' ? '#FFFFFF' : 'var(--text-secondary)',
              fontWeight: 500,
              fontSize: '0.9rem',
              background: activeTab === 'community' ? 'rgba(108, 92, 231, 0.15)' : 'transparent',
              transition: 'all 0.2s ease'
            }}
          >
            Community
          </button>

          <button
            onClick={() => handleNavClick('events')}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              color: activeTab === 'events' ? '#FFFFFF' : 'var(--text-secondary)',
              fontWeight: 500,
              fontSize: '0.9rem',
              background: activeTab === 'events' ? 'rgba(108, 92, 231, 0.15)' : 'transparent',
              transition: 'all 0.2s ease'
            }}
          >
            Events
          </button>

          <button
            onClick={() => handleNavClick('placements')}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              color: activeTab === 'placements' ? '#FFFFFF' : 'var(--text-secondary)',
              fontWeight: 500,
              fontSize: '0.9rem',
              background: activeTab === 'placements' ? 'rgba(108, 92, 231, 0.15)' : 'transparent',
              transition: 'all 0.2s ease'
            }}
          >
            Placements
          </button>
        </nav>

        {/* Right Actions: Persona Switcher, Notifications, Profile / Auth */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          
          {/* Persona Switcher Pill */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 12px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '20px',
                fontSize: '0.8rem',
                color: '#E2E8F0',
                transition: 'all 0.2s'
              }}
              title="Switch demo persona (Student / Faculty / Admin)"
            >
              <Sparkles size={14} color="#6C5CE7" />
              <span style={{ textTransform: 'capitalize', fontWeight: 600 }}>
                Role: {currentUser.role}
              </span>
              <ChevronDown size={14} />
            </button>

            {roleDropdownOpen && (
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                width: '210px',
                background: '#111827',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '12px',
                padding: '8px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                zIndex: 110
              }}>
                <div style={{ fontSize: '0.7rem', color: '#64748B', padding: '6px 8px', fontWeight: 700 }}>
                  SWITCH PERSONA
                </div>
                <button
                  onClick={() => { switchRole('student'); setRoleDropdownOpen(false); }}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: currentUser.role === 'student' ? 'rgba(108, 92, 231, 0.2)' : 'transparent',
                    color: currentUser.role === 'student' ? '#A78BFA' : '#CBD5E1',
                    fontSize: '0.85rem'
                  }}
                >
                  <User size={15} /> Student (Aarav)
                </button>
                <button
                  onClick={() => { switchRole('faculty'); setRoleDropdownOpen(false); }}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: currentUser.role === 'faculty' ? 'rgba(79, 140, 255, 0.2)' : 'transparent',
                    color: currentUser.role === 'faculty' ? '#93C5FD' : '#CBD5E1',
                    fontSize: '0.85rem'
                  }}
                >
                  <Layers size={15} /> Faculty (Dr. Sudha)
                </button>
                <button
                  onClick={() => { switchRole('admin'); setRoleDropdownOpen(false); }}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: currentUser.role === 'admin' ? 'rgba(34, 211, 238, 0.2)' : 'transparent',
                    color: currentUser.role === 'admin' ? '#67E8F9' : '#CBD5E1',
                    fontSize: '0.85rem'
                  }}
                >
                  <Shield size={15} /> Administrator (VTU)
                </button>
              </div>
            )}
          </div>

          {/* Notifications Button */}
          {isAuthenticated && (
            <button
              onClick={() => setShowNotificationsPanel(true)}
              style={{
                position: 'relative',
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#E2E8F0',
                transition: 'all 0.2s'
              }}
              title="Notifications"
            >
              <Bell size={18} />
              {unreadNotificationsCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-3px',
                  right: '-3px',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  background: '#EF4444',
                  color: '#FFFFFF',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 8px rgba(239, 68, 68, 0.8)'
                }}>
                  {unreadNotificationsCount}
                </span>
              )}
            </button>
          )}

          {/* User Profile or Login CTA */}
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                onClick={() => setActiveTab('profile')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '4px 10px 4px 4px',
                  borderRadius: '24px',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    objectFit: 'cover'
                  }}
                />
                <div style={{ textAlign: 'left', display: 'none' }} className="user-text">
                  <style>{`
                    @media (min-width: 768px) {
                      .user-text { display: block !important; }
                    }
                  `}</style>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#F8FAFC', lineHeight: 1.2 }}>
                    {currentUser.name}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>
                    {currentUser.usn}
                  </div>
                </div>
              </button>

              <button
                onClick={logoutUser}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: 'rgba(239, 68, 68, 0.1)',
                  color: '#F87171',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                title="Sign Out"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                onClick={() => setShowAuthModal(true)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '10px',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  color: '#F8FAFC',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  transition: 'all 0.2s'
                }}
              >
                Log In
              </button>
              <button
                onClick={() => setShowAuthModal(true)}
                style={{
                  padding: '8px 18px',
                  borderRadius: '10px',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  color: '#FFFFFF',
                  background: 'linear-gradient(135deg, #6C5CE7 0%, #4F8CFF 100%)',
                  boxShadow: '0 4px 15px rgba(108, 92, 231, 0.4)',
                  transition: 'all 0.2s'
                }}
              >
                Get Started
              </button>
            </div>
          )}

          {/* Mobile hamburger toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-toggle"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.06)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#F8FAFC'
            }}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div style={{
          background: '#0B1020',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '20px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <button
            onClick={() => handleNavClick(isAuthenticated ? 'dashboard' : 'home')}
            style={{ textAlign: 'left', padding: '10px 0', color: '#F8FAFC', fontWeight: 600 }}
          >
            {isAuthenticated ? 'Dashboard' : 'Home'}
          </button>
          <button
            onClick={() => handleNavClick('academics')}
            style={{ textAlign: 'left', padding: '10px 0', color: '#94A3B8' }}
          >
            Academics Hub
          </button>
          <button
            onClick={() => handleNavClick('notes')}
            style={{ textAlign: 'left', padding: '10px 0', color: '#94A3B8' }}
          >
            Notes & Question Papers
          </button>
          <button
            onClick={() => handleNavClick('community')}
            style={{ textAlign: 'left', padding: '10px 0', color: '#94A3B8' }}
          >
            Student Discussions
          </button>
          <button
            onClick={() => handleNavClick('events')}
            style={{ textAlign: 'left', padding: '10px 0', color: '#94A3B8' }}
          >
            Hackathons & Events
          </button>
          <button
            onClick={() => handleNavClick('placements')}
            style={{ textAlign: 'left', padding: '10px 0', color: '#94A3B8' }}
          >
            Placements & Internships
          </button>
        </div>
      )}
    </header>
  );
};
