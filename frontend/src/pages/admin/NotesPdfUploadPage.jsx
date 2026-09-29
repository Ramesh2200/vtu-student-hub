import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, FileText, CheckCircle, AlertTriangle, ArrowLeft, Shield } from 'lucide-react';
import { api } from '../../services/api';
import { AdminLayout } from './AdminLayout';

export const NotesPdfUploadPage = () => {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    semesterId: 6,
    subjectId: '',
    unit: 1
  });
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [sems, subjs] = await Promise.all([
        api.semesters.getAll(),
        api.admin.getSubjects()
      ]);
      setSemesters(sems || []);
      setSubjects(subjs || []);
      if (subjs && subjs.length > 0) {
        setFormData((prev) => ({ ...prev, subjectId: subjs[0].id }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setErrorMessage('');
    if (!selected) {
      setFile(null);
      return;
    }

    // Strict client-side file validation (matches server-side rule)
    if (!selected.name.toLowerCase().endsWith('.pdf') && selected.type !== 'application/pdf') {
      setErrorMessage('Security Violation: Only valid PDF documents (.pdf) are permitted.');
      e.target.value = null;
      setFile(null);
      return;
    }

    if (selected.size > 20 * 1024 * 1024) {
      setErrorMessage('File size limit exceeded: PDF must be less than 20MB.');
      e.target.value = null;
      setFile(null);
      return;
    }

    setFile(selected);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setErrorMessage('Please select a verified PDF file to upload.');
      return;
    }

    try {
      setUploading(true);
      setErrorMessage('');

      const form = new FormData();
      form.append('file', file);
      form.append('title', formData.title);
      form.append('description', formData.description);
      form.append('semesterId', formData.semesterId);
      form.append('subjectId', formData.subjectId);
      form.append('unit', formData.unit);

      await api.admin.uploadNote(form);
      setUploadSuccess(true);
      setTimeout(() => navigate('/admin/notes'), 1400);
    } catch (err) {
      setErrorMessage(err.message || 'PDF upload failed. Verify server authorization.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <AdminLayout>
      <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => navigate('/admin/notes')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#F8FAFC',
              padding: '8px 14px',
              borderRadius: '10px',
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            <ArrowLeft size={16} /> Notes Catalog
          </button>
          <span style={{ color: '#475569' }}>/</span>
          <span style={{ color: '#F87171', fontSize: '13px', fontWeight: '700' }}>
            Upload Official Notes PDF
          </span>
        </div>

        <div
          style={{
            background: 'rgba(15, 23, 42, 0.7)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '24px',
            padding: '36px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF' }}>
              <UploadCloud size={22} />
            </div>
            <div>
              <h1 style={{ fontSize: '22px', fontWeight: '900', color: '#F8FAFC', margin: 0 }}>
                Upload Official Notes PDF
              </h1>
              <p style={{ fontSize: '13px', color: '#94A3B8', margin: 0 }}>
                Server-side safe storage with path traversal protection and SHA-256 metadata verification.
              </p>
            </div>
          </div>

          {errorMessage && (
            <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', borderRadius: '12px', padding: '14px', color: '#F87171', fontSize: '13px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={18} />
              <span>{errorMessage}</span>
            </div>
          )}

          {uploadSuccess ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <CheckCircle size={48} color="#34D399" style={{ marginBottom: '12px' }} />
              <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#FFFFFF', margin: '0 0 6px 0' }}>PDF Uploaded & Published!</h3>
              <p style={{ color: '#94A3B8', fontSize: '13px', margin: 0 }}>Redirecting to catalog...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              
              <div>
                <label style={{ fontSize: '13px', fontWeight: '700', color: '#CBD5E1', display: 'block', marginBottom: '6px' }}>
                  Document Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Unit 3: Cloud Virtualization & Hypervisors Complete Lecture Notes"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  style={{ width: '100%', background: '#0B1020', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', padding: '12px', color: '#FFF', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 140px', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: '700', color: '#CBD5E1', display: 'block', marginBottom: '6px' }}>
                    Semester
                  </label>
                  <select
                    value={formData.semesterId}
                    onChange={(e) => setFormData({ ...formData, semesterId: Number(e.target.value) })}
                    style={{ width: '100%', background: '#0B1020', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', padding: '12px', color: '#FFF', fontSize: '13px' }}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                      <option key={s} value={s}>Semester {s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '13px', fontWeight: '700', color: '#CBD5E1', display: 'block', marginBottom: '6px' }}>
                    Subject
                  </label>
                  <select
                    value={formData.subjectId}
                    onChange={(e) => setFormData({ ...formData, subjectId: Number(e.target.value) })}
                    style={{ width: '100%', background: '#0B1020', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', padding: '12px', color: '#FFF', fontSize: '13px' }}
                  >
                    {subjects.map((sub) => (
                      <option key={sub.id} value={sub.id}>{sub.code} - {sub.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '13px', fontWeight: '700', color: '#CBD5E1', display: 'block', marginBottom: '6px' }}>
                    Unit
                  </label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: Number(e.target.value) })}
                    style={{ width: '100%', background: '#0B1020', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', padding: '12px', color: '#FFF', fontSize: '13px' }}
                  >
                    {[1, 2, 3, 4, 5].map((u) => (
                      <option key={u} value={u}>Unit {u}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: '700', color: '#CBD5E1', display: 'block', marginBottom: '6px' }}>
                  Description & Syllabus Topics Covered
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Outline core definitions, numerical derivations, and examination focus areas..."
                  style={{ width: '100%', background: '#0B1020', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', padding: '12px', color: '#FFF', fontSize: '13px', resize: 'none' }}
                />
              </div>

              {/* PDF File Picker */}
              <div
                style={{
                  border: '2px dashed rgba(239, 68, 68, 0.4)',
                  borderRadius: '16px',
                  padding: '28px',
                  textAlign: 'center',
                  background: 'rgba(239, 68, 68, 0.05)',
                  cursor: 'pointer'
                }}
              >
                <FileText size={36} color="#F87171" style={{ marginBottom: '8px' }} />
                <div style={{ fontSize: '14px', fontWeight: '700', color: '#FFFFFF', marginBottom: '4px' }}>
                  {file ? file.name : 'Select or Drag & Drop PDF Document'}
                </div>
                <p style={{ fontSize: '12px', color: '#94A3B8', margin: '0 0 14px 0' }}>
                  Only official .pdf format accepted (Maximum file size: 20MB)
                </p>

                <input
                  type="file"
                  accept="application/pdf,.pdf"
                  required
                  onChange={handleFileChange}
                  style={{ color: '#CBD5E1', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => navigate('/admin/notes')}
                  style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#94A3B8', padding: '10px 18px', borderRadius: '10px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  style={{ background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)', border: 'none', color: '#FFF', padding: '10px 24px', borderRadius: '10px', fontWeight: '700', cursor: 'pointer' }}
                >
                  {uploading ? 'Validating & Uploading...' : 'Upload Official PDF'}
                </button>
              </div>

            </form>
          )}

        </div>

      </div>
    </AdminLayout>
  );
};
