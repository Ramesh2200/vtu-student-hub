import React, { useState, useEffect } from 'react';
import { History, Shield, Search, Filter } from 'lucide-react';
import { api } from '../../services/api';
import { AdminLayout } from './AdminLayout';

export const AuditLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadAuditLogs();
  }, []);

  const loadAuditLogs = async () => {
    try {
      setLoading(true);
      const data = await api.admin.getAuditLogs();
      setLogs(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = logs.filter((log) => {
    const q = searchQuery.toLowerCase();
    return (
      !q ||
      log.action?.toLowerCase().includes(q) ||
      log.resourceType?.toLowerCase().includes(q) ||
      String(log.adminId).includes(q)
    );
  });

  return (
    <AdminLayout>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '900', color: '#F8FAFC', margin: 0 }}>
              Administrative Audit Trail
            </h1>
            <p style={{ fontSize: '13px', color: '#94A3B8', margin: '4px 0 0' }}>
              Immutable record of security-critical administrator mutations across academic assets.
            </p>
          </div>

          <div style={{ position: 'relative', width: '280px' }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search action, resource..."
              style={{
                width: '100%',
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '10px',
                padding: '10px 14px 10px 36px',
                color: '#FFFFFF',
                fontSize: '13px',
                outline: 'none'
              }}
            />
            <Search size={15} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '12px' }} />
          </div>
        </div>

        {/* Table */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.65)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '20px',
            overflow: 'hidden'
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: 'rgba(255, 255, 255, 0.03)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#94A3B8' }}>
                <th style={{ padding: '16px 20px', fontWeight: '700' }}>Audit ID</th>
                <th style={{ padding: '16px 20px', fontWeight: '700' }}>Admin ID</th>
                <th style={{ padding: '16px 20px', fontWeight: '700' }}>Action Triggered</th>
                <th style={{ padding: '16px 20px', fontWeight: '700' }}>Target Resource</th>
                <th style={{ padding: '16px 20px', fontWeight: '700' }}>Timestamp</th>
                <th style={{ padding: '16px 20px', fontWeight: '700' }}>Origin IP</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: '#94A3B8' }}>Loading audit logs...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: '#94A3B8' }}>No audit records recorded.</td>
                </tr>
              ) : (
                filtered.map((log) => (
                  <tr key={log.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                    <td style={{ padding: '16px 20px', color: '#64748B' }}>
                      #{log.id}
                    </td>

                    <td style={{ padding: '16px 20px' }}>
                      <span style={{ fontSize: '11px', fontWeight: '800', background: 'rgba(239, 68, 68, 0.15)', color: '#F87171', padding: '3px 8px', borderRadius: '4px' }}>
                        Admin #{log.adminId}
                      </span>
                    </td>

                    <td style={{ padding: '16px 20px', fontWeight: '700', color: '#F8FAFC' }}>
                      {log.action}
                    </td>

                    <td style={{ padding: '16px 20px', color: '#38BDF8' }}>
                      {log.resourceType} #{log.resourceId}
                    </td>

                    <td style={{ padding: '16px 20px', color: '#94A3B8', fontSize: '12px' }}>
                      {new Date(log.timestamp).toLocaleString()}
                    </td>

                    <td style={{ padding: '16px 20px', color: '#64748B', fontFamily: 'monospace' }}>
                      {log.ipAddress || '127.0.0.1'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>
    </AdminLayout>
  );
};
