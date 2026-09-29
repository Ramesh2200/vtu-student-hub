import React, { useState, useEffect } from 'react';
import { Megaphone, Plus, Trash2, Edit2, X } from 'lucide-react';
import { api } from '../../services/api';
import { AdminLayout } from './AdminLayout';

export const AdvertisementManagementPage = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editAd, setEditAd] = useState(null);
  const [newAd, setNewAd] = useState({
    title: '',
    description: '',
    imageUrl: '',
    targetUrl: '',
    startDate: '2026-09-01',
    endDate: '2026-12-31',
    active: true
  });

  useEffect(() => {
    loadAds();
  }, []);

  const loadAds = async () => {
    try {
      setLoading(true);
      const data = await api.admin.getAds();
      setAds(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      if (editAd) {
        await api.admin.updateAd(editAd.id, newAd);
        setAds((prev) => prev.map((a) => (a.id === editAd.id ? { ...a, ...newAd } : a)));
      } else {
        const created = await api.admin.createAd(newAd);
        setAds((prev) => [...prev, created]);
      }
      closeModal();
    } catch (err) {
      alert(err.message || 'Failed to save advertisement');
    }
  };

  const openEdit = (ad) => {
    setEditAd(ad);
    setNewAd({
      title: ad.title || '',
      description: ad.description || '',
      imageUrl: ad.imageUrl || '',
      targetUrl: ad.targetUrl || '',
      startDate: ad.startDate || '2026-09-01',
      endDate: ad.endDate || '2026-12-31',
      active: ad.active !== false
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditAd(null);
    setNewAd({ title: '', description: '', imageUrl: '', targetUrl: '', startDate: '2026-09-01', endDate: '2026-12-31', active: true });
  };

  const handleToggleActive = async (ad) => {
    try {
      await api.admin.updateAd(ad.id, { ...ad, active: !ad.active });
      setAds((prev) => prev.map((a) => (a.id === ad.id ? { ...a, active: !ad.active } : a)));
    } catch (err) {
      alert(err.message || 'Failed to toggle status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete advertisement banner?')) return;
    try {
      await api.admin.deleteAd(id);
      setAds((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      alert(err.message || 'Delete failed');
    }
  };

  return (
    <AdminLayout>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '900', color: '#F8FAFC', margin: 0 }}>
              Sponsored Advertisements Control
            </h1>
            <p style={{ fontSize: '13px', color: '#94A3B8', margin: '4px 0 0' }}>
              Manage educational sponsorships, hackathon promotions, and graduate certifications.
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
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
            <Plus size={16} /> Add Advertisement
          </button>
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
                <th style={{ padding: '16px 20px', fontWeight: '700' }}>Ad Campaign Title</th>
                <th style={{ padding: '16px 20px', fontWeight: '700' }}>Target Link</th>
                <th style={{ padding: '16px 20px', fontWeight: '700' }}>Schedule</th>
                <th style={{ padding: '16px 20px', fontWeight: '700' }}>Status</th>
                <th style={{ padding: '16px 20px', fontWeight: '700', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: '#94A3B8' }}>Loading ads...</td>
                </tr>
              ) : ads.map((ad) => (
                <tr key={ad.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ fontWeight: '800', color: '#F8FAFC' }}>{ad.title}</div>
                    <div style={{ fontSize: '11px', color: '#64748B' }}>{ad.description?.slice(0, 50)}...</div>
                  </td>
                  <td style={{ padding: '16px 20px', color: '#38BDF8' }}>
                    <a href={ad.targetUrl} target="_blank" rel="noreferrer" style={{ color: '#38BDF8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      Link <ExternalLink size={12} />
                    </a>
                  </td>
                  <td style={{ padding: '16px 20px', color: '#94A3B8', fontSize: '12px' }}>
                    {ad.startDate} to {ad.endDate}
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <span style={{ fontSize: '11px', fontWeight: '800', padding: '3px 8px', borderRadius: '6px', background: ad.active ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)', color: ad.active ? '#34D399' : '#F87171' }}>
                      {ad.active ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                  </td>
                  <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                      <button
                        onClick={() => handleToggleActive(ad)}
                        style={{ background: ad.active ? 'rgba(245, 158, 11, 0.12)' : 'rgba(52,211,153,0.12)', border: `1px solid ${ad.active ? 'rgba(245,158,11,0.3)' : 'rgba(52,211,153,0.3)'}`, color: ad.active ? '#FBBF24' : '#34D399', padding: '6px 10px', borderRadius: '8px', cursor: 'pointer', fontSize: '11px', fontWeight: '700' }}
                      >
                        {ad.active ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => openEdit(ad)}
                        style={{ background: 'rgba(167, 139, 250, 0.12)', border: '1px solid rgba(167, 139, 250, 0.25)', color: '#A78BFA', padding: '6px 10px', borderRadius: '8px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: '600' }}
                      >
                        <Edit2 size={13} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(ad.id)}
                        style={{ background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.25)', color: '#F87171', padding: '6px 8px', borderRadius: '8px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
                  {editAd ? 'Edit Advertisement' : 'Add Promotional Sponsorship'}
                </h3>
                <button onClick={closeModal} style={{ background: 'transparent', border: 'none', color: '#64748B', cursor: 'pointer' }}>
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#CBD5E1', display: 'block', marginBottom: '4px' }}>Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. AWS Cloud Practitioner Scholarship"
                    value={newAd.title}
                    onChange={(e) => setNewAd({ ...newAd, title: e.target.value })}
                    style={{ width: '100%', background: '#0B1020', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '10px', color: '#FFF' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#CBD5E1', display: 'block', marginBottom: '4px' }}>Description *</label>
                  <textarea
                    rows={2}
                    required
                    value={newAd.description}
                    onChange={(e) => setNewAd({ ...newAd, description: e.target.value })}
                    style={{ width: '100%', background: '#0B1020', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '10px', color: '#FFF', resize: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#CBD5E1', display: 'block', marginBottom: '4px' }}>Target URL *</label>
                  <input
                    type="url"
                    required
                    placeholder="https://aws.amazon.com/certification"
                    value={newAd.targetUrl}
                    onChange={(e) => setNewAd({ ...newAd, targetUrl: e.target.value })}
                    style={{ width: '100%', background: '#0B1020', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '10px', color: '#FFF' }}
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
                    {editAd ? 'Update Advertisement' : 'Save Advertisement'}
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
