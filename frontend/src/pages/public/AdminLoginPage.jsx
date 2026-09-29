import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle, ArrowLeft, KeyRound, Server } from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import adminBg from '../../assets/backgrounds/admin-bg.jpg';

export const AdminLoginPage = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide administrator credentials.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await api.auth.login(email.trim(), password);
      if (data.role !== 'ADMIN') {
        setError('Access denied. Administrator clearance is required.');
        return;
      }
      addToast('Administrative session authorized. Welcome VTU Admin.', 'success');
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify admin credentials.');
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
        backgroundImage: `linear-gradient(to bottom, rgba(5, 10, 24, 0.40) 0%, rgba(5, 10, 24, 0.85) 100%), url(${adminBg})`,
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
          maxWidth: '460px',
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
            background: 'rgba(15, 23, 42, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(16px)',
            color: '#E2E8F0',
            fontSize: '13px',
            fontWeight: '600',
            textDecoration: 'none',
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.4)'
          }}
        >
          <ArrowLeft size={16} /> Return to Portal Home
        </Link>
      </div>

      <div
        style={{
          width: '100%',
          maxWidth: '460px',
          background: 'rgba(11, 16, 32, 0.85)',
          border: '1px solid rgba(6, 182, 212, 0.3)',
          borderRadius: '24px',
          padding: '42px 34px',
          backdropFilter: 'blur(28px) saturate(200%)',
          WebkitBackdropFilter: 'blur(28px) saturate(200%)',
          boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.85), 0 0 45px rgba(6, 182, 212, 0.2)',
          position: 'relative',
          zIndex: 2
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              color: '#FFFFFF',
              boxShadow: '0 10px 25px -5px rgba(6, 182, 212, 0.4)'
            }}
          >
            <ShieldCheck size={28} />
          </div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              borderRadius: '20px',
              background: 'rgba(6, 182, 212, 0.12)',
              border: '1px solid rgba(6, 182, 212, 0.3)',
              color: '#67E8F9',
              fontSize: '11px',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: '10px'
            }}
          >
            <Server size={12} /> Restricted Admin Console
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#F8FAFC', marginBottom: '6px' }}>
            VTU Central Administration
          </h2>
          <p style={{ fontSize: '13px', color: '#94A3B8' }}>
            Authorized university officials and resource moderators only
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

        <form onSubmit={handleAdminLogin} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#CBD5E1', marginBottom: '6px' }}>
              Administrator Email
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '12px', top: '14px', color: '#64748B' }} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 38px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#F8FAFC',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#CBD5E1', marginBottom: '6px' }}>
              Master Security Key / Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '12px', top: '14px', color: '#64748B' }} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 38px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#F8FAFC',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '14px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #06B6D4 0%, #2563EB 100%)',
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
              boxShadow: '0 8px 24px -4px rgba(6, 182, 212, 0.4)'
            }}
          >
            {loading ? 'Authenticating Clearance...' : 'Authenticate Admin Session'} <ArrowRight size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};
