import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  FileText,
  HelpCircle,
  BookOpen,
  Briefcase,
  Download,
  MessageSquare,
  Megaphone,
  Shield,
  TrendingUp,
  Clock,
  ArrowRight,
  UploadCloud,
  PlusCircle,
  Activity,
  History
} from 'lucide-react';
import { api } from '../../services/api';
import { AdminLayout } from './AdminLayout';

export const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 1420,
    totalNotes: 38,
    totalQuestionBanks: 44,
    totalPreviousPapers: 28,
    totalPlacements: 12,
    totalDownloads: 3480,
    totalMessages: 610,
    activeAds: 4
  });
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardTelemetry();
  }, []);

  const loadDashboardTelemetry = async () => {
    try {
      setLoading(true);
      const [statsRes, logsRes] = await Promise.allSettled([
        api.admin.getStats(),
        api.admin.getAuditLogs()
      ]);

      if (statsRes.status === 'fulfilled' && statsRes.value) {
        setStats((prev) => ({ ...prev, ...statsRes.value }));
      }
      if (logsRes.status === 'fulfilled' && Array.isArray(logsRes.value)) {
        setAuditLogs(logsRes.value.slice(0, 6));
      }
    } catch (err) {
      console.error('Failed to load admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: 'Registered Students', val: stats.totalStudents, icon: <Users size={22} />, color: '#38BDF8', path: '/admin/users' },
    { label: 'Official Notes', val: stats.totalNotes, icon: <FileText size={22} />, color: '#A78BFA', path: '/admin/notes' },
    { label: 'Question Banks', val: stats.totalQuestionBanks, icon: <HelpCircle size={22} />, color: '#22D3EE', path: '/admin/question-banks' },
    { label: 'Previous Papers', val: stats.totalPreviousPapers, icon: <BookOpen size={22} />, color: '#FBBF24', path: '/admin/previous-papers' },
    { label: 'Placement Drives', val: stats.totalPlacements, icon: <Briefcase size={22} />, color: '#34D399', path: '/admin/placements' },
    { label: 'Total Downloads', val: stats.totalDownloads, icon: <Download size={22} />, color: '#F472B6', path: '/admin/notes' },
    { label: 'Chat Messages', val: stats.totalMessages, icon: <MessageSquare size={22} />, color: '#60A5FA', path: '/admin/chat-moderation' },
    { label: 'Active Advertisements', val: stats.activeAds, icon: <Megaphone size={22} />, color: '#F87171', path: '/admin/advertisements' }
  ];

  return (
    <AdminLayout>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
        
        {/* Welcome Banner */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(124, 58, 237, 0.1) 100%)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '24px',
            padding: '32px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '20px'
          }}
        >
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 10px', borderRadius: '999px', background: 'rgba(239, 68, 68, 0.2)', border: '1px solid rgba(239, 68, 68, 0.4)', marginBottom: '8px' }}>
              <Shield size={13} color="#F87171" />
              <span style={{ fontSize: '11px', fontWeight: '800', color: '#FCA5A5', textTransform: 'uppercase' }}>
                VTU Administrator Portal
              </span>
            </div>
            <h1 style={{ fontSize: '28px', fontWeight: '900', color: '#FFFFFF', margin: '0 0 6px 0' }}>
              Academic Operations & Resources Console
            </h1>
            <p style={{ color: '#94A3B8', fontSize: '14px', maxWidth: '650px', margin: 0 }}>
              Review student enrollments, upload official PDF curriculum notes, manage placement listings, and review audit logs.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <Link
              to="/admin/notes/upload"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                color: '#FFFFFF',
                padding: '12px 20px',
                borderRadius: '12px',
                fontSize: '13px',
                fontWeight: '700',
                textDecoration: 'none',
                boxShadow: '0 4px 14px rgba(239, 68, 68, 0.35)'
              }}
            >
              <UploadCloud size={18} /> Upload Notes PDF
            </Link>

            <Link
              to="/admin/placements"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#F8FAFC',
                padding: '12px 20px',
                borderRadius: '12px',
                fontSize: '13px',
                fontWeight: '700',
                textDecoration: 'none'
              }}
            >
              <PlusCircle size={18} /> Add Placement Drive
            </Link>
          </div>
        </div>

        {/* 8 TELEMETRY METRICS CARDS */}
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#F8FAFC', marginBottom: '16px' }}>
            Platform Statistics & Telemetry
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: '16px'
            }}
          >
            {statCards.map((card, idx) => (
              <Link
                key={idx}
                to={card.path}
                style={{
                  background: 'rgba(15, 23, 42, 0.65)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '18px',
                  padding: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '14px',
                    background: `${card.color}15`,
                    border: `1px solid ${card.color}35`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: card.color,
                    flexShrink: 0
                  }}
                >
                  {card.icon}
                </div>

                <div>
                  <div style={{ fontSize: '24px', fontWeight: '900', color: '#FFFFFF', lineHeight: 1.2 }}>
                    {card.val.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '12px', color: '#94A3B8', fontWeight: '600', marginTop: '2px' }}>
                    {card.label}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* TWO-COLUMN: RECENT AUDIT LOGS & QUICK ACTION CARDS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)', gap: '24px' }}>
          
          {/* Audit Logs Table */}
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.65)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '20px',
              padding: '24px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <History size={18} color="#F87171" />
                <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#F8FAFC', margin: 0 }}>
                  Recent Admin Audit Trail
                </h3>
              </div>
              <Link to="/admin/audit-logs" style={{ fontSize: '12px', fontWeight: '700', color: '#EF4444', textDecoration: 'none' }}>
                Full Audit Log →
              </Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {auditLogs.length === 0 ? (
                <div style={{ padding: '24px', textAlign: 'center', color: '#64748B', fontSize: '13px' }}>
                  No recent audit activities logged.
                </div>
              ) : (
                auditLogs.map((log) => (
                  <div
                    key={log.id}
                    style={{
                      background: 'rgba(30, 41, 59, 0.35)',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      borderRadius: '12px',
                      padding: '12px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '12px'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                        <span style={{ fontWeight: '800', color: '#F87171' }}>{log.action}</span>
                        <span style={{ color: '#94A3B8' }}>on {log.resourceType} #{log.resourceId}</span>
                      </div>
                      <span style={{ color: '#64748B' }}>By Admin ID: {log.adminId}</span>
                    </div>

                    <span style={{ color: '#64748B' }}>
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Management Shortcuts */}
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.65)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '20px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
          >
            <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#F8FAFC', margin: '0 0 4px 0' }}>
              Administrative Workflows
            </h3>

            <Link
              to="/admin/notes/upload"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px',
                background: 'rgba(255, 255, 255, 0.04)',
                borderRadius: '12px',
                color: '#F8FAFC',
                textDecoration: 'none',
                fontSize: '13px',
                fontWeight: '700'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <UploadCloud size={16} color="#A78BFA" />
                <span>Upload Official Module Notes PDF</span>
              </div>
              <ArrowRight size={14} color="#64748B" />
            </Link>

            <Link
              to="/admin/chat-moderation"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px',
                background: 'rgba(255, 255, 255, 0.04)',
                borderRadius: '12px',
                color: '#F8FAFC',
                textDecoration: 'none',
                fontSize: '13px',
                fontWeight: '700'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <MessageSquare size={16} color="#60A5FA" />
                <span>Moderate Flagged Chat Messages</span>
              </div>
              <ArrowRight size={14} color="#64748B" />
            </Link>

            <Link
              to="/admin/announcements"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px',
                background: 'rgba(255, 255, 255, 0.04)',
                borderRadius: '12px',
                color: '#F8FAFC',
                textDecoration: 'none',
                fontSize: '13px',
                fontWeight: '700'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Megaphone size={16} color="#FBBF24" />
                <span>Broadcast University Announcement</span>
              </div>
              <ArrowRight size={14} color="#64748B" />
            </Link>

            <Link
              to="/admin/advertisements"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px',
                background: 'rgba(255, 255, 255, 0.04)',
                borderRadius: '12px',
                color: '#F8FAFC',
                textDecoration: 'none',
                fontSize: '13px',
                fontWeight: '700'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Megaphone size={16} color="#34D399" />
                <span>Manage Promotional Sponsorships</span>
              </div>
              <ArrowRight size={14} color="#64748B" />
            </Link>
          </div>

        </div>

      </div>
    </AdminLayout>
  );
};
