import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Trash2, Edit2, Check, X } from 'lucide-react';
import { api } from '../../services/api';
import { AdminLayout } from './AdminLayout';

export const SubjectManagementPage = () => {
  const [subjects, setSubjects] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

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
    const code = (newSubj.code || '').trim().toUpperCase();
    const name = (newSubj.name || '').trim();
    if (!code || !name) {
      alert('Please enter both Subject Code (e.g. BCS201) and Subject Title.');
      return;
    }

    try {
      const payload = {
        code,
        subjectCode: code,
        name,
        subjectName: name,
        title: name,
        semesterId: Number(newSubj.semesterId) || 1,
        branch: newSubj.department || 'CSE',
        department: newSubj.department || 'CSE',
        credits: Number(newSubj.credits) || 4,
        description: newSubj.description || '',
        scheme: '2022 Scheme CBCS',
        active: true
      };

      const created = await api.admin.createSubject(payload);
      setSubjects((prev) => [
        {
          ...created,
          code: created.code || created.subjectCode || code,
          name: created.name || created.subjectName || name,
          department: created.department || created.branch || newSubj.department
        },
        ...prev
      ]);
      setShowModal(false);
      setNewSubj({ code: '', name: '', semesterId: 1, department: 'CSE', credits: 4, description: '' });
    } catch (err) {
      alert(err.message || 'Failed to create subject');
    }
  };

  const handleDelete = async (id, code) => {
    if (!window.confirm(`Delete subject "${code}"? This action cannot be undone.`)) return;
    setDeletingId(id);
    try {
      await api.admin.deleteSubject(id);
      setSubjects((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      alert(err.message || 'Failed to delete subject');
    } finally {
      setDeletingId(null);
    }
  };

  const startEdit = (subject) => {
    setEditingId(subject.id);
    setEditData({
      code: subject.code || subject.subjectCode || '',
      name: subject.name || subject.subjectName || '',
      semesterId: subject.semesterId || 1,
      department: subject.department || subject.branch || 'CSE',
      credits: subject.credits || 4,
      description: subject.description || ''
    });
  };

  const handleUpdate = async (id) => {
    const code = (editData.code || '').trim().toUpperCase();
    const name = (editData.name || '').trim();
    if (!code || !name) {
      alert('Subject Code and Title are required.');
      return;
    }
    try {
      const payload = {
        code,
        subjectCode: code,
        name,
        subjectName: name,
        semesterId: Number(editData.semesterId) || 1,
        branch: editData.department || 'CSE',
        department: editData.department || 'CSE',
        credits: Number(editData.credits) || 4,
        description: editData.description || ''
      };
      await api.admin.updateSubject(id, payload);
      setSubjects((prev) =>
        prev.map((s) =>
          s.id === id
            ? { ...s, ...payload, code, name, subjectCode: code, subjectName: name }
            : s
        )
      );
      setEditingId(null);
    } catch (err) {
      alert(err.message || 'Failed to update subject');
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const filtered = subjects.filter((s) => {
    const q = searchQuery.toLowerCase();
    const code = (s.code || s.subjectCode || '').toLowerCase();
    const name = (s.name || s.subjectName || '').toLowerCase();
    const dept = (s.department || s.branch || '').toLowerCase();
    return !q || code.includes(q) || name.includes(q) || dept.includes(q);
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
              Add, edit, and remove subjects across Semesters 1 through 8.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            {/* Search */}
            <input
              type="text"
              placeholder="Search subjects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '10px',
                padding: '9px 14px',
                color: '#F8FAFC',
                fontSize: '13px',
                outline: 'none',
                width: '200px'
              }}
            />
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

        {/* Stats */}
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          {[
            { label: 'Total Subjects', value: subjects.length, color: '#22D3EE' },
            { label: 'Showing', value: filtered.length, color: '#A78BFA' },
            { label: 'Semesters Covered', value: [...new Set(subjects.map(s => s.semesterId))].length, color: '#34D399' }
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                background: 'rgba(15, 23, 42, 0.65)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '14px',
                padding: '16px 22px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                minWidth: '160px'
              }}
            >
              <span style={{ fontSize: '24px', fontWeight: '900', color: stat.color }}>{stat.value}</span>
              <span style={{ fontSize: '12px', color: '#64748B', fontWeight: '600' }}>{stat.label}</span>
            </div>
          ))}
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
                <th style={{ padding: '16px 20px', fontWeight: '700', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: '#94A3B8' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                      <div style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.2)', borderTopColor: '#EF4444', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                      Loading subjects...
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: '#94A3B8' }}>
                    {searchQuery ? `No subjects match "${searchQuery}".` : 'No subjects found. Add your first subject!'}
                  </td>
                </tr>
              ) : (
                filtered.map((s) => {
                  const subCode = s.code || s.subjectCode || '—';
                  const subName = s.name || s.subjectName || '—';
                  const subDept = s.department || s.branch || 'CSE';
                  const isEditing = editingId === s.id;
                  const isDeleting = deletingId === s.id;

                  return (
                    <tr
                      key={s.id}
                      style={{
                        borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                        background: isEditing ? 'rgba(239, 68, 68, 0.04)' : 'transparent',
                        transition: 'background 0.2s'
                      }}
                    >
                      {/* Subject Code */}
                      <td style={{ padding: '14px 20px' }}>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editData.code}
                            onChange={(e) => setEditData({ ...editData, code: e.target.value.toUpperCase() })}
                            style={{
                              background: '#0B1020',
                              border: '1px solid rgba(239,68,68,0.4)',
                              borderRadius: '6px',
                              padding: '6px 8px',
                              color: '#FFF',
                              fontSize: '12px',
                              width: '90px',
                              fontWeight: '800',
                              textTransform: 'uppercase'
                            }}
                          />
                        ) : (
                          <span style={{ fontSize: '12px', fontWeight: '800', padding: '3px 8px', borderRadius: '6px', background: 'rgba(6, 182, 212, 0.15)', color: '#22D3EE' }}>
                            {subCode}
                          </span>
                        )}
                      </td>

                      {/* Subject Name */}
                      <td style={{ padding: '14px 20px', fontWeight: '700', color: '#F8FAFC', maxWidth: '280px' }}>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editData.name}
                            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                            style={{
                              background: '#0B1020',
                              border: '1px solid rgba(239,68,68,0.4)',
                              borderRadius: '6px',
                              padding: '6px 8px',
                              color: '#FFF',
                              fontSize: '12px',
                              width: '100%',
                              minWidth: '200px'
                            }}
                          />
                        ) : (
                          <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{subName}</span>
                        )}
                      </td>

                      {/* Semester */}
                      <td style={{ padding: '14px 20px', color: '#C4B5FD', fontWeight: '700' }}>
                        {isEditing ? (
                          <select
                            value={editData.semesterId}
                            onChange={(e) => setEditData({ ...editData, semesterId: Number(e.target.value) })}
                            style={{ background: '#0B1020', border: '1px solid rgba(239,68,68,0.4)', borderRadius: '6px', padding: '6px 8px', color: '#FFF', fontSize: '12px' }}
                          >
                            {[1,2,3,4,5,6,7,8].map((n) => <option key={n} value={n}>Sem {n}</option>)}
                          </select>
                        ) : (
                          `Sem ${s.semesterId}`
                        )}
                      </td>

                      {/* Department */}
                      <td style={{ padding: '14px 20px', color: '#94A3B8' }}>
                        {isEditing ? (
                          <select
                            value={editData.department}
                            onChange={(e) => setEditData({ ...editData, department: e.target.value })}
                            style={{ background: '#0B1020', border: '1px solid rgba(239,68,68,0.4)', borderRadius: '6px', padding: '6px 8px', color: '#FFF', fontSize: '12px' }}
                          >
                            {['CSE', 'ISE', 'ECE', 'ME', 'CE', 'EEE', 'CHE', 'MBA', 'MCA', 'Common'].map((d) => (
                              <option key={d} value={d}>{d}</option>
                            ))}
                          </select>
                        ) : subDept}
                      </td>

                      {/* Credits */}
                      <td style={{ padding: '14px 20px', color: '#34D399', fontWeight: '800' }}>
                        {isEditing ? (
                          <input
                            type="number"
                            value={editData.credits}
                            min={1}
                            max={10}
                            onChange={(e) => setEditData({ ...editData, credits: Number(e.target.value) })}
                            style={{ background: '#0B1020', border: '1px solid rgba(239,68,68,0.4)', borderRadius: '6px', padding: '6px 8px', color: '#FFF', fontSize: '12px', width: '60px' }}
                          />
                        ) : (
                          s.credits || 4
                        )}
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                          {isEditing ? (
                            <>
                              <button
                                onClick={() => handleUpdate(s.id)}
                                title="Save Changes"
                                style={{
                                  background: 'rgba(52, 211, 153, 0.15)',
                                  border: '1px solid rgba(52, 211, 153, 0.3)',
                                  color: '#34D399',
                                  padding: '6px 12px',
                                  borderRadius: '8px',
                                  fontSize: '12px',
                                  fontWeight: '700',
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px'
                                }}
                              >
                                <Check size={13} /> Save
                              </button>
                              <button
                                onClick={cancelEdit}
                                title="Cancel Edit"
                                style={{
                                  background: 'rgba(148, 163, 184, 0.1)',
                                  border: '1px solid rgba(148, 163, 184, 0.2)',
                                  color: '#94A3B8',
                                  padding: '6px 10px',
                                  borderRadius: '8px',
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center'
                                }}
                              >
                                <X size={13} />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => startEdit(s)}
                                title="Edit Subject"
                                style={{
                                  background: 'rgba(167, 139, 250, 0.12)',
                                  border: '1px solid rgba(167, 139, 250, 0.25)',
                                  color: '#A78BFA',
                                  padding: '6px 10px',
                                  borderRadius: '8px',
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  fontSize: '12px',
                                  fontWeight: '600'
                                }}
                              >
                                <Edit2 size={13} /> Edit
                              </button>
                              <button
                                onClick={() => handleDelete(s.id, subCode)}
                                title="Delete Subject"
                                disabled={isDeleting}
                                style={{
                                  background: 'rgba(239, 68, 68, 0.12)',
                                  border: '1px solid rgba(239, 68, 68, 0.25)',
                                  color: '#F87171',
                                  padding: '6px 10px',
                                  borderRadius: '8px',
                                  cursor: isDeleting ? 'wait' : 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  fontSize: '12px',
                                  fontWeight: '600',
                                  opacity: isDeleting ? 0.6 : 1
                                }}
                              >
                                <Trash2 size={13} /> {isDeleting ? '...' : 'Delete'}
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer count */}
        {!loading && subjects.length > 0 && (
          <p style={{ fontSize: '12px', color: '#475569', margin: 0, textAlign: 'center' }}>
            Showing {filtered.length} of {subjects.length} subjects
            {searchQuery && ` matching "${searchQuery}"`}
          </p>
        )}

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
            onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#FFFFFF', margin: 0 }}>
                  Add New VTU Subject
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  style={{ background: 'transparent', border: 'none', color: '#64748B', cursor: 'pointer' }}
                >
                  <X size={20} />
                </button>
              </div>

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
                    style={{ width: '100%', background: '#0B1020', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '10px', color: '#FFF', fontSize: '13px', boxSizing: 'border-box' }}
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
                    style={{ width: '100%', background: '#0B1020', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '10px', color: '#FFF', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 80px', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: '700', color: '#CBD5E1', display: 'block', marginBottom: '4px' }}>Semester</label>
                    <select
                      value={newSubj.semesterId}
                      onChange={(e) => setNewSubj({ ...newSubj, semesterId: Number(e.target.value) })}
                      style={{ width: '100%', background: '#0B1020', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '10px', color: '#FFF', fontSize: '13px' }}
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                        <option key={n} value={n}>Sem {n}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: '700', color: '#CBD5E1', display: 'block', marginBottom: '4px' }}>Department</label>
                    <select
                      value={newSubj.department}
                      onChange={(e) => setNewSubj({ ...newSubj, department: e.target.value })}
                      style={{ width: '100%', background: '#0B1020', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '10px', color: '#FFF', fontSize: '13px' }}
                    >
                      {['CSE', 'ISE', 'ECE', 'ME', 'CE', 'EEE', 'CHE', 'MBA', 'MCA', 'Common'].map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: '700', color: '#CBD5E1', display: 'block', marginBottom: '4px' }}>Credits</label>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={newSubj.credits}
                      onChange={(e) => setNewSubj({ ...newSubj, credits: Number(e.target.value) })}
                      style={{ width: '100%', background: '#0B1020', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '10px', color: '#FFF', fontSize: '13px', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#CBD5E1', display: 'block', marginBottom: '4px' }}>Description</label>
                  <textarea
                    rows={2}
                    value={newSubj.description}
                    onChange={(e) => setNewSubj({ ...newSubj, description: e.target.value })}
                    placeholder="Brief subject overview..."
                    style={{ width: '100%', background: '#0B1020', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '10px', color: '#FFF', fontSize: '13px', resize: 'none', boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#94A3B8', padding: '10px 18px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{ background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)', border: 'none', color: '#FFF', padding: '10px 22px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', fontSize: '13px' }}
                  >
                    Create Subject
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>

      {/* CSS for spinner */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </AdminLayout>
  );
};
