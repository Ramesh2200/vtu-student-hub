import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Calendar,
  Clock,
  MapPin,
  Trophy,
  Users,
  CheckCircle,
  Sparkles,
  ArrowRight,
  Filter
} from 'lucide-react';

export const EventsSection = () => {
  const { events, toggleRegisterEvent, setActiveTab, loginUser } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Hackathon', 'Workshop', 'Coding Contest', 'Career Session'];

  const filteredEvents = events.filter(evt => {
    if (selectedCategory !== 'All' && evt.category !== selectedCategory) return false;
    return true;
  });

  return (
    <section id="events" style={{
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
          maxWidth: '750px',
          margin: '0 auto 48px'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: '20px',
            background: 'rgba(236, 72, 153, 0.12)',
            border: '1px solid rgba(236, 72, 153, 0.3)',
            color: '#F472B6',
            fontSize: '0.85rem',
            fontWeight: 600,
            marginBottom: '16px'
          }}>
            <Sparkles size={16} />
            <span>State-Level Opportunities</span>
          </div>

          <h2 style={{
            fontSize: 'clamp(2rem, 3.5vw, 3rem)',
            fontWeight: 800,
            color: '#F8FAFC',
            letterSpacing: '-0.02em',
            marginBottom: '16px'
          }}>
            Hackathons, Workshops & Tech Fests
          </h2>

          <p style={{ fontSize: '1.05rem', color: '#94A3B8', lineHeight: 1.6 }}>
            Discover upcoming flagship competitions across VTU affiliated campuses. Register in 1-click and build your portfolio.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '10px',
          justifyContent: 'center',
          marginBottom: '40px'
        }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '8px 18px',
                borderRadius: '20px',
                fontSize: '0.88rem',
                fontWeight: 600,
                background: selectedCategory === cat ? 'linear-gradient(135deg, #6C5CE7 0%, #4F8CFF 100%)' : 'rgba(255, 255, 255, 0.05)',
                color: selectedCategory === cat ? '#FFFFFF' : '#94A3B8',
                border: selectedCategory === cat ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
                transition: 'all 0.2s'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Events Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '28px'
        }}>
          {filteredEvents.map((evt) => (
            <div
              key={evt.id}
              className="glass-card"
              style={{
                borderRadius: '20px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              {/* Event Image Banner with Date Block Overlay */}
              <div style={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
                <img
                  src={evt.image}
                  alt={evt.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, rgba(11, 16, 32, 0.2) 0%, rgba(11, 16, 32, 0.95) 100%)'
                }} />

                {/* Category & Mode Badge */}
                <div style={{
                  position: 'absolute',
                  top: '14px',
                  left: '14px',
                  display: 'flex',
                  gap: '8px'
                }}>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    background: 'rgba(108, 92, 231, 0.9)',
                    color: '#FFFFFF',
                    padding: '4px 10px',
                    borderRadius: '8px',
                    backdropFilter: 'blur(8px)'
                  }}>
                    {evt.category}
                  </span>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    background: 'rgba(0, 0, 0, 0.6)',
                    color: '#22D3EE',
                    padding: '4px 10px',
                    borderRadius: '8px',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(34, 211, 238, 0.3)'
                  }}>
                    {evt.mode}
                  </span>
                </div>

                {/* Prize Pool Tag */}
                {evt.prizePool && (
                  <div style={{
                    position: 'absolute',
                    bottom: '12px',
                    left: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    color: '#FBBF24'
                  }}>
                    <Trophy size={15} />
                    <span>{evt.prizePool}</span>
                  </div>
                )}
              </div>

              {/* Event Content Details */}
              <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    color: '#F8FAFC',
                    lineHeight: 1.35,
                    marginBottom: '14px'
                  }}>
                    {evt.title}
                  </h3>

                  {/* Schedule & Location */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#CBD5E1' }}>
                      <Calendar size={15} color="#A78BFA" />
                      <span>{evt.date} • {evt.time}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#94A3B8' }}>
                      <MapPin size={15} color="#22D3EE" />
                      <span style={{ lineHeight: 1.3 }}>{evt.location}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#94A3B8' }}>
                      <Users size={15} color="#10B981" />
                      <span>Organized by: <strong style={{ color: '#E2E8F0' }}>{evt.organizer}</strong></span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '20px' }}>
                    {evt.tags.map((t) => (
                      <span
                        key={t}
                        style={{
                          fontSize: '0.7rem',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          color: '#94A3B8'
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Action */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '16px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.06)'
                }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                    <strong style={{ color: '#E2E8F0' }}>{evt.spotsLeft}</strong> spots left
                  </div>

                  <button
                    onClick={() => toggleRegisterEvent(evt.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 18px',
                      borderRadius: '10px',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      background: evt.registered ? 'rgba(16, 185, 129, 0.15)' : 'linear-gradient(135deg, #6C5CE7 0%, #4F8CFF 100%)',
                      border: evt.registered ? '1px solid #10B981' : 'none',
                      color: evt.registered ? '#6EE7B7' : '#FFFFFF',
                      transition: 'all 0.2s'
                    }}
                  >
                    {evt.registered ? (
                      <>
                        <CheckCircle size={15} />
                        <span>Registered</span>
                      </>
                    ) : (
                      <span>Register Now</span>
                    )}
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* View All Events CTA */}
        <div style={{ marginTop: '48px', textAlign: 'center' }}>
          <button
            onClick={() => { loginUser('student'); setActiveTab('events'); }}
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
            <span>Explore All 32 State-Level Events & Fests</span>
            <ArrowRight size={18} />
          </button>
        </div>

      </div>
    </section>
  );
};
