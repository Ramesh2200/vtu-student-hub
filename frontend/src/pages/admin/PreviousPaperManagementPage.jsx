import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Trash2 } from 'lucide-react';
import { api } from '../../services/api';
import { AdminLayout } from './AdminLayout';

export const PreviousPaperManagementPage = () => {
  const [papers, setPapers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newPaper, setNewPaper] = useState({
    subjectId: '',
    title: '',
    examYear: 2025,
    examType: 'REGULAR',
    description: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [pRes, subjs] = await Promise.all([
        api.previousPapers.getAll(),
        api.admin.getSubjects()
      ]);
      setPapers(pRes || []);
      setSubjects(subjs || []);
      if (subjs && subjs.length > 0) {
        setNewPaper((prev) => ({ ...prev, subjectId: subjs[0].id }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const created = await api.admin.createPreviousPaper(newPaper);
      setPapers((prev) => [...prev, created]);
      setShowModal(false);
      setNewPaper({ subjectId: subjects[0]?.id || '', title: '', examYear: 2025, examType: 'REGULAR', description: '' });
    } catch (err) {
      alert(err.message || 'Failed to create question paper record');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this question paper record?')) return;
    try {
      await api.admin.deletePreviousPaper(id);
      setPapers((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert(err.message || 'Delete failed');
    }
  };

  return (
    <AdminLayout>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '900', color: '#F8FAFC', margin: 0 }}>
              Previous Year Papers Management
            </h1>
            <p style={{ fontSize: '13px', color: '#94A3B8', margin: '4px 0 0' }}>
              Upload and index official VTU Semester End Exam (SEE) question papers (2022 - 2025).
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
            <Plus size={16} /> Add Examination Paper
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
                <th style={{ padding: '16px 20px', fontWeight: '700' }}>Paper Title</th>
                <th style={{ padding: '16px 20px', fontWeight: '700' }}>Subject</th>
                <th style={{ padding: '16px 20px', fontWeight: '700' }}>Year & Exam Type</th>
                <th style={{ padding: '16px 20px', fontWeight: '700', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" style={{ padding: '40px', textAlign: 'center', color: '#94A3B8' }}>Loading papers...</td>
                </tr>
              ) : papers.map((p) => (
                <tr key={p.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                  <td style={{ padding: '16px 20px', fontWeight: '700', color: '#F8FAFC' }}>
                    {p.title}
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <span style={{ fontSize: '11px', fontWeight: '800', background: 'rgba(6, 182, 212, 0.15)', color: '#22D3EE', padding: '2px 6px', borderRadius: '4px' }}>
                      {p.subjectCode || '21CS61'}
                    </span>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <span style={{ fontSize: '11px', fontWeight: '800', background: 'rgba(245, 158, 11, 0.2)', color: '#FCD34D', padding: '3px 8px', borderRadius: '6px' }}>
                      {p.examYear} {p.examType}
                    </span>
                  </td>
                  <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                    <button
                      onClick={() => handleDelete(p.id)}
                      style={{ background: 'rgba(239, 68, 68, 0.15)', border: 'none', color: '#F87171', padding: '6px 8px', borderRadius: '6px', cursor: 'pointer' }}
                    >
                      <Trash2 size={14} />
                    </button>
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
                maxWidth: '480px',
                background: '#0F172A',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                borderRadius: '20px',
                padding: '28px'
              }}
            >
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#FFFFFF', margin: '0 0 16px 0' }}>
                Add Previous Year Paper
              </h3>

              <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#CBD5E1', display: 'block', marginBottom: '4px' }}>Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 21CS61 Cloud Computing SEE Question Paper"
                    value={newPaper.title}
                    onChange={(e) => setNewPaper({ ...newPaper, title: e.target.value })}
                    style={{ width: '100%', background: '#0B1020', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '10px', color: '#FFF' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: '700', color: '#CBD5E1', display: 'block', marginBottom: '4px' }}>Exam Year</label>
                    <input
                      type="number"
                      value={newPaper.examYear}
                      onChange={(e) => setNewPaper({ ...newPaper, examYear: Number(e.target.value) })}
                      style={{ width: '100%', background: '#0B1020', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '10px', color: '#FFF' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: '700', color: '#CBD5E1', display: 'block', marginBottom: '4px' }}>Exam Type</label>
                    <select
                      value={newPaper.examType}
                      onChange={(e) => setNewPaper({ ...newPaper, examType: e.target.value })}
                      style={{ width: '100%', background: '#0B1020', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '10px', color: '#FFF' }}
                    >
                      <option value="REGULAR">Regular SEE</option>
                      <option value="SUPPLEMENTARY">Supplementary</option>
                      <option value="SPECIAL">Special SEE</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#CBD5E1', display: 'block', marginBottom: '4px' }}>Subject</label>
                  <select
                    value={newPaper.subjectId}
                    onChange={(e) => setNewPaper({ ...newPaper, subjectId: Number(e.target.value) })}
                    style={{ width: '100%', background: '#0B1020', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '10px', color: '#FFF' }}
                  >
                    {subjects.map((sub) => (
                      <option key={sub.id} value={sub.id}>{sub.code} - {sub.name}</option>
                    ))}
                  </select>
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
                    Save Paper
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
