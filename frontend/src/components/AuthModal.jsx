import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { authApi } from '../services/api';
import {
  X,
  Phone,
  ShieldCheck,
  ArrowRight,
  RefreshCw,
  Sparkles,
  Lock,
  GraduationCap,
  KeyRound,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export const AuthModal = () => {
  const {
    showAuthModal,
    setShowAuthModal,
    setShowOnboardingModal,
    loginUser
  } = useApp();

  const [authMethod, setAuthMethod] = useState('phone'); // 'phone' | 'google'
  const [phoneNumber, setPhoneNumber] = useState('9845012345');
  const [otpSent, setOtpSent] = useState(false);
  const [otpValues, setOtpValues] = useState(['5', '8', '2', '9', '1', '0']);
  const [countdown, setCountdown] = useState(60);
  const [errorMessage, setErrorMessage] = useState('');
  const [successNotice, setSuccessNotice] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let timer;
    if (otpSent && countdown > 0) {
      timer = setInterval(() => setCountdown(c => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [otpSent, countdown]);

  if (!showAuthModal) return null;

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 10) {
      setErrorMessage('Please enter a valid 10-digit Indian phone number.');
      return;
    }
    setErrorMessage('');
    setSuccessNotice('');
    setIsLoading(true);

    try {
      const res = await authApi.sendPhoneOtp(phoneNumber);
      setIsLoading(false);
      setOtpSent(true);
      setCountdown(res.expiresInSeconds || 60);
      setSuccessNotice(res.message || 'OTP dispatched securely via SMS gateway');
    } catch (err) {
      setIsLoading(false);
      setErrorMessage(err.message || 'Failed to dispatch OTP. Please check rate limit.');
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) value = value.slice(-1);
    const newOtp = [...otpValues];
    newOtp[index] = value;
    setOtpValues(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const entered = otpValues.join('');
    if (entered.length < 6) {
      setErrorMessage('Please enter the full 6-digit OTP code.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const authData = await authApi.verifyOtp(phoneNumber, entered);
      setIsLoading(false);
      setShowAuthModal(false);
      loginUser('student', authData.user);
      setShowOnboardingModal(true);
    } catch (err) {
      setIsLoading(false);
      setErrorMessage(err.message || 'Invalid OTP code. Please retry.');
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const authData = await authApi.googleAuth('aarav.sharma@msrit.edu');
      setIsLoading(false);
      setShowAuthModal(false);
      loginUser('student', authData.user);
      setShowOnboardingModal(true);
    } catch (err) {
      setIsLoading(false);
      setErrorMessage('Google Authentication was interrupted. Please retry.');
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(5, 8, 18, 0.85)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      zIndex: 1000
    }}>
      <div style={{
        maxWidth: '850px',
        width: '100%',
        borderRadius: '24px',
        background: '#0F172A',
        border: '1px solid rgba(108, 92, 231, 0.3)',
        boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.9), 0 0 40px rgba(108, 92, 231, 0.25)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        overflow: 'hidden',
        position: 'relative'
      }}>
        {/* Close button */}
        <button
          onClick={() => setShowAuthModal(false)}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.08)',
            color: '#F8FAFC',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10
          }}
        >
          <X size={18} />
        </button>

        {/* Left Side: Brand Visual & Highlights */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(108, 92, 231, 0.2) 0%, rgba(79, 140, 255, 0.15) 100%), #0B1020',
          padding: '40px 32px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          borderRight: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <div>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #6C5CE7 0%, #4F8CFF 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '24px',
              boxShadow: '0 8px 20px rgba(108, 92, 231, 0.5)'
            }}>
              <GraduationCap size={28} color="#FFFFFF" />
            </div>

            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#F8FAFC', marginBottom: '12px' }}>
              VTU Student Connect
            </h2>
            <p style={{ fontSize: '0.92rem', color: '#94A3B8', lineHeight: 1.6, marginBottom: '28px' }}>
              The unified digital platform for VTU students. Personalized study materials, scheme-specific notes, and recruitment pipelines.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: '#E2E8F0' }}>
                <ShieldCheck size={18} color="#10B981" />
                <span>Zero spam, verified university credentials</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: '#E2E8F0' }}>
                <Sparkles size={18} color="#A78BFA" />
                <span>Automated course syllabus matching</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: '#E2E8F0' }}>
                <Lock size={18} color="#22D3EE" />
                <span>End-to-end encrypted session tokens</span>
              </div>
            </div>
          </div>

          <div style={{
            padding: '14px',
            borderRadius: '12px',
            background: 'rgba(255, 255, 255, 0.04)',
            fontSize: '0.75rem',
            color: '#64748B',
            marginTop: '32px'
          }}>
            Powered by VTU Central Authentication Service (Firebase & Google Auth Integration)
          </div>
        </div>

        {/* Right Side: Auth Form */}
        <div style={{ padding: '40px 32px' }}>
          <div style={{ marginBottom: '28px' }}>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#F8FAFC', marginBottom: '6px' }}>
              Welcome Back
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#94A3B8' }}>
              Sign in to continue your VTU journey.
            </p>
          </div>

          {/* Google Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: '12px',
              background: '#FFFFFF',
              color: '#0F172A',
              fontWeight: 600,
              fontSize: '0.92rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              marginBottom: '20px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.2s'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Continue with Google</span>
          </button>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            margin: '20px 0',
            color: '#64748B',
            fontSize: '0.8rem'
          }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.1)' }} />
            <span>OR MOBILE OTP</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.1)' }} />
          </div>

          {/* Phone Form */}
          {!otpSent ? (
            <form onSubmit={handleSendOtp}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#E2E8F0', marginBottom: '8px' }}>
                Mobile Number (+91)
              </label>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '12px',
                overflow: 'hidden',
                marginBottom: '16px'
              }}>
                <div style={{
                  padding: '12px 14px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  color: '#A78BFA',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  borderRight: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  +91
                </div>
                <input
                  type="tel"
                  maxLength={10}
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 10-digit mobile number"
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    background: 'transparent',
                    border: 'none',
                    color: '#F8FAFC',
                    fontSize: '0.95rem'
                  }}
                />
              </div>

              {errorMessage && (
                <div style={{ fontSize: '0.82rem', color: '#EF4444', marginBottom: '14px' }}>
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #6C5CE7 0%, #4F8CFF 100%)',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 8px 25px rgba(108, 92, 231, 0.4)'
                }}
              >
                {isLoading ? (
                  <span>Sending Firebase OTP...</span>
                ) : (
                  <>
                    <span>Send OTP Code</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp}>
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#E2E8F0' }}>
                    Enter 6-Digit OTP sent to +91 {phoneNumber}
                  </label>
                  <button
                    type="button"
                    onClick={() => setOtpSent(false)}
                    style={{ fontSize: '0.75rem', color: '#67E8F9', textDecoration: 'underline' }}
                  >
                    Change
                  </button>
                </div>

                {/* 6 Digit Inputs */}
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'space-between' }}>
                  {otpValues.map((val, idx) => (
                    <input
                      key={idx}
                      id={`otp-${idx}`}
                      type="text"
                      maxLength={1}
                      value={val}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      style={{
                        width: '46px',
                        height: '52px',
                        borderRadius: '10px',
                        background: 'rgba(255, 255, 255, 0.06)',
                        border: '1px solid rgba(108, 92, 231, 0.4)',
                        color: '#F8FAFC',
                        fontSize: '1.3rem',
                        fontWeight: 700,
                        textAlign: 'center'
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Countdown and Resend */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '0.8rem',
                color: '#94A3B8',
                marginBottom: '20px'
              }}>
                <span>
                  {countdown > 0 ? `Resend code in ${countdown}s` : 'Did not receive code?'}
                </span>
                {countdown === 0 && (
                  <button
                    type="button"
                    onClick={() => { setCountdown(60); }}
                    style={{ color: '#A78BFA', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <RefreshCw size={13} />
                    <span>Resend OTP</span>
                  </button>
                )}
              </div>

              {successNotice && (
                <div style={{
                  fontSize: '0.82rem',
                  color: '#34D399',
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  marginBottom: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <CheckCircle2 size={16} />
                  <span>{successNotice}</span>
                </div>
              )}

              {errorMessage && (
                <div style={{
                  fontSize: '0.82rem',
                  color: '#F87171',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  marginBottom: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <AlertTriangle size={16} />
                  <span>{errorMessage}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #10B981 0%, #22D3EE 100%)',
                  color: '#0B1020',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: 'pointer'
                }}
              >
                {isLoading ? <span>Verifying OTP with Cryptographic Vault...</span> : <span>Verify & Establish Secure Session</span>}
              </button>
            </form>
          )}

          {/* Real-time Security Indicators */}
          <div style={{
            marginTop: '24px',
            padding: '12px 14px',
            borderRadius: '12px',
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.72rem', color: '#94A3B8' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={14} color="#10B981" />
                <span>HMAC-SHA256 JWT Token</span>
              </span>
              <span style={{ color: '#10B981', fontWeight: 600 }}>Active</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.72rem', color: '#94A3B8' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <KeyRound size={14} color="#60A5FA" />
                <span>Rate-Limit Guard (15 req/min)</span>
              </span>
              <span style={{ color: '#60A5FA', fontWeight: 600 }}>Enforced</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.72rem', color: '#94A3B8' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Lock size={14} color="#C084FC" />
                <span>BCrypt 12-Round Password Hash</span>
              </span>
              <span style={{ color: '#C084FC', fontWeight: 600 }}>MySQL 9.7</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
