import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  GraduationCap,
  FileText,
  HelpCircle,
  BookOpen,
  Briefcase,
  MessageSquare,
  Bell,
  Bookmark,
  Download,
  User,
  Info,
  LogOut,
  Menu,
  X,
  Search,
  ChevronRight,
  Sparkles,
  Shield
} from 'lucide-react';
import { api, authStorage } from '../services/api';
import { AdvertisementCard } from './AdvertisementCard';
import dashboardBg from '../assets/backgrounds/dashboard-bg.jpg';
import semestersBg from '../assets/backgrounds/semesters-bg.jpg';
import placementsBg from '../assets/backgrounds/placements-bg.jpg';
import chatBg from '../assets/backgrounds/chat-bg.jpg';

export const StudentLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [ads, setAds] = useState([]);
  const [unreadNotifs, setUnreadNotifs] = useState(2);
  const [user, setUser] = useState(() => authStorage.getUser());

  useEffect(() => {
    // Refresh user from storage
    setUser(authStorage.getUser());

    // Fetch active ads
    api.ads.getActive()
      .then((data) => {
        if (data && data.length > 0) setAds(data);
      })
      .catch(() => {});

    // Fetch notifications count
    api.notifications.getAll()
      .then((notifs) => {
        if (Array.isArray(notifs)) {
          setUnreadNotifs(notifs.filter((n) => !n.read).length);
        }
      })
      .catch(() => {});
  }, [location.pathname]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/notes?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = () => {
    api.auth.logout();
    navigate('/');
  };

  const menuItems = [
    { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={18} /> },
    { label: 'Semesters', path: '/semesters', icon: <GraduationCap size={18} /> },
    { label: 'Notes', path: '/notes', icon: <FileText size={18} /> },
    { label: 'Question Banks', path: '/question-banks', icon: <HelpCircle size={18} /> },
    { label: 'Previous Papers', path: '/previous-papers', icon: <BookOpen size={18} /> },
    { label: 'Placements', path: '/placements', icon: <Briefcase size={18} /> },
    { label: 'Student Chat', path: '/chat', icon: <MessageSquare size={18} /> },
    { label: 'Notifications', path: '/notifications', icon: <Bell size={18} />, badge: unreadNotifs },
    { label: 'Bookmarks', path: '/bookmarks', icon: <Bookmark size={18} /> },
    { label: 'Downloads', path: '/downloads', icon: <Download size={18} /> },
    { label: 'My Profile', path: '/profile', icon: <User size={18} /> },
    { label: 'Help', path: '/help', icon: <HelpCircle size={18} /> },
    { label: 'About', path: '/about', icon: <Info size={18} /> }
  ];

  const profile = user?.profile || {
    fullName: 'Aarav Sharma',
    usn: '1MS21CS042',
    branch: 'CSE',
    semester: 6,
    college: 'MSRIT'
  };

  const getBackgroundImage = () => {
    const path = location.pathname;
    if (path.startsWith('/placements')) return placementsBg;
    if (path.startsWith('/chat')) return chatBg;
    if (
      path.startsWith('/semesters') ||
      path.startsWith('/notes') ||
      path.startsWith('/question-banks') ||
      path.startsWith('/previous-papers') ||
      path.startsWith('/subjects') ||
      path.startsWith('/pdf')
    ) {
      return semestersBg;
    }
    return dashboardBg;
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundImage: `linear-gradient(rgba(7, 11, 24, 0.80), rgba(7, 11, 24, 0.92)), url(${getBackgroundImage()})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        color: '#F8FAFC',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Top Navigation Bar */}
      <header
        style={{
          height: '70px',
          background: 'rgba(11, 16, 32, 0.95)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          position: 'sticky',
          top: 0,
          zIndex: 40,
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
            style={{
              background: 'transparent',
              border: 'none',
              color: '#F8FAFC',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF'
              }}
            >
              <GraduationCap size={20} />
            </div>
            <div>
              <span style={{ fontSize: '16px', fontWeight: '800', color: '#F8FAFC', letterSpacing: '-0.01em' }}>
                Student Connect
              </span>
              <span style={{ fontSize: '10px', display: 'block', color: '#38BDF8', fontWeight: '700', textTransform: 'uppercase' }}>
                VTU Academic Hub
              </span>
            </div>
          </Link>
        </div>

        {/* Global Search Bar */}
        <form
          onSubmit={handleSearch}
          className="hidden sm:flex"
          style={{
            flex: 1,
            maxWidth: '440px',
            margin: '0 24px',
            position: 'relative'
          }}
        >
          <Search size={16} style={{ position: 'absolute', left: '14px', top: '12px', color: '#64748B' }} />
          <input
            type="text"
            placeholder="Search notes, question banks, previous papers (e.g. Cloud, BCS601)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px 10px 40px',
              borderRadius: '9999px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#F8FAFC',
              fontSize: '13px',
              outline: 'none'
            }}
          />
        </form>

        {/* Profile Pill & Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <Link
            to="/notifications"
            style={{
              position: 'relative',
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.05)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#CBD5E1',
              textDecoration: 'none'
            }}
          >
            <Bell size={18} />
            {unreadNotifs > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '6px',
                  right: '6px',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#EF4444'
                }}
              />
            )}
          </Link>

          <Link
            to="/profile"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '4px 12px 4px 6px',
              borderRadius: '9999px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              textDecoration: 'none'
            }}
          >
            <div
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #7C3AED, #2563EB)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '700',
                fontSize: '12px',
                color: '#FFF'
              }}
            >
              {profile.fullName?.charAt(0) || 'S'}
            </div>
            <div className="hidden md:block" style={{ textAlign: 'left', lineHeight: '1.2' }}>
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#F8FAFC' }}>
                {profile.fullName || 'Student'}
              </div>
              <div style={{ fontSize: '10px', color: '#94A3B8' }}>
                {profile.usn || 'VTU Student'} • Sem {profile.semester || 6}
              </div>
            </div>
          </Link>

          <button
            onClick={handleLogout}
            title="Logout"
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94A3B8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: '6px'
            }}
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div style={{ display: 'flex', flex: 1, minHeight: 'calc(100vh - 70px)' }}>
        {/* Left Vertical Navigation Sidebar */}
        <aside
          style={{
            width: '240px',
            background: 'rgba(15, 23, 42, 0.7)',
            borderRight: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '20px 14px',
            flexShrink: 0
          }}
          className={`${mobileMenuOpen ? 'block' : 'hidden'} md:flex`}
        >
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ fontSize: '11px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0 12px 8px' }}>
              Academic Portal
            </div>
            {menuItems.map((item, idx) => {
              const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
              return (
                <Link
                  key={idx}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    color: isActive ? '#FFFFFF' : '#94A3B8',
                    background: isActive ? 'linear-gradient(135deg, rgba(124, 58, 237, 0.3) 0%, rgba(6, 182, 212, 0.15) 100%)' : 'transparent',
                    border: isActive ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid transparent',
                    textDecoration: 'none',
                    fontSize: '13px',
                    fontWeight: isActive ? '700' : '500',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ color: isActive ? '#A78BFA' : '#64748B' }}>{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge > 0 && (
                    <span
                      style={{
                        padding: '2px 6px',
                        borderRadius: '9999px',
                        background: '#EF4444',
                        color: '#FFF',
                        fontSize: '10px',
                        fontWeight: '700'
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Quick VTU Scheme Pill at bottom */}
          <div
            style={{
              padding: '12px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              marginTop: '20px'
            }}
          >
            <div style={{ fontSize: '11px', color: '#A78BFA', fontWeight: '700' }}>VTU 2022 Scheme CBCS</div>
            <div style={{ fontSize: '10px', color: '#94A3B8', marginTop: '2px' }}>Outcome Based Education</div>
          </div>
        </aside>

        {/* Center Content Workspace */}
        <main style={{ flex: 1, padding: '28px 24px', overflowY: 'auto', minWidth: 0 }}>
          {children}
        </main>

        {/* Right Rail: Controlled Advertisements */}
        <aside
          className="hidden xl:block"
          style={{
            width: '280px',
            borderLeft: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'rgba(11, 16, 32, 0.5)',
            padding: '24px 18px',
            flexShrink: 0
          }}
        >
          <div style={{ fontSize: '12px', fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' }}>
            Campus Opportunities
          </div>

          {ads.length > 0 ? (
            ads.slice(0, 3).map((ad) => (
              <AdvertisementCard key={ad.id} ad={ad} />
            ))
          ) : (
            <div
              style={{
                padding: '20px',
                borderRadius: '16px',
                background: 'rgba(124, 58, 237, 0.1)',
                border: '1px dashed rgba(139, 92, 246, 0.3)',
                textAlign: 'center'
              }}
            >
              <Sparkles size={24} style={{ color: '#A78BFA', margin: '0 auto 8px' }} />
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#F8FAFC' }}>
                VTU InnoTech 2026
              </div>
              <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '4px' }}>
                Annual engineering hackathon. Cash prizes ₹2,50,000.
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};
