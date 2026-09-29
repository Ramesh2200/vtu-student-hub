import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ArrowRight, BookOpen, Layers, Award, Sparkles, Filter } from 'lucide-react';
import { api } from '../../services/api';
import { StudentLayout } from '../../components/StudentLayout';

export const SemestersPage = () => {
  const [semesters, setSemesters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadSemesters();
  }, []);

  const loadSemesters = async () => {
    try {
      setLoading(true);
      const data = await api.semesters.getAll();
      setSemesters(data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch semesters');
    } finally {
      setLoading(false);
    }
  };

  return (
    <StudentLayout>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '999px', background: 'rgba(124, 58, 237, 0.2)', border: '1px solid rgba(124, 58, 237, 0.3)', marginBottom: '8px' }}>
              <Sparkles size={12} color="#A78BFA" />
              <span style={{ fontSize: '11px', fontWeight: '700', color: '#DDD6FE', textTransform: 'uppercase' }}>
                VTU CBCS 2022 / 2018 Scheme
              </span>
            </div>
            <h1 style={{ fontSize: '28px', fontWeight: '900', color: '#F8FAFC', margin: 0 }}>
              Semesters 1 through 8
            </h1>
            <p style={{ fontSize: '14px', color: '#94A3B8', margin: '6px 0 0' }}>
              Select any semester to view its registered subjects, faculty notes, solved papers, and question banks.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: '700', background: 'rgba(56, 189, 248, 0.1)', color: '#38BDF8', padding: '8px 16px', borderRadius: '10px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
              8 Semesters Configured
            </span>
          </div>
        </div>

        {/* Semesters Grid */}
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#94A3B8' }}>
            Loading semesters from database...
          </div>
        ) : error ? (
          <div style={{ padding: '24px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '12px', color: '#F87171' }}>
            {error}
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '20px'
            }}
          >
            {semesters.map((sem) => (
              <div
                key={sem.id}
                style={{
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '20px',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: '220px',
                  position: 'relative',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.borderColor = 'rgba(124, 58, 237, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#FFFFFF',
                        fontWeight: '800',
                        fontSize: '18px'
                      }}
                    >
                      {sem.semesterNumber}
                    </div>

                    <span style={{ fontSize: '11px', fontWeight: '700', background: 'rgba(255, 255, 255, 0.06)', color: '#94A3B8', padding: '4px 10px', borderRadius: '999px' }}>
                      {sem.scheme || '2022 Scheme'}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#F8FAFC', marginBottom: '6px' }}>
                    Semester {sem.semesterNumber}
                  </h3>
                  <p style={{ fontSize: '13px', color: '#94A3B8', lineHeight: 1.5, margin: 0 }}>
                    {sem.description || 'Core engineering disciplines and lab assessments'}
                  </p>
                </div>

                <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#38BDF8', fontWeight: '600' }}>
                    <BookOpen size={14} />
                    <span>{sem.subjectCount || 3} Core Subjects</span>
                  </div>

                  <Link
                    to={`/semesters/${sem.id}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      background: 'linear-gradient(135deg, #7C3AED 0%, #6366F1 100%)',
                      color: '#FFFFFF',
                      fontSize: '12px',
                      fontWeight: '700',
                      padding: '8px 14px',
                      borderRadius: '8px',
                      textDecoration: 'none'
                    }}
                  >
                    Explore <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </StudentLayout>
  );
};
