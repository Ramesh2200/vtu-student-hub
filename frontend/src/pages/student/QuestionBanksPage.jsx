import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { HelpCircle, Search, Filter, Sparkles, Layers, BookOpen, CheckCircle, Tag } from 'lucide-react';
import { api } from '../../services/api';
import { StudentLayout } from '../../components/StudentLayout';

export const QuestionBanksPage = () => {
  const [searchParams] = useSearchParams();
  const [questionBanks, setQuestionBanks] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedDifficulty, setSelectedDifficulty] = useState('ALL');
  const [selectedUnit, setSelectedUnit] = useState('ALL');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [qbRes, semsRes] = await Promise.all([
        api.questionBanks.getAll(),
        api.semesters.getAll()
      ]);
      setQuestionBanks(qbRes || []);
      setSemesters(semsRes || []);
    } catch (err) {
      console.error('Failed to load question banks:', err);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    'ALL',
    '2 Marks',
    '5 Marks',
    '10 Marks',
    'Important',
    'Frequently Asked',
    'Conceptual',
    'Programming'
  ];

  const filteredQBs = questionBanks.filter((qb) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      !query ||
      qb.title?.toLowerCase().includes(query) ||
      qb.questionText?.toLowerCase().includes(query) ||
      qb.subjectCode?.toLowerCase().includes(query);

    const matchesCategory =
      selectedCategory === 'ALL' || qb.category === selectedCategory;
    const matchesDifficulty =
      selectedDifficulty === 'ALL' || qb.difficulty === selectedDifficulty;
    const matchesUnit =
      selectedUnit === 'ALL' || String(qb.unit) === selectedUnit;

    return matchesSearch && matchesCategory && matchesDifficulty && matchesUnit;
  });

  return (
    <StudentLayout>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '999px', background: 'rgba(6, 182, 212, 0.15)', border: '1px solid rgba(6, 182, 212, 0.3)', marginBottom: '8px' }}>
              <Sparkles size={12} color="#22D3EE" />
              <span style={{ fontSize: '11px', fontWeight: '700', color: '#67E8F9', textTransform: 'uppercase' }}>
                VTU Curated Exam Prep
              </span>
            </div>
            <h1 style={{ fontSize: '28px', fontWeight: '900', color: '#F8FAFC', margin: 0 }}>
              Question Bank Repository
            </h1>
            <p style={{ fontSize: '14px', color: '#94A3B8', margin: '6px 0 0' }}>
              Master VTU exams with curated 2-mark, 5-mark, 10-mark, and frequently asked theoretical and numerical questions.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: '700', background: 'rgba(6, 182, 212, 0.1)', color: '#38BDF8', padding: '8px 16px', borderRadius: '10px', border: '1px solid rgba(6, 182, 212, 0.2)' }}>
              {filteredQBs.length} Questions Filtered
            </span>
          </div>
        </div>

        {/* Filter Bar */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '20px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}
        >
          {/* Search & Difficulty & Unit Row */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: '1 1 280px' }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search questions by keyword, topic, or subject code..."
                style={{
                  width: '100%',
                  background: 'rgba(11, 16, 32, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '12px',
                  padding: '12px 14px 12px 40px',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  outline: 'none'
                }}
              />
              <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '14px', top: '14px', pointerEvents: 'none' }} />
            </div>

            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              style={{
                background: 'rgba(11, 16, 32, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '12px',
                padding: '12px 16px',
                color: '#F8FAFC',
                fontSize: '13px',
                fontWeight: '600',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="ALL">All Difficulties</option>
              <option value="EASY">Easy</option>
              <option value="MEDIUM">Medium</option>
              <option value="HARD">Hard</option>
            </select>

            <select
              value={selectedUnit}
              onChange={(e) => setSelectedUnit(e.target.value)}
              style={{
                background: 'rgba(11, 16, 32, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '12px',
                padding: '12px 16px',
                color: '#F8FAFC',
                fontSize: '13px',
                fontWeight: '600',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="ALL">All Units</option>
              <option value="1">Unit 1</option>
              <option value="2">Unit 2</option>
              <option value="3">Unit 3</option>
              <option value="4">Unit 4</option>
              <option value="5">Unit 5</option>
            </select>
          </div>

          {/* Category Pills Bar */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  background: selectedCategory === cat ? 'linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)' : 'rgba(255, 255, 255, 0.05)',
                  border: selectedCategory === cat ? 'none' : '1px solid rgba(255, 255, 255, 0.08)',
                  color: selectedCategory === cat ? '#FFFFFF' : '#94A3B8',
                  borderRadius: '10px',
                  padding: '6px 14px',
                  fontSize: '12px',
                  fontWeight: '700',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {cat === 'ALL' ? 'All Categories' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Questions List */}
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#94A3B8' }}>
            Loading question bank...
          </div>
        ) : filteredQBs.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', background: 'rgba(15, 23, 42, 0.5)', borderRadius: '20px', color: '#94A3B8' }}>
            <HelpCircle size={48} color="#475569" style={{ marginBottom: '12px' }} />
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#F8FAFC', margin: '0 0 6px 0' }}>No questions found</h3>
            <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>Try adjusting your difficulty or category filters.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredQBs.map((qb) => (
              <div
                key={qb.id}
                style={{
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '18px',
                  padding: '24px',
                  transition: 'border-color 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '11px', fontWeight: '800', background: 'rgba(6, 182, 212, 0.2)', color: '#67E8F9', padding: '3px 8px', borderRadius: '6px' }}>
                      {qb.category || 'Important'}
                    </span>
                    <span style={{ fontSize: '11px', fontWeight: '800', background: 'rgba(124, 58, 237, 0.2)', color: '#C4B5FD', padding: '3px 8px', borderRadius: '6px' }}>
                      Unit {qb.unit}
                    </span>
                    <span style={{ fontSize: '11px', color: '#94A3B8' }}>{qb.subjectCode || '21CS61'}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: '800',
                        color: qb.difficulty === 'HARD' ? '#F87171' : qb.difficulty === 'MEDIUM' ? '#FBBF24' : '#34D399',
                        background: 'rgba(255, 255, 255, 0.06)',
                        padding: '3px 8px',
                        borderRadius: '6px'
                      }}
                    >
                      {qb.difficulty || 'MEDIUM'}
                    </span>
                  </div>
                </div>

                <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#F8FAFC', marginBottom: '10px', lineHeight: 1.4 }}>
                  {qb.title}
                </h3>

                <p style={{ fontSize: '14px', color: '#CBD5E1', lineHeight: 1.6, margin: 0 }}>
                  {qb.questionText || qb.description}
                </p>

                {qb.solutionGuide && (
                  <div style={{ marginTop: '16px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: '10px', padding: '12px 16px' }}>
                    <span style={{ fontSize: '11px', fontWeight: '800', color: '#34D399', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                      Solution Strategy & Key Formulas
                    </span>
                    <p style={{ fontSize: '13px', color: '#A7F3D0', margin: 0, lineHeight: 1.5 }}>
                      {qb.solutionGuide}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

      </div>
    </StudentLayout>
  );
};
