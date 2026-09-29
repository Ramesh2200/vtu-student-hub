import React, { useState, useEffect, useRef } from 'react';
import {
  HelpCircle,
  Plus,
  Trash2,
  Search,
  Upload,
  FileText,
  Eye,
  Download,
  CheckCircle,
  AlertCircle,
  X,
  Filter,
  Layers,
  BookOpen,
  Sparkles
} from 'lucide-react';
import { api } from '../../services/api';
import { AdminLayout } from './AdminLayout';

export const QuestionBankManagementPage = () => {
  const [qbs, setQbs] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedUnit, setSelectedUnit] = useState('ALL');

  // Modal & Upload State
  const [showModal, setShowModal] = useState(false);
  const [uploadMode, setUploadMode] = useState('pdf'); // 'pdf' | 'text'
  const [submitting, setSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null); // { type: 'success'|'error', text: '' }
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  // Form State
  const [form, setForm] = useState({
    title: '',
    subjectId: '',
    semesterId: 1,
    unit: 1,
    category: 'Important',
    difficulty: 'MEDIUM',
    answerText: '',
    file: null
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [qbData, subjsData, semsData] = await Promise.allSettled([
        api.questionBanks.getAll(),
        api.admin.getSubjects(),
        api.semesters.getAll()
      ]);

      if (qbData.status === 'fulfilled' && Array.isArray(qbData.value)) {
        setQbs(qbData.value);
      }
      if (subjsData.status === 'fulfilled' && Array.isArray(subjsData.value)) {
        setSubjects(subjsData.value);
        if (subjsData.value.length > 0) {
          setForm((prev) => ({
            ...prev,
            subjectId: subjsData.value[0].id,
            semesterId: subjsData.value[0].semesterId || 1
          }));
        }
      }
      if (semsData.status === 'fulfilled' && Array.isArray(semsData.value)) {
        setSemesters(semsData.value);
      }
    } catch (err) {
      console.error('Failed to load question banks data:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      title: '',
      subjectId: subjects[0]?.id || '',
      semesterId: subjects[0]?.semesterId || 1,
      unit: 1,
      category: 'Important',
      difficulty: 'MEDIUM',
      answerText: '',
      file: null
    });
    setStatusMsg(null);
    setDragOver(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  const handleSubjectChange = (subjId) => {
    const sId = Number(subjId);
    const matched = subjects.find((s) => s.id === sId);
    setForm((prev) => ({
      ...prev,
      subjectId: sId,
      semesterId: matched?.semesterId || prev.semesterId
    }));
  };

  const handleFileSelect = (file) => {
    if (!file) return;
    if (file.type !== 'application/pdf') {
      setStatusMsg({ type: 'error', text: 'Only PDF documents (.pdf) are allowed.' });
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      setStatusMsg({ type: 'error', text: 'File size exceeds 25 MB limit.' });
      return;
    }
    setStatusMsg(null);
    const autoTitle = file.name.replace(/\.pdf$/i, '').replace(/[-_]/g, ' ');
    setForm((prev) => ({
      ...prev,
      file,
      title: prev.title || autoTitle
    }));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (uploadMode === 'pdf' && !form.file) {
      setStatusMsg({ type: 'error', text: 'Please select a Question Bank PDF document.' });
      return;
    }
    if (!form.title.trim()) {
      setStatusMsg({ type: 'error', text: 'Question title or document name is required.' });
      return;
    }

    setSubmitting(true);
    setStatusMsg(null);

    try {
      let created;
      if (uploadMode === 'pdf' && form.file) {
        const fd = new FormData();
        fd.append('file', form.file);
        fd.append('title', form.title.trim());
        fd.append('questionText', form.title.trim());
        fd.append('subjectId', form.subjectId);
        fd.append('semesterId', form.semesterId);
        fd.append('unit', form.unit);
        fd.append('category', form.category);
        fd.append('difficulty', form.difficulty);
        if (form.answerText.trim()) {
          fd.append('answerText', form.answerText.trim());
        }
        created = await api.admin.uploadQuestionBankPdf(fd);
      } else {
        created = await api.admin.createQuestionBank({
          title: form.title.trim(),
          questionText: form.title.trim(),
          subjectId: Number(form.subjectId),
          semesterId: Number(form.semesterId),
          unit: Number(form.unit),
          category: form.category,
          difficulty: form.difficulty,
          answerText: form.answerText.trim() || null
        });
      }

      setQbs((prev) => [created, ...prev]);
      setStatusMsg({ type: 'success', text: `"${form.title}" added to Question Banks!` });
      setTimeout(closeModal, 1400);
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message || 'Operation failed. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete question bank "${title || 'item'}"? This action cannot be undone.`)) return;
    try {
      await api.admin.deleteQuestionBank(id);
      setQbs((prev) => prev.filter((q) => q.id !== id));
    } catch (err) {
      alert(err.message || 'Failed to delete question bank item');
    }
  };

  // Filtered Question Banks
  const filteredQbs = qbs.filter((q) => {
    const qLower = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      (q.title && q.title.toLowerCase().includes(qLower)) ||
      (q.questionText && q.questionText.toLowerCase().includes(qLower)) ||
      (q.subjectCode && q.subjectCode.toLowerCase().includes(qLower)) ||
      (q.subjectName && q.subjectName.toLowerCase().includes(qLower));

    const matchesSubject = selectedSubject === 'ALL' || String(q.subjectId) === String(selectedSubject);
    const matchesCategory = selectedCategory === 'ALL' || q.category === selectedCategory;
    const matchesUnit = selectedUnit === 'ALL' || String(q.unit) === String(selectedUnit);

    return matchesSearch && matchesSubject && matchesCategory && matchesUnit;
  });

  const pdfCount = qbs.filter((q) => q.filePath || q.fileName).length;

  return (
    <AdminLayout>
      <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ background: 'rgba(239, 68, 68, 0.15)', padding: '8px', borderRadius: '10px', color: '#EF4444' }}>
                <HelpCircle size={22} />
              </div>
              <h1 style={{ fontSize: '24px', fontWeight: '900', color: '#F8FAFC', margin: 0 }}>
                Question Bank Repository Management
              </h1>
            </div>
            <p style={{ fontSize: '13px', color: '#94A3B8', margin: '6px 0 0' }}>
              Upload official VTU Question Bank PDF documents, 2-mark, 5-mark, and 10-mark module questions with verified solutions.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              onClick={() => {
                setUploadMode('pdf');
                setShowModal(true);
              }}
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
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(239, 68, 68, 0.3)'
              }}
            >
              <Upload size={16} /> Upload Question Bank PDF
            </button>

            <button
              onClick={() => {
                setUploadMode('text');
                setShowModal(true);
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#F8FAFC',
                padding: '10px 18px',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              <Plus size={16} /> Add Q&A Entry
            </button>
          </div>
        </div>

        {/* Quick Stats Banner */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
          <div style={{ background: 'rgba(15, 23, 42, 0.65)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '14px', padding: '16px 20px' }}>
            <div style={{ fontSize: '12px', color: '#94A3B8', fontWeight: '600' }}>Total Question Banks</div>
            <div style={{ fontSize: '24px', fontWeight: '900', color: '#F8FAFC', marginTop: '4px' }}>{qbs.length}</div>
          </div>
          <div style={{ background: 'rgba(15, 23, 42, 0.65)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '14px', padding: '16px 20px' }}>
            <div style={{ fontSize: '12px', color: '#94A3B8', fontWeight: '600' }}>PDF Documents Attached</div>
            <div style={{ fontSize: '24px', fontWeight: '900', color: '#34D399', marginTop: '4px' }}>{pdfCount}</div>
          </div>
          <div style={{ background: 'rgba(15, 23, 42, 0.65)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '14px', padding: '16px 20px' }}>
            <div style={{ fontSize: '12px', color: '#94A3B8', fontWeight: '600' }}>Subjects Covered</div>
            <div style={{ fontSize: '24px', fontWeight: '900', color: '#60A5FA', marginTop: '4px' }}>
              {new Set(qbs.map((q) => q.subjectId)).size}
            </div>
          </div>
          <div style={{ background: 'rgba(15, 23, 42, 0.65)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '14px', padding: '16px 20px' }}>
            <div style={{ fontSize: '12px', color: '#94A3B8', fontWeight: '600' }}>Active Scheme</div>
            <div style={{ fontSize: '18px', fontWeight: '800', color: '#F59E0B', marginTop: '8px' }}>2022 CBCS</div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.65)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '14px',
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}
        >
          {/* Search */}
          <div style={{ position: 'relative', flex: '1', minWidth: '240px' }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search question bank title, topic, or subject code..."
              style={{
                width: '100%',
                background: 'rgba(11, 16, 32, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                padding: '9px 12px 9px 34px',
                color: '#FFF',
                fontSize: '13px',
                outline: 'none'
              }}
            />
            <Search size={14} color="#94A3B8" style={{ position: 'absolute', left: '11px', top: '11px' }} />
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {/* Subject Select */}
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              style={{
                background: '#0B1020',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                padding: '9px 12px',
                color: '#FFF',
                fontSize: '12px',
                outline: 'none'
              }}
            >
              <option value="ALL">All Subjects</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.code || s.subjectCode} — {s.name || s.subjectName}
                </option>
              ))}
            </select>

            {/* Category Select */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                background: '#0B1020',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                padding: '9px 12px',
                color: '#FFF',
                fontSize: '12px',
                outline: 'none'
              }}
            >
              <option value="ALL">All Categories</option>
              <option value="Important">Important</option>
              <option value="10 Marks">10 Marks</option>
              <option value="5 Marks">5 Marks</option>
              <option value="2 Marks">2 Marks</option>
              <option value="Frequently Asked">Frequently Asked</option>
              <option value="Model Paper">Model Paper</option>
              <option value="Programming">Programming</option>
            </select>

            {/* Unit Select */}
            <select
              value={selectedUnit}
              onChange={(e) => setSelectedUnit(e.target.value)}
              style={{
                background: '#0B1020',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                padding: '9px 12px',
                color: '#FFF',
                fontSize: '12px',
                outline: 'none'
              }}
            >
              <option value="ALL">All Modules</option>
              {[1, 2, 3, 4, 5].map((u) => (
                <option key={u} value={u}>Module / Unit {u}</option>
              ))}
            </select>
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
                <th style={{ padding: '16px 20px', fontWeight: '700' }}>Question Bank & Subject</th>
                <th style={{ padding: '16px 20px', fontWeight: '700' }}>Category</th>
                <th style={{ padding: '16px 20px', fontWeight: '700' }}>Module / Unit</th>
                <th style={{ padding: '16px 20px', fontWeight: '700' }}>Difficulty</th>
                <th style={{ padding: '16px 20px', fontWeight: '700' }}>Document</th>
                <th style={{ padding: '16px 20px', fontWeight: '700', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ padding: '48px', textAlign: 'center', color: '#94A3B8' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '16px', height: '16px', border: '2px solid #EF4444', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                      Loading question banks...
                    </div>
                  </td>
                </tr>
              ) : filteredQbs.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ padding: '48px', textAlign: 'center', color: '#94A3B8' }}>
                    <HelpCircle size={32} style={{ margin: '0 auto 8px', opacity: 0.4, display: 'block' }} />
                    No question bank items found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredQbs.map((q) => {
                  const hasPdf = Boolean(q.filePath || q.fileName);
                  const isHard = q.difficulty === 'HARD';
                  const isEasy = q.difficulty === 'EASY';

                  return (
                    <tr key={q.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                      {/* Title & Subject */}
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ fontWeight: '700', color: '#F8FAFC', fontSize: '13px', lineHeight: '1.4' }}>
                          {q.title || q.questionText}
                        </div>
                        <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '3px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ color: '#EF4444', fontWeight: '700' }}>{q.subjectCode || 'VTU'}</span>
                          <span>•</span>
                          <span>{q.subjectName || 'Core Subject'}</span>
                          {q.semesterNumber && (
                            <>
                              <span>•</span>
                              <span>Sem {q.semesterNumber}</span>
                            </>
                          )}
                        </div>
                      </td>

                      {/* Category */}
                      <td style={{ padding: '16px 20px' }}>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: '800',
                            background:
                              q.category === '10 Marks' ? 'rgba(167, 139, 250, 0.15)' :
                              q.category === 'Important' ? 'rgba(245, 158, 11, 0.15)' :
                              'rgba(6, 182, 212, 0.15)',
                            color:
                              q.category === '10 Marks' ? '#C4B5FD' :
                              q.category === 'Important' ? '#FBBF24' :
                              '#22D3EE',
                            padding: '3px 8px',
                            borderRadius: '5px'
                          }}
                        >
                          {q.category}
                        </span>
                      </td>

                      {/* Module / Unit */}
                      <td style={{ padding: '16px 20px' }}>
                        <span style={{ fontSize: '12px', fontWeight: '700', color: '#CBD5E1', background: 'rgba(255,255,255,0.05)', padding: '3px 8px', borderRadius: '4px' }}>
                          Module {q.unit || 1}
                        </span>
                      </td>

                      {/* Difficulty */}
                      <td style={{ padding: '16px 20px' }}>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: '800',
                            color: isHard ? '#F87171' : isEasy ? '#34D399' : '#FBBF24'
                          }}
                        >
                          {q.difficulty || 'MEDIUM'}
                        </span>
                      </td>

                      {/* Document PDF Status */}
                      <td style={{ padding: '16px 20px' }}>
                        {hasPdf ? (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              background: 'rgba(52, 211, 153, 0.12)',
                              color: '#34D399',
                              border: '1px solid rgba(52, 211, 153, 0.25)',
                              fontSize: '11px',
                              fontWeight: '700',
                              padding: '3px 8px',
                              borderRadius: '6px'
                            }}
                          >
                            <FileText size={11} /> PDF Document
                          </span>
                        ) : (
                          <span style={{ fontSize: '11px', color: '#64748B' }}>Text Q&A</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px', alignItems: 'center' }}>
                          {/* View PDF */}
                          <a
                            href={api.questionBanks.getViewUrl(q.id)}
                            target="_blank"
                            rel="noreferrer"
                            title="Preview Question Bank PDF"
                            style={{
                              background: 'rgba(59, 130, 246, 0.12)',
                              border: '1px solid rgba(59, 130, 246, 0.25)',
                              color: '#60A5FA',
                              padding: '6px 8px',
                              borderRadius: '6px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              textDecoration: 'none'
                            }}
                          >
                            <Eye size={13} />
                          </a>

                          {/* Download PDF */}
                          <button
                            onClick={() => api.questionBanks.download(q.id, q.title || q.questionText)}
                            title="Download PDF Document"
                            style={{
                              background: 'rgba(52, 211, 153, 0.12)',
                              border: '1px solid rgba(52, 211, 153, 0.25)',
                              color: '#34D399',
                              padding: '6px 8px',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center'
                            }}
                          >
                            <Download size={13} />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => handleDelete(q.id, q.title || q.questionText)}
                            title="Delete Question Bank Entry"
                            style={{
                              background: 'rgba(239, 68, 68, 0.12)',
                              border: '1px solid rgba(239, 68, 68, 0.25)',
                              color: '#F87171',
                              padding: '6px 8px',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center'
                            }}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* MODAL: UPLOAD QUESTION BANK PDF / ADD QUESTION */}
        {showModal && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(4px)',
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
                maxWidth: '560px',
                background: '#0F172A',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                borderRadius: '20px',
                padding: '28px',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
                maxHeight: '90vh',
                overflowY: 'auto'
              }}
            >
              {/* Modal Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#FFFFFF', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <HelpCircle size={18} color="#EF4444" />
                  {uploadMode === 'pdf' ? 'Upload Question Bank PDF' : 'Add Question Bank Entry'}
                </h3>
                <button
                  type="button"
                  onClick={closeModal}
                  style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '4px' }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Mode Switcher Tabs */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '6px',
                  background: '#0B1020',
                  padding: '4px',
                  borderRadius: '10px',
                  marginBottom: '18px'
                }}
              >
                <button
                  type="button"
                  onClick={() => setUploadMode('pdf')}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '12px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    background: uploadMode === 'pdf' ? 'linear-gradient(135deg, #EF4444, #DC2626)' : 'transparent',
                    color: uploadMode === 'pdf' ? '#FFF' : '#94A3B8'
                  }}
                >
                  <Upload size={13} /> PDF Upload Mode
                </button>
                <button
                  type="button"
                  onClick={() => setUploadMode('text')}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '12px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    background: uploadMode === 'text' ? 'linear-gradient(135deg, #EF4444, #DC2626)' : 'transparent',
                    color: uploadMode === 'text' ? '#FFF' : '#94A3B8'
                  }}
                >
                  <FileText size={13} /> Text Q&A Mode
                </button>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {/* Drag & Drop PDF Dropzone */}
                {uploadMode === 'pdf' && (
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: '700', color: '#CBD5E1', display: 'block', marginBottom: '6px' }}>
                      Question Bank PDF Document *
                    </label>
                    <div
                      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                      onDragLeave={() => setDragOver(false)}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      style={{
                        border: `2px dashed ${dragOver ? '#EF4444' : form.file ? '#34D399' : 'rgba(255,255,255,0.15)'}`,
                        borderRadius: '12px',
                        padding: '24px 16px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        background: dragOver ? 'rgba(239, 68, 68, 0.08)' : form.file ? 'rgba(52, 211, 153, 0.06)' : '#0B1020',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="application/pdf"
                        style={{ display: 'none' }}
                        onChange={(e) => handleFileSelect(e.target.files?.[0])}
                      />
                      {form.file ? (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                          <FileText size={28} color="#34D399" />
                          <div style={{ textAlign: 'left' }}>
                            <div style={{ fontWeight: '700', color: '#F8FAFC', fontSize: '13px' }}>{form.file.name}</div>
                            <div style={{ fontSize: '11px', color: '#34D399' }}>
                              {(form.file.size / (1024 * 1024)).toFixed(2)} MB • Ready to upload
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <Upload size={28} color="#EF4444" style={{ margin: '0 auto 8px', display: 'block' }} />
                          <div style={{ fontSize: '13px', fontWeight: '700', color: '#F8FAFC' }}>
                            Click to select or drag & drop VTU Question Bank PDF
                          </div>
                          <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '4px' }}>
                            Max file size: 25 MB • Official PDF only
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Title */}
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#CBD5E1', display: 'block', marginBottom: '4px' }}>
                    {uploadMode === 'pdf' ? 'Question Bank Title / Document Name *' : 'Question Title / Topic *'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 21CS61 Unit 1-5 Important 10-Mark Question Bank with Solutions"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    style={{
                      width: '100%',
                      background: '#0B1020',
                      border: '1px solid rgba(255,255,255,0.12)',
                      borderRadius: '8px',
                      padding: '10px 12px',
                      color: '#FFF',
                      fontSize: '13px'
                    }}
                  />
                </div>

                {/* Subject & Semester */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: '700', color: '#CBD5E1', display: 'block', marginBottom: '4px' }}>Subject *</label>
                    <select
                      value={form.subjectId}
                      onChange={(e) => handleSubjectChange(e.target.value)}
                      style={{
                        width: '100%',
                        background: '#0B1020',
                        border: '1px solid rgba(255,255,255,0.12)',
                        borderRadius: '8px',
                        padding: '10px 12px',
                        color: '#FFF',
                        fontSize: '13px'
                      }}
                    >
                      {subjects.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.code || s.subjectCode} — {s.name || s.subjectName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: '700', color: '#CBD5E1', display: 'block', marginBottom: '4px' }}>Semester *</label>
                    <select
                      value={form.semesterId}
                      onChange={(e) => setForm({ ...form, semesterId: Number(e.target.value) })}
                      style={{
                        width: '100%',
                        background: '#0B1020',
                        border: '1px solid rgba(255,255,255,0.12)',
                        borderRadius: '8px',
                        padding: '10px 12px',
                        color: '#FFF',
                        fontSize: '13px'
                      }}
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                        <option key={s} value={s}>Semester {s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Unit, Category & Difficulty */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: '700', color: '#CBD5E1', display: 'block', marginBottom: '4px' }}>Module / Unit</label>
                    <select
                      value={form.unit}
                      onChange={(e) => setForm({ ...form, unit: Number(e.target.value) })}
                      style={{ width: '100%', background: '#0B1020', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '10px 12px', color: '#FFF', fontSize: '13px' }}
                    >
                      {[1, 2, 3, 4, 5].map((u) => (
                        <option key={u} value={u}>Module {u}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: '700', color: '#CBD5E1', display: 'block', marginBottom: '4px' }}>Category</label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      style={{ width: '100%', background: '#0B1020', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '10px 12px', color: '#FFF', fontSize: '13px' }}
                    >
                      <option value="Important">Important</option>
                      <option value="10 Marks">10 Marks</option>
                      <option value="5 Marks">5 Marks</option>
                      <option value="2 Marks">2 Marks</option>
                      <option value="Frequently Asked">Frequently Asked</option>
                      <option value="Model Paper">Model Paper</option>
                      <option value="Programming">Programming</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: '700', color: '#CBD5E1', display: 'block', marginBottom: '4px' }}>Difficulty</label>
                    <select
                      value={form.difficulty}
                      onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
                      style={{ width: '100%', background: '#0B1020', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '10px 12px', color: '#FFF', fontSize: '13px' }}
                    >
                      <option value="EASY">Easy</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HARD">Hard</option>
                    </select>
                  </div>
                </div>

                {/* Solution Guide / Description */}
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#CBD5E1', display: 'block', marginBottom: '4px' }}>
                    {uploadMode === 'pdf' ? 'Overview / Solution Highlights (Optional)' : 'Solution Guide / Key Formulae *'}
                  </label>
                  <textarea
                    rows={uploadMode === 'pdf' ? 2 : 4}
                    required={uploadMode === 'text'}
                    placeholder={uploadMode === 'pdf' ? 'e.g. Includes VTU marking scheme, derivations, and solved 2023 numericals' : 'Step-by-step solution, VTU scheme breakdown, diagrams...'}
                    value={form.answerText}
                    onChange={(e) => setForm({ ...form, answerText: e.target.value })}
                    style={{
                      width: '100%',
                      background: '#0B1020',
                      border: '1px solid rgba(255,255,255,0.12)',
                      borderRadius: '8px',
                      padding: '10px',
                      color: '#FFF',
                      fontSize: '13px',
                      resize: 'none'
                    }}
                  />
                </div>

                {/* Status Message */}
                {statusMsg && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      background: statusMsg.type === 'success' ? 'rgba(52,211,153,0.1)' : 'rgba(239,68,68,0.1)',
                      border: `1px solid ${statusMsg.type === 'success' ? 'rgba(52,211,153,0.3)' : 'rgba(239,68,68,0.3)'}`,
                      color: statusMsg.type === 'success' ? '#34D399' : '#F87171',
                      fontSize: '13px',
                      fontWeight: '600'
                    }}
                  >
                    {statusMsg.type === 'success' ? <CheckCircle size={15} /> : <AlertCircle size={15} />}
                    {statusMsg.text}
                  </div>
                )}

                {/* Action Buttons */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
                  <button
                    type="button"
                    onClick={closeModal}
                    style={{
                      background: 'transparent',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#94A3B8',
                      padding: '10px 20px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '13px'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    style={{
                      background: submitting ? '#374151' : 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                      border: 'none',
                      color: '#FFF',
                      padding: '10px 24px',
                      borderRadius: '8px',
                      fontWeight: '700',
                      cursor: submitting ? 'wait' : 'pointer',
                      fontSize: '13px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      minWidth: '150px',
                      justifyContent: 'center'
                    }}
                  >
                    {submitting ? (
                      <>
                        <div style={{ width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#FFF', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Upload size={14} />
                        {uploadMode === 'pdf' ? 'Upload Question Bank' : 'Save Question'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </AdminLayout>
  );
};
