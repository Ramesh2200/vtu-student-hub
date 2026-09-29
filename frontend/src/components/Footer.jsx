import React from 'react';
import { GraduationCap, Globe, Share2, Mail, ExternalLink, Heart } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Footer = () => {
  const { setActiveTab } = useApp();

  return (
    <footer style={{
      background: '#070B16',
      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '70px 24px 36px',
      position: 'relative'
    }}>
      <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
        
        {/* Top Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '40px',
          marginBottom: '50px'
        }}>
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #6C5CE7 0%, #4F8CFF 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <GraduationCap size={22} color="#FFFFFF" />
              </div>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#F8FAFC' }}>
                VTU Student Connect
              </span>
            </div>
            <p style={{ fontSize: '0.88rem', color: '#94A3B8', lineHeight: 1.6, marginBottom: '20px' }}>
              The comprehensive digital platform empowering Visvesvaraya Technological University students with verified notes, exam papers, and career pathways.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <a href="#" style={{ padding: '8px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', color: '#CBD5E1' }}>
                <Globe size={16} />
              </a>
              <a href="#" style={{ padding: '8px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', color: '#CBD5E1' }}>
                <Share2 size={16} />
              </a>
              <a href="#" style={{ padding: '8px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', color: '#CBD5E1' }}>
                <Mail size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#F8FAFC', marginBottom: '18px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Navigation
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', color: '#94A3B8' }}>
              <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('home'); }} style={{ transition: 'color 0.2s' }}>Home</a>
              <a href="#features">Features</a>
              <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('academics'); }}>Academic Hub</a>
              <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('notes'); }}>Notes & Solved Papers</a>
              <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('community'); }}>Student Discussions</a>
            </div>
          </div>

          {/* Programs & Opportunities */}
          <div>
            <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#F8FAFC', marginBottom: '18px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Opportunities
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', color: '#94A3B8' }}>
              <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('events'); }}>State-Level Hackathons</a>
              <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('placements'); }}>Campus Placement Drives</a>
              <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('placements'); }}>Summer Internships 2026</a>
              <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('groups'); }}>Peer Study Groups</a>
              <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('papers'); }}>SEE Previous Year Papers</a>
            </div>
          </div>

          {/* Affiliated University Note */}
          <div>
            <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#F8FAFC', marginBottom: '18px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              University Notice
            </h4>
            <p style={{ fontSize: '0.85rem', color: '#64748B', lineHeight: 1.6, marginBottom: '14px' }}>
              Developed independently for VTU engineering students across Belagavi, Bengaluru, Mysuru, and Kalaburagi regions. All university marks, syllabus schemes, and exam materials belong to Visvesvaraya Technological University.
            </p>
            <div style={{ fontSize: '0.78rem', color: '#A78BFA', fontWeight: 600 }}>
              Karnataka State Council For Science & Tech Affiliated
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '28px',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          fontSize: '0.82rem',
          color: '#64748B',
          gap: '16px'
        }}>
          <div>
            © 2026 VTU Student Connect. All rights reserved. “Learn. Connect. Grow.”
          </div>

          <div style={{ display: 'flex', gap: '20px' }}>
            <a href="#" style={{ color: '#94A3B8' }}>Privacy Policy</a>
            <a href="#" style={{ color: '#94A3B8' }}>Terms of Service</a>
            <a href="#" style={{ color: '#94A3B8' }}>Academic Integrity</a>
            <a href="#" style={{ color: '#94A3B8' }}>Contact Support</a>
          </div>
        </div>

      </div>
    </footer>
  );
};
