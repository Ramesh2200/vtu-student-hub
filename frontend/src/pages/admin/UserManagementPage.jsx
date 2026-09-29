import React, { useState, useEffect } from 'react';
import { Users, Search, Shield, Ban, CheckCircle, Trash2, Filter } from 'lucide-react';
import { api } from '../../services/api';
import { AdminLayout } from './AdminLayout';

export const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await api.admin.getUsers();
      setUsers(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (user) => {
    const newStatus = user.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    try {
      await api.admin.updateUserStatus(user.id, newStatus);
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, status: newStatus } : u))
      );
    } catch (err) {
      alert(err.message || 'Failed to update user status');
    }
  };

  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase();
    return (
      !q ||
      u.email?.toLowerCase().includes(q) ||
      u.fullName?.toLowerCase().includes(q) ||
      u.usn?.toLowerCase().includes(q) ||
      u.role?.toLowerCase().includes(q)
    );
  });

  return (
    <AdminLayout>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '900', color: '#F8FAFC', margin: 0 }}>
              User & Student Directory
            </h1>
            <p style={{ fontSize: '13px', color: '#94A3B8', margin: '4px 0 0' }}>
              Manage registered students, authentication privileges, and administrative roles.
            </p>
          </div>

          <div style={{ position: 'relative', width: '300px' }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, USN..."
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

        {/* Users Table */}
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
                <th style={{ padding: '16px 20px', fontWeight: '700' }}>User</th>
                <th style={{ padding: '16px 20px', fontWeight: '700' }}>Role</th>
                <th style={{ padding: '16px 20px', fontWeight: '700' }}>USN / College</th>
                <th style={{ padding: '16px 20px', fontWeight: '700' }}>Status</th>
                <th style={{ padding: '16px 20px', fontWeight: '700' }}>Registered</th>
                <th style={{ padding: '16px 20px', fontWeight: '700', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: '#94A3B8' }}>Loading users...</td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: '#94A3B8' }}>No users found matching query.</td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr
                    key={u.id}
                    style={{
                      borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                      transition: 'background 0.15s ease'
                    }}
                  >
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ fontWeight: '700', color: '#F8FAFC' }}>{u.fullName || 'Student'}</div>
                      <div style={{ fontSize: '11px', color: '#64748B' }}>{u.email}</div>
                    </td>

                    <td style={{ padding: '16px 20px' }}>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: '800',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          background: u.role === 'ADMIN' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(56, 189, 248, 0.15)',
                          color: u.role === 'ADMIN' ? '#F87171' : '#38BDF8'
                        }}
                      >
                        {u.role}
                      </span>
                    </td>

                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ color: '#E2E8F0', fontWeight: '600' }}>{u.usn || 'N/A'}</div>
                      <div style={{ fontSize: '11px', color: '#94A3B8' }}>{u.college || 'VTU Affiliated'}</div>
                    </td>

                    <td style={{ padding: '16px 20px' }}>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: '800',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          background: u.status === 'ACTIVE' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                          color: u.status === 'ACTIVE' ? '#34D399' : '#F87171'
                        }}
                      >
                        {u.status || 'ACTIVE'}
                      </span>
                    </td>

                    <td style={{ padding: '16px 20px', color: '#64748B', fontSize: '12px' }}>
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>

                    <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                      {u.role !== 'ADMIN' && (
                        <button
                          onClick={() => toggleStatus(u)}
                          style={{
                            background: u.status === 'ACTIVE' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                            border: 'none',
                            color: u.status === 'ACTIVE' ? '#F87171' : '#34D399',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            fontSize: '11px',
                            fontWeight: '700',
                            cursor: 'pointer'
                          }}
                        >
                          {u.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                        </button>
                      )}
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
