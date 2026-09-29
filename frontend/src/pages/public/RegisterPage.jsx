import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  UserPlus,
  Mail,
  Lock,
  User,
  GraduationCap,
  Building2,
  BookOpen,
  ArrowRight,
  AlertCircle,
  ArrowLeft,
  Phone,
  CheckCircle2,
  Eye,
  EyeOff
} from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import authBg from '../../assets/backgrounds/auth-bg.jpg';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    usn: '',
    college: 'M. S. Ramaiah Institute of Technology (MSRIT)',
    branch: 'CSE',
    semester: 6
  });

  const [showPassword, setShowPassword] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const colleges = [
    'M. S. Ramaiah Institute of Technology (MSRIT)',
    'R. V. College of Engineering (RVCE)',
    'B. M. S. College of Engineering (BMSCE)',
    'Dayananda Sagar College of Engineering (DSCE)',
    'Siddaganga Institute of Technology (SIT)',
    'The National Institute of Engineering (NIE)',
    'BMS Institute of Technology (BMSIT)',
    'Sir M. Visvesvaraya Institute of Technology (SMVIT)',
    'Other VTU Affiliated College'
  ];

  const branches = [
    { code: 'CSE', name: 'Computer Science & Engineering' },
    { code: 'ISE', name: 'Information Science & Engineering' },
    { code: 'AIML', name: 'Artificial Intelligence & Machine Learning' },
    { code: 'AIDS', name: 'Artificial Intelligence & Data Science' },
    { code: 'ECE', name: 'Electronics & Communication Engineering' },
    { code: 'EEE', name: 'Electrical & Electronics Engineering' },
    { code: 'ME', name: 'Mechanical Engineering' },
    { code: 'CV', name: 'Civil Engineering' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all mandatory fields.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match. Please verify both entries.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (!captchaVerified) {
      setError('Please confirm the reCAPTCHA security verification.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Step: Send OTP to student email
      const otpRes = await api.auth.sendOtp(formData.email.trim());
      addToast(`Verification code sent to ${formData.email}`, 'info');

      // Persist pending registration payload in storage
      localStorage.setItem('vtu_pending_registration', JSON.stringify(formData));
      localStorage.setItem('vtu_pending_email', formData.email.trim());

      // Redirect to OTP verification screen
      navigate('/verify-otp', {
        state: {
          email: formData.email.trim(),
          nextRoute: '/dashboard',
          isRegistration: true,
          demoCode: otpRes?.demoCode || '123456'
        }
      });
    } catch (err) {
      setError(err.message || 'Failed to dispatch verification code. Please check your email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        position: 'relative',
        backgroundImage: `linear-gradient(to bottom, rgba(7, 11, 24, 0.35) 0%, rgba(7, 11, 24, 0.70) 100%), url(${authBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 16px'
      }}
    >
      {/* Top Navigation Row */}
      <div
        style={{
          width: '100%',
          maxWidth: '620px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          zIndex: 2
        }}
      >
        <Link
          to="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '12px',
            background: 'rgba(15, 23, 42, 0.75)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(16px)',
            color: '#E2E8F0',
            fontSize: '13px',
            fontWeight: '600',
            textDecoration: 'none',
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.35)',
            transition: 'transform 0.2s ease'
          }}
        >
          <ArrowLeft size={16} /> Back to Portal Home
        </Link>
      </div>

      <div
        style={{
          width: '100%',
          maxWidth: '620px',
          background: 'rgba(15, 23, 42, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.16)',
          borderRadius: '24px',
          padding: '40px 36px',
          backdropFilter: 'blur(28px) saturate(180%)',
          WebkitBackdropFilter: 'blur(28px) saturate(180%)',
          boxShadow: '0 25px 60px -12px rgba(0, 0, 0, 0.75), 0 0 35px rgba(124, 58, 237, 0.2)',
          position: 'relative',
          zIndex: 2
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              color: '#FFFFFF',
              boxShadow: '0 8px 20px -4px rgba(124, 58, 237, 0.5)'
            }}
          >
            <UserPlus size={26} />
          </div>
          <h2 style={{ fontSize: '26px', fontWeight: '800', color: '#F8FAFC', marginBottom: '6px' }}>
            Create Student Account
          </h2>
          <p style={{ fontSize: '14px', color: '#94A3B8' }}>
            Get instant access to VTU Semester notes, question banks, and placement drives
          </p>
        </div>

        {error && (
          <div
            style={{
              padding: '12px 14px',
              borderRadius: '10px',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#FCA5A5',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '20px'
            }}
          >
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Full Name & USN */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#CBD5E1', marginBottom: '6px' }}>
                Full Name *
              </label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: '12px', top: '14px', color: '#64748B' }} />
                <input
                  type="text"
                  required
                  placeholder="e.g. Aarav Sharma"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 12px 12px 38px',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#F8FAFC',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#CBD5E1', marginBottom: '6px' }}>
                VTU USN (Optional)
              </label>
              <div style={{ position: 'relative' }}>
                <GraduationCap size={16} style={{ position: 'absolute', left: '12px', top: '14px', color: '#64748B' }} />
                <input
                  type="text"
                  placeholder="e.g. 1MS21CS042"
                  value={formData.usn}
                  onChange={(e) => setFormData({ ...formData, usn: e.target.value.toUpperCase() })}
                  style={{
                    width: '100%',
                    padding: '12px 12px 12px 38px',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#F8FAFC',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Email & Phone */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#CBD5E1', marginBottom: '6px' }}>
                Email Address *
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '14px', color: '#64748B' }} />
                <input
                  type="email"
                  required
                  placeholder="aarav@vtuconnect.in"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 12px 12px 38px',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#F8FAFC',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#CBD5E1', marginBottom: '6px' }}>
                Phone Number
              </label>
              <div style={{ position: 'relative' }}>
                <Phone size={16} style={{ position: 'absolute', left: '12px', top: '14px', color: '#64748B' }} />
                <input
                  type="tel"
                  placeholder="+91 98450 11223"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 12px 12px 38px',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#F8FAFC',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Password & Confirm Password */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#CBD5E1', marginBottom: '6px' }}>
                Password (min 6 chars) *
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '14px', color: '#64748B' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 38px 12px 38px',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#F8FAFC',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '12px',
                    background: 'transparent',
                    border: 'none',
                    color: '#94A3B8',
                    cursor: 'pointer'
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#CBD5E1', marginBottom: '6px' }}>
                Confirm Password *
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '14px', color: '#64748B' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 12px 12px 38px',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#F8FAFC',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
              </div>
            </div>
          </div>

          {/* College */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#CBD5E1', marginBottom: '6px' }}>
              Affiliated College
            </label>
            <div style={{ position: 'relative' }}>
              <Building2 size={16} style={{ position: 'absolute', left: '12px', top: '14px', color: '#64748B' }} />
              <select
                value={formData.college}
                onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 38px',
                  borderRadius: '10px',
                  background: '#1E293B',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#F8FAFC',
                  fontSize: '14px',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                {colleges.map((col, idx) => (
                  <option key={idx} value={col} style={{ background: '#0F172A', color: '#F8FAFC' }}>
                    {col}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Branch & Semester */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#CBD5E1', marginBottom: '6px' }}>
                Engineering Branch
              </label>
              <div style={{ position: 'relative' }}>
                <BookOpen size={16} style={{ position: 'absolute', left: '12px', top: '14px', color: '#64748B' }} />
                <select
                  value={formData.branch}
                  onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 12px 12px 38px',
                    borderRadius: '10px',
                    background: '#1E293B',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#F8FAFC',
                    fontSize: '14px',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {branches.map((b) => (
                    <option key={b.code} value={b.code} style={{ background: '#0F172A', color: '#F8FAFC' }}>
                      {b.code} — {b.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#CBD5E1', marginBottom: '6px' }}>
                Current Semester
              </label>
              <select
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: parseInt(e.target.value) })}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  background: '#1E293B',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#F8FAFC',
                  fontSize: '14px',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                  <option key={s} value={s} style={{ background: '#0F172A', color: '#F8FAFC' }}>
                    Semester {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* reCAPTCHA Simulator */}
          <div
            onClick={() => setCaptchaVerified(!captchaVerified)}
            style={{
              padding: '10px 14px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={16} style={{ color: captchaVerified ? '#22C55E' : '#64748B' }} />
              <span style={{ fontSize: '13px', color: '#E2E8F0' }}>I am not a robot</span>
            </div>
            <span style={{ fontSize: '11px', color: '#94A3B8' }}>reCAPTCHA v3 Protected</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '14px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)',
              color: '#FFFFFF',
              fontSize: '14px',
              fontWeight: '700',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginTop: '6px',
              boxShadow: '0 8px 24px -4px rgba(124, 58, 237, 0.4)'
            }}
          >
            {loading ? 'Sending Verification OTP...' : 'Send Verification OTP & Proceed'}{' '}
            <ArrowRight size={16} />
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '13px', color: '#94A3B8' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#38BDF8', fontWeight: '600', textDecoration: 'none' }}>
            Login to Portal
          </Link>
        </div>
      </div>
    </div>
  );
};
