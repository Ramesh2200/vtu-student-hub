import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Upload,
  PlusCircle,
  FileText,
  FileCheck2,
  Megaphone,
  CheckCircle,
  Sparkles,
  Users,
  Eye,
  Trash2,
  X
} from 'lucide-react';

export const FacultyDashboard = () => {
  const {
    currentUser,
    subjects,
    notes,
    addNote,
    addNotification,
    setPdfViewerData
  } = useApp();

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);

  // Upload Form
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState('BCS601');
  const [newModule, setNewModule] = useState(1);
  const [newDesc, setNewDesc] = useState('');

  // Announcement Form
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementMsg, setAnnouncementMsg] = useState('');

  const handleUploadNote = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const sub = subjects.find(s => s.code === newSubject) || subjects[0];
    const createdNote = {
      id: `not_${Date.now()}`,
      subjectCode: sub.code,
      subjectName: sub.name,
      moduleNumber: Number(newModule),
      title: newTitle,
      description: newDesc || 'Official faculty-verified syllabus lecture notes and examination hints.',
      author: currentUser.name,
      authorRole: currentUser.designation || 'Faculty Member',
      fileType: 'PDF',
      fileSize: '3.4 MB',
      pages: 28,
      downloads: 0,
      bookmarks: 0,
      rating: 5.0,
      uploadDate: new Date().toISOString().slice(0, 10),
      isBookmarked: false,
      scheme: currentUser.scheme || '2022 Scheme',
      semester: currentUser.semester || 6,
      branch: 'CSE',
      contentSnippet: 'Official faculty notes verified against VTU curriculum syllabus standards.'
    };

    addNote(createdNote);
    setShowUploadModal(false);
    setNewTitle('');
    setNewDesc('');
  };

  const handlePostAnnouncement = (e) => {
    e.preventDefault();
    if (!announcementTitle.trim()) return;

    addNotification({
      category: 'Academic',
      title: `Faculty Announcement: ${announcementTitle}`,
      description: announcementMsg || 'Important notice from Department Academic Coordinator.',
      actionUrl: '#academics'
    });

    setShowAnnouncementModal(false);
    setAnnouncementTitle('');
    setAnnouncementMsg('');
  };

  return (
    <div style={{ padding: '32px 28px', maxWidth: '1440px', margin: '0 auto', width: '100%' }}>
      
      {/* 43. FACULTY DASHBOARD HEADER */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(79, 140, 255, 0.2) 0%, rgba(108, 92, 231, 0.15) 100%), #111827',
        border: '1px solid rgba(79, 140, 255, 0.3)',
        borderRadius: '24px',
        padding: '36px',
        marginBottom: '32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '24px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className="badge badge-secondary">Faculty Portal</span>
            <span className="badge badge-primary">{currentUser.collegeCode || 'BMSCE'}</span>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#F8FAFC', marginBottom: '6px' }}>
            Welcome, {currentUser.name}
          </h1>
          <p style={{ fontSize: '0.95rem', color: '#94A3B8' }}>
            {currentUser.designation || 'Professor & Senior Academic Coordinator'} • {currentUser.college}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setShowAnnouncementModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 20px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#F8FAFC',
              fontWeight: 600,
              fontSize: '0.9rem'
            }}
          >
            <Megaphone size={16} />
            <span>Broadcast Announcement</span>
          </button>

          <button
            onClick={() => setShowUploadModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 22px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #6C5CE7 0%, #4F8CFF 100%)',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '0.9rem',
              boxShadow: '0 6px 20px rgba(108, 92, 231, 0.4)'
            }}
          >
            <Upload size={16} />
            <span>Upload Notes / Question Paper</span>
          </button>
        </div>
      </div>

      {/* Engagement Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '36px' }}>
        {[
          { label: 'Uploaded Notes', value: '14', sub: 'Verified across VTU', color: '#6C5CE7' },
          { label: 'Total Student Reads', value: '18,450', sub: 'Downloads & Previews', color: '#4F8CFF' },
          { label: 'Questions Answered', value: '42', sub: 'In Student Discussions', color: '#10B981' },
          { label: 'Active Cohorts', value: '4 Classes', sub: '6th Sem CSE', color: '#22D3EE' }
        ].map(s => (
          <div key={s.label} className="glass-card" style={{ padding: '24px', borderRadius: '18px' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#F8FAFC', marginBottom: '4px' }}>
              {s.value}
            </div>
            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: s.color, marginBottom: '2px' }}>
              {s.label}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
              {s.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Faculty Resource Management Table */}
      <div className="glass-card" style={{ padding: '28px', borderRadius: '20px' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#F8FAFC', marginBottom: '18px' }}>
          Your Uploaded Resources & Solved Question Papers
        </h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#94A3B8' }}>
                <th style={{ padding: '12px' }}>Title & Subject</th>
                <th style={{ padding: '12px' }}>Module</th>
                <th style={{ padding: '12px' }}>Size</th>
                <th style={{ padding: '12px' }}>Downloads</th>
                <th style={{ padding: '12px' }}>Status</th>
                <th style={{ padding: '12px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {notes.slice(0, 5).map(n => (
                <tr key={n.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', color: '#E2E8F0' }}>
                  <td style={{ padding: '14px 12px' }}>
                    <div style={{ fontWeight: 600, color: '#F8FAFC' }}>{n.title}</div>
                    <div style={{ fontSize: '0.75rem', color: '#67E8F9' }}>{n.subjectCode} - {n.subjectName}</div>
                  </td>
                  <td style={{ padding: '14px 12px' }}>Module {n.moduleNumber}</td>
                  <td style={{ padding: '14px 12px' }}>{n.fileSize}</td>
                  <td style={{ padding: '14px 12px' }}>{n.downloads}</td>
                  <td style={{ padding: '14px 12px' }}>
                    <span className="badge badge-success">Verified Official</span>
                  </td>
                  <td style={{ padding: '14px 12px' }}>
                    <button
                      onClick={() => setPdfViewerData(n)}
                      style={{ padding: '6px 10px', borderRadius: '6px', background: 'rgba(255,255,255,0.06)', color: '#CBD5E1', fontSize: '0.78rem' }}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* UPLOAD MODAL */}
      {showUploadModal && (
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
            maxWidth: '580px',
            width: '100%',
            borderRadius: '20px',
            background: '#0F172A',
            border: '1px solid rgba(108, 92, 231, 0.4)',
            padding: '28px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#F8FAFC' }}>
                Upload Subject Resource PDF
              </h3>
              <button onClick={() => setShowUploadModal(false)} style={{ color: '#94A3B8' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUploadNote}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '6px' }}>
                  Resource Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. BCS601 Module 2 Virtualization & Hypervisor Architectures"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#FFF' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '6px' }}>
                    Course Subject
                  </label>
                  <select
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', background: '#0B1020', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#FFF' }}
                  >
                    {subjects.map(s => <option key={s.id} value={s.code}>{s.code}: {s.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '6px' }}>
                    Module Unit
                  </label>
                  <select
                    value={newModule}
                    onChange={(e) => setNewModule(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', background: '#0B1020', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#FFF' }}
                  >
                    {[1, 2, 3, 4, 5].map(m => <option key={m} value={m}>Module {m}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '6px' }}>
                  Overview & Exam Focus
                </label>
                <textarea
                  rows={3}
                  placeholder="Key concepts covered, repeated questions, solved problems..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#FFF' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={() => setShowUploadModal(false)} style={{ padding: '10px 16px', borderRadius: '10px', color: '#94A3B8' }}>
                  Cancel
                </button>
                <button type="submit" style={{ padding: '10px 22px', borderRadius: '10px', background: '#6C5CE7', color: '#FFF', fontWeight: 700 }}>
                  Publish & Notify Students
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ANNOUNCEMENT MODAL */}
      {showAnnouncementModal && (
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
          <div style={{ maxWidth: '540px', width: '100%', borderRadius: '20px', background: '#0F172A', border: '1px solid rgba(79, 140, 255, 0.4)', padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#F8FAFC' }}>
                Broadcast Faculty Notice
              </h3>
              <button onClick={() => setShowAnnouncementModal(false)} style={{ color: '#94A3B8' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handlePostAnnouncement}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '6px' }}>
                  Announcement Subject
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CIE-2 Syllabus & Model Question Paper Release"
                  value={announcementTitle}
                  onChange={(e) => setAnnouncementTitle(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#FFF' }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '6px' }}>
                  Notice Content
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Details for students..."
                  value={announcementMsg}
                  onChange={(e) => setAnnouncementMsg(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#FFF' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={() => setShowAnnouncementModal(false)} style={{ padding: '10px 16px', borderRadius: '10px', color: '#94A3B8' }}>
                  Cancel
                </button>
                <button type="submit" style={{ padding: '10px 22px', borderRadius: '10px', background: '#4F8CFF', color: '#FFF', fontWeight: 700 }}>
                  Broadcast Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
