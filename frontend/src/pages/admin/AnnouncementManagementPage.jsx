import React, { useState, useEffect } from 'react';
import { BellRing, Plus, Trash2, Edit2, X } from 'lucide-react';
import { api } from '../../services/api';
import { AdminLayout } from './AdminLayout';

export const AnnouncementManagementPage = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editAnn, setEditAnn] = useState(null); // null = create mode, object = edit mode
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    try {
      setLoading(true);
      const data = await api.admin.getAnnouncements();
      setAnnouncements(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      if (editAnn) {
        // Update existing
        await api.admin.updateAnnouncement(editAnn.id, { title, content });
        setAnnouncements((prev) =>
          prev.map((a) => (a.id === editAnn.id ? { ...a, title, content } : a))
        );
      } else {
        // Create new
        const created = await api.admin.createAnnouncement({ title, content });
        setAnnouncements((prev) => [created, ...prev]);
      }
      closeModal();
    } catch (err) {
      alert(err.message || 'Failed to save announcement');
    }
  };

  const openCreate = () => {
    setEditAnn(null);
    setTitle('');
    setContent('');
    setShowModal(true);
  };

  const openEdit = (ann) => {
    setEditAnn(ann);
    setTitle(ann.title || '');
    setContent(ann.content || '');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditAnn(null);
    setTitle('');
    setContent('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this circular announcement?')) return;
    try {
      await api.admin.deleteAnnouncement(id);
      setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      alert(err.message || 'Delete failed');
    }
  };

  return (
    <AdminLayout>
      <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '900', color: '#F8FAFC', margin: 0 }}>
              Official University Circulars & Announcements
            </h1>
            <p style={{ fontSize: '13px', color: '#94A3B8', margin: '4px 0 0' }}>
              Broadcast real-time university notices, exam fee deadlines, and timetable releases to students.
            </p>
          </div>

          <button
            onClick={openCreate}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
              color: '#FFFFFF',
              border: 'none',
              padding: '10px 18px',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            <Plus size={16} /> Broadcast Circular
          </button>
        </div>

        {/* Circulars Feed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#94A3B8' }}>Loading announcements...</div>
          ) : announcements.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', background: 'rgba(15, 23, 42, 0.5)', borderRadius: '16px', color: '#94A3B8' }}>
              No announcements published yet.
            </div>
          ) : (
            announcements.map((ann) => (
              <div
                key={ann.id}
                style={{
                  background: 'rgba(15, 23, 42, 0.65)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '16px',
                  padding: '20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: '16px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '11px', fontWeight: '800', background: '#0284C7', color: '#FFFFFF', padding: '2px 8px', borderRadius: '4px' }}>
                      VTU Circular
                    </span>
                    <span style={{ fontSize: '11px', color: '#64748B' }}>
                      {new Date(ann.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#F8FAFC', margin: '0 0 6px 0' }}>
                    {ann.title}
                  </h3>
                  <p style={{ fontSize: '13px', color: '#CBD5E1', margin: 0, lineHeight: 1.6 }}>
                    {ann.content}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                  <button
                    onClick={() => openEdit(ann)}
                    style={{ background: 'rgba(167, 139, 250, 0.12)', border: '1px solid rgba(167, 139, 250, 0.25)', color: '#A78BFA', padding: '6px 10px', borderRadius: '8px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: '600' }}
                    title="Edit announcement"
                  >
                    <Edit2 size={13} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(ann.id)}
                    style={{ background: 'rgba(239, 68, 68, 0.15)', border: 'none', color: '#F87171', padding: '6px 10px', borderRadius: '8px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}
                    title="Delete circular"
                  >
                    <Trash2 size={13} /> Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal */}
        {showModal && (
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
                maxWidth: '480px',
                background: '#0F172A',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                borderRadius: '20px',
                padding: '28px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#FFFFFF', margin: 0 }}>
                  {editAnn ? 'Edit Announcement' : 'Broadcast University Circular'}
                </h3>
                <button onClick={closeModal} style={{ background: 'transparent', border: 'none', color: '#64748B', cursor: 'pointer' }}>
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#CBD5E1', display: 'block', marginBottom: '4px' }}>Circular Headline *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. VTU 2022 Scheme Semester 6 Exam Timetable Announced"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    style={{ width: '100%', background: '#0B1020', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '10px', color: '#FFF' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#CBD5E1', display: 'block', marginBottom: '4px' }}>Circular Content *</label>
                  <textarea
                    rows={4}
                    required
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Detailed notice text..."
                    style={{ width: '100%', background: '#0B1020', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '10px', color: '#FFF', resize: 'none' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                  <button
                    type="button"
                    onClick={closeModal}
                    style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#94A3B8', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{ background: '#EF4444', border: 'none', color: '#FFF', padding: '8px 20px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}
                  >
                    {editAnn ? 'Update Circular' : 'Publish Circular'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
};
