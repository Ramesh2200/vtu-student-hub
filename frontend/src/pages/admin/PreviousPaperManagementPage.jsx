import React, { useState, useEffect, useRef } from 'react';
import { FileText, Plus, Trash2, Upload, X, Download, CheckCircle, AlertCircle, Eye } from 'lucide-react';
import { api } from '../../services/api';
import { AdminLayout } from './AdminLayout';

export const PreviousPaperManagementPage = () => {
  const [papers, setPapers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadMode, setUploadMode] = useState('pdf'); // 'pdf' | 'metadata'
  const [dragOver, setDragOver] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null); // { type: 'success'|'error', msg }
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    subjectId: '',
    title: '',
    examYear: new Date().getFullYear(),
    examType: 'SEE Regular',
    file: null
  });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [pRes, subjs] = await Promise.all([
        api.previousPapers.getAll(),
        api.admin.getSubjects()
      ]);
      setPapers(pRes || []);
      setSubjects(subjs || []);
      if (subjs?.length > 0) {
        setForm((prev) => ({ ...prev, subjectId: subjs[0].id }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      subjectId: subjects[0]?.id || '',
      title: '',
      examYear: new Date().getFullYear(),
      examType: 'SEE Regular',
      file: null
    });
    setUploadStatus(null);
    setDragOver(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  const handleFileSelect = (file) => {
    if (!file) return;
    if (file.type !== 'application/pdf') {
      setUploadStatus({ type: 'error', msg: 'Only PDF files are allowed.' });
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      setUploadStatus({ type: 'error', msg: 'File must be smaller than 25 MB.' });
      return;
    }
    setUploadStatus(null);
    // Auto-fill title from filename
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
    handleFileSelect(e.dataTransfer.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (uploadMode === 'pdf' && !form.file) {
      setUploadStatus({ type: 'error', msg: 'Please select a PDF file to upload.' });
      return;
    }
    if (!form.title.trim()) {
      setUploadStatus({ type: 'error', msg: 'Paper title is required.' });
      return;
    }

    setUploading(true);
    setUploadStatus(null);

    try {
      let created;
      if (uploadMode === 'pdf' && form.file) {
        // Multipart upload
        const fd = new FormData();
        fd.append('file', form.file);
        fd.append('title', form.title.trim());
        fd.append('subjectId', form.subjectId);
        fd.append('semesterId', subjects.find(s => s.id === Number(form.subjectId))?.semesterId || 1);
        fd.append('examYear', form.examYear);
        fd.append('examType', form.examType);
        created = await api.admin.uploadPaperPdf(fd);
      } else {
        // Metadata only
        created = await api.admin.createPreviousPaper({
          title: form.title.trim(),
          subjectId: Number(form.subjectId),
          semesterId: subjects.find(s => s.id === Number(form.subjectId))?.semesterId || 1,
          examYear: Number(form.examYear),
          examType: form.examType
        });
      }
      setPapers((prev) => [created, ...prev]);
      setUploadStatus({ type: 'success', msg: `"${form.title}" uploaded successfully!` });
      setTimeout(closeModal, 1500);
    } catch (err) {
      setUploadStatus({ type: 'error', msg: err.message || 'Upload failed. Try again.' });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await api.admin.deletePreviousPaper(id);
      setPapers((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert(err.message || 'Delete failed');
    }
  };

  const formatSize = (bytes) => {
    if (!bytes || bytes === 0) return '—';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <AdminLayout>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '900', color: '#F8FAFC', margin: 0 }}>
              Previous Year Question Papers
            </h1>
            <p style={{ fontSize: '13px', color: '#94A3B8', margin: '4px 0 0' }}>
              Upload VTU SEE question papers (PDF) — students can view & download them.
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
              color: '#FFF', border: 'none', padding: '11px 20px',
              borderRadius: '10px', fontSize: '13px', fontWeight: '700', cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(239,68,68,0.35)'
            }}
          >
            <Upload size={16} /> Upload Question Paper
          </button>
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
          {[
            { label: 'Total Papers', value: papers.length, color: '#F59E0B' },
            { label: 'Subjects Covered', value: [...new Set(papers.map(p => p.subjectId))].length, color: '#22D3EE' },
            { label: 'With PDF', value: papers.filter(p => p.fileName && p.fileName !== 'pending_upload.pdf').length, color: '#34D399' },
          ].map(s => (
            <div key={s.label} style={{ background: 'rgba(15,23,42,0.65)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '14px 20px', minWidth: '150px' }}>
              <div style={{ fontSize: '26px', fontWeight: '900', color: s.color }}>{s.value}</div>
              <div style={{ fontSize: '12px', color: '#64748B', fontWeight: '600', marginTop: '2px' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div style={{ background: 'rgba(15, 23, 42, 0.65)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.08)', color: '#94A3B8' }}>
                <th style={{ padding: '16px 20px', fontWeight: '700', textAlign: 'left' }}>Paper Title</th>
                <th style={{ padding: '16px 20px', fontWeight: '700', textAlign: 'left' }}>Subject</th>
                <th style={{ padding: '16px 20px', fontWeight: '700', textAlign: 'left' }}>Year & Type</th>
                <th style={{ padding: '16px 20px', fontWeight: '700', textAlign: 'left' }}>File</th>
                <th style={{ padding: '16px 20px', fontWeight: '700', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" style={{ padding: '48px', textAlign: 'center', color: '#94A3B8' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                    <div style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.1)', borderTopColor: '#EF4444', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                    Loading papers...
                  </div>
                </td></tr>
              ) : papers.length === 0 ? (
                <tr><td colSpan="5" style={{ padding: '48px', textAlign: 'center', color: '#64748B' }}>
                  No question papers yet. Upload the first one!
                </td></tr>
              ) : (
                papers.map((p) => {
                  const hasPdf = p.fileName && p.fileName !== 'pending_upload.pdf';
                  return (
                    <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: '14px 20px', fontWeight: '700', color: '#F8FAFC', maxWidth: '280px' }}>
                        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</div>
                        {p.downloadCount > 0 && <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>{p.downloadCount} downloads</div>}
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        <span style={{ fontSize: '11px', fontWeight: '800', background: 'rgba(6,182,212,0.15)', color: '#22D3EE', padding: '2px 7px', borderRadius: '4px' }}>
                          {p.subjectCode || `Subject #${p.subjectId}`}
                        </span>
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        <span style={{ fontSize: '11px', fontWeight: '700', background: 'rgba(245,158,11,0.15)', color: '#FCD34D', padding: '3px 8px', borderRadius: '6px' }}>
                          {p.examYear} · {p.examType}
                        </span>
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        {hasPdf ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <CheckCircle size={14} color="#34D399" />
                            <span style={{ fontSize: '11px', color: '#34D399', fontWeight: '700' }}>PDF Ready</span>
                            <span style={{ fontSize: '11px', color: '#475569' }}>({formatSize(p.fileSize)})</span>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <AlertCircle size={14} color="#F59E0B" />
                            <span style={{ fontSize: '11px', color: '#F59E0B', fontWeight: '600' }}>No PDF</span>
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                          {hasPdf && (
                            <a
                              href={`${import.meta.env.VITE_API_URL || 'http://localhost:8080/api'}/resources/papers/${p.id}/download`}
                              target="_blank" rel="noreferrer"
                              style={{ background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.2)', color: '#22D3EE', padding: '6px 8px', borderRadius: '8px', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: '600', textDecoration: 'none' }}
                            >
                              <Eye size={12} /> View
                            </a>
                          )}
                          <button
                            onClick={() => handleDelete(p.id, p.title)}
                            style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', color: '#F87171', padding: '6px 10px', borderRadius: '8px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: '600' }}
                          >
                            <Trash2 size={13} /> Delete
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

        {/* UPLOAD MODAL */}
        {showModal && (
          <div
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
            onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
          >
            <div style={{ width: '100%', maxWidth: '540px', background: '#0C1424', border: '1px solid rgba(239,68,68,0.35)', borderRadius: '24px', padding: '30px', boxShadow: '0 25px 50px rgba(0,0,0,0.6)' }}>

              {/* Modal Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                  <h3 style={{ fontSize: '20px', fontWeight: '900', color: '#F8FAFC', margin: 0 }}>Upload Question Paper</h3>
                  <p style={{ fontSize: '12px', color: '#64748B', margin: '3px 0 0' }}>VTU Previous Year SEE Paper</p>
                </div>
                <button onClick={closeModal} style={{ background: 'rgba(255,255,255,0.06)', border: 'none', color: '#94A3B8', width: '32px', height: '32px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <X size={18} />
                </button>
              </div>

              {/* Upload Mode Toggle */}
              <div style={{ display: 'flex', background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '4px', marginBottom: '20px' }}>
                {[['pdf', '📄 Upload PDF'], ['metadata', '📝 Metadata Only']].map(([mode, label]) => (
                  <button
                    key={mode}
                    onClick={() => setUploadMode(mode)}
                    style={{
                      flex: 1, padding: '8px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: '700', transition: 'all 0.2s',
                      background: uploadMode === mode ? 'linear-gradient(135deg,#EF4444,#DC2626)' : 'transparent',
                      color: uploadMode === mode ? '#FFF' : '#94A3B8'
                    }}
                  >{label}</button>
                ))}
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

                {/* PDF Drop Zone */}
                {uploadMode === 'pdf' && (
                  <div
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      border: `2px dashed ${dragOver ? '#EF4444' : form.file ? '#34D399' : 'rgba(255,255,255,0.15)'}`,
                      borderRadius: '14px',
                      padding: '28px 20px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      background: dragOver ? 'rgba(239,68,68,0.06)' : form.file ? 'rgba(52,211,153,0.04)' : 'rgba(255,255,255,0.02)',
                      transition: 'all 0.2s'
                    }}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf"
                      style={{ display: 'none' }}
                      onChange={(e) => handleFileSelect(e.target.files[0])}
                    />
                    {form.file ? (
                      <div>
                        <CheckCircle size={32} color="#34D399" style={{ margin: '0 auto 8px' }} />
                        <div style={{ fontSize: '14px', fontWeight: '700', color: '#34D399' }}>{form.file.name}</div>
                        <div style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>{formatSize(form.file.size)} · Click to change</div>
                      </div>
                    ) : (
                      <div>
                        <Upload size={32} color="#64748B" style={{ margin: '0 auto 10px' }} />
                        <div style={{ fontSize: '14px', fontWeight: '700', color: '#CBD5E1' }}>Drop PDF here or click to browse</div>
                        <div style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>Max size: 25 MB · PDF only</div>
                      </div>
                    )}
                  </div>
                )}

                {/* Title */}
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#CBD5E1', display: 'block', marginBottom: '5px' }}>Paper Title *</label>
                  <input
                    type="text" required
                    placeholder="e.g. 21CS61 Cloud Computing SEE 2024"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    style={{ width: '100%', background: '#0B1020', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '10px 12px', color: '#FFF', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>

                {/* Subject */}
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#CBD5E1', display: 'block', marginBottom: '5px' }}>Subject *</label>
                  <select
                    value={form.subjectId}
                    onChange={(e) => setForm({ ...form, subjectId: Number(e.target.value) })}
                    style={{ width: '100%', background: '#0B1020', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '10px 12px', color: '#FFF', fontSize: '13px' }}
                  >
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>{s.code || s.subjectCode} — {s.name || s.subjectName}</option>
                    ))}
                  </select>
                </div>

                {/* Year + Exam Type */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: '700', color: '#CBD5E1', display: 'block', marginBottom: '5px' }}>Exam Year *</label>
                    <select
                      value={form.examYear}
                      onChange={(e) => setForm({ ...form, examYear: Number(e.target.value) })}
                      style={{ width: '100%', background: '#0B1020', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '10px 12px', color: '#FFF', fontSize: '13px' }}
                    >
                      {[2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018].map(y => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: '700', color: '#CBD5E1', display: 'block', marginBottom: '5px' }}>Exam Type *</label>
                    <select
                      value={form.examType}
                      onChange={(e) => setForm({ ...form, examType: e.target.value })}
                      style={{ width: '100%', background: '#0B1020', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '10px 12px', color: '#FFF', fontSize: '13px' }}
                    >
                      <option value="SEE Regular">SEE Regular</option>
                      <option value="SEE Supplementary">SEE Supplementary</option>
                      <option value="Make-up Exam">Make-up Exam</option>
                    </select>
                  </div>
                </div>

                {/* Status message */}
                {uploadStatus && (
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', borderRadius: '10px',
                    background: uploadStatus.type === 'success' ? 'rgba(52,211,153,0.1)' : 'rgba(239,68,68,0.1)',
                    border: `1px solid ${uploadStatus.type === 'success' ? 'rgba(52,211,153,0.3)' : 'rgba(239,68,68,0.3)'}`,
                    color: uploadStatus.type === 'success' ? '#34D399' : '#F87171',
                    fontSize: '13px', fontWeight: '600'
                  }}>
                    {uploadStatus.type === 'success' ? <CheckCircle size={15} /> : <AlertCircle size={15} />}
                    {uploadStatus.msg}
                  </div>
                )}

                {/* Action buttons */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
                  <button type="button" onClick={closeModal} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#94A3B8', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}>
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploading}
                    style={{
                      background: uploading ? '#374151' : 'linear-gradient(135deg,#EF4444,#DC2626)',
                      border: 'none', color: '#FFF', padding: '10px 24px', borderRadius: '8px',
                      fontWeight: '700', cursor: uploading ? 'wait' : 'pointer', fontSize: '13px',
                      display: 'inline-flex', alignItems: 'center', gap: '8px', minWidth: '140px', justifyContent: 'center'
                    }}
                  >
                    {uploading ? (
                      <>
                        <div style={{ width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#FFF', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                        Uploading...
                      </>
                    ) : (
                      <><Upload size={14} /> {uploadMode === 'pdf' ? 'Upload Paper' : 'Save Record'}</>
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
