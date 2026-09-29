import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import {
  FileText,
  HelpCircle,
  BookOpen,
  Download,
  Bookmark,
  Check,
  Eye,
  ArrowLeft,
  Search,
  Filter,
  Layers,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { api } from '../../services/api';
import { StudentLayout } from '../../components/StudentLayout';

export const SubjectDetailsPage = () => {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'notes';

  const [activeTab, setActiveTab] = useState(initialTab);
  const [subject, setSubject] = useState(null);
  const [notes, setNotes] = useState([]);
  const [questionBanks, setQuestionBanks] = useState([]);
  const [previousPapers, setPreviousPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterQuery, setFilterQuery] = useState('');
  const [selectedUnit, setSelectedUnit] = useState('ALL');
  const [downloadingId, setDownloadingId] = useState(null);
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());

  useEffect(() => {
    loadSubjectData();
  }, [id]);

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['notes', 'qb', 'papers'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const loadSubjectData = async () => {
    try {
      setLoading(true);
      const [subjRes, notesRes, qbRes, papersRes] = await Promise.all([
        api.subjects.getById(id),
        api.subjects.getNotes(id),
        api.subjects.getQuestionBanks(id),
        api.subjects.getPreviousPapers(id)
      ]);

      setSubject(subjRes);
      setNotes(notesRes || []);
      setQuestionBanks(qbRes || []);
      setPreviousPapers(papersRes || []);
    } catch (err) {
      console.error('Failed to load subject resources:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const handleDownload = async (note) => {
    try {
      setDownloadingId(note.id);
      await api.notes.download(note.id);
      // Update local download count
      setNotes((prev) =>
        prev.map((n) => (n.id === note.id ? { ...n, downloadCount: (n.downloadCount || 0) + 1 } : n))
      );
    } catch (err) {
      console.error('Download failed:', err);
    } finally {
      setDownloadingId(null);
    }
  };

  const toggleBookmark = async (noteId) => {
    try {
      const res = await api.notes.bookmark(noteId);
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
    const matchesSearch = n.title?.toLowerCase().includes(filterQuery.toLowerCase()) ||
      n.description?.toLowerCase().includes(filterQuery.toLowerCase());
    const matchesUnit = selectedUnit === 'ALL' || String(n.unit) === selectedUnit;
    return matchesSearch && matchesUnit;
  });

  const filteredQBs = questionBanks.filter((qb) => {
    const matchesSearch = qb.title?.toLowerCase().includes(filterQuery.toLowerCase()) ||
      qb.questionText?.toLowerCase().includes(filterQuery.toLowerCase());
    const matchesUnit = selectedUnit === 'ALL' || String(qb.unit) === selectedUnit;
    return matchesSearch && matchesUnit;
  });

  const filteredPapers = previousPapers.filter((p) => {
    return p.title?.toLowerCase().includes(filterQuery.toLowerCase()) ||
      String(p.examYear).includes(filterQuery);
  });

  return (
    <StudentLayout>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>
        
        {/* Navigation & Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link
            to={subject?.semesterId ? `/semesters/${subject.semesterId}` : '/semesters'}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: '#94A3B8',
              fontSize: '13px',
              textDecoration: 'none'
            }}
          >
            <ArrowLeft size={16} /> Back to Semester
          </Link>
          <span style={{ color: '#475569' }}>/</span>
          <span style={{ color: '#38BDF8', fontSize: '13px', fontWeight: '700' }}>
            {subject?.code || 'Subject'}
          </span>
        </div>

        {/* Subject Header Banner */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.25) 0%, rgba(6, 182, 212, 0.15) 100%)',
            border: '1px solid rgba(124, 58, 237, 0.3)',
            borderRadius: '24px',
            padding: '32px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: '800', padding: '4px 10px', borderRadius: '6px', background: 'rgba(6, 182, 212, 0.2)', color: '#22D3EE', border: '1px solid rgba(6, 182, 212, 0.3)' }}>
                  {subject?.code}
                </span>
                <span style={{ fontSize: '12px', color: '#94A3B8', fontWeight: '600' }}>
                  {subject?.credits || 4} Credits • {subject?.department || 'CSE'}
                </span>
              </div>
              <h1 style={{ fontSize: '28px', fontWeight: '900', color: '#F8FAFC', margin: '0 0 8px 0' }}>
                {subject?.name}
              </h1>
              <p style={{ color: '#94A3B8', fontSize: '14px', maxWidth: '750px', lineHeight: 1.6, margin: 0 }}>
                {subject?.description}
              </p>
            </div>

            {/* Quick Stats Pills */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '8px 14px', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '18px', fontWeight: '900', color: '#C4B5FD' }}>{notes.length}</div>
                <div style={{ fontSize: '10px', color: '#94A3B8', textTransform: 'uppercase', fontWeight: '700' }}>Notes</div>
              </div>
              <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '8px 14px', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '18px', fontWeight: '900', color: '#67E8F9' }}>{questionBanks.length}</div>
                <div style={{ fontSize: '10px', color: '#94A3B8', textTransform: 'uppercase', fontWeight: '700' }}>Questions</div>
              </div>
              <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '8px 14px', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '18px', fontWeight: '900', color: '#FCD34D' }}>{previousPapers.length}</div>
                <div style={{ fontSize: '10px', color: '#94A3B8', textTransform: 'uppercase', fontWeight: '700' }}>Papers</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Switcher & Filter Bar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            {/* Tabs */}
            <div style={{ display: 'flex', gap: '8px', background: 'rgba(15, 23, 42, 0.8)', padding: '6px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <button
                onClick={() => handleTabChange('notes')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 18px',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: '700',
                  border: 'none',
                  cursor: 'pointer',
                  background: activeTab === 'notes' ? 'linear-gradient(135deg, #7C3AED 0%, #6366F1 100%)' : 'transparent',
                  color: activeTab === 'notes' ? '#FFFFFF' : '#94A3B8',
                  transition: 'all 0.2s ease'
                }}
              >
                <FileText size={16} /> Notes ({notes.length})
              </button>

              <button
                onClick={() => handleTabChange('qb')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 18px',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: '700',
                  border: 'none',
                  cursor: 'pointer',
                  background: activeTab === 'qb' ? 'linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)' : 'transparent',
                  color: activeTab === 'qb' ? '#FFFFFF' : '#94A3B8',
                  transition: 'all 0.2s ease'
                }}
              >
                <HelpCircle size={16} /> Question Bank ({questionBanks.length})
              </button>

              <button
                onClick={() => handleTabChange('papers')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 18px',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: '700',
                  border: 'none',
                  cursor: 'pointer',
                  background: activeTab === 'papers' ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' : 'transparent',
                  color: activeTab === 'papers' ? '#FFFFFF' : '#94A3B8',
                  transition: 'all 0.2s ease'
                }}
              >
                <BookOpen size={16} /> Previous Papers ({previousPapers.length})
              </button>
            </div>

            {/* Unit Filter (For Notes and QB) */}
            {activeTab !== 'papers' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '12px', color: '#94A3B8', fontWeight: '600' }}>Unit:</span>
                {['ALL', '1', '2', '3', '4', '5'].map((u) => (
                  <button
                    key={u}
                    onClick={() => setSelectedUnit(u)}
                    style={{
                      background: selectedUnit === u ? 'rgba(124, 58, 237, 0.4)' : 'rgba(255, 255, 255, 0.06)',
                      border: selectedUnit === u ? '1px solid #7C3AED' : '1px solid rgba(255, 255, 255, 0.1)',
                      color: selectedUnit === u ? '#FFFFFF' : '#94A3B8',
                      borderRadius: '8px',
                      padding: '4px 10px',
                      fontSize: '11px',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    {u === 'ALL' ? 'All Units' : `U${u}`}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Search inside subject */}
          <div style={{ position: 'relative', maxWidth: '400px' }}>
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder={`Filter ${activeTab}...`}
              style={{
                width: '100%',
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '10px 14px 10px 38px',
                color: '#FFFFFF',
                fontSize: '13px',
                outline: 'none'
              }}
            />
            <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '12px', pointerEvents: 'none' }} />
          </div>
        </div>

        {/* TAB 1: ACADEMIC NOTES */}
        {activeTab === 'notes' && (
          <div>
            {loading ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#94A3B8' }}>Loading notes...</div>
            ) : filteredNotes.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', background: 'rgba(15, 23, 42, 0.5)', borderRadius: '16px', color: '#94A3B8' }}>
                No notes found matching your criteria.
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '18px' }}>
                {filteredNotes.map((note) => (
                  <div
                    key={note.id}
                    style={{
                      background: 'rgba(15, 23, 42, 0.6)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '18px',
                      padding: '22px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '11px', fontWeight: '800', background: 'rgba(124, 58, 237, 0.25)', color: '#C4B5FD', padding: '3px 8px', borderRadius: '6px' }}>
                            Unit {note.unit}
                          </span>
                          <span style={{ fontSize: '11px', color: '#64748B' }}>{(note.fileSize / 1024).toFixed(0)} KB PDF</span>
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
                      <p style={{ fontSize: '12px', color: '#94A3B8', lineHeight: 1.5, margin: 0 }}>
                        {note.description}
                      </p>
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
                          <Eye size={13} /> View
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
        )}

        {/* TAB 2: QUESTION BANK */}
        {activeTab === 'qb' && (
          <div>
            {filteredQBs.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', background: 'rgba(15, 23, 42, 0.5)', borderRadius: '16px', color: '#94A3B8' }}>
                No question bank entries found.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {filteredQBs.map((qb) => (
                  <div
                    key={qb.id}
                    style={{
                      background: 'rgba(15, 23, 42, 0.6)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '16px',
                      padding: '20px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '11px', fontWeight: '800', background: 'rgba(6, 182, 212, 0.2)', color: '#67E8F9', padding: '3px 8px', borderRadius: '6px' }}>
                          {qb.category || 'Important'}
                        </span>
                        <span style={{ fontSize: '11px', color: '#94A3B8' }}>Unit {qb.unit}</span>
                      </div>
                      <span style={{ fontSize: '11px', color: qb.difficulty === 'HARD' ? '#F87171' : qb.difficulty === 'MEDIUM' ? '#FBBF24' : '#34D399', fontWeight: '800' }}>
                        {qb.difficulty}
                      </span>
                    </div>

                    <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#F8FAFC', margin: '0 0 6px 0' }}>
                      {qb.title}
                    </h4>
                    <p style={{ fontSize: '13px', color: '#94A3B8', margin: 0, lineHeight: 1.5 }}>
                      {qb.questionText || qb.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: PREVIOUS YEAR SOLVED PAPERS */}
        {activeTab === 'papers' && (
          <div>
            {filteredPapers.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', background: 'rgba(15, 23, 42, 0.5)', borderRadius: '16px', color: '#94A3B8' }}>
                No previous year papers found.
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '18px' }}>
                {filteredPapers.map((paper) => (
                  <div
                    key={paper.id}
                    style={{
                      background: 'rgba(15, 23, 42, 0.6)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '18px',
                      padding: '22px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                        <span style={{ fontSize: '11px', fontWeight: '800', background: 'rgba(245, 158, 11, 0.2)', color: '#FCD34D', padding: '3px 8px', borderRadius: '6px' }}>
                          {paper.examYear} {paper.examType}
                        </span>
                        <span style={{ fontSize: '11px', color: '#94A3B8' }}>SEE Solved Paper</span>
                      </div>

                      <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#F8FAFC', margin: '0 0 8px 0' }}>
                        {paper.title}
                      </h3>
                    </div>

                    <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '11px', color: '#64748B' }}>Official VTU Paper</span>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => window.open(api.previousPapers.viewUrl(paper.id), '_blank')}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            background: 'rgba(255, 255, 255, 0.08)',
                            color: '#F8FAFC',
                            border: '1px solid rgba(255, 255, 255, 0.12)',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            fontSize: '12px',
                            fontWeight: '700',
                            cursor: 'pointer'
                          }}
                          title="View PDF"
                        >
                          <Eye size={12} /> View
                        </button>
                        <button
                          onClick={() => api.previousPapers.download(paper.id, paper.title)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                            color: '#FFFFFF',
                            border: 'none',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            fontSize: '12px',
                            fontWeight: '700',
                            cursor: 'pointer'
                          }}
                          title="Download PDF"
                        >
                          <Download size={12} /> Download
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </StudentLayout>
  );
};
