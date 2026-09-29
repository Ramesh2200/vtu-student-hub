import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Bell,
  Check,
  CheckCheck,
  BookOpen,
  Briefcase,
  Calendar,
  MessageSquare,
  ShieldAlert,
  Trash2,
  ExternalLink
} from 'lucide-react';

export const NotificationsPanel = () => {
  const {
    showNotificationsPanel,
    setShowNotificationsPanel,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    setActiveTab
  } = useApp();

  const [activeFilter, setActiveFilter] = useState('All');

  if (!showNotificationsPanel) return null;

  const categories = ['All', 'Academic', 'Placement', 'Event', 'Community'];

  const filteredNotifications = notifications.filter(n => {
    if (activeFilter !== 'All' && n.category !== activeFilter) return false;
    return true;
  });

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Academic':
        return <BookOpen size={16} color="#6C5CE7" />;
      case 'Placement':
        return <Briefcase size={16} color="#10B981" />;
      case 'Event':
        return <Calendar size={16} color="#22D3EE" />;
      case 'Community':
        return <MessageSquare size={16} color="#F59E0B" />;
      default:
        return <Bell size={16} color="#4F8CFF" />;
    }
  };

  const handleAction = (item) => {
    markNotificationRead(item.id);
    setShowNotificationsPanel(false);
    if (item.actionUrl) {
      const tab = item.actionUrl.replace('#', '');
      setActiveTab(tab);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(5, 8, 18, 0.7)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      justifyContent: 'flex-end',
      zIndex: 1300
    }}>
      {/* Background click to close */}
      <div
        style={{ flex: 1 }}
        onClick={() => setShowNotificationsPanel(false)}
      />

      {/* Slide-over Drawer */}
      <div style={{
        width: '100%',
        maxWidth: '460px',
        height: '100%',
        background: '#0F172A',
        borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '-10px 0 40px rgba(0, 0, 0, 0.8)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 2
      }}>
        {/* Panel Header */}
        <div style={{
          padding: '24px 20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(17, 24, 39, 0.7)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Bell size={20} color="#6C5CE7" />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#F8FAFC' }}>
                Notifications
              </h3>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                onClick={markAllNotificationsRead}
                style={{
                  fontSize: '0.78rem',
                  color: '#A78BFA',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
                title="Mark all notifications as read"
              >
                <CheckCheck size={15} />
                <span>Mark All Read</span>
              </button>

              <button
                onClick={() => setShowNotificationsPanel(false)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.06)',
                  color: '#CBD5E1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Filter Pills */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '16px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  background: activeFilter === cat ? 'linear-gradient(135deg, #6C5CE7 0%, #4F8CFF 100%)' : 'rgba(255, 255, 255, 0.05)',
                  color: activeFilter === cat ? '#FFFFFF' : '#94A3B8',
                  border: activeFilter === cat ? 'none' : '1px solid rgba(255, 255, 255, 0.08)'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
          {filteredNotifications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748B' }}>
              <Bell size={36} style={{ opacity: 0.3, margin: '0 auto 12px' }} />
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#94A3B8' }}>No notifications found</div>
              <div style={{ fontSize: '0.8rem', marginTop: '4px' }}>You are fully up to date with VTU circulars</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {filteredNotifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleAction(notif)}
                  style={{
                    padding: '16px',
                    borderRadius: '14px',
                    background: notif.isRead ? 'rgba(255, 255, 255, 0.03)' : 'rgba(108, 92, 231, 0.1)',
                    border: notif.isRead ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid rgba(108, 92, 231, 0.3)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    position: 'relative'
                  }}
                >
                  {/* Category icon and header */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '8px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {getCategoryIcon(notif.category)}
                      </div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#CBD5E1' }}>
                        {notif.category}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '0.72rem', color: '#64748B' }}>
                        {notif.timestamp}
                      </span>
                      {!notif.isRead && (
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#EF4444' }} />
                      )}
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#F8FAFC', marginBottom: '4px' }}>
                    {notif.title}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#94A3B8', lineHeight: 1.5 }}>
                    {notif.description}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
