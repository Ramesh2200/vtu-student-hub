import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  BookOpen,
  FileText,
  HelpCircle,
  Briefcase,
  Users,
  Award,
  ArrowRight,
  Sparkles,
  ChevronRight,
  Download,
  ShieldCheck,
  GraduationCap,
  TrendingUp,
  Flame,
  CheckCircle2,
  Clock,
  ExternalLink,
  Layers,
  Lock,
  Play
} from 'lucide-react';
import { api } from '../../services/api';
import campusHero from '../../assets/campus-hero.jpg';

export const LandingPage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalStudents: 15200,
    totalNotes: 48,
    totalQuestionBanks: 52,
    totalPreviousPapers: 36,
    totalPlacements: 14
  });

  // 3D Card Tilt State
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);

  // Active showcase tab
  const [activeTab, setActiveTab] = useState('notes');

  useEffect(() => {
    // Attempt to load live backend statistics
    api.admin.getStats()
      .then((data) => {
        if (data) {
          setStats((prev) => ({
            ...prev,
            totalStudents: Math.max(prev.totalStudents, data.totalStudents || 0),
            totalNotes: Math.max(prev.totalNotes, data.totalNotes || 0),
            totalQuestionBanks: Math.max(prev.totalQuestionBanks, data.totalQuestionBanks || 0),
            totalPreviousPapers: Math.max(prev.totalPreviousPapers, data.totalPreviousPapers || 0),
            totalPlacements: Math.max(prev.totalPlacements, data.totalPlacements || 0)
          }));
        }
      })
      .catch(() => {});
  }, []);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    // Map to rotation degrees
    const rotateY = (x / (rect.width / 2)) * 10;
    const rotateX = -(y / (rect.height / 2)) * 10;
    setMousePos({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePos({ x: 0, y: 0 });
  };

  const features = [
    {
      icon: <GraduationCap size={24} color="#C084FC" />,
      title: 'Semesters 1 through 8',
      desc: 'Complete VTU 2022 Scheme CBCS curriculum hierarchy. Dynamic subject mapping from foundation cycles to advanced 8th sem capstones.'
    },
    {
      icon: <FileText size={24} color="#38BDF8" />,
      title: 'Verified Official PDF Notes',
      desc: 'Faculty-authored unit-wise study notes with interactive in-browser PDF reader, zoom controls, and instant offline download tracking.'
    },
    {
      icon: <HelpCircle size={24} color="#34D399" />,
      title: 'Curated Question Banks',
      desc: 'Categorized 2-Mark, 5-Mark, 10-Mark, Important, and Programming questions with difficulty tags and detailed model solution guides.'
    },
    {
      icon: <BookOpen size={24} color="#FBBF24" />,
      title: 'Solved SEE Previous Papers',
      desc: 'Official VTU Semester End Exam (SEE) question papers from 2022 to 2025 across Regular, Supplementary, and Special examination cycles.'
    },
    {
      icon: <Briefcase size={24} color="#60A5FA" />,
      title: 'VTU Central Placement Hub',
      desc: 'Exclusive campus recruitment drives with verified CTC ranges (₹14-22 LPA), eligibility criteria, skills filters, and direct 1-click apply.'
    },
    {
      icon: <Users size={24} color="#F472B6" />,
      title: 'Community Discussion Chat',
      desc: 'Topic-specific rooms for Java, DBMS, React, Cloud, and Exam Doubts with live polling synchronization and moderation report controls.'
    }
  ];

  const affiliatedColleges = [
    'RV College of Engineering (RVCE)',
    'M.S. Ramaiah Institute of Technology (MSRIT)',
    'BMS College of Engineering (BMSCE)',
    'PES Institute of Technology (PESIT)',
    'Dayananda Sagar College (DSCE)',
    'Siddaganga Institute of Technology (SIT)',
    'Bangalore Institute of Technology (BIT)',
    'National Institute of Engineering (NIE)'
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundImage: `linear-gradient(180deg, rgba(7, 10, 20, 0.45) 0%, rgba(7, 10, 20, 0.55) 50%, rgba(7, 10, 20, 0.65) 100%), url(${campusHero})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat',
        color: '#F8FAFC',
        overflowX: 'hidden',
        position: 'relative'
      }}
    >
      
      {/* 1. TOP GLOBAL NAVIGATION HEADER */}
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '72px',
          background: 'rgba(7, 10, 20, 0.45)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 32px'
        }}
      >
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: '0 4px 16px rgba(124, 58, 237, 0.4)'
            }}
          >
            <GraduationCap size={22} />
          </div>
          <div>
            <span style={{ fontSize: '18px', fontWeight: '900', color: '#FFFFFF', letterSpacing: '-0.02em', display: 'block', lineHeight: 1.2 }}>
              Student Connect
            </span>
            <span style={{ fontSize: '10px', color: '#38BDF8', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              VTU Academic Hub
            </span>
          </div>
        </Link>

        {/* Center Nav Links */}
        <div className="hidden md:flex" style={{ alignItems: 'center', gap: '28px' }}>
          <a href="#semesters" style={{ color: '#CBD5E1', textDecoration: 'none', fontSize: '14px', fontWeight: '600', transition: 'color 0.2s' }}>
            Semesters
          </a>
          <a href="#features" style={{ color: '#CBD5E1', textDecoration: 'none', fontSize: '14px', fontWeight: '600', transition: 'color 0.2s' }}>
            Features
          </a>
          <a href="#placements" style={{ color: '#CBD5E1', textDecoration: 'none', fontSize: '14px', fontWeight: '600', transition: 'color 0.2s' }}>
            Placements
          </a>
          <Link to="/about" style={{ color: '#CBD5E1', textDecoration: 'none', fontSize: '14px', fontWeight: '600', transition: 'color 0.2s' }}>
            About
          </Link>
          <Link to="/help" style={{ color: '#CBD5E1', textDecoration: 'none', fontSize: '14px', fontWeight: '600', transition: 'color 0.2s' }}>
            Help
          </Link>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link
            to="/login"
            style={{
              color: '#F8FAFC',
              fontSize: '13px',
              fontWeight: '700',
              textDecoration: 'none',
              padding: '8px 16px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}
          >
            Sign In
          </Link>

          <Link
            to="/register"
            className="neon-glow-btn"
            style={{
              color: '#FFFFFF',
              fontSize: '13px',
              fontWeight: '800',
              textDecoration: 'none',
              padding: '9px 18px',
              borderRadius: '10px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            Get Started <ArrowRight size={14} />
          </Link>
        </div>
      </nav>

      {/* 2. CINEMATIC HERO SECTION WITH FULL TRANSPARENT BACKGROUND FROM HEAD TO FOOT */}
      <section
        style={{
          position: 'relative',
          minHeight: '100vh',
          paddingTop: '120px',
          paddingBottom: '100px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'transparent',
          overflow: 'hidden'
        }}
      >
        {/* Soft Ambient Radial Lighting Overlays */}
        <div
          style={{
            position: 'absolute',
            top: '15%',
            left: '10%',
            width: '450px',
            height: '450px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(124, 58, 237, 0.18) 0%, transparent 70%)',
            filter: 'blur(80px)',
            pointerEvents: 'none'
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '25%',
            right: '8%',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(6, 182, 212, 0.16) 0%, transparent 70%)',
            filter: 'blur(85px)',
            pointerEvents: 'none'
          }}
        />

        {/* Hero Content Container */}
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', textAlign: 'center', position: 'relative', zIndex: 10 }}>
          
          {/* Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 22px',
              borderRadius: '999px',
              background: 'rgba(7, 10, 20, 0.65)',
              border: '1px solid rgba(167, 139, 250, 0.55)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              marginBottom: '24px',
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.6), 0 0 15px rgba(124, 58, 237, 0.3)'
            }}
          >
            <Sparkles size={16} color="#C4B5FD" />
            <span style={{ fontSize: '13px', fontWeight: '800', color: '#F3E8FF', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              VTU 2022 Scheme CBCS Academic & Placement Hub
            </span>
          </div>

          {/* Main Title */}
          <h1
            style={{
              fontSize: 'clamp(38px, 6.2vw, 70px)',
              fontWeight: '900',
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              marginBottom: '24px',
              color: '#FFFFFF',
              textShadow: '0 4px 30px rgba(0, 0, 0, 0.95), 0 2px 8px rgba(0, 0, 0, 0.9)'
            }}
          >
            Your Complete <span className="shimmer-text">VTU Learning,</span><br />
            Resources & Placement Portal
          </h1>

          <div
            style={{
              maxWidth: '840px',
              margin: '0 auto 36px',
              padding: '16px 28px',
              background: 'rgba(7, 10, 20, 0.52)',
              backdropFilter: 'blur(18px)',
              WebkitBackdropFilter: 'blur(18px)',
              borderRadius: '18px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              boxShadow: '0 12px 35px rgba(0, 0, 0, 0.6)'
            }}
          >
            <p
              style={{
                fontSize: 'clamp(15px, 2vw, 18px)',
                color: '#E2E8F0',
                margin: 0,
                lineHeight: 1.6,
                fontWeight: '500',
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.9)'
              }}
            >
              Access official semester notes, unit-wise question banks, solved SEE question papers (2022–2025), active multinational placement drives, and real-time student community discussion rooms.
            </p>
          </div>

          {/* Dual Action CTA Buttons */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '50px' }}>
            <Link
              to="/login"
              className="neon-glow-btn"
              style={{
                color: '#FFFFFF',
                fontSize: '16px',
                fontWeight: '800',
                padding: '16px 36px',
                borderRadius: '14px',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px'
              }}
            >
              Launch Student Portal <ArrowRight size={18} />
            </Link>

            <Link
              to="/semesters"
              style={{
                background: 'rgba(7, 10, 20, 0.65)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                color: '#F8FAFC',
                fontSize: '16px',
                fontWeight: '700',
                padding: '16px 32px',
                borderRadius: '14px',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                transition: 'all 0.25s ease',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#38BDF8';
                e.currentTarget.style.background = 'rgba(15, 23, 42, 0.85)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
                e.currentTarget.style.background = 'rgba(7, 10, 20, 0.65)';
              }}
            >
              <BookOpen size={18} color="#38BDF8" /> Explore Semesters 1 - 8
            </Link>
          </div>

          {/* Quick Stats Pill Strip */}
          <div
            style={{
              display: 'inline-flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '24px',
              padding: '14px 28px',
              background: 'rgba(15, 23, 42, 0.7)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '999px',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={16} color="#38BDF8" />
              <span style={{ fontSize: '13px', fontWeight: '800', color: '#FFFFFF' }}>15,000+</span>
              <span style={{ fontSize: '12px', color: '#94A3B8' }}>VTU Students</span>
            </div>
            <div style={{ width: '1px', height: '18px', background: 'rgba(255, 255, 255, 0.12)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <GraduationCap size={16} color="#A78BFA" />
              <span style={{ fontSize: '13px', fontWeight: '800', color: '#FFFFFF' }}>Semesters 1 - 8</span>
              <span style={{ fontSize: '12px', color: '#94A3B8' }}>2022 CBCS Scheme</span>
            </div>
            <div style={{ width: '1px', height: '18px', background: 'rgba(255, 255, 255, 0.12)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Briefcase size={16} color="#34D399" />
              <span style={{ fontSize: '13px', fontWeight: '800', color: '#FFFFFF' }}>₹14 - 22 LPA</span>
              <span style={{ fontSize: '12px', color: '#94A3B8' }}>Tier-1 CTC Drives</span>
            </div>
            <div style={{ width: '1px', height: '18px', background: 'rgba(255, 255, 255, 0.12)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={16} color="#FBBF24" />
              <span style={{ fontSize: '13px', fontWeight: '800', color: '#FFFFFF' }}>100% Verified</span>
              <span style={{ fontSize: '12px', color: '#94A3B8' }}>Faculty PDF Notes</span>
            </div>
          </div>

        </div>

        {/* 3. 3D INTERACTIVE TILT SHOWCASE DASHBOARD PREVIEW */}
        <div
          className="perspective-container"
          style={{ width: '100%', maxWidth: '1100px', margin: '60px auto 0', padding: '0 24px', position: 'relative', zIndex: 20 }}
        >
          {/* Floating 3D Satellite Badge 1 (Top Left) */}
          <div
            className="animate-float"
            style={{
              position: 'absolute',
              top: '-25px',
              left: '5%',
              background: 'rgba(15, 23, 42, 0.85)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(124, 58, 237, 0.4)',
              borderRadius: '16px',
              padding: '12px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              boxShadow: '0 16px 32px rgba(0, 0, 0, 0.5), 0 0 20px rgba(124, 58, 237, 0.25)',
              zIndex: 30
            }}
          >
            <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'rgba(124, 58, 237, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#A78BFA' }}>
              <Sparkles size={16} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '12px', fontWeight: '800', color: '#F8FAFC' }}>CBCS 2022 Scheme</div>
              <div style={{ fontSize: '10px', color: '#A78BFA' }}>Official Curriculum Synchronized</div>
            </div>
          </div>

          {/* Floating 3D Satellite Badge 2 (Top Right) */}
          <div
            className="animate-float-slow"
            style={{
              position: 'absolute',
              top: '-20px',
              right: '5%',
              background: 'rgba(15, 23, 42, 0.85)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(6, 182, 212, 0.4)',
              borderRadius: '16px',
              padding: '12px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              boxShadow: '0 16px 32px rgba(0, 0, 0, 0.5), 0 0 20px rgba(6, 182, 212, 0.25)',
              zIndex: 30
            }}
          >
            <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'rgba(6, 182, 212, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22D3EE' }}>
              <FileText size={16} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '12px', fontWeight: '800', color: '#F8FAFC' }}>In-Browser PDF Viewer</div>
              <div style={{ fontSize: '10px', color: '#38BDF8' }}>Read Unit Notes Instantly</div>
            </div>
          </div>

          {/* Floating 3D Satellite Badge 3 (Bottom Left) */}
          <div
            className="animate-float-reverse"
            style={{
              position: 'absolute',
              bottom: '-25px',
              left: '8%',
              background: 'rgba(15, 23, 42, 0.85)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              borderRadius: '16px',
              padding: '12px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              boxShadow: '0 16px 32px rgba(0, 0, 0, 0.5), 0 0 20px rgba(16, 185, 129, 0.25)',
              zIndex: 30
            }}
          >
            <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#34D399' }}>
              <Briefcase size={16} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '12px', fontWeight: '800', color: '#F8FAFC' }}>AWS, Cisco & Google Drives</div>
              <div style={{ fontSize: '10px', color: '#34D399' }}>1-Click Placement Applications</div>
            </div>
          </div>

          {/* Floating 3D Satellite Badge 4 (Bottom Right) */}
          <div
            className="animate-float"
            style={{
              position: 'absolute',
              bottom: '-20px',
              right: '8%',
              background: 'rgba(15, 23, 42, 0.85)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              borderRadius: '16px',
              padding: '12px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              boxShadow: '0 16px 32px rgba(0, 0, 0, 0.5), 0 0 20px rgba(245, 158, 11, 0.25)',
              zIndex: 30
            }}
          >
            <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FBBF24' }}>
              <BookOpen size={16} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '12px', fontWeight: '800', color: '#F8FAFC' }}>SEE 2022 - 2025 Papers</div>
              <div style={{ fontSize: '10px', color: '#FBBF24' }}>With VTU Marking Solutions</div>
            </div>
          </div>

          {/* 3D Tilted Glass Card Frame */}
          <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
            className="tilt-3d"
            style={{
              transform: isHovered
                ? `perspective(1200px) rotateX(${mousePos.x}deg) rotateY(${mousePos.y}deg) translateY(-8px)`
                : 'perspective(1200px) rotateX(2deg) rotateY(0deg)',
              background: 'rgba(15, 23, 42, 0.74)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: '0 30px 80px rgba(0, 0, 0, 0.75), 0 0 45px rgba(245, 158, 11, 0.15), 0 0 40px rgba(124, 58, 237, 0.25)'
            }}
          >
            {/* Window Topbar */}
            <div
              style={{
                background: 'rgba(30, 41, 59, 0.65)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '12px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#EF4444', display: 'inline-block' }} />
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#F59E0B', display: 'inline-block' }} />
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
                <span style={{ marginLeft: '12px', fontSize: '12px', color: '#94A3B8', fontWeight: '600' }}>
                  https://vtuconnect.in/student/dashboard
                </span>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: '800', background: 'rgba(16, 185, 129, 0.2)', color: '#34D399', padding: '2px 8px', borderRadius: '4px' }}>
                  ● LIVE DEMO
                </span>
              </div>
            </div>

            {/* Dashboard Showcase Body */}
            <div style={{ padding: '28px', textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#FFFFFF', margin: '0 0 4px 0' }}>
                    Semester 6 Computer Science Resources
                  </h3>
                  <span style={{ fontSize: '12px', color: '#94A3B8' }}>
                    BCS601 Cloud Computing • BCS602 Machine Learning • BCS603 Computer Networks
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => setActiveTab('notes')}
                    style={{
                      background: activeTab === 'notes' ? 'linear-gradient(135deg, #7C3AED 0%, #6366F1 100%)' : 'rgba(255, 255, 255, 0.06)',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '6px 14px',
                      color: '#FFF',
                      fontSize: '12px',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    Lecture Notes (PDF)
                  </button>
                  <button
                    onClick={() => setActiveTab('qb')}
                    style={{
                      background: activeTab === 'qb' ? 'linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)' : 'rgba(255, 255, 255, 0.06)',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '6px 14px',
                      color: '#FFF',
                      fontSize: '12px',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    Question Banks
                  </button>
                  <button
                    onClick={() => setActiveTab('placements')}
                    style={{
                      background: activeTab === 'placements' ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)' : 'rgba(255, 255, 255, 0.06)',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '6px 14px',
                      color: '#FFF',
                      fontSize: '12px',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    Placements
                  </button>
                </div>
              </div>

              {/* Dynamic Tab Cards Inside 3D Showcase */}
              {activeTab === 'notes' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                  <div style={{ background: 'rgba(30, 41, 59, 0.5)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '14px', padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '11px', fontWeight: '800', background: 'rgba(124, 58, 237, 0.2)', color: '#C4B5FD', padding: '2px 8px', borderRadius: '4px' }}>Unit 1</span>
                      <span style={{ fontSize: '11px', color: '#94A3B8' }}>3.4 MB PDF</span>
                    </div>
                    <h4 style={{ fontSize: '14px', fontWeight: '800', color: '#F8FAFC', margin: '0 0 6px 0' }}>
                      Cloud Computing Principles & Virtualization
                    </h4>
                    <p style={{ fontSize: '12px', color: '#94A3B8', margin: '0 0 14px 0' }}>
                      NIST Definition, SPI Service Models, Type 1/2 Hypervisors and hardware-assisted virtualization.
                    </p>
                    <Link to="/login" style={{ color: '#38BDF8', fontSize: '12px', fontWeight: '700', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      Read in PDF Viewer <ChevronRight size={14} />
                    </Link>
                  </div>

                  <div style={{ background: 'rgba(30, 41, 59, 0.5)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '14px', padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '11px', fontWeight: '800', background: 'rgba(124, 58, 237, 0.2)', color: '#C4B5FD', padding: '2px 8px', borderRadius: '4px' }}>Unit 2</span>
                      <span style={{ fontSize: '11px', color: '#94A3B8' }}>4.1 MB PDF</span>
                    </div>
                    <h4 style={{ fontSize: '14px', fontWeight: '800', color: '#F8FAFC', margin: '0 0 6px 0' }}>
                      Cloud Storage & Distributed File Systems
                    </h4>
                    <p style={{ fontSize: '12px', color: '#94A3B8', margin: '0 0 14px 0' }}>
                      GFS Architecture, HDFS Blocks, Replication Factor, and MapReduce processing flow.
                    </p>
                    <Link to="/login" style={{ color: '#38BDF8', fontSize: '12px', fontWeight: '700', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      Read in PDF Viewer <ChevronRight size={14} />
                    </Link>
                  </div>

                  <div style={{ background: 'rgba(30, 41, 59, 0.5)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '14px', padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '11px', fontWeight: '800', background: 'rgba(124, 58, 237, 0.2)', color: '#C4B5FD', padding: '2px 8px', borderRadius: '4px' }}>Unit 3</span>
                      <span style={{ fontSize: '11px', color: '#94A3B8' }}>2.9 MB PDF</span>
                    </div>
                    <h4 style={{ fontSize: '14px', fontWeight: '800', color: '#F8FAFC', margin: '0 0 6px 0' }}>
                      Cloud Security & Federated IAM Architecture
                    </h4>
                    <p style={{ fontSize: '12px', color: '#94A3B8', margin: '0 0 14px 0' }}>
                      Data security in multi-tenant environments, encryption at rest/transit, and SLA guarantees.
                    </p>
                    <Link to="/login" style={{ color: '#38BDF8', fontSize: '12px', fontWeight: '700', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      Read in PDF Viewer <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>
              )}

              {activeTab === 'qb' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                  <div style={{ background: 'rgba(30, 41, 59, 0.5)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '14px', padding: '16px' }}>
                    <span style={{ fontSize: '11px', fontWeight: '800', background: 'rgba(6, 182, 212, 0.2)', color: '#67E8F9', padding: '2px 8px', borderRadius: '4px' }}>10 Marks • Frequently Asked</span>
                    <h4 style={{ fontSize: '14px', fontWeight: '800', color: '#F8FAFC', margin: '8px 0 6px 0' }}>
                      Compare Type-1 & Type-2 Hypervisors with Block Diagram
                    </h4>
                    <p style={{ fontSize: '12px', color: '#94A3B8', margin: 0 }}>
                      Asked in SEE July 2024, Jan 2023. Includes complete architectural comparison and scoring rubrics.
                    </p>
                  </div>

                  <div style={{ background: 'rgba(30, 41, 59, 0.5)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '14px', padding: '16px' }}>
                    <span style={{ fontSize: '11px', fontWeight: '800', background: 'rgba(6, 182, 212, 0.2)', color: '#67E8F9', padding: '2px 8px', borderRadius: '4px' }}>5 Marks • Important</span>
                    <h4 style={{ fontSize: '14px', fontWeight: '800', color: '#F8FAFC', margin: '8px 0 6px 0' }}>
                      Explain MapReduce Word Count Step-by-Step
                    </h4>
                    <p style={{ fontSize: '12px', color: '#94A3B8', margin: 0 }}>
                      Trace mapping, shuffling, sorting, and reduction phase on input string tuples.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'placements' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                  <div style={{ background: 'rgba(30, 41, 59, 0.5)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '14px', padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '12px', fontWeight: '800', color: '#34D399' }}>₹18.5 - 24 LPA</span>
                      <span style={{ fontSize: '11px', color: '#94A3B8' }}>Bengaluru</span>
                    </div>
                    <h4 style={{ fontSize: '15px', fontWeight: '800', color: '#F8FAFC', margin: '0 0 4px 0' }}>
                      Software Development Engineer I
                    </h4>
                    <div style={{ fontSize: '12px', color: '#A78BFA', fontWeight: '700', marginBottom: '8px' }}>
                      Amazon Web Services (AWS)
                    </div>
                    <span style={{ fontSize: '11px', color: '#94A3B8' }}>Batch: 2025 • Eligibility: 60%+</span>
                  </div>

                  <div style={{ background: 'rgba(30, 41, 59, 0.5)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '14px', padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '12px', fontWeight: '800', color: '#34D399' }}>₹16 - 21 LPA</span>
                      <span style={{ fontSize: '11px', color: '#94A3B8' }}>Bengaluru</span>
                    </div>
                    <h4 style={{ fontSize: '15px', fontWeight: '800', color: '#F8FAFC', margin: '0 0 4px 0' }}>
                      Cloud & Security Systems Engineer
                    </h4>
                    <div style={{ fontSize: '12px', color: '#A78BFA', fontWeight: '700', marginBottom: '8px' }}>
                      Cisco Systems
                    </div>
                    <span style={{ fontSize: '11px', color: '#94A3B8' }}>Batch: 2025 • Eligibility: 65%+</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom spacer */}
      </section>

      {/* 4. AFFILIATED INSTITUTIONS REPUTATION STRIP */}
      <section
        style={{
          padding: '40px 24px',
          background: 'rgba(11, 16, 32, 0.4)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '12px', fontWeight: '800', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '20px' }}>
            Adopted by Engineering Scholars Across Leading VTU Autonomous & Affiliated Colleges
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px' }}>
            {affiliatedColleges.map((college, idx) => (
              <span
                key={idx}
                style={{
                  fontSize: '13px',
                  fontWeight: '700',
                  color: '#CBD5E1',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  padding: '8px 16px',
                  borderRadius: '10px'
                }}
              >
                {college}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 5. 6 CORE ACADEMIC MODULES */}
      <section id="features" style={{ padding: '100px 24px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 14px', borderRadius: '999px', background: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.3)', marginBottom: '14px' }}>
            <Sparkles size={14} color="#38BDF8" />
            <span style={{ fontSize: '12px', fontWeight: '800', color: '#7DD3FC', textTransform: 'uppercase' }}>Engineered for Academic Excellence</span>
          </div>
          <h2 style={{ fontSize: '36px', fontWeight: '900', color: '#FFFFFF', letterSpacing: '-0.02em', margin: 0 }}>
            Everything a VTU Engineer Needs, Centralized.
          </h2>
          <p style={{ color: '#94A3B8', fontSize: '16px', maxWidth: '640px', margin: '10px auto 0' }}>
            From day-one semester foundations to final-year placements, access verified curriculum material without searching multiple fragmented websites.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
          {features.map((item, idx) => (
            <div
              key={idx}
              style={{
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '20px',
                padding: '32px',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.borderColor = 'rgba(124, 58, 237, 0.5)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.5), 0 0 25px rgba(124, 58, 237, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div>
                <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(255, 255, 255, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                  {item.icon}
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#F8FAFC', marginBottom: '10px' }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: '14px', color: '#94A3B8', lineHeight: 1.6, margin: 0 }}>
                  {item.desc}
                </p>
              </div>

              <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <Link
                  to="/login"
                  style={{
                    fontSize: '13px',
                    fontWeight: '700',
                    color: '#38BDF8',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  Explore Module <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. CALL TO ACTION FOOTER BANNER */}
      <section style={{ padding: '80px 24px', maxWidth: '1200px', margin: '0 auto 40px' }}>
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.3) 0%, rgba(6, 182, 212, 0.2) 100%)',
            border: '1px solid rgba(124, 58, 237, 0.4)',
            borderRadius: '28px',
            padding: '60px 40px',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <h2 style={{ fontSize: '34px', fontWeight: '900', color: '#FFFFFF', marginBottom: '16px', letterSpacing: '-0.02em' }}>
            Empower Your VTU Engineering Journey Today
          </h2>
          <p style={{ fontSize: '16px', color: '#CBD5E1', maxWidth: '640px', margin: '0 auto 32px', lineHeight: 1.6 }}>
            Join thousands of scholars from RVCE, MSRIT, BMSCE, and colleges across Karnataka. Free registration with verified CBCS academic resources.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <Link
              to="/register"
              className="neon-glow-btn"
              style={{
                color: '#FFFFFF',
                fontSize: '15px',
                fontWeight: '800',
                padding: '14px 32px',
                borderRadius: '12px',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              Create Free Student Account <ArrowRight size={16} />
            </Link>

            <Link
              to="/login"
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#FFFFFF',
                fontSize: '15px',
                fontWeight: '700',
                padding: '14px 28px',
                borderRadius: '12px',
                textDecoration: 'none'
              }}
            >
              Sign In to Existing Profile
            </Link>
          </div>
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer
        style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(7, 10, 20, 0.45)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          padding: '40px 24px',
          color: '#94A3B8',
          fontSize: '13px'
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <strong style={{ color: '#F8FAFC' }}>Student Connect – VTU Student Connect</strong>
            <div>Built for Visvesvaraya Technological University (VTU) Engineering Community.</div>
          </div>

          <div style={{ display: 'flex', gap: '20px' }}>
            <Link to="/about" style={{ color: '#94A3B8', textDecoration: 'none' }}>About</Link>
            <Link to="/help" style={{ color: '#94A3B8', textDecoration: 'none' }}>Help</Link>
          </div>
        </div>
      </footer>

    </div>
  );
};
