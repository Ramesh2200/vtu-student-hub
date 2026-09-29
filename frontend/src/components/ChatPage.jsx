import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  Send,
  Paperclip,
  Check,
  CheckCheck,
  Circle,
  MoreVertical,
  Phone,
  Video,
  Smile,
  Search,
  Users,
  User,
  Sparkles
} from 'lucide-react';

export const ChatPage = () => {
  const { currentUser } = useApp();

  const [activeChannelId, setActiveChannelId] = useState('chan_1');
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Channels & Contacts
  const [channels, setChannels] = useState([
    {
      id: 'chan_1',
      name: 'VTU 2026 CSE Bangalore Squad',
      type: 'group',
      avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=150&q=80',
      online: true,
      lastMessage: 'Rahul: Shared BCS601 Module 3 Notes PDF',
      unreadCount: 0
    },
    {
      id: 'chan_2',
      name: 'Dr. Sudha Ramamurthy (Faculty)',
      type: 'direct',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
      online: true,
      lastMessage: 'Please review the marking scheme for Decision Trees.',
      unreadCount: 2
    },
    {
      id: 'chan_3',
      name: 'Vikram R (RVCE Study Partner)',
      type: 'direct',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      online: false,
      lastMessage: 'Are we participating in the VTU InnoTech hackathon?',
      unreadCount: 0
    },
    {
      id: 'chan_4',
      name: 'Tier-1 Placement Discussion',
      type: 'group',
      avatar: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=150&q=80',
      online: true,
      lastMessage: 'Google interview shortlists are out!',
      unreadCount: 5
    }
  ]);

  // Messages State keyed by channel
  const [messages, setMessages] = useState({
    chan_1: [
      { id: 'm1', sender: 'Rahul Verma', text: 'Hey everyone, has anyone completed the Cloud Computing Module 3 numericals?', time: '10:14 AM', isSelf: false },
      { id: 'm2', sender: 'Sneha Hegde', text: 'Yes, check the notes section in the app. Prof. Sudha uploaded the verified steps.', time: '10:16 AM', isSelf: false },
      { id: 'm3', sender: 'Aarav Sharma', text: 'Thanks! The HDFS block replication calculation is super clear now.', time: '10:18 AM', isSelf: true }
    ],
    chan_2: [
      { id: 'm4', sender: 'Dr. Sudha Ramamurthy', text: 'Aarav, your capstone abstract on Distributed Stream Processing complies with the Phase-1 VTU rubric.', time: 'Yesterday', isSelf: false },
      { id: 'm5', sender: 'Dr. Sudha Ramamurthy', text: 'Please review the marking scheme for Decision Trees before next Tuesday’s CIE.', time: '9:30 AM', isSelf: false }
    ],
    chan_3: [
      { id: 'm6', sender: 'Vikram R', text: 'Are we participating in the VTU InnoTech hackathon? We need 1 more frontend dev.', time: 'Yesterday', isSelf: false }
    ],
    chan_4: [
      { id: 'm7', sender: 'Placement Officer', text: 'Google SWE Intern & Microsoft SDE shortlists are updated in the Placements Kanban board.', time: '11:00 AM', isSelf: false }
    ]
  });

  const activeChannel = channels.find(c => c.id === activeChannelId) || channels[0];
  const activeMessages = messages[activeChannelId] || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeMessages, isTyping]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg = {
      id: `msg_${Date.now()}`,
      sender: currentUser.name,
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSelf: true
    };

    setMessages(prev => ({
      ...prev,
      [activeChannelId]: [...(prev[activeChannelId] || []), newMsg]
    }));

    setInputText('');

    // Trigger simulated response
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const botResponse = {
        id: `msg_bot_${Date.now()}`,
        sender: activeChannel.type === 'direct' ? activeChannel.name.split(' ')[0] : 'Study Bot',
        text: activeChannel.type === 'direct'
          ? `Thanks for your message, ${currentUser.name.split(' ')[0]}! I will check the syllabus notes and get back to you shortly.`
          : `Great point! You can find the relevant VTU question papers under the Notes tab.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isSelf: false
      };

      setMessages(prev => ({
        ...prev,
        [activeChannelId]: [...(prev[activeChannelId] || []), botResponse]
      }));
    }, 2000);
  };

  return (
    <div style={{ padding: '24px 28px', maxWidth: '1440px', margin: '0 auto', width: '100%', height: 'calc(100vh - 120px)' }}>
      
      {/* 35. WEBSOCKET REAL-TIME CHAT UI */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '320px 1fr',
        height: '100%',
        borderRadius: '20px',
        overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        background: '#0B1020',
        boxShadow: '0 20px 50px rgba(0,0,0,0.6)'
      }}>
        
        {/* Left: Channels & Contacts Sidebar */}
        <div style={{
          background: '#0F172A',
          borderRight: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Header */}
          <div style={{ padding: '20px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#F8FAFC' }}>
                VTU Live Chat
              </h2>
              <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>
                WebSocket Connected
              </span>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '8px',
              padding: '6px 10px'
            }}>
              <Search size={14} color="#94A3B8" />
              <input
                type="text"
                placeholder="Search conversations..."
                style={{ background: 'transparent', border: 'none', color: '#F8FAFC', fontSize: '0.8rem', width: '100%' }}
              />
            </div>
          </div>

          {/* Channels List */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
            {channels.map((chan) => {
              const isSelected = chan.id === activeChannelId;
              return (
                <div
                  key={chan.id}
                  onClick={() => setActiveChannelId(chan.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px',
                    borderRadius: '12px',
                    background: isSelected ? 'rgba(108, 92, 231, 0.2)' : 'transparent',
                    border: isSelected ? '1px solid rgba(108, 92, 231, 0.4)' : '1px solid transparent',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    marginBottom: '4px'
                  }}
                >
                  <div style={{ position: 'relative' }}>
                    <img
                      src={chan.avatar}
                      alt={chan.name}
                      style={{ width: '42px', height: '42px', borderRadius: '12px', objectFit: 'cover' }}
                    />
                    {chan.online && (
                      <div style={{
                        position: 'absolute',
                        bottom: '-2px',
                        right: '-2px',
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        background: '#10B981',
                        border: '2px solid #0F172A'
                      }} />
                    )}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: '0.88rem',
                      fontWeight: 700,
                      color: isSelected ? '#A78BFA' : '#F8FAFC',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {chan.name}
                    </div>
                    <div style={{
                      fontSize: '0.75rem',
                      color: '#94A3B8',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {chan.lastMessage}
                    </div>
                  </div>

                  {chan.unreadCount > 0 && (
                    <span style={{
                      padding: '2px 6px',
                      borderRadius: '10px',
                      background: '#EF4444',
                      color: '#FFFFFF',
                      fontSize: '0.65rem',
                      fontWeight: 700
                    }}>
                      {chan.unreadCount}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Active Chat Room */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          
          {/* Room Header */}
          <div style={{
            height: '68px',
            padding: '0 24px',
            background: 'rgba(17, 24, 39, 0.7)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <img
                src={activeChannel.avatar}
                alt={activeChannel.name}
                style={{ width: '40px', height: '40px', borderRadius: '12px', objectFit: 'cover' }}
              />
              <div>
                <div style={{ fontSize: '0.98rem', fontWeight: 800, color: '#F8FAFC' }}>
                  {activeChannel.name}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#10B981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Circle size={8} fill="#10B981" />
                  <span>Online • Active now</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', color: '#CBD5E1' }}>
              <button style={{ padding: '8px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)' }}>
                <Phone size={16} />
              </button>
              <button style={{ padding: '8px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)' }}>
                <Video size={16} />
              </button>
              <button style={{ padding: '8px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)' }}>
                <MoreVertical size={16} />
              </button>
            </div>
          </div>

          {/* Messages Stream */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {activeMessages.map((m) => (
              <div
                key={m.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: m.isSelf ? 'flex-end' : 'flex-start',
                  maxWidth: '75%',
                  alignSelf: m.isSelf ? 'flex-end' : 'flex-start'
                }}
              >
                {!m.isSelf && (
                  <span style={{ fontSize: '0.72rem', color: '#94A3B8', marginBottom: '4px', marginLeft: '4px' }}>
                    {m.sender}
                  </span>
                )}
                <div style={{
                  padding: '12px 18px',
                  borderRadius: m.isSelf ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  background: m.isSelf ? 'linear-gradient(135deg, #6C5CE7 0%, #4F8CFF 100%)' : '#1E293B',
                  color: '#FFFFFF',
                  fontSize: '0.9rem',
                  lineHeight: 1.5,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                }}>
                  {m.text}
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.68rem',
                  color: '#64748B',
                  marginTop: '4px',
                  marginRight: m.isSelf ? '4px' : '0',
                  marginLeft: m.isSelf ? '0' : '4px'
                }}>
                  <span>{m.time}</span>
                  {m.isSelf && <CheckCheck size={13} color="#22D3EE" />}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '8px', background: '#1E293B', padding: '8px 14px', borderRadius: '14px' }}>
                <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{activeChannel.name} is typing</span>
                <span className="badge badge-accent" style={{ padding: '2px 6px' }}>...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar */}
          <form
            onSubmit={handleSendMessage}
            style={{
              padding: '16px 24px',
              background: '#0F172A',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}
          >
            <button
              type="button"
              style={{ color: '#94A3B8', padding: '6px' }}
              title="Attach VTU syllabus notes or assignment"
            >
              <Paperclip size={18} />
            </button>

            <input
              type="text"
              placeholder={`Message ${activeChannel.name}...`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              style={{
                flex: 1,
                padding: '12px 18px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                color: '#F8FAFC',
                fontSize: '0.9rem'
              }}
            />

            <button
              type="submit"
              disabled={!inputText.trim()}
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: inputText.trim() ? 'linear-gradient(135deg, #6C5CE7 0%, #4F8CFF 100%)' : 'rgba(255, 255, 255, 0.1)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: inputText.trim() ? 'pointer' : 'default',
                transition: 'all 0.2s'
              }}
            >
              <Send size={18} />
            </button>
          </form>

        </div>

      </div>
    </div>
  );
};
