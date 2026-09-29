DROP DATABASE IF EXISTS vtu_student_connect;
CREATE DATABASE vtu_student_connect CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE vtu_student_connect;

SET FOREIGN_KEY_CHECKS = 0;

-- 1. Users Table
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('STUDENT', 'ADMIN') NOT NULL DEFAULT 'STUDENT',
    status ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED') NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_users_email (email),
    INDEX idx_users_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Profiles Table
CREATE TABLE profiles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(20),
    usn VARCHAR(30) UNIQUE,
    college VARCHAR(150) NOT NULL,
    branch VARCHAR(50) NOT NULL,
    semester INT NOT NULL DEFAULT 1,
    graduation_year INT NOT NULL DEFAULT 2026,
    profile_photo VARCHAR(500),
    skills TEXT,
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_profile_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_profile_usn (usn),
    INDEX idx_profile_branch_sem (branch, semester)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Semesters Table
CREATE TABLE semesters (
    id INT AUTO_INCREMENT PRIMARY KEY,
    semester_number INT NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    scheme VARCHAR(50) DEFAULT '2022 Scheme CBCS',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_semester_number (semester_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Subjects Table
CREATE TABLE subjects (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    semester_id INT NOT NULL,
    subject_code VARCHAR(30) NOT NULL UNIQUE,
    subject_name VARCHAR(200) NOT NULL,
    branch VARCHAR(50) NOT NULL,
    scheme VARCHAR(50) DEFAULT '2022 Scheme CBCS',
    credits INT DEFAULT 4,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_subject_semester FOREIGN KEY (semester_id) REFERENCES semesters(id) ON DELETE CASCADE,
    INDEX idx_subject_semester (semester_id),
    INDEX idx_subject_code (subject_code),
    INDEX idx_subject_branch (branch)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Notes Table
CREATE TABLE notes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    subject_id BIGINT NOT NULL,
    semester_id INT NOT NULL,
    unit INT NOT NULL DEFAULT 1,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT DEFAULT 0,
    uploaded_by BIGINT,
    status ENUM('DRAFT', 'PUBLISHED', 'UNPUBLISHED') DEFAULT 'PUBLISHED',
    download_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_note_subject FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
    CONSTRAINT fk_note_semester FOREIGN KEY (semester_id) REFERENCES semesters(id) ON DELETE CASCADE,
    CONSTRAINT fk_note_uploader FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_notes_subject (subject_id),
    INDEX idx_notes_semester (semester_id),
    INDEX idx_notes_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. Question Banks Table
CREATE TABLE question_banks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    subject_id BIGINT NOT NULL,
    semester_id INT NOT NULL,
    unit INT NOT NULL DEFAULT 1,
    category ENUM('2 Marks', '5 Marks', '10 Marks', 'Important', 'Frequently Asked', 'Conceptual', 'Programming') NOT NULL,
    difficulty ENUM('EASY', 'MEDIUM', 'HARD') DEFAULT 'MEDIUM',
    question_text TEXT NOT NULL,
    answer_text TEXT,
    file_name VARCHAR(255),
    file_path VARCHAR(500),
    status ENUM('DRAFT', 'PUBLISHED', 'UNPUBLISHED') DEFAULT 'PUBLISHED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_qb_subject FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
    CONSTRAINT fk_qb_semester FOREIGN KEY (semester_id) REFERENCES semesters(id) ON DELETE CASCADE,
    INDEX idx_qb_subject (subject_id),
    INDEX idx_qb_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. Previous Year Question Papers Table
CREATE TABLE previous_year_papers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    subject_id BIGINT NOT NULL,
    semester_id INT NOT NULL,
    exam_year INT NOT NULL,
    exam_type ENUM('SEE Regular', 'SEE Supplementary', 'Make-up Exam') DEFAULT 'SEE Regular',
    title VARCHAR(255) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT DEFAULT 0,
    download_count INT DEFAULT 0,
    status ENUM('DRAFT', 'PUBLISHED', 'UNPUBLISHED') DEFAULT 'PUBLISHED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_pyp_subject FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
    CONSTRAINT fk_pyp_semester FOREIGN KEY (semester_id) REFERENCES semesters(id) ON DELETE CASCADE,
    INDEX idx_pyp_subject_year (subject_id, exam_year),
    INDEX idx_pyp_semester (semester_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. Placements Table
CREATE TABLE placements (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    company_name VARCHAR(150) NOT NULL,
    job_role VARCHAR(150) NOT NULL,
    description TEXT,
    location VARCHAR(150) NOT NULL,
    ctc VARCHAR(150) NOT NULL,
    eligibility VARCHAR(500) NOT NULL,
    required_skills TEXT,
    batch VARCHAR(100) NOT NULL,
    application_link VARCHAR(500),
    last_date DATE NOT NULL,
    status ENUM('OPEN', 'CLOSED', 'UPCOMING', 'UNPUBLISHED') DEFAULT 'OPEN',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_placement_status (status),
    INDEX idx_placement_last_date (last_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 9. Placement Applications Table
CREATE TABLE placement_applications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    placement_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    status ENUM('APPLIED', 'SHORTLISTED', 'INTERVIEW_ROUND', 'OFFERED', 'REJECTED') DEFAULT 'APPLIED',
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resume_link VARCHAR(500),
    notes TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_app_placement FOREIGN KEY (placement_id) REFERENCES placements(id) ON DELETE CASCADE,
    CONSTRAINT fk_app_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY uk_placement_user (placement_id, user_id),
    INDEX idx_app_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 10. Advertisements Table
CREATE TABLE advertisements (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    image_url VARCHAR(500) NOT NULL,
    target_url VARCHAR(500) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    display_position VARCHAR(50) DEFAULT 'SIDEBAR',
    impressions INT DEFAULT 0,
    clicks INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_ads_active (is_active, start_date, end_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 11. Chat Rooms Table
CREATE TABLE chat_rooms (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(255),
    icon VARCHAR(50) DEFAULT 'MessageSquare',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 12. Chat Messages Table
CREATE TABLE chat_messages (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    room_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    message TEXT NOT NULL,
    is_question BOOLEAN DEFAULT FALSE,
    reply_to_id BIGINT DEFAULT NULL,
    is_moderated BOOLEAN DEFAULT FALSE,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_msg_room FOREIGN KEY (room_id) REFERENCES chat_rooms(id) ON DELETE CASCADE,
    CONSTRAINT fk_msg_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_msg_reply FOREIGN KEY (reply_to_id) REFERENCES chat_messages(id) ON DELETE SET NULL,
    INDEX idx_chat_room_created (room_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 13. Message Reports Table
CREATE TABLE message_reports (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    message_id BIGINT NOT NULL,
    reported_by BIGINT NOT NULL,
    reason VARCHAR(255) NOT NULL,
    status ENUM('PENDING', 'REVIEWED', 'ACTIONED', 'DISMISSED') DEFAULT 'PENDING',
    admin_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_report_msg FOREIGN KEY (message_id) REFERENCES chat_messages(id) ON DELETE CASCADE,
    CONSTRAINT fk_report_user FOREIGN KEY (reported_by) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_report_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 14. Bookmarks Table
CREATE TABLE bookmarks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    resource_type ENUM('NOTE', 'QUESTION_BANK', 'PAPER') NOT NULL,
    resource_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_bm_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY uk_user_resource (user_id, resource_type, resource_id),
    INDEX idx_bm_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 15. Downloads Table
CREATE TABLE downloads (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    resource_type ENUM('NOTE', 'QUESTION_BANK', 'PAPER') NOT NULL,
    resource_id BIGINT NOT NULL,
    ip_address VARCHAR(45),
    downloaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_dl_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_dl_user (user_id),
    INDEX idx_dl_resource (resource_type, resource_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 16. Notifications Table
CREATE TABLE notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('INFO', 'ACADEMIC', 'PLACEMENT', 'SYSTEM') DEFAULT 'INFO',
    is_read BOOLEAN DEFAULT FALSE,
    link VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notif_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_notif_user_read (user_id, is_read)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 17. Announcements Table
CREATE TABLE announcements (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    target_audience ENUM('ALL', 'STUDENTS', 'FACULTY') DEFAULT 'ALL',
    priority ENUM('LOW', 'NORMAL', 'HIGH', 'URGENT') DEFAULT 'NORMAL',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_announcement_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 18. Audit Logs Table
CREATE TABLE audit_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    admin_id BIGINT,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100) NOT NULL,
    resource_id BIGINT,
    details TEXT,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_audit_admin FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_audit_created (created_at),
    INDEX idx_audit_action (action)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SET FOREIGN_KEY_CHECKS = 1;
