import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  MessageSquare,
  Send,
  Flag,
  Users,
  Hash,
  Sparkles,
  HelpCircle,
  AlertTriangle,
  RefreshCw,
  CheckCircle
} from 'lucide-react';
import { api, authStorage } from '../../services/api';
import { StudentLayout } from '../../components/StudentLayout';

export const StudentChatPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [rooms, setRooms] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [user, setUser] = useState(() => authStorage.getUser());

  // Report Modal
  const [reportTarget, setReportTarget] = useState(null);
  const [reportReason, setReportReason] = useState('');
  const [reportDone, setReportDone] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadRooms();
  }, []);

  useEffect(() => {
    if (activeRoom) {
      loadMessages(activeRoom.id);
      // Polling every 4 seconds for real-time updates as requested
      const interval = setInterval(() => {
        loadMessages(activeRoom.id, true);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [activeRoom]);

  const loadRooms = async () => {
    try {
      setLoading(true);
      const data = await api.chat.getRooms();
      setRooms(data || []);
      if (data && data.length > 0) {
        const roomParam = searchParams.get('room');
        const found = roomParam ? data.find((r) => r.slug === roomParam) : data[0];
        setActiveRoom(found || data[0]);
      }
    } catch (err) {
      console.error('Failed to load chat rooms:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (roomId, isPoll = false) => {
    try {
      const msgs = await api.chat.getMessages(roomId);
      setMessages(msgs || []);
      if (!isPoll) {
        setTimeout(scrollToBottom, 100);
      }
    } catch (err) {
      console.error('Failed to load chat messages:', err);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeRoom) return;

    try {
      setSending(true);
      const sent = await api.chat.sendMessage(activeRoom.id, newMessage.trim());
      setNewMessage('');
      setMessages((prev) => [...prev, sent]);
      setTimeout(scrollToBottom, 50);
    } catch (err) {
      console.error('Send message failed:', err);
    } finally {
      setSending(false);
    }
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    if (!reportTarget || !reportReason.trim()) return;

    try {
      await api.chat.reportMessage(reportTarget.id, reportReason.trim());
      setReportDone(true);
      setTimeout(() => {
        setReportDone(false);
        setReportTarget(null);
        setReportReason('');
      }, 1500);
    } catch (err) {
      alert(err.message || 'Report submission failed');
    }
  };

  return (
    <StudentLayout>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px', height: 'calc(100vh - 120px)' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '900', color: '#F8FAFC', margin: 0 }}>
              Student Community Discussions
            </h1>
            <p style={{ fontSize: '13px', color: '#94A3B8', margin: '2px 0 0' }}>
              Real-time peer chat & academic doubt resolution across VTU branches.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.25)', padding: '6px 12px', borderRadius: '8px', color: '#34D399', fontSize: '12px', fontWeight: '700' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
            Live Sync Active
          </div>
        </div>

        {/* Main Chat Layout: Left Room Rail + Right Messages Panel */}
        <div
          style={{
            flex: 1,
            background: 'rgba(15, 23, 42, 0.65)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '20px',
            display: 'grid',
            gridTemplateColumns: '260px 1fr',
            overflow: 'hidden'
          }}
        >
          {/* Rooms Sidebar */}
          <div
            style={{
              background: 'rgba(11, 16, 32, 0.85)',
              borderRight: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <span style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: '#94A3B8', letterSpacing: '0.04em' }}>
                Study Rooms ({rooms.length})
              </span>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
              {rooms.map((room) => {
                const isActive = activeRoom?.id === room.id;
                return (
                  <button
                    key={room.id}
                    onClick={() => {
                      setActiveRoom(room);
                      setSearchParams({ room: room.slug });
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 14px',
                      borderRadius: '12px',
                      background: isActive ? 'linear-gradient(135deg, rgba(124, 58, 237, 0.3) 0%, rgba(6, 182, 212, 0.2) 100%)' : 'transparent',
                      border: isActive ? '1px solid rgba(124, 58, 237, 0.4)' : '1px solid transparent',
                      color: isActive ? '#FFFFFF' : '#94A3B8',
                      fontSize: '13px',
                      fontWeight: isActive ? '700' : '600',
                      cursor: 'pointer',
                      textAlign: 'left',
                      marginBottom: '4px',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <Hash size={16} color={isActive ? '#38BDF8' : '#64748B'} />
                    <span style={{ flex: 1 }}>{room.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Chat Messages & Input Panel */}
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
            
            {/* Active Room Header */}
            <div
              style={{
                padding: '14px 24px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                background: 'rgba(15, 23, 42, 0.8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Hash size={18} color="#38BDF8" />
                <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#F8FAFC', margin: 0 }}>
                  {activeRoom?.name || 'Discussion Room'}
                </h3>
                <span style={{ fontSize: '12px', color: '#64748B', marginLeft: '6px' }}>
                  {activeRoom?.description}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#94A3B8' }}>
                <Users size={14} />
                <span>VTU Community</span>
              </div>
            </div>

            {/* Message Feed */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {messages.length === 0 ? (
                <div style={{ padding: '60px', textAlign: 'center', color: '#64748B' }}>
                  <MessageSquare size={40} color="#334155" style={{ marginBottom: '10px' }} />
                  <p style={{ margin: 0, fontSize: '13px' }}>No messages yet in this room. Be the first to start the discussion!</p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isMine = msg.userId === user?.id;

                  return (
                    <div
                      key={msg.id}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: isMine ? 'flex-end' : 'flex-start'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', fontSize: '11px', color: '#64748B' }}>
                        <strong style={{ color: isMine ? '#38BDF8' : '#A78BFA' }}>
                          {isMine ? 'You' : msg.userName || 'Student'}
                        </strong>
                        <span>•</span>
                        <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>

                        {!isMine && (
                          <button
                            onClick={() => setReportTarget(msg)}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: '#64748B',
                              cursor: 'pointer',
                              padding: '2px',
                              display: 'flex',
                              alignItems: 'center'
                            }}
                            title="Report message"
                          >
                            <Flag size={11} />
                          </button>
                        )}
                      </div>

                      <div
                        style={{
                          maxWidth: '75%',
                          padding: '12px 16px',
                          borderRadius: '16px',
                          background: isMine
                            ? 'linear-gradient(135deg, #7C3AED 0%, #6366F1 100%)'
                            : 'rgba(30, 41, 59, 0.7)',
                          border: isMine ? 'none' : '1px solid rgba(255, 255, 255, 0.08)',
                          color: '#FFFFFF',
                          fontSize: '13px',
                          lineHeight: 1.5,
                          wordBreak: 'break-word',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                        }}
                      >
                        {msg.content}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input Box */}
            <form
              onSubmit={handleSendMessage}
              style={{
                padding: '16px 20px',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                background: 'rgba(11, 16, 32, 0.7)',
                display: 'flex',
                gap: '12px'
              }}
            >
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={`Message #${activeRoom?.name || 'room'}...`}
                style={{
                  flex: 1,
                  background: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  outline: 'none'
                }}
              />
              <button
                type="submit"
                disabled={sending || !newMessage.trim()}
                style={{
                  background: 'linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '0 20px',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Send size={15} /> Send
              </button>
            </form>

          </div>
        </div>

        {/* REPORT MODAL */}
        {reportTarget && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.75)',
              zIndex: 100,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }}
          >
            <div
              style={{
                width: '100%',
                maxWidth: '440px',
                background: '#0F172A',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                borderRadius: '20px',
                padding: '24px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#F87171', marginBottom: '12px' }}>
                <AlertTriangle size={20} />
                <h3 style={{ fontSize: '18px', fontWeight: '800', margin: 0 }}>Report Message</h3>
              </div>

              {reportDone ? (
                <div style={{ textAlign: 'center', padding: '16px' }}>
                  <CheckCircle size={36} color="#34D399" style={{ marginBottom: '8px' }} />
                  <p style={{ color: '#F8FAFC', margin: 0, fontWeight: '700' }}>Report logged for admin review.</p>
                </div>
              ) : (
                <form onSubmit={handleReportSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <p style={{ fontSize: '13px', color: '#94A3B8', margin: 0 }}>
                    Please specify why this message violates community guidelines (e.g. spam, abusive language, inappropriate content):
                  </p>

                  <div style={{ padding: '10px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px', fontSize: '12px', color: '#CBD5E1' }}>
                    "{reportTarget.content}"
                  </div>

                  <textarea
                    rows={3}
                    required
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    placeholder="Reason for report..."
                    style={{
                      width: '100%',
                      background: 'rgba(11, 16, 32, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '8px',
                      padding: '10px',
                      color: '#FFFFFF',
                      fontSize: '13px',
                      outline: 'none',
                      resize: 'none'
                    }}
                  />

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                    <button
                      type="button"
                      onClick={() => setReportTarget(null)}
                      style={{
                        background: 'transparent',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: '#94A3B8',
                        padding: '8px 14px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      style={{
                        background: '#EF4444',
                        border: 'none',
                        color: '#FFFFFF',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: '700',
                        cursor: 'pointer'
                      }}
                    >
                      Submit Report
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

      </div>
    </StudentLayout>
  );
};
