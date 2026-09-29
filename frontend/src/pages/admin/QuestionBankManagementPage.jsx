import React, { useState, useEffect } from 'react';
import { HelpCircle, Plus, Trash2, Search, Edit } from 'lucide-react';
import { api } from '../../services/api';
import { AdminLayout } from './AdminLayout';

export const QuestionBankManagementPage = () => {
  const [qbs, setQbs] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newQb, setNewQb] = useState({
    subjectId: '',
    unit: 1,
    category: '10 Marks',
    difficulty: 'MEDIUM',
    title: '',
    questionText: '',
    solutionGuide: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [qbData, subjs] = await Promise.all([
        api.questionBanks.getAll(),
        api.admin.getSubjects()
      ]);
      setQbs(qbData || []);
      setSubjects(subjs || []);
      if (subjs && subjs.length > 0) {
        setNewQb((prev) => ({ ...prev, subjectId: subjs[0].id }));
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
      const created = await api.admin.createQuestionBank(newQb);
      setQbs((prev) => [...prev, created]);
      setShowModal(false);
      setNewQb({ subjectId: subjects[0]?.id || '', unit: 1, category: '10 Marks', difficulty: 'MEDIUM', title: '', questionText: '', solutionGuide: '' });
    } catch (err) {
      alert(err.message || 'Failed to create question bank entry');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this question bank item?')) return;
    try {
      await api.admin.deleteQuestionBank(id);
      setQbs((prev) => prev.filter((q) => q.id !== id));
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
              Question Bank Repository Management
            </h1>
            <p style={{ fontSize: '13px', color: '#94A3B8', margin: '4px 0 0' }}>
              Author 2-mark, 5-mark, 10-mark, and frequently asked examination questions with marking schemes.
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
            <Plus size={16} /> Add Question Entry
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
                <th style={{ padding: '16px 20px', fontWeight: '700' }}>Question Title & Subject</th>
                <th style={{ padding: '16px 20px', fontWeight: '700' }}>Category</th>
                <th style={{ padding: '16px 20px', fontWeight: '700' }}>Unit</th>
                <th style={{ padding: '16px 20px', fontWeight: '700' }}>Difficulty</th>
                <th style={{ padding: '16px 20px', fontWeight: '700', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: '#94A3B8' }}>Loading question banks...</td>
                </tr>
              ) : qbs.map((q) => (
                <tr key={q.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ fontWeight: '700', color: '#F8FAFC' }}>{q.title}</div>
                    <div style={{ fontSize: '11px', color: '#64748B' }}>{q.subjectCode || '21CS61'}</div>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <span style={{ fontSize: '11px', fontWeight: '800', background: 'rgba(6, 182, 212, 0.15)', color: '#22D3EE', padding: '3px 8px', borderRadius: '4px' }}>
                      {q.category}
                    </span>
                  </td>
                  <td style={{ padding: '16px 20px', color: '#C4B5FD', fontWeight: '700' }}>
                    Unit {q.unit}
                  </td>
                  <td style={{ padding: '16px 20px', color: q.difficulty === 'HARD' ? '#F87171' : '#34D399', fontWeight: '800' }}>
                    {q.difficulty}
                  </td>
                  <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                    <button
                      onClick={() => handleDelete(q.id)}
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
                maxWidth: '520px',
                background: '#0F172A',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                borderRadius: '20px',
                padding: '28px'
              }}
            >
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#FFFFFF', margin: '0 0 16px 0' }}>
                Add Question Bank Item
              </h3>

              <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#CBD5E1', display: 'block', marginBottom: '4px' }}>Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Compare Virtualization vs Containerization"
                    value={newQb.title}
                    onChange={(e) => setNewQb({ ...newQb, title: e.target.value })}
                    style={{ width: '100%', background: '#0B1020', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '10px', color: '#FFF' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: '700', color: '#CBD5E1', display: 'block', marginBottom: '4px' }}>Category</label>
                    <select
                      value={newQb.category}
                      onChange={(e) => setNewQb({ ...newQb, category: e.target.value })}
                      style={{ width: '100%', background: '#0B1020', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '10px', color: '#FFF' }}
                    >
                      <option value="2 Marks">2 Marks</option>
                      <option value="5 Marks">5 Marks</option>
                      <option value="10 Marks">10 Marks</option>
                      <option value="Important">Important</option>
                      <option value="Frequently Asked">Frequently Asked</option>
                      <option value="Programming">Programming</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: '700', color: '#CBD5E1', display: 'block', marginBottom: '4px' }}>Difficulty</label>
                    <select
                      value={newQb.difficulty}
                      onChange={(e) => setNewQb({ ...newQb, difficulty: e.target.value })}
                      style={{ width: '100%', background: '#0B1020', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '10px', color: '#FFF' }}
                    >
                      <option value="EASY">Easy</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HARD">Hard</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: '700', color: '#CBD5E1', display: 'block', marginBottom: '4px' }}>Subject</label>
                    <select
                      value={newQb.subjectId}
                      onChange={(e) => setNewQb({ ...newQb, subjectId: Number(e.target.value) })}
                      style={{ width: '100%', background: '#0B1020', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '10px', color: '#FFF' }}
                    >
                      {subjects.map((sub) => (
                        <option key={sub.id} value={sub.id}>{sub.code} - {sub.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: '700', color: '#CBD5E1', display: 'block', marginBottom: '4px' }}>Unit</label>
                    <select
                      value={newQb.unit}
                      onChange={(e) => setNewQb({ ...newQb, unit: Number(e.target.value) })}
                      style={{ width: '100%', background: '#0B1020', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '10px', color: '#FFF' }}
                    >
                      {[1, 2, 3, 4, 5].map((u) => (
                        <option key={u} value={u}>Unit {u}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#CBD5E1', display: 'block', marginBottom: '4px' }}>Question Details *</label>
                  <textarea
                    rows={3}
                    required
                    value={newQb.questionText}
                    onChange={(e) => setNewQb({ ...newQb, questionText: e.target.value })}
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
                    Save Question
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
