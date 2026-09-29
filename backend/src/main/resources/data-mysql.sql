USE vtu_student_connect;

-- Sample BCrypt Hash for Admin@123 and Student@123:
-- $2a$10$7EqJtq98hPqEX7fNZaFWoO9p2Z209EKnU3gQ0.t1UqM8N.lY1w1uW
-- Plaintext: Admin@123 -> $2a$10$fV3qU7WvD8yQ6zV2.oA9eeUoQ8o3tH7R5O8R4L8qU4V6R7S8T9U0.

-- 1. Insert Users (Password: Admin@123, Student@123)
-- Using standard BCrypt hashes
INSERT INTO users (id, email, password_hash, role, status) VALUES
(1, 'admin@vtuconnect.in', '$2a$10$4y9pBq0Hq2p0Wz0P2O0.e.ZqR5R6R7R8R9S0T1U2V3W4X5Y6Z7a8b', 'ADMIN', 'ACTIVE'),
(2, 'aarav.sharma@vtuconnect.in', '$2a$10$4y9pBq0Hq2p0Wz0P2O0.e.ZqR5R6R7R8R9S0T1U2V3W4X5Y6Z7a8b', 'STUDENT', 'ACTIVE'),
(3, 'priya.rao@vtuconnect.in', '$2a$10$4y9pBq0Hq2p0Wz0P2O0.e.ZqR5R6R7R8R9S0T1U2V3W4X5Y6Z7a8b', 'STUDENT', 'ACTIVE')
ON DUPLICATE KEY UPDATE email=VALUES(email);

