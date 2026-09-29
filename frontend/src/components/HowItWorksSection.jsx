import React from 'react';
import { UserPlus, UserCheck, Compass, Rocket, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const HowItWorksSection = () => {
  const { setShowAuthModal, setShowOnboardingModal, loginUser } = useApp();

  const steps = [
    {
      num: '01',
      title: 'Create Account',
      description: 'Sign in effortlessly via Google Authentication or high-speed Phone OTP with your mobile number.',
      icon: UserPlus,
      color: '#6C5CE7'
    },
    {
      num: '02',
      title: 'Complete Profile',
      description: 'Select your VTU College, Engineering Branch, Scheme (2022/2021), and Current Semester.',
      icon: UserCheck,
      color: '#4F8CFF'
    },
    {
      num: '03',
      title: 'Explore Dashboard',
      description: 'Get an instantly tailored workspace containing only your active subjects, verified notes, and exam papers.',
      icon: Compass,
      color: '#22D3EE'
    },
    {
      num: '04',
      title: 'Learn, Connect & Grow',
      description: 'Ace your SEE exams, collaborate with peers in study groups, and track campus placement drives.',
      icon: Rocket,
      color: '#10B981'
    }
  ];

  return (
    <section style={{
      padding: '100px 24px',
      background: '#0B1020',
      position: 'relative',
      borderTop: '1px solid rgba(255, 255, 255, 0.06)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
    }}>
      <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 60px' }}>
          <div style={{
            fontSize: '0.85rem',
            fontWeight: 700,
            color: '#22D3EE',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '12px'
          }}>
            Simple 4-Step Process
          </div>
          <h2 style={{
            fontSize: 'clamp(2rem, 3.5vw, 3rem)',
            fontWeight: 800,
            color: '#F8FAFC',
            letterSpacing: '-0.02em',
            marginBottom: '18px'
          }}>
            How VTU Student Connect Works
          </h2>
          <p style={{ fontSize: '1.05rem', color: '#94A3B8', lineHeight: 1.6 }}>
            Designed to save you hours every week by eliminating telegram clutter and unorganized photocopy drives.
          </p>
        </div>

        {/* 4 Steps Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '24px',
          position: 'relative'
        }}>
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="glass-card"
                style={{
                  padding: '36px 28px',
                  borderRadius: '20px',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                {/* Step Number Watermark */}
                <div style={{
                  position: 'absolute',
                  top: '18px',
                  right: '24px',
                  fontSize: '2.5rem',
                  fontWeight: 900,
                  color: 'rgba(255, 255, 255, 0.06)',
                  userSelect: 'none'
                }}>
                  {step.num}
                </div>

                <div>
                  {/* Step Icon */}
                  <div style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: '16px',
                    background: `${step.color}18`,
                    border: `1px solid ${step.color}40`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '24px'
                  }}>
                    <Icon size={26} color={step.color} />
                  </div>

                  <h3 style={{
                    fontSize: '1.3rem',
                    fontWeight: 700,
                    color: '#F8FAFC',
                    marginBottom: '12px'
                  }}>
                    {step.title}
                  </h3>

                  <p style={{
                    fontSize: '0.92rem',
                    color: '#94A3B8',
                    lineHeight: 1.6
                  }}>
                    {step.description}
                  </p>
                </div>

                <div style={{
                  marginTop: '28px',
                  paddingTop: '16px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: step.color,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em'
                }}>
                  Step {step.num} of 04
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Banner */}
        <div style={{
          marginTop: '50px',
          textAlign: 'center'
        }}>
          <button
            onClick={() => setShowAuthModal(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '14px 28px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #6C5CE7 0%, #4F8CFF 100%)',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '0.95rem',
              boxShadow: '0 8px 25px rgba(108, 92, 231, 0.4)'
            }}
          >
            <span>Start Your Setup in 60 Seconds</span>
            <ArrowRight size={18} />
          </button>
        </div>

      </div>
    </section>
  );
};
