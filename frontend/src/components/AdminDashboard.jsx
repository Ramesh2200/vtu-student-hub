import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MOCK_ADMIN_STATS } from '../data/mockData';
import {
  Shield,
  Users,
  FileText,
  Download,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  BarChart3,
  Trash2,
  Lock,
  Sparkles
} from 'lucide-react';

export const AdminDashboard = () => {
  const { currentUser } = useApp();
  const [activeAdminTab, setActiveAdminTab] = useState('analytics'); // 'analytics' | 'users' | 'moderation'
  const [userList, setUserList] = useState(MOCK_ADMIN_STATS.recentRegistrations);
  const [moderationList, setModerationList] = useState(MOCK_ADMIN_STATS.pendingModeration);
  const [searchUser, setSearchUser] = useState('');

  const handleToggleUserStatus = (usn) => {
    setUserList(prev => prev.map(u => {
      if (u.usn === usn) {
        return {
          ...u,
          status: u.status === 'Active' ? 'Disabled' : 'Active'
        };
      }
      return u;
    }));
  };

  const handleApprove = (id) => {
    setModerationList(prev => prev.map(m => m.id === id ? { ...m, status: 'Approved & Published' } : m));
  };

  const handleReject = (id) => {
    setModerationList(prev => prev.filter(m => m.id !== id));
  };

  const filteredUsers = userList.filter(u => {
    if (!searchUser) return true;
    const q = searchUser.toLowerCase();
    return u.name.toLowerCase().includes(q) || u.usn.toLowerCase().includes(q) || u.college.toLowerCase().includes(q);
  });

  return (
    <div style={{ padding: '32px 28px', maxWidth: '1440px', margin: '0 auto', width: '100%' }}>
      
      {/* 39. ADMIN DASHBOARD HEADER */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(34, 211, 238, 0.2) 0%, rgba(108, 92, 231, 0.15) 100%), #111827',
        border: '1px solid rgba(34, 211, 238, 0.3)',
        borderRadius: '24px',
        padding: '36px',
        marginBottom: '32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '24px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className="badge badge-accent">VTU Central SuperAdmin</span>
            <span className="badge badge-primary">Belagavi Headquarters</span>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#F8FAFC', marginBottom: '6px' }}>
            University System Operations
          </h1>
          <p style={{ fontSize: '0.95rem', color: '#94A3B8' }}>
            Global oversight across 218 VTU institutions, resource compliance, and user verification.
          </p>
        </div>

        {/* Admin Navigation Pills */}
        <div style={{ display: 'flex', gap: '10px', background: 'rgba(255, 255, 255, 0.05)', padding: '4px', borderRadius: '12px' }}>
          {[
            { id: 'analytics', label: 'Ecosystem Analytics' },
            { id: 'users', label: 'User Directory' },
            { id: 'moderation', label: 'Content Moderation' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveAdminTab(t.id)}
              style={{
                padding: '8px 18px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 600,
                background: activeAdminTab === t.id ? '#22D3EE' : 'transparent',
                color: activeAdminTab === t.id ? '#0B1020' : '#94A3B8'
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* 40. ADMIN ANALYTICS VIEW */}
      {activeAdminTab === 'analytics' && (
        <div>
          {/* Top Metrics Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
            {[
              { label: 'Registered Students', val: MOCK_ADMIN_STATS.totalStudents.toLocaleString(), sub: '+340 this week', color: '#6C5CE7' },
              { label: 'Active Today', val: MOCK_ADMIN_STATS.activeToday.toLocaleString(), sub: 'Concurrent sessions', color: '#4F8CFF' },
              { label: 'Curated Notes', val: MOCK_ADMIN_STATS.totalNotes.toLocaleString(), sub: '2022/2021 Schemes', color: '#22D3EE' },
              { label: 'Total Downloads', val: MOCK_ADMIN_STATS.totalDownloads.toLocaleString(), sub: 'Across colleges', color: '#10B981' },
              { label: 'Affiliated Colleges', val: MOCK_ADMIN_STATS.registeredColleges, sub: 'Autonomous & Affiliated', color: '#F59E0B' },
              { label: 'Placements Recorded', val: MOCK_ADMIN_STATS.placedStudents.toLocaleString(), sub: '2025/2026 batches', color: '#EC4899' }
            ].map(m => (
              <div key={m.label} className="glass-card" style={{ padding: '22px', borderRadius: '16px' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#F8FAFC', marginBottom: '4px' }}>
                  {m.val}
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: m.color }}>
                  {m.label}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '2px' }}>
                  {m.sub}
                </div>
              </div>
            ))}
          </div>

          {/* Visual Bar Distribution for Schemes and Branches */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
            <div className="glass-card" style={{ padding: '28px', borderRadius: '20px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#F8FAFC', marginBottom: '20px' }}>
                Traffic Share By Engineering Scheme
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {[
                  { name: '2022 Scheme (NEP CBCS)', pct: 64, color: '#6C5CE7' },
                  { name: '2021 Scheme', pct: 26, color: '#4F8CFF' },
                  { name: '2018 Scheme (Final Year Graduating)', pct: 10, color: '#22D3EE' }
                ].map(item => (
                  <div key={item.name}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '6px' }}>
                      <span style={{ color: '#CBD5E1' }}>{item.name}</span>
                      <strong style={{ color: item.color }}>{item.pct}%</strong>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${item.pct}%`, height: '100%', background: item.color, borderRadius: '4px' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card" style={{ padding: '28px', borderRadius: '20px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#F8FAFC', marginBottom: '20px' }}>
                Branch Engagement Breakdown
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {[
                  { name: 'Computer Science (CSE / ISE / AIML)', pct: 58, color: '#22D3EE' },
                  { name: 'Electronics & Communication (ECE / EEE)', pct: 24, color: '#10B981' },
                  { name: 'Mechanical & Civil Engineering', pct: 18, color: '#F59E0B' }
                ].map(item => (
                  <div key={item.name}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '6px' }}>
                      <span style={{ color: '#CBD5E1' }}>{item.name}</span>
                      <strong style={{ color: item.color }}>{item.pct}%</strong>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${item.pct}%`, height: '100%', background: item.color, borderRadius: '4px' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 41. ADMIN USER MANAGEMENT VIEW */}
      {activeAdminTab === 'users' && (
        <div className="glass-card" style={{ padding: '28px', borderRadius: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#F8FAFC' }}>
              Student & Faculty Verification Directory
            </h3>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.05)', padding: '6px 12px', borderRadius: '10px' }}>
              <Search size={14} color="#94A3B8" />
              <input
                type="text"
                placeholder="Search name, USN, college..."
                value={searchUser}
                onChange={(e) => setSearchUser(e.target.value)}
                style={{ background: 'transparent', border: 'none', color: '#FFF', fontSize: '0.82rem' }}
              />
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#94A3B8' }}>
                  <th style={{ padding: '12px' }}>Name & USN</th>
                  <th style={{ padding: '12px' }}>College</th>
                  <th style={{ padding: '12px' }}>Branch</th>
                  <th style={{ padding: '12px' }}>Registration</th>
                  <th style={{ padding: '12px' }}>Account Status</th>
                  <th style={{ padding: '12px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(u => (
                  <tr key={u.usn} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', color: '#E2E8F0' }}>
                    <td style={{ padding: '14px 12px' }}>
                      <div style={{ fontWeight: 600, color: '#F8FAFC' }}>{u.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#A78BFA' }}>{u.usn}</div>
                    </td>
                    <td style={{ padding: '14px 12px' }}>{u.college}</td>
                    <td style={{ padding: '14px 12px' }}>{u.branch}</td>
                    <td style={{ padding: '14px 12px', fontSize: '0.8rem', color: '#94A3B8' }}>{u.date}</td>
                    <td style={{ padding: '14px 12px' }}>
                      <span className={`badge ${u.status === 'Active' ? 'badge-success' : 'badge-primary'}`}>
                        {u.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 12px' }}>
                      <button
                        onClick={() => handleToggleUserStatus(u.usn)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '8px',
                          background: u.status === 'Active' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                          border: u.status === 'Active' ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(16, 185, 129, 0.3)',
                          color: u.status === 'Active' ? '#F87171' : '#6EE7B7',
                          fontSize: '0.78rem',
                          fontWeight: 600
                        }}
                      >
                        {u.status === 'Active' ? 'Disable Access' : 'Reactivate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 42. CONTENT MODERATION VIEW */}
      {activeAdminTab === 'moderation' && (
        <div className="glass-card" style={{ padding: '28px', borderRadius: '20px' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#F8FAFC', marginBottom: '18px' }}>
            Pending Resource Approvals & Flagged Posts
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {moderationList.map(mod => (
              <div
                key={mod.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px 20px',
                  borderRadius: '14px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span className="badge badge-primary">{mod.type}</span>
                    <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Submitted by {mod.author} • {mod.date}</span>
                  </div>
                  <div style={{ fontSize: '0.98rem', fontWeight: 700, color: '#F8FAFC' }}>
                    {mod.title}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: mod.status === 'Approved & Published' ? '#10B981' : '#F59E0B', marginTop: '2px' }}>
                    Status: {mod.status}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  {mod.status !== 'Approved & Published' && (
                    <button
                      onClick={() => handleApprove(mod.id)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '8px',
                        background: '#10B981',
                        color: '#FFFFFF',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <CheckCircle size={14} />
                      <span>Approve</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleReject(mod.id)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '8px',
                      background: 'rgba(239, 68, 68, 0.15)',
                      color: '#F87171',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Trash2 size={14} />
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
