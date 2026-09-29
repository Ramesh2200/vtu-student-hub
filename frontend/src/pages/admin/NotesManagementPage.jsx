import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  UploadCloud,
  Eye,
  Trash2,
  CheckCircle,
  XCircle,
  Download,
  Search,
  Filter,
  Layers
} from 'lucide-react';
import { api } from '../../services/api';
import { AdminLayout } from './AdminLayout';

export const NotesManagementPage = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      setLoading(true);
      const data = await api.admin.getNotes();
      setNotes(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublish = async (note) => {
    const newStatus = note.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    try {
      await api.admin.updateNote(note.id, { status: newStatus });
      setNotes((prev) =>
        prev.map((n) => (n.id === note.id ? { ...n, status: newStatus } : n))
      );
    } catch (err) {
      alert(err.message || 'Failed to update note status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this official PDF note? This will also remove the physical file safely.')) return;
    try {
      await api.admin.deleteNote(id);
      setNotes((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      alert(err.message || 'Failed to delete note');
    }
  };

  const filtered = notes.filter((n) => {
    const q = searchQuery.toLowerCase();
    return !q || n.title?.toLowerCase().includes(q) || n.subjectCode?.toLowerCase().includes(q);
  });

  return (
    <AdminLayout>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '900', color: '#F8FAFC', margin: 0 }}>
              Official Notes Catalog & PDF Control
            </h1>
            <p style={{ fontSize: '13px', color: '#94A3B8', margin: '4px 0 0' }}>
              Publish, unpublish, replace, or delete verified faculty lecture materials.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <Link
              to="/admin/notes/upload"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                color: '#FFFFFF',
                padding: '10px 18px',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: '700',
                textDecoration: 'none'
              }}
            >
              <UploadCloud size={16} /> Upload Notes PDF
            </Link>
          </div>
        </div>

        {/* Table */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.65)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '20px',
            overflow: 'hidden'
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: 'rgba(255, 255, 255, 0.03)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#94A3B8' }}>
                <th style={{ padding: '16px 20px', fontWeight: '700' }}>Note ID & Title</th>
                <th style={{ padding: '16px 20px', fontWeight: '700' }}>Subject / Unit</th>
                <th style={{ padding: '16px 20px', fontWeight: '700' }}>File Info</th>
                <th style={{ padding: '16px 20px', fontWeight: '700' }}>Downloads</th>
                <th style={{ padding: '16px 20px', fontWeight: '700' }}>Status</th>
                <th style={{ padding: '16px 20px', fontWeight: '700', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: '#94A3B8' }}>Loading notes catalog...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: '#94A3B8' }}>No notes found.</td>
                </tr>
              ) : (
                filtered.map((note) => (
                  <tr key={note.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ fontWeight: '700', color: '#F8FAFC' }}>{note.title}</div>
                      <div style={{ fontSize: '11px', color: '#64748B' }}>ID: #{note.id} • {note.fileName}</div>
                    </td>

                    <td style={{ padding: '16px 20px' }}>
                      <span style={{ fontSize: '11px', fontWeight: '800', background: 'rgba(6, 182, 212, 0.15)', color: '#22D3EE', padding: '2px 6px', borderRadius: '4px' }}>
                        {note.subjectCode || '21CS61'}
                      </span>
                      <span style={{ fontSize: '11px', color: '#C4B5FD', marginLeft: '6px', fontWeight: '700' }}>
                        Unit {note.unit}
                      </span>
                    </td>

                    <td style={{ padding: '16px 20px', color: '#CBD5E1', fontSize: '12px' }}>
                      {(note.fileSize / 1024).toFixed(0)} KB PDF
                    </td>

                    <td style={{ padding: '16px 20px', color: '#34D399', fontWeight: '800' }}>
                      {note.downloadCount || 0}
                    </td>

                    <td style={{ padding: '16px 20px' }}>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: '800',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          background: note.status === 'PUBLISHED' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                          color: note.status === 'PUBLISHED' ? '#34D399' : '#FBBF24'
                        }}
                      >
                        {note.status || 'PUBLISHED'}
                      </span>
                    </td>

                    <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        <button
                          onClick={() => handleTogglePublish(note)}
                          style={{
                            background: 'rgba(255, 255, 255, 0.08)',
                            border: 'none',
                            color: '#CBD5E1',
                            padding: '6px 10px',
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontWeight: '700',
                            cursor: 'pointer'
                          }}
                        >
                          {note.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}
                        </button>

                        <button
                          onClick={() => handleDelete(note.id)}
                          style={{
                            background: 'rgba(239, 68, 68, 0.15)',
                            border: 'none',
                            color: '#F87171',
                            padding: '6px 8px',
                            borderRadius: '6px',
                            cursor: 'pointer'
                          }}
                          title="Delete Note"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>
    </AdminLayout>
  );
};
