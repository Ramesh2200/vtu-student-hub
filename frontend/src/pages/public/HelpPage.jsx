import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Calculator, FileCheck, ShieldAlert, Mail } from 'lucide-react';

export const HelpPage = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: 'How is SGPA and CGPA calculated under VTU CBCS Scheme?',
      a: 'SGPA = Σ(Credit of Subject × Grade Point Secured) / Σ(Total Credits for Semester). CGPA is the cumulative weighted average calculated as: CGPA = Σ(Credit of all semesters × SGPA of semester) / Σ(Total Credits across all completed semesters).'
    },
    {
      q: 'What is the passing criteria for VTU Theory and Practical SEE exams?',
      a: 'Under the 2022 CBCS Scheme, a student must secure a minimum of 35% in Semester End Examination (SEE) and 40% aggregate in Continuous Internal Evaluation (CIE) + SEE combined to pass a course.'
    },
    {
      q: 'How do I download official PDF notes and question papers?',
      a: 'Navigate to "Semesters" or "Notes", choose your semester/subject, and click on the "Download PDF" button. Downloads are tracked in your "Downloads" tab for quick re-access.'
    },
    {
      q: 'How do I apply for campus placements through the portal?',
      a: 'Go to the "Placements" tab, explore active job drives (e.g. Google, Amazon, Cisco), inspect eligibility criteria, and click "Apply". You can enter your resume link and track the application status directly.'
    },
    {
      q: 'What should I do if I notice an inappropriate or spam chat message?',
      a: 'Every chat message has a "Report" action button. Clicking Report submits the message to the central admin queue for immediate review and moderation.'
    },
    {
      q: 'How does Revaluation and Photocopy application work in VTU?',
      a: 'Students can apply for SEE answer script photocopies and revaluation within 7 days of results announcement through the college VTU coordinator portal.'
    }
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#0B1020', color: '#F8FAFC', padding: '60px 24px 100px' }}>
      <div style={{ maxWidth: '860px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span
            style={{
              fontSize: '12px',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: '#38BDF8',
              background: 'rgba(6, 182, 212, 0.15)',
              padding: '6px 16px',
              borderRadius: '9999px',
              border: '1px solid rgba(6, 182, 212, 0.3)'
            }}
          >
            Student Support &amp; Knowledge Base
          </span>
          <h1 style={{ fontSize: '36px', fontWeight: '800', marginTop: '16px', marginBottom: '12px' }}>
            Frequently Asked Questions &amp; VTU Guidelines
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '16px' }}>
            Everything you need to know about academic policies, resource downloads, and career placement.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '56px' }}>
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                style={{
                  background: 'rgba(17, 24, 39, 0.7)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '16px',
                  padding: '20px 24px',
                  cursor: 'pointer',
                  backdropFilter: 'blur(12px)',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', color: isOpen ? '#A78BFA' : '#F8FAFC' }}>
                    {faq.q}
                  </h3>
                  {isOpen ? <ChevronUp size={18} color="#A78BFA" /> : <ChevronDown size={18} color="#94A3B8" />}
                </div>
                {isOpen && (
                  <p style={{ marginTop: '14px', fontSize: '14px', color: '#CBD5E1', lineHeight: '1.6', borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '14px' }}>
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Contact Support Card */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.6) 0%, rgba(15, 23, 42, 0.8) 100%)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '20px',
            padding: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '20px'
          }}
        >
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '6px' }}>
              Still have academic or portal questions?
            </h3>
            <p style={{ color: '#94A3B8', fontSize: '14px' }}>
              Our academic coordinators and technical staff are available to assist you.
            </p>
          </div>
          <a
            href="mailto:support@vtuconnect.in"
            style={{
              padding: '12px 24px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)',
              color: '#FFFFFF',
              fontWeight: '600',
              fontSize: '14px',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Mail size={16} /> Contact Support Desk
          </a>
        </div>
      </div>
    </div>
  );
};
