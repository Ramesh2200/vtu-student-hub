import React from 'react';
import { Link } from 'react-router-dom';
import { Award, BookOpen, Layers, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

export const AboutPage = () => {
  return (
    <div style={{ minHeight: '100vh', background: '#0B1020', color: '#F8FAFC', padding: '60px 24px 100px' }}>
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span
            style={{
              fontSize: '12px',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: '#A78BFA',
              background: 'rgba(124, 58, 237, 0.15)',
              padding: '6px 16px',
              borderRadius: '9999px',
              border: '1px solid rgba(139, 92, 246, 0.3)'
            }}
          >
            About Student Connect
          </span>
          <h1 style={{ fontSize: '36px', fontWeight: '800', marginTop: '16px', marginBottom: '12px' }}>
            Visvesvaraya Technological University Academic Ecosystem
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '16px', maxWidth: '680px', margin: '0 auto' }}>
            A centralized digital resource architecture bridging students, curriculum specialists, and industry recruiters across Karnataka.
          </p>
        </div>

        {/* Vision & Mission Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '48px' }}>
          <div
            style={{
              background: 'rgba(17, 24, 39, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '18px',
              padding: '28px',
              backdropFilter: 'blur(12px)'
            }}
          >
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(124, 58, 237, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#A78BFA', marginBottom: '16px' }}>
              <Award size={22} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>CBCS 2022 Scheme Alignment</h3>
            <p style={{ color: '#94A3B8', fontSize: '14px', lineHeight: '1.6' }}>
              Full compliance with VTU Outcome Based Education (OBE) and Choice Based Credit System (CBCS), ensuring all notes and question banks strictly follow the prescribed syllabus units.
            </p>
          </div>

          <div
            style={{
              background: 'rgba(17, 24, 39, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '18px',
              padding: '28px',
              backdropFilter: 'blur(12px)'
            }}
          >
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(6, 182, 212, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38BDF8', marginBottom: '16px' }}>
              <BookOpen size={22} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>Verified Academic Content</h3>
            <p style={{ color: '#94A3B8', fontSize: '14px', lineHeight: '1.6' }}>
              Only official, high-resolution PDF notes reviewed and vetted by university faculties and department heads are hosted, eliminating noisy or outdated study materials.
            </p>
          </div>

          <div
            style={{
              background: 'rgba(17, 24, 39, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '18px',
              padding: '28px',
              backdropFilter: 'blur(12px)'
            }}
          >
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#34D399', marginBottom: '16px' }}>
              <Layers size={22} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>Integrated Career Fast-Track</h3>
            <p style={{ color: '#94A3B8', fontSize: '14px', lineHeight: '1.6' }}>
              Direct connection to campus hiring drives, pool campus recruitment tests, CTC benchmarks, and eligibility criteria for 2025 and 2026 engineering batches.
            </p>
          </div>
        </div>

        {/* Syllabus Schemes Breakdown */}
        <div
          style={{
            background: 'rgba(17, 24, 39, 0.7)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '20px',
            padding: '36px',
            marginBottom: '48px'
          }}
        >
          <h2 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '16px', color: '#F8FAFC' }}>
            Supported Syllabus Schemes &amp; Accreditation Standards
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginTop: '20px' }}>
            <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <div style={{ fontWeight: '700', color: '#A78BFA', fontSize: '15px', marginBottom: '6px' }}>
                2022 Scheme CBCS (Active)
              </div>
              <p style={{ fontSize: '13px', color: '#94A3B8' }}>
                160 Credits 4-Year B.E./B.Tech curriculum with mandatory industry internships, technical electives, and research projects.
              </p>
            </div>
            <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <div style={{ fontWeight: '700', color: '#38BDF8', fontSize: '15px', marginBottom: '6px' }}>
                2021 Scheme CBCS
              </div>
              <p style={{ fontSize: '13px', color: '#94A3B8' }}>
                Comprehensive syllabus for NEP cohorts with enhanced multidisciplinary ability enhancement and AI/ML specializations.
              </p>
            </div>
            <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <div style={{ fontWeight: '700', color: '#34D399', fontSize: '15px', marginBottom: '6px' }}>
                2018 Scheme CBCS
              </div>
              <p style={{ fontSize: '13px', color: '#94A3B8' }}>
                Legacy curriculum resources archive and solved previous year SEE question papers for supplementary and backlog clearance.
              </p>
            </div>
          </div>
        </div>

        {/* Action button */}
        <div style={{ textAlign: 'center' }}>
          <Link
            to="/register"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '14px 28px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #7C3AED 0%, #2563EB 100%)',
              color: '#FFFFFF',
              fontWeight: '700',
              textDecoration: 'none',
              boxShadow: '0 10px 25px -5px rgba(124, 58, 237, 0.4)'
            }}
          >
            Create Your Free Account Today <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};
