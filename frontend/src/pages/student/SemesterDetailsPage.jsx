import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  GraduationCap,
  BookOpen,
  FileText,
  HelpCircle,
  Clock,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Layers,
  Award
} from 'lucide-react';
import { api } from '../../services/api';
import { StudentLayout } from '../../components/StudentLayout';

export const SemesterDetailsPage = () => {
  const { id } = useParams();
  const [semester, setSemester] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadSemesterData();
  }, [id]);

  const loadSemesterData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [semData, subjsData] = await Promise.all([
        api.semesters.getById(id),
        api.semesters.getSubjects(id)
      ]);
      setSemester(semData);
      setSubjects(subjsData || []);
    } catch (err) {
      setError(err.message || 'Failed to load semester details');
    } finally {
      setLoading(false);
    }
  };

  return (
    <StudentLayout>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>
        
        {/* Breadcrumb & Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link
            to="/semesters"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: '#94A3B8',
              fontSize: '13px',
              textDecoration: 'none'
            }}
          >
            <ArrowLeft size={16} /> Back to Semesters
          </Link>
          <span style={{ color: '#475569' }}>/</span>
          <span style={{ color: '#38BDF8', fontSize: '13px', fontWeight: '700' }}>
            Semester {id}
          </span>
        </div>

        {/* Semester Banner */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.25) 0%, rgba(6, 182, 212, 0.15) 100%)',
            border: '1px solid rgba(124, 58, 237, 0.3)',
            borderRadius: '24px',
            padding: '32px',
            position: 'relative'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
            <div
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                fontSize: '24px',
                fontWeight: '900'
              }}
            >
              {semester?.semesterNumber || id}
            </div>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '3px 8px', borderRadius: '4px', background: 'rgba(56, 189, 248, 0.2)', color: '#38BDF8', fontSize: '11px', fontWeight: '800', marginBottom: '4px' }}>
                {semester?.scheme || '2022 Scheme CBCS'}
              </div>
              <h1 style={{ fontSize: '28px', fontWeight: '900', color: '#F8FAFC', margin: 0 }}>
                Semester {semester?.semesterNumber || id} Curriculum
              </h1>
            </div>
          </div>
          <p style={{ color: '#94A3B8', fontSize: '14px', maxWidth: '700px', lineHeight: 1.6, margin: 0 }}>
            {semester?.description || 'Browse subjects registered under VTU syllabus. Access verified faculty notes, unit-wise question banks, and previous year SEE question papers.'}
          </p>
        </div>

        {/* Subjects List */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#F8FAFC', margin: 0 }}>
              Curriculum Subjects ({subjects.length})
            </h2>
            <span style={{ fontSize: '12px', color: '#94A3B8' }}>Click any subject to open resource modules</span>
          </div>

          {loading ? (
            <div style={{ padding: '60px', textAlign: 'center', color: '#94A3B8' }}>
              Loading semester subjects...
            </div>
          ) : error ? (
            <div style={{ padding: '24px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '12px', color: '#F87171' }}>
              {error}
            </div>
          ) : subjects.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', background: 'rgba(15, 23, 42, 0.5)', borderRadius: '16px', color: '#94A3B8' }}>
              No subjects currently mapped for this semester.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
              {subjects.map((subj) => (
                <div
                  key={subj.id}
                  style={{
                    background: 'rgba(15, 23, 42, 0.6)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '20px',
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.borderColor = 'rgba(6, 182, 212, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <span
                        style={{
                          fontSize: '12px',
                          fontWeight: '800',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          background: 'rgba(6, 182, 212, 0.15)',
                          color: '#22D3EE',
                          border: '1px solid rgba(6, 182, 212, 0.3)'
                        }}
                      >
                        {subj.code}
                      </span>
                      <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: '600' }}>
                        {subj.credits || 4} Credits • {subj.department || 'CSE'}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#F8FAFC', marginBottom: '8px' }}>
                      {subj.name}
                    </h3>
                    <p style={{ fontSize: '13px', color: '#94A3B8', lineHeight: 1.5, margin: 0 }}>
                      {subj.description || 'VTU prescribed syllabus covering theoretical principles and practical laboratory modules.'}
                    </p>
                  </div>

                  {/* Quick Resource Buttons */}
                  <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px' }}>
                      <Link
                        to={`/subjects/${subj.id}?tab=notes`}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '8px 4px',
                          background: 'rgba(124, 58, 237, 0.12)',
                          border: '1px solid rgba(124, 58, 237, 0.25)',
                          borderRadius: '8px',
                          color: '#C4B5FD',
                          fontSize: '11px',
                          fontWeight: '700',
                          textDecoration: 'none'
                        }}
                      >
                        <FileText size={14} /> Notes
                      </Link>
                      <Link
                        to={`/subjects/${subj.id}?tab=qb`}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '8px 4px',
                          background: 'rgba(6, 182, 212, 0.12)',
                          border: '1px solid rgba(6, 182, 212, 0.25)',
                          borderRadius: '8px',
                          color: '#67E8F9',
                          fontSize: '11px',
                          fontWeight: '700',
                          textDecoration: 'none'
                        }}
                      >
                        <HelpCircle size={14} /> Questions
                      </Link>
                      <Link
                        to={`/subjects/${subj.id}?tab=papers`}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '8px 4px',
                          background: 'rgba(245, 158, 11, 0.12)',
                          border: '1px solid rgba(245, 158, 11, 0.25)',
                          borderRadius: '8px',
                          color: '#FDE68A',
                          fontSize: '11px',
                          fontWeight: '700',
                          textDecoration: 'none'
                        }}
                      >
                        <BookOpen size={14} /> Papers
                      </Link>
                    </div>

                    <Link
                      to={`/subjects/${subj.id}`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        background: 'linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)',
                        color: '#FFFFFF',
                        fontSize: '12px',
                        fontWeight: '700',
                        padding: '10px',
                        borderRadius: '10px',
                        textDecoration: 'none'
                      }}
                    >
                      Open Subject Hub <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </StudentLayout>
  );
};
