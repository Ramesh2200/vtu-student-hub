import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Briefcase,
  MapPin,
  Calendar,
  DollarSign,
  ChevronRight,
  Bookmark,
  CheckCircle,
  ExternalLink,
  Layers,
  ArrowRight,
  Sparkles,
  MoveRight
} from 'lucide-react';

export const PlacementsPage = () => {
  const { jobs, updateJobStatus } = useApp();
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' | 'list'
  const [filterType, setFilterType] = useState('All');

  const kanbanColumns = [
    { id: 'Saved', title: 'Saved Jobs', color: '#64748B' },
    { id: 'Applied', title: 'Applied', color: '#4F8CFF' },
    { id: 'Shortlisted', title: 'Shortlisted', color: '#6C5CE7' },
    { id: 'Interview', title: 'Interview Round', color: '#22D3EE' },
    { id: 'Selected', title: 'Offer Received', color: '#10B981' }
  ];

  const filteredJobs = jobs.filter(j => {
    if (filterType === 'Internship' && j.type !== 'Internship') return false;
    if (filterType === 'Job' && j.type !== 'Job') return false;
    return true;
  });

  const getNextStatus = (current) => {
    switch (current) {
      case 'Saved': return 'Applied';
      case 'Applied': return 'Shortlisted';
      case 'Shortlisted': return 'Interview';
      case 'Interview': return 'Selected';
      default: return 'Saved';
    }
  };

  return (
    <div style={{ padding: '32px 28px', maxWidth: '1440px', margin: '0 auto', width: '100%' }}>
      
      {/* 37. PLACEMENTS HEADER */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px',
        marginBottom: '28px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <Sparkles size={16} color="#A78BFA" />
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#A78BFA' }}>
              VTU Centralized Placement Cell
            </span>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#F8FAFC', marginBottom: '4px' }}>
            Placements & Application Tracker
          </h1>
          <p style={{ fontSize: '0.95rem', color: '#94A3B8' }}>
            Track campus drives, Tier-1 MNC hiring, and summer internships with live Kanban workflow.
          </p>
        </div>

        {/* View mode toggle */}
        <div style={{ display: 'flex', gap: '8px', background: 'rgba(255, 255, 255, 0.05)', padding: '4px', borderRadius: '12px' }}>
          <button
            onClick={() => setViewMode('kanban')}
            style={{
              padding: '8px 18px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 600,
              background: viewMode === 'kanban' ? '#6C5CE7' : 'transparent',
              color: viewMode === 'kanban' ? '#FFFFFF' : '#94A3B8'
            }}
          >
            Kanban Board
          </button>
          <button
            onClick={() => setViewMode('list')}
            style={{
              padding: '8px 18px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 600,
              background: viewMode === 'list' ? '#6C5CE7' : 'transparent',
              color: viewMode === 'list' ? '#FFFFFF' : '#94A3B8'
            }}
          >
            All Listings ({jobs.length})
          </button>
        </div>
      </div>

      {/* 38. KANBAN-STYLE APPLICATION TRACKER */}
      {viewMode === 'kanban' ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '16px',
          alignItems: 'flex-start',
          overflowX: 'auto',
          paddingBottom: '20px'
        }}>
          {kanbanColumns.map(col => {
            const columnJobs = jobs.filter(j => j.status === col.id);
            return (
              <div
                key={col.id}
                style={{
                  background: '#111827',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '16px',
                  padding: '18px',
                  minHeight: '520px',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                {/* Column Header */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '16px',
                  paddingBottom: '12px',
                  borderBottom: `2px solid ${col.color}`
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#F8FAFC' }}>
                      {col.title}
                    </span>
                  </div>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    color: '#E2E8F0'
                  }}>
                    {columnJobs.length}
                  </span>
                </div>

                {/* Cards inside column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
                  {columnJobs.length === 0 ? (
                    <div style={{
                      textAlign: 'center',
                      padding: '40px 10px',
                      color: '#64748B',
                      fontSize: '0.8rem',
                      fontStyle: 'italic'
                    }}>
                      No roles in {col.title}
                    </div>
                  ) : (
                    columnJobs.map(job => (
                      <div
                        key={job.id}
                        className="glass-card"
                        style={{
                          padding: '16px',
                          borderRadius: '12px',
                          background: 'rgba(255, 255, 255, 0.03)',
                          border: '1px solid rgba(255, 255, 255, 0.06)'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                          <div style={{ width: '28px', height: '28px', background: '#FFF', borderRadius: '6px', padding: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <img src={job.logo} alt={job.company} style={{ maxWidth: '100%', maxHeight: '100%' }} />
                          </div>
                          <div>
                            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#F8FAFC' }}>{job.company}</div>
                            <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>{job.type}</div>
                          </div>
                        </div>

                        <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#E2E8F0', marginBottom: '8px', lineHeight: 1.3 }}>
                          {job.role}
                        </div>

                        <div style={{ fontSize: '0.78rem', color: '#10B981', fontWeight: 700, marginBottom: '8px' }}>
                          💰 {job.stipend}
                        </div>

                        <div style={{ fontSize: '0.72rem', color: '#94A3B8', marginBottom: '12px' }}>
                          📍 {job.location}
                        </div>

                        {/* Move stage button */}
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          paddingTop: '8px',
                          borderTop: '1px solid rgba(255, 255, 255, 0.06)'
                        }}>
                          <span style={{ fontSize: '0.68rem', color: '#64748B' }}>
                            {job.appliedDate ? `Applied: ${job.appliedDate}` : 'Not applied yet'}
                          </span>

                          <button
                            onClick={() => updateJobStatus(job.id, getNextStatus(job.status))}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '4px 8px',
                              borderRadius: '6px',
                              background: 'rgba(108, 92, 231, 0.2)',
                              border: '1px solid rgba(108, 92, 231, 0.3)',
                              color: '#A78BFA',
                              fontSize: '0.72rem',
                              fontWeight: 600
                            }}
                            title={`Advance to ${getNextStatus(job.status)}`}
                          >
                            <span>Move</span>
                            <MoveRight size={12} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        /* LIST VIEW */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
          {filteredJobs.map(job => (
            <div
              key={job.id}
              className="glass-card"
              style={{
                padding: '24px',
                borderRadius: '16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '36px', height: '36px', background: '#FFF', borderRadius: '8px', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img src={job.logo} alt={job.company} style={{ maxWidth: '100%', maxHeight: '100%' }} />
                    </div>
                    <div>
                      <div style={{ fontSize: '1rem', fontWeight: 700, color: '#F8FAFC' }}>{job.company}</div>
                      <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{job.employmentType}</div>
                    </div>
                  </div>
                  <span className="badge badge-success">{job.stipend}</span>
                </div>

                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#F8FAFC', marginBottom: '8px' }}>
                  {job.role}
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#94A3B8', marginBottom: '16px', lineHeight: 1.5 }}>
                  {job.description}
                </p>

                <div style={{ fontSize: '0.8rem', color: '#CBD5E1', marginBottom: '8px' }}>
                  <strong>Eligibility:</strong> {job.eligibility}
                </div>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '16px',
                borderTop: '1px solid rgba(255, 255, 255, 0.06)'
              }}>
                <span className="badge badge-primary">{job.status}</span>
                <button
                  onClick={() => updateJobStatus(job.id, 'Applied')}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    background: job.status === 'Applied' ? 'rgba(255,255,255,0.1)' : '#6C5CE7',
                    color: '#FFFFFF',
                    fontSize: '0.82rem',
                    fontWeight: 600
                  }}
                >
                  {job.status === 'Applied' ? 'Applied' : 'Apply Now'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
