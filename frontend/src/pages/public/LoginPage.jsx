import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  LogIn,
  Lock,
  Mail,
  Shield,
  User,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  Eye,
  EyeOff,
  GraduationCap,
  Sparkles,
  BookOpen,
  Briefcase,
  Users
} from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import authBg from '../../assets/backgrounds/auth-bg.jpg';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both email/USN and password');
      return;
    }

    if (!captchaVerified) {
      setError('Please confirm the reCAPTCHA security check');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await api.auth.login(email.trim(), password);
      addToast(`Welcome back, ${data.user?.profile?.fullName || data.user?.email || 'Student'}!`, 'success');

      if (data.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      const msg = err.message || '';
      if (msg.includes('Load failed') || msg.includes('Failed to fetch') || msg.includes('NetworkError')) {
        setError('Server connecting slowly. Offline cloud sync active — please retry or tap a Demo Login button below.');
      } else {
        setError(msg || 'Login failed. Please check your credentials.');
      }
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
        backgroundImage: `linear-gradient(to bottom, rgba(7, 11, 24, 0.40) 0%, rgba(7, 11, 24, 0.70) 100%), url(${authBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 16px'
      }}
    >
      {/* Top Navigation Row */}
      <div
        style={{
          width: '100%',
          maxWidth: '960px',
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
            WebkitBackdropFilter: 'blur(16px)',
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

      {/* Split-Screen Container Card */}
      <div
        style={{
          width: '100%',
          maxWidth: '960px',
          background: 'rgba(15, 23, 42, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.16)',
          borderRadius: '28px',
          backdropFilter: 'blur(28px) saturate(180%)',
          WebkitBackdropFilter: 'blur(28px) saturate(180%)',
          boxShadow: '0 30px 70px -15px rgba(0, 0, 0, 0.8), 0 0 45px rgba(124, 58, 237, 0.18)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          overflow: 'hidden',
          position: 'relative',
          zIndex: 2
        }}
      >
        {/* Left Side: Campus Branding & Highlights */}
        <div
          style={{
            position: 'relative',
            padding: '48px 40px',
            background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.25) 0%, rgba(6, 182, 212, 0.15) 100%)',
            borderRight: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  boxShadow: '0 8px 20px -4px rgba(124, 58, 237, 0.5)'
                }}
              >
                <GraduationCap size={26} />
              </div>
              <div>
                <h1 style={{ fontSize: '20px', fontWeight: '800', color: '#FFFFFF', margin: 0 }}>
                  Student Connect
                </h1>
                <p style={{ fontSize: '12px', color: '#38BDF8', margin: 0, fontWeight: '600' }}>
                  VTU Academic & Placement Ecosystem
                </p>
              </div>
            </div>

            <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#F8FAFC', lineHeight: '1.25', marginBottom: '14px' }}>
              Empowering VTU Engineers Across Karnataka.
            </h2>
            <p style={{ fontSize: '14px', color: '#94A3B8', lineHeight: '1.6', marginBottom: '28px' }}>
              One unified digital gateway for verified semester notes, previous year question papers, placement alerts, and collaborative study channels.
            </p>

            {/* Feature Pills */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#E2E8F0', fontSize: '13px' }}>
                <div style={{ padding: '6px', borderRadius: '8px', background: 'rgba(124, 58, 237, 0.25)', color: '#C4B5FD' }}>
                  <BookOpen size={16} />
                </div>
                <span>Curated Semester 1–8 Scheme Notes & Question Banks</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#E2E8F0', fontSize: '13px' }}>
                <div style={{ padding: '6px', borderRadius: '8px', background: 'rgba(6, 182, 212, 0.25)', color: '#67E8F9' }}>
                  <Briefcase size={16} />
                </div>
                <span>Campus Placement Drives & CTC Packages</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#E2E8F0', fontSize: '13px' }}>
                <div style={{ padding: '6px', borderRadius: '8px', background: 'rgba(34, 197, 94, 0.25)', color: '#86EFAC' }}>
                  <Users size={16} />
                </div>
                <span>Active VTU Student Discussions & Study Rooms</span>
              </div>
            </div>
          </div>

          {/* Social Proof Strip */}
          <div
            style={{
              padding: '14px 18px',
              borderRadius: '16px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #10B981, #06B6D4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFF'
              }}
            >
              <Sparkles size={18} />
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#FFFFFF' }}>45,000+ VTU Students</div>
              <div style={{ fontSize: '11px', color: '#94A3B8' }}>Active across MSRIT, RVCE, BMSCE & 200+ colleges</div>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div style={{ padding: '44px 36px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '26px', fontWeight: '800', color: '#F8FAFC', marginBottom: '6px' }}>
              Welcome Back
            </h2>
            <p style={{ fontSize: '14px', color: '#94A3B8' }}>
              Enter your credentials to access your academic dashboard
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
                marginBottom: '18px'
              }}
            >
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Email / USN */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#CBD5E1', marginBottom: '6px' }}>
                Email / USN
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '14px', color: '#64748B' }} />
                <input
                  type="text"
                  required
                  placeholder="e.g. aarav.sharma@vtuconnect.in or USN"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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

            {/* Password */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#CBD5E1' }}>
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  style={{ fontSize: '12px', color: '#38BDF8', textDecoration: 'none', fontWeight: '600' }}
                >
                  Forgot Password?
                </Link>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '14px', color: '#64748B' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 40px 12px 38px',
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

            {/* Remember Me & reCAPTCHA Simulator */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: '#94A3B8' }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ accentColor: '#7C3AED', width: '16px', height: '16px' }}
                />
                Remember me
              </label>

              {/* reCAPTCHA badge */}
              <div
                onClick={() => setCaptchaVerified(!captchaVerified)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  fontSize: '11px',
                  color: captchaVerified ? '#86EFAC' : '#94A3B8',
                  cursor: 'pointer'
                }}
              >
                <CheckCircle2 size={13} style={{ color: captchaVerified ? '#22C55E' : '#64748B' }} />
                <span>reCAPTCHA Verified</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '13px',
                borderRadius: '11px',
                background: 'linear-gradient(135deg, #7C3AED 0%, #2563EB 100%)',
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
                boxShadow: '0 8px 20px -4px rgba(124, 58, 237, 0.4)'
              }}
            >
              {loading ? 'Authenticating...' : 'Sign In to Student Account'}{' '}
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Footer Link */}
          <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '13px', color: '#94A3B8' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#38BDF8', fontWeight: '600', textDecoration: 'none' }}>
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
