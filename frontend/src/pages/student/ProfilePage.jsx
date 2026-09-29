import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  Building,
  Calendar,
  Edit3,
  Award,
  BookOpen,
  Briefcase,
  CheckCircle,
  Sparkles
} from 'lucide-react';
import { api, authStorage } from '../../services/api';
import { StudentLayout } from '../../components/StudentLayout';

export const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await api.profile.get();
      if (data) {
        setProfile(data);
      } else {
        // Fallback to logged-in user info
        const u = authStorage.getUser();
        setProfile(u?.profile || {
          fullName: 'Aarav Sharma',
          email: 'aarav.sharma@vtuconnect.in',
          phone: '+91 98450 12345',
          usn: '1MS21CS042',
          college: 'M.S. Ramaiah Institute of Technology (MSRIT), Bengaluru',
          branch: 'Computer Science & Engineering',
          semester: 6,
          graduationYear: 2025,
          skills: 'Java, Python, React.js, MySQL, Spring Boot, Data Structures',
          bio: 'VTU 6th Semester Computer Science undergraduate interested in backend engineering, distributed cloud systems, and algorithmic problem solving.'
        });
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <StudentLayout>
      <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>
        
        {/* Banner with Profile Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.25) 0%, rgba(6, 182, 212, 0.15) 100%)',
            border: '1px solid rgba(124, 58, 237, 0.3)',
            borderRadius: '24px',
            padding: '36px',
            position: 'relative'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '24px',
                  background: 'linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  fontSize: '32px',
                  fontWeight: '900',
                  boxShadow: '0 8px 24px rgba(124, 58, 237, 0.4)'
                }}
              >
                {profile?.fullName?.slice(0, 1) || 'A'}
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '11px', fontWeight: '800', background: 'rgba(16, 185, 129, 0.2)', color: '#34D399', padding: '3px 8px', borderRadius: '6px' }}>
                    VTU Verified Scholar
                  </span>
                  <span style={{ fontSize: '12px', color: '#94A3B8' }}>{profile?.usn}</span>
                </div>

                <h1 style={{ fontSize: '26px', fontWeight: '900', color: '#F8FAFC', margin: '0 0 4px 0' }}>
                  {profile?.fullName || 'Student Name'}
                </h1>

                <p style={{ fontSize: '13px', color: '#CBD5E1', margin: 0 }}>
                  {profile?.branch} • Semester {profile?.semester || 6}
                </p>
              </div>
            </div>

            <Link
              to="/edit-profile"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'linear-gradient(135deg, #7C3AED 0%, #6366F1 100%)',
                color: '#FFFFFF',
                padding: '10px 20px',
                borderRadius: '12px',
                fontSize: '13px',
                fontWeight: '700',
                textDecoration: 'none',
                boxShadow: '0 4px 14px rgba(124, 58, 237, 0.35)'
              }}
            >
              <Edit3 size={16} /> Edit Profile
            </Link>
          </div>
        </div>

        {/* Profile Details Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          
          {/* Academic Information */}
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.65)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '20px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}
          >
            <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#38BDF8', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <GraduationCap size={18} /> Academic Details
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
              <div>
                <span style={{ color: '#64748B', display: 'block', fontSize: '11px', textTransform: 'uppercase', fontWeight: '700' }}>Affiliated Institution</span>
                <span style={{ color: '#F8FAFC', fontWeight: '600' }}>{profile?.college}</span>
              </div>

              <div>
                <span style={{ color: '#64748B', display: 'block', fontSize: '11px', textTransform: 'uppercase', fontWeight: '700' }}>Branch / Major</span>
                <span style={{ color: '#F8FAFC', fontWeight: '600' }}>{profile?.branch}</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <span style={{ color: '#64748B', display: 'block', fontSize: '11px', textTransform: 'uppercase', fontWeight: '700' }}>Current Semester</span>
                  <span style={{ color: '#C4B5FD', fontWeight: '800' }}>Semester {profile?.semester || 6}</span>
                </div>
                <div>
                  <span style={{ color: '#64748B', display: 'block', fontSize: '11px', textTransform: 'uppercase', fontWeight: '700' }}>Graduation Batch</span>
                  <span style={{ color: '#F8FAFC', fontWeight: '700' }}>{profile?.graduationYear || 2025}</span>
                </div>
              </div>

              <div>
                <span style={{ color: '#64748B', display: 'block', fontSize: '11px', textTransform: 'uppercase', fontWeight: '700' }}>VTU University Seat Number (USN)</span>
                <span style={{ color: '#38BDF8', fontWeight: '800', letterSpacing: '0.04em' }}>{profile?.usn}</span>
              </div>
            </div>
          </div>

          {/* Contact & Professional Details */}
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.65)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '20px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}
          >
            <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#A78BFA', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={18} /> Contact & About
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
              <div>
                <span style={{ color: '#64748B', display: 'block', fontSize: '11px', textTransform: 'uppercase', fontWeight: '700' }}>Email Address</span>
                <span style={{ color: '#F8FAFC', fontWeight: '600' }}>{profile?.email || 'student@vtuconnect.in'}</span>
              </div>

              <div>
                <span style={{ color: '#64748B', display: 'block', fontSize: '11px', textTransform: 'uppercase', fontWeight: '700' }}>Phone Number</span>
                <span style={{ color: '#F8FAFC', fontWeight: '600' }}>{profile?.phone || '+91 98450 12345'}</span>
              </div>

              <div>
                <span style={{ color: '#64748B', display: 'block', fontSize: '11px', textTransform: 'uppercase', fontWeight: '700' }}>Bio & Career Objective</span>
                <p style={{ color: '#94A3B8', margin: '4px 0 0 0', lineHeight: 1.5 }}>{profile?.bio}</p>
              </div>

              <div>
                <span style={{ color: '#64748B', display: 'block', fontSize: '11px', textTransform: 'uppercase', fontWeight: '700', marginBottom: '6px' }}>Skills & Technical Proficiencies</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {profile?.skills?.split(',').map((skill, idx) => (
                    <span
                      key={idx}
                      style={{
                        background: 'rgba(124, 58, 237, 0.15)',
                        border: '1px solid rgba(124, 58, 237, 0.3)',
                        color: '#DDD6FE',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: '700'
                      }}
                    >
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </StudentLayout>
  );
};
