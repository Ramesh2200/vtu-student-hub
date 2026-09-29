import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, FileText, Download, Eye, Trash2, Sparkles, BookOpen } from 'lucide-react';
import { api } from '../../services/api';
import { StudentLayout } from '../../components/StudentLayout';

export const BookmarksPage = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = async () => {
    try {
      setLoading(true);
      const data = await api.bookmarks.getAll();
      setBookmarks(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const removeBookmark = async (id, resourceId) => {
    try {
      await api.bookmarks.toggle('NOTE', resourceId || id);
      setBookmarks((prev) => prev.filter((b) => b.id !== id && b.resourceId !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <StudentLayout>
      <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>
        
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '999px', background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.3)', marginBottom: '8px' }}>
            <Bookmark size={12} color="#FBBF24" fill="#FBBF24" />
            <span style={{ fontSize: '11px', fontWeight: '700', color: '#FDE68A', textTransform: 'uppercase' }}>
              Saved Library
            </span>
          </div>
          <h1 style={{ fontSize: '26px', fontWeight: '900', color: '#F8FAFC', margin: 0 }}>
            Bookmarked Academic Notes
          </h1>
          <p style={{ fontSize: '13px', color: '#94A3B8', margin: '4px 0 0' }}>
            Quick access to your curated revision sheets, formula handbooks, and faculty notes.
          </p>
        </div>

        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#94A3B8' }}>Loading bookmarks...</div>
        ) : bookmarks.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', background: 'rgba(15, 23, 42, 0.5)', borderRadius: '20px', color: '#94A3B8' }}>
            <Bookmark size={40} color="#475569" style={{ marginBottom: '12px' }} />
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#F8FAFC', margin: '0 0 6px 0' }}>No bookmarks yet</h3>
            <p style={{ fontSize: '13px', color: '#64748B', margin: '0 0 16px 0' }}>Click the bookmark icon on any note to save it here for fast revision.</p>
            <Link to="/notes" style={{ color: '#38BDF8', fontSize: '13px', fontWeight: '700', textDecoration: 'none' }}>
              Browse Notes →
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {bookmarks.map((note) => (
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
                      background: 'rgba(124, 58, 237, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#A78BFA',
                      flexShrink: 0
                    }}
                  >
                    <FileText size={22} />
                  </div>

                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '11px', fontWeight: '800', background: 'rgba(124, 58, 237, 0.2)', color: '#C4B5FD', padding: '2px 6px', borderRadius: '4px' }}>
                        Unit {note.unit}
                      </span>
                      <span style={{ fontSize: '11px', color: '#38BDF8', fontWeight: '700' }}>{note.subjectCode || '21CS61'}</span>
                    </div>

                    <h4 style={{ fontSize: '15px', fontWeight: '800', color: '#F8FAFC', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {note.title}
                    </h4>
                    <p style={{ fontSize: '12px', color: '#94A3B8', margin: '4px 0 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {note.description}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                  <Link
                    to={`/notes/${note.resourceId || note.id}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      background: 'rgba(255, 255, 255, 0.08)',
                      color: '#F8FAFC',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: '700',
                      textDecoration: 'none'
                    }}
                  >
                    <Eye size={14} /> Read
                  </Link>

                  <button
                    onClick={() => removeBookmark(note.id, note.resourceId)}
                    style={{
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid rgba(239, 68, 68, 0.25)',
                      color: '#F87171',
                      padding: '8px',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                    title="Remove from bookmarks"
                  >
                    <Trash2 size={15} />
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