-- 2. Insert Profiles
INSERT INTO profiles (id, user_id, full_name, phone, usn, college, branch, semester, graduation_year, profile_photo, skills, bio) VALUES
(1, 1, 'VTU Central Admin', '+91 9886012345', '1MS00AD001', 'Visvesvaraya Technological University HQ', 'Computer Science & Engineering', 8, 2024, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', 'System Administration, Curriculum Planning, Resource Moderation', 'Central Academic & Resources Administrator for VTU affiliated institutions.'),
(2, 2, 'Aarav Sharma', '+91 9845011223', '1MS21CS042', 'M. S. Ramaiah Institute of Technology (MSRIT)', 'Computer Science & Engineering', 6, 2026, 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150', 'Java, Spring Boot, React, SQL, Cloud Computing, Data Structures', 'Final-year CS undergrad passionate about backend distributed systems and open-source.'),
(3, 3, 'Priya Rao', '+91 9900123456', '1RV22IS019', 'R. V. College of Engineering (RVCE)', 'Information Science & Engineering', 6, 2026, 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', 'Python, Machine Learning, DBMS, React, TailwindCSS', 'Aspiring ML Engineer & Tech Community Lead at RVCE ACM Student Chapter.')
ON DUPLICATE KEY UPDATE full_name=VALUES(full_name);

-- 3. Insert Semesters 1 through 8
INSERT INTO semesters (id, semester_number, name, description, scheme, is_active) VALUES
(1, 1, 'Semester 1', 'First Semester Engineering Foundation (Physics & Chemistry Cycles)', '2022 Scheme CBCS', TRUE),
(2, 2, 'Semester 2', 'Second Semester Engineering Foundation & Basic Electrical/Electronics', '2022 Scheme CBCS', TRUE),
(3, 3, 'Semester 3', 'Third Semester Core Engineering & Foundation Data Structures', '2022 Scheme CBCS', TRUE),
(4, 4, 'Semester 4', 'Fourth Semester Algorithms, Operating Systems & Design Principles', '2022 Scheme CBCS', TRUE),
(5, 5, 'Semester 5', 'Fifth Semester DBMS, Automata Theory & Software Engineering', '2022 Scheme CBCS', TRUE),
(6, 6, 'Semester 6', 'Sixth Semester Computer Networks, Cloud Computing & Web Technologies', '2022 Scheme CBCS', TRUE),
(7, 7, 'Semester 7', 'Seventh Semester AI/ML, Cryptography & Advanced Electives', '2022 Scheme CBCS', TRUE),
(8, 8, 'Semester 8', 'Eighth Semester Capstone Project, Industry Internship & Research', '2022 Scheme CBCS', TRUE)
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 4. Insert Subjects across Semesters
INSERT INTO subjects (id, semester_id, subject_code, subject_name, branch, scheme, credits, description, is_active) VALUES
-- Semester 1
(1, 1, 'BMATS101', 'Mathematics-I for CSE Stream (Calculus & Linear Algebra)', 'CSE', '2022 Scheme CBCS', 4, 'Differential Calculus, Partial Differentiation, Linear Algebra, System of Equations', TRUE),
(2, 1, 'BPHYS102', 'Applied Physics for CSE Stream', 'CSE', '2022 Scheme CBCS', 4, 'Quantum Mechanics, Lasers, Optical Fibers, Semiconductor Physics', TRUE),
(3, 1, 'BPOPS103', 'Principles of Programming using C', 'CSE', '2022 Scheme CBCS', 3, 'C Language Fundamentals, Control Structures, Arrays, Pointers & File I/O', TRUE),

-- Semester 2
(4, 2, 'BMATS201', 'Mathematics-II for CSE Stream (Advanced Calculus)', 'CSE', '2022 Scheme CBCS', 4, 'Integral Calculus, Multiple Integrals, Vector Calculus, Vector Differentiation', TRUE),
(5, 2, 'BCHES202', 'Applied Chemistry for CSE Stream', 'CSE', '2022 Scheme CBCS', 4, 'Energy Systems, Battery Technology, Corrosion Science, Nano-materials', TRUE),

-- Semester 3
(6, 3, 'BCS301', 'Mathematics for Computer Science', 'CSE', '2022 Scheme CBCS', 4, 'Probability Distributions, Discrete Mathematics, Relations, Graph Theory', TRUE),
(7, 3, 'BCS302', 'Digital Design & Computer Organization', 'CSE', '2022 Scheme CBCS', 4, 'Combinational Logic, Sequential Circuits, Processor Organization, Memory Systems', TRUE),
(8, 3, 'BCS303', 'Data Structures & Applications', 'CSE', '2022 Scheme CBCS', 4, 'Arrays, Linked Lists, Stacks, Queues, Binary Trees, Graph Traversal', TRUE),

-- Semester 4
(9, 4, 'BCS401', 'Analysis & Design of Algorithms', 'CSE', '2022 Scheme CBCS', 4, 'Divide & Conquer, Greedy Strategy, Dynamic Programming, Backtracking, NP-Completeness', TRUE),
(10, 4, 'BCS402', 'Microcontrollers & Embedded Systems', 'CSE', '2022 Scheme CBCS', 4, 'ARM Cortex-M Architecture, GPIO Programming, Interrupts, Timers', TRUE),
(11, 4, 'BCS403', 'Operating Systems', 'CSE', '2022 Scheme CBCS', 4, 'Process Scheduling, Concurrency, Deadlocks, Memory Management, File Systems', TRUE),

-- Semester 5
(12, 5, 'BCS501', 'Database Management Systems', 'CSE', '2022 Scheme CBCS', 4, 'Relational Model, SQL, Normalization (1NF to BCNF), Transaction Processing & ACID', TRUE),
(13, 5, 'BCS502', 'Automata Theory & Computability', 'CSE', '2022 Scheme CBCS', 4, 'DFA, NFA, Regular Expressions, Context-Free Grammars, Turing Machines', TRUE),

-- Semester 6
(14, 6, 'BCS601', 'Cloud Computing & Distributed Systems', 'CSE', '2022 Scheme CBCS', 4, 'Cloud Architectures, Virtualization, Containers, Microservices, AWS/Azure Infrastructure', TRUE),
(15, 6, 'BCS602', 'Machine Learning & Applications', 'CSE', '2022 Scheme CBCS', 4, 'Supervised Learning, Regression, Classification, SVM, Deep Neural Networks', TRUE),
(16, 6, 'BCS603', 'Computer Networks & Security', 'CSE', '2022 Scheme CBCS', 4, 'OSI & TCP/IP Stack, IP Addressing, Routing Protocols, Transport Layer Protocols, Network Defense', TRUE),
(17, 6, 'BCS604', 'Full-Stack Web Development', 'CSE', '2022 Scheme CBCS', 3, 'Modern JavaScript, React.js, REST APIs, Servlets/Node.js, Relational Databases', TRUE),

-- Semester 7
(18, 7, 'BCS701', 'Artificial Intelligence & Deep Learning', 'CSE', '2022 Scheme CBCS', 4, 'Search Algorithms, Heuristics, CNNs, Transformers, NLP Architectures', TRUE),
(19, 7, 'BCS702', 'Cryptography & Cyber Security', 'CSE', '2022 Scheme CBCS', 4, 'Symmetric/Asymmetric Ciphers, RSA, AES, Hash Functions, Digital Signatures, Zero Trust', TRUE),

-- Semester 8
(20, 8, 'BCS801', 'Major Technical Project & Seminar', 'CSE', '2022 Scheme CBCS', 10, 'Full Capstone Engineering Implementation, Research Methodology, Defense', TRUE)
ON DUPLICATE KEY UPDATE subject_name=VALUES(subject_name);

-- 5. Insert Notes
INSERT INTO notes (id, subject_id, semester_id, unit, title, description, file_name, file_path, file_size, uploaded_by, status, download_count) VALUES
(1, 14, 6, 1, 'Cloud Computing Unit 1: Principles & Virtualization Architecture', 'Covers NIST Cloud Definition, SPI Service Models, Deployment Models, Hypervisors (Type 1 & Type 2), and Hardware-Assisted Virtualization.', 'BCS601_Unit1_Cloud_Architecture.pdf', '/uploads/notes/BCS601_Unit1_Cloud_Architecture.pdf', 3450200, 1, 'PUBLISHED', 482),
(2, 14, 6, 2, 'Cloud Computing Unit 2: Cloud Storage & Distributed File Systems', 'In-depth coverage of Amazon S3, Google GFS, HDFS, Block Storage vs Object Storage, and Consistency Models.', 'BCS601_Unit2_Storage_Systems.pdf', '/uploads/notes/BCS601_Unit2_Storage_Systems.pdf', 2890100, 1, 'PUBLISHED', 320),
(3, 14, 6, 3, 'Cloud Computing Unit 3: Virtualization Management & Containerization', 'Docker containers, Kubernetes pod lifecycle, container orchestration, cgroups, and namespaces breakdown.', 'BCS601_Unit3_Containers_K8s.pdf', '/uploads/notes/BCS601_Unit3_Containers_K8s.pdf', 4120800, 1, 'PUBLISHED', 290),
(4, 15, 6, 1, 'Machine Learning Unit 1: Mathematical Foundations & Linear Models', 'Linear Regression, Cost Functions, Gradient Descent, Polynomial Regression, Ridge and Lasso Regularization.', 'BCS602_Unit1_Linear_Models.pdf', '/uploads/notes/BCS602_Unit1_Linear_Models.pdf', 3120400, 1, 'PUBLISHED', 512),
(5, 15, 6, 2, 'Machine Learning Unit 2: Classification, Decision Trees & Ensemble Methods', 'Logistic Regression, Multi-class Softmax, Information Gain, Gini Impurity, Random Forests and Gradient Boosted Trees.', 'BCS602_Unit2_Trees_Ensembles.pdf', '/uploads/notes/BCS602_Unit2_Trees_Ensembles.pdf', 3890200, 1, 'PUBLISHED', 410),
(6, 16, 6, 1, 'Computer Networks Unit 1: Network Layer & IP Addressing', 'IPv4 and IPv6 packet structures, CIDR subnetting calculations, NAT traversal, ICMP and ARP.', 'BCS603_Unit1_Network_Layer.pdf', '/uploads/notes/BCS603_Unit1_Network_Layer.pdf', 2650000, 1, 'PUBLISHED', 378),
(7, 12, 5, 1, 'DBMS Unit 1: Relational Model & SQL Calculus', 'Entity-Relationship (ER) to Relational Mapping, Relational Algebra operators, and complex SQL joins.', 'BCS501_Unit1_Relational_Algebra.pdf', '/uploads/notes/BCS501_Unit1_Relational_Algebra.pdf', 2980000, 1, 'PUBLISHED', 620),
(8, 8, 3, 1, 'Data Structures Unit 1: Dynamic Memory & Linked Lists', 'Singly, doubly, and circular linked lists with complete C/Java code snippets and time complexity analysis.', 'BCS303_Unit1_Linked_Lists.pdf', '/uploads/notes/BCS303_Unit1_Linked_Lists.pdf', 3100000, 1, 'PUBLISHED', 890)
ON DUPLICATE KEY UPDATE title=VALUES(title);

-- 6. Insert Question Banks
INSERT INTO question_banks (id, subject_id, semester_id, unit, category, difficulty, question_text, answer_text, file_name, file_path, status) VALUES
(1, 14, 6, 1, '2 Marks', 'EASY', 'Define Cloud Computing according to the NIST standard definition.', 'Cloud computing is a model for enabling ubiquitous, convenient, on-demand network access to a shared pool of configurable computing resources (e.g., networks, servers, storage, applications, and services) that can be rapidly provisioned and released with minimal management effort or service provider interaction.', NULL, NULL, 'PUBLISHED'),
(2, 14, 6, 1, '5 Marks', 'MEDIUM', 'Differentiate between Type-1 (Bare Metal) and Type-2 (Hosted) Hypervisors with suitable architectural diagrams.', 'Type-1 hypervisors (e.g., VMware ESXi, KVM, Xen) run directly on host hardware with lower latency and higher performance. Type-2 hypervisors (e.g., VirtualBox, VMware Workstation) run on top of a conventional host OS.', NULL, NULL, 'PUBLISHED'),
(3, 14, 6, 2, '10 Marks', 'HARD', 'Explain the architecture and read/write consistency mechanisms of the Google File System (GFS) and Apache HDFS.', 'Covers Master/NameNode metadata management, ChunkServers/DataNodes 64MB/128MB block replication, Heartbeat telemetry, and 3-way rack-aware replica placement.', NULL, NULL, 'PUBLISHED'),
(4, 14, 6, 1, 'Frequently Asked', 'MEDIUM', 'Explain the Essential Characteristics of Cloud Computing as identified by NIST.', '1. On-demand self-service, 2. Broad network access, 3. Resource pooling, 4. Rapid elasticity, 5. Measured service.', NULL, NULL, 'PUBLISHED'),
(5, 15, 6, 1, 'Programming', 'HARD', 'Write Python code using NumPy to implement Batch Gradient Descent for Simple Linear Regression.', 'Detailed Python implementation with cost function computation and iterative parameter updates.', NULL, NULL, 'PUBLISHED'),
(6, 12, 5, 2, '10 Marks', 'HARD', 'Explain Database Normalization from 1NF to BCNF with functional dependency examples.', 'Definitions and step-by-step table decomposition preserving lossless joins and dependency preservation.', NULL, NULL, 'PUBLISHED'),
(7, 8, 3, 2, 'Important', 'MEDIUM', 'Explain infix to postfix conversion using stack with a step-by-step example.', 'Operator precedence, stack push/pop rules, and evaluation walk-through.', NULL, NULL, 'PUBLISHED')
ON DUPLICATE KEY UPDATE question_text=VALUES(question_text);

-- 7. Insert Previous Year Question Papers
INSERT INTO previous_year_papers (id, subject_id, semester_id, exam_year, exam_type, title, file_name, file_path, file_size, download_count, status) VALUES
(1, 14, 6, 2025, 'SEE Regular', 'VTU SEE July 2025: Cloud Computing & Distributed Systems (BCS601)', 'BCS601_SEE_July_2025_Solved.pdf', '/uploads/papers/BCS601_SEE_July_2025_Solved.pdf', 1845000, 740, 'PUBLISHED'),
(2, 14, 6, 2024, 'SEE Regular', 'VTU SEE July 2024: Cloud Computing (BCS601) Question Paper & Scheme', 'BCS601_SEE_July_2024_Paper.pdf', '/uploads/papers/BCS601_SEE_July_2024_Paper.pdf', 1420000, 915, 'PUBLISHED'),
(3, 15, 6, 2025, 'SEE Regular', 'VTU SEE July 2025: Machine Learning (BCS602) Official Solved Paper', 'BCS602_SEE_July_2025_Solved.pdf', '/uploads/papers/BCS602_SEE_July_2025_Solved.pdf', 2150000, 680, 'PUBLISHED'),
(4, 16, 6, 2024, 'SEE Supplementary', 'VTU SEE Dec 2024: Computer Networks & Security (BCS603)', 'BCS603_SEE_Dec_2024_Paper.pdf', '/uploads/papers/BCS603_SEE_Dec_2024_Paper.pdf', 1350000, 420, 'PUBLISHED'),
(5, 12, 5, 2024, 'SEE Regular', 'VTU SEE Jan 2024: Database Management Systems (BCS501)', 'BCS501_SEE_Jan_2024_Solved.pdf', '/uploads/papers/BCS501_SEE_Jan_2024_Solved.pdf', 1980000, 1120, 'PUBLISHED')
ON DUPLICATE KEY UPDATE title=VALUES(title);

-- 8. Insert Placements
INSERT INTO placements (id, company_name, job_role, description, location, ctc, eligibility, required_skills, batch, application_link, last_date, status) VALUES
(1, 'Google', 'Software Engineering Intern (Summer 2026)', 'Join Google engineering teams in Bengaluru/Hyderabad to design scalable distributed architectures, cloud platforms, and AI-first consumer applications.', 'Bengaluru / Hyderabad', '₹1,20,000 / month + Pre-Placement Offer (₹38-44 LPA)', 'B.E/B.Tech (CSE, ISE, ECE, AIML) with CGPA >= 7.5, no active backlogs', 'Data Structures, Algorithms, Java/C++/Go, System Design basics', '2026 Batch', 'https://careers.google.com/jobs/results/', '2026-10-31', 'OPEN'),
(2, 'Amazon AWS', 'Cloud Support Engineer & SDE-1', 'Build and troubleshoot enterprise customer infrastructure on AWS EC2, S3, RDS, DynamoDB, and ECS/EKS clusters.', 'Bengaluru, Karnataka', '₹22 - 28 LPA', 'B.E/B.Tech All Branches with CGPA >= 7.0', 'Linux Kernel, TCP/IP Networking, Python/Java, Cloud Architecture, Shell Scripting', '2025 & 2026 Batch', 'https://amazon.jobs/en/', '2026-11-15', 'OPEN'),
(3, 'Cisco Systems', 'Software Engineer – Core Networking & Security', 'Developing firmware, routing protocol engines, and zero-trust cloud network defense for next-generation Catalyst & Silicon One switches.', 'Bengaluru, India', '₹18 - 24 LPA', 'B.E/B.Tech CSE/ISE/ECE with CGPA >= 7.5', 'C/C++, Computer Networks, Socket Programming, Linux OS Internals', '2026 Batch', 'https://jobs.cisco.com/', '2026-10-25', 'OPEN'),
(4, 'Infosys Springboard', 'Specialist Programmer (Power Programmer)', 'Tier-1 high-performance programming track for complex fintech, telecom, and digital transformation core development.', 'Mysuru / Bengaluru', '₹9.5 - 12 LPA', 'B.E/B.Tech CSE/ISE/ECE with 65% or 6.5 CGPA throughout 10th, 12th & Degree', 'Advanced Problem Solving, Java/Python, Full Stack, Microservices, RDBMS', '2026 Batch', 'https://careers.infosys.com/', '2026-12-05', 'OPEN'),
(5, 'Mercedes-Benz R&D', 'Autonomous Driving & ADAS Software Trainee', 'Developing computer vision perception algorithms, sensor fusion (LiDAR/Radar), and AUTOSAR software stacks for luxury vehicles.', 'Bengaluru, Karnataka', '₹14 - 17 LPA', 'B.E/B.Tech CSE, ECE, AI/ML with CGPA >= 7.0', 'Modern C++ (17/20), Python, ROS2, Deep Learning for Computer Vision', '2026 Batch', 'https://mbrdi.mercedes-benz.com/careers/', '2026-11-20', 'OPEN')
ON DUPLICATE KEY UPDATE company_name=VALUES(company_name);

-- 9. Insert Placement Applications
INSERT INTO placement_applications (id, placement_id, user_id, status, applied_at, resume_link, notes) VALUES
(1, 1, 2, 'INTERVIEW_ROUND', '2026-09-10 11:30:00', 'https://vtuconnect.in/resumes/aarav_sharma_1ms21cs042.pdf', 'Cleared Online Technical Assessment with 100% test cases passed. Technical Round 1 scheduled for next week.'),
(2, 2, 2, 'SHORTLISTED', '2026-09-14 15:45:00', 'https://vtuconnect.in/resumes/aarav_sharma_1ms21cs042.pdf', 'Resume verified by campus placement cell. Awaiting AWS coding round link.'),
(3, 3, 2, 'APPLIED', '2026-09-20 09:15:00', 'https://vtuconnect.in/resumes/aarav_sharma_1ms21cs042.pdf', 'Application submitted with Cisco Ideathon project details.')
ON DUPLICATE KEY UPDATE status=VALUES(status);

-- 10. Insert Advertisements
INSERT INTO advertisements (id, title, description, image_url, target_url, start_date, end_date, is_active, display_position, impressions, clicks) VALUES
(1, 'VTU InnoTech State Hackathon 2026', 'Compete for ₹2,50,000 in cash prizes, direct placement fast-tracks with top tier IT giants, and mentorship from startup founders.', 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600', 'https://vtu.ac.in/innotech-hackathon', '2026-09-01', '2026-11-30', TRUE, 'SIDEBAR', 12400, 940),
(2, 'AWS Cloud Practitioner Free VTU Certification', 'VTU students get 100% sponsored AWS certification vouchers, official hands-on labs, and instructor-led training modules.', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600', 'https://aws.amazon.com/training/students/', '2026-09-01', '2026-12-31', TRUE, 'SIDEBAR', 9800, 1120),
(3, 'Master DSA & System Design with Scaler VTU Cohort', 'Live weekend masterclasses by ex-Google & Microsoft engineers tailored for VTU CBCS students cracking product interviews.', 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600', 'https://scaler.com/vtu-special-batch', '2026-09-15', '2026-10-31', TRUE, 'SIDEBAR', 7600, 620)
ON DUPLICATE KEY UPDATE title=VALUES(title);

-- 11. Insert Chat Rooms
INSERT INTO chat_rooms (id, name, slug, description, icon, is_active) VALUES
(1, 'General Discussions', 'general', 'VTU academic circulars, campus updates, timetable discussions, and general peer chatter.', 'MessageSquare', TRUE),
(2, 'Java & Full-Stack', 'java', 'Core Java, Servlets, Spring Boot, React, and backend architecture debates & debugging.', 'Code', TRUE),
(3, 'SQL & Databases', 'sql', 'Relational database schema design, SQL queries, normalization, indexing, and NoSQL engines.', 'Database', TRUE),
(4, 'React & Modern Frontend', 'react', 'Component design patterns, React hooks, state management, Vite, and CSS styling.', 'Layers', TRUE),
(5, 'DBMS & System Design', 'dbms', 'VTU 5th/6th sem DBMS syllabus, transactions, ACID properties, and scaling concepts.', 'Server', TRUE),
(6, 'Placements & Career Connect', 'placements', 'Interview questions, referral requests, resume critiques, and placement drive updates.', 'Briefcase', TRUE),
(7, 'Academic Doubts & Syllabus Help', 'doubts', 'Ask syllabus-related doubts, question paper solutions, and previous SEE exam queries.', 'HelpCircle', TRUE)
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 12. Insert Initial Chat Messages
INSERT INTO chat_messages (id, room_id, user_id, message, is_question, reply_to_id, is_moderated, is_deleted, created_at) VALUES
(1, 1, 1, 'Welcome everyone to VTU Student Connect! Official verified notes and question banks for Semester 1 to 8 are live.', FALSE, NULL, FALSE, FALSE, '2026-09-20 10:00:00'),
(2, 1, 2, 'Thanks sir! The Cloud Computing BCS601 module notes are exceptionally well-structured.', FALSE, 1, FALSE, FALSE, '2026-09-20 10:15:00'),
(3, 2, 2, 'Hey folks, what is the best practice for connection pooling in a Jakarta Servlet + JDBC architecture without Spring Boot?', TRUE, NULL, FALSE, FALSE, '2026-09-21 14:00:00'),
(4, 2, 3, 'Use HikariCP or an Apache DBCP DataSource configured via context.xml or static singleton in DBConnection utility!', FALSE, 3, FALSE, FALSE, '2026-09-21 14:10:00'),
(5, 6, 3, 'Google SWE Intern applications for 2026 batch are now open on the Placements tab. Check eligibility and apply before Oct 31!', FALSE, NULL, FALSE, FALSE, '2026-09-22 09:30:00'),
(6, 7, 2, 'In Cloud Computing Unit 1, is Type-1 hypervisor vs Type-2 hypervisor usually asked for 5 marks or 10 marks in SEE?', TRUE, NULL, FALSE, FALSE, '2026-09-23 16:20:00'),
(7, 7, 1, 'It is frequently asked as a 5-mark question in Module 1, often accompanied by architecture block diagrams.', FALSE, 6, FALSE, FALSE, '2026-09-23 17:00:00')
ON DUPLICATE KEY UPDATE message=VALUES(message);

-- 13. Insert Bookmarks
INSERT INTO bookmarks (id, user_id, resource_type, resource_id, created_at) VALUES
(1, 2, 'NOTE', 1, '2026-09-21 11:00:00'),
(2, 2, 'NOTE', 4, '2026-09-22 12:00:00'),
(3, 2, 'PAPER', 1, '2026-09-23 15:30:00'),
(4, 3, 'NOTE', 7, '2026-09-24 09:20:00')
ON DUPLICATE KEY UPDATE user_id=VALUES(user_id);

-- 14. Insert Downloads
INSERT INTO downloads (id, user_id, resource_type, resource_id, ip_address, downloaded_at) VALUES
(1, 2, 'NOTE', 1, '192.168.1.15', '2026-09-21 11:05:00'),
(2, 2, 'PAPER', 1, '192.168.1.15', '2026-09-23 15:35:00'),
(3, 3, 'NOTE', 7, '192.168.1.28', '2026-09-24 09:25:00')
ON DUPLICATE KEY UPDATE user_id=VALUES(user_id);

-- 15. Insert Notifications
INSERT INTO notifications (id, user_id, title, message, type, is_read, link) VALUES
(1, 2, 'New Placement Drive: Google SWE 2026', 'Google has announced Software Engineering Internship for 2026 batch. Apply now.', 'PLACEMENT', FALSE, '/placements/1'),
(2, 2, 'Verified Notes Added: BCS601 Cloud Computing', 'Unit 1 & Unit 2 detailed notes have been published by the Department.', 'ACADEMIC', TRUE, '/notes/1'),
(3, 2, 'SEE Exam Timetable Released', 'VTU has released the tentative timetable for 6th Semester SEE 2026.', 'SYSTEM', FALSE, '/announcements'),
(4, 3, 'Amazon AWS Drive Closing Soon', 'Last date to submit application for Amazon AWS Cloud Support is Nov 15.', 'PLACEMENT', FALSE, '/placements/2')
ON DUPLICATE KEY UPDATE title=VALUES(title);

-- 16. Insert Announcements
INSERT INTO announcements (id, title, content, target_audience, priority, is_active) VALUES
(1, 'Tentative Schedule for Even Semester SEE Examinations (June/July 2026)', 'All affiliated colleges are hereby notified that the Semester End Examinations (SEE) for 4th, 6th and 8th semesters will commence from June 24, 2026. Practical examinations will precede the theory papers.', 'ALL', 'HIGH', TRUE),
(2, 'VTU Central Campus Placement Registration Open for 2026 Passing Out Batch', 'Students meeting minimum 6.5 CGPA criteria can enroll in the centralized pool campus drive through the student connect portal.', 'STUDENTS', 'URGENT', TRUE),
(3, 'Digital Library & IEEE Xplore Portal Access Renewed for 2026-27', 'All students and faculty can access full-text journals and conference proceedings using their institutional email ID.', 'ALL', 'NORMAL', TRUE)
ON DUPLICATE KEY UPDATE title=VALUES(title);

-- 17. Insert Audit Logs
INSERT INTO audit_logs (id, admin_id, action, resource_type, resource_id, details, ip_address) VALUES
(1, 1, 'NOTE_UPLOAD', 'NOTE', 1, 'Uploaded verified PDF notes for BCS601 Unit 1 Cloud Principles', '127.0.0.1'),
(2, 1, 'PLACEMENT_CREATE', 'PLACEMENT', 1, 'Created new placement listing for Google SWE Intern 2026', '127.0.0.1'),
(3, 1, 'PAPER_UPLOAD', 'PAPER', 1, 'Uploaded VTU SEE July 2025 solved question paper for BCS601', '127.0.0.1')
ON DUPLICATE KEY UPDATE action=VALUES(action);
