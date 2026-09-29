import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Users,
  UserPlus,
  PlusCircle,
  MessageCircle,
  FileText,
  Share2,
  Check,
  Sparkles,
  Search,
  X
} from 'lucide-react';

export const StudyGroupsPage = () => {
  const { studyGroups, toggleJoinGroup, currentUser, setActiveTab } = useApp();
  const [filterType, setFilterType] = useState('all'); // 'all' | 'my'
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Form State
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDesc, setNewGroupDesc] = useState('');
  const [newGroupBranch, setNewGroupBranch] = useState('CSE');

  const filteredGroups = studyGroups.filter(grp => {
    if (filterType === 'my' && !grp.isMember) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return grp.name.toLowerCase().includes(q) || grp.description.toLowerCase().includes(q);
    }
    return true;
  });

  const handleCreateGroup = (e) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;

    const created = {
      id: `grp_${Date.now()}`,
      name: newGroupName,
      description: newGroupDesc,
      membersCount: 1,
      branch: newGroupBranch,
      semester: `${currentUser.semester}th Sem`,
      coverImage: '/assets/campus_collab.jpg',
      isMember: true,
      recentActivity: `${currentUser.name} created the group`,
      postsCount: 1
    };

    studyGroups.unshift(created);
    setNewGroupName('');
    setNewGroupDesc('');
    setShowCreateModal(false);
  };

  return (
    <div style={{ padding: '32px 28px', maxWidth: '1440px', margin: '0 auto', width: '100%' }}>
      
      {/* 34. HEADER */}
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
              Collaborative Peer Learning
            </span>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#F8FAFC', marginBottom: '4px' }}>
            VTU Study Groups & Circles
          </h1>
          <p style={{ fontSize: '0.95rem', color: '#94A3B8' }}>
            Join subject cohorts, branch communities, and hackathon project squads.
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
          <span>Create New Study Group</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '28px'
      }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setFilterType('all')}
            style={{
              padding: '8px 18px',
              borderRadius: '10px',
              fontSize: '0.85rem',
              fontWeight: 600,
              background: filterType === 'all' ? '#6C5CE7' : 'rgba(255, 255, 255, 0.05)',
              color: filterType === 'all' ? '#FFFFFF' : '#94A3B8'
            }}
          >
            All Communities ({studyGroups.length})
          </button>

          <button
            onClick={() => setFilterType('my')}
            style={{
              padding: '8px 18px',
              borderRadius: '10px',
              fontSize: '0.85rem',
              fontWeight: 600,
              background: filterType === 'my' ? '#6C5CE7' : 'rgba(255, 255, 255, 0.05)',
              color: filterType === 'my' ? '#FFFFFF' : '#94A3B8'
            }}
          >
            My Joined Groups
          </button>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '10px',
          padding: '8px 14px',
          minWidth: '260px'
        }}>
          <Search size={16} color="#94A3B8" />
          <input
            type="text"
            placeholder="Search study groups..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#F8FAFC',
              fontSize: '0.85rem',
              width: '100%'
            }}
          />
        </div>
      </div>

      {/* Study Groups Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '24px'
      }}>
        {filteredGroups.map((grp) => (
          <div
            key={grp.id}
            className="glass-card"
            style={{
              borderRadius: '20px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            {/* Banner */}
            <div style={{ position: 'relative', height: '140px' }}>
              <img
                src={grp.coverImage}
                alt={grp.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, rgba(11, 16, 32, 0.1) 0%, rgba(11, 16, 32, 0.9) 100%)'
              }} />

              <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                <span className="badge badge-primary">
                  {grp.branch} • {grp.semester}
                </span>
              </div>
            </div>

            {/* Body */}
            <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#F8FAFC', marginBottom: '8px', lineHeight: 1.3 }}>
                  {grp.name}
                </h3>
                <p style={{ fontSize: '0.88rem', color: '#94A3B8', lineHeight: 1.5, marginBottom: '18px' }}>
                  {grp.description}
                </p>

                <div style={{
                  padding: '10px 14px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  fontSize: '0.78rem',
                  color: '#CBD5E1',
                  marginBottom: '20px'
                }}>
                  📢 <strong style={{ color: '#22D3EE' }}>Recent:</strong> {grp.recentActivity}
                </div>
              </div>

              {/* Actions footer */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '16px',
                borderTop: '1px solid rgba(255, 255, 255, 0.06)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: '#94A3B8' }}>
                  <Users size={16} color="#A78BFA" />
                  <span>{grp.membersCount} Members</span>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  {grp.isMember && (
                    <button
                      onClick={() => setActiveTab('chat')}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '8px',
                        background: 'rgba(255, 255, 255, 0.06)',
                        color: '#F8FAFC',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <MessageCircle size={14} />
                      <span>Chat</span>
                    </button>
                  )}

                  <button
                    onClick={() => toggleJoinGroup(grp.id)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      background: grp.isMember ? 'rgba(16, 185, 129, 0.15)' : 'linear-gradient(135deg, #6C5CE7 0%, #4F8CFF 100%)',
                      border: grp.isMember ? '1px solid #10B981' : 'none',
                      color: grp.isMember ? '#6EE7B7' : '#FFFFFF',
                      transition: 'all 0.2s'
                    }}
                  >
                    {grp.isMember ? 'Joined' : 'Join Group'}
                  </button>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* CREATE GROUP MODAL */}
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
            maxWidth: '560px',
            width: '100%',
            borderRadius: '20px',
            background: '#0F172A',
            border: '1px solid rgba(108, 92, 231, 0.4)',
            padding: '28px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.9)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#F8FAFC' }}>
                Create a VTU Study Squad
              </h3>
              <button onClick={() => setShowCreateModal(false)} style={{ color: '#94A3B8' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateGroup}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '6px' }}>
                  Group Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MSRIT CSE Cloud & Distributed Systems Circle"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
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
                  Target Branch
                </label>
                <select
                  value={newGroupBranch}
                  onChange={(e) => setNewGroupBranch(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    background: '#0B1020',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '10px',
                    color: '#F8FAFC',
                    fontSize: '0.9rem'
                  }}
                >
                  <option value="CSE">Computer Science & Engineering</option>
                  <option value="ISE">Information Science</option>
                  <option value="AIML">AI & Machine Learning</option>
                  <option value="ECE">Electronics & Communication</option>
                  <option value="All">All VTU Engineering Branches</option>
                </select>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '6px' }}>
                  Group Purpose / Description
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="What will members collaborate on? (e.g. daily syllabus revisions, lab solutions, hackathon builds)..."
                  value={newGroupDesc}
                  onChange={(e) => setNewGroupDesc(e.target.value)}
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
                  Launch Group
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
