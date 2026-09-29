import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HelpCircle, Sparkles, Send, ArrowLeft, Tag, BookOpen, CheckCircle } from 'lucide-react';
import { api } from '../../services/api';
import { StudentLayout } from '../../components/StudentLayout';

export const AskQuestionPage = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Cloud Computing (21CS61)');
  const [unit, setUnit] = useState('1');
  const [details, setDetails] = useState('');
  const [tags, setTags] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !details.trim()) return;

    try {
      setSubmitting(true);
      // Post as a doubt in the doubts chat room or questions bank
      await api.chat.sendMessage(7, `[ACADEMIC DOUBT: ${subject} - Unit ${unit}]\nTitle: ${title}\n\n${details}\nTags: ${tags}`);
      setSubmitted(true);
      setTimeout(() => {
        navigate('/chat?room=doubts');
      }, 1500);
    } catch (err) {
      alert(err.message || 'Failed to submit academic question');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <StudentLayout>
      <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#F8FAFC',
              padding: '8px 14px',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            <ArrowLeft size={16} /> Back
          </button>
          <span style={{ color: '#475569' }}>/</span>
          <span style={{ color: '#38BDF8', fontSize: '13px', fontWeight: '700' }}>
            Ask Academic Question
          </span>
        </div>

        <div
          style={{
            background: 'rgba(15, 23, 42, 0.7)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '24px',
            padding: '36px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF' }}>
              <HelpCircle size={22} />
            </div>
            <div>
              <h1 style={{ fontSize: '22px', fontWeight: '900', color: '#F8FAFC', margin: 0 }}>
                Ask Academic Question
              </h1>
              <p style={{ fontSize: '13px', color: '#94A3B8', margin: 0 }}>
                Post your doubts to receive answers from peers, faculty, and subject toppers.
              </p>
            </div>
          </div>

          {submitted ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <CheckCircle size={48} color="#34D399" style={{ marginBottom: '12px' }} />
              <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#FFFFFF', margin: '0 0 8px 0' }}>Question Posted!</h3>
              <p style={{ color: '#94A3B8', fontSize: '14px', margin: 0 }}>Redirecting you to the Academic Doubts room...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '24px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#CBD5E1', marginBottom: '6px' }}>
                  Question Title / Concept Headline *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Explain difference between Type 1 and Type 2 Hypervisors in Cloud Computing"
                  style={{
                    width: '100%',
                    background: 'rgba(11, 16, 32, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '12px',
                    padding: '12px 16px',
                    color: '#FFFFFF',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#CBD5E1', marginBottom: '6px' }}>
                    VTU Subject
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'rgba(11, 16, 32, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '12px',
                      padding: '12px 16px',
                      color: '#FFFFFF',
                      fontSize: '13px',
                      outline: 'none'
                    }}
                  >
                    <option value="Cloud Computing (21CS61)">Cloud Computing (21CS61)</option>
                    <option value="Computer Networks (21CS62)">Computer Networks (21CS62)</option>
                    <option value="Software Architecture & Design Patterns (21CS63)">Design Patterns (21CS63)</option>
                    <option value="Database Management Systems (21CS53)">DBMS (21CS53)</option>
                    <option value="Design & Analysis of Algorithms (21CS42)">DAA (21CS42)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#CBD5E1', marginBottom: '6px' }}>
                    Unit / Module
                  </label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'rgba(11, 16, 32, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '12px',
                      padding: '12px 16px',
                      color: '#FFFFFF',
                      fontSize: '13px',
                      outline: 'none'
                    }}
                  >
                    <option value="1">Unit 1</option>
                    <option value="2">Unit 2</option>
                    <option value="3">Unit 3</option>
                    <option value="4">Unit 4</option>
                    <option value="5">Unit 5</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#CBD5E1', marginBottom: '6px' }}>
                  Detailed Explanation & Context *
                </label>
                <textarea
                  rows={6}
                  required
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Include any specific question numbers, theoretical confusion, code snippet, or steps you have already tried..."
                  style={{
                    width: '100%',
                    background: 'rgba(11, 16, 32, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '12px',
                    padding: '14px',
                    color: '#FFFFFF',
                    fontSize: '14px',
                    outline: 'none',
                    resize: 'vertical',
                    lineHeight: 1.6
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#CBD5E1', marginBottom: '6px' }}>
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="e.g. Virtualization, 10Marks, SEE2024"
                  style={{
                    width: '100%',
                    background: 'rgba(11, 16, 32, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '12px',
                    padding: '12px 16px',
                    color: '#FFFFFF',
                    fontSize: '13px',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  style={{
                    background: 'transparent',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#94A3B8',
                    padding: '12px 20px',
                    borderRadius: '12px',
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)',
                    border: 'none',
                    color: '#FFFFFF',
                    padding: '12px 24px',
                    borderRadius: '12px',
                    fontSize: '13px',
                    fontWeight: '800',
                    cursor: 'pointer'
                  }}
                >
                  <Send size={15} /> {submitting ? 'Posting...' : 'Post Question'}
                </button>
              </div>
            </form>
          )}

        </div>

      </div>
    </StudentLayout>
  );
};
