import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Briefcase,
  MapPin,
  Calendar,
  Sparkles,
  ArrowRight,
  Bookmark,
  CheckCircle,
  ExternalLink,
  DollarSign
} from 'lucide-react';

export const PlacementsSection = () => {
  const { jobs, updateJobStatus, setActiveTab, loginUser } = useApp();
  const [filterType, setFilterType] = useState('All');
  const [filterLocation, setFilterLocation] = useState('All');

  const filteredJobs = jobs.filter((j) => {
    if (filterType === 'Internship' && j.type !== 'Internship') return false;
    if (filterType === 'Full-time' && j.type !== 'Job') return false;
    if (filterLocation === 'Bengaluru' && !j.location.includes('Bengaluru')) return false;
    if (filterLocation === 'Remote' && !j.isRemote) return false;
    return true;
  });

  const handleApply = (jobId) => {
    updateJobStatus(jobId, 'Applied');
  };

  const handleSave = (jobId, currentStatus) => {
    if (currentStatus === 'Saved') {
      updateJobStatus(jobId, 'Applied');
    } else {
      updateJobStatus(jobId, 'Saved');
    }
  };

  return (
    <section id="placements" style={{
      padding: '100px 24px',
      background: 'linear-gradient(180deg, #111827 0%, #0B1020 100%)',
      position: 'relative',
      borderTop: '1px solid rgba(255, 255, 255, 0.06)'
    }}>
      <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
        
        {/* Section Header */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          maxWidth: '750px',
          margin: '0 auto 48px'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: '20px',
            background: 'rgba(99, 102, 241, 0.12)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            color: '#818CF8',
            fontSize: '0.85rem',
            fontWeight: 600,
            marginBottom: '16px'
          }}>
            <Sparkles size={16} />
            <span>VTU Centralized Placement Pipeline</span>
          </div>

          <h2 style={{
            fontSize: 'clamp(2rem, 3.5vw, 3rem)',
            fontWeight: 800,
            color: '#F8FAFC',
            letterSpacing: '-0.02em',
            marginBottom: '16px'
          }}>
            Campus Placement Drives & Internships
          </h2>

          <p style={{ fontSize: '1.05rem', color: '#94A3B8', lineHeight: 1.6 }}>
            Direct career postings for 2026/2027 VTU batches. Track your submissions in real-time with an interactive Kanban board.
          </p>
        </div>

        {/* Filter Controls */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          justifyContent: 'center',
          marginBottom: '36px'
        }}>
          {['All', 'Internship', 'Full-time'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              style={{
                padding: '8px 18px',
                borderRadius: '12px',
                fontSize: '0.85rem',
                fontWeight: 600,
                background: filterType === type ? '#6C5CE7' : 'rgba(255, 255, 255, 0.05)',
                color: filterType === type ? '#FFFFFF' : '#94A3B8',
                border: filterType === type ? 'none' : '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              {type}
            </button>
          ))}

          <div style={{ width: '1px', background: 'rgba(255, 255, 255, 0.1)', margin: '0 8px' }} />

          {['All', 'Bengaluru', 'Remote'].map((loc) => (
            <button
              key={loc}
              onClick={() => setFilterLocation(loc)}
              style={{
                padding: '8px 18px',
                borderRadius: '12px',
                fontSize: '0.85rem',
                fontWeight: 600,
                background: filterLocation === loc ? '#4F8CFF' : 'rgba(255, 255, 255, 0.05)',
                color: filterLocation === loc ? '#FFFFFF' : '#94A3B8',
                border: filterLocation === loc ? 'none' : '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              {loc === 'All' ? 'All Locations' : loc}
            </button>
          ))}
        </div>

        {/* Job Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px'
        }}>
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="glass-card"
              style={{
                padding: '24px',
                borderRadius: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative'
              }}
            >
              <div>
                {/* Header: Company & Bookmark */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '16px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '10px',
                      background: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '6px'
                    }}>
                      <img src={job.logo} alt={job.company} style={{ maxWidth: '100%', maxHeight: '100%' }} />
                    </div>
                    <div>
                      <div style={{ fontSize: '1rem', fontWeight: 700, color: '#F8FAFC' }}>
                        {job.company}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                        {job.employmentType}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSave(job.id, job.status)}
                    style={{
                      padding: '6px',
                      borderRadius: '8px',
                      background: job.status === 'Saved' ? 'rgba(108, 92, 231, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                      color: job.status === 'Saved' ? '#A78BFA' : '#94A3B8'
                    }}
                    title="Save Job"
                  >
                    <Bookmark size={18} fill={job.status === 'Saved' ? '#A78BFA' : 'none'} />
                  </button>
                </div>

                {/* Role Title */}
                <h3 style={{
                  fontSize: '1.15rem',
                  fontWeight: 700,
                  color: '#F8FAFC',
                  lineHeight: 1.35,
                  marginBottom: '10px'
                }}>
                  {job.role}
                </h3>

                {/* Package / Stipend Badge */}
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 10px',
                  borderRadius: '8px',
                  background: 'rgba(16, 185, 129, 0.12)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  color: '#6EE7B7',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  marginBottom: '14px'
                }}>
                  <DollarSign size={15} />
                  <span>{job.stipend}</span>
                </div>

                {/* Location & Deadline */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#CBD5E1' }}>
                    <MapPin size={14} color="#4F8CFF" />
                    <span>{job.location} {job.isRemote && '(Remote Option)'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#94A3B8' }}>
                    <Calendar size={14} color="#EF4444" />
                    <span>Apply by: <strong>{job.deadline}</strong></span>
                  </div>
                </div>

                {/* Skill tags */}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '18px' }}>
                  {job.skills.slice(0, 4).map((s) => (
                    <span
                      key={s}
                      style={{
                        fontSize: '0.7rem',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        color: '#94A3B8'
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '16px',
                borderTop: '1px solid rgba(255, 255, 255, 0.06)'
              }}>
                <span className={`badge ${
                  job.status === 'Selected' ? 'badge-success' :
                  job.status === 'Interview' ? 'badge-accent' :
                  job.status === 'Shortlisted' ? 'badge-primary' :
                  job.status === 'Applied' ? 'badge-secondary' : 'badge-primary'
                }`} style={{ fontSize: '0.72rem' }}>
                  {job.status}
                </span>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => { loginUser('student'); setActiveTab('placements'); }}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '8px',
                      background: 'rgba(255, 255, 255, 0.06)',
                      color: '#F8FAFC',
                      fontSize: '0.82rem',
                      fontWeight: 600
                    }}
                  >
                    View Details
                  </button>

                  <button
                    onClick={() => handleApply(job.id)}
                    disabled={job.status === 'Applied' || job.status === 'Interview' || job.status === 'Selected'}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      background: (job.status === 'Applied' || job.status === 'Interview' || job.status === 'Selected') ? 'rgba(255, 255, 255, 0.1)' : 'linear-gradient(135deg, #6C5CE7 0%, #4F8CFF 100%)',
                      color: '#FFFFFF',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      cursor: (job.status === 'Applied' || job.status === 'Interview' || job.status === 'Selected') ? 'default' : 'pointer'
                    }}
                  >
                    {job.status === 'Applied' ? 'Applied' : job.status === 'Interview' ? 'In Review' : job.status === 'Selected' ? 'Selected' : 'Apply Now'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Kanban Board Teaser Banner */}
        <div style={{
          marginTop: '48px',
          padding: '24px 32px',
          borderRadius: '20px',
          background: 'rgba(108, 92, 231, 0.1)',
          border: '1px solid rgba(108, 92, 231, 0.25)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px'
        }}>
          <div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#F8FAFC', marginBottom: '4px' }}>
              Want to manage your applications on an interactive Kanban board?
            </div>
            <div style={{ fontSize: '0.88rem', color: '#94A3B8' }}>
              Drag and track roles across Saved → Applied → Shortlisted → Interview → Selected stages.
            </div>
          </div>

          <button
            onClick={() => { loginUser('student'); setActiveTab('placements'); }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              borderRadius: '12px',
              background: '#6C5CE7',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '0.9rem'
            }}
          >
            <span>Open Application Kanban Tracker</span>
            <ArrowRight size={16} />
          </button>
        </div>

      </div>
    </section>
  );
};
