import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  FileText,
  Download,
  Bookmark,
  ArrowLeft,
  Calendar,
  User,
  Layers,
  GraduationCap,
  HardDrive,
  Clock,
  Sparkles,
  ShieldCheck,
  ExternalLink,
  ZoomIn,
  ZoomOut,
  Maximize2
} from 'lucide-react';
import { api } from '../../services/api';
import { StudentLayout } from '../../components/StudentLayout';

export const PdfViewerPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookmarked, setBookmarked] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [viewMode, setViewMode] = useState('pdf');

  useEffect(() => {
    loadNote();
  }, [id]);

  const loadNote = async () => {
    try {
      setLoading(true);
      const data = await api.notes.getById(id);
      setNote(data);
      // Track view/initial state
    } catch (err) {
      setError(err.message || 'Failed to load PDF document');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!note) return;
    try {
      await api.notes.download(note.id);
      setNote((prev) => ({ ...prev, downloadCount: (prev.downloadCount || 0) + 1 }));
    } catch (err) {
      console.error('Download tracking failed:', err);
    }
  };

  const handleBookmark = async () => {
    if (!note) return;
    try {
      await api.notes.bookmark(note.id);
      setBookmarked(!bookmarked);
    } catch (err) {
      console.error('Bookmark toggle failed:', err);
    }
  };

  return (
    <StudentLayout>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Breadcrumb Navigation & Back Button */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => navigate(-1)}
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
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              <ArrowLeft size={16} /> Back
            </button>

            <span style={{ color: '#475569' }}>/</span>
            <Link to="/notes" style={{ color: '#94A3B8', fontSize: '13px', textDecoration: 'none' }}>
              Academic Notes
            </Link>
            <span style={{ color: '#475569' }}>/</span>
            <span style={{ color: '#38BDF8', fontSize: '13px', fontWeight: '700' }}>
              Note #{id}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{
              display: 'flex',
              background: 'rgba(255, 255, 255, 0.06)',
              borderRadius: '10px',
              padding: '3px',
              border: '1px solid var(--border-color, rgba(255, 255, 255, 0.1))'
            }}>
              <button
                onClick={() => setViewMode('pdf')}
                style={{
                  background: viewMode === 'pdf' ? '#7C3AED' : 'transparent',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: '7px',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                PDF View
              </button>
              <button
                onClick={() => setViewMode('reader')}
                style={{
                  background: viewMode === 'reader' ? '#7C3AED' : 'transparent',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: '7px',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                Outline Reader
              </button>
            </div>

            <button
              onClick={() => window.open(api.notes.viewUrl(id), '_blank')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid var(--border-color, rgba(255, 255, 255, 0.12))',
                color: 'var(--text-main, #F8FAFC)',
                padding: '8px 14px',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
              title="Open full PDF in a dedicated tab"
            >
              <ExternalLink size={15} /> Open in Tab
            </button>

            <button
              onClick={handleBookmark}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid var(--border-color, rgba(255, 255, 255, 0.12))',
                color: bookmarked ? '#F59E0B' : 'var(--text-main, #F8FAFC)',
                padding: '8px 16px',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              <Bookmark size={16} fill={bookmarked ? '#F59E0B' : 'none'} />
              {bookmarked ? 'Bookmarked' : 'Bookmark'}
            </button>

            <button
              onClick={handleDownload}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)',
                border: 'none',
                color: '#FFFFFF',
                padding: '8px 18px',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(124, 58, 237, 0.3)'
              }}
            >
              <Download size={16} /> Download PDF
            </button>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: '80px', textAlign: 'center', color: '#94A3B8' }}>Loading document...</div>
        ) : error || !note ? (
          <div style={{ padding: '24px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '14px', color: '#F87171' }}>
            {error || 'Note not found'}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 340px', gap: '24px', alignItems: 'start' }}>
            
            {/* Left: Interactive In-Browser PDF Container */}
            <div
              style={{
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '20px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {/* PDF Toolbar */}
              <div
                style={{
                  background: 'rgba(30, 41, 59, 0.7)',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                  padding: '12px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '8px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FileText size={18} color="#A78BFA" />
                  <span style={{ fontSize: '13px', fontWeight: '700', color: '#F8FAFC' }}>
                    {note.fileName || `${note.title}.pdf`}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    onClick={() => setZoom((prev) => Math.max(prev - 10, 60))}
                    style={{ background: 'rgba(255, 255, 255, 0.08)', border: 'none', color: '#CBD5E1', borderRadius: '6px', padding: '6px 10px', cursor: 'pointer' }}
                  >
                    <ZoomOut size={14} />
                  </button>
                  <span style={{ fontSize: '12px', fontWeight: '700', color: '#94A3B8', minWidth: '45px', textAlign: 'center' }}>
                    {zoom}%
                  </span>
                  <button
                    onClick={() => setZoom((prev) => Math.min(prev + 10, 160))}
                    style={{ background: 'rgba(255, 255, 255, 0.08)', border: 'none', color: '#CBD5E1', borderRadius: '6px', padding: '6px 10px', cursor: 'pointer' }}
                  >
                    <ZoomIn size={14} />
                  </button>
                </div>
              </div>

              {/* In-Browser PDF Frame or Reader */}
              {viewMode === 'pdf' ? (
                <div style={{ minHeight: '750px', width: '100%', position: 'relative', background: '#0F172A' }}>
                  <iframe
                    src={api.notes.viewUrl(note.id)}
                    title={note.title}
                    style={{
                      width: '100%',
                      height: '750px',
                      border: 'none',
                      display: 'block'
                    }}
                  />
                </div>
              ) : (
                <div
                  style={{
                    minHeight: '620px',
                    background: '#0B1020',
                    padding: '32px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative'
                  }}
                >
                  <div
                    style={{
                      width: `${Math.min(zoom * 6.5, 750)}px`,
                      minHeight: '520px',
                      background: '#1E293B',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      padding: '40px',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      position: 'relative',
                      transition: 'width 0.2s ease'
                    }}
                  >
                    {/* Watermark */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%) rotate(-30deg)',
                        fontSize: '42px',
                        fontWeight: '900',
                        color: 'rgba(255, 255, 255, 0.03)',
                        pointerEvents: 'none',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      VTU STUDENT CONNECT
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid rgba(124, 58, 237, 0.4)', paddingBottom: '16px', marginBottom: '24px' }}>
                        <div>
                          <div style={{ fontSize: '11px', fontWeight: '800', color: '#38BDF8', textTransform: 'uppercase' }}>
                            Visvesvaraya Technological University, Belagavi
                          </div>
                          <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#FFFFFF', margin: '4px 0 0 0' }}>
                            {note.title}
                          </h2>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '12px', fontWeight: '800', background: 'rgba(124, 58, 237, 0.2)', color: '#C4B5FD', padding: '4px 8px', borderRadius: '6px' }}>
                            Unit {note.unit}
                          </span>
                        </div>
                      </div>

                      <div style={{ color: '#CBD5E1', fontSize: '14px', lineHeight: 1.8, marginBottom: '24px' }}>
                        <p style={{ fontWeight: '600', color: '#E2E8F0' }}>Module Overview & Learning Outcomes:</p>
                        <p>{note.description}</p>
                        <p>
                          This official study resource includes detailed theoretical formulations, architectural block diagrams, step-by-step mathematical proofs, solved numerical VTU question problems, and previous examination questions for comprehensive preparation.
                        </p>
                      </div>

                      <div style={{ background: 'rgba(255, 255, 255, 0.04)', borderRadius: '10px', padding: '16px', borderLeft: '3px solid #06B6D4' }}>
                        <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#67E8F9', margin: '0 0 6px 0' }}>
                          Topics Covered in this Unit Note:
                        </h4>
                        <ul style={{ margin: 0, paddingLeft: '18px', color: '#94A3B8', fontSize: '12px', lineHeight: 1.6 }}>
                          <li>Fundamental concepts and mathematical formulations</li>
                          <li>Detailed architectural block diagrams and workflows</li>
                          <li>VTU SEE frequently asked 10-mark questions</li>
                          <li>Comprehensive unit review questions with solutions</li>
                        </ul>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '16px', marginTop: '32px', fontSize: '11px', color: '#64748B' }}>
                      <span>Official Verified Material • VTU Student Connect</span>
                      <span>Page 1 of 24</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Note Metadata & Details Card */}
            <div
              style={{
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '20px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={20} color="#34D399" />
                <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#F8FAFC', margin: 0 }}>
                  Resource Metadata
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '10px' }}>
                  <span style={{ color: '#94A3B8' }}>Note ID</span>
                  <span style={{ color: '#F8FAFC', fontWeight: '700' }}>#{note.id}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '10px' }}>
                  <span style={{ color: '#94A3B8' }}>Subject Code</span>
                  <span style={{ color: '#38BDF8', fontWeight: '700' }}>{note.subjectCode || '21CS61'}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '10px' }}>
                  <span style={{ color: '#94A3B8' }}>Semester</span>
                  <span style={{ color: '#F8FAFC', fontWeight: '600' }}>Semester {note.semesterNumber || 6}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '10px' }}>
                  <span style={{ color: '#94A3B8' }}>Unit / Module</span>
                  <span style={{ color: '#C4B5FD', fontWeight: '700' }}>Unit {note.unit}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '10px' }}>
                  <span style={{ color: '#94A3B8' }}>File Size</span>
                  <span style={{ color: '#F8FAFC' }}>{(note.fileSize / 1024).toFixed(0)} KB</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '10px' }}>
                  <span style={{ color: '#94A3B8' }}>Uploaded By</span>
                  <span style={{ color: '#F8FAFC', fontWeight: '600' }}>{note.uploadedByName || 'VTU Faculty'}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '10px' }}>
                  <span style={{ color: '#94A3B8' }}>Total Downloads</span>
                  <span style={{ color: '#34D399', fontWeight: '800' }}>{note.downloadCount || 0}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '10px' }}>
                  <span style={{ color: '#94A3B8' }}>Status</span>
                  <span style={{ color: '#34D399', fontWeight: '700', textTransform: 'uppercase', fontSize: '11px', background: 'rgba(16, 185, 129, 0.15)', padding: '2px 8px', borderRadius: '4px' }}>
                    {note.status || 'PUBLISHED'}
                  </span>
                </div>
              </div>

              <button
                onClick={handleDownload}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  background: 'linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)',
                  border: 'none',
                  color: '#FFFFFF',
                  padding: '12px',
                  borderRadius: '12px',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  marginTop: '8px'
                }}
              >
                <Download size={16} /> Download Verified PDF
              </button>
            </div>

          </div>
        )}

      </div>
    </StudentLayout>
  );
};
