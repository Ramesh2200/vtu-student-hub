import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ChevronUp,
  MessageSquare,
  Bookmark,
  Share2,
  CheckCircle,
  Sparkles,
  ArrowRight,
  Send
} from 'lucide-react';

export const CommunityPreview = () => {
  const { discussions, upvoteDiscussion, addAnswer, setActiveTab, loginUser } = useApp();
  const [activeReplyId, setActiveReplyId] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  const handleShare = (id) => {
    setCopiedId(id);
    navigator.clipboard?.writeText(window.location.href);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handlePostReply = (id) => {
    if (!replyText.trim()) return;
    addAnswer(id, replyText);
    setReplyText('');
    setActiveReplyId(null);
  };

  return (
    <section id="community" style={{
      padding: '100px 24px',
      background: 'linear-gradient(180deg, #0B1020 0%, #111827 100%)',
      position: 'relative',
      borderTop: '1px solid rgba(255, 255, 255, 0.06)'
    }}>
      <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
        
        {/* Section Header */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          maxWidth: '750px',
          margin: '0 auto 50px'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: '20px',
            background: 'rgba(245, 158, 11, 0.12)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            color: '#FBBF24',
            fontSize: '0.85rem',
            fontWeight: 600,
            marginBottom: '16px'
          }}>
            <Sparkles size={16} />
            <span>VTU Student & Faculty Community</span>
          </div>

          <h2 style={{
            fontSize: 'clamp(2rem, 3.5vw, 3rem)',
            fontWeight: 800,
            color: '#F8FAFC',
            letterSpacing: '-0.02em',
            marginBottom: '16px'
          }}>
            Ask Questions. Get Verified Answers.
          </h2>

          <p style={{ fontSize: '1.05rem', color: '#94A3B8', lineHeight: 1.6 }}>
            A collaborative StackOverflow-style hub where students and engineering faculty solve syllabus queries, exam doubts, and project blockers.
          </p>
        </div>

        {/* Discussion Cards Column */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          maxWidth: '940px',
          margin: '0 auto'
        }}>
          {discussions.map((disc) => (
            <div
              key={disc.id}
              className="glass-card"
              style={{
                padding: '28px',
                borderRadius: '20px',
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                
                {/* Left: Upvote Box */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  background: disc.hasUpvoted ? 'rgba(108, 92, 231, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                  border: disc.hasUpvoted ? '1px solid rgba(108, 92, 231, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  padding: '10px 12px',
                  flexShrink: 0
                }}>
                  <button
                    onClick={() => upvoteDiscussion(disc.id)}
                    style={{
                      color: disc.hasUpvoted ? '#A78BFA' : '#94A3B8',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    title="Upvote this question"
                  >
                    <ChevronUp size={22} strokeWidth={disc.hasUpvoted ? 3 : 2} />
                  </button>
                  <span style={{
                    fontSize: '1rem',
                    fontWeight: 800,
                    color: disc.hasUpvoted ? '#A78BFA' : '#F8FAFC',
                    margin: '2px 0'
                  }}>
                    {disc.upvotes}
                  </span>
                  <span style={{ fontSize: '0.65rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 600 }}>
                    VOTES
                  </span>
                </div>

                {/* Right: Question Body & Metadata */}
                <div style={{ flex: 1 }}>
                  
                  {/* Author Header */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '10px',
                    flexWrap: 'wrap',
                    gap: '10px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img
                        src={disc.authorAvatar}
                        alt={disc.author}
                        style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div>
                        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#F8FAFC' }}>
                          {disc.author}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: '#94A3B8', marginLeft: '8px' }}>
                          {disc.college} • {disc.branch} • {disc.timestamp}
                        </span>
                      </div>
                    </div>

                    {/* Tag list */}
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {disc.tags.map((tag) => (
                        <span
                          key={tag}
                          style={{
                            fontSize: '0.72rem',
                            fontWeight: 600,
                            padding: '3px 8px',
                            borderRadius: '6px',
                            background: 'rgba(255, 255, 255, 0.06)',
                            color: '#CBD5E1',
                            border: '1px solid rgba(255, 255, 255, 0.08)'
                          }}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Question Title */}
                  <h3 style={{
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: '#F8FAFC',
                    lineHeight: 1.4,
                    marginBottom: '16px'
                  }}>
                    {disc.title}
                  </h3>

                  {/* Accepted Answer Highlight (if exists) */}
                  {disc.acceptedAnswer && (
                    <div style={{
                      background: 'rgba(16, 185, 129, 0.08)',
                      border: '1px solid rgba(16, 185, 129, 0.25)',
                      borderRadius: '14px',
                      padding: '16px',
                      marginBottom: '18px'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '8px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <CheckCircle size={18} color="#10B981" />
                          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#6EE7B7' }}>
                            Accepted Faculty Answer ({disc.acceptedAnswer.authorRole})
                          </span>
                        </div>
                        <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                          {disc.acceptedAnswer.timestamp}
                        </span>
                      </div>
                      <p style={{
                        fontSize: '0.88rem',
                        color: '#E2E8F0',
                        lineHeight: 1.6,
                        whiteSpace: 'pre-line'
                      }}>
                        {disc.acceptedAnswer.content}
                      </p>
                    </div>
                  )}

                  {/* Reply Input Box (when triggered) */}
                  {activeReplyId === disc.id && (
                    <div style={{
                      marginTop: '16px',
                      padding: '14px',
                      background: 'rgba(0, 0, 0, 0.3)',
                      borderRadius: '12px',
                      border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}>
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Write your constructive answer or explanation..."
                        rows={3}
                        style={{
                          width: '100%',
                          background: 'transparent',
                          border: 'none',
                          color: '#F8FAFC',
                          fontSize: '0.9rem',
                          resize: 'vertical',
                          outline: 'none',
                          marginBottom: '10px'
                        }}
                      />
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        <button
                          onClick={() => setActiveReplyId(null)}
                          style={{
                            padding: '6px 14px',
                            borderRadius: '8px',
                            fontSize: '0.82rem',
                            color: '#94A3B8'
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handlePostReply(disc.id)}
                          style={{
                            padding: '6px 16px',
                            borderRadius: '8px',
                            fontSize: '0.82rem',
                            fontWeight: 600,
                            background: '#6C5CE7',
                            color: '#FFFFFF',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          <Send size={13} />
                          <span>Submit Answer</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Actions Footer */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '12px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                    fontSize: '0.85rem'
                  }}>
                    <div style={{ display: 'flex', gap: '16px' }}>
                      <button
                        onClick={() => setActiveReplyId(activeReplyId === disc.id ? null : disc.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          color: activeReplyId === disc.id ? '#A78BFA' : '#94A3B8',
                          fontWeight: 600
                        }}
                      >
                        <MessageSquare size={16} />
                        <span>{disc.answersCount} Answers</span>
                      </button>

                      <button
                        onClick={() => handleShare(disc.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          color: copiedId === disc.id ? '#10B981' : '#94A3B8',
                          fontWeight: 500
                        }}
                      >
                        <Share2 size={16} />
                        <span>{copiedId === disc.id ? 'Link Copied!' : 'Share'}</span>
                      </button>
                    </div>

                    <button
                      onClick={() => { loginUser('student'); setActiveTab('community'); }}
                      style={{
                        color: '#67E8F9',
                        fontWeight: 600,
                        fontSize: '0.82rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <span>Join Discussion</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>

                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Discussions CTA */}
        <div style={{ marginTop: '48px', textAlign: 'center' }}>
          <button
            onClick={() => { loginUser('student'); setActiveTab('community'); }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '14px 28px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #6C5CE7 0%, #4F8CFF 100%)',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '0.95rem',
              boxShadow: '0 8px 25px rgba(108, 92, 231, 0.4)'
            }}
          >
            <span>Ask a Question or Browse Forum</span>
            <ArrowRight size={18} />
          </button>
        </div>

      </div>
    </section>
  );
};
