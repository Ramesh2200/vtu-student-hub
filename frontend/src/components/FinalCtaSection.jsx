import React from 'react';
import { useApp } from '../context/AppContext';
import { ArrowRight, Sparkles, GraduationCap } from 'lucide-react';

export const FinalCtaSection = () => {
  const { setShowAuthModal, loginUser } = useApp();

  return (
    <section style={{
      padding: '110px 24px',
      position: 'relative',
      background: 'radial-gradient(circle at 50% 50%, rgba(108, 92, 231, 0.25) 0%, rgba(11, 16, 32, 0.95) 75%), #0B1020',
      overflow: 'hidden',
      borderTop: '1px solid rgba(255, 255, 255, 0.08)'
    }}>
      {/* Decorative gradient blur */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '600px',
        height: '350px',
        background: 'linear-gradient(135deg, rgba(108, 92, 231, 0.3) 0%, rgba(34, 211, 238, 0.2) 100%)',
        filter: 'blur(90px)',
        pointerEvents: 'none'
      }} />

      <div style={{
        maxWidth: '860px',
        margin: '0 auto',
        textAlign: 'center',
        position: 'relative',
        zIndex: 2
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '20px',
          background: 'linear-gradient(135deg, #6C5CE7 0%, #4F8CFF 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 28px',
          boxShadow: '0 0 30px rgba(108, 92, 231, 0.6)'
        }}>
          <GraduationCap size={34} color="#FFFFFF" />
        </div>

        <h2 style={{
          fontSize: 'clamp(2.4rem, 4.5vw, 3.6rem)',
          fontWeight: 800,
          color: '#F8FAFC',
          letterSpacing: '-0.025em',
          lineHeight: 1.15,
          marginBottom: '20px'
        }}>
          Build Your VTU Journey <span className="gradient-text">Smarter.</span>
        </h2>

        <p style={{
          fontSize: '1.2rem',
          color: '#94A3B8',
          lineHeight: 1.6,
          marginBottom: '40px',
          maxWidth: '680px',
          margin: '0 auto 40px'
        }}>
          Join thousands of engineering students and faculty on the single verified platform for academics, study resources, community, and career opportunities.
        </p>

        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '16px'
        }}>
          <button
            onClick={() => setShowAuthModal(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '16px 36px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #6C5CE7 0%, #4F8CFF 100%)',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '1.05rem',
              boxShadow: '0 8px 30px rgba(108, 92, 231, 0.5)'
            }}
          >
            <span>Get Started</span>
            <ArrowRight size={18} />
          </button>

          <button
            onClick={() => loginUser('student')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '16px 32px',
              borderRadius: '14px',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#F8FAFC',
              fontWeight: 600,
              fontSize: '1.05rem'
            }}
          >
            <span>Explore Platform</span>
          </button>
        </div>
      </div>
    </section>
  );
};
