import React, { useState, useEffect } from 'react';
import { BookOpen, Download, Eye, Search, Filter, Sparkles, Layers, Calendar } from 'lucide-react';
import { api } from '../../services/api';
import { StudentLayout } from '../../components/StudentLayout';

export const PreviousPapersPage = () => {
  const [papers, setPreviousPapers] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState('ALL');
  const [selectedExamType, setSelectedExamType] = useState('ALL');
  const [selectedSemester, setSelectedSemester] = useState('ALL');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [papersRes, semsRes] = await Promise.all([
        api.previousPapers.getAll(),
        api.semesters.getAll()
      ]);
      setPreviousPapers(papersRes || []);
      setSemesters(semsRes || []);
    } catch (err) {
      console.error('Failed to load previous year papers:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredPapers = papers.filter((p) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      !query ||
      p.title?.toLowerCase().includes(query) ||
      p.subjectCode?.toLowerCase().includes(query) ||
      p.subjectName?.toLowerCase().includes(query);

    const matchesYear = selectedYear === 'ALL' || String(p.examYear) === selectedYear;
    const matchesExamType = selectedExamType === 'ALL' || p.examType === selectedExamType;
    const matchesSem = selectedSemester === 'ALL' || String(p.semesterId) === selectedSemester;

    return matchesSearch && matchesYear && matchesExamType && matchesSem;
  });

  return (
    <StudentLayout>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '999px', background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.3)', marginBottom: '8px' }}>
              <Sparkles size={12} color="#FBBF24" />
              <span style={{ fontSize: '11px', fontWeight: '700', color: '#FDE68A', textTransform: 'uppercase' }}>
                VTU Semester End Exams (SEE)
              </span>
            </div>
            <h1 style={{ fontSize: '28px', fontWeight: '900', color: '#F8FAFC', margin: 0 }}>
              Previous Year Question Papers
            </h1>
            <p style={{ fontSize: '14px', color: '#94A3B8', margin: '6px 0 0' }}>
              Access solved and official VTU Semester End Exam question papers from 2022 to 2025.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: '700', background: 'rgba(245, 158, 11, 0.1)', color: '#FBBF24', padding: '8px 16px', borderRadius: '10px', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
              {filteredPapers.length} Question Papers
            </span>
          </div>
        </div>

        {/* Filters */}
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
            <div style={{ position: 'relative', flex: '1 1 280px' }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by subject code, title (e.g. 21CS61, Design Patterns)..."
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

            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
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
              <option value="ALL">All Exam Years</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
            </select>

            <select
              value={selectedExamType}
              onChange={(e) => setSelectedExamType(e.target.value)}
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
              <option value="ALL">All Exam Types</option>
              <option value="REGULAR">Regular SEE</option>
              <option value="SUPPLEMENTARY">Supplementary</option>
              <option value="SPECIAL">Special SEE</option>
            </select>

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
          </div>
        </div>

        {/* Papers Grid */}
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#94A3B8' }}>
            Loading previous papers database...
          </div>
        ) : filteredPapers.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', background: 'rgba(15, 23, 42, 0.5)', borderRadius: '20px', color: '#94A3B8' }}>
            <BookOpen size={48} color="#475569" style={{ marginBottom: '12px' }} />
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#F8FAFC', margin: '0 0 6px 0' }}>No papers found</h3>
            <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>Try clearing search criteria or choosing a different exam year.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
            {filteredPapers.map((paper) => (
              <div
                key={paper.id}
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
                  e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '11px', fontWeight: '800', background: 'rgba(245, 158, 11, 0.2)', color: '#FCD34D', padding: '3px 8px', borderRadius: '6px' }}>
                        {paper.examYear} {paper.examType}
                      </span>
                      <span style={{ fontSize: '11px', fontWeight: '800', background: 'rgba(6, 182, 212, 0.15)', color: '#22D3EE', padding: '3px 8px', borderRadius: '6px' }}>
                        {paper.subjectCode || '21CS61'}
                      </span>
                    </div>

                    <span style={{ fontSize: '11px', color: '#64748B' }}>
                      Sem {paper.semesterNumber || 6}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#F8FAFC', marginBottom: '8px', lineHeight: 1.4 }}>
                    {paper.title}
                  </h3>
                  <p style={{ fontSize: '12px', color: '#94A3B8', margin: '0 0 14px 0' }}>
                    {paper.description || 'Complete official VTU semester examination paper with question marking breakdowns.'}
                  </p>
                </div>

                <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '11px', color: '#64748B' }}>PDF Question Paper</span>

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
                        padding: '8px 12px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: '700',
                        cursor: 'pointer'
                      }}
                      title="View PDF Question Paper in browser tab"
                    >
                      <Eye size={13} /> View
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
                        padding: '8px 14px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)'
                      }}
                      title="Download PDF Question Paper"
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
