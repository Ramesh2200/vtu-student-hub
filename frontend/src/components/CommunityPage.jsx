import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  MessagesSquare,
  PlusCircle,
  ChevronUp,
  MessageSquare,
  CheckCircle,
  Share2,
  Bookmark,
  Send,
  X,
  Sparkles,
  Tag
} from 'lucide-react';

export const CommunityPage = () => {
  const {
    discussions,
    upvoteDiscussion,
    addDiscussion,
    addAnswer,
    currentUser
  } = useApp();

  const [sortBy, setSortBy] = useState('popular'); // 'popular' | 'latest' | 'unanswered'
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeReplyId, setActiveReplyId] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  // New Question Form
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newTags, setNewTags] = useState('BCS601, SEE 2026, VTU');

  let sortedDiscussions = [...discussions];
  if (sortBy === 'popular') {
    sortedDiscussions.sort((a, b) => b.upvotes - a.upvotes);
  } else if (sortBy === 'unanswered') {
    sortedDiscussions = sortedDiscussions.filter(d => d.answersCount === 0 || !d.acceptedAnswer);
  }

  const handleCreateQuestion = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const tagsArr = newTags.split(',').map(t => t.trim()).filter(Boolean);
    const newQ = {
      id: `disc_${Date.now()}`,
      title: newTitle,
      author: currentUser.name,
      authorAvatar: currentUser.avatar,
      branch: currentUser.branchCode || 'CSE',
      college: currentUser.collegeCode || 'VTU',
      timestamp: 'Just now',
      upvotes: 1,
      hasUpvoted: true,
      isBookmarked: false,
      tags: tagsArr.length ? tagsArr : ['Academic', 'VTU'],
      answersCount: 0,
      acceptedAnswer: null
    };

    addDiscussion(newQ);
    setNewTitle('');
    setNewDesc('');
    setShowCreateModal(false);
  };

  const handlePostReply = (id) => {
    if (!replyContent.trim()) return;
    addAnswer(id, replyContent);
    setReplyContent('');
    setActiveReplyId(null);
  };

  const handleShare = (id) => {
    setCopiedId(id);
    navigator.clipboard?.writeText(window.location.href);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div style={{ padding: '32px 28px', maxWidth: '1100px', margin: '0 auto', width: '100%' }}>
      
      {/* 33. COMMUNITY HEADER */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px',
        marginBottom: '32px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <Sparkles size={16} color="#A78BFA" />
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#A78BFA' }}>
              Peer-to-Peer Academic Forum
            </span>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#F8FAFC', marginBottom: '4px' }}>
            Student Discussions & Doubts
          </h1>
          <p style={{ fontSize: '0.95rem', color: '#94A3B8' }}>
            Connect with 10,000+ VTU engineering students and verified faculty coordinators.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 22px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #6C5CE7 0%, #4F8CFF 100%)',
            color: '#FFFFFF',
            fontWeight: 700,
            fontSize: '0.92rem',
            boxShadow: '0 6px 20px rgba(108, 92, 231, 0.4)'
          }}
        >
          <PlusCircle size={18} />
          <span>Ask a Question</span>
        </button>
      </div>

      {/* Filter / Sort bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        paddingBottom: '14px',
        marginBottom: '28px'
      }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          {[
            { id: 'popular', label: 'Top Voted' },
            { id: 'latest', label: 'Latest' },
            { id: 'unanswered', label: 'Needs Answers' }
          ].map(s => (
            <button
              key={s.id}
              onClick={() => setSortBy(s.id)}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 600,
                background: sortBy === s.id ? 'rgba(108, 92, 231, 0.25)' : 'transparent',
                color: sortBy === s.id ? '#A78BFA' : '#94A3B8',
                border: sortBy === s.id ? '1px solid rgba(108, 92, 231, 0.4)' : '1px solid transparent'
              }}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div style={{ fontSize: '0.85rem', color: '#64748B' }}>
          {sortedDiscussions.length} Discussions Active
        </div>
      </div>

      {/* Discussions Feed */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {sortedDiscussions.map((d) => (
          <div
            key={d.id}
            className="glass-card"
            style={{
              padding: '24px 28px',
              borderRadius: '20px'
            }}
          >
            <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
              
              {/* Upvote button */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                background: d.hasUpvoted ? 'rgba(108, 92, 231, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                border: d.hasUpvoted ? '1px solid rgba(108, 92, 231, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                padding: '10px 12px',
                flexShrink: 0
              }}>
                <button
                  onClick={() => upvoteDiscussion(d.id)}
                  style={{ color: d.hasUpvoted ? '#A78BFA' : '#94A3B8' }}
                  title="Upvote"
                >
                  <ChevronUp size={22} strokeWidth={d.hasUpvoted ? 3 : 2} />
                </button>
                <span style={{ fontSize: '1rem', fontWeight: 800, color: d.hasUpvoted ? '#A78BFA' : '#F8FAFC' }}>
                  {d.upvotes}
                </span>
                <span style={{ fontSize: '0.65rem', color: '#64748B', fontWeight: 600 }}>VOTES</span>
              </div>

              {/* Main Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                {/* Author row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img
                      src={d.authorAvatar}
                      alt={d.author}
                      style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#F8FAFC' }}>
                      {d.author}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                      {d.college} ({d.branch}) • {d.timestamp}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {d.tags.map(t => (
                      <span key={t} style={{
                        fontSize: '0.72rem',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        background: 'rgba(255, 255, 255, 0.06)',
                        color: '#CBD5E1'
                      }}>
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Title */}
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#F8FAFC', marginBottom: '14px', lineHeight: 1.4 }}>
                  {d.title}
                </h3>

                {/* Accepted Answer if available */}
                {d.acceptedAnswer && (
                  <div style={{
                    background: 'rgba(16, 185, 129, 0.08)',
                    border: '1px solid rgba(16, 185, 129, 0.25)',
                    borderRadius: '14px',
                    padding: '16px',
                    marginBottom: '16px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <CheckCircle size={17} color="#10B981" />
                        <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#6EE7B7' }}>
                          Verified Answer by {d.acceptedAnswer.author} ({d.acceptedAnswer.authorRole})
                        </span>
                      </div>
                      <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>{d.acceptedAnswer.timestamp}</span>
                    </div>
                    <p style={{ fontSize: '0.88rem', color: '#E2E8F0', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                      {d.acceptedAnswer.content}
                    </p>
                  </div>
                )}

                {/* Reply box */}
                {activeReplyId === d.id && (
                  <div style={{
                    marginTop: '16px',
                    padding: '14px',
                    background: 'rgba(0, 0, 0, 0.3)',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    marginBottom: '16px'
                  }}>
                    <textarea
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder="Write your explanation or answer..."
                      rows={3}
                      style={{
                        width: '100%',
                        background: 'transparent',
                        border: 'none',
                        color: '#F8FAFC',
                        fontSize: '0.9rem',
                        outline: 'none',
                        resize: 'vertical',
                        marginBottom: '10px'
                      }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                      <button
                        onClick={() => setActiveReplyId(null)}
                        style={{ padding: '6px 12px', borderRadius: '8px', fontSize: '0.8rem', color: '#94A3B8' }}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handlePostReply(d.id)}
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
                        <span>Post Answer</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Actions Footer */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '12px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                  fontSize: '0.82rem'
                }}>
                  <div style={{ display: 'flex', gap: '18px' }}>
                    <button
                      onClick={() => setActiveReplyId(activeReplyId === d.id ? null : d.id)}
                      style={{ display: 'flex', alignItems: 'center', gap: '6px', color: activeReplyId === d.id ? '#A78BFA' : '#94A3B8', fontWeight: 600 }}
                    >
                      <MessageSquare size={16} />
                      <span>{d.answersCount} Answers</span>
                    </button>

                    <button
                      onClick={() => handleShare(d.id)}
                      style={{ display: 'flex', alignItems: 'center', gap: '6px', color: copiedId === d.id ? '#10B981' : '#94A3B8' }}
                    >
                      <Share2 size={16} />
                      <span>{copiedId === d.id ? 'Copied URL!' : 'Share'}</span>
                    </button>
                  </div>

                  <button
                    onClick={() => setActiveReplyId(d.id)}
                    style={{ color: '#22D3EE', fontWeight: 600 }}
                  >
                    + Answer This Question
                  </button>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* CREATE QUESTION MODAL */}
      {showCreateModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(5, 8, 18, 0.85)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          zIndex: 1400
        }}>
          <div style={{
            maxWidth: '620px',
            width: '100%',
            borderRadius: '20px',
            background: '#0F172A',
            border: '1px solid rgba(108, 92, 231, 0.4)',
            padding: '28px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.9)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#F8FAFC' }}>
                Ask the VTU Community
              </h3>
              <button onClick={() => setShowCreateModal(false)} style={{ color: '#94A3B8' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateQuestion}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '6px' }}>
                  Question Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. How to prepare for BCS601 Cloud Computing Module 4 MapReduce?"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '10px',
                    color: '#F8FAFC',
                    fontSize: '0.92rem'
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '6px' }}>
                  Detailed Description (Optional)
                </label>
                <textarea
                  rows={4}
                  placeholder="Provide context, what you've tried so far, or syllabus specific constraints..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '10px',
                    color: '#F8FAFC',
                    fontSize: '0.92rem',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '6px' }}>
                  Tags (Comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. BCS601, SEE 2026, Cloud Architecture"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '10px',
                    color: '#F8FAFC',
                    fontSize: '0.92rem'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  style={{ padding: '10px 18px', borderRadius: '10px', color: '#94A3B8', fontSize: '0.88rem' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '10px 22px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #6C5CE7 0%, #4F8CFF 100%)',
                    color: '#FFFFFF',
                    fontSize: '0.88rem',
                    fontWeight: 700
                  }}
                >
                  Publish Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
