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
  Share2,
  CalendarPlus
} from 'lucide-react';

export const EventsPage = () => {
  const { events, toggleRegisterEvent } = useApp();
  const [filterType, setFilterType] = useState('All'); // 'All' | 'My' | 'Hackathon' | 'Workshop'
  const [addedCalendarId, setAddedCalendarId] = useState(null);

  const filteredEvents = events.filter(e => {
    if (filterType === 'My' && !e.registered) return false;
    if (filterType !== 'All' && filterType !== 'My' && e.category !== filterType) return false;
    return true;
  });

  const handleAddToCalendar = (id) => {
    setAddedCalendarId(id);
    setTimeout(() => setAddedCalendarId(null), 2500);
  };

  return (
    <div style={{ padding: '32px 28px', maxWidth: '1440px', margin: '0 auto', width: '100%' }}>
      
      {/* 36. HEADER */}
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
              Statewide University Hackathons & Workshops
            </span>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#F8FAFC', marginBottom: '4px' }}>
            Flagship Events & Competitions
          </h1>
          <p style={{ fontSize: '0.95rem', color: '#94A3B8' }}>
            Register for inter-college hackathons, coding contests, and faculty workshops across Karnataka.
          </p>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['All', 'My', 'Hackathon', 'Workshop', 'Coding Contest'].map(f => (
            <button
              key={f}
              onClick={() => setFilterType(f)}
              style={{
                padding: '8px 16px',
                borderRadius: '10px',
                fontSize: '0.85rem',
                fontWeight: 600,
                background: filterType === f ? '#6C5CE7' : 'rgba(255, 255, 255, 0.05)',
                color: filterType === f ? '#FFFFFF' : '#94A3B8',
                border: filterType === f ? 'none' : '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              {f === 'My' ? 'My Registrations' : f}
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '28px'
      }}>
        {filteredEvents.map(evt => (
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
            {/* Banner */}
            <div style={{ position: 'relative', height: '180px' }}>
              <img src={evt.image} alt={evt.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, rgba(11, 16, 32, 0.2) 0%, rgba(11, 16, 32, 0.95) 100%)'
              }} />

              <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', gap: '8px' }}>
                <span className="badge badge-primary">{evt.category}</span>
                <span className="badge badge-accent">{evt.mode}</span>
              </div>

              {evt.prizePool && (
                <div style={{
                  position: 'absolute',
                  bottom: '12px',
                  left: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#FBBF24',
                  fontWeight: 700,
                  fontSize: '0.85rem'
                }}>
                  <Trophy size={16} />
                  <span>{evt.prizePool}</span>
                </div>
              )}
            </div>

            {/* Content */}
            <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#F8FAFC', lineHeight: 1.35, marginBottom: '12px' }}>
                  {evt.title}
                </h3>
                <p style={{ fontSize: '0.88rem', color: '#94A3B8', lineHeight: 1.5, marginBottom: '16px' }}>
                  {evt.description}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.82rem', color: '#CBD5E1', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={15} color="#A78BFA" />
                    <span>{evt.date} • {evt.time}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={15} color="#22D3EE" />
                    <span>{evt.location}</span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '16px',
                borderTop: '1px solid rgba(255, 255, 255, 0.06)'
              }}>
                <button
                  onClick={() => handleAddToCalendar(evt.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.78rem',
                    color: addedCalendarId === evt.id ? '#10B981' : '#CBD5E1'
                  }}
                >
                  <CalendarPlus size={15} />
                  <span>{addedCalendarId === evt.id ? 'Added to iCal/Google' : 'Add to Calendar'}</span>
                </button>

                <button
                  onClick={() => toggleRegisterEvent(evt.id)}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    background: evt.registered ? 'rgba(16, 185, 129, 0.15)' : 'linear-gradient(135deg, #6C5CE7 0%, #4F8CFF 100%)',
                    border: evt.registered ? '1px solid #10B981' : 'none',
                    color: evt.registered ? '#6EE7B7' : '#FFFFFF'
                  }}
                >
                  {evt.registered ? 'Registered ✓' : 'Register Now'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
