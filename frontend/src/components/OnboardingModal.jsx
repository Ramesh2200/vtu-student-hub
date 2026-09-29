import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import confetti from 'canvas-confetti';
import {
  User,
  GraduationCap,
  Sparkles,
  Bell,
  ArrowRight,
  ArrowLeft,
  Check,
  CheckCircle2,
  X
} from 'lucide-react';

export const OnboardingModal = () => {
  const {
    showOnboardingModal,
    setShowOnboardingModal,
    currentUser,
    updateUserProfile,
    colleges,
    branches,
    schemes,
    setActiveTab
  } = useApp();

  const [step, setStep] = useState(1);

  // Form State
  const [formData, setFormData] = useState({
    name: currentUser.name || 'Aarav Sharma',
    phone: currentUser.phone || '+91 98450 12345',
    avatar: currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    usn: currentUser.usn || '1MS21CS042',
    college: currentUser.college || 'Ramaiah Institute of Technology (MSRIT)',
    branch: currentUser.branch || 'Computer Science & Engineering',
    scheme: currentUser.scheme || '2022 Scheme',
    semester: currentUser.semester || 6,
    graduationYear: currentUser.graduationYear || 2026,
    interests: currentUser.interests || ['Cloud Architecture', 'Machine Learning', 'Web Development'],
    preferences: currentUser.preferences || {
      notifications: true,
      jobAlerts: true,
      eventAlerts: true,
      academicUpdates: true
    }
  });

  if (!showOnboardingModal) return null;

  const allInterests = [
    'Java',
    'Python',
    'Web Development',
    'AI/ML',
    'Cloud Computing',
    'Data Science',
    'Cyber Security',
    'DevOps',
    'Blockchain',
    'Competitive Programming'
  ];

  const handleInterestToggle = (tech) => {
    if (formData.interests.includes(tech)) {
      setFormData({
        ...formData,
        interests: formData.interests.filter(i => i !== tech)
      });
    } else {
      setFormData({
        ...formData,
        interests: [...formData.interests, tech]
      });
    }
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      // Finalize Onboarding
      updateUserProfile(formData);
      setShowOnboardingModal(false);
      setActiveTab('dashboard');

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        // Fallback silently if canvas not ready
      }
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(5, 8, 18, 0.88)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      zIndex: 1100
    }}>
      <div style={{
        maxWidth: '680px',
        width: '100%',
        borderRadius: '24px',
        background: '#0F172A',
        border: '1px solid rgba(108, 92, 231, 0.35)',
        boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.9), 0 0 45px rgba(108, 92, 231, 0.3)',
        overflow: 'hidden',
        position: 'relative'
      }}>
        {/* Modal Top Header with Step Indicator */}
        <div style={{
          padding: '28px 32px 20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(17, 24, 39, 0.6)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#A78BFA', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              First-Time Setup • Step {step} of 4
            </span>
            <button
              onClick={() => setShowOnboardingModal(false)}
              style={{ color: '#94A3B8', padding: '4px' }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Progress Bar */}
          <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{
              width: `${(step / 4) * 100}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #6C5CE7, #22D3EE)',
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>

        {/* Step Body Content */}
        <div style={{ padding: '32px' }}>
          
          {/* STEP 1: Personal Info */}
          {step === 1 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <User size={24} color="#6C5CE7" />
                <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#F8FAFC' }}>
                  Personal Information
                </h3>
              </div>
              <p style={{ fontSize: '0.9rem', color: '#94A3B8', marginBottom: '24px' }}>
                Set your public student identity visible to classmates and campus recruiters.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '6px' }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '10px',
                      color: '#F8FAFC',
                      fontSize: '0.92rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '6px' }}>
                    Contact Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '10px',
                      color: '#F8FAFC',
                      fontSize: '0.92rem'
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Academic Info */}
          {step === 2 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <GraduationCap size={24} color="#4F8CFF" />
                <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#F8FAFC' }}>
                  Academic Information
                </h3>
              </div>
              <p style={{ fontSize: '0.9rem', color: '#94A3B8', marginBottom: '24px' }}>
                Your academic parameters personalize your subjects, question papers, and scheme syllabi.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '6px' }}>
                    University Seat Number (USN)
                  </label>
                  <input
                    type="text"
                    value={formData.usn}
                    onChange={(e) => setFormData({ ...formData, usn: e.target.value.toUpperCase() })}
                    placeholder="e.g. 1MS21CS042"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '10px',
                      color: '#F8FAFC',
                      fontSize: '0.92rem',
                      fontFamily: 'monospace',
                      letterSpacing: '0.05em'
                    }}
                  />
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '6px' }}>
                    VTU Affiliated College
                  </label>
                  <select
                    value={formData.college}
                    onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: '#0B1020',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '10px',
                      color: '#F8FAFC',
                      fontSize: '0.9rem'
                    }}
                  >
                    {colleges.map(c => <option key={c.code} value={c.name}>{c.name}</option>)}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '6px' }}>
                    Branch
                  </label>
                  <select
                    value={formData.branch}
                    onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: '#0B1020',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '10px',
                      color: '#F8FAFC',
                      fontSize: '0.88rem'
                    }}
                  >
                    {branches.map(b => <option key={b.code} value={b.name}>{b.code} - {b.name}</option>)}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '6px' }}>
                    Syllabus Scheme
                  </label>
                  <select
                    value={formData.scheme}
                    onChange={(e) => setFormData({ ...formData, scheme: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: '#0B1020',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '10px',
                      color: '#F8FAFC',
                      fontSize: '0.88rem'
                    }}
                  >
                    {schemes.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '6px' }}>
                    Current Semester
                  </label>
                  <select
                    value={formData.semester}
                    onChange={(e) => setFormData({ ...formData, semester: Number(e.target.value) })}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: '#0B1020',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '10px',
                      color: '#F8FAFC',
                      fontSize: '0.88rem'
                    }}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => <option key={sem} value={sem}>Semester {sem}</option>)}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '6px' }}>
                    Graduation Year
                  </label>
                  <input
                    type="number"
                    value={formData.graduationYear}
                    onChange={(e) => setFormData({ ...formData, graduationYear: Number(e.target.value) })}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '10px',
                      color: '#F8FAFC',
                      fontSize: '0.92rem'
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Technical Interests */}
          {step === 3 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <Sparkles size={24} color="#22D3EE" />
                <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#F8FAFC' }}>
                  Technical Interests & Domains
                </h3>
              </div>
              <p style={{ fontSize: '0.9rem', color: '#94A3B8', marginBottom: '24px' }}>
                Choose domains you're learning. We'll curate relevant hackathons and company campus drives.
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {allInterests.map((tech) => {
                  const selected = formData.interests.includes(tech);
                  return (
                    <button
                      key={tech}
                      type="button"
                      onClick={() => handleInterestToggle(tech)}
                      style={{
                        padding: '10px 16px',
                        borderRadius: '12px',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        background: selected ? 'linear-gradient(135deg, #6C5CE7 0%, #4F8CFF 100%)' : 'rgba(255, 255, 255, 0.05)',
                        border: selected ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
                        color: selected ? '#FFFFFF' : '#CBD5E1',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'all 0.2s'
                      }}
                    >
                      {selected && <Check size={14} />}
                      <span>{tech}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: Notification Preferences */}
          {step === 4 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <Bell size={24} color="#10B981" />
                <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#F8FAFC' }}>
                  Notification Preferences
                </h3>
              </div>
              <p style={{ fontSize: '0.9rem', color: '#94A3B8', marginBottom: '24px' }}>
                Control what notifications you receive via email, push alerts, and SMS.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {[
                  { key: 'academicUpdates', label: 'VTU SEE Timetable & Exam Updates', desc: 'Direct alerts for revaluation schedules, draft timetables and syllabus circulars' },
                  { key: 'jobAlerts', label: 'Campus Placement & Internship Drives', desc: 'Immediate notification when tier-1 firms start accepting VTU student applications' },
                  { key: 'eventAlerts', label: 'Hackathons & Technical Events', desc: 'Alerts for state-level competitions with cash prizes and project showcases' },
                  { key: 'notifications', label: 'Community Answers & Notes Uploads', desc: 'When professors upload new lecture notes for your enrolled subjects' }
                ].map((pref) => (
                  <label
                    key={pref.key}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '14px',
                      padding: '16px',
                      borderRadius: '14px',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      cursor: 'pointer'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={formData.preferences[pref.key]}
                      onChange={(e) => setFormData({
                        ...formData,
                        preferences: { ...formData.preferences, [pref.key]: e.target.checked }
                      })}
                      style={{ marginTop: '4px', width: '18px', height: '18px', accentColor: '#6C5CE7' }}
                    />
                    <div>
                      <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#F8FAFC' }}>
                        {pref.label}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '2px' }}>
                        {pref.desc}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Controls */}
        <div style={{
          padding: '20px 32px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(17, 24, 39, 0.6)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          {step > 1 ? (
            <button
              onClick={handleBack}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.08)',
                color: '#CBD5E1',
                fontSize: '0.88rem',
                fontWeight: 600
              }}
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>
          ) : <div />}

          <button
            onClick={handleNext}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #6C5CE7 0%, #4F8CFF 100%)',
              color: '#FFFFFF',
              fontSize: '0.9rem',
              fontWeight: 700,
              boxShadow: '0 6px 20px rgba(108, 92, 231, 0.4)'
            }}
          >
            <span>{step === 4 ? 'Complete Onboarding & Enter' : 'Continue to Next Step'}</span>
            <ArrowRight size={16} />
          </button>
        </div>

      </div>
    </div>
  );
};
