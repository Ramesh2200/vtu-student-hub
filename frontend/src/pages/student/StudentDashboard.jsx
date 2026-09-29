import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  FileText,
  HelpCircle,
  BookOpen,
  Briefcase,
  Download,
  Bookmark,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle,
  Search,
  ExternalLink,
  Flame,
  Award,
  BellRing
} from 'lucide-react';
import { api, authStorage } from '../../services/api';
import { StudentLayout } from '../../components/StudentLayout';

export const StudentDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => authStorage.getUser());
  const [semesters, setSemesters] = useState([]);
  const [recentNotes, setRecentNotes] = useState([]);
  const [questionBanks, setQuestionBanks] = useState([]);
  const [previousPapers, setPreviousPapers] = useState([]);
  const [placements, setPlacements] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dashboardSearch, setDashboardSearch] = useState('');

  useEffect(() => {
    setUser(authStorage.getUser());
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [semsRes, notesRes, qbRes, papersRes, placRes, annRes] = await Promise.allSettled([
        api.semesters.getAll(),
        api.notes.getAll({ limit: 4 }),
        api.questionBanks.getAll({ limit: 4 }),
        api.previousPapers.getAll({ limit: 4 }),
        api.placements.getAll({ activeOnly: true }),
        api.announcements.getAll()
      ]);

      if (semsRes.status === 'fulfilled' && Array.isArray(semsRes.value)) {
        setSemesters(semsRes.value);
      }
      if (notesRes.status === 'fulfilled' && Array.isArray(notesRes.value)) {
        setRecentNotes(notesRes.value.slice(0, 4));
      }
      if (qbRes.status === 'fulfilled' && Array.isArray(qbRes.value)) {
        setQuestionBanks(qbRes.value.slice(0, 4));
      }
      if (papersRes.status === 'fulfilled' && Array.isArray(papersRes.value)) {
        setPreviousPapers(papersRes.value.slice(0, 4));
      }
      if (placRes.status === 'fulfilled' && Array.isArray(placRes.value)) {
        setPlacements(placRes.value.slice(0, 3));
      }
      if (annRes.status === 'fulfilled' && Array.isArray(annRes.value)) {
        setAnnouncements(annRes.value.slice(0, 3));
      }
    } catch (err) {
      console.error('Failed to load dashboard telemetry:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (dashboardSearch.trim()) {
      navigate(`/notes?q=${encodeURIComponent(dashboardSearch.trim())}`);
    }
  };

  const profile = user?.profile || {
    fullName: user?.fullName || 'VTU Scholar',
    usn: user?.usn || '1MS21CS042',
    branch: 'Computer Science',
    semester: 6,
    college: 'MSRIT, Bengaluru'
  };

  return (
    <StudentLayout>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
        
        {/* Welcome Banner & Quick Search */}
        <section
          style={{
            background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.22) 0%, rgba(6, 182, 212, 0.15) 100%)',
            border: '1px solid rgba(124, 58, 237, 0.3)',
            borderRadius: '24px',
            padding: '36px 32px',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '-60px',
              right: '-60px',
              width: '260px',
              height: '260px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(6, 182, 212, 0.25) 0%, transparent 70%)',
              filter: 'blur(30px)',
              pointerEvents: 'none'
            }}
          />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '999px', background: 'rgba(124, 58, 237, 0.25)', border: '1px solid rgba(124, 58, 237, 0.4)', marginBottom: '16px' }}>
              <Sparkles size={14} color="#A78BFA" />
              <span style={{ fontSize: '12px', fontWeight: '700', color: '#DDD6FE', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                VTU 2022 Scheme CBCS Portal
              </span>
            </div>

            <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#FFFFFF', marginBottom: '8px', letterSpacing: '-0.02em' }}>
              Welcome back, {profile.fullName}! 👋
            </h1>
            <p style={{ color: '#94A3B8', fontSize: '15px', maxWidth: '640px', lineHeight: 1.6, marginBottom: '24px' }}>
              Access VTU engineering notes, solved SEE previous papers, curated question banks, and verified placement drives for Semester {profile.semester || 6} {profile.branch || 'CSE'}.
            </p>

            {/* Quick Action Pill Bar */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '24px' }}>
              <Link
                to={`/semesters/${profile.semester || 6}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'linear-gradient(135deg, #7C3AED 0%, #6366F1 100%)',
                  color: '#FFFFFF',
                  padding: '10px 18px',
                  borderRadius: '12px',
                  fontSize: '13px',
                  fontWeight: '700',
                  textDecoration: 'none',
                  boxShadow: '0 4px 14px rgba(124, 58, 237, 0.35)'
                }}
              >
                <GraduationCap size={16} /> Jump to Semester {profile.semester || 6}
              </Link>
              <Link
                to="/placements"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#F8FAFC',
                  padding: '10px 18px',
                  borderRadius: '12px',
                  fontSize: '13px',
                  fontWeight: '600',
                  textDecoration: 'none'
                }}
              >
                <Briefcase size={16} color="#38BDF8" /> Active Placements
              </Link>
              <Link
                to="/chat"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#F8FAFC',
                  padding: '10px 18px',
                  borderRadius: '12px',
                  fontSize: '13px',
                  fontWeight: '600',
                  textDecoration: 'none'
                }}
              >
                <Flame size={16} color="#F59E0B" /> Study Discussion Rooms
              </Link>
            </div>

            {/* In-Banner Search */}
            <form onSubmit={handleSearchSubmit} style={{ display: 'flex', maxWidth: '580px', position: 'relative' }}>
              <input
                type="text"
                value={dashboardSearch}
                onChange={(e) => setDashboardSearch(e.target.value)}
                placeholder="Search subject code, note title (e.g., 21CS61, Cloud Computing)..."
                style={{
                  width: '100%',
                  background: 'rgba(11, 16, 32, 0.85)',
                  border: '1px solid rgba(255, 255, 255, 0.16)',
                  borderRadius: '14px',
                  padding: '14px 18px 14px 44px',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
              <Search size={18} color="#94A3B8" style={{ position: 'absolute', left: '16px', top: '16px', pointerEvents: 'none' }} />
              <button
                type="submit"
                style={{
                  position: 'absolute',
                  right: '6px',
                  top: '6px',
                  bottom: '6px',
                  background: 'linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '0 16px',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                Search
              </button>
            </form>
          </div>
        </section>

        {/* Announcements Strip */}
        {announcements.length > 0 && (
          <section
            style={{
              background: 'rgba(30, 41, 59, 0.5)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              borderRadius: '16px',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px'
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'rgba(56, 189, 248, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#38BDF8',
                flexShrink: 0
              }}
            >
              <BellRing size={20} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                <span style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', background: '#0284C7', color: '#FFFFFF', padding: '2px 8px', borderRadius: '4px' }}>
                  Official Alert
                </span>
                <span style={{ fontSize: '13px', fontWeight: '700', color: '#F8FAFC' }}>
                  {announcements[0]?.title}
                </span>
              </div>
              <p style={{ fontSize: '13px', color: '#94A3B8', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {announcements[0]?.content}
              </p>
            </div>
            <Link
              to="/notifications"
              style={{
                fontSize: '12px',
                fontWeight: '700',
                color: '#38BDF8',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                flexShrink: 0
              }}
            >
              View All <ArrowRight size={14} />
            </Link>
          </section>
        )}

        {/* SEMESTER CARDS (Semester 1 through Semester 8) */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#F8FAFC', margin: 0 }}>
                Academic Semesters (VTU 2022 Scheme)
              </h2>
              <p style={{ fontSize: '13px', color: '#94A3B8', margin: '4px 0 0' }}>
                Select your semester to access subjects, official unit-wise notes, and question banks.
              </p>
            </div>
            <Link
              to="/semesters"
              style={{ fontSize: '13px', fontWeight: '700', color: '#A78BFA', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              Browse All <ArrowRight size={14} />
            </Link>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: '16px'
            }}
          >
            {semesters.map((sem) => {
              const isCurrent = (profile.semester || 6) === sem.semesterNumber;
              return (
                <Link
                  key={sem.id}
                  to={`/semesters/${sem.id}`}
                  style={{
                    textDecoration: 'none',
                    background: isCurrent
                      ? 'linear-gradient(135deg, rgba(124, 58, 237, 0.25) 0%, rgba(15, 23, 42, 0.9) 100%)'
                      : 'rgba(30, 41, 59, 0.4)',
                    border: isCurrent
                      ? '1px solid rgba(124, 58, 237, 0.5)'
                      : '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '16px',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: '130px',
                    transition: 'all 0.2s ease',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.borderColor = 'rgba(124, 58, 237, 0.6)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = isCurrent ? 'rgba(124, 58, 237, 0.5)' : 'rgba(255, 255, 255, 0.08)';
                  }}
                >
                  {isCurrent && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        background: 'rgba(16, 185, 129, 0.2)',
                        border: '1px solid rgba(16, 185, 129, 0.4)',
                        color: '#34D399',
                        fontSize: '10px',
                        fontWeight: '800',
                        padding: '2px 8px',
                        borderRadius: '999px',
                        textTransform: 'uppercase'
                      }}
                    >
                      Enrolled
                    </div>
                  )}

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          background: 'linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#FFFFFF',
                          fontSize: '14px',
                          fontWeight: '800'
                        }}
                      >
                        {sem.semesterNumber}
                      </div>
                      <span style={{ fontSize: '16px', fontWeight: '800', color: '#F8FAFC' }}>
                        Semester {sem.semesterNumber}
                      </span>
                    </div>
                    <p style={{ fontSize: '12px', color: '#94A3B8', margin: 0, lineHeight: 1.4 }}>
                      {sem.description || 'Core subjects, lab manuals & study resources'}
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
                    <span style={{ fontSize: '12px', color: '#38BDF8', fontWeight: '600' }}>
                      {sem.subjectCount || 3} Subjects Available
                    </span>
                    <ArrowRight size={14} color="#94A3B8" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* TWO-COLUMN: RECENT NOTES & QUESTION BANKS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
          
          {/* Recent Notes */}
          <section
            style={{
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '20px',
              padding: '24px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(124, 58, 237, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#A78BFA' }}>
                  <FileText size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#F8FAFC', margin: 0 }}>Recent Academic Notes</h3>
                  <span style={{ fontSize: '12px', color: '#94A3B8' }}>Verified faculty-authored PDF materials</span>
                </div>
              </div>
              <Link to="/notes" style={{ fontSize: '12px', fontWeight: '700', color: '#38BDF8', textDecoration: 'none' }}>
                View All
              </Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {recentNotes.length === 0 ? (
                <div style={{ padding: '24px', textAlign: 'center', color: '#64748B', fontSize: '13px' }}>
                  Loading notes...
                </div>
              ) : (
                recentNotes.map((note) => (
                  <div
                    key={note.id}
                    style={{
                      background: 'rgba(30, 41, 59, 0.35)',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      borderRadius: '12px',
                      padding: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'border-color 0.2s ease'
                    }}
                  >
                    <div style={{ minWidth: 0, flex: 1, marginRight: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{ fontSize: '10px', fontWeight: '800', background: 'rgba(124, 58, 237, 0.2)', color: '#C4B5FD', padding: '2px 6px', borderRadius: '4px' }}>
                          Unit {note.unit}
                        </span>
                        <span style={{ fontSize: '10px', color: '#94A3B8' }}>{note.subjectCode || '21CS61'}</span>
                      </div>
                      <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#F8FAFC', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {note.title}
                      </h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px', fontSize: '11px', color: '#64748B' }}>
                        <span>{(note.fileSize / 1024).toFixed(0)} KB</span>
                        <span>•</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <Download size={11} /> {note.downloadCount || 0}
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Link
                        to={`/notes/${note.id}`}
                        style={{
                          background: 'rgba(255, 255, 255, 0.08)',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '8px 12px',
                          color: '#FFFFFF',
                          fontSize: '12px',
                          fontWeight: '700',
                          textDecoration: 'none'
                        }}
                      >
                        Read PDF
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Question Banks */}
          <section
            style={{
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '20px',
              padding: '24px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(6, 182, 212, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22D3EE' }}>
                  <HelpCircle size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#F8FAFC', margin: 0 }}>Subject Question Banks</h3>
                  <span style={{ fontSize: '12px', color: '#94A3B8' }}>Categorized 2M, 5M, 10M & FQAs</span>
                </div>
              </div>
              <Link to="/question-banks" style={{ fontSize: '12px', fontWeight: '700', color: '#38BDF8', textDecoration: 'none' }}>
                View All
              </Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {questionBanks.length === 0 ? (
                <div style={{ padding: '24px', textAlign: 'center', color: '#64748B', fontSize: '13px' }}>
                  Loading question banks...
                </div>
              ) : (
                questionBanks.map((qb) => (
                  <div
                    key={qb.id}
                    style={{
                      background: 'rgba(30, 41, 59, 0.35)',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      borderRadius: '12px',
                      padding: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div style={{ minWidth: 0, flex: 1, marginRight: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{ fontSize: '10px', fontWeight: '800', background: 'rgba(6, 182, 212, 0.2)', color: '#67E8F9', padding: '2px 6px', borderRadius: '4px' }}>
                          {qb.category || 'Important'}
                        </span>
                        <span style={{ fontSize: '10px', color: '#94A3B8' }}>Unit {qb.unit}</span>
                      </div>
                      <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#F8FAFC', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {qb.title}
                      </h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px', fontSize: '11px', color: '#64748B' }}>
                        <span>Difficulty: <strong style={{ color: '#E2E8F0' }}>{qb.difficulty}</strong></span>
                      </div>
                    </div>

                    <Link
                      to={`/question-banks`}
                      style={{
                        background: 'rgba(6, 182, 212, 0.15)',
                        border: '1px solid rgba(6, 182, 212, 0.3)',
                        borderRadius: '8px',
                        padding: '8px 12px',
                        color: '#38BDF8',
                        fontSize: '12px',
                        fontWeight: '700',
                        textDecoration: 'none'
                      }}
                    >
                      Inspect
                    </Link>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        {/* TWO-COLUMN: PREVIOUS YEAR PAPERS & UPCOMING PLACEMENTS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
          
          {/* Previous Year Papers */}
          <section
            style={{
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '20px',
              padding: '24px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FBBF24' }}>
                  <BookOpen size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#F8FAFC', margin: 0 }}>Solved SEE Papers</h3>
                  <span style={{ fontSize: '12px', color: '#94A3B8' }}>2022 - 2025 Semester End Exam Papers</span>
                </div>
              </div>
              <Link to="/previous-papers" style={{ fontSize: '12px', fontWeight: '700', color: '#38BDF8', textDecoration: 'none' }}>
                View All
              </Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {previousPapers.map((paper) => (
                <div
                  key={paper.id}
                  style={{
                    background: 'rgba(30, 41, 59, 0.35)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    padding: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ minWidth: 0, flex: 1, marginRight: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '10px', fontWeight: '800', background: 'rgba(245, 158, 11, 0.2)', color: '#FCD34D', padding: '2px 6px', borderRadius: '4px' }}>
                        {paper.examYear} {paper.examType}
                      </span>
                    </div>
                    <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#F8FAFC', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {paper.title}
                    </h4>
                  </div>

                  <Link
                    to={`/previous-papers`}
                    style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      color: '#F8FAFC',
                      fontSize: '12px',
                      fontWeight: '700',
                      textDecoration: 'none'
                    }}
                  >
                    View
                  </Link>
                </div>
              ))}
            </div>
          </section>

          {/* Upcoming Placement Drives */}
          <section
            style={{
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '20px',
              padding: '24px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#34D399' }}>
                  <Briefcase size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#F8FAFC', margin: 0 }}>Campus Placement Drives</h3>
                  <span style={{ fontSize: '12px', color: '#94A3B8' }}>Verified VTU-affiliated hiring opportunities</span>
                </div>
              </div>
              <Link to="/placements" style={{ fontSize: '12px', fontWeight: '700', color: '#38BDF8', textDecoration: 'none' }}>
                Explore All
              </Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {placements.map((plc) => (
                <div
                  key={plc.id}
                  style={{
                    background: 'rgba(30, 41, 59, 0.35)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    padding: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ minWidth: 0, flex: 1, marginRight: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '11px', fontWeight: '800', color: '#34D399' }}>
                        {plc.ctc || '₹14-22 LPA'}
                      </span>
                      <span style={{ fontSize: '10px', color: '#94A3B8' }}>{plc.location}</span>
                    </div>
                    <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#F8FAFC', margin: 0 }}>
                      {plc.jobRole}
                    </h4>
                    <span style={{ fontSize: '12px', color: '#A78BFA', fontWeight: '600' }}>{plc.companyName}</span>
                  </div>

                  <Link
                    to={`/placements/${plc.id}`}
                    style={{
                      background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                      borderRadius: '8px',
                      padding: '8px 14px',
                      color: '#FFFFFF',
                      fontSize: '12px',
                      fontWeight: '700',
                      textDecoration: 'none'
                    }}
                  >
                    Details
                  </Link>
                </div>
              ))}
            </div>
          </section>
        </div>

      </div>
    </StudentLayout>
  );
};
