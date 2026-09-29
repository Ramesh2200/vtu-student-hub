import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  BookOpen,
  ChevronRight,
  FileText,
  FileCheck2,
  Code2,
  HelpCircle,
  ExternalLink,
  Download,
  Eye,
  CheckCircle,
  Bookmark
} from 'lucide-react';

export const AcademicsPage = () => {
  const {
    subjects,
    currentUser,
    notes,
    questionPapers,
    setPdfViewerData,
    toggleBookmarkNote
  } = useApp();

  const [selectedSubjectId, setSelectedSubjectId] = useState(subjects[0]?.id || 'sub_bcs601');
  const [activeTab, setActiveTab] = useState('modules'); // 'modules' | 'notes' | 'papers' | 'lab' | 'questions'

  const currentSubject = subjects.find(s => s.id === selectedSubjectId) || subjects[0];

  const subjectNotes = notes.filter(n => n.subjectCode === currentSubject.code);
  const subjectPapers = questionPapers.filter(qp => qp.subjectCode === currentSubject.code);

  return (
    <div style={{ padding: '32px 28px', maxWidth: '1440px', margin: '0 auto', width: '100%' }}>
      
      {/* 30. BREADCRUMB NAVIGATION */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '0.85rem',
        color: '#94A3B8',
        marginBottom: '20px',
        flexWrap: 'wrap'
      }}>
        <span style={{ color: '#E2E8F0', fontWeight: 600 }}>VTU Belagavi</span>
        <ChevronRight size={14} />
        <span>{currentUser.scheme}</span>
        <ChevronRight size={14} />
        <span>{currentUser.branchCode}</span>
        <ChevronRight size={14} />
        <span>Semester {currentUser.semester}</span>
        <ChevronRight size={14} />
        <span style={{ color: '#22D3EE', fontWeight: 700 }}>{currentSubject.code} ({currentSubject.name})</span>
      </div>

      {/* Course Title Header */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(108, 92, 231, 0.15) 0%, rgba(34, 211, 238, 0.1) 100%), #111827',
        border: '1px solid rgba(108, 92, 231, 0.25)',
        borderRadius: '20px',
        padding: '28px',
        marginBottom: '28px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span className="badge badge-primary">{currentSubject.code}</span>
              <span className="badge badge-secondary">{currentSubject.credits} VTU Credits</span>
              <span className="badge badge-accent">{currentSubject.category}</span>
            </div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#F8FAFC', marginBottom: '8px' }}>
              {currentSubject.name}
            </h1>
            <p style={{ fontSize: '0.92rem', color: '#94A3B8', maxWidth: '800px', lineHeight: 1.5 }}>
              {currentSubject.syllabusOverview}
            </p>
          </div>

          {/* Subject Switcher dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.82rem', color: '#CBD5E1', fontWeight: 600 }}>Switch Course:</span>
            <select
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
              style={{
                background: '#0B1020',
                color: '#F8FAFC',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '10px',
                padding: '8px 12px',
                fontSize: '0.85rem'
              }}
            >
              {subjects.map(s => (
                <option key={s.id} value={s.id}>{s.code}: {s.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tabs Row */}
      <div style={{
        display: 'flex',
        gap: '8px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        paddingBottom: '12px',
        marginBottom: '28px',
        overflowX: 'auto'
      }}>
        {[
          { id: 'modules', label: 'Modules & Syllabus', icon: BookOpen },
          { id: 'notes', label: `Lecture Notes (${subjectNotes.length})`, icon: FileText },
          { id: 'papers', label: `Question Papers (${subjectPapers.length})`, icon: FileCheck2 },
          { id: 'lab', label: 'Lab Manuals & Code', icon: Code2 },
          { id: 'questions', label: 'Important 10-Mark Questions', icon: HelpCircle }
        ].map(t => {
          const Icon = t.icon;
          const isAct = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                borderRadius: '12px',
                fontSize: '0.88rem',
                fontWeight: 600,
                background: isAct ? 'linear-gradient(135deg, #6C5CE7 0%, #4F8CFF 100%)' : 'rgba(255, 255, 255, 0.04)',
                color: isAct ? '#FFFFFF' : '#94A3B8',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s'
              }}
            >
              <Icon size={16} />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT: MODULES */}
      {activeTab === 'modules' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {currentSubject.modules.map(mod => (
            <div
              key={mod.num}
              className="glass-card"
              style={{
                padding: '24px',
                borderRadius: '18px',
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '20px'
              }}
            >
              <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '14px',
                  background: 'rgba(108, 92, 231, 0.15)',
                  border: '1px solid rgba(108, 92, 231, 0.3)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <span style={{ fontSize: '0.65rem', color: '#A78BFA', fontWeight: 700 }}>UNIT</span>
                  <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#F8FAFC' }}>0{mod.num}</span>
                </div>

                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#F8FAFC', marginBottom: '6px' }}>
                    Module {mod.num}: {mod.title}
                  </h3>
                  <p style={{ fontSize: '0.88rem', color: '#94A3B8', maxWidth: '700px', lineHeight: 1.5 }}>
                    <strong>Key Syllabus Topics:</strong> {mod.keyTopics}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className="badge badge-secondary" style={{ fontSize: '0.75rem' }}>
                  {mod.notesCount} Notes Available
                </span>

                <button
                  onClick={() => setActiveTab('notes')}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '10px',
                    background: '#6C5CE7',
                    color: '#FFFFFF',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Eye size={14} />
                  <span>Explore Unit Notes</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB CONTENT: NOTES */}
      {activeTab === 'notes' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {subjectNotes.map(n => (
            <div
              key={n.id}
              className="glass-card"
              style={{
                padding: '24px',
                borderRadius: '16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span className="badge badge-primary">Module {n.moduleNumber}</span>
                  <button
                    onClick={() => toggleBookmarkNote(n.id)}
                    style={{ color: n.isBookmarked ? '#A78BFA' : '#94A3B8' }}
                  >
                    <Bookmark size={18} fill={n.isBookmarked ? '#A78BFA' : 'none'} />
                  </button>
                </div>

                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#F8FAFC', marginBottom: '8px', lineHeight: 1.35 }}>
                  {n.title}
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#94A3B8', marginBottom: '16px', lineHeight: 1.5 }}>
                  {n.description}
                </p>
              </div>

              <div>
                <div style={{ fontSize: '0.78rem', color: '#64748B', marginBottom: '14px' }}>
                  By {n.author} • {n.fileSize} • ⭐ {n.rating} ({n.downloads} downloads)
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <button
                    onClick={() => setPdfViewerData(n)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '8px',
                      background: 'rgba(255, 255, 255, 0.06)',
                      color: '#F8FAFC',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px'
                    }}
                  >
                    <Eye size={14} /> Preview
                  </button>
                  <button
                    onClick={() => setPdfViewerData(n)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '8px',
                      background: '#6C5CE7',
                      color: '#FFFFFF',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px'
                    }}
                  >
                    <Download size={14} /> Download PDF
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB CONTENT: QUESTION PAPERS */}
      {activeTab === 'papers' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {subjectPapers.map(qp => (
            <div
              key={qp.id}
              className="glass-card"
              style={{
                padding: '24px',
                borderRadius: '16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span className="badge badge-secondary">{qp.examType}</span>
                  <span style={{ fontSize: '0.78rem', color: '#22D3EE', fontWeight: 700 }}>{qp.year}</span>
                </div>

                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#F8FAFC', marginBottom: '8px' }}>
                  {qp.subjectCode}: {qp.subjectName} ({qp.year})
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#94A3B8', marginBottom: '16px' }}>
                  {qp.description}
                </p>
              </div>

              <div>
                <div style={{ fontSize: '0.78rem', color: '#64748B', marginBottom: '14px' }}>
                  Max Marks: {qp.maxMarks} • Duration: {qp.duration} • {qp.fileSize}
                </div>

                <button
                  onClick={() => setPdfViewerData({
                    title: `${qp.subjectCode} ${qp.examType} (${qp.year})`,
                    subject: `${qp.subjectCode} - ${qp.subjectName}`,
                    author: 'VTU Belagavi Examination Authority',
                    pages: 8,
                    fileSize: qp.fileSize,
                    contentSnippet: 'VTU SEE Model & Previous Year Question Paper. Answer any FIVE full questions, choosing ONE full question from each module.'
                  })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #6C5CE7 0%, #4F8CFF 100%)',
                    color: '#FFFFFF',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <Eye size={15} />
                  <span>Preview Solved Question Paper</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB CONTENT: LAB MANUALS */}
      {activeTab === 'lab' && (
        <div className="glass-card" style={{ padding: '32px', borderRadius: '20px' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#F8FAFC', marginBottom: '16px' }}>
            VTU Laboratory Programs & Manual ({currentSubject.code})
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[
              { num: 1, title: 'Simulate Cloud Hypervisor VM Allocation using CloudSim Toolkit in Java', verified: true },
              { num: 2, title: 'Deploy Containerized Microservice Cluster with Docker and Docker-Compose', verified: true },
              { num: 3, title: 'MapReduce WordCount and Inverted Index computation on Apache Hadoop Single Node', verified: true },
              { num: 4, title: 'Serverless Event Pipeline deployment using AWS Lambda and Amazon S3 triggers', verified: true }
            ].map(p => (
              <div
                key={p.num}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.06)'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 600, color: '#F8FAFC' }}>
                    Program {p.num}: {p.title}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#10B981', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                    <CheckCircle size={13} />
                    <span>Tested on Ubuntu 24.04 LTS & VTU Lab Rubric 2026</span>
                  </div>
                </div>

                <button
                  onClick={() => setPdfViewerData({
                    title: `Lab Program ${p.num}: ${p.title}`,
                    subject: `${currentSubject.code} Lab Manual`,
                    author: 'VTU CSE Board of Studies',
                    pages: 14,
                    fileSize: '1.2 MB',
                    contentSnippet: 'Objective, Algorithm, Complete Tested Source Code with output screenshots and Viva Voce questions.'
                  })}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    background: '#6C5CE7',
                    color: '#FFFFFF',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Eye size={13} /> Code & Output
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: IMPORTANT QUESTIONS */}
      {activeTab === 'questions' && (
        <div className="glass-card" style={{ padding: '32px', borderRadius: '20px' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#F8FAFC', marginBottom: '16px' }}>
            High-Yield 10-Mark Questions (VTU SEE Exam Bank)
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              'Explain the reference architecture of NIST Cloud Computing with neat block diagrams. (10 Marks, Repeated 4 times in SEE)',
              'Compare and contrast Type-1 and Type-2 Hypervisors with illustrative examples and security trade-offs. (8 Marks)',
              'Explain the Hadoop Distributed File System (HDFS) architecture: NameNode, DataNode, Secondary NameNode and block replication. (10 Marks)',
              'Describe the MapReduce execution workflow with Mapper, Combiner, Partitioner, and Reducer stages. (10 Marks)',
              'What is Serverless computing? Discuss the execution model, cold starts, and cost economics of AWS Lambda. (8 Marks)'
            ].map((q, idx) => (
              <div
                key={idx}
                style={{
                  padding: '14px 18px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  fontSize: '0.9rem',
                  color: '#CBD5E1',
                  lineHeight: 1.5
                }}
              >
                <strong style={{ color: '#A78BFA' }}>Q{idx + 1}.</strong> {q}
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
