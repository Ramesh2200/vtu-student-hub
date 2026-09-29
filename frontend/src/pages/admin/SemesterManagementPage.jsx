import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  GraduationCap, Plus, Edit3, Trash2, CheckCircle2, XCircle, 
  BookOpen, Search, Filter, AlertTriangle, ArrowRight, RefreshCw, Layers
} from 'lucide-react';
import { api } from '../../services/api';
import { AdminLayout } from './AdminLayout';

export const SemesterManagementPage = () => {
  const navigate = useNavigate();
  const [semesters, setSemesters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterScheme, setFilterScheme] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    semesterNumber: 1,
    name: '',
    scheme: '2022 Scheme CBCS',
    description: '',
    active: true
  });

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    loadSemesters();
  }, []);

  const showToast = (msg, type = 'success') => {
    setToastMessage({ text: msg, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadSemesters = async () => {
    try {
      setLoading(true);
      let data = [];
      try {
        data = await api.admin.getAllSemesters();
      } catch (e) {
        data = await api.semesters.getAll();
      }
      setSemesters(data || []);
    } catch (err) {
      console.error(err);
      showToast('Failed to load semesters: ' + (err.message || 'Unknown error'), 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setIsEditMode(false);
    setEditingId(null);
    const nextSemNum = semesters.length > 0 
      ? Math.max(...semesters.map(s => s.semesterNumber || 0)) + 1 
      : 1;
    setFormData({
      semesterNumber: nextSemNum <= 8 ? nextSemNum : 1,
      name: `Semester ${nextSemNum <= 8 ? nextSemNum : 1}`,
      scheme: '2022 Scheme CBCS',
      description: '',
      active: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (sem) => {
    setIsEditMode(true);
    setEditingId(sem.id);
    setFormData({
      semesterNumber: sem.semesterNumber,
      name: sem.name,
      scheme: sem.scheme || '2022 Scheme CBCS',
      description: sem.description || '',
      active: sem.active !== false
    });
    setIsModalOpen(true);
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast('Semester name is required', 'error');
      return;
    }

    try {
      setSubmitting(true);
      if (isEditMode) {
        await api.admin.updateSemester(editingId, {
          semesterNumber: Number(formData.semesterNumber),
          name: formData.name.trim(),
          scheme: formData.scheme.trim(),
          description: formData.description.trim(),
          active: Boolean(formData.active)
        });
        showToast(`Semester ${formData.semesterNumber} updated successfully!`);
      } else {
        await api.admin.createSemester({
          semesterNumber: Number(formData.semesterNumber),
          name: formData.name.trim(),
          scheme: formData.scheme.trim(),
          description: formData.description.trim(),
          active: Boolean(formData.active)
        });
        showToast(`Semester ${formData.semesterNumber} created successfully!`);
      }
      setIsModalOpen(false);
      loadSemesters();
    } catch (err) {
      console.error(err);
      showToast(err.message || 'Action failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (sem) => {
    try {
      const newStatus = !sem.active;
      await api.admin.toggleSemesterStatus(sem.id, newStatus);
      showToast(`Semester ${sem.semesterNumber} is now ${newStatus ? 'Active' : 'Inactive'}`);
      setSemesters(prev => prev.map(s => s.id === sem.id ? { ...s, active: newStatus } : s));
    } catch (err) {
      console.error(err);
      showToast('Failed to toggle status: ' + err.message, 'error');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      setSubmitting(true);
      await api.admin.deleteSemester(deleteTarget.id);
      showToast(`Semester ${deleteTarget.semesterNumber} deleted successfully!`);
      setDeleteTarget(null);
      loadSemesters();
    } catch (err) {
      console.error(err);
      showToast('Failed to delete semester: ' + err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Filtering
  const filteredSemesters = semesters.filter(s => {
    const matchesSearch = searchTerm === '' || 
      s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.scheme?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(s.semesterNumber).includes(searchTerm);
    
    const matchesScheme = filterScheme === 'ALL' || s.scheme === filterScheme;
    const matchesStatus = filterStatus === 'ALL' || 
      (filterStatus === 'ACTIVE' && s.active) || 
      (filterStatus === 'INACTIVE' && !s.active);

    return matchesSearch && matchesScheme && matchesStatus;
  });

  const totalSemesters = semesters.length;
  const activeSemesters = semesters.filter(s => s.active).length;
  const inactiveSemesters = totalSemesters - activeSemesters;
  const totalSubjects = semesters.reduce((acc, s) => acc + (s.subjectCount || 0), 0);
  const schemesList = Array.from(new Set(semesters.map(s => s.scheme).filter(Boolean)));

  return (
    <AdminLayout>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Toast alert */}
        {toastMessage && (
          <div style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 9999,
            backgroundColor: toastMessage.type === 'error' ? '#EF4444' : '#10B981',
            color: '#FFFFFF',
            padding: '12px 20px',
            borderRadius: '12px',
            fontWeight: 700,
            fontSize: '14px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            {toastMessage.type === 'error' ? <AlertTriangle size={18} /> : <CheckCircle2 size={18} />}
            {toastMessage.text}
          </div>
        )}

        {/* Page Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                <GraduationCap size={22} />
              </div>
              <div>
                <h1 style={{ fontSize: '24px', fontWeight: '900', color: 'var(--text-main, #F8FAFC)', margin: 0 }}>
                  Semester Curriculum Management
                </h1>
                <p style={{ fontSize: '13px', color: 'var(--text-muted, #94A3B8)', margin: '2px 0 0' }}>
                  Manage VTU Semesters 1 through 8, CBCS schemes, syllabus descriptors, and subject associations.
                </p>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={loadSemesters}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid var(--border-color, rgba(255, 255, 255, 0.1))',
                color: 'var(--text-main, #F8FAFC)',
                padding: '10px 16px',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
              title="Refresh list"
            >
              <RefreshCw size={15} className={loading ? 'animate-spin' : ''} /> Refresh
            </button>

            <button
              onClick={handleOpenAddModal}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                color: '#FFFFFF',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(239, 68, 68, 0.4)'
              }}
            >
              <Plus size={16} /> Add New Semester
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          <div style={{
            background: 'var(--dark-card, rgba(15, 23, 42, 0.65))',
            border: '1px solid var(--border-color, rgba(255, 255, 255, 0.08))',
            borderRadius: '16px',
            padding: '18px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px'
          }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.15)', color: '#818CF8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Layers size={22} />
            </div>
            <div>
              <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted, #94A3B8)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Semesters</div>
              <div style={{ fontSize: '22px', fontWeight: '900', color: 'var(--text-main, #F8FAFC)' }}>{totalSemesters}</div>
            </div>
          </div>

          <div style={{
            background: 'var(--dark-card, rgba(15, 23, 42, 0.65))',
            border: '1px solid var(--border-color, rgba(255, 255, 255, 0.08))',
            borderRadius: '16px',
            padding: '18px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px'
          }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', color: '#34D399', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle2 size={22} />
            </div>
            <div>
              <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted, #94A3B8)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Active in Portal</div>
              <div style={{ fontSize: '22px', fontWeight: '900', color: '#10B981' }}>{activeSemesters}</div>
            </div>
          </div>

          <div style={{
            background: 'var(--dark-card, rgba(15, 23, 42, 0.65))',
            border: '1px solid var(--border-color, rgba(255, 255, 255, 0.08))',
            borderRadius: '16px',
            padding: '18px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px'
          }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.15)', color: '#F87171', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <XCircle size={22} />
            </div>
            <div>
              <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted, #94A3B8)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Inactive / Hidden</div>
              <div style={{ fontSize: '22px', fontWeight: '900', color: inactiveSemesters > 0 ? '#EF4444' : 'var(--text-main, #F8FAFC)' }}>{inactiveSemesters}</div>
            </div>
          </div>

          <div style={{
            background: 'var(--dark-card, rgba(15, 23, 42, 0.65))',
            border: '1px solid var(--border-color, rgba(255, 255, 255, 0.08))',
            borderRadius: '16px',
            padding: '18px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px'
          }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BookOpen size={22} />
            </div>
            <div>
              <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted, #94A3B8)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Curriculum Subjects</div>
              <div style={{ fontSize: '22px', fontWeight: '900', color: 'var(--text-main, #F8FAFC)' }}>{totalSubjects}</div>
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div style={{
          display: 'flex',
          gap: '12px',
          flexWrap: 'wrap',
          alignItems: 'center',
          background: 'var(--dark-card, rgba(15, 23, 42, 0.65))',
          padding: '14px 18px',
          borderRadius: '14px',
          border: '1px solid var(--border-color, rgba(255, 255, 255, 0.08))'
        }}>
          <div style={{ position: 'relative', flex: '1', minWidth: '240px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
            <input
              type="text"
              placeholder="Search by semester number, title, scheme..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px 9px 36px',
                background: 'rgba(0, 0, 0, 0.25)',
                border: '1px solid var(--border-color, rgba(255, 255, 255, 0.1))',
                borderRadius: '8px',
                color: 'var(--text-main, #F8FAFC)',
                fontSize: '13px',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <select
              value={filterScheme}
              onChange={(e) => setFilterScheme(e.target.value)}
              style={{
                padding: '9px 12px',
                background: 'rgba(0, 0, 0, 0.25)',
                border: '1px solid var(--border-color, rgba(255, 255, 255, 0.1))',
                borderRadius: '8px',
                color: 'var(--text-main, #F8FAFC)',
                fontSize: '13px',
                outline: 'none'
              }}
            >
              <option value="ALL">All Schemes</option>
              {schemesList.map(scheme => (
                <option key={scheme} value={scheme}>{scheme}</option>
              ))}
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{
                padding: '9px 12px',
                background: 'rgba(0, 0, 0, 0.25)',
                border: '1px solid var(--border-color, rgba(255, 255, 255, 0.1))',
                borderRadius: '8px',
                color: 'var(--text-main, #F8FAFC)',
                fontSize: '13px',
                outline: 'none'
              }}
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active Only</option>
              <option value="INACTIVE">Inactive Only</option>
            </select>
          </div>
        </div>

        {/* Semesters Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted, #94A3B8)' }}>
            <RefreshCw size={32} className="animate-spin" style={{ margin: '0 auto 12px', opacity: 0.6 }} />
            <div>Loading semester modules...</div>
          </div>
        ) : filteredSemesters.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            background: 'var(--dark-card, rgba(15, 23, 42, 0.65))',
            borderRadius: '16px',
            border: '1px dashed var(--border-color, rgba(255, 255, 255, 0.1))',
            color: 'var(--text-muted, #94A3B8)'
          }}>
            <GraduationCap size={44} style={{ opacity: 0.4, margin: '0 auto 12px' }} />
            <div style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-main, #F8FAFC)' }}>No Semesters Found</div>
            <p style={{ fontSize: '13px', margin: '6px 0 16px' }}>Try adjusting your search criteria or create a new semester.</p>
            <button
              onClick={handleOpenAddModal}
              style={{
                background: '#EF4444',
                color: '#fff',
                border: 'none',
                padding: '8px 18px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              + Add Semester
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
            {filteredSemesters.map((s) => (
              <div
                key={s.id}
                style={{
                  background: 'var(--dark-card, rgba(15, 23, 42, 0.65))',
                  border: s.active 
                    ? '1px solid var(--border-color, rgba(255, 255, 255, 0.08))' 
                    : '1px solid rgba(239, 68, 68, 0.2)',
                  borderRadius: '16px',
                  padding: '22px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.12)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  opacity: s.active ? 1 : 0.82
                }}
              >
                <div>
                  {/* Top Bar: Semester Badge & Active Switch */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '10px',
                        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.2))',
                        border: '1px solid rgba(99, 102, 241, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: '900',
                        fontSize: '16px',
                        color: '#A5B4FC'
                      }}>
                        {s.semesterNumber}
                      </div>
                      <div>
                        <div style={{ fontSize: '17px', fontWeight: '900', color: 'var(--text-main, #FFFFFF)' }}>
                          {s.name || `Semester ${s.semesterNumber}`}
                        </div>
                        <div style={{ fontSize: '11px', fontWeight: '700', color: '#38BDF8', letterSpacing: '0.3px' }}>
                          {s.scheme}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleToggleStatus(s)}
                      style={{
                        fontSize: '11px',
                        fontWeight: '800',
                        background: s.active ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                        color: s.active ? '#34D399' : '#F87171',
                        border: s.active ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
                        padding: '4px 10px',
                        borderRadius: '20px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}
                      title="Click to toggle active status"
                    >
                      <span style={{
                        width: '7px',
                        height: '7px',
                        borderRadius: '50%',
                        backgroundColor: s.active ? '#10B981' : '#EF4444'
                      }} />
                      {s.active ? 'ACTIVE' : 'INACTIVE'}
                    </button>
                  </div>

                  {/* Description */}
                  <p style={{
                    fontSize: '13px',
                    color: 'var(--text-muted, #94A3B8)',
                    margin: '0 0 16px',
                    lineHeight: 1.6,
                    minHeight: '42px',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {s.description || 'Full academic syllabus, CBCS credits scheme, modules, and VTU reference books.'}
                  </p>
                </div>

                {/* Footer and Actions */}
                <div style={{
                  paddingTop: '16px',
                  borderTop: '1px solid var(--border-color, rgba(255, 255, 255, 0.08))',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-muted, #94A3B8)' }}>
                      <BookOpen size={14} style={{ color: '#38BDF8' }} />
                      <span style={{ fontWeight: '700', color: 'var(--text-main, #F8FAFC)' }}>{s.subjectCount || 0}</span> subjects registered
                    </div>

                    <button
                      onClick={() => navigate(`/admin/subjects?semesterId=${s.id}`)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '12px',
                        fontWeight: '700',
                        color: '#818CF8',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0
                      }}
                    >
                      Manage Subjects <ArrowRight size={13} />
                    </button>
                  </div>

                  {/* Card Actions */}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handleOpenEditModal(s)}
                      style={{
                        flex: 1,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        background: 'rgba(255, 255, 255, 0.06)',
                        border: '1px solid var(--border-color, rgba(255, 255, 255, 0.1))',
                        color: 'var(--text-main, #F8FAFC)',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      <Edit3 size={14} /> Edit
                    </button>

                    <button
                      onClick={() => setDeleteTarget(s)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.25)',
                        color: '#EF4444',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                      title="Delete Semester"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal: Add or Edit Semester */}
        {isModalOpen && (
          <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px'
          }}>
            <div style={{
              background: 'var(--dark-card, #0F172A)',
              border: '1px solid var(--border-color, rgba(255, 255, 255, 0.12))',
              borderRadius: '20px',
              padding: '28px',
              maxWidth: '520px',
              width: '100%',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '19px', fontWeight: '900', color: 'var(--text-main, #FFFFFF)', margin: 0 }}>
                  {isEditMode ? 'Edit Semester' : 'Add New Semester'}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-muted, #94A3B8)',
                    fontSize: '20px',
                    cursor: 'pointer'
                  }}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmitForm} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text-muted, #94A3B8)', marginBottom: '6px' }}>
                    Semester Number (1 - 8)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    required
                    value={formData.semesterNumber}
                    onChange={(e) => setFormData({ ...formData, semesterNumber: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      background: 'rgba(0, 0, 0, 0.25)',
                      border: '1px solid var(--border-color, rgba(255, 255, 255, 0.12))',
                      borderRadius: '8px',
                      color: 'var(--text-main, #FFFFFF)',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text-muted, #94A3B8)', marginBottom: '6px' }}>
                    Semester Name / Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Semester 3 - Second Year B.E."
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      background: 'rgba(0, 0, 0, 0.25)',
                      border: '1px solid var(--border-color, rgba(255, 255, 255, 0.12))',
                      borderRadius: '8px',
                      color: 'var(--text-main, #FFFFFF)',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text-muted, #94A3B8)', marginBottom: '6px' }}>
                    VTU Scheme
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2022 Scheme CBCS / NEP 2024"
                    value={formData.scheme}
                    onChange={(e) => setFormData({ ...formData, scheme: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      background: 'rgba(0, 0, 0, 0.25)',
                      border: '1px solid var(--border-color, rgba(255, 255, 255, 0.12))',
                      borderRadius: '8px',
                      color: 'var(--text-main, #FFFFFF)',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text-muted, #94A3B8)', marginBottom: '6px' }}>
                    Curriculum Description / Overview
                  </label>
                  <textarea
                    rows="3"
                    placeholder="Brief description of subjects, core branches, syllabus requirements..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      background: 'rgba(0, 0, 0, 0.25)',
                      border: '1px solid var(--border-color, rgba(255, 255, 255, 0.12))',
                      borderRadius: '8px',
                      color: 'var(--text-main, #FFFFFF)',
                      fontSize: '14px',
                      outline: 'none',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
                  <input
                    type="checkbox"
                    id="semActive"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <label htmlFor="semActive" style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-main, #F8FAFC)', cursor: 'pointer' }}>
                    Visible & Active on Student Portal
                  </label>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    style={{
                      flex: 1,
                      padding: '11px',
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid var(--border-color, rgba(255, 255, 255, 0.1))',
                      color: 'var(--text-main, #F8FAFC)',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={submitting}
                    style={{
                      flex: 1,
                      padding: '11px',
                      background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                      border: 'none',
                      color: '#FFFFFF',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: '700',
                      cursor: submitting ? 'not-allowed' : 'pointer',
                      opacity: submitting ? 0.7 : 1
                    }}
                  >
                    {submitting ? 'Saving...' : (isEditMode ? 'Save Changes' : 'Create Semester')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Delete Confirmation */}
        {deleteTarget && (
          <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px'
          }}>
            <div style={{
              background: 'var(--dark-card, #0F172A)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '20px',
              padding: '28px',
              maxWidth: '460px',
              width: '100%',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)'
            }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.15)', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <AlertTriangle size={26} />
              </div>

              <h2 style={{ fontSize: '18px', fontWeight: '900', color: 'var(--text-main, #FFFFFF)', margin: '0 0 8px', textAlign: 'center' }}>
                Delete Semester {deleteTarget.semesterNumber}?
              </h2>

              <p style={{ fontSize: '13px', color: 'var(--text-muted, #94A3B8)', lineHeight: 1.6, textAlign: 'center', margin: '0 0 20px' }}>
                Are you sure you want to permanently delete <strong>{deleteTarget.name}</strong>? 
                This action will delete all mapped subjects, uploaded notes, and student resources associated with this semester.
              </p>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setDeleteTarget(null)}
                  style={{
                    flex: 1,
                    padding: '11px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid var(--border-color, rgba(255, 255, 255, 0.1))',
                    color: 'var(--text-main, #F8FAFC)',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={submitting}
                  onClick={handleConfirmDelete}
                  style={{
                    flex: 1,
                    padding: '11px',
                    background: '#EF4444',
                    border: 'none',
                    color: '#FFFFFF',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: '700',
                    cursor: submitting ? 'not-allowed' : 'pointer'
                  }}
                >
                  {submitting ? 'Deleting...' : 'Confirm Delete'}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
};
