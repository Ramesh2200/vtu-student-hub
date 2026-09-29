import React, { useState } from 'react';
import { Settings, Shield, Database, HardDrive, Key, Save, CheckCircle } from 'lucide-react';
import { AdminLayout } from './AdminLayout';

export const AdminSettingsPage = () => {
  const [settings, setSettings] = useState({
    sessionTimeoutMins: 120,
    maxUploadSizeMb: 20,
    allowRegistration: true,
    chatAutoModeration: true,
    dbPoolSize: 10,
    enforceBcryptRounds: 12
  });
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <AdminLayout>
      <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '900', color: '#F8FAFC', margin: 0 }}>
            System & Security Settings
          </h1>
          <p style={{ fontSize: '13px', color: '#94A3B8', margin: '4px 0 0' }}>
            Configure server-side security policies, Jakarta Servlet session boundaries, and storage limits.
          </p>
        </div>

        {saved && (
          <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '12px', padding: '14px', color: '#34D399', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle size={18} />
            <span>System configuration parameters persisted successfully.</span>
          </div>
        )}

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Security & Authentication */}
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.65)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '20px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#EF4444', fontWeight: '800', fontSize: '15px' }}>
              <Shield size={18} /> Authentication & Security Filters
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#CBD5E1', display: 'block', marginBottom: '6px' }}>
                  Session Timeout (Minutes)
                </label>
                <input
                  type="number"
                  value={settings.sessionTimeoutMins}
                  onChange={(e) => setSettings({ ...settings, sessionTimeoutMins: Number(e.target.value) })}
                  style={{ width: '100%', background: '#0B1020', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '10px', color: '#FFF' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#CBD5E1', display: 'block', marginBottom: '6px' }}>
                  BCrypt Salt Work Factor
                </label>
                <input
                  type="number"
                  value={settings.enforceBcryptRounds}
                  onChange={(e) => setSettings({ ...settings, enforceBcryptRounds: Number(e.target.value) })}
                  style={{ width: '100%', background: '#0B1020', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '10px', color: '#FFF' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px' }}>
              <input
                type="checkbox"
                id="allowReg"
                checked={settings.allowRegistration}
                onChange={(e) => setSettings({ ...settings, allowRegistration: e.target.checked })}
              />
              <label htmlFor="allowReg" style={{ fontSize: '13px', color: '#F8FAFC', fontWeight: '600', cursor: 'pointer' }}>
                Allow public student self-registration
              </label>
            </div>
          </div>

          {/* Storage & Database */}
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.65)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '20px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38BDF8', fontWeight: '800', fontSize: '15px' }}>
              <Database size={18} /> Storage & Database Connection Pool
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#CBD5E1', display: 'block', marginBottom: '6px' }}>
                  Max PDF Upload Limit (MB)
                </label>
                <input
                  type="number"
                  value={settings.maxUploadSizeMb}
                  onChange={(e) => setSettings({ ...settings, maxUploadSizeMb: Number(e.target.value) })}
                  style={{ width: '100%', background: '#0B1020', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '10px', color: '#FFF' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#CBD5E1', display: 'block', marginBottom: '6px' }}>
                  HikariCP Maximum Pool Size
                </label>
                <input
                  type="number"
                  value={settings.dbPoolSize}
                  onChange={(e) => setSettings({ ...settings, dbPoolSize: Number(e.target.value) })}
                  style={{ width: '100%', background: '#0B1020', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '10px', color: '#FFF' }}
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="submit"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                border: 'none',
                color: '#FFFFFF',
                padding: '12px 24px',
                borderRadius: '12px',
                fontSize: '13px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              <Save size={16} /> Save System Settings
            </button>
          </div>

        </form>

      </div>
    </AdminLayout>
  );
};
