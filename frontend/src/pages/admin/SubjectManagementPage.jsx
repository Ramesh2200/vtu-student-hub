import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Search, Layers, Edit2, Trash2 } from 'lucide-react';
import { api } from '../../services/api';
import { AdminLayout } from './AdminLayout';

export const SubjectManagementPage = () => {
  const [subjects, setSubjects] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // New Subject Modal
  const [showModal, setShowModal] = useState(false);
  const [newSubj, setNewSubj] = useState({
    code: '',
    name: '',
    semesterId: 6,
    department: 'CSE',
    credits: 4,
    description: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [semsRes, subjsRes] = await Promise.all([
        api.semesters.getAll(),
        api.admin.getSubjects()
      ]);
      setSemesters(semsRes || []);
      setSubjects(subjsRes || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSubject = async (e) => {
    e.preventDefault();
    try {
      const created = await api.admin.createSubject(newSubj);
      setSubjects((prev) => [...prev, created]);
      setShowModal(false);
      setNewSubj({ code: '', name: '', semesterId: 6, department: 'CSE', credits: 4, description: '' });
    } catch (err) {
      alert(err.message || 'Failed to create subject');
    }
  };

  const filtered = subjects.filter((s) => {
    const q = searchQuery.toLowerCase();
    return !q || s.code?.toLowerCase().includes(q) || s.name?.toLowerCase().includes(q) || s.department?.toLowerCase().includes(q);
  });

  return (
    <AdminLayout>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '900', color: '#F8FAFC', margin: 0 }}>
              Curriculum Subjects Registry
            </h1>
            <p style={{ fontSize: '13px', color: '#94A3B8', margin: '4px 0 0' }}>
              Add and configure subjects across Semesters 1 through 8.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
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
              <Plus size={16} /> Add New Subject
            </button>
          </div>
        </div>

        {/* Subjects Table */}
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
                <th style={{ padding: '16px 20px', fontWeight: '700' }}>Subject Code</th>
                <th style={{ padding: '16px 20px', fontWeight: '700' }}>Subject Title</th>
                <th style={{ padding: '16px 20px', fontWeight: '700' }}>Semester</th>
                <th style={{ padding: '16px 20px', fontWeight: '700' }}>Department</th>
                <th style={{ padding: '16px 20px', fontWeight: '700' }}>Credits</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: '#94A3B8' }}>Loading subjects...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: '#94A3B8' }}>No subjects found.</td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <tr
                    key={s.id}
                    style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}
                  >
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{ fontSize: '12px', fontWeight: '800', padding: '3px 8px', borderRadius: '6px', background: 'rgba(6, 182, 212, 0.15)', color: '#22D3EE' }}>
                        {s.code}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px', fontWeight: '700', color: '#F8FAFC' }}>
                      {s.name}
                    </td>
                    <td style={{ padding: '16px 20px', color: '#C4B5FD', fontWeight: '700' }}>
                      Semester {s.semesterId}
                    </td>
                    <td style={{ padding: '16px 20px', color: '#94A3B8' }}>
                      {s.department || 'CSE'}
                    </td>
                    <td style={{ padding: '16px 20px', color: '#34D399', fontWeight: '800' }}>
                      {s.credits || 4}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* CREATE MODAL */}
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
                maxWidth: '480px',
                background: '#0F172A',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                borderRadius: '20px',
                padding: '28px'
              }}
            >
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#FFFFFF', margin: '0 0 16px 0' }}>
                Add New VTU Subject
              </h3>

              <form onSubmit={handleCreateSubject} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#CBD5E1', display: 'block', marginBottom: '4px' }}>
                    Subject Code *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 21CS71"
                    value={newSubj.code}
                    onChange={(e) => setNewSubj({ ...newSubj, code: e.target.value.toUpperCase() })}
                    style={{ width: '100%', background: '#0B1020', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '10px', color: '#FFF' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#CBD5E1', display: 'block', marginBottom: '4px' }}>
                    Subject Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Artificial Intelligence & Machine Learning"
                    value={newSubj.name}
                    onChange={(e) => setNewSubj({ ...newSubj, name: e.target.value })}
                    style={{ width: '100%', background: '#0B1020', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '10px', color: '#FFF' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: '700', color: '#CBD5E1', display: 'block', marginBottom: '4px' }}>
                      Semester
                    </label>
                    <select
                      value={newSubj.semesterId}
                      onChange={(e) => setNewSubj({ ...newSubj, semesterId: Number(e.target.value) })}
                      style={{ width: '100%', background: '#0B1020', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '10px', color: '#FFF' }}
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                        <option key={n} value={n}>Semester {n}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: '700', color: '#CBD5E1', display: 'block', marginBottom: '4px' }}>
                      Credits
                    </label>
                    <input
                      type="number"
                      value={newSubj.credits}
                      onChange={(e) => setNewSubj({ ...newSubj, credits: Number(e.target.value) })}
                      style={{ width: '100%', background: '#0B1020', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '10px', color: '#FFF' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#CBD5E1', display: 'block', marginBottom: '4px' }}>
                    Description
                  </label>
                  <textarea
                    rows={2}
                    value={newSubj.description}
                    onChange={(e) => setNewSubj({ ...newSubj, description: e.target.value })}
                    style={{ width: '100%', background: '#0B1020', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '10px', color: '#FFF' }}
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
                    Create Subject
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
