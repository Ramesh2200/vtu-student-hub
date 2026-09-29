import React, { useState, useEffect } from 'react';
import { MOCK_TESTIMONIALS } from '../data/mockData';
import { Quote, ChevronLeft, ChevronRight, Sparkles, Star } from 'lucide-react';

export const TestimonialSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % MOCK_TESTIMONIALS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + MOCK_TESTIMONIALS.length) % MOCK_TESTIMONIALS.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % MOCK_TESTIMONIALS.length);
  };

  const current = MOCK_TESTIMONIALS[currentIndex];

  return (
    <section style={{
      padding: '100px 24px',
      background: '#0B1020',
      position: 'relative',
      borderTop: '1px solid rgba(255, 255, 255, 0.06)'
    }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
        
        {/* Sample content badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 14px',
          borderRadius: '20px',
          background: 'rgba(108, 92, 231, 0.12)',
          border: '1px solid rgba(108, 92, 231, 0.3)',
          color: '#A78BFA',
          fontSize: '0.85rem',
          fontWeight: 600,
          marginBottom: '20px'
        }}>
          <Sparkles size={16} />
          <span>Student Success Stories (Sample Feedback)</span>
        </div>

        <h2 style={{
          fontSize: 'clamp(2rem, 3.5vw, 2.8rem)',
          fontWeight: 800,
          color: '#F8FAFC',
          marginBottom: '48px',
          letterSpacing: '-0.02em'
        }}>
          Loved by VTU Engineers Across Karnataka
        </h2>

        {/* Carousel Card */}
        <div
          className="glass-card"
          style={{
            padding: '48px 36px',
            borderRadius: '24px',
            position: 'relative',
            background: 'linear-gradient(145deg, rgba(23, 32, 54, 0.7) 0%, rgba(13, 20, 38, 0.85) 100%)',
            border: '1px solid rgba(108, 92, 231, 0.25)',
            boxShadow: '0 20px 40px -15px rgba(0,0,0,0.6)'
          }}
        >
          <Quote size={40} color="#6C5CE7" style={{ opacity: 0.5, marginBottom: '20px' }} />

          {/* Stars */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', marginBottom: '24px' }}>
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} size={18} fill="#F59E0B" color="#F59E0B" />
            ))}
          </div>

          <p style={{
            fontSize: 'clamp(1.1rem, 2vw, 1.35rem)',
            color: '#F8FAFC',
            fontStyle: 'italic',
            lineHeight: 1.6,
            marginBottom: '32px',
            maxWidth: '800px',
            margin: '0 auto 32px'
          }}>
            "{current.quote}"
          </p>

          <div>
            <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#F8FAFC' }}>
              {current.name}
            </div>
            <div style={{ fontSize: '0.85rem', color: '#67E8F9', fontWeight: 600, marginTop: '2px' }}>
              {current.role}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '4px' }}>
              {current.usn} • {current.branch} • {current.college} ({current.year})
            </div>
          </div>

          {/* Left/Right Carousel Controls */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '16px',
            marginTop: '36px'
          }}>
            <button
              onClick={handlePrev}
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#F8FAFC'
              }}
              title="Previous testimonial"
            >
              <ChevronLeft size={20} />
            </button>

            {/* Dots */}
            <div style={{ display: 'flex', gap: '8px' }}>
              {MOCK_TESTIMONIALS.map((_, i) => (
                <div
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  style={{
                    width: i === currentIndex ? '24px' : '8px',
                    height: '8px',
                    borderRadius: '4px',
                    background: i === currentIndex ? '#6C5CE7' : 'rgba(255, 255, 255, 0.2)',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#F8FAFC'
              }}
              title="Next testimonial"
            >
              <ChevronRight size={20} />
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};
