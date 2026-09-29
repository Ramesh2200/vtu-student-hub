import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  FileText,
  Download,
  Bookmark,
  Eye,
  Star,
  Filter,
  Check,
  Search,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const ResourcePreviewSection = () => {
  const {
    notes,
    toggleBookmarkNote,
    setPdfViewerData,
    schemes,
    branches,
    subjects,
    setActiveTab,
    loginUser
  } = useApp();

  const [selectedScheme, setSelectedScheme] = useState('2022 Scheme');
  const [selectedBranch, setSelectedBranch] = useState('CSE');
  const [selectedSemester, setSelectedSemester] = useState(6);
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [downloadSuccessId, setDownloadSuccessId] = useState(null);

  // Filter notes
  const filteredNotes = notes.filter(note => {
    if (selectedSubject !== 'All' && note.subjectCode !== selectedSubject) return false;
    return true;
  });

  const handleDownload = (note) => {
    setDownloadSuccessId(note.id);
    setTimeout(() => {
      setDownloadSuccessId(null);
    }, 2000);
  };

  const handlePreview = (note) => {
    setPdfViewerData({
      title: note.title,
      subject: `${note.subjectCode} - ${note.subjectName}`,
      author: note.author,
      pages: note.pages,
      fileSize: note.fileSize,
      contentSnippet: note.contentSnippet,
      moduleNumber: note.moduleNumber
    });
  };

  return (
    <section id="resources" style={{
      padding: '100px 24px',
      background: '#0B1020',
      position: 'relative'
    }}>
      <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
        
        {/* Section Header */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          maxWidth: '780px',
          margin: '0 auto 48px'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: '20px',
            background: 'rgba(79, 140, 255, 0.12)',
            border: '1px solid rgba(79, 140, 255, 0.3)',
            color: '#93C5FD',
            fontSize: '0.85rem',
            fontWeight: 600,
            marginBottom: '16px'
          }}>
            <Sparkles size={16} />
            <span>Interactive Resource Hub</span>
          </div>

          <h2 style={{
            fontSize: 'clamp(2rem, 3.5vw, 3rem)',
            fontWeight: 800,
            color: '#F8FAFC',
            letterSpacing: '-0.02em',
            marginBottom: '16px'
          }}>
            Explore Verified VTU Notes & Solved Papers
          </h2>

          <p style={{ fontSize: '1.05rem', color: '#94A3B8', lineHeight: 1.6 }}>
            Filter by your syllabus scheme, branch, semester, and subjects. Preview verified PDFs directly in the browser.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div style={{
          background: 'rgba(17, 24, 39, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '20px',
          padding: '20px 24px',
          marginBottom: '36px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'center' }}>
            
            {/* Scheme Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#94A3B8' }}>Scheme:</span>
              <select
                value={selectedScheme}
                onChange={(e) => setSelectedScheme(e.target.value)}
                style={{
                  background: '#0B1020',
                  color: '#F8FAFC',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '10px',
                  padding: '8px 14px',
                  fontSize: '0.88rem'
                }}
              >
                {schemes.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* Branch Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#94A3B8' }}>Branch:</span>
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                style={{
                  background: '#0B1020',
                  color: '#F8FAFC',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '10px',
                  padding: '8px 14px',
                  fontSize: '0.88rem'
                }}
              >
                {branches.map(b => <option key={b.code} value={b.code}>{b.code} ({b.name.slice(0, 20)}...)</option>)}
              </select>
            </div>

            {/* Semester Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#94A3B8' }}>Semester:</span>
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(Number(e.target.value))}
                style={{
                  background: '#0B1020',
                  color: '#F8FAFC',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '10px',
                  padding: '8px 14px',
                  fontSize: '0.88rem'
                }}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                  <option key={sem} value={sem}>Sem {sem}</option>
                ))}
              </select>
            </div>

            {/* Subject Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#94A3B8' }}>Subject:</span>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                style={{
                  background: '#0B1020',
                  color: '#F8FAFC',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '10px',
                  padding: '8px 14px',
                  fontSize: '0.88rem'
                }}
              >
                <option value="All">All Subjects (6th Sem)</option>
                {subjects.map(sub => (
                  <option key={sub.id} value={sub.code}>{sub.code}: {sub.name}</option>
                ))}
              </select>
            </div>

          </div>

          <div style={{ fontSize: '0.85rem', color: '#A78BFA', fontWeight: 600 }}>
            Showing {filteredNotes.length} verified resources
          </div>
        </div>

        {/* Resources Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px'
        }}>
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              className="glass-card"
              style={{
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative'
              }}
            >
              <div>
                {/* Card Top: Badges & Bookmark */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '16px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="badge badge-primary" style={{ fontSize: '0.72rem' }}>
                      {note.subjectCode}
                    </span>
                    <span className="badge badge-secondary" style={{ fontSize: '0.72rem' }}>
                      Module {note.moduleNumber}
                    </span>
                    <span style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      background: 'rgba(239, 68, 68, 0.15)',
                      color: '#F87171',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      padding: '3px 8px',
                      borderRadius: '6px'
                    }}>
                      PDF • {note.fileSize}
                    </span>
                  </div>

                  <button
                    onClick={() => toggleBookmarkNote(note.id)}
                    style={{
                      padding: '6px',
                      borderRadius: '8px',
                      background: note.isBookmarked ? 'rgba(108, 92, 231, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                      color: note.isBookmarked ? '#A78BFA' : '#94A3B8',
                      transition: 'all 0.2s'
                    }}
                    title={note.isBookmarked ? 'Remove Bookmark' : 'Save Resource'}
                  >
                    <Bookmark size={18} fill={note.isBookmarked ? '#A78BFA' : 'none'} />
                  </button>
                </div>

                {/* Title */}
                <h3 style={{
                  fontSize: '1.15rem',
                  fontWeight: 700,
                  color: '#F8FAFC',
                  lineHeight: 1.4,
                  marginBottom: '10px'
                }}>
                  {note.title}
                </h3>

                {/* Subject Full Name */}
                <div style={{ fontSize: '0.85rem', color: '#67E8F9', fontWeight: 600, marginBottom: '12px' }}>
                  {note.subjectName}
                </div>

                {/* Description Snippet */}
                <p style={{
                  fontSize: '0.88rem',
                  color: '#94A3B8',
                  lineHeight: 1.5,
                  marginBottom: '20px'
                }}>
                  {note.description}
                </p>
              </div>

              <div>
                {/* Meta details: Author & Rating */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '14px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                  marginBottom: '16px',
                  fontSize: '0.78rem',
                  color: '#64748B'
                }}>
                  <div>
                    <span style={{ color: '#E2E8F0', fontWeight: 600 }}>{note.author}</span>
                    <span style={{ display: 'block', fontSize: '0.72rem' }}>{note.authorRole}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#F59E0B', fontWeight: 700 }}>
                    <Star size={14} fill="#F59E0B" />
                    <span>{note.rating} ({note.downloads})</span>
                  </div>
                </div>

                {/* Action Buttons: Preview & Download */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <button
                    onClick={() => handlePreview(note)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#F8FAFC',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      transition: 'all 0.2s'
                    }}
                  >
                    <Eye size={15} />
                    <span>Preview PDF</span>
                  </button>

                  <button
                    onClick={() => handleDownload(note)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      background: downloadSuccessId === note.id ? 'rgba(16, 185, 129, 0.2)' : 'linear-gradient(135deg, #6C5CE7 0%, #4F8CFF 100%)',
                      border: downloadSuccessId === note.id ? '1px solid #10B981' : 'none',
                      color: downloadSuccessId === note.id ? '#6EE7B7' : '#FFFFFF',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      transition: 'all 0.2s'
                    }}
                  >
                    {downloadSuccessId === note.id ? (
                      <>
                        <Check size={15} />
                        <span>Downloaded</span>
                      </>
                    ) : (
                      <>
                        <Download size={15} />
                        <span>Download</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All In App CTA */}
        <div style={{ marginTop: '48px', textAlign: 'center' }}>
          <button
            onClick={() => { loginUser('student'); setActiveTab('notes'); }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '14px 28px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#F8FAFC',
              fontWeight: 600,
              fontSize: '0.95rem'
            }}
          >
            <span>Open Complete 25,000+ Resource Library</span>
            <ArrowRight size={18} />
          </button>
        </div>

      </div>
    </section>
  );
};
