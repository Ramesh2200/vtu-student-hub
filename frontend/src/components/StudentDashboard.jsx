import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  BookOpen,
  FileText,
  FileCheck2,
  Bookmark,
  Briefcase,
  Calendar,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Download,
  Eye,
  CheckCircle2,
  Award,
  Clock,
  ChevronRight
} from 'lucide-react';

export const StudentDashboard = () => {
  const {
    currentUser,
    subjects,
    notes,
    events,
    jobs,
    questionPapers,
    setActiveTab,
    setPdfViewerData,
    toggleBookmarkNote
  } = useApp();

  const [resourceFilter, setResourceFilter] = useState('Newest');

  // Filter resources
  let recentResources = [...notes];
  if (resourceFilter === 'Popular') {
    recentResources.sort((a, b) => b.downloads - a.downloads);
  } else if (resourceFilter === 'Bookmarked') {
    recentResources = recentResources.filter(n => n.isBookmarked);
  }

  const bookmarkedCount = notes.filter(n => n.isBookmarked).length;
  const appliedJobsCount = jobs.filter(j => j.status !== 'Saved').length;
  const registeredEventsCount = events.filter(e => e.registered).length;

  const stats = [
    { label: 'Active Subjects', value: subjects.length, sub: '6th Sem 2022 Scheme', icon: BookOpen, color: '#6C5CE7', tab: 'academics' },
    { label: 'Verified Notes', value: 26, sub: 'Available for Semester', icon: FileText, color: '#4F8CFF', tab: 'notes' },
    { label: 'Question Papers', value: 10, sub: 'SEE & CIE Solved', icon: FileCheck2, color: '#22D3EE', tab: 'papers' },
    { label: 'Saved Bookmarks', value: bookmarkedCount, sub: 'Quick Access', icon: Bookmark, color: '#F59E0B', tab: 'notes' },
    { label: 'Job Applications', value: appliedJobsCount, sub: 'Active Pipeline', icon: Briefcase, color: '#10B981', tab: 'placements' },
    { label: 'Upcoming Events', value: registeredEventsCount, sub: 'Passes Confirmed', icon: Calendar, color: '#EC4899', tab: 'events' }
  ];

  return (
    <div style={{ padding: '32px 28px', maxWidth: '1440px', margin: '0 auto', width: '100%' }}>
      
      {/* 23. DASHBOARD HERO */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(108, 92, 231, 0.2) 0%, rgba(79, 140, 255, 0.12) 100%), #111827',
        border: '1px solid rgba(108, 92, 231, 0.3)',
        borderRadius: '24px',
        padding: '36px 32px',
        marginBottom: '32px',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '24px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Glow accent */}
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '240px',
          height: '240px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(108, 92, 231, 0.4) 0%, transparent 70%)',
          filter: 'blur(40px)',
          pointerEvents: 'none'
        }} />

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span className="badge badge-primary">
              {currentUser.scheme}
            </span>
            <span className="badge badge-accent">
              Semester {currentUser.semester} • {currentUser.branchCode}
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(1.8rem, 3.2vw, 2.5rem)',
            fontWeight: 800,
            color: '#F8FAFC',
            marginBottom: '8px',
            lineHeight: 1.2
          }}>
            Good morning, {currentUser.name.split(' ')[0]} 👋
          </h1>

          <p style={{ fontSize: '1rem', color: '#94A3B8', maxWidth: '640px', lineHeight: 1.5 }}>
            Here’s what’s happening in your VTU journey today at <strong style={{ color: '#E2E8F0' }}>{currentUser.college}</strong>.
          </p>

          <div style={{ display: 'flex', gap: '20px', marginTop: '16px', fontSize: '0.85rem', color: '#CBD5E1' }}>
            <div>USN: <strong style={{ color: '#F8FAFC' }}>{currentUser.usn}</strong></div>
            <div>•</div>
            <div>Graduation: <strong style={{ color: '#F8FAFC' }}>{currentUser.graduationYear}</strong></div>
            <div>•</div>
            <div>Current CGPA: <strong style={{ color: '#10B981' }}>{currentUser.cgpa} / 10</strong></div>
          </div>
        </div>

        {/* Profile Completion Meter */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '20px',
          minWidth: '220px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#E2E8F0' }}>Profile Completion</span>
            <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#A78BFA' }}>{currentUser.profileCompletion}%</span>
          </div>
          <div style={{ width: '100%', height: '8px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ width: `${currentUser.profileCompletion}%`, height: '100%', background: 'linear-gradient(90deg, #6C5CE7, #22D3EE)', borderRadius: '4px' }} />
          </div>
          <button
            onClick={() => setActiveTab('profile')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              marginTop: '12px',
              fontSize: '0.8rem',
              color: '#67E8F9',
              fontWeight: 600
            }}
          >
            <span>Complete Profile Details</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>

      {/* 24. DASHBOARD STATISTICS CARDS */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '16px',
        marginBottom: '36px'
      }}>
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              onClick={() => setActiveTab(s.tab)}
              className="glass-card"
              style={{
                padding: '20px',
                borderRadius: '16px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: `${s.color}18`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Icon size={20} color={s.color} />
                </div>
                <ArrowRight size={14} color="#64748B" />
              </div>
              <div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#F8FAFC', lineHeight: 1.1 }}>
                  {s.value}
                </div>
                <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#CBD5E1', marginTop: '4px' }}>
                  {s.label}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#64748B' }}>
                  {s.sub}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 25. ACADEMIC DASHBOARD: Current Semester Subjects */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#F8FAFC' }}>
              Current Semester Courses ({currentUser.branchCode} - Sem {currentUser.semester})
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#94A3B8' }}>
              Track course coverage, module notes, and previous year examination question papers.
            </p>
          </div>

          <button
            onClick={() => setActiveTab('academics')}
            style={{
              fontSize: '0.85rem',
              color: '#A78BFA',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <span>View Full Syllabus</span>
            <ChevronRight size={16} />
          </button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px'
        }}>
          {subjects.map((sub) => (
            <div
              key={sub.id}
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span className="badge badge-primary" style={{ fontSize: '0.75rem' }}>
                    {sub.code}
                  </span>
                  <span style={{ fontSize: '0.78rem', color: '#94A3B8', fontWeight: 600 }}>
                    {sub.credits} Credits • {sub.category}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#F8FAFC', marginBottom: '14px', lineHeight: 1.3 }}>
                  {sub.name}
                </h3>

                {/* Progress bar */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '6px' }}>
                    <span style={{ color: '#94A3B8' }}>Module Progress</span>
                    <span style={{ color: '#22D3EE', fontWeight: 700 }}>{sub.progress}%</span>
                  </div>
                  <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${sub.progress}%`, height: '100%', background: 'linear-gradient(90deg, #6C5CE7, #22D3EE)', borderRadius: '3px' }} />
                  </div>
                </div>

                {/* Quick counts */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '12px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  marginBottom: '16px',
                  fontSize: '0.78rem',
                  color: '#CBD5E1'
                }}>
                  <div>
                    <span style={{ color: '#94A3B8', display: 'block' }}>Notes</span>
                    <strong style={{ color: '#F8FAFC' }}>{sub.resourcesCount}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#94A3B8', display: 'block' }}>Papers</span>
                    <strong style={{ color: '#F8FAFC' }}>{sub.papersCount}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#94A3B8', display: 'block' }}>Key Qs</span>
                    <strong style={{ color: '#F8FAFC' }}>{sub.importantQuestionsCount}</strong>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('academics')}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.06)',
                  color: '#F8FAFC',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <span>Open Subject Hub</span>
                <ArrowRight size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 26 & 27. TWO COLUMN LAYOUT: Recent Resources & Upcoming Events */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '28px' }}>
        
        {/* Recent Resources */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#F8FAFC' }}>
              Personalized Notes For You
            </h3>

            {/* Filter buttons */}
            <div style={{ display: 'flex', gap: '6px' }}>
              {['Newest', 'Popular', 'Bookmarked'].map(f => (
                <button
                  key={f}
                  onClick={() => setResourceFilter(f)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    background: resourceFilter === f ? 'rgba(108, 92, 231, 0.3)' : 'rgba(255, 255, 255, 0.05)',
                    color: resourceFilter === f ? '#A78BFA' : '#94A3B8',
                    border: resourceFilter === f ? '1px solid rgba(108, 92, 231, 0.4)' : 'none'
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {recentResources.slice(0, 4).map((n) => (
              <div
                key={n.id}
                className="glass-card"
                style={{
                  padding: '16px 20px',
                  borderRadius: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '14px'
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span className="badge badge-primary" style={{ fontSize: '0.68rem', padding: '2px 6px' }}>
                      {n.subjectCode}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
                      Module {n.moduleNumber} • {n.fileSize}
                    </span>
                  </div>
                  <div style={{
                    fontSize: '0.92rem',
                    fontWeight: 700,
                    color: '#F8FAFC',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {n.title}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                    By {n.author} • ⭐ {n.rating} ({n.downloads} downloads)
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                  <button
                    onClick={() => toggleBookmarkNote(n.id)}
                    style={{
                      padding: '8px',
                      borderRadius: '8px',
                      background: n.isBookmarked ? 'rgba(108, 92, 231, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                      color: n.isBookmarked ? '#A78BFA' : '#94A3B8'
                    }}
                  >
                    <Bookmark size={15} fill={n.isBookmarked ? '#A78BFA' : 'none'} />
                  </button>

                  <button
                    onClick={() => setPdfViewerData(n)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '8px',
                      background: '#6C5CE7',
                      color: '#FFFFFF',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Eye size={14} />
                    <span>View</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events Timeline */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#F8FAFC' }}>
              Upcoming Timeline & Deadlines
            </h3>
            <button
              onClick={() => setActiveTab('events')}
              style={{ fontSize: '0.82rem', color: '#22D3EE', fontWeight: 600 }}
            >
              All Events →
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {events.slice(0, 3).map((evt) => (
              <div
                key={evt.id}
                className="glass-card"
                style={{
                  padding: '16px 20px',
                  borderRadius: '14px',
                  display: 'flex',
                  gap: '16px',
                  alignItems: 'center'
                }}
              >
                {/* Visual Date Badge */}
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '12px',
                  background: 'rgba(34, 211, 238, 0.1)',
                  border: '1px solid rgba(34, 211, 238, 0.3)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#22D3EE', textTransform: 'uppercase' }}>
                    {evt.category.slice(0, 4)}
                  </span>
                  <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#F8FAFC' }}>
                    {evt.date.match(/\d+/)?.[0] || '18'}
                  </span>
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#F8FAFC', marginBottom: '3px' }}>
                    {evt.title}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                    {evt.date} • {evt.mode}
                  </div>
                  {evt.prizePool && (
                    <div style={{ fontSize: '0.72rem', color: '#F59E0B', fontWeight: 600, marginTop: '2px' }}>
                      🏆 {evt.prizePool}
                    </div>
                  )}
                </div>

                {evt.registered ? (
                  <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>
                    Registered
                  </span>
                ) : (
                  <button
                    onClick={() => setActiveTab('events')}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      background: 'rgba(255, 255, 255, 0.08)',
                      color: '#CBD5E1',
                      fontSize: '0.78rem',
                      fontWeight: 600
                    }}
                  >
                    Details
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
