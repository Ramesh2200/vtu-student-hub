import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Briefcase,
  MapPin,
  DollarSign,
  Calendar,
  CheckCircle,
  Clock,
  ArrowLeft,
  Building,
  GraduationCap,
  ShieldCheck,
  Award,
  Send,
  Sparkles,
  FileText,
  Upload,
  Download,
  Eye,
  AlertCircle,
  X,
  Check
} from 'lucide-react';
import { api } from '../../services/api';
import { StudentLayout } from '../../components/StudentLayout';

export const PlacementDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [placement, setPlacement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasApplied, setHasApplied] = useState(false);
  const [resumeInfo, setResumeInfo] = useState(null);

  // Application modal state
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [resumeSource, setResumeSource] = useState('saved'); // 'saved' | 'upload' | 'link'
  const [applyFile, setApplyFile] = useState(null);
  const [applyLink, setApplyLink] = useState('');
  const [coverNote, setCoverNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);
  const [applyError, setApplyError] = useState(null);

  useEffect(() => {
    loadDetails();
  }, [id]);

  const loadDetails = async () => {
    try {
      setLoading(true);
      const [driveData, myApps, resumeRes] = await Promise.allSettled([
        api.placements.getById(id),
        api.placements.getMyApplications(),
        api.placements.getMyResume()
      ]);

      if (driveData.status === 'fulfilled' && driveData.value) {
        setPlacement(driveData.value);
      }
      if (myApps.status === 'fulfilled' && Array.isArray(myApps.value)) {
        if (myApps.value.some((a) => a.placementId === Number(id))) {
          setHasApplied(true);
        }
      }
      if (resumeRes.status === 'fulfilled' && resumeRes.value) {
        setResumeInfo(resumeRes.value);
        if (resumeRes.value.hasResume) {
          setResumeSource('saved');
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to load drive details');
    } finally {
      setLoading(false);
    }
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setApplyError(null);

    try {
      let finalResumeLink = '';

      if (resumeSource === 'upload') {
        if (!applyFile) {
          throw new Error('Please choose a PDF resume file to upload.');
        }
        const uploadRes = await api.placements.uploadResume(applyFile);
        finalResumeLink = uploadRes.filePath;
        setResumeInfo({
          hasResume: true,
          resumeLink: uploadRes.filePath,
          fileName: uploadRes.fileName
        });
      } else if (resumeSource === 'link') {
        if (!applyLink || !applyLink.trim()) {
          throw new Error('Please enter a valid resume URL.');
        }
        finalResumeLink = applyLink.trim();
      } else {
        finalResumeLink = resumeInfo?.resumeLink || '/uploads/resumes/VTU_Student_Resume.pdf';
      }

      await api.placements.apply(id, {
        resumeLink: finalResumeLink,
        notes: coverNote
      });

      setHasApplied(true);
      setApplySuccess(true);
      setTimeout(() => setShowApplyModal(false), 2000);
    } catch (err) {
      setApplyError(err.message || 'Application submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <StudentLayout>
      <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Navigation & Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => navigate('/placements')}
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
            <ArrowLeft size={16} /> All Drives
          </button>
          <span style={{ color: '#475569' }}>/</span>
          <span style={{ color: '#38BDF8', fontSize: '13px', fontWeight: '700' }}>
            {placement?.companyName || 'Placement Drive'}
          </span>
        </div>

        {loading ? (
          <div style={{ padding: '80px', textAlign: 'center', color: '#94A3B8' }}>Loading placement drive details...</div>
        ) : error || !placement ? (
          <div style={{ padding: '24px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '14px', color: '#F87171' }}>
            {error || 'Placement drive not found'}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Header Hero Banner */}
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.22) 0%, rgba(6, 182, 212, 0.15) 100%)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '24px',
                padding: '36px',
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                  <div
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '18px',
                      background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFFFFF',
                      fontSize: '24px',
                      fontWeight: '900',
                      boxShadow: '0 8px 20px rgba(16, 185, 129, 0.3)'
                    }}
                  >
                    {placement.companyName?.slice(0, 2).toUpperCase()}
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '12px', fontWeight: '800', background: 'rgba(16, 185, 129, 0.2)', color: '#34D399', padding: '3px 8px', borderRadius: '6px' }}>
                        VTU Verified Drive
                      </span>
                      <span style={{ fontSize: '12px', color: '#94A3B8' }}>Batch: {placement.batch}</span>
                    </div>

                    <h1 style={{ fontSize: '26px', fontWeight: '900', color: '#F8FAFC', margin: '0 0 4px 0' }}>
                      {placement.jobRole}
                    </h1>

                    <h2 style={{ fontSize: '17px', fontWeight: '700', color: '#A78BFA', margin: 0 }}>
                      {placement.companyName}
                    </h2>
                  </div>
                </div>

                {/* Apply CTA Button */}
                <div>
                  {hasApplied ? (
                    <div
                      style={{
                        background: 'rgba(16, 185, 129, 0.2)',
                        border: '1px solid rgba(16, 185, 129, 0.4)',
                        color: '#34D399',
                        padding: '12px 24px',
                        borderRadius: '12px',
                        fontSize: '14px',
                        fontWeight: '800',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      <CheckCircle size={18} /> Application Submitted
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowApplyModal(true)}
                      style={{
                        background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                        border: 'none',
                        color: '#FFFFFF',
                        padding: '14px 28px',
                        borderRadius: '12px',
                        fontSize: '14px',
                        fontWeight: '800',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: '0 6px 18px rgba(16, 185, 129, 0.35)'
                      }}
                    >
                      <Send size={16} /> Apply for this Drive
                    </button>
                  )}
                </div>
              </div>

              {/* Key Compensation & Timeline Strip */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '16px',
                  marginTop: '28px',
                  paddingTop: '24px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.08)'
                }}
              >
                <div>
                  <div style={{ fontSize: '11px', color: '#94A3B8', textTransform: 'uppercase', fontWeight: '700' }}>Compensation (CTC)</div>
                  <div style={{ fontSize: '18px', fontWeight: '900', color: '#34D399', marginTop: '2px' }}>{placement.ctc || '₹14-22 LPA'}</div>
                </div>

                <div>
                  <div style={{ fontSize: '11px', color: '#94A3B8', textTransform: 'uppercase', fontWeight: '700' }}>Location</div>
                  <div style={{ fontSize: '15px', fontWeight: '700', color: '#F8FAFC', marginTop: '2px' }}>{placement.location || 'Bengaluru, India'}</div>
                </div>

                <div>
                  <div style={{ fontSize: '11px', color: '#94A3B8', textTransform: 'uppercase', fontWeight: '700' }}>Eligible Branch</div>
                  <div style={{ fontSize: '15px', fontWeight: '700', color: '#F8FAFC', marginTop: '2px' }}>{placement.eligibility || 'CSE / ISE / ECE (60%+)'}</div>
                </div>

                <div>
                  <div style={{ fontSize: '11px', color: '#94A3B8', textTransform: 'uppercase', fontWeight: '700' }}>Application Deadline</div>
                  <div style={{ fontSize: '15px', fontWeight: '700', color: '#FBBF24', marginTop: '2px' }}>
                    {placement.lastDate ? placement.lastDate.split('T')[0] : 'Rolling Basis'}
                  </div>
                </div>
              </div>
            </div>

            {/* Role Details & Skills Description */}
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: '24px', alignItems: 'start' }}>
              
              <div
                style={{
                  background: 'rgba(15, 23, 42, 0.7)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '20px',
                  padding: '32px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '24px'
                }}
              >
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#F8FAFC', marginBottom: '12px' }}>
                    Job Role Description
                  </h3>
                  <p style={{ color: '#CBD5E1', fontSize: '14px', lineHeight: 1.8, margin: 0 }}>
                    {placement.description}
                  </p>
                </div>

                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#F8FAFC', marginBottom: '12px' }}>
                    Required Technical Skills & Competencies
                  </h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {placement.requiredSkills ? (
                      placement.requiredSkills.split(',').map((skill, idx) => (
                        <span
                          key={idx}
                          style={{
                            background: 'rgba(124, 58, 237, 0.15)',
                            border: '1px solid rgba(124, 58, 237, 0.3)',
                            color: '#DDD6FE',
                            fontSize: '12px',
                            fontWeight: '700',
                            padding: '6px 12px',
                            borderRadius: '8px'
                          }}
                        >
                          {skill.trim()}
                        </span>
                      ))
                    ) : (
                      <span style={{ color: '#94A3B8', fontSize: '13px' }}>Standard CS Fundamentals</span>
                    )}
                  </div>
                </div>

                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#F8FAFC', marginBottom: '12px' }}>
                    Eligibility Criteria
                  </h3>
                  <ul style={{ margin: 0, paddingLeft: '20px', color: '#CBD5E1', fontSize: '14px', lineHeight: 1.7 }}>
                    <li>60% or 6.5 CGPA and above in 10th, 12th, and B.E./B.Tech without active backlogs.</li>
                    <li>Graduating batch: {placement.batch} (VTU Affiliated Colleges).</li>
                    <li>Strong foundation in Data Structures, Algorithms, System Design, and Database Concepts.</li>
                  </ul>
                </div>
              </div>

              {/* Sidebar Info */}
              <div
                style={{
                  background: 'rgba(15, 23, 42, 0.7)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '20px',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38BDF8' }}>
                  <ShieldCheck size={20} />
                  <span style={{ fontSize: '14px', fontWeight: '800' }}>VTU Placement Guarantee</span>
                </div>
                <p style={{ fontSize: '12px', color: '#94A3B8', lineHeight: 1.6, margin: 0 }}>
                  This drive is coordinated through the Visvesvaraya Technological University Central Placement Cell (CPC). Only genuine company representatives are permitted to post openings.
                </p>

                {resumeInfo?.hasResume && (
                  <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: '12px', padding: '12px' }}>
                    <div style={{ fontSize: '11px', color: '#34D399', fontWeight: '800', marginBottom: '4px' }}>
                      YOUR ACTIVE RESUME
                    </div>
                    <div style={{ fontSize: '12px', color: '#F1F5F9', fontWeight: '600', wordBreak: 'break-all' }}>
                      {resumeInfo.fileName}
                    </div>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                      <a
                        href={api.placements.resumeViewUrl(resumeInfo.fileName)}
                        target="_blank"
                        rel="noreferrer"
                        style={{ fontSize: '11px', color: '#38BDF8', fontWeight: '700', textDecoration: 'none' }}
                      >
                        Preview PDF
                      </a>
                    </div>
                  </div>
                )}

                <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '16px' }}>
                  <div style={{ fontSize: '11px', color: '#64748B', marginBottom: '4px' }}>SELECTION PROCESS</div>
                  <div style={{ fontSize: '13px', color: '#F8FAFC', fontWeight: '600' }}>
                    1. Online Coding Round<br />
                    2. Technical Interview I<br />
                    3. System Design / Tech II<br />
                    4. HR Discussion
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* APPLICATION MODAL */}
        {showApplyModal && (
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
                position: 'relative'
              }}
            >
              <button
                onClick={() => setShowApplyModal(false)}
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

              <h3 style={{ fontSize: '20px', fontWeight: '900', color: '#FFFFFF', margin: '0 0 6px 0' }}>
                Apply to {placement?.companyName}
              </h3>
              <p style={{ fontSize: '13px', color: '#94A3B8', margin: '0 0 20px 0' }}>
                Role: {placement?.jobRole} ({placement?.batch})
              </p>

              {applySuccess ? (
                <div style={{ textAlign: 'center', padding: '24px' }}>
                  <CheckCircle size={48} color="#34D399" style={{ marginBottom: '12px' }} />
                  <h4 style={{ fontSize: '18px', fontWeight: '800', color: '#FFFFFF', margin: '0 0 6px 0' }}>Application Received!</h4>
                  <p style={{ fontSize: '13px', color: '#94A3B8', margin: 0 }}>Your profile has been dispatched to {placement?.companyName}'s recruiting committee.</p>
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

                  {/* Resume Selector */}
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: '800', color: '#E2E8F0', display: 'block', marginBottom: '8px' }}>
                      Application Resume
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
                        placeholder="https://drive.google.com/your-vtu-resume.pdf"
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

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: '800', color: '#E2E8F0', display: 'block', marginBottom: '6px' }}>
                      Why are you interested in this role?
                    </label>
                    <textarea
                      rows={3}
                      value={coverNote}
                      onChange={(e) => setCoverNote(e.target.value)}
                      placeholder="Highlight relevant VTU projects, hackathon achievements, and core skills..."
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

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
                    <button
                      type="button"
                      onClick={() => setShowApplyModal(false)}
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
                      disabled={submitting}
                      style={{
                        background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                        border: 'none',
                        color: '#FFFFFF',
                        padding: '10px 22px',
                        borderRadius: '10px',
                        fontSize: '13px',
                        fontWeight: '700',
                        cursor: 'pointer'
                      }}
                    >
                      {submitting ? 'Submitting...' : 'Confirm Application'}
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
