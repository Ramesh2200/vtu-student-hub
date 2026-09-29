import React, { useState, useEffect } from 'react';
import { AlertTriangle, Trash2, CheckCircle, MessageSquare } from 'lucide-react';
import { api } from '../../services/api';
import { AdminLayout } from './AdminLayout';

export const ChatModerationPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      setLoading(true);
      const data = await api.admin.getReports();
      setReports(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = async (reportId) => {
    try {
      await api.admin.dismissReport(reportId);
      setReports((prev) => prev.filter((r) => r.id !== reportId));
    } catch (err) {
      alert(err.message || 'Failed to dismiss report');
    }
  };

  const handleDeleteMessage = async (reportId, messageId) => {
    if (!window.confirm('Delete this reported message from community chat?')) return;
    try {
      await api.admin.deleteReportedMessage(reportId, messageId);
      setReports((prev) => prev.filter((r) => r.id !== reportId));
    } catch (err) {
      alert(err.message || 'Failed to delete message');
    }
  };

  return (
    <AdminLayout>
      <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '900', color: '#F8FAFC', margin: 0 }}>
            Community Chat Moderation
          </h1>
          <p style={{ fontSize: '13px', color: '#94A3B8', margin: '4px 0 0' }}>
            Review peer-reported messages across discussion rooms to uphold academic community standards.
          </p>
        </div>

        {/* Reports Feed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#94A3B8' }}>Loading reported messages...</div>
          ) : reports.length === 0 ? (
            <div style={{ padding: '60px', textAlign: 'center', background: 'rgba(15, 23, 42, 0.5)', borderRadius: '20px', color: '#94A3B8' }}>
              <CheckCircle size={44} color="#34D399" style={{ marginBottom: '12px' }} />
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#F8FAFC', margin: '0 0 6px 0' }}>All Clear!</h3>
              <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>No flagged or reported messages pending moderation review.</p>
            </div>
          ) : (
            reports.map((rep) => (
              <div
                key={rep.id}
                style={{
                  background: 'rgba(15, 23, 42, 0.65)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '16px',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <AlertTriangle size={16} color="#F87171" />
                    <span style={{ fontSize: '12px', fontWeight: '800', color: '#F87171' }}>
                      Reported by Student #{rep.reportedByUserId}
                    </span>
                    <span style={{ fontSize: '11px', color: '#64748B' }}>
                      Room: #{rep.roomName || 'General'}
                    </span>
                  </div>

                  <span style={{ fontSize: '11px', color: '#64748B' }}>
                    {new Date(rep.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div style={{ background: 'rgba(0, 0, 0, 0.3)', borderRadius: '10px', padding: '12px', fontSize: '13px', color: '#F8FAFC' }}>
                  <div style={{ fontSize: '11px', color: '#94A3B8', marginBottom: '4px' }}>REPORTED MESSAGE CONTENT:</div>
                  "{rep.messageContent}"
                </div>

                <div style={{ fontSize: '12px', color: '#FCA5A5' }}>
                  <strong>Report Reason:</strong> {rep.reason}
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '12px' }}>
                  <button
                    onClick={() => handleDismiss(rep.id)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: 'none',
                      color: '#CBD5E1',
                      padding: '8px 14px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    Dismiss Report
                  </button>

                  <button
                    onClick={() => handleDeleteMessage(rep.id, rep.messageId)}
                    style={{
                      background: '#EF4444',
                      border: 'none',
                      color: '#FFFFFF',
                      padding: '8px 14px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Trash2 size={13} /> Delete Inappropriate Message
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </AdminLayout>
  );
};
