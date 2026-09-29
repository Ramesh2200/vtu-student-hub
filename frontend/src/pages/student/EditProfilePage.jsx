import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Save, ArrowLeft, CheckCircle } from 'lucide-react';
import { api, authStorage } from '../../services/api';
import { StudentLayout } from '../../components/StudentLayout';

export const EditProfilePage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    usn: '',
    college: '',
    branch: '',
    semester: 6,
    graduationYear: 2025,
    skills: '',
    bio: ''
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await api.profile.get();
      if (data) {
        setFormData({
          fullName: data.fullName || '',
          phone: data.phone || '',
          usn: data.usn || '',
          college: data.college || '',
          branch: data.branch || '',
          semester: data.semester || 6,
          graduationYear: data.graduationYear || 2025,
          skills: data.skills || '',
          bio: data.bio || ''
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await api.profile.update(formData);
      // Update local storage user profile
      const u = authStorage.getUser() || {};
      u.profile = { ...(u.profile || {}), ...formData };
      authStorage.setAuth(u, authStorage.getToken(), authStorage.getRole());

      setSaved(true);
      setTimeout(() => navigate('/profile'), 1200);
    } catch (err) {
      alert(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <StudentLayout>
      <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => navigate('/profile')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#F8FAFC',
              padding: '8px 14px',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            <ArrowLeft size={16} /> Back to Profile
          </button>
          <span style={{ color: '#475569' }}>/</span>
          <span style={{ color: '#38BDF8', fontSize: '13px', fontWeight: '700' }}>
            Edit Profile
          </span>
        </div>

        <div
          style={{
            background: 'rgba(15, 23, 42, 0.7)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '24px',
            padding: '36px'
          }}
        >
          <h1 style={{ fontSize: '24px', fontWeight: '900', color: '#F8FAFC', margin: '0 0 8px 0' }}>
            Edit Student Profile
          </h1>
          <p style={{ fontSize: '13px', color: '#94A3B8', margin: '0 0 24px 0' }}>
            Update your academic details, contact information, and technical skill tags.
          </p>

          {saved ? (
            <div style={{ textAlign: 'center', padding: '36px' }}>
              <CheckCircle size={44} color="#34D399" style={{ marginBottom: '10px' }} />
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#FFFFFF', margin: 0 }}>Profile Updated Successfully!</h3>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#CBD5E1', marginBottom: '6px' }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      background: 'rgba(11, 16, 32, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '10px',
                      padding: '12px',
                      color: '#FFFFFF',
                      fontSize: '13px',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#CBD5E1', marginBottom: '6px' }}>
                    Phone Number
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      background: 'rgba(11, 16, 32, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '10px',
                      padding: '12px',
                      color: '#FFFFFF',
                      fontSize: '13px',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#CBD5E1', marginBottom: '6px' }}>
                    VTU Seat Number (USN) *
                  </label>
                  <input
                    type="text"
                    required
                    name="usn"
                    value={formData.usn}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      background: 'rgba(11, 16, 32, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '10px',
                      padding: '12px',
                      color: '#FFFFFF',
                      fontSize: '13px',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#CBD5E1', marginBottom: '6px' }}>
                    College / Institution
                  </label>
                  <input
                    type="text"
                    name="college"
                    value={formData.college}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      background: 'rgba(11, 16, 32, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '10px',
                      padding: '12px',
                      color: '#FFFFFF',
                      fontSize: '13px',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px 120px', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#CBD5E1', marginBottom: '6px' }}>
                    Branch
                  </label>
                  <input
                    type="text"
                    name="branch"
                    value={formData.branch}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      background: 'rgba(11, 16, 32, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '10px',
                      padding: '12px',
                      color: '#FFFFFF',
                      fontSize: '13px',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#CBD5E1', marginBottom: '6px' }}>
                    Semester
                  </label>
                  <select
                    name="semester"
                    value={formData.semester}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      background: 'rgba(11, 16, 32, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '10px',
                      padding: '12px',
                      color: '#FFFFFF',
                      fontSize: '13px',
                      outline: 'none'
                    }}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                      <option key={s} value={s}>Sem {s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#CBD5E1', marginBottom: '6px' }}>
                    Grad Year
                  </label>
                  <input
                    type="number"
                    name="graduationYear"
                    value={formData.graduationYear}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      background: 'rgba(11, 16, 32, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '10px',
                      padding: '12px',
                      color: '#FFFFFF',
                      fontSize: '13px',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#CBD5E1', marginBottom: '6px' }}>
                  Technical Skills (comma separated)
                </label>
                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder="Java, Python, MySQL, React, Spring Boot"
                  style={{
                    width: '100%',
                    background: 'rgba(11, 16, 32, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '10px',
                    padding: '12px',
                    color: '#FFFFFF',
                    fontSize: '13px',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#CBD5E1', marginBottom: '6px' }}>
                  Student Bio / Career Summary
                </label>
                <textarea
                  rows={3}
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    background: 'rgba(11, 16, 32, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '10px',
                    padding: '12px',
                    color: '#FFFFFF',
                    fontSize: '13px',
                    outline: 'none',
                    resize: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => navigate('/profile')}
                  style={{
                    background: 'transparent',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#94A3B8',
                    padding: '10px 18px',
                    borderRadius: '10px',
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)',
                    border: 'none',
                    color: '#FFFFFF',
                    padding: '10px 24px',
                    borderRadius: '10px',
                    fontSize: '13px',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  <Save size={16} /> {saving ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>
          )}

        </div>

      </div>
    </StudentLayout>
  );
};
