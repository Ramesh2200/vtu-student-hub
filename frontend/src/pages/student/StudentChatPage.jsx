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
  CheckCircle,
  Code,
  Database,
  Layers,
  Server,
  Briefcase,
  ShieldCheck,
  GraduationCap
} from 'lucide-react';
import { api, authStorage } from '../../services/api';
import { StudentLayout } from '../../components/StudentLayout';

const renderRoomIcon = (iconName, color = '#38BDF8', size = 16) => {
  switch (iconName) {
    case 'Code':
      return <Code size={size} color={color} />;
    case 'Database':
      return <Database size={size} color={color} />;
    case 'Layers':
      return <Layers size={size} color={color} />;
    case 'Server':
      return <Server size={size} color={color} />;
    case 'Briefcase':
      return <Briefcase size={size} color={color} />;
    case 'HelpCircle':
      return <HelpCircle size={size} color={color} />;
    case 'MessageSquare':
    default:
      return <MessageSquare size={size} color={color} />;
  }
};

export const StudentChatPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [rooms, setRooms] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [user, setUser] = useState(() => authStorage.getUser());

  // Report Modal
  const [reportTarget, setReportTarget] = useState(null);
  const [reportReason, setReportReason] = useState('');
  const [reportDone, setReportDone] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    setUser(authStorage.getUser());
    loadRooms();
  }, []);

  useEffect(() => {
    if (activeRoom) {
      loadMessages(activeRoom.id);
      // Polling every 4 seconds for real-time peer discussion updates
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
      const validRooms = Array.isArray(data) && data.length > 0 ? data : [];
      setRooms(validRooms);
      if (validRooms.length > 0) {
        const roomParam = searchParams.get('room');
        const found = roomParam ? validRooms.find((r) => r.slug === roomParam) : validRooms[0];
        setActiveRoom(found || validRooms[0]);
      }
    } catch (err) {
      console.error('Failed to load chat rooms:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (roomId, isPoll = false) => {
    try {
      if (!isPoll) setLoadingMessages(true);
      const msgs = await api.chat.getMessages(roomId);
      setMessages(msgs || []);
      if (!isPoll) {
        setTimeout(scrollToBottom, 100);
      }
    } catch (err) {
      console.error('Failed to load chat messages:', err);
    } finally {
      if (!isPoll) setLoadingMessages(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const textToSend = newMessage.trim();
    if (!textToSend || !activeRoom) return;

    try {
      setSending(true);
      const sent = await api.chat.sendMessage(activeRoom.id, textToSend);
      setNewMessage('');
      if (sent) {
        setMessages((prev) => {
          // Avoid duplicate by id
          if (prev.some(m => m.id === sent.id)) return prev;
          return [...prev, sent];
        });
      }
      setTimeout(scrollToBottom, 60);
    } catch (err) {
      console.error('Send message failed:', err);
    } finally {
      setSending(false);
    }
  };

  const handleQuickPrompt = (promptText) => {
    setNewMessage(promptText);
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

  const currentUserId = user?.id || (user?.email?.includes('admin') ? 1 : 2);

  return (
    <StudentLayout>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px', height: 'calc(100vh - 110px)' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', flexShrink: 0 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ fontSize: '22px', fontWeight: '900', color: '#F8FAFC', margin: 0, letterSpacing: '-0.02em' }}>
                Student Community Discussions
              </h1>
              <span style={{ fontSize: '11px', background: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8', padding: '2px 8px', borderRadius: '6px', fontWeight: '700' }}>
                7 Channels
              </span>
            </div>
            <p style={{ fontSize: '13px', color: '#94A3B8', margin: '3px 0 0' }}>
              Real-time peer chat & academic doubt resolution across all VTU engineering branches.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => {
                if (activeRoom) loadMessages(activeRoom.id);
              }}
              title="Refresh discussion feed"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '6px 10px',
                borderRadius: '8px',
                color: '#94A3B8',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              <RefreshCw size={13} className={loadingMessages ? 'animate-spin' : ''} />
              <span>Refresh</span>
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.25)', padding: '6px 12px', borderRadius: '8px', color: '#34D399', fontSize: '12px', fontWeight: '700' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
              Live Sync Active
            </div>
          </div>
        </div>

        {/* Mobile Horizontal Channel Switcher (shown on smaller screens) */}
        <div
          className="mobile-channel-pills"
          style={{
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            paddingBottom: '4px',
            flexShrink: 0
          }}
        >
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
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  background: isActive ? 'linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)' : 'rgba(15, 23, 42, 0.7)',
                  border: isActive ? '1px solid #7C3AED' : '1px solid rgba(255, 255, 255, 0.08)',
                  color: isActive ? '#FFFFFF' : '#94A3B8',
                  fontSize: '12px',
                  fontWeight: isActive ? '700' : '600',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {renderRoomIcon(room.icon, isActive ? '#FFFFFF' : '#94A3B8', 13)}
                <span>{room.name}</span>
                {room.messageCount > 0 && (
                  <span
                    style={{
                      fontSize: '10px',
                      background: isActive ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.08)',
                      padding: '1px 6px',
                      borderRadius: '10px'
                    }}
                  >
                    {room.messageCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Main Chat Layout: Left Room Rail + Right Messages Panel */}
        <div
          style={{
            flex: 1,
            minHeight: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
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
              flexDirection: 'column',
              minHeight: 0
            }}
          >
            <div style={{ padding: '14px 18px', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <span style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: '#94A3B8', letterSpacing: '0.04em' }}>
                Study Rooms ({rooms.length})
              </span>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
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
                      padding: '10px 12px',
                      borderRadius: '10px',
                      background: isActive ? 'linear-gradient(135deg, rgba(124, 58, 237, 0.25) 0%, rgba(6, 182, 212, 0.15) 100%)' : 'transparent',
                      border: isActive ? '1px solid rgba(124, 58, 237, 0.4)' : '1px solid transparent',
                      color: isActive ? '#FFFFFF' : '#94A3B8',
                      fontSize: '13px',
                      fontWeight: isActive ? '700' : '500',
                      cursor: 'pointer',
                      textAlign: 'left',
                      marginBottom: '4px',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {renderRoomIcon(room.icon, isActive ? '#38BDF8' : '#64748B', 15)}
                    <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {room.name}
                    </span>
                    {room.messageCount > 0 && (
                      <span
                        style={{
                          fontSize: '11px',
                          color: isActive ? '#38BDF8' : '#64748B',
                          background: isActive ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                          padding: '2px 7px',
                          borderRadius: '8px',
                          fontWeight: '700'
                        }}
                      >
                        {room.messageCount}
                      </span>
                    )}
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
                padding: '12px 20px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                background: 'rgba(15, 23, 42, 0.85)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexShrink: 0
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: 'rgba(56, 189, 248, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {renderRoomIcon(activeRoom?.icon, '#38BDF8', 16)}
                </div>
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#F8FAFC', margin: 0 }}>
                    {activeRoom?.name || 'General Discussions'}
                  </h3>
                  <p style={{ fontSize: '12px', color: '#64748B', margin: '2px 0 0' }}>
                    {activeRoom?.description || 'VTU peer academic forum'}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#94A3B8' }}>
                <Users size={14} color="#38BDF8" />
                <span>{messages.length} messages</span>
              </div>
            </div>

            {/* Message Feed */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                minHeight: 0
              }}
            >
              {loadingMessages ? (
                <div style={{ padding: '60px', textAlign: 'center', color: '#64748B' }}>
                  <RefreshCw size={28} className="animate-spin" color="#38BDF8" style={{ marginBottom: '10px' }} />
                  <p style={{ margin: 0, fontSize: '13px' }}>Loading discussion messages...</p>
                </div>
              ) : messages.length === 0 ? (
                <div style={{ padding: '40px 20px', textAlign: 'center', color: '#64748B' }}>
                  <div
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '50%',
                      background: 'rgba(56, 189, 248, 0.1)',
                      margin: '0 auto 12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <MessageSquare size={26} color="#38BDF8" />
                  </div>
                  <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#F8FAFC', margin: '0 0 6px' }}>
                    Start the conversation in #{activeRoom?.name}
                  </h4>
                  <p style={{ margin: '0 0 16px', fontSize: '13px', maxWidth: '380px', marginInline: 'auto' }}>
                    Ask questions, share syllabus pointers, or discuss exam strategies with students across VTU colleges.
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '8px' }}>
                    <button
                      onClick={() => handleQuickPrompt('Could someone share key questions for 6th sem internals?')}
                      style={{
                        padding: '6px 12px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '20px',
                        color: '#CBD5E1',
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}
                    >
                      💡 Key questions for internals?
                    </button>
                    <button
                      onClick={() => handleQuickPrompt('Where can I find the 2022 Scheme model question paper solution?')}
                      style={{
                        padding: '6px 12px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '20px',
                        color: '#CBD5E1',
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}
                    >
                      📄 Model question papers?
                    </button>
                  </div>
                </div>
              ) : (
                messages.map((msg) => {
                  const isMine = Number(msg.userId) === Number(currentUserId);
                  const isModerator = (msg.userRole || '').toUpperCase() === 'ADMIN';
                  const messageText = msg.content || msg.message || '';
                  const timeFormatted = msg.createdAt
                    ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : 'Just now';

                  return (
                    <div
                      key={msg.id}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: isMine ? 'flex-end' : 'flex-start'
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          marginBottom: '4px',
                          fontSize: '11px',
                          color: '#64748B'
                        }}
                      >
                        {/* Avatar */}
                        {msg.userAvatar ? (
                          <img
                            src={msg.userAvatar}
                            alt=""
                            style={{ width: '18px', height: '18px', borderRadius: '50%', objectFit: 'cover' }}
                          />
                        ) : (
                          <div
                            style={{
                              width: '18px',
                              height: '18px',
                              borderRadius: '50%',
                              background: isMine ? '#7C3AED' : '#0EA5E9',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '9px',
                              fontWeight: '700',
                              color: '#FFFFFF'
                            }}
                          >
                            {(msg.userName || 'S').charAt(0).toUpperCase()}
                          </div>
                        )}

                        <strong style={{ color: isMine ? '#38BDF8' : isModerator ? '#F59E0B' : '#A78BFA' }}>
                          {isMine ? 'You' : msg.userName || 'Student'}
                        </strong>

                        {isModerator && (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '2px',
                              fontSize: '9px',
                              fontWeight: '800',
                              background: 'rgba(245, 158, 11, 0.15)',
                              color: '#FBBF24',
                              border: '1px solid rgba(245, 158, 11, 0.3)',
                              padding: '1px 5px',
                              borderRadius: '4px'
                            }}
                          >
                            <ShieldCheck size={10} /> ADMIN
                          </span>
                        )}

                        <span>•</span>
                        <span>{timeFormatted}</span>

                        {!isMine && (
                          <button
                            onClick={() => setReportTarget(msg)}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: '#64748B',
                              cursor: 'pointer',
                              padding: '2px 4px',
                              display: 'flex',
                              alignItems: 'center',
                              borderRadius: '4px'
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
                          padding: '10px 15px',
                          borderRadius: isMine ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                          background: isMine
                            ? 'linear-gradient(135deg, #7C3AED 0%, #6366F1 100%)'
                            : 'rgba(30, 41, 59, 0.75)',
                          border: isMine ? 'none' : '1px solid rgba(255, 255, 255, 0.08)',
                          color: '#FFFFFF',
                          fontSize: '13px',
                          lineHeight: 1.5,
                          wordBreak: 'break-word',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                        }}
                      >
                        {messageText}
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
                padding: '14px 20px',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                background: 'rgba(11, 16, 32, 0.75)',
                display: 'flex',
                gap: '10px',
                flexShrink: 0
              }}
            >
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={`Message #${activeRoom?.name || 'discussion'}...`}
                style={{
                  flex: 1,
                  background: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  outline: 'none'
                }}
              />
              <button
                type="submit"
                disabled={sending || !newMessage.trim()}
                style={{
                  background: (!newMessage.trim() || sending)
                    ? 'rgba(255, 255, 255, 0.1)'
                    : 'linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '0 18px',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: (!newMessage.trim() || sending) ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  opacity: (!newMessage.trim() || sending) ? 0.6 : 1,
                  transition: 'all 0.15s ease'
                }}
              >
                <Send size={14} /> {sending ? 'Posting...' : 'Send'}
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
                borderRadius: '16px',
                padding: '22px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#F87171', marginBottom: '12px' }}>
                <AlertTriangle size={20} />
                <h3 style={{ fontSize: '17px', fontWeight: '800', margin: 0 }}>Report Message</h3>
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
                    "{reportTarget.content || reportTarget.message}"
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
