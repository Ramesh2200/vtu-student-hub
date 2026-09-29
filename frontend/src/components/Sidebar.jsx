import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  FileCheck2,
  MessagesSquare,
  Users,
  MessageCircle,
  Calendar,
  Briefcase,
  User,
  Shield,
  Layers,
  ChevronLeft,
  ChevronRight,
  LogOut,
  GraduationCap
} from 'lucide-react';

export const Sidebar = () => {
  const { currentUser, activeTab, setActiveTab, logoutUser } = useApp();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, role: 'all' },
    { id: 'academics', label: 'Academics Hub', icon: BookOpen, role: 'all' },
    { id: 'notes', label: 'Notes Library', icon: FileText, role: 'all' },
    { id: 'papers', label: 'Question Papers', icon: FileCheck2, role: 'all' },
    { id: 'community', label: 'Student Q&A', icon: MessagesSquare, role: 'all' },
    { id: 'groups', label: 'Study Groups', icon: Users, role: 'all' },
    { id: 'chat', label: 'Live Chat', icon: MessageCircle, role: 'all', badge: 'Live' },
    { id: 'events', label: 'Events & Fests', icon: Calendar, role: 'all' },
    { id: 'placements', label: 'Placements Kanban', icon: Briefcase, role: 'all' },
    { id: 'profile', label: 'My Profile', icon: User, role: 'all' },
    { id: 'faculty', label: 'Faculty Portal', icon: Layers, role: 'faculty' },
    { id: 'admin', label: 'Admin Portal', icon: Shield, role: 'admin' }
  ];

  const visibleItems = navItems.filter(item => {
    if (item.role === 'all') return true;
    if (item.role === 'faculty' && (currentUser.role === 'faculty' || currentUser.role === 'admin')) return true;
    if (item.role === 'admin' && currentUser.role === 'admin') return true;
    return false;
  });

  return (
    <>
      {/* Desktop Collapsible Sidebar */}
      <aside
        style={{
          width: collapsed ? '80px' : '260px',
          height: 'calc(100vh - 72px)',
          position: 'sticky',
          top: '72px',
          background: 'rgba(11, 16, 32, 0.95)',
          borderRight: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: collapsed ? '20px 10px' : '20px 16px',
          transition: 'width 0.25s ease',
          zIndex: 40,
          flexShrink: 0
        }}
        className="desktop-sidebar"
      >
        <style>{`
          @media (max-width: 991px) {
            .desktop-sidebar { display: none !important; }
            .mobile-bottom-nav { display: flex !important; }
          }
          @media (min-width: 992px) {
            .mobile-bottom-nav { display: none !important; }
          }
        `}</style>

        {/* Navigation list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          
          {/* Collapse Toggle Button */}
          <div style={{
            display: 'flex',
            justifyContent: collapsed ? 'center' : 'space-between',
            alignItems: 'center',
            marginBottom: '12px',
            padding: '0 8px'
          }}>
            {!collapsed && (
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                WORKSPACE
              </span>
            )}
            <button
              onClick={() => setCollapsed(!collapsed)}
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.05)',
                color: '#94A3B8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
          </div>

          {visibleItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: collapsed ? '12px 0' : '10px 14px',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  borderRadius: '12px',
                  background: isActive ? 'linear-gradient(135deg, rgba(108, 92, 231, 0.25) 0%, rgba(79, 140, 255, 0.15) 100%)' : 'transparent',
                  border: isActive ? '1px solid rgba(108, 92, 231, 0.4)' : '1px solid transparent',
                  color: isActive ? '#FFFFFF' : '#94A3B8',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.9rem',
                  position: 'relative',
                  transition: 'all 0.15s ease'
                }}
                title={collapsed ? item.label : undefined}
              >
                <Icon size={19} color={isActive ? '#A78BFA' : '#94A3B8'} />
                
                {!collapsed && (
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.label}
                  </span>
                )}

                {!collapsed && item.badge && (
                  <span style={{
                    marginLeft: 'auto',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    padding: '2px 6px',
                    borderRadius: '6px',
                    background: '#10B981',
                    color: '#0B1020'
                  }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* User Card at Bottom */}
        <div style={{
          paddingTop: '16px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          {!collapsed ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '8px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.04)'
            }}>
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                style={{ width: '36px', height: '36px', borderRadius: '10px', objectFit: 'cover' }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#F8FAFC', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {currentUser.name}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#67E8F9' }}>
                  {currentUser.usn}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                style={{ width: '32px', height: '32px', borderRadius: '8px', objectFit: 'cover' }}
              />
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <nav
        className="mobile-bottom-nav"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: '64px',
          background: 'rgba(11, 16, 32, 0.95)',
          backdropFilter: 'blur(16px)',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'none',
          alignItems: 'center',
          justifyContent: 'space-around',
          zIndex: 90
        }}
      >
        {[
          { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
          { id: 'academics', label: 'Academics', icon: BookOpen },
          { id: 'notes', label: 'Notes', icon: FileText },
          { id: 'community', label: 'Q&A', icon: MessagesSquare },
          { id: 'placements', label: 'Careers', icon: Briefcase },
          { id: 'profile', label: 'Profile', icon: User }
        ].map((mItem) => {
          const MIcon = mItem.icon;
          const isAct = activeTab === mItem.id;
          return (
            <button
              key={mItem.id}
              onClick={() => setActiveTab(mItem.id)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                color: isAct ? '#A78BFA' : '#94A3B8',
                fontSize: '0.7rem',
                fontWeight: isAct ? 700 : 500
              }}
            >
              <MIcon size={18} color={isAct ? '#A78BFA' : '#94A3B8'} />
              <span>{mItem.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
