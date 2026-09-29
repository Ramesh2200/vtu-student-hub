import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  ArrowRight,
  Play,
  CheckCircle2,
  BookOpen,
  FileText,
  Calendar,
  Briefcase,
  TrendingUp,
  Award,
  Bell,
  Layers,
  ChevronRight
} from 'lucide-react';

export const LandingHero = () => {
  const { setShowAuthModal, setActiveTab, setIsAuthenticated, loginUser } = useApp();
  const [activeFloatIndex, setActiveFloatIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFloatIndex((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleExplore = () => {
    loginUser('student');
  };

  return (
    <section style={{
      position: 'relative',
      minHeight: '88vh',
      display: 'flex',
      alignItems: 'center',
      padding: '80px 24px 60px',
      overflow: 'hidden',
      background: 'radial-gradient(circle at 20% 20%, rgba(108, 92, 231, 0.18) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(34, 211, 238, 0.12) 0%, transparent 50%), #0B1020'
    }}>
      {/* Background Graphic Canvas / Mesh */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
        opacity: 0.6,
        pointerEvents: 'none'
      }} />

      {/* Ambient glowing blobs */}
      <div style={{
        position: 'absolute',
        top: '15%',
        right: '10%',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(108, 92, 231, 0.25) 0%, rgba(79, 140, 255, 0.1) 50%, transparent 70%)',
        filter: 'blur(60px)',
        pointerEvents: 'none',
        animation: 'pulseGlow 6s infinite alternate'
      }} />

      <div style={{
        position: 'absolute',
        bottom: '10%',
        left: '5%',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(34, 211, 238, 0.18) 0%, transparent 70%)',
        filter: 'blur(50px)',
        pointerEvents: 'none'
      }} />

      <div style={{
        maxWidth: '1440px',
        margin: '0 auto',
        width: '100%',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '60px',
        alignItems: 'center',
        position: 'relative',
        zIndex: 2
      }}>
        {/* Left Column: Headlines & Call to Actions */}
        <div>
          {/* Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: '20px',
            background: 'rgba(108, 92, 231, 0.15)',
            border: '1px solid rgba(108, 92, 231, 0.35)',
            color: '#A78BFA',
            fontSize: '0.85rem',
            fontWeight: 600,
            marginBottom: '24px'
          }}>
            <Sparkles size={16} />
            <span>The Official-Grade VTU Digital Ecosystem</span>
          </div>

          {/* Hero Headline */}
          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4.2rem)',
            fontWeight: 800,
            lineHeight: 1.12,
            letterSpacing: '-0.03em',
            marginBottom: '24px'
          }}>
            Your VTU Journey, <br />
            <span className="gradient-text">Connected.</span>
          </h1>

          {/* Supporting Copy */}
          <p style={{
            fontSize: 'clamp(1.05rem, 1.8vw, 1.25rem)',
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
            maxWidth: '560px',
            marginBottom: '36px'
          }}>
            Access academic resources, connect with students, discover opportunities,
            and stay updated — all from one personalized platform tailored to your
            <strong> College, Scheme, Branch, and Semester</strong>.
          </p>

          {/* Primary and Secondary CTA Buttons */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '40px'
          }}>
            <button
              onClick={() => setShowAuthModal(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '16px 32px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #6C5CE7 0%, #4F8CFF 100%)',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '1rem',
                boxShadow: '0 8px 30px rgba(108, 92, 231, 0.45)',
                transition: 'all 0.25s ease'
              }}
            >
              <span>Get Started</span>
              <ArrowRight size={18} />
            </button>

            <button
              onClick={handleExplore}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '16px 28px',
                borderRadius: '14px',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#F8FAFC',
                fontWeight: 600,
                fontSize: '1rem',
                transition: 'all 0.25s ease'
              }}
            >
              <Play size={16} fill="#F8FAFC" />
              <span>Explore Platform Demo</span>
            </button>
          </div>

          {/* Trust Highlights */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '24px',
            paddingTop: '24px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', color: '#94A3B8' }}>
              <CheckCircle2 size={16} color="#10B981" />
              <span>2022 / 2021 / 2018 Schemes</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', color: '#94A3B8' }}>
              <CheckCircle2 size={16} color="#10B981" />
              <span>Verified Faculty Notes</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', color: '#94A3B8' }}>
              <CheckCircle2 size={16} color="#10B981" />
              <span>Tier-1 Placement Pipeline</span>
            </div>
          </div>
        </div>

        {/* Right Column: Floating Futuristic Interactive Dashboard Preview */}
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
          
          {/* Main Floating Glass Dashboard Mockup Card */}
          <div
            className="glass-card animate-float"
            style={{
              width: '100%',
              maxWidth: '540px',
              padding: '24px',
              borderRadius: '24px',
              background: 'linear-gradient(145deg, rgba(23, 32, 54, 0.85) 0%, rgba(13, 20, 38, 0.95) 100%)',
              border: '1px solid rgba(108, 92, 231, 0.3)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 35px rgba(108, 92, 231, 0.25)',
              position: 'relative'
            }}
          >
            {/* Header / Student Badge */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px',
              paddingBottom: '16px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ position: 'relative' }}>
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                    alt="Student"
                    style={{ width: '46px', height: '46px', borderRadius: '12px', objectFit: 'cover' }}
                  />
                  <div style={{
                    position: 'absolute',
                    bottom: '-2px',
                    right: '-2px',
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    background: '#10B981',
                    border: '2px solid #0B1020'
                  }} />
                </div>
                <div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: '#F8FAFC' }}>
                    Aarav Sharma
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                    1MS21CS042 • MSRIT • Sem 6 (CSE)
                  </div>
                </div>
              </div>

              <div className="badge badge-primary">
                2022 Scheme
              </div>
            </div>

            {/* Live Progress Widget */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '16px',
              padding: '16px',
              marginBottom: '16px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#E2E8F0' }}>
                  Cloud Computing (BCS601)
                </span>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#A78BFA' }}>
                  78% Mastered
                </span>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '78%', height: '100%', background: 'linear-gradient(90deg, #6C5CE7, #22D3EE)', borderRadius: '4px' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '0.75rem', color: '#94A3B8' }}>
                <span>Module 3: HDFS & MapReduce</span>
                <span>4 / 5 Modules Done</span>
              </div>
            </div>

            {/* 2-Column Mini Cards: Latest Notes & Upcoming Event */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '14px',
                padding: '14px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <FileText size={16} color="#6C5CE7" />
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94A3B8' }}>Verified Note</span>
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#F8FAFC', lineHeight: 1.3 }}>
                  ML ID3 & Bayes Solved Papers
                </div>
                <div style={{ fontSize: '0.7rem', color: '#10B981', marginTop: '4px' }}>
                  ⭐ 4.9 (2.4k downloads)
                </div>
              </div>

              <div style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '14px',
                padding: '14px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <Calendar size={16} color="#22D3EE" />
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94A3B8' }}>Hackathon</span>
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#F8FAFC', lineHeight: 1.3 }}>
                  VTU InnoTech 2026
                </div>
                <div style={{ fontSize: '0.7rem', color: '#F59E0B', marginTop: '4px' }}>
                  ₹1.5 Lakhs Prize Pool
                </div>
              </div>
            </div>

            {/* Live Placement Shortlist Alert */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(34, 211, 238, 0.1) 100%)',
              border: '1px solid rgba(16, 185, 129, 0.3)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Award size={20} color="#10B981" />
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#6EE7B7' }}>
                    Google SWE Intern 2026
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>
                    Profile shortlisted for Technical Interview
                  </div>
                </div>
              </div>
              <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>
                Shortlisted
              </span>
            </div>
          </div>

          {/* Floating Accents */}
          <div style={{
            position: 'absolute',
            top: '-20px',
            right: '-15px',
            padding: '10px 18px',
            background: 'rgba(17, 24, 39, 0.95)',
            border: '1px solid rgba(79, 140, 255, 0.4)',
            borderRadius: '16px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            zIndex: 3
          }}>
            <TrendingUp size={18} color="#22D3EE" />
            <div>
              <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>Current CGPA</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#F8FAFC' }}>8.92 / 10</div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
