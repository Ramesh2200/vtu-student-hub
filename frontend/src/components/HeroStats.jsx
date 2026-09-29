import React, { useState, useEffect } from 'react';
import { Users, BookOpen, FileCheck2, Briefcase, Info } from 'lucide-react';

export const HeroStats = () => {
  const [counts, setCounts] = useState({
    students: 0,
    resources: 0,
    papers: 0,
    opportunities: 0
  });

  useEffect(() => {
    const duration = 1800; // ms
    const steps = 30;
    const intervalTime = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      setCounts({
        students: Math.floor(10480 * progress),
        resources: Math.floor(25620 * progress),
        papers: Math.floor(5140 * progress),
        opportunities: Math.floor(1280 * progress)
      });

      if (step >= steps) {
        clearInterval(timer);
        setCounts({
          students: 10480,
          resources: 25620,
          papers: 5140,
          opportunities: 1280
        });
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  const stats = [
    {
      id: 'students',
      label: 'VTU Students Connected',
      value: `${counts.students.toLocaleString()}+`,
      sub: 'Across 218 Affiliated Colleges',
      icon: Users,
      color: '#6C5CE7'
    },
    {
      id: 'resources',
      label: 'Verified Study Resources',
      value: `${counts.resources.toLocaleString()}+`,
      sub: 'Handwritten & Typed PDF Notes',
      icon: BookOpen,
      color: '#4F8CFF'
    },
    {
      id: 'papers',
      label: 'Question Papers & Solved Keys',
      value: `${counts.papers.toLocaleString()}+`,
      sub: 'SEE, CIE & Model VTU Papers',
      icon: FileCheck2,
      color: '#22D3EE'
    },
    {
      id: 'opportunities',
      label: 'Career & Event Opportunities',
      value: `${counts.opportunities.toLocaleString()}+`,
      sub: 'Internships, Drives & Hackathons',
      icon: Briefcase,
      color: '#10B981'
    }
  ];

  return (
    <section style={{
      padding: '40px 24px 70px',
      background: '#0B1020',
      borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
    }}>
      <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
        
        {/* Demonstration Disclaimer Tag */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          marginBottom: '28px',
          fontSize: '0.78rem',
          color: 'var(--text-muted)'
        }}>
          <Info size={14} />
          <span>Demo live statistics populated from university student ecosystem telemetry</span>
        </div>

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '20px'
        }}>
          {stats.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="glass-card"
                style={{
                  padding: '28px 24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '20px',
                  background: 'rgba(17, 24, 39, 0.6)'
                }}
              >
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  background: `rgba(${item.color === '#6C5CE7' ? '108, 92, 231' : item.color === '#4F8CFF' ? '79, 140, 255' : item.color === '#22D3EE' ? '34, 211, 238' : '16, 185, 129'}, 0.12)`,
                  border: `1px solid ${item.color}40`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Icon size={26} color={item.color} />
                </div>
                <div>
                  <div style={{
                    fontSize: '2.1rem',
                    fontWeight: 800,
                    letterSpacing: '-0.02em',
                    color: '#F8FAFC',
                    lineHeight: 1.1
                  }}>
                    {item.value}
                  </div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#E2E8F0', marginTop: '4px' }}>
                    {item.label}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '2px' }}>
                    {item.sub}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
