import React, { useState, useEffect } from 'react';
import { Bell, Check, Sparkles, Clock, AlertCircle, Info, CheckCheck } from 'lucide-react';
import { api } from '../../services/api';
import { StudentLayout } from '../../components/StudentLayout';

export const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [notifsRes, annRes] = await Promise.allSettled([
        api.notifications.getAll(),
        api.announcements.getAll()
      ]);

      if (notifsRes.status === 'fulfilled' && Array.isArray(notifsRes.value)) {
        setNotifications(notifsRes.value);
      }
      if (annRes.status === 'fulfilled' && Array.isArray(annRes.value)) {
        setAnnouncements(annRes.value);
      }
    } catch (err) {
      console.error('Failed to load notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const markAllRead = async () => {
    try {
      for (const n of notifications) {
        if (!n.read) await api.notifications.markRead(n.id);
      }
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <StudentLayout>
      <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: '900', color: '#F8FAFC', margin: 0 }}>
              Notifications & University Alerts
            </h1>
            <p style={{ fontSize: '13px', color: '#94A3B8', margin: '4px 0 0' }}>
              Stay informed on VTU timetable releases, notes uploads, and placement updates.
            </p>
          </div>

          <button
            onClick={markAllRead}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#F8FAFC',
              padding: '8px 16px',
              borderRadius: '10px',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            <CheckCheck size={16} /> Mark All as Read
          </button>
        </div>

        {/* Official Announcements */}
        {announcements.length > 0 && (
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#38BDF8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '12px' }}>
              University Circulars & Announcements
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {announcements.map((ann) => (
                <div
                  key={ann.id}
                  style={{
                    background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.1) 0%, rgba(15, 23, 42, 0.7) 100%)',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    borderRadius: '16px',
                    padding: '20px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '11px', fontWeight: '800', background: '#0284C7', color: '#FFFFFF', padding: '2px 8px', borderRadius: '4px' }}>
                      Circular
                    </span>
                    <span style={{ fontSize: '11px', color: '#64748B' }}>
                      {new Date(ann.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 style={{ fontSize: '16px', fontWeight: '800', color: '#F8FAFC', margin: '0 0 6px 0' }}>
                    {ann.title}
                  </h4>
                  <p style={{ fontSize: '13px', color: '#94A3B8', margin: 0, lineHeight: 1.6 }}>
                    {ann.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notifications Feed */}
        <div>
          <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#C4B5FD', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '12px' }}>
            System Notifications
          </h3>

          {loading ? (
            <div style={{ padding: '60px', textAlign: 'center', color: '#94A3B8' }}>Loading notifications...</div>
          ) : notifications.length === 0 ? (
            <div style={{ padding: '60px', textAlign: 'center', background: 'rgba(15, 23, 42, 0.5)', borderRadius: '20px', color: '#94A3B8' }}>
              <Bell size={40} color="#475569" style={{ marginBottom: '12px' }} />
              <p style={{ margin: 0, fontSize: '13px' }}>You're all caught up! No unread notifications.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {notifications.map((n) => (
                <div
                  key={n.id}
                  style={{
                    background: n.read ? 'rgba(15, 23, 42, 0.4)' : 'rgba(30, 41, 59, 0.6)',
                    border: n.read ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid rgba(124, 58, 237, 0.3)',
                    borderRadius: '14px',
                    padding: '16px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        background: n.read ? 'rgba(255, 255, 255, 0.05)' : 'rgba(124, 58, 237, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: n.read ? '#64748B' : '#A78BFA'
                      }}
                    >
                      <Bell size={18} />
                    </div>

                    <div>
                      <h4 style={{ fontSize: '14px', fontWeight: n.read ? '600' : '800', color: '#F8FAFC', margin: '0 0 2px 0' }}>
                        {n.title}
                      </h4>
                      <p style={{ fontSize: '12px', color: '#94A3B8', margin: 0 }}>
                        {n.message}
                      </p>
                    </div>
                  </div>

                  <span style={{ fontSize: '11px', color: '#64748B', whiteSpace: 'nowrap' }}>
                    {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </StudentLayout>
  );
};
