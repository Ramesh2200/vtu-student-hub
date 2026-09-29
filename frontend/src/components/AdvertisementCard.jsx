import React from 'react';
import { ExternalLink, Sparkles } from 'lucide-react';
import { api } from '../services/api';

export const AdvertisementCard = ({ ad, className = '' }) => {
  if (!ad) return null;

  const handleClick = () => {
    if (ad.id) {
      api.ads.recordClick(ad.id);
    }
    if (ad.targetUrl) {
      window.open(ad.targetUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`relative group overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-[#1E1B4B]/60 to-[#0F172A]/80 p-4 transition-all duration-300 hover:border-purple-500/40 hover:shadow-lg hover:shadow-purple-500/10 cursor-pointer ${className}`}
      style={{
        background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.45) 0%, rgba(15, 23, 42, 0.8) 100%)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(139, 92, 246, 0.25)',
        borderRadius: '16px',
        padding: '16px',
        margin: '12px 0'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <span
          style={{
            fontSize: '11px',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            padding: '2px 8px',
            borderRadius: '9999px',
            background: 'rgba(124, 58, 237, 0.2)',
            color: '#A78BFA',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <Sparkles size={11} /> Sponsored Opportunity
        </span>
        <ExternalLink size={13} style={{ color: '#94A3B8' }} />
      </div>

      {ad.imageUrl && (
        <div style={{ width: '100%', height: '110px', borderRadius: '10px', overflow: 'hidden', marginBottom: '10px', position: 'relative' }}>
          <img
            src={ad.imageUrl}
            alt={ad.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
          />
        </div>
      )}

      <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#F8FAFC', marginBottom: '4px', lineHeight: '1.3' }}>
        {ad.title}
      </h4>
      <p style={{ fontSize: '12px', color: '#94A3B8', marginBottom: '12px', lineHeight: '1.4' }}>
        {ad.description}
      </p>

      <button
        type="button"
        style={{
          width: '100%',
          padding: '8px 12px',
          background: 'linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)',
          color: '#FFFFFF',
          fontSize: '12px',
          fontWeight: '600',
          borderRadius: '8px',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px'
        }}
      >
        Learn More &amp; Register <ExternalLink size={12} />
      </button>
    </div>
  );
};
