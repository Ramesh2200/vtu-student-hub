import React, { useState, useEffect } from 'react';
import { Briefcase, Plus, Trash2, Edit, CheckCircle, Clock, MapPin, DollarSign } from 'lucide-react';
import { api } from '../../services/api';
import { AdminLayout } from './AdminLayout';

export const PlacementManagementPage = () => {
  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newDrive, setNewDrive] = useState({
    companyName: '',
    jobRole: '',
    description: '',
    location: 'Bengaluru, Karnataka',
    ctc: '₹14-22 LPA',
    eligibility: 'CSE / ISE / ECE (60%+ in 10th, 12th & Engg)',
    requiredSkills: 'Java, DSA, DBMS, Cloud',
    batch: '2025',
    applicationLink: '',
    lastDate: '2026-10-30',
    status: 'ACTIVE'
  });

  useEffect(() => {
    loadPlacements();
  }, []);

  const loadPlacements = async () => {
    try {
      setLoading(true);
      const data = await api.admin.getPlacements();
      setPlacements(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const created = await api.admin.createPlacement(newDrive);
      setPlacements((prev) => [...prev, created]);
      setShowModal(false);
      setNewDrive({
        companyName: '',
        jobRole: '',
        description: '',
        location: 'Bengaluru, Karnataka',
        ctc: '₹14-22 LPA',
        eligibility: 'CSE / ISE / ECE (60%+)',
        requiredSkills: 'Java, DSA',
        batch: '2025',
        applicationLink: '',
        lastDate: '2026-10-30',
        status: 'ACTIVE'
      });
    } catch (err) {
      alert(err.message || 'Failed to create placement drive');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this placement drive record?')) return;
    try {
      await api.admin.deletePlacement(id);
      setPlacements((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert(err.message || 'Delete failed');
    }
  };

  const toggleStatus = async (drive) => {
    const newStatus = drive.status === 'ACTIVE' ? 'CLOSED' : 'ACTIVE';
    try {
      await api.admin.updatePlacement(drive.id, { ...drive, status: newStatus });
      setPlacements((prev) =>
        prev.map((p) => (p.id === drive.id ? { ...p, status: newStatus } : p))
      );
    } catch (err) {
      alert(err.message || 'Update failed');
    }
  };

  return (
    <AdminLayout>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '900', color: '#F8FAFC', margin: 0 }}>
              Campus Placement Drives Management
            </h1>
            <p style={{ fontSize: '13px', color: '#94A3B8', margin: '4px 0 0' }}>
              Publish verified VTU central placement opportunities, eligibility criteria, and job descriptions.
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
              color: '#FFFFFF',
              border: 'none',
              padding: '10px 18px',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            <Plus size={16} /> Post Recruitment Drive
          </button>
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
                <th style={{ padding: '16px 20px', fontWeight: '700' }}>Company & Role</th>
                <th style={{ padding: '16px 20px', fontWeight: '700' }}>CTC</th>
                <th style={{ padding: '16px 20px', fontWeight: '700' }}>Batch</th>
                <th style={{ padding: '16px 20px', fontWeight: '700' }}>Deadline</th>
                <th style={{ padding: '16px 20px', fontWeight: '700' }}>Status</th>
                <th style={{ padding: '16px 20px', fontWeight: '700', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: '#94A3B8' }}>Loading placement drives...</td>
                </tr>
              ) : placements.map((p) => (
                <tr key={p.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ fontWeight: '800', color: '#F8FAFC' }}>{p.companyName}</div>
                    <div style={{ fontSize: '12px', color: '#38BDF8' }}>{p.jobRole}</div>
                  </td>
                  <td style={{ padding: '16px 20px', color: '#34D399', fontWeight: '800' }}>
                    {p.ctc || '₹14-22 LPA'}
                  </td>
                  <td style={{ padding: '16px 20px', color: '#E2E8F0', fontWeight: '700' }}>
                    {p.batch}
                  </td>
                  <td style={{ padding: '16px 20px', color: '#94A3B8' }}>
                    {p.lastDate || 'Rolling'}
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: '800',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        background: p.status === 'ACTIVE' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                        color: p.status === 'ACTIVE' ? '#34D399' : '#F87171'
                      }}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                      <button
                        onClick={() => toggleStatus(p)}
                        style={{
                          background: 'rgba(255, 255, 255, 0.08)',
                          border: 'none',
                          color: '#CBD5E1',
                          padding: '6px 10px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: '700',
                          cursor: 'pointer'
                        }}
                      >
                        {p.status === 'ACTIVE' ? 'Close' : 'Activate'}
                      </button>

                      <button
                        onClick={() => handleDelete(p.id)}
                        style={{ background: 'rgba(239, 68, 68, 0.15)', border: 'none', color: '#F87171', padding: '6px 8px', borderRadius: '6px', cursor: 'pointer' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {showModal && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.75)',
              zIndex: 100,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }}
          >
            <div
              style={{
                width: '100%',
                maxWidth: '540px',
                background: '#0F172A',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                borderRadius: '20px',
                padding: '28px',
                maxHeight: '90vh',
                overflowY: 'auto'
              }}
            >
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#FFFFFF', margin: '0 0 16px 0' }}>
                Post Placement Drive
              </h3>

              <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: '700', color: '#CBD5E1', display: 'block', marginBottom: '4px' }}>Company Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Cisco Systems"
                      value={newDrive.companyName}
                      onChange={(e) => setNewDrive({ ...newDrive, companyName: e.target.value })}
                      style={{ width: '100%', background: '#0B1020', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '10px', color: '#FFF' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: '700', color: '#CBD5E1', display: 'block', marginBottom: '4px' }}>Job Role *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Software Engineer (Networking)"
                      value={newDrive.jobRole}
                      onChange={(e) => setNewDrive({ ...newDrive, jobRole: e.target.value })}
                      style={{ width: '100%', background: '#0B1020', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '10px', color: '#FFF' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: '700', color: '#CBD5E1', display: 'block', marginBottom: '4px' }}>CTC / Package</label>
                    <input
                      type="text"
                      placeholder="e.g. ₹18.5 - 24 LPA"
                      value={newDrive.ctc}
                      onChange={(e) => setNewDrive({ ...newDrive, ctc: e.target.value })}
                      style={{ width: '100%', background: '#0B1020', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '10px', color: '#FFF' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: '700', color: '#CBD5E1', display: 'block', marginBottom: '4px' }}>Batch</label>
                    <input
                      type="text"
                      placeholder="2025"
                      value={newDrive.batch}
                      onChange={(e) => setNewDrive({ ...newDrive, batch: e.target.value })}
                      style={{ width: '100%', background: '#0B1020', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '10px', color: '#FFF' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#CBD5E1', display: 'block', marginBottom: '4px' }}>Job Description *</label>
                  <textarea
                    rows={3}
                    required
                    value={newDrive.description}
                    onChange={(e) => setNewDrive({ ...newDrive, description: e.target.value })}
                    style={{ width: '100%', background: '#0B1020', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '10px', color: '#FFF', resize: 'none' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#94A3B8', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{ background: '#EF4444', border: 'none', color: '#FFF', padding: '8px 20px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}
                  >
                    Publish Drive
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
};
