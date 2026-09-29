-- ==============================================================================
-- VTU STUDENT CONNECT — PRODUCTION POSTGRESQL RELATIONAL SCHEMA
-- Normalized database architecture compliant with sections 44 & 45
-- ==============================================================================

-- Drop existing tables if re-initializing
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS event_registrations CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS job_applications CASCADE;
DROP TABLE IF EXISTS jobs CASCADE;
DROP TABLE IF EXISTS answers CASCADE;
DROP TABLE IF EXISTS questions CASCADE;
DROP TABLE IF EXISTS question_papers CASCADE;
DROP TABLE IF EXISTS notes CASCADE;
DROP TABLE IF EXISTS modules CASCADE;
DROP TABLE IF EXISTS subjects CASCADE;
DROP TABLE IF EXISTS student_profiles CASCADE;
DROP TABLE IF EXISTS faculty_profiles CASCADE;
DROP TABLE IF EXISTS user_roles CASCADE;
DROP TABLE IF EXISTS roles CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS colleges CASCADE;
DROP TABLE IF EXISTS branches CASCADE;
DROP TABLE IF EXISTS schemes CASCADE;

-- 1. COLLEGES TABLE
CREATE TABLE colleges (
    id VARCHAR(64) PRIMARY KEY,
    code VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(128) NOT NULL,
    is_autonomous BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. BRANCHES TABLE
CREATE TABLE branches (
    id VARCHAR(64) PRIMARY KEY,
    code VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(128) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. SCHEMES TABLE (e.g. 2022 Scheme, 2021 Scheme)
CREATE TABLE schemes (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    start_year INT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. USERS TABLE
CREATE TABLE users (
    id VARCHAR(64) PRIMARY KEY,
    email VARCHAR(128) UNIQUE,
    phone VARCHAR(20) UNIQUE,
    password_hash VARCHAR(255),
    role VARCHAR(32) NOT NULL DEFAULT 'ROLE_STUDENT', -- 'ROLE_STUDENT', 'ROLE_FACULTY', 'ROLE_ADMIN'
    is_enabled BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. STUDENT PROFILES TABLE
CREATE TABLE student_profiles (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(128) NOT NULL,
    usn VARCHAR(20) UNIQUE NOT NULL,
    college_id VARCHAR(64) REFERENCES colleges(id),
    branch_id VARCHAR(64) REFERENCES branches(id),
    scheme_id VARCHAR(64) REFERENCES schemes(id),
    semester INT NOT NULL DEFAULT 1,
    graduation_year INT NOT NULL,
    cgpa NUMERIC(4, 2) DEFAULT 0.00,
    avatar_url VARCHAR(512),
    interests TEXT[], -- Array of technical domains
    skills TEXT[],
    profile_completion INT DEFAULT 50,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. SUBJECTS TABLE
CREATE TABLE subjects (
    id VARCHAR(64) PRIMARY KEY,
    code VARCHAR(20) NOT NULL,
    name VARCHAR(128) NOT NULL,
    credits INT NOT NULL DEFAULT 3,
    semester INT NOT NULL,
    branch_id VARCHAR(64) REFERENCES branches(id),
    scheme_id VARCHAR(64) REFERENCES schemes(id),
    category VARCHAR(64) DEFAULT 'Core',
    syllabus_overview TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_subject_code_scheme UNIQUE (code, scheme_id)
);

-- 7. MODULES TABLE
CREATE TABLE modules (
    id VARCHAR(64) PRIMARY KEY,
    subject_id VARCHAR(64) NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    module_number INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    key_topics TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_module_subject UNIQUE (subject_id, module_number)
);

-- 8. NOTES & STUDY RESOURCES TABLE
CREATE TABLE notes (
    id VARCHAR(64) PRIMARY KEY,
    subject_id VARCHAR(64) NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    module_number INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    file_url VARCHAR(512) NOT NULL,
    file_type VARCHAR(16) DEFAULT 'PDF',
    file_size VARCHAR(32),
    pages INT DEFAULT 10,
    author_name VARCHAR(128) NOT NULL,
    author_role VARCHAR(64),
    uploaded_by VARCHAR(64) REFERENCES users(id),
    downloads_count INT DEFAULT 0,
    rating NUMERIC(3, 1) DEFAULT 5.0,
    is_approved BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. PREVIOUS YEAR QUESTION PAPERS TABLE
CREATE TABLE question_papers (
    id VARCHAR(64) PRIMARY KEY,
    subject_id VARCHAR(64) NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    exam_type VARCHAR(64) NOT NULL, -- 'SEE', 'CIE', 'Model Paper'
    academic_year VARCHAR(32) NOT NULL,
    max_marks INT DEFAULT 100,
    duration VARCHAR(32) DEFAULT '3 Hours',
    file_url VARCHAR(512) NOT NULL,
    has_solutions BOOLEAN DEFAULT TRUE,
    downloads_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. QUESTIONS / COMMUNITY DISCUSSIONS TABLE
CREATE TABLE questions (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    author_name VARCHAR(128) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    tags TEXT[],
    upvotes INT DEFAULT 0,
    answers_count INT DEFAULT 0,
    accepted_answer_id VARCHAR(64),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. ANSWERS TABLE
CREATE TABLE answers (
    id VARCHAR(64) PRIMARY KEY,
    question_id VARCHAR(64) NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    author_name VARCHAR(128) NOT NULL,
    author_role VARCHAR(64),
    content TEXT NOT NULL,
    upvotes INT DEFAULT 0,
    is_accepted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 12. JOBS & PLACEMENTS TABLE
CREATE TABLE jobs (
    id VARCHAR(64) PRIMARY KEY,
    company_name VARCHAR(128) NOT NULL,
    logo_url VARCHAR(512),
    role VARCHAR(128) NOT NULL,
    job_type VARCHAR(32) NOT NULL, -- 'Job', 'Internship'
    employment_type VARCHAR(64) DEFAULT 'Full-time',
    package_offered VARCHAR(64),
    location VARCHAR(128) NOT NULL,
    is_remote BOOLEAN DEFAULT FALSE,
    eligibility_criteria TEXT,
    skills_required TEXT[],
    deadline DATE,
    application_url VARCHAR(512),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 13. JOB APPLICATIONS TABLE (KANBAN TRACKER)
CREATE TABLE job_applications (
    id VARCHAR(64) PRIMARY KEY,
    job_id VARCHAR(64) NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    student_id VARCHAR(64) NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
    status VARCHAR(32) NOT NULL DEFAULT 'SAVED', -- 'SAVED', 'APPLIED', 'SHORTLISTED', 'INTERVIEW', 'SELECTED', 'REJECTED'
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_student_job UNIQUE (job_id, student_id)
);

-- 14. EVENTS & HACKATHONS TABLE
CREATE TABLE events (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(64) NOT NULL, -- 'Hackathon', 'Workshop', 'Coding Contest'
    event_date VARCHAR(64) NOT NULL,
    event_time VARCHAR(64),
    location VARCHAR(255) NOT NULL,
    mode VARCHAR(32) DEFAULT 'In-Person',
    organizer VARCHAR(128) NOT NULL,
    prize_pool VARCHAR(128),
    spots_total INT DEFAULT 100,
    spots_left INT DEFAULT 100,
    description TEXT,
    image_url VARCHAR(512),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 15. EVENT REGISTRATIONS TABLE
CREATE TABLE event_registrations (
    id VARCHAR(64) PRIMARY KEY,
    event_id VARCHAR(64) NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    student_id VARCHAR(64) NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_student_event UNIQUE (event_id, student_id)
);

-- 16. NOTIFICATIONS TABLE
CREATE TABLE notifications (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    category VARCHAR(32) NOT NULL, -- 'Academic', 'Placement', 'Event', 'Community'
    title VARCHAR(255) NOT NULL,
    description TEXT,
    action_url VARCHAR(255),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 17. AUDIT LOGS TABLE
CREATE TABLE audit_logs (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64),
    action VARCHAR(128) NOT NULL,
    entity_name VARCHAR(64),
    entity_id VARCHAR(64),
    details TEXT,
    ip_address VARCHAR(64),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- INDEXES FOR MAXIMUM HIGH-SCALE PERFORMANCE (Section 45)
-- ==============================================================================
CREATE INDEX idx_student_user ON student_profiles(user_id);
CREATE INDEX idx_student_usn ON student_profiles(usn);
CREATE INDEX idx_student_college ON student_profiles(college_id);
CREATE INDEX idx_student_branch ON student_profiles(branch_id);
CREATE INDEX idx_student_semester ON student_profiles(semester);

CREATE INDEX idx_subjects_scheme_branch ON subjects(scheme_id, branch_id, semester);
CREATE INDEX idx_modules_subject ON modules(subject_id);
CREATE INDEX idx_notes_subject ON notes(subject_id);
CREATE INDEX idx_notes_created_at ON notes(created_at DESC);
CREATE INDEX idx_qp_subject ON question_papers(subject_id);

CREATE INDEX idx_questions_user ON questions(user_id);
CREATE INDEX idx_answers_question ON answers(question_id);

CREATE INDEX idx_job_apps_student ON job_applications(student_id);
CREATE INDEX idx_job_apps_status ON job_applications(status);

CREATE INDEX idx_event_reg_student ON event_registrations(student_id);
CREATE INDEX idx_notifications_user_read ON notifications(user_id, is_read);
