import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  MapPin,
  DollarSign,
  Calendar,
  Sparkles,
  Search,
  Filter,
  CheckCircle,
  Clock,
  ArrowRight,
  ExternalLink,
  Building,
  FileText,
  Upload,
  Download,
  Eye,
  X,
  Send,
  Check,
  AlertCircle,
  FileUp,
  Award
} from 'lucide-react';
import { api } from '../../services/api';
import { StudentLayout } from '../../components/StudentLayout';

export const PlacementsPage = () => {
  const [placements, setPlacements] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('ALL');

  // Resume state
  const [resumeInfo, setResumeInfo] = useState(null);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [resumeMessage, setResumeMessage] = useState(null);
  const resumeInputRef = useRef(null);

  // Application Modal state
  const [applyModalPlacement, setApplyModalPlacement] = useState(null);
  const [resumeSource, setResumeSource] = useState('saved'); // 'saved' | 'upload' | 'link'
  const [applyFile, setApplyFile] = useState(null);
  const [applyLink, setApplyLink] = useState('');
  const [applyNotes, setApplyNotes] = useState('');
  const [submittingApply, setSubmittingApply] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);
  const [applyError, setApplyError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [placRes, appsRes, resumeRes] = await Promise.allSettled([
        api.placements.getAll({ activeOnly: true }),
        api.placements.getMyApplications(),
        api.placements.getMyResume()
      ]);

      if (placRes.status === 'fulfilled' && Array.isArray(placRes.value)) {
        setPlacements(placRes.value);
      }
      if (appsRes.status === 'fulfilled' && Array.isArray(appsRes.value)) {
        setMyApplications(appsRes.value);
      }
      if (resumeRes.status === 'fulfilled' && resumeRes.value) {
        setResumeInfo(resumeRes.value);
      }
    } catch (err) {
      console.error('Failed to load placement data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleResumeFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setResumeMessage({ type: 'error', text: 'Only PDF documents are supported for resume upload.' });
      setTimeout(() => setResumeMessage(null), 4000);
      return;
    }

    try {
      setUploadingResume(true);
      setResumeMessage(null);
      const res = await api.placements.uploadResume(file);
      setResumeInfo({
        hasResume: true,
        resumeLink: res.filePath,
        fileName: res.fileName,
        storedFileName: res.storedFileName,
        viewUrl: res.viewUrl,
        downloadUrl: res.downloadUrl
      });
      setResumeMessage({ type: 'success', text: `Resume "${file.name}" uploaded and active!` });
      setTimeout(() => setResumeMessage(null), 4000);
    } catch (err) {
      setResumeMessage({ type: 'error', text: err.message || 'Failed to upload resume. Please try again.' });
      setTimeout(() => setResumeMessage(null), 4000);
    } finally {
      setUploadingResume(false);
      if (resumeInputRef.current) resumeInputRef.current.value = '';
    }
  };

  const openApplyModal = (plc) => {
    setApplyModalPlacement(plc);
    setApplySuccess(false);
    setApplyError(null);
    setApplyNotes('');
    setApplyFile(null);
    setApplyLink(resumeInfo?.resumeLink || '');
    setResumeSource(resumeInfo?.hasResume ? 'saved' : 'upload');
  };

  const closeApplyModal = () => {
    setApplyModalPlacement(null);
    setApplySuccess(false);
    setApplyError(null);
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (!applyModalPlacement) return;

    setSubmittingApply(true);
    setApplyError(null);

    try {
      let finalResumeLink = '';

      if (resumeSource === 'upload') {
        if (!applyFile) {
          throw new Error('Please select a PDF resume file to upload.');
        }
        const uploadRes = await api.placements.uploadResume(applyFile);
        finalResumeLink = uploadRes.filePath;
        setResumeInfo({
          hasResume: true,
          resumeLink: uploadRes.filePath,
          fileName: uploadRes.fileName,
          storedFileName: uploadRes.storedFileName
        });
      } else if (resumeSource === 'link') {
        if (!applyLink || !applyLink.trim()) {
          throw new Error('Please enter a valid resume URL (Google Drive / GitHub / Portfolio).');
        }
        finalResumeLink = applyLink.trim();
      } else {
        // saved
        finalResumeLink = resumeInfo?.resumeLink || '/uploads/resumes/VTU_Student_Resume.pdf';
      }

      await api.placements.apply(applyModalPlacement.id, {
        resumeLink: finalResumeLink,
        notes: applyNotes
      });

      // Update local state immediately
      const newApp = {
        placementId: applyModalPlacement.id,
        companyName: applyModalPlacement.companyName,
        jobRole: applyModalPlacement.jobRole,
        status: 'APPLIED',
        appliedAt: new Date().toISOString(),
        resumeLink: finalResumeLink,
        notes: applyNotes
      };
      setMyApplications((prev) => [newApp, ...prev.filter((a) => a.placementId !== applyModalPlacement.id)]);

      setApplySuccess(true);
      setTimeout(() => {
        closeApplyModal();
      }, 2000);
    } catch (err) {
      setApplyError(err.message || 'Application submission failed. Please try again.');
    } finally {
      setSubmittingApply(false);
    }
  };

  const appliedMap = new Map(myApplications.map((app) => [app.placementId, app]));

  const filteredPlacements = placements.filter((p) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      !query ||
      p.companyName?.toLowerCase().includes(query) ||
      p.jobRole?.toLowerCase().includes(query) ||
      p.location?.toLowerCase().includes(query) ||
      p.requiredSkills?.toLowerCase().includes(query);

    const matchesBatch = selectedBatch === 'ALL' || p.batch === selectedBatch;

    return matchesSearch && matchesBatch;
  });

  return (
    <StudentLayout>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>
        
        {/* Header Banner */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '999px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', marginBottom: '8px' }}>
              <Sparkles size={12} color="#34D399" />
              <span style={{ fontSize: '11px', fontWeight: '700', color: '#6EE7B7', textTransform: 'uppercase' }}>
                VTU Central Placement Cell
              </span>
            </div>
            <h1 style={{ fontSize: '28px', fontWeight: '900', color: '#F8FAFC', margin: 0 }}>
              Campus Placement Drives & Applications
            </h1>
            <p style={{ fontSize: '14px', color: '#94A3B8', margin: '6px 0 0' }}>
              Manage your verified student resume and submit applications directly to top tier IT and core multinational companies.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: '800', background: 'rgba(16, 185, 129, 0.15)', color: '#34D399', padding: '10px 18px', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.3)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle size={15} /> {myApplications.length} Drives Applied
            </span>
          </div>
        </div>

        {/* RESUME MANAGEMENT HUB CARD */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(15, 23, 42, 0.85) 100%)',
            border: '1px solid rgba(16, 185, 129, 0.35)',
            borderRadius: '20px',
            padding: '24px 28px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '20px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            <div
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                boxShadow: '0 6px 18px rgba(16, 185, 129, 0.4)'
              }}
            >
              <FileText size={28} />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '900', color: '#F8FAFC', margin: 0 }}>
                  Candidate Placement Resume
                </h3>
                {resumeInfo?.hasResume ? (
                  <span style={{ fontSize: '11px', fontWeight: '800', background: 'rgba(16, 185, 129, 0.25)', color: '#34D399', padding: '2px 8px', borderRadius: '6px', border: '1px solid rgba(16, 185, 129, 0.4)' }}>
                    Active & Ready
                  </span>
                ) : (
                  <span style={{ fontSize: '11px', fontWeight: '800', background: 'rgba(234, 179, 8, 0.2)', color: '#FACC15', padding: '2px 8px', borderRadius: '6px' }}>
                    Standard VTU Format
                  </span>
                )}
              </div>

              <p style={{ fontSize: '13px', color: '#94A3B8', margin: 0 }}>
                {resumeInfo?.fileName ? (
                  <span>
                    Uploaded file: <strong style={{ color: '#E2E8F0' }}>{resumeInfo.fileName}</strong> (One-click apply enabled)
                  </span>
                ) : (
                  'Upload your updated PDF resume to auto-attach on all campus drive applications.'
                )}
              </p>

              {resumeMessage && (
                <div
                  style={{
                    fontSize: '12px',
                    fontWeight: '700',
                    marginTop: '8px',
                    color: resumeMessage.type === 'success' ? '#34D399' : '#F87171'
                  }}
                >
                  {resumeMessage.text}
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <input
              type="file"
              ref={resumeInputRef}
              accept=".pdf"
              style={{ display: 'none' }}
              onChange={handleResumeFileSelect}
            />

            <button
              onClick={() => resumeInputRef.current?.click()}
              disabled={uploadingResume}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                border: 'none',
                color: '#FFFFFF',
                fontSize: '13px',
                fontWeight: '800',
                padding: '10px 18px',
                borderRadius: '10px',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)'
              }}
            >
              <Upload size={16} />
              {uploadingResume ? 'Uploading...' : resumeInfo?.hasResume ? 'Update Resume' : 'Upload Resume (PDF)'}
            </button>

            <button
              onClick={() => window.open(api.placements.resumeViewUrl(resumeInfo?.fileName), '_blank')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#E2E8F0',
                fontSize: '13px',
                fontWeight: '700',
                padding: '10px 16px',
                borderRadius: '10px',
                cursor: 'pointer'
              }}
            >
              <Eye size={15} /> Preview
            </button>

            <button
              onClick={() => api.placements.downloadResume(resumeInfo?.fileName, 'VTU_Placement_Resume')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#E2E8F0',
                fontSize: '13px',
                fontWeight: '700',
                padding: '10px 16px',
                borderRadius: '10px',
                cursor: 'pointer'
              }}
            >
              <Download size={15} /> Download
            </button>
          </div>
        </div>

        {/* Search & Batch Filter */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '20px',
            padding: '20px',
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap'
          }}
        >
          <div style={{ position: 'relative', flex: '1 1 280px' }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by company, role (e.g. Google, AWS, Full Stack, Bengaluru)..."
              style={{
                width: '100%',
                background: 'rgba(11, 16, 32, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '12px',
                padding: '12px 14px 12px 40px',
                color: '#FFFFFF',
                fontSize: '13px',
                outline: 'none'
              }}
            />
            <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '14px', top: '14px', pointerEvents: 'none' }} />
          </div>

          <select
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
            style={{
              background: 'rgba(11, 16, 32, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '12px',
              padding: '12px 16px',
              color: '#F8FAFC',
              fontSize: '13px',
              fontWeight: '600',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="ALL">All Batches</option>
            <option value="2026 Batch">2026 Batch</option>
            <option value="2025 & 2026 Batch">2025 & 2026 Batch</option>
            <option value="2025 Batch">2025 Batch</option>
          </select>
        </div>

        {/* Placements Cards Grid */}
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#94A3B8' }}>
            Loading recruitment drives...
          </div>
        ) : filteredPlacements.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', background: 'rgba(15, 23, 42, 0.5)', borderRadius: '20px', color: '#94A3B8' }}>
            <Briefcase size={48} color="#475569" style={{ marginBottom: '12px' }} />
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#F8FAFC', margin: '0 0 6px 0' }}>No placement drives found</h3>
            <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>Try clearing filters or search keywords.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '22px' }}>
            {filteredPlacements.map((plc) => {
              const appInfo = appliedMap.get(plc.id);
              const isApplied = !!appInfo;

              return (
                <div
                  key={plc.id}
                  style={{
                    background: 'rgba(15, 23, 42, 0.75)',
                    border: isApplied ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '20px',
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative',
                    transition: 'all 0.2s ease',
                    boxShadow: isApplied ? '0 8px 24px rgba(16, 185, 129, 0.1)' : 'none'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = isApplied ? 'rgba(16, 185, 129, 0.4)' : 'rgba(255, 255, 255, 0.08)';
                  }}
                >
                  {isApplied && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                        background: 'rgba(16, 185, 129, 0.2)',
                        border: '1px solid rgba(16, 185, 129, 0.4)',
                        color: '#34D399',
                        fontSize: '11px',
                        fontWeight: '800',
                        padding: '4px 10px',
                        borderRadius: '999px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <CheckCircle size={12} /> {appInfo.status || 'Applied'}
                    </div>
                  )}

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                      <div
                        style={{
                          width: '46px',
                          height: '46px',
                          borderRadius: '14px',
                          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.25) 0%, rgba(6, 182, 212, 0.25) 100%)',
                          border: '1px solid rgba(16, 185, 129, 0.4)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#34D399',
                          fontWeight: '900',
                          fontSize: '17px'
                        }}
                      >
                        {plc.companyName?.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h4 style={{ fontSize: '18px', fontWeight: '800', color: '#F8FAFC', margin: 0 }}>
                          {plc.companyName}
                        </h4>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>
                          <MapPin size={12} /> {plc.location}
                        </div>
                      </div>
                    </div>

                    <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#38BDF8', marginBottom: '8px' }}>
                      {plc.jobRole}
                    </h3>
                    <p style={{ fontSize: '13px', color: '#94A3B8', lineHeight: 1.5, margin: '0 0 14px 0' }}>
                      {plc.description}
                    </p>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', fontSize: '12px', marginBottom: '14px' }}>
                      <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34D399', padding: '4px 10px', borderRadius: '6px', fontWeight: '800', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
                        CTC: {plc.ctc || '₹14-22 LPA'}
                      </span>
                      <span style={{ background: 'rgba(255, 255, 255, 0.06)', color: '#CBD5E1', padding: '4px 10px', borderRadius: '6px' }}>
                        Batch: {plc.batch}
                      </span>
                    </div>

                    {plc.requiredSkills && (
                      <div style={{ fontSize: '12px', color: '#94A3B8', lineHeight: 1.5 }}>
                        Skills: <span style={{ color: '#E2E8F0', fontWeight: '600' }}>{plc.requiredSkills}</span>
                      </div>
                    )}
                  </div>

                  <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#64748B' }}>
                      <Clock size={12} />
                      <span>Last Date: {plc.lastDate ? plc.lastDate.split('T')[0] : 'Rolling'}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {isApplied ? (
                        <div
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            background: 'rgba(16, 185, 129, 0.15)',
                            color: '#34D399',
                            fontSize: '12px',
                            fontWeight: '800',
                            padding: '8px 12px',
                            borderRadius: '8px',
                            border: '1px solid rgba(16, 185, 129, 0.3)'
                          }}
                        >
                          <Check size={14} /> Applied
                        </div>
                      ) : (
                        <button
                          onClick={() => openApplyModal(plc)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                            border: 'none',
                            color: '#FFFFFF',
                            fontSize: '12px',
                            fontWeight: '800',
                            padding: '8px 14px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.35)'
                          }}
                        >
                          <Send size={13} /> Apply Now
                        </button>
                      )}

                      <Link
                        to={`/placements/${plc.id}`}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          background: 'rgba(255, 255, 255, 0.08)',
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                          color: '#CBD5E1',
                          fontSize: '12px',
                          fontWeight: '700',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          textDecoration: 'none'
                        }}
                      >
                        Details <ArrowRight size={13} />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* APPLY TO COMPANY MODAL */}
        {applyModalPlacement && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(8px)',
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
                maxWidth: '520px',
                background: '#0F172A',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                borderRadius: '24px',
                padding: '30px',
                position: 'relative',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)'
              }}
            >
              <button
                onClick={closeApplyModal}
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  background: 'transparent',
                  border: 'none',
                  color: '#94A3B8',
                  cursor: 'pointer'
                }}
              >
                <X size={20} />
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    fontWeight: '900',
                    fontSize: '16px'
                  }}
                >
                  {applyModalPlacement.companyName?.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 style={{ fontSize: '19px', fontWeight: '900', color: '#FFFFFF', margin: 0 }}>
                    Apply to {applyModalPlacement.companyName}
                  </h3>
                  <div style={{ fontSize: '13px', color: '#38BDF8', fontWeight: '700', marginTop: '2px' }}>
                    {applyModalPlacement.jobRole} ({applyModalPlacement.batch})
                  </div>
                </div>
              </div>

              {applySuccess ? (
                <div style={{ textAlign: 'center', padding: '30px 10px' }}>
                  <CheckCircle size={52} color="#34D399" style={{ marginBottom: '14px' }} />
                  <h4 style={{ fontSize: '20px', fontWeight: '800', color: '#FFFFFF', margin: '0 0 8px 0' }}>
                    Application Submitted!
                  </h4>
                  <p style={{ fontSize: '13px', color: '#94A3B8', margin: 0 }}>
                    Your verified profile and resume have been dispatched to {applyModalPlacement.companyName}'s recruiting committee.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleApplySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {applyError && (
                    <div
                      style={{
                        padding: '10px 14px',
                        background: 'rgba(239, 68, 68, 0.15)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        borderRadius: '10px',
                        color: '#F87171',
                        fontSize: '13px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <AlertCircle size={15} /> {applyError}
                    </div>
                  )}

                  {/* Resume Selector Options */}
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: '800', color: '#E2E8F0', display: 'block', marginBottom: '8px' }}>
                      Select Application Resume
                    </label>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '10px' }}>
                      <button
                        type="button"
                        onClick={() => setResumeSource('saved')}
                        style={{
                          padding: '8px 10px',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: '700',
                          border: resumeSource === 'saved' ? '1px solid #10B981' : '1px solid rgba(255, 255, 255, 0.1)',
                          background: resumeSource === 'saved' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                          color: resumeSource === 'saved' ? '#34D399' : '#94A3B8',
                          cursor: 'pointer'
                        }}
                      >
                        Active Resume
                      </button>

                      <button
                        type="button"
                        onClick={() => setResumeSource('upload')}
                        style={{
                          padding: '8px 10px',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: '700',
                          border: resumeSource === 'upload' ? '1px solid #10B981' : '1px solid rgba(255, 255, 255, 0.1)',
                          background: resumeSource === 'upload' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                          color: resumeSource === 'upload' ? '#34D399' : '#94A3B8',
                          cursor: 'pointer'
                        }}
                      >
                        Upload PDF
                      </button>

                      <button
                        type="button"
                        onClick={() => setResumeSource('link')}
                        style={{
                          padding: '8px 10px',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: '700',
                          border: resumeSource === 'link' ? '1px solid #10B981' : '1px solid rgba(255, 255, 255, 0.1)',
                          background: resumeSource === 'link' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                          color: resumeSource === 'link' ? '#34D399' : '#94A3B8',
                          cursor: 'pointer'
                        }}
                      >
                        External Link
                      </button>
                    </div>

                    {/* Resume Source UI */}
                    {resumeSource === 'saved' && (
                      <div
                        style={{
                          background: 'rgba(16, 185, 129, 0.08)',
                          border: '1px solid rgba(16, 185, 129, 0.25)',
                          borderRadius: '10px',
                          padding: '12px 14px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <FileText size={18} color="#34D399" />
                          <span style={{ fontSize: '13px', color: '#F1F5F9', fontWeight: '600' }}>
                            {resumeInfo?.fileName || 'VTU_Student_Verified_Resume.pdf'}
                          </span>
                        </div>
                        <a
                          href={api.placements.resumeViewUrl(resumeInfo?.fileName)}
                          target="_blank"
                          rel="noreferrer"
                          style={{ fontSize: '12px', color: '#38BDF8', fontWeight: '700', textDecoration: 'none' }}
                        >
                          Preview
                        </a>
                      </div>
                    )}

                    {resumeSource === 'upload' && (
                      <div
                        style={{
                          background: 'rgba(11, 16, 32, 0.8)',
                          border: '1px dashed rgba(255, 255, 255, 0.2)',
                          borderRadius: '10px',
                          padding: '14px',
                          textAlign: 'center'
                        }}
                      >
                        <input
                          type="file"
                          accept=".pdf"
                          required={!applyFile}
                          onChange={(e) => setApplyFile(e.target.files?.[0] || null)}
                          style={{ fontSize: '12px', color: '#CBD5E1', width: '100%' }}
                        />
                        {applyFile && (
                          <div style={{ fontSize: '12px', color: '#34D399', fontWeight: '700', marginTop: '6px' }}>
                            Selected: {applyFile.name} ({(applyFile.size / 1024).toFixed(1)} KB)
                          </div>
                        )}
                      </div>
                    )}

                    {resumeSource === 'link' && (
                      <input
                        type="url"
                        required
                        placeholder="https://drive.google.com/your-resume.pdf"
                        value={applyLink}
                        onChange={(e) => setApplyLink(e.target.value)}
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
                    )}
                  </div>

                  {/* Cover Notes */}
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: '800', color: '#E2E8F0', display: 'block', marginBottom: '6px' }}>
                      Candidate Pitch & Relevant VTU Projects
                    </label>
                    <textarea
                      rows={3}
                      value={applyNotes}
                      onChange={(e) => setApplyNotes(e.target.value)}
                      placeholder="Mention your CGPA, key tech stack, hackathons, and why you are interested in this position..."
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

                  {/* Footer CTAs */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
                    <button
                      type="button"
                      onClick={closeApplyModal}
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
                      disabled={submittingApply}
                      style={{
                        background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                        border: 'none',
                        color: '#FFFFFF',
                        padding: '10px 22px',
                        borderRadius: '10px',
                        fontSize: '13px',
                        fontWeight: '800',
                        cursor: 'pointer',
                        boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)'
                      }}
                    >
                      {submittingApply ? 'Submitting Application...' : 'Confirm & Apply'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

      </div>
    </StudentLayout>
  );
};
