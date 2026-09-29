import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ShieldCheck, ArrowRight, RotateCw, CheckCircle2, AlertCircle, ArrowLeft, Mail, Lock } from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import authBg from '../../assets/backgrounds/auth-bg.jpg';

export const OtpPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToast } = useToast();

  const email = location.state?.email || localStorage.getItem('vtu_pending_email') || 'student@vtuconnect.in';
  const nextRoute = location.state?.nextRoute || '/dashboard';
  const initialDemoCode = location.state?.demoCode || '123456';

  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [demoCode, setDemoCode] = useState(initialDemoCode);

  const inputRefs = useRef([]);

  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newDigits = [...otpDigits];
    newDigits[index] = value.slice(-1);
    setOtpDigits(newDigits);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split('');
      setOtpDigits(digits);
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerify = async (e) => {
    if (e) e.preventDefault();
    const fullOtp = otpDigits.join('');
    if (fullOtp.length !== 6) {
      setError('Please enter all 6 digits of the OTP code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await api.auth.verifyOtp(email, fullOtp);
      
      // If completing pending registration
      const pendingRegStr = localStorage.getItem('vtu_pending_registration');
      if (pendingRegStr) {
        try {
          const pendingReg = JSON.parse(pendingRegStr);
          await api.auth.register(pendingReg);
          localStorage.removeItem('vtu_pending_registration');
          localStorage.removeItem('vtu_pending_email');
        } catch (regErr) {
          console.warn('Registration completion error:', regErr);
        }
      }

      setSuccess(true);
      addToast('Email verified successfully! Welcome to Student Connect.', 'success');
      setTimeout(() => {
        navigate(nextRoute);
      }, 1200);
    } catch (err) {
      setError(err.message || 'Invalid or expired OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    setLoading(true);
    setError('');

    try {
      const res = await api.auth.sendOtp(email);
      setTimer(60);
      setCanResend(false);
      if (res?.demoCode) {
        setDemoCode(res.demoCode);
      }
      addToast(`New 6-digit OTP code sent to ${email}`, 'info');
    } catch (err) {
      setError(err.message || 'Failed to resend OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoOtp = () => {
    const code = demoCode || '123456';
    const digits = code.padStart(6, '0').slice(0, 6).split('');
    setOtpDigits(digits);
    setError('');
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
        padding: '36px 16px'
      }}
    >
      {/* Top Navigation Row */}
      <div
        style={{
          width: '100%',
          maxWidth: '480px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          zIndex: 2
        }}
      >
        <Link
          to="/register"
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
          <ArrowLeft size={16} /> Back to Register
        </Link>
      </div>

      <div
        style={{
          width: '100%',
          maxWidth: '480px',
          background: 'rgba(15, 23, 42, 0.82)',
          border: '1px solid rgba(255, 255, 255, 0.16)',
          borderRadius: '24px',
          padding: '40px 32px',
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.75), 0 0 35px rgba(124, 58, 237, 0.2)',
          textAlign: 'center',
          position: 'relative',
          zIndex: 2
        }}
      >
        <div
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 18px',
            color: '#FFFFFF',
            boxShadow: '0 10px 25px -5px rgba(124, 58, 237, 0.5)'
          }}
        >
          {success ? <CheckCircle2 size={32} /> : <ShieldCheck size={32} />}
        </div>

        <h2 style={{ fontSize: '26px', fontWeight: '800', color: '#F8FAFC', marginBottom: '8px' }}>
          {success ? 'Email Verified!' : 'Verify Your Email'}
        </h2>
        <p style={{ fontSize: '14px', color: '#94A3B8', marginBottom: '8px', lineHeight: '1.5' }}>
          We sent a 6-digit OTP verification code to:
        </p>
        <div
          style={{
            display: 'inline-block',
            padding: '4px 14px',
            borderRadius: '20px',
            background: 'rgba(124, 58, 237, 0.15)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            color: '#C4B5FD',
            fontSize: '13px',
            fontWeight: '600',
            marginBottom: '28px'
          }}
        >
          {email}
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
              marginBottom: '20px',
              textAlign: 'left'
            }}
          >
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* 6 Digit OTP Inputs */}
        <form onSubmit={handleVerify}>
          <div
            onPaste={handlePaste}
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '10px',
              marginBottom: '24px'
            }}
          >
            {otpDigits.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => (inputRefs.current[idx] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                style={{
                  width: '52px',
                  height: '60px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: digit ? '2px solid #7C3AED' : '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#FFFFFF',
                  fontSize: '24px',
                  fontWeight: '700',
                  textAlign: 'center',
                  outline: 'none',
                  transition: 'all 0.2s ease',
                  boxShadow: digit ? '0 0 15px rgba(124, 58, 237, 0.3)' : 'none'
                }}
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading || success}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)',
              color: '#FFFFFF',
              fontSize: '15px',
              fontWeight: '700',
              border: 'none',
              cursor: loading || success ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 8px 24px -4px rgba(124, 58, 237, 0.5)',
              transition: 'transform 0.15s ease'
            }}
          >
            {loading ? 'Verifying OTP...' : success ? 'Verified! Redirecting...' : 'Verify OTP'}{' '}
            <ArrowRight size={18} />
          </button>
        </form>

        {/* Resend and Timer */}
        <div style={{ marginTop: '24px', fontSize: '13px', color: '#94A3B8' }}>
          {canResend ? (
            <button
              type="button"
              onClick={handleResend}
              disabled={loading}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#38BDF8',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <RotateCw size={14} /> Resend OTP
            </button>
          ) : (
            <span>
              Resend OTP in <strong style={{ color: '#F8FAFC' }}>{timer}s</strong>
            </span>
          )}
        </div>

        {/* Quick Demo Helper */}
        <div
          style={{
            marginTop: '24px',
            padding: '12px 14px',
            borderRadius: '12px',
            background: 'rgba(124, 58, 237, 0.08)',
            border: '1px dashed rgba(139, 92, 246, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '12px'
          }}
        >
          <span style={{ color: '#C4B5FD' }}>⚡ Demo Code: <strong>{demoCode}</strong></span>
          <button
            type="button"
            onClick={fillDemoOtp}
            style={{
              padding: '4px 10px',
              borderRadius: '6px',
              background: 'rgba(124, 58, 237, 0.25)',
              color: '#DDD6FE',
              border: '1px solid rgba(139, 92, 246, 0.4)',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Auto Fill
          </button>
        </div>
      </div>
    </div>
  );
};
