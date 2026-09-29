import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  Filter,
  Download,
  Bookmark,
  Eye,
  Star,
  FileCheck2,
  FileText,
  Clock,
  Sparkles,
  Check
} from 'lucide-react';

export const NotesPage = () => {
  const {
    notes,
    questionPapers,
    subjects,
    setPdfViewerData,
    toggleBookmarkNote
  } = useApp();

  const [activeSection, setActiveSection] = useState('notes'); // 'notes' | 'papers'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [selectedModule, setSelectedModule] = useState('All');
  const [sortBy, setSortBy] = useState('popular'); // 'popular' | 'newest' | 'rating'
  const [downloadSuccessId, setDownloadSuccessId] = useState(null);

  // Filter notes
  let filteredNotes = notes.filter(n => {
    if (selectedSubject !== 'All' && n.subjectCode !== selectedSubject) return false;
    if (selectedModule !== 'All' && n.moduleNumber !== Number(selectedModule)) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        n.title.toLowerCase().includes(q) ||
        n.subjectName.toLowerCase().includes(q) ||
        n.subjectCode.toLowerCase().includes(q) ||
        n.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  if (sortBy === 'popular') {
    filteredNotes.sort((a, b) => b.downloads - a.downloads);
  } else if (sortBy === 'newest') {
    filteredNotes.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
  } else if (sortBy === 'rating') {
    filteredNotes.sort((a, b) => b.rating - a.rating);
  }

  // Filter question papers
  const filteredPapers = questionPapers.filter(qp => {
    if (selectedSubject !== 'All' && qp.subjectCode !== selectedSubject) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        qp.subjectName.toLowerCase().includes(q) ||
        qp.subjectCode.toLowerCase().includes(q) ||
        qp.examType.toLowerCase().includes(q) ||
        qp.year.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleDownload = (id) => {
    setDownloadSuccessId(id);
    setTimeout(() => setDownloadSuccessId(null), 2000);
  };

  return (
    <div style={{ padding: '32px 28px', maxWidth: '1440px', margin: '0 auto', width: '100%' }}>
      
      {/* Top Header */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <Sparkles size={16} color="#A78BFA" />
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#A78BFA' }}>
            VTU Curated Document Repository
          </span>
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#F8FAFC', marginBottom: '6px' }}>
          Notes & Question Papers Library
        </h1>
        <p style={{ fontSize: '0.95rem', color: '#94A3B8' }}>
          Search across 25,000+ faculty-verified lecture notes, formula sheets, and solved SEE papers.
        </p>
      </div>

      {/* Primary Toggle: Notes vs Question Papers */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '24px'
      }}>
        <button
          onClick={() => setActiveSection('notes')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            borderRadius: '12px',
            fontSize: '0.92rem',
            fontWeight: 700,
            background: activeSection === 'notes' ? 'linear-gradient(135deg, #6C5CE7 0%, #4F8CFF 100%)' : 'rgba(255, 255, 255, 0.05)',
            border: activeSection === 'notes' ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
            color: activeSection === 'notes' ? '#FFFFFF' : '#94A3B8'
          }}
        >
          <FileText size={18} />
          <span>Module Notes & Manuals ({notes.length})</span>
        </button>

        <button
          onClick={() => setActiveSection('papers')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            borderRadius: '12px',
            fontSize: '0.92rem',
            fontWeight: 700,
            background: activeSection === 'papers' ? 'linear-gradient(135deg, #6C5CE7 0%, #4F8CFF 100%)' : 'rgba(255, 255, 255, 0.05)',
            border: activeSection === 'papers' ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
            color: activeSection === 'papers' ? '#FFFFFF' : '#94A3B8'
          }}
        >
          <FileCheck2 size={18} />
          <span>Solved Question Papers ({questionPapers.length})</span>
        </button>
      </div>

      {/* 31. POWERFUL SEARCH AND FILTERS BAR */}
      <div style={{
        background: '#111827',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '18px',
        padding: '20px',
        marginBottom: '32px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '16px',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Search input */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          padding: '10px 16px',
          flex: '1 1 300px'
        }}>
          <Search size={18} color="#94A3B8" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search notes, subjects, modules (e.g. BCS601, MapReduce, ID3)..."
            style={{
              background: 'transparent',
              border: 'none',
              color: '#F8FAFC',
              fontSize: '0.92rem',
              width: '100%'
            }}
          />
        </div>

        {/* Dropdown filters */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
          
          {/* Subject Filter */}
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            style={{
              background: '#0B1020',
              color: '#F8FAFC',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '10px',
              padding: '10px 14px',
              fontSize: '0.85rem'
            }}
          >
            <option value="All">All Subjects (6th Sem)</option>
            {subjects.map(s => <option key={s.id} value={s.code}>{s.code}: {s.name}</option>)}
          </select>

          {/* Module Filter (only for notes) */}
          {activeSection === 'notes' && (
            <select
              value={selectedModule}
              onChange={(e) => setSelectedModule(e.target.value)}
              style={{
                background: '#0B1020',
                color: '#F8FAFC',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '10px',
                padding: '10px 14px',
                fontSize: '0.85rem'
              }}
            >
              <option value="All">All Modules (1 to 5)</option>
              {[1, 2, 3, 4, 5].map(m => <option key={m} value={m}>Module {m}</option>)}
            </select>
          )}

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              background: '#0B1020',
              color: '#F8FAFC',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '10px',
              padding: '10px 14px',
              fontSize: '0.85rem'
            }}
          >
            <option value="popular">Most Downloaded</option>
            <option value="rating">Highest Rated</option>
            <option value="newest">Recently Uploaded</option>
          </select>

        </div>
      </div>

      {/* SECTION 1: NOTES GRID */}
      {activeSection === 'notes' && (
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
                borderRadius: '18px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <span className="badge badge-primary">{note.subjectCode}</span>
                    <span className="badge badge-secondary">Module {note.moduleNumber}</span>
                  </div>

                  <button
                    onClick={() => toggleBookmarkNote(note.id)}
                    style={{
                      padding: '6px',
                      borderRadius: '8px',
                      background: note.isBookmarked ? 'rgba(108, 92, 231, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                      color: note.isBookmarked ? '#A78BFA' : '#94A3B8'
                    }}
                  >
                    <Bookmark size={17} fill={note.isBookmarked ? '#A78BFA' : 'none'} />
                  </button>
                </div>

                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#F8FAFC', lineHeight: 1.35, marginBottom: '8px' }}>
                  {note.title}
                </h3>
                <div style={{ fontSize: '0.82rem', color: '#67E8F9', fontWeight: 600, marginBottom: '10px' }}>
                  {note.subjectName}
                </div>
                <p style={{ fontSize: '0.88rem', color: '#94A3B8', lineHeight: 1.55, marginBottom: '20px' }}>
                  {note.description}
                </p>
              </div>

              <div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingTop: '12px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                  marginBottom: '16px',
                  fontSize: '0.78rem',
                  color: '#64748B'
                }}>
                  <span>By {note.author}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#F59E0B' }}>
                    <Star size={13} fill="#F59E0B" />
                    <span>{note.rating} ({note.downloads})</span>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <button
                    onClick={() => setPdfViewerData(note)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      padding: '10px',
                      borderRadius: '10px',
                      background: 'rgba(255, 255, 255, 0.06)',
                      color: '#F8FAFC',
                      fontSize: '0.82rem',
                      fontWeight: 600
                    }}
                  >
                    <Eye size={14} />
                    <span>Preview</span>
                  </button>

                  <button
                    onClick={() => handleDownload(note.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      padding: '10px',
                      borderRadius: '10px',
                      background: downloadSuccessId === note.id ? '#10B981' : '#6C5CE7',
                      color: '#FFFFFF',
                      fontSize: '0.82rem',
                      fontWeight: 600
                    }}
                  >
                    {downloadSuccessId === note.id ? <Check size={14} /> : <Download size={14} />}
                    <span>{downloadSuccessId === note.id ? 'Saved' : 'Download'}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SECTION 2: QUESTION PAPERS GRID */}
      {activeSection === 'papers' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px'
        }}>
          {filteredPapers.map((qp) => (
            <div
              key={qp.id}
              className="glass-card"
              style={{
                padding: '24px',
                borderRadius: '18px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <span className="badge badge-accent">{qp.examType}</span>
                  <span style={{ fontSize: '0.8rem', color: '#A78BFA', fontWeight: 700 }}>
                    {qp.year}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#F8FAFC', marginBottom: '6px' }}>
                  {qp.subjectCode}: {qp.subjectName}
                </h3>
                <div style={{ fontSize: '0.8rem', color: '#10B981', fontWeight: 600, marginBottom: '12px' }}>
                  {qp.hasSolutions ? '✓ Verified Solved Solutions Attached' : 'Official Paper'}
                </div>
                <p style={{ fontSize: '0.88rem', color: '#94A3B8', marginBottom: '18px' }}>
                  {qp.description}
                </p>
              </div>

              <div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingTop: '12px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                  marginBottom: '16px',
                  fontSize: '0.78rem',
                  color: '#64748B'
                }}>
                  <span>Max Marks: {qp.maxMarks}</span>
                  <span>{qp.downloads} Student Downloads</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <button
                    onClick={() => setPdfViewerData({
                      title: `${qp.subjectCode} ${qp.examType} (${qp.year})`,
                      subject: `${qp.subjectCode} - ${qp.subjectName}`,
                      author: 'VTU Belagavi Examination Authority',
                      pages: 8,
                      fileSize: qp.fileSize,
                      contentSnippet: 'Official Semester End Exam paper with step-by-step marking rubrics and solutions.'
                    })}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      padding: '10px',
                      borderRadius: '10px',
                      background: 'rgba(255, 255, 255, 0.06)',
                      color: '#F8FAFC',
                      fontSize: '0.82rem',
                      fontWeight: 600
                    }}
                  >
                    <Eye size={14} />
                    <span>View PDF</span>
                  </button>

                  <button
                    onClick={() => handleDownload(qp.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      padding: '10px',
                      borderRadius: '10px',
                      background: downloadSuccessId === qp.id ? '#10B981' : 'linear-gradient(135deg, #6C5CE7 0%, #4F8CFF 100%)',
                      color: '#FFFFFF',
                      fontSize: '0.82rem',
                      fontWeight: 600
                    }}
                  >
                    {downloadSuccessId === qp.id ? <Check size={14} /> : <Download size={14} />}
                    <span>{downloadSuccessId === qp.id ? 'Saved' : 'Download'}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
