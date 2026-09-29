import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  FileText,
  Download,
  Bookmark,
  Eye,
  Search,
  Filter,
  Layers,
  Sparkles,
  GraduationCap,
  Calendar,
  Check
} from 'lucide-react';
import { api } from '../../services/api';
import { StudentLayout } from '../../components/StudentLayout';

export const NotesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialSem = searchParams.get('sem') || 'ALL';

  const [notes, setNotes] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedSemester, setSelectedSemester] = useState(initialSem);
  const [selectedUnit, setSelectedUnit] = useState('ALL');
  const [downloadingId, setDownloadingId] = useState(null);
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const q = searchParams.get('q');
    if (q !== null) {
      setSearchQuery(q);
    }
  }, [searchParams]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [notesRes, semsRes] = await Promise.all([
        api.notes.getAll(),
        api.semesters.getAll()
      ]);
      setNotes(notesRes || []);
      setSemesters(semsRes || []);
    } catch (err) {
      console.error('Failed to load notes data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (note) => {
    try {
      setDownloadingId(note.id);
      await api.notes.download(note.id);
      setNotes((prev) =>
        prev.map((n) => (n.id === note.id ? { ...n, downloadCount: (n.downloadCount || 0) + 1 } : n))
      );
    } catch (err) {
      console.error('Download note failed:', err);
    } finally {
      setDownloadingId(null);
    }
  };

  const toggleBookmark = async (noteId) => {
    try {
      await api.notes.bookmark(noteId);
      setBookmarkedIds((prev) => {
        const next = new Set(prev);
        if (next.has(noteId)) {
          next.delete(noteId);
        } else {
          next.add(noteId);
        }
        return next;
      });
    } catch (err) {
      console.error('Bookmark error:', err);
    }
  };

  const filteredNotes = notes.filter((n) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      !query ||
      n.title?.toLowerCase().includes(query) ||
      n.description?.toLowerCase().includes(query) ||
      n.subjectCode?.toLowerCase().includes(query) ||
      n.subjectName?.toLowerCase().includes(query);

    const matchesSem =
      selectedSemester === 'ALL' || String(n.semesterId) === selectedSemester;
    const matchesUnit = selectedUnit === 'ALL' || String(n.unit) === selectedUnit;

    return matchesSearch && matchesSem && matchesUnit;
  });

  return (
    <StudentLayout>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '999px', background: 'rgba(124, 58, 237, 0.2)', border: '1px solid rgba(124, 58, 237, 0.3)', marginBottom: '8px' }}>
              <Sparkles size={12} color="#A78BFA" />
              <span style={{ fontSize: '11px', fontWeight: '700', color: '#DDD6FE', textTransform: 'uppercase' }}>
                Official VTU Module Notes
              </span>
            </div>
            <h1 style={{ fontSize: '28px', fontWeight: '900', color: '#F8FAFC', margin: 0 }}>
              Academic Notes Hub
            </h1>
            <p style={{ fontSize: '14px', color: '#94A3B8', margin: '6px 0 0' }}>
              Download or read verified PDF lecture notes authored by top VTU faculty across Semesters 1-8.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: '700', background: 'rgba(124, 58, 237, 0.1)', color: '#C4B5FD', padding: '8px 16px', borderRadius: '10px', border: '1px solid rgba(124, 58, 237, 0.2)' }}>
              {filteredNotes.length} Notes Available
            </span>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '20px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}
        >
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {/* Search Input */}
            <div style={{ position: 'relative', flex: '1 1 280px' }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notes by title, subject code (e.g. 21CS61)..."
                style={{
                  width: '100%',
                  background: 'rgba(11, 16, 32, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '12px',
                  padding: '12px 14px 12px 40px',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  outline: 'none'
                }}
              />
              <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '14px', top: '14px', pointerEvents: 'none' }} />
            </div>

            {/* Semester Filter */}
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              style={{
                background: 'rgba(11, 16, 32, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '12px',
                padding: '12px 16px',
                color: '#F8FAFC',
                fontSize: '13px',
                fontWeight: '600',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="ALL">All Semesters</option>
              {semesters.map((s) => (
                <option key={s.id} value={s.id}>
                  Semester {s.semesterNumber}
                </option>
              ))}
            </select>

            {/* Unit Filter */}
            <select
              value={selectedUnit}
              onChange={(e) => setSelectedUnit(e.target.value)}
              style={{
                background: 'rgba(11, 16, 32, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '12px',
                padding: '12px 16px',
                color: '#F8FAFC',
                fontSize: '13px',
                fontWeight: '600',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="ALL">All Units</option>
              <option value="1">Unit 1</option>
              <option value="2">Unit 2</option>
              <option value="3">Unit 3</option>
              <option value="4">Unit 4</option>
              <option value="5">Unit 5</option>
            </select>
          </div>
        </div>

        {/* Notes Grid */}
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#94A3B8' }}>
            Loading notes database...
          </div>
        ) : filteredNotes.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', background: 'rgba(15, 23, 42, 0.5)', borderRadius: '20px', color: '#94A3B8' }}>
            <FileText size={48} color="#475569" style={{ marginBottom: '12px' }} />
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#F8FAFC', margin: '0 0 6px 0' }}>No notes found</h3>
            <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>Try clearing filters or search by a different keyword.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
            {filteredNotes.map((note) => (
              <div
                key={note.id}
                style={{
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '20px',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.borderColor = 'rgba(124, 58, 237, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '11px', fontWeight: '800', background: 'rgba(124, 58, 237, 0.25)', color: '#C4B5FD', padding: '3px 8px', borderRadius: '6px' }}>
                        Unit {note.unit}
                      </span>
                      <span style={{ fontSize: '11px', fontWeight: '800', background: 'rgba(6, 182, 212, 0.15)', color: '#22D3EE', padding: '3px 8px', borderRadius: '6px' }}>
                        {note.subjectCode || '21CS61'}
                      </span>
                      <span style={{ fontSize: '11px', color: '#64748B' }}>
                        Sem {note.semesterNumber || 6}
                      </span>
                    </div>

                    <button
                      onClick={() => toggleBookmark(note.id)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: bookmarkedIds.has(note.id) ? '#F59E0B' : '#64748B',
                        cursor: 'pointer',
                        padding: '4px'
                      }}
                      title="Bookmark note"
                    >
                      <Bookmark size={18} fill={bookmarkedIds.has(note.id) ? '#F59E0B' : 'none'} />
                    </button>
                  </div>

                  <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#F8FAFC', marginBottom: '8px', lineHeight: 1.4 }}>
                    {note.title}
                  </h3>
                  <p style={{ fontSize: '12px', color: '#94A3B8', lineHeight: 1.5, margin: '0 0 12px 0' }}>
                    {note.description}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '11px', color: '#64748B' }}>
                    <span>By: <strong style={{ color: '#E2E8F0' }}>{note.uploadedByName || 'VTU Faculty'}</strong></span>
                    <span>•</span>
                    <span>{(note.fileSize / 1024).toFixed(0)} KB PDF</span>
                  </div>
                </div>

                <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#64748B' }}>
                    <Download size={12} />
                    <span>{note.downloadCount || 0} downloads</span>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Link
                      to={`/notes/${note.id}`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        background: 'rgba(255, 255, 255, 0.08)',
                        color: '#F8FAFC',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: '700',
                        textDecoration: 'none'
                      }}
                    >
                      <Eye size={13} /> View PDF
                    </Link>
                    <button
                      onClick={() => handleDownload(note)}
                      disabled={downloadingId === note.id}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        background: 'linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)',
                        color: '#FFFFFF',
                        border: 'none',
                        padding: '8px 14px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: '700',
                        cursor: 'pointer'
                      }}
                    >
                      <Download size={13} /> Download
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </StudentLayout>
  );
};
