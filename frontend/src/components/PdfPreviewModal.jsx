import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Download,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Bookmark,
  Share2,
  FileText,
  Printer,
  Sun,
  Moon,
  Check
} from 'lucide-react';

export const PdfPreviewModal = () => {
  const { pdfViewerData, setPdfViewerData } = useApp();
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [darkMode, setDarkMode] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!pdfViewerData) return null;

  const totalPages = pdfViewerData.pages || 42;

  const handleDownload = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2000);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(5, 8, 18, 0.92)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      zIndex: 1200
    }}>
      <div style={{
        maxWidth: '1050px',
        width: '100%',
        height: '90vh',
        borderRadius: '20px',
        background: '#0B1020',
        border: '1px solid rgba(108, 92, 231, 0.35)',
        boxShadow: '0 25px 60px rgba(0,0,0,0.9), 0 0 50px rgba(108, 92, 231, 0.2)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* PDF Top Toolbar */}
        <div style={{
          height: '60px',
          background: '#111827',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px',
          gap: '16px'
        }}>
          {/* Doc Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
            <FileText size={20} color="#6C5CE7" />
            <div style={{ minWidth: 0 }}>
              <div style={{
                fontSize: '0.95rem',
                fontWeight: 700,
                color: '#F8FAFC',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {pdfViewerData.title}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
                {pdfViewerData.subject} • Uploaded by {pdfViewerData.author}
              </div>
            </div>
          </div>

          {/* Viewer Tools: Page Navigation & Zoom */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            
            {/* Page navigation */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '8px',
              padding: '4px 8px',
              fontSize: '0.82rem',
              color: '#CBD5E1'
            }}>
              <button
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                style={{ opacity: currentPage <= 1 ? 0.3 : 1 }}
              >
                <ChevronLeft size={16} />
              </button>
              <span>{currentPage} / {totalPages}</span>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                style={{ opacity: currentPage >= totalPages ? 0.3 : 1 }}
              >
                <ChevronRight size={16} />
              </button>
            </div>

            {/* Zoom Controls */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '8px',
              padding: '4px 8px',
              fontSize: '0.82rem',
              color: '#CBD5E1'
            }}>
              <button onClick={() => setZoomLevel(z => Math.max(75, z - 25))}>
                <ZoomOut size={16} />
              </button>
              <span>{zoomLevel}%</span>
              <button onClick={() => setZoomLevel(z => Math.min(175, z + 25))}>
                <ZoomIn size={16} />
              </button>
            </div>

            {/* Invert Reading Theme */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              style={{
                padding: '6px 10px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.05)',
                color: '#CBD5E1'
              }}
              title="Toggle reading mode contrast"
            >
              {darkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* Download Button */}
            <button
              onClick={handleDownload}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '8px',
                background: downloadSuccess ? '#10B981' : '#6C5CE7',
                color: '#FFFFFF',
                fontSize: '0.82rem',
                fontWeight: 600
              }}
            >
              {downloadSuccess ? <Check size={14} /> : <Download size={14} />}
              <span>{downloadSuccess ? 'Saved' : 'Download'}</span>
            </button>

            {/* Close */}
            <button
              onClick={() => setPdfViewerData(null)}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.08)',
                color: '#CBD5E1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X size={18} />
            </button>

          </div>
        </div>

        {/* PDF Simulated Document Canvas */}
        <div style={{
          flex: 1,
          background: '#070B16',
          overflowY: 'auto',
          display: 'flex',
          justifyContent: 'center',
          padding: '40px 20px'
        }}>
          <div style={{
            width: `${(zoomLevel / 100) * 720}px`,
            minHeight: `${(zoomLevel / 100) * 980}px`,
            background: darkMode ? '#1A233A' : '#FFFFFF',
            color: darkMode ? '#F8FAFC' : '#0F172A',
            borderRadius: '8px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
            padding: '48px',
            fontFamily: 'Georgia, serif',
            lineHeight: 1.7,
            transition: 'all 0.2s',
            userSelect: 'text'
          }}>
            {/* Header in doc */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              borderBottom: `2px solid ${darkMode ? '#334155' : '#E2E8F0'}`,
              paddingBottom: '16px',
              marginBottom: '28px',
              fontSize: '0.75rem',
              color: darkMode ? '#94A3B8' : '#64748B',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              <span>VTU Examination Syllabus Notes • 2022 Scheme</span>
              <span>{pdfViewerData.subject}</span>
            </div>

            {/* Document Title */}
            <h1 style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '1.6rem',
              fontWeight: 800,
              color: darkMode ? '#F8FAFC' : '#0F172A',
              marginBottom: '12px'
            }}>
              {pdfViewerData.title}
            </h1>

            <div style={{
              fontSize: '0.85rem',
              color: darkMode ? '#A78BFA' : '#6C5CE7',
              fontWeight: 600,
              marginBottom: '24px'
            }}>
              Module {pdfViewerData.moduleNumber || 1} • Comprehensive Curated Unit Notes
            </div>

            {/* Simulated Content Snippet & Diagrams */}
            <div style={{ fontSize: '0.95rem', marginBottom: '24px' }}>
              <p style={{ marginBottom: '16px' }}>
                {pdfViewerData.contentSnippet || 'Cloud Computing represents the convergence of distributed computing, virtualization, and utility infrastructure delivery. As per NIST Special Publication 800-145, cloud architecture is defined across five essential characteristics, three service delivery models, and four deployment strategies.'}
              </p>

              <h3 style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: '1.15rem',
                fontWeight: 700,
                marginTop: '24px',
                marginBottom: '12px',
                color: darkMode ? '#E2E8F0' : '#1E293B'
              }}>
                1. Architectural Block Diagram
              </h3>

              {/* Architectural Block Diagram in doc */}
              <div style={{
                background: darkMode ? '#0F172A' : '#F1F5F9',
                border: `1px solid ${darkMode ? '#334155' : '#CBD5E1'}`,
                borderRadius: '8px',
                padding: '24px',
                margin: '16px 0 24px',
                textAlign: 'center',
                fontFamily: 'monospace',
                fontSize: '0.82rem'
              }}>
                <div style={{
                  padding: '10px',
                  background: '#6C5CE7',
                  color: '#FFFFFF',
                  borderRadius: '6px',
                  display: 'inline-block',
                  marginBottom: '10px'
                }}>
                  Cloud Application Layer (SaaS: Salesforce, Google Workspace)
                </div>
                <div style={{ color: darkMode ? '#94A3B8' : '#64748B' }}>↓ APIs & SDKs</div>
                <div style={{
                  padding: '10px',
                  background: '#4F8CFF',
                  color: '#FFFFFF',
                  borderRadius: '6px',
                  display: 'inline-block',
                  margin: '10px 0'
                }}>
                  Platform Execution Layer (PaaS: AWS Elastic Beanstalk, Heroku)
                </div>
                <div style={{ color: darkMode ? '#94A3B8' : '#64748B' }}>↓ Hypervisor Abstraction</div>
                <div style={{
                  padding: '10px',
                  background: '#22D3EE',
                  color: '#0F172A',
                  fontWeight: 700,
                  borderRadius: '6px',
                  display: 'inline-block'
                }}>
                  Infrastructure Layer (IaaS: AWS EC2, S3, Azure VMs, VPC)
                </div>
              </div>

              <h3 style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: '1.15rem',
                fontWeight: 700,
                marginTop: '24px',
                marginBottom: '12px',
                color: darkMode ? '#E2E8F0' : '#1E293B'
              }}>
                2. Key Examination Focus Points (VTU 10-Mark Questions)
              </h3>
              <ul style={{ paddingLeft: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li>Compare Type-1 Bare Metal Hypervisors (Xen, VMware ESXi) versus Type-2 Hosted Hypervisors (VirtualBox, KVM).</li>
                <li>Differentiate between Horizontal Auto-Scaling and Vertical Scaling in enterprise cluster configurations.</li>
                <li>Analyze the Service Level Agreement (SLA) contract clauses regarding 99.99% system availability.</li>
              </ul>
            </div>

            {/* Document Footer */}
            <div style={{
              marginTop: '48px',
              paddingTop: '16px',
              borderTop: `1px solid ${darkMode ? '#334155' : '#E2E8F0'}`,
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '0.72rem',
              color: darkMode ? '#64748B' : '#94A3B8'
            }}>
              <span>VTU Student Connect Official Archive</span>
              <span>Page {currentPage} of {totalPages}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
