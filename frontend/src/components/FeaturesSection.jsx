import React from 'react';
import { useApp } from '../context/AppContext';
import {
  BookOpen,
  FileText,
  FileCheck,
  MessagesSquare,
  Calendar,
  Briefcase,
  Bell,
  LayoutDashboard,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';

export const FeaturesSection = () => {
  const { setActiveTab, setIsAuthenticated, loginUser } = useApp();

  const features = [
    {
      id: 'academic-hub',
      tab: 'academics',
      title: 'Academic Hub',
      description: 'Structured course navigation by Scheme, Branch, Semester, and Subject. Access complete VTU syllabus breakdowns and module outcomes.',
      icon: BookOpen,
      gradient: 'linear-gradient(135deg, #6C5CE7 0%, #4F8CFF 100%)',
      badge: 'Core Curriculum'
    },
    {
      id: 'study-resources',
      tab: 'notes',
      title: 'Study Resources',
      description: 'Faculty-verified and student-curated lecture notes, formulas, laboratory manuals, and cheat sheets organized module-by-module.',
      icon: FileText,
      gradient: 'linear-gradient(135deg, #4F8CFF 0%, #22D3EE 100%)',
      badge: '25,000+ Notes'
    },
    {
      id: 'question-papers',
      tab: 'notes',
      title: 'Previous Year Papers',
      description: 'Official VTU SEE, CIE, and Model Question Papers with solved answer keys, marking schemes, and high-frequency repeated questions.',
      icon: FileCheck,
      gradient: 'linear-gradient(135deg, #10B981 0%, #22D3EE 100%)',
      badge: 'Solved Solutions'
    },
    {
      id: 'student-community',
      tab: 'community',
      title: 'Student Community',
      description: 'Reddit/StackOverflow-inspired Q&A forum where VTU students ask questions, discuss difficult problems, and receive verified answers from professors.',
      icon: MessagesSquare,
      gradient: 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)',
      badge: 'Peer Q&A'
    },
    {
      id: 'events',
      tab: 'events',
      title: 'Events & Hackathons',
      description: 'Stay ahead with state-level hackathons, AI workshops, coding competitions, and college fests with 1-click team registration.',
      icon: Calendar,
      gradient: 'linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)',
      badge: 'Cash Prizes'
    },
    {
      id: 'placements',
      tab: 'placements',
      title: 'Placements & Internships',
      description: 'Direct campus recruitment drives, internships, and full-time opportunities with an interactive Kanban application tracker.',
      icon: Briefcase,
      gradient: 'linear-gradient(135deg, #6366F1 0%, #A855F7 100%)',
      badge: 'Kanban Board'
    },
    {
      id: 'notifications',
      tab: 'dashboard',
      title: 'Instant Notifications',
      description: 'Timely alerts for SEE exam timetables, revaluation results, placement shortlists, and notes uploaded for your enrolled subjects.',
      icon: Bell,
      gradient: 'linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)',
      badge: 'Real-time Alerts'
    },
    {
      id: 'personalized-dashboard',
      tab: 'dashboard',
      title: 'Personalized Dashboard',
      description: 'Enter your USN and instantly see only what matters: your subjects, attendance progress, upcoming events, and job deadlines.',
      icon: LayoutDashboard,
      gradient: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
      badge: 'Tailored to USN'
    }
  ];

  const handleCardClick = (tab) => {
    loginUser('student');
    setActiveTab(tab);
  };

  return (
    <section id="features" style={{
      padding: '100px 24px',
      background: 'linear-gradient(180deg, #0B1020 0%, #0F172A 100%)',
      position: 'relative'
    }}>
      <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 64px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: '20px',
            background: 'rgba(108, 92, 231, 0.12)',
            border: '1px solid rgba(108, 92, 231, 0.3)',
            color: '#A78BFA',
            fontSize: '0.85rem',
            fontWeight: 600,
            marginBottom: '16px'
          }}>
            <Sparkles size={16} />
            <span>Built For VTU Students, By Engineers</span>
          </div>

          <h2 style={{
            fontSize: 'clamp(2.2rem, 3.8vw, 3.2rem)',
            fontWeight: 800,
            letterSpacing: '-0.025em',
            marginBottom: '20px',
            color: '#F8FAFC'
          }}>
            Everything a VTU Student Needs
          </h2>

          <p style={{
            fontSize: '1.1rem',
            color: '#94A3B8',
            lineHeight: 1.6
          }}>
            From 1st semester basics to final year placement drives, VTU Student Connect unifies your complete academic lifecycle in one responsive platform.
          </p>
        </div>

        {/* 8 Feature Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))',
          gap: '24px'
        }}>
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.id}
                onClick={() => handleCardClick(feature.tab)}
                className="glass-card"
                style={{
                  padding: '32px 28px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Accent top stripe */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '3px',
                  background: feature.gradient,
                  opacity: 0.8
                }} />

                <div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '20px'
                  }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Icon size={24} color="#A78BFA" />
                    </div>

                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '4px 10px',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.06)',
                      color: '#E2E8F0',
                      border: '1px solid rgba(255, 255, 255, 0.08)'
                    }}>
                      {feature.badge}
                    </span>
                  </div>

                  <h3 style={{
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: '#F8FAFC',
                    marginBottom: '12px',
                    lineHeight: 1.3
                  }}>
                    {feature.title}
                  </h3>

                  <p style={{
                    fontSize: '0.92rem',
                    color: '#94A3B8',
                    lineHeight: 1.55,
                    marginBottom: '24px'
                  }}>
                    {feature.description}
                  </p>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: '#6C5CE7',
                  paddingTop: '16px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.06)'
                }}>
                  <span>Explore Feature</span>
                  <ArrowUpRight size={16} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
