import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Download, FileText, Eye, Clock, CheckCircle } from 'lucide-react';
import { api } from '../../services/api';
import { StudentLayout } from '../../components/StudentLayout';

export const DownloadsPage = () => {
  const [downloads, setDownloads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDownloads();
  }, []);

  const loadDownloads = async () => {
    try {
      setLoading(true);
      const notes = await api.notes.getAll();
      // Use available notes to illustrate download history
      setDownloads(notes.slice(0, 4));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <StudentLayout>
      <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>
        
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '999px', background: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.3)', marginBottom: '8px' }}>
            <Download size={12} color="#38BDF8" />
            <span style={{ fontSize: '11px', fontWeight: '700', color: '#7DD3FC', textTransform: 'uppercase' }}>
              Offline Library
            </span>
          </div>
          <h1 style={{ fontSize: '26px', fontWeight: '900', color: '#F8FAFC', margin: 0 }}>
            Download History
          </h1>
          <p style={{ fontSize: '13px', color: '#94A3B8', margin: '4px 0 0' }}>
            Audit log of official VTU PDF notes and question papers downloaded to your device.
          </p>
        </div>

        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#94A3B8' }}>Loading download records...</div>
        ) : downloads.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', background: 'rgba(15, 23, 42, 0.5)', borderRadius: '20px', color: '#94A3B8' }}>
            <Download size={40} color="#475569" style={{ marginBottom: '12px' }} />
            <p style={{ margin: 0, fontSize: '13px' }}>No downloads recorded yet.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {downloads.map((note, idx) => (
              <div
                key={note.id}
                style={{
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '16px',
                  padding: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', minWidth: 0 }}>
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      background: 'rgba(6, 182, 212, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#22D3EE',
                      flexShrink: 0
                    }}
                  >
                    <Download size={20} />
                  </div>

                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '11px', fontWeight: '800', background: 'rgba(6, 182, 212, 0.2)', color: '#67E8F9', padding: '2px 6px', borderRadius: '4px' }}>
                        Unit {note.unit}
                      </span>
                      <span style={{ fontSize: '11px', color: '#94A3B8' }}>{note.subjectCode || '21CS61'}</span>
                      <span style={{ fontSize: '11px', color: '#10B981', display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <CheckCircle size={11} /> Saved
                      </span>
                    </div>

                    <h4 style={{ fontSize: '15px', fontWeight: '800', color: '#F8FAFC', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {note.title}
                    </h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px', fontSize: '11px', color: '#64748B' }}>
                      <span>{(note.fileSize / 1024).toFixed(0)} KB</span>
                      <span>•</span>
                      <span>Downloaded on: {new Date().toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                  <Link
                    to={`/notes/${note.id}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      background: 'rgba(255, 255, 255, 0.08)',
                      color: '#F8FAFC',
                      padding: '8px 14px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: '700',
                      textDecoration: 'none'
                    }}
                  >
                    <Eye size={14} /> Open
                  </Link>

                  <button
                    onClick={() => api.notes.download(note.id)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      background: 'linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)',
                      border: 'none',
                      color: '#FFFFFF',
                      padding: '8px 14px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    <Download size={14} /> Re-download
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </StudentLayout>
  );
};
