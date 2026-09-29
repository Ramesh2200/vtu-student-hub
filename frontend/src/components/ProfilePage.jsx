import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  User,
  GraduationCap,
  Award,
  Sparkles,
  Edit3,
  Check,
  Globe,
  BookOpen,
  Mail,
  Phone,
  X
} from 'lucide-react';

export const ProfilePage = () => {
  const { currentUser, updateUserProfile } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...currentUser });

  const handleSave = (e) => {
    e.preventDefault();
    updateUserProfile(formData);
    setIsEditing(false);
  };

  return (
    <div style={{ padding: '32px 28px', maxWidth: '1100px', margin: '0 auto', width: '100%' }}>
      
      {/* 29. PROFILE HEADER CARD */}
      <div
        className="glass-card"
        style={{
          padding: '36px',
          borderRadius: '24px',
          background: 'linear-gradient(135deg, rgba(23, 32, 54, 0.9) 0%, rgba(13, 20, 38, 0.95) 100%)',
          border: '1px solid rgba(108, 92, 231, 0.3)',
          marginBottom: '32px',
          position: 'relative'
        }}
      >
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '24px'
        }}>
          {/* Avatar & Core Info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative' }}>
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                style={{
                  width: '96px',
                  height: '96px',
                  borderRadius: '24px',
                  objectFit: 'cover',
                  border: '3px solid #6C5CE7',
                  boxShadow: '0 0 25px rgba(108, 92, 231, 0.5)'
                }}
              />
              <div style={{
                position: 'absolute',
                bottom: '-4px',
                right: '-4px',
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                background: '#10B981',
                border: '3px solid #0F172A'
              }} />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#F8FAFC' }}>
                  {currentUser.name}
                </h1>
                <span className="badge badge-primary" style={{ textTransform: 'capitalize' }}>
                  {currentUser.role}
                </span>
              </div>

              <div style={{ fontSize: '1rem', color: '#67E8F9', fontWeight: 600, marginBottom: '6px' }}>
                {currentUser.usn} • {currentUser.branch}
              </div>

              <div style={{ fontSize: '0.88rem', color: '#94A3B8' }}>
                {currentUser.college} (Graduating {currentUser.graduationYear})
              </div>
            </div>
          </div>

          {/* Edit Profile Button & Completion */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' }}>
            <button
              onClick={() => setIsEditing(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#F8FAFC',
                fontSize: '0.88rem',
                fontWeight: 600
              }}
            >
              <Edit3 size={15} />
              <span>Edit Profile</span>
            </button>

            <div style={{
              background: 'rgba(255, 255, 255, 0.04)',
              padding: '10px 16px',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              width: '200px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '6px' }}>
                <span style={{ color: '#94A3B8' }}>Profile Strength</span>
                <span style={{ color: '#10B981', fontWeight: 700 }}>{currentUser.profileCompletion}%</span>
              </div>
              <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${currentUser.profileCompletion}%`, height: '100%', background: 'linear-gradient(90deg, #6C5CE7, #22D3EE)', borderRadius: '3px' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Sections: Academic Details, Skills, Achievements */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        
        {/* Academic Profile */}
        <div className="glass-card" style={{ padding: '28px', borderRadius: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <GraduationCap size={22} color="#6C5CE7" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#F8FAFC' }}>
              Academic Parameters
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#94A3B8' }}>Syllabus Scheme:</span>
              <strong style={{ color: '#F8FAFC' }}>{currentUser.scheme}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#94A3B8' }}>Current Semester:</span>
              <strong style={{ color: '#F8FAFC' }}>Semester {currentUser.semester}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#94A3B8' }}>Branch Code:</span>
              <strong style={{ color: '#F8FAFC' }}>{currentUser.branchCode}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#94A3B8' }}>Cumulative CGPA:</span>
              <strong style={{ color: '#10B981' }}>{currentUser.cgpa} / 10.0</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#94A3B8' }}>Active Backlogs:</span>
              <strong style={{ color: '#10B981' }}>0 (Eligible for All Tier-1 Drives)</strong>
            </div>
          </div>
        </div>

        {/* Technical Skills & Interests */}
        <div className="glass-card" style={{ padding: '28px', borderRadius: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <Sparkles size={22} color="#4F8CFF" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#F8FAFC' }}>
              Skills & Engineering Stack
            </h3>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
            {(currentUser.skills || ['Java', 'Spring Boot', 'React', 'AWS', 'Docker', 'PostgreSQL']).map(skill => (
              <span
                key={skill}
                style={{
                  padding: '6px 12px',
                  borderRadius: '10px',
                  background: 'rgba(108, 92, 231, 0.15)',
                  border: '1px solid rgba(108, 92, 231, 0.3)',
                  color: '#A78BFA',
                  fontSize: '0.85rem',
                  fontWeight: 600
                }}
              >
                {skill}
              </span>
            ))}
          </div>

          <div style={{ fontSize: '0.85rem', color: '#94A3B8', marginBottom: '10px' }}>
            <strong>Preferred Domains:</strong>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {(currentUser.interests || ['Cloud', 'AI/ML']).map(int => (
              <span key={int} style={{
                fontSize: '0.78rem',
                padding: '4px 10px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.05)',
                color: '#CBD5E1'
              }}>
                {int}
              </span>
            ))}
          </div>
        </div>

        {/* Achievements & Badges */}
        <div className="glass-card" style={{ padding: '28px', borderRadius: '20px', gridColumn: 'span 2' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
            <Award size={22} color="#F59E0B" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#F8FAFC' }}>
              Key Achievements & Badges
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {(currentUser.achievements || [
              '1st Place - VTU Smart Campus Hackathon 2025',
              'AWS Certified Cloud Practitioner',
              'Department Academic Excellence Award'
            ]).map((ach, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  background: 'rgba(245, 158, 11, 0.08)',
                  border: '1px solid rgba(245, 158, 11, 0.2)',
                  color: '#F8FAFC',
                  fontSize: '0.9rem'
                }}
              >
                <Award size={18} color="#FBBF24" />
                <span>{ach}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* EDIT PROFILE MODAL */}
      {isEditing && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(5, 8, 18, 0.85)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          zIndex: 1400
        }}>
          <div style={{
            maxWidth: '600px',
            width: '100%',
            borderRadius: '20px',
            background: '#0F172A',
            border: '1px solid rgba(108, 92, 231, 0.4)',
            padding: '28px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.9)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#F8FAFC' }}>
                Edit Student Profile
              </h3>
              <button onClick={() => setIsEditing(false)} style={{ color: '#94A3B8' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '6px' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#FFF' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '6px' }}>
                    USN
                  </label>
                  <input
                    type="text"
                    value={formData.usn}
                    onChange={(e) => setFormData({ ...formData, usn: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#FFF' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '6px' }}>
                    Cumulative CGPA
                  </label>
                  <input
                    type="text"
                    value={formData.cgpa}
                    onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#FFF' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '6px' }}>
                  College Name
                </label>
                <input
                  type="text"
                  value={formData.college}
                  onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#FFF' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  style={{ padding: '10px 18px', borderRadius: '10px', color: '#94A3B8' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '10px 22px', borderRadius: '10px', background: '#6C5CE7', color: '#FFF', fontWeight: 700 }}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
