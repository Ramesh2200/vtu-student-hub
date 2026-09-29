export const INITIAL_USER = {
  id: 'usr_vtu_101',
  name: 'Aarav Sharma',
  usn: '1MS21CS042',
  role: 'student', // 'student' | 'faculty' | 'admin'
  college: 'Ramaiah Institute of Technology (MSRIT)',
  collegeCode: '1MS',
  branch: 'Computer Science & Engineering',
  branchCode: 'CSE',
  scheme: '2022 Scheme',
  semester: 6,
  graduationYear: 2026,
  email: 'aarav.sharma@msrit.edu',
  phone: '+91 98450 12345',
  profileCompletion: 88,
  cgpa: 8.92,
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  interests: ['Cloud Architecture', 'Machine Learning', 'Web Development', 'Distributed Systems', 'DevOps'],
  skills: ['Java', 'Python', 'Spring Boot', 'React', 'AWS', 'Docker', 'PostgreSQL', 'Data Structures'],
  achievements: [
    '1st Place - VTU Smart Campus Hackathon 2025',
    'AWS Certified Cloud Practitioner (Score: 920/1000)',
    'Department Academic Excellence Award (5th Sem, SGPA 9.2)'
  ],
  socials: {
    github: 'https://github.com/aarav-vtu',
    linkedin: 'https://linkedin.com/in/aarav-sharma-vtu',
    portfolio: 'https://aarav.dev'
  },
  preferences: {
    notifications: true,
    jobAlerts: true,
    eventAlerts: true,
    academicUpdates: true
  }
};

export const FACULTY_USER = {
  id: 'fac_vtu_302',
  name: 'Dr. Sudha Ramamurthy',
  usn: 'FAC-VTU-8821',
  role: 'faculty',
  college: 'B.M.S. College of Engineering (BMSCE)',
  collegeCode: '1BM',
  branch: 'Computer Science & Engineering',
  designation: 'Professor & Senior Academic Coordinator',
  email: 'sudha.cse@bmsce.ac.in',
  phone: '+91 94480 67890',
  avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
  teachingSubjects: ['Cloud Computing (BCS601)', 'Machine Learning (BCS602)'],
  department: 'Department of Computer Science & Engineering'
};

export const ADMIN_USER = {
  id: 'adm_vtu_001',
  name: 'University Central Admin',
  usn: 'VTU-REG-BELAGAVI',
  role: 'admin',
  college: 'Visvesvaraya Technological University, Jnana Sangama, Belagavi',
  email: 'admin.connect@vtu.ac.in',
  phone: '+91 831 2498100',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
  permissions: ['ALL_ACCESS', 'USER_MANAGEMENT', 'MODERATION', 'AUDIT_LOGS']
};

export const COLLEGES = [
  { code: '1MS', name: 'Ramaiah Institute of Technology (MSRIT), Bengaluru' },
  { code: '1RV', name: 'R.V. College of Engineering (RVCE), Bengaluru' },
  { code: '1BM', name: 'B.M.S. College of Engineering (BMSCE), Bengaluru' },
  { code: '1PE', name: 'PES Institute of Technology / University, Bengaluru' },
  { code: '1DS', name: 'Dayananda Sagar College of Engineering (DSCE), Bengaluru' },
  { code: '1SI', name: 'Siddaganga Institute of Technology (SIT), Tumakuru' },
  { code: '1BI', name: 'Bangalore Institute of Technology (BIT), Bengaluru' },
  { code: '4NI', name: 'The National Institute of Engineering (NIE), Mysuru' },
  { code: '2GI', name: 'Gogte Institute of Technology (GIT), Belagavi' }
];

export const BRANCHES = [
  { code: 'CSE', name: 'Computer Science & Engineering' },
  { code: 'ISE', name: 'Information Science & Engineering' },
  { code: 'AIML', name: 'Artificial Intelligence & Machine Learning' },
  { code: 'AIDS', name: 'Artificial Intelligence & Data Science' },
  { code: 'ECE', name: 'Electronics & Communication Engineering' },
  { code: 'EEE', name: 'Electrical & Electronics Engineering' },
  { code: 'ME', name: 'Mechanical Engineering' },
  { code: 'CV', name: 'Civil Engineering' }
];

export const SCHEMES = ['2022 Scheme', '2021 Scheme', '2018 Scheme'];

export const SUBJECTS_6TH_SEM = [
  {
    id: 'sub_bcs601',
    code: 'BCS601',
    name: 'Cloud Computing',
    scheme: '2022 Scheme',
    semester: 6,
    credits: 4,
    progress: 78,
    category: 'Core',
    resourcesCount: 26,
    papersCount: 8,
    importantQuestionsCount: 14,
    syllabusOverview: 'Introduction to Cloud Computing, Virtualization architectures, Cloud storage (S3, EBS), MapReduce & Hadoop, Cloud Security and Serverless Computing (AWS Lambda).',
    modules: [
      { num: 1, title: 'Introduction & Cloud Architectures', notesCount: 6, keyTopics: 'NIST definition, Cloud delivery models (IaaS, PaaS, SaaS), Deployment models, Economics of cloud.' },
      { num: 2, title: 'Virtualization & Hypervisors', notesCount: 5, keyTopics: 'Hardware virtualization, Type-1 & Type-2 hypervisors, Containerization (Docker vs KVM), VM migration.' },
      { num: 3, title: 'Cloud Storage & Data Management', notesCount: 7, keyTopics: 'Distributed File Systems (GFS/HDFS), NoSQL stores, DynamoDB, Consistency models, Replication.' },
      { num: 4, title: 'Distributed Processing & MapReduce', notesCount: 4, keyTopics: 'Hadoop ecosystem, Map and Reduce algorithms, Spark in-memory compute, Task scheduling.' },
      { num: 5, title: 'Cloud Security & Serverless', notesCount: 4, keyTopics: 'IAM, Zero-trust in cloud, AWS Lambda architecture, SLA governance, VTU examination tips.' }
    ]
  },
  {
    id: 'sub_bcs602',
    code: 'BCS602',
    name: 'Machine Learning',
    scheme: '2022 Scheme',
    semester: 6,
    credits: 4,
    progress: 64,
    category: 'Core',
    resourcesCount: 32,
    papersCount: 10,
    importantQuestionsCount: 18,
    syllabusOverview: 'Supervised Learning (Decision Trees, SVM, Regression), Unsupervised Learning (K-Means, PCA), Neural Networks & Deep Learning basics, Model Evaluation.',
    modules: [
      { num: 1, title: 'Foundations & Concept Learning', notesCount: 7, keyTopics: 'Inductive bias, Find-S algorithm, Candidate Elimination, Version spaces.' },
      { num: 2, title: 'Decision Tree Learning & Neural Nets', notesCount: 8, keyTopics: 'ID3 algorithm, Information Gain, Entropy, Perceptron, Backpropagation.' },
      { num: 3, title: 'Bayesian Learning & Naive Bayes', notesCount: 6, keyTopics: 'Bayes Theorem, MAP hypotheses, Naive Bayes classifier, EM algorithm.' },
      { num: 4, title: 'Instance Based Learning & SVM', notesCount: 5, keyTopics: 'k-Nearest Neighbor, Radial Basis Function, Support Vector Machines, Kernel trick.' },
      { num: 5, title: 'Unsupervised & Reinforcement Learning', notesCount: 6, keyTopics: 'K-Means clustering, Hierarchical clustering, PCA, Q-Learning basics.' }
    ]
  },
  {
    id: 'sub_bcs603',
    code: 'BCS603',
    name: 'Compiler Design',
    scheme: '2022 Scheme',
    semester: 6,
    credits: 3,
    progress: 82,
    category: 'Core',
    resourcesCount: 18,
    papersCount: 6,
    importantQuestionsCount: 12,
    syllabusOverview: 'Phases of a compiler, Lexical Analysis, Syntax Analysis (LL, LR, LALR parsers), Syntax-Directed Translation, Intermediate Code Generation, Code Optimization.',
    modules: [
      { num: 1, title: 'Introduction & Lexical Analysis', notesCount: 4, keyTopics: 'Phases of compiler, Lex specification, Regular expressions to DFA, LEX tool.' },
      { num: 2, title: 'Syntax Analysis & Top-Down Parsing', notesCount: 4, keyTopics: 'Context-free grammars, LL(1) parsing table, First & Follow computation.' },
      { num: 3, title: 'Bottom-Up Parsing (LR, LALR)', notesCount: 4, keyTopics: 'Shift-reduce parsing, SLR(1), Canonical LR, LALR parsing, YACC.' },
      { num: 4, title: 'Syntax-Directed Translation & TAC', notesCount: 3, keyTopics: 'Attribute grammars, S-attributed & L-attributed definitions, Three-Address Code.' },
      { num: 5, title: 'Code Generation & Optimization', notesCount: 3, keyTopics: 'Basic blocks and flow graphs, Loop optimization, DAG representation, Register allocation.' }
    ]
  },
  {
    id: 'sub_bcs604',
    code: 'BCS604',
    name: 'Cryptography & Network Security',
    scheme: '2022 Scheme',
    semester: 6,
    credits: 3,
    progress: 55,
    category: 'Professional Elective',
    resourcesCount: 15,
    papersCount: 7,
    importantQuestionsCount: 10,
    syllabusOverview: 'Symmetric encryption (AES, DES), Asymmetric ciphers (RSA, ECC), Hash functions (SHA-256), Digital Signatures, IPsec, TLS, Web Security.',
    modules: [
      { num: 1, title: 'Classical Encryption & Block Ciphers', notesCount: 3, keyTopics: 'Substitution & Transposition techniques, Feistel structure, DES, AES.' },
      { num: 2, title: 'Public Key Cryptography & Number Theory', notesCount: 3, keyTopics: 'Euler Totient, Fermat Little Theorem, RSA algorithm, Diffie-Hellman Key Exchange.' },
      { num: 3, title: 'Cryptographic Hash & Digital Signatures', notesCount: 3, keyTopics: 'SHA-512, HMAC, Digital Signature Standard (DSS), X.509 certificates.' },
      { num: 4, title: 'Network Security Protocols', notesCount: 3, keyTopics: 'IPsec (AH & ESP), SSL/TLS handshake, HTTPS architecture, Email security (PGP).' },
      { num: 5, title: 'Intrusion Detection & Firewalls', notesCount: 3, keyTopics: 'Snort IDS, Packet filtering firewalls, Application proxies, Distributed DoS defenses.' }
    ]
  },
  {
    id: 'sub_bcs605',
    code: 'BCS605',
    name: 'Full Stack Web Development',
    scheme: '2022 Scheme',
    semester: 6,
    credits: 3,
    progress: 90,
    category: 'Open Elective',
    resourcesCount: 28,
    papersCount: 5,
    importantQuestionsCount: 15,
    syllabusOverview: 'Modern HTML5/CSS3, JavaScript ES6+, React architecture, Node.js & Express REST APIs, MongoDB & PostgreSQL, Authentication and Deployment.',
    modules: [
      { num: 1, title: 'HTML5, Modern CSS & Responsive Layouts', notesCount: 6, keyTopics: 'Flexbox, CSS Grid, Semantic HTML, CSS variables, Mobile-first design.' },
      { num: 2, title: 'JavaScript ES6+ & Asynchronous Engine', notesCount: 6, keyTopics: 'Event loop, Promises, Async/Await, Closures, DOM manipulation.' },
      { num: 3, title: 'Frontend Frameworks (React)', notesCount: 6, keyTopics: 'Components, Hooks (useState, useEffect, useContext), State management, Virtual DOM.' },
      { num: 4, title: 'Backend APIs (Node/Express/Spring)', notesCount: 5, keyTopics: 'RESTful API principles, Middleware, JWT authentication, Request routing.' },
      { num: 5, title: 'Database Integration & Cloud Deployment', notesCount: 5, keyTopics: 'ORM/JPA, Connection pooling, CI/CD pipelines, Docker containerization.' }
    ]
  }
];

export const MOCK_NOTES = [
  {
    id: 'not_01',
    subjectCode: 'BCS601',
    subjectName: 'Cloud Computing',
    moduleNumber: 1,
    title: 'Cloud Architecture & Service Models Complete Guide',
    description: 'Comprehensive handwritten and printed VTU notes covering NIST models, IaaS, PaaS, SaaS with neat diagrams and VTU previous year questions highlighted.',
    author: 'Prof. Sudha Ramamurthy',
    authorRole: 'Faculty (BMSCE)',
    fileType: 'PDF',
    fileSize: '4.8 MB',
    pages: 42,
    downloads: 1840,
    bookmarks: 412,
    rating: 4.9,
    uploadDate: '2026-03-12',
    isBookmarked: true,
    scheme: '2022 Scheme',
    semester: 6,
    branch: 'CSE',
    contentSnippet: 'Cloud Computing provides on-demand access to a shared pool of configurable computing resources (e.g., networks, servers, storage, applications, and services) that can be rapidly provisioned...'
  },
  {
    id: 'not_02',
    subjectCode: 'BCS601',
    subjectName: 'Cloud Computing',
    moduleNumber: 3,
    title: 'Distributed Storage, HDFS & MapReduce Master Notes',
    description: 'Detailed explanation of Google File System (GFS), Hadoop Distributed File System (HDFS), NameNode/DataNode architecture, block replication, and MapReduce execution flow with solved numericals.',
    author: 'Rahul Verma',
    authorRole: 'Student (MSRIT, 7th Sem)',
    fileType: 'PDF',
    fileSize: '6.2 MB',
    pages: 58,
    downloads: 1290,
    bookmarks: 305,
    rating: 4.8,
    uploadDate: '2026-03-18',
    isBookmarked: false,
    scheme: '2022 Scheme',
    semester: 6,
    branch: 'CSE',
    contentSnippet: 'In HDFS, files are divided into user-configurable block sizes (typically 128MB). Each block is replicated across multiple DataNodes (default replication factor = 3) to ensure fault tolerance...'
  },
  {
    id: 'not_03',
    subjectCode: 'BCS602',
    subjectName: 'Machine Learning',
    moduleNumber: 2,
    title: 'Decision Tree Induction & ID3 Algorithm Solved Examples',
    description: 'Step-by-step mathematical calculations for Entropy, Information Gain, and Gini Index. Includes previous VTU 10-mark numerical questions on Weather dataset.',
    author: 'Dr. K. S. Venkatesh',
    authorRole: 'Faculty (RVCE)',
    fileType: 'PDF',
    fileSize: '3.9 MB',
    pages: 36,
    downloads: 2450,
    bookmarks: 680,
    rating: 5.0,
    uploadDate: '2026-02-28',
    isBookmarked: true,
    scheme: '2022 Scheme',
    semester: 6,
    branch: 'CSE',
    contentSnippet: 'Information Gain: Gain(S, A) = Entropy(S) - SUM((|Sv| / |S|) * Entropy(Sv)). Where Sv is the subset of S for which attribute A has value v...'
  },
  {
    id: 'not_04',
    subjectCode: 'BCS602',
    subjectName: 'Machine Learning',
    moduleNumber: 4,
    title: 'SVM, Kernel Functions & Radial Basis Quick Revision Sheet',
    description: 'Concise formula cheat sheet and intuition for maximal margin classifiers, Lagrange multipliers, soft margin slack variables, and polynomial/RBF kernels.',
    author: 'Sneha Hegde',
    authorRole: 'Student (PESIT)',
    fileType: 'PDF',
    fileSize: '2.4 MB',
    pages: 20,
    downloads: 1670,
    bookmarks: 420,
    rating: 4.7,
    uploadDate: '2026-03-05',
    isBookmarked: false,
    scheme: '2022 Scheme',
    semester: 6,
    branch: 'CSE',
    contentSnippet: 'Support vectors are the critical data points that lie directly on the margins (w.x + b = ±1). Removing any other data point does not affect the optimal hyperplane...'
  },
  {
    id: 'not_05',
    subjectCode: 'BCS603',
    subjectName: 'Compiler Design',
    moduleNumber: 3,
    title: 'LALR & CLR Parsing Table Construction With Stepwise Derivation',
    description: 'Complete tutorial on canonical collections of LR(0) and LR(1) items, lookahead propagation, and resolving shift-reduce / reduce-reduce conflicts for VTU exam.',
    author: 'Prof. Ananya Rao',
    authorRole: 'Faculty (DSCE)',
    fileType: 'PDF',
    fileSize: '5.1 MB',
    pages: 48,
    downloads: 1530,
    bookmarks: 390,
    rating: 4.8,
    uploadDate: '2026-03-10',
    isBookmarked: false,
    scheme: '2022 Scheme',
    semester: 6,
    branch: 'CSE',
    contentSnippet: 'An LR(1) item is of the form [A -> alpha . beta, a], where A -> alpha beta is a production and a is a lookahead terminal or the endmarker $...'
  },
  {
    id: 'not_06',
    subjectCode: 'BCS604',
    subjectName: 'Cryptography & Network Security',
    moduleNumber: 2,
    title: 'RSA & Diffie-Hellman Key Exchange with Modular Arithmetic',
    description: 'Easy-to-follow guide with prime generation, Euler totient calculation, private key derivation d = e^-1 mod phi(n), and man-in-the-middle vulnerability mitigation.',
    author: 'Aditya Kulkarni',
    authorRole: 'Student (BIT)',
    fileType: 'PDF',
    fileSize: '3.1 MB',
    pages: 28,
    downloads: 1120,
    bookmarks: 240,
    rating: 4.6,
    uploadDate: '2026-03-15',
    isBookmarked: true,
    scheme: '2022 Scheme',
    semester: 6,
    branch: 'CSE',
    contentSnippet: 'Choose primes p=17, q=11. Compute n = 187, phi(n) = 160. Choose e = 7 (gcd(7, 160) = 1). Compute d = 23 (7*23 = 161 = 1 mod 160). Public: (7, 187), Private: (23, 187)...'
  }
];

export const MOCK_QUESTION_PAPERS = [
  {
    id: 'qp_2025_bcs601',
    subjectCode: 'BCS601',
    subjectName: 'Cloud Computing',
    examType: 'SEE (Semester End Exam)',
    year: 'Jan / Feb 2025',
    scheme: '2022 Scheme',
    semester: 6,
    branch: 'CSE',
    fileSize: '1.8 MB',
    downloads: 3200,
    maxMarks: 100,
    duration: '3 Hours',
    hasSolutions: true,
    modulesCovered: 'All Modules (1 to 5)',
    description: 'Official VTU Question Paper with full marking scheme, solved solutions and model answers.'
  },
  {
    id: 'qp_2024_bcs601',
    subjectCode: 'BCS601',
    subjectName: 'Cloud Computing',
    examType: 'SEE (Semester End Exam)',
    year: 'June / July 2024',
    scheme: '2022 Scheme',
    semester: 6,
    branch: 'CSE',
    fileSize: '1.6 MB',
    downloads: 2850,
    maxMarks: 100,
    duration: '3 Hours',
    hasSolutions: true,
    modulesCovered: 'All Modules (1 to 5)',
    description: 'Official VTU Semester End Examination paper with faculty-verified answer keys.'
  },
  {
    id: 'qp_2025_bcs602',
    subjectCode: 'BCS602',
    subjectName: 'Machine Learning',
    examType: 'SEE (Semester End Exam)',
    year: 'Jan / Feb 2025',
    scheme: '2022 Scheme',
    semester: 6,
    branch: 'CSE',
    fileSize: '2.1 MB',
    downloads: 4100,
    maxMarks: 100,
    duration: '3 Hours',
    hasSolutions: true,
    modulesCovered: 'All Modules (1 to 5)',
    description: 'High-yield paper with 20 marks numerical on Decision Trees and Bayes theorem.'
  },
  {
    id: 'qp_model_bcs603',
    subjectCode: 'BCS603',
    subjectName: 'Compiler Design',
    examType: 'VTU Model Question Paper',
    year: '2024 - 2025',
    scheme: '2022 Scheme',
    semester: 6,
    branch: 'CSE',
    fileSize: '1.4 MB',
    downloads: 2100,
    maxMarks: 100,
    duration: '3 Hours',
    hasSolutions: true,
    modulesCovered: 'Full Syllabus',
    description: 'Official VTU Curriculum Board issued Model Question Paper for 2022 Scheme.'
  },
  {
    id: 'qp_2024_cie1_bcs601',
    subjectCode: 'BCS601',
    subjectName: 'Cloud Computing',
    examType: 'CIE-1 (Internal Assessment)',
    year: 'Oct 2024',
    scheme: '2022 Scheme',
    semester: 6,
    branch: 'CSE',
    fileSize: '850 KB',
    downloads: 980,
    maxMarks: 50,
    duration: '90 Mins',
    hasSolutions: false,
    modulesCovered: 'Module 1 & 2',
    description: 'Standard Internal Assessment paper covering Virtualization and Cloud Service Models.'
  }
];

export const MOCK_DISCUSSIONS = [
  {
    id: 'disc_101',
    title: 'How should I prepare for VTU SEE examinations in 6th Sem with only 3 weeks left?',
    author: 'Karthik Gowda',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    branch: 'CSE',
    college: 'RVCE',
    timestamp: '2 hours ago',
    upvotes: 48,
    hasUpvoted: false,
    isBookmarked: true,
    tags: ['Exam Prep', '6th Sem', 'VTU Strategy', 'SEE 2026'],
    answersCount: 14,
    acceptedAnswer: {
      author: 'Dr. Sudha Ramamurthy',
      authorRole: 'Faculty (BMSCE)',
      authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
      timestamp: '1 hour ago',
      content: '1. Start by solving the 2024 and 2025 SEE papers — in VTU 2022 scheme, at least 60% of question patterns repeat.\n2. In BCS601 (Cloud), thoroughly prepare Module 1 architectures and Module 3 HDFS.\n3. In BCS602 (ML), do not skip the numerical problems on Decision Tree ID3 and Naive Bayes.\n4. Practice drawing diagrams: VTU evaluators award maximum marks for clear architectural block diagrams!',
      upvotes: 35
    }
  },
  {
    id: 'disc_102',
    title: 'Cloud Computing BCS601: What is the exact difference between MapReduce and Apache Spark for Module 4?',
    author: 'Pooja Hegde',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    branch: 'ISE',
    college: 'MSRIT',
    timestamp: '5 hours ago',
    upvotes: 29,
    hasUpvoted: true,
    isBookmarked: false,
    tags: ['BCS601', 'Cloud Computing', 'MapReduce', 'Hadoop'],
    answersCount: 8,
    acceptedAnswer: null
  },
  {
    id: 'disc_103',
    title: 'Any suggestions for IEEE based Final Year capstone projects that comply with VTU Phase-1 rubric?',
    author: 'Vishal Nayak',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    branch: 'CSE',
    college: 'DSCE',
    timestamp: '1 day ago',
    upvotes: 62,
    hasUpvoted: false,
    isBookmarked: false,
    tags: ['Final Year Project', 'IEEE', 'Capstone', 'AI/ML'],
    answersCount: 21,
    acceptedAnswer: null
  }
];

export const MOCK_EVENTS = [
  {
    id: 'evt_01',
    title: 'VTU InnoTech 2026 — State-Level 48-Hour Hackathon',
    category: 'Hackathon',
    date: 'April 18 - 20, 2026',
    time: '9:00 AM IST onwards',
    location: 'BMSCE Campus Auditorium & Incubation Center, Bengaluru',
    organizer: 'VTU Innovation Cell & IEEE Student Branch',
    mode: 'In-Person',
    prizePool: '₹1,50,000 Cash Prize + Incubation Grant',
    image: '/assets/campus_collab.jpg',
    spotsLeft: 34,
    registered: true,
    tags: ['AI/ML', 'Web3', 'IoT', 'CleanTech'],
    description: 'The premier statewide innovation hackathon for engineering students across all 200+ VTU affiliated institutions. Build transformative software and hardware prototypes with mentorship from industry architects.'
  },
  {
    id: 'evt_02',
    title: 'Generative AI & LLM Systems: Hands-On Architecture Workshop',
    category: 'Workshop',
    date: 'April 5, 2026',
    time: '2:00 PM – 6:00 PM IST',
    location: 'Live Virtual Workshop (Google Meet + Discord Lab)',
    organizer: 'Google Developer Student Clubs (GDSC VTU Hub)',
    mode: 'Online',
    prizePool: 'Google Cloud Credits ($100 per participant)',
    image: '/assets/hero_mesh.jpg',
    spotsLeft: 120,
    registered: false,
    tags: ['Generative AI', 'LangChain', 'RAG', 'Vector DBs'],
    description: 'Learn to design, fine-tune, and deploy production-grade RAG applications, vector databases (Pinecone/Milvus), and local LLM pipelines using Ollama.'
  },
  {
    id: 'evt_03',
    title: 'All-Karnataka VTU Competitive Coding Sprint 2026',
    category: 'Coding Contest',
    date: 'April 12, 2026',
    time: '6:00 PM – 9:00 PM IST',
    location: 'Codeforces / HackerRank Arena',
    organizer: 'VTU Coding Society & RVCE ACM Chapter',
    mode: 'Online',
    prizePool: '₹50,000 + Direct Interview Shortlists at Top Startups',
    image: '/assets/hero_mesh.jpg',
    spotsLeft: 450,
    registered: false,
    tags: ['Data Structures', 'Algorithms', 'Dynamic Programming'],
    description: 'Test your algorithmic agility across 6 challenging problem statements curated by competitive programming champions and ex-FAANG engineers.'
  },
  {
    id: 'evt_04',
    title: 'Campus-to-Corporate: Tier-1 Placement Masterclass & Mock Interviews',
    category: 'Career Session',
    date: 'April 25, 2026',
    time: '10:00 AM – 4:00 PM IST',
    location: 'Sir M. Visvesvaraya Memorial Hall, Belagavi & Streamed Live',
    organizer: 'VTU Central Placement Cell',
    mode: 'Hybrid',
    prizePool: 'Free 1-on-1 Resume Reviews for all attendees',
    image: '/assets/campus_collab.jpg',
    spotsLeft: 75,
    registered: true,
    tags: ['System Design', 'Behavioral Interviews', 'Resume Strategy'],
    description: 'Exclusive session with hiring directors from Microsoft, Cisco, and Razorpay sharing what sets apart top 1% VTU candidates in campus drives.'
  }
];

export const MOCK_JOBS = [
  {
    id: 'job_01',
    company: 'Google',
    logo: 'https://www.google.com/favicon.ico',
    role: 'Software Engineering Intern (Summer 2026)',
    type: 'Internship',
    employmentType: 'Full-time Internship',
    location: 'Bengaluru, Karnataka',
    isRemote: false,
    stipend: '₹1,25,000 / month',
    eligibility: 'VTU B.E / B.Tech (CSE, ISE, ECE) with CGPA >= 8.0, 2026 batch',
    skills: ['C++', 'Java', 'Python', 'Algorithms', 'Data Structures', 'System Fundamentals'],
    deadline: 'April 15, 2026',
    appliedDate: '2026-03-20',
    status: 'Interview', // 'Saved' | 'Applied' | 'Shortlisted' | 'Interview' | 'Selected'
    description: 'Work with world-class engineering teams building distributed cloud infrastructure, Google Search services, and scalable web platforms.',
    applicationUrl: 'https://careers.google.com'
  },
  {
    id: 'job_02',
    company: 'Microsoft',
    logo: 'https://www.microsoft.com/favicon.ico',
    role: 'Software Development Engineer - 1',
    type: 'Job',
    employmentType: 'Full-time',
    location: 'Bengaluru / Hyderabad',
    isRemote: false,
    stipend: '₹24 - ₹28 LPA',
    eligibility: 'VTU 2026 graduating batch, no active backlogs, CGPA >= 7.5',
    skills: ['C#', 'Java', 'Azure', 'Microservices', 'Distributed Systems'],
    deadline: 'April 30, 2026',
    appliedDate: '2026-03-15',
    status: 'Shortlisted',
    description: 'Join Azure Core Systems or Microsoft 365 engineering teams to solve high-throughput cloud reliability challenges.',
    applicationUrl: 'https://careers.microsoft.com'
  },
  {
    id: 'job_03',
    company: 'Oracle Cloud Infrastructure',
    logo: 'https://www.oracle.com/favicon.ico',
    role: 'Cloud Systems Software Engineer',
    type: 'Job',
    employmentType: 'Full-time',
    location: 'Bengaluru, Karnataka',
    isRemote: false,
    stipend: '₹18 - ₹22 LPA',
    eligibility: 'B.E/B.Tech in Computer Science / IT / ECE, CGPA >= 7.0',
    skills: ['Java', 'Linux Internals', 'Virtualization', 'Docker', 'Kubernetes'],
    deadline: 'May 10, 2026',
    appliedDate: '2026-03-22',
    status: 'Applied',
    description: 'Engineer high-performance cloud hypervisors and storage architectures within the Oracle OCI global network.',
    applicationUrl: 'https://oracle.com/careers'
  },
  {
    id: 'job_04',
    company: 'Cisco Systems',
    logo: 'https://www.cisco.com/favicon.ico',
    role: 'Network Software Engineer (New Grad 2026)',
    type: 'Job',
    employmentType: 'Full-time',
    location: 'Bengaluru, Karnataka',
    isRemote: false,
    stipend: '₹16.5 - ₹19.2 LPA',
    eligibility: 'VTU All Affiliated Colleges, 65% or 7.0 CGPA aggregate',
    skills: ['C', 'Python', 'Networking Protocols (TCP/IP)', 'Linux', 'Network Security'],
    deadline: 'May 05, 2026',
    appliedDate: null,
    status: 'Saved',
    description: 'Build robust network operating system kernels and next-generation routing fabric for enterprise cloud backbones.',
    applicationUrl: 'https://cisco.com/careers'
  },
  {
    id: 'job_05',
    company: 'Swiggy',
    logo: 'https://www.swiggy.com/favicon.ico',
    role: 'Frontend Engineering Intern (Product Apps)',
    type: 'Internship',
    employmentType: 'Internship',
    location: 'Remote / Bengaluru',
    isRemote: true,
    stipend: '₹55,000 / month',
    eligibility: 'VTU 2026 / 2027 batch with proven React / Web development projects',
    skills: ['React', 'TypeScript', 'Web Performance', 'REST APIs', 'CSS Architecture'],
    deadline: 'April 20, 2026',
    appliedDate: '2026-03-24',
    status: 'Applied',
    description: 'Help build ultra-responsive consumer web interfaces serving millions of orders every day across 500+ Indian cities.',
    applicationUrl: 'https://careers.swiggy.com'
  },
  {
    id: 'job_06',
    company: 'Infosys Springboard',
    logo: 'https://www.infosys.com/favicon.ico',
    role: 'Specialist Programmer (Power Programmer)',
    type: 'Job',
    employmentType: 'Full-time',
    location: 'Bengaluru / Mysuru / Pune',
    isRemote: false,
    stipend: '₹9.5 - ₹11 LPA',
    eligibility: 'All VTU branches, HackWithInfy qualifiers or direct campus selection',
    skills: ['Java', 'Python', 'Spring Boot', 'Cloud Architecture', 'RDBMS'],
    deadline: 'May 20, 2026',
    appliedDate: '2026-03-01',
    status: 'Selected',
    description: 'Elite programming cadre focused on deep technology stacks, complex digital transformations and AI system integration.',
    applicationUrl: 'https://infosys.com/careers'
  }
];

export const MOCK_STUDY_GROUPS = [
  {
    id: 'grp_01',
    name: 'VTU 2026 CSE Bangalore Chapter',
    description: 'Active collective of 6th semester Computer Science students sharing class notes, syllabus clarifications, lab viva questions, and project ideas.',
    membersCount: 1420,
    branch: 'CSE',
    semester: '6th Sem',
    coverImage: '/assets/campus_collab.jpg',
    isMember: true,
    recentActivity: 'Aarav shared "Cloud Computing Module 3 Notes"',
    postsCount: 248
  },
  {
    id: 'grp_02',
    name: 'Cloud Computing & AWS Certification Hub',
    description: 'Focused study squad for BCS601 and AWS Solutions Architect Associate prep. Daily quizzes and architecture teardowns.',
    membersCount: 460,
    branch: 'All Branches',
    semester: 'All Semesters',
    coverImage: '/assets/hero_mesh.jpg',
    isMember: true,
    recentActivity: 'Pooja posted a quiz on AWS IAM Policies',
    postsCount: 115
  },
  {
    id: 'grp_03',
    name: 'VTU Hackathon Innovators & Builders',
    description: 'Find team partners for Smart India Hackathon (SIH), VTU InnoTech, ETHIndia, and college tech fests.',
    membersCount: 890,
    branch: 'CSE / ISE / ECE',
    semester: 'All Semesters',
    coverImage: '/assets/campus_collab.jpg',
    isMember: false,
    recentActivity: 'Team looking for Backend dev with Spring Boot experience',
    postsCount: 340
  },
  {
    id: 'grp_04',
    name: 'Tier-1 Placement & DSA Grind 2026',
    description: 'Daily LeetCode discussions, system design mock interviews, and referral exchanges for VTU students.',
    membersCount: 2150,
    branch: 'All Branches',
    semester: '6th & 7th Sem',
    coverImage: '/assets/hero_mesh.jpg',
    isMember: true,
    recentActivity: 'Vikram shared "Top 75 VTU Placement Coding Questions PDF"',
    postsCount: 512
  }
];

export const MOCK_NOTIFICATIONS = [
  {
    id: 'notif_01',
    category: 'Academic',
    title: 'VTU 6th Semester SEE Draft Timetable Released',
    description: 'Examination department has published the tentative SEE timetable for 2022 Scheme. Exams commence June 15, 2026.',
    timestamp: '25 mins ago',
    isRead: false,
    actionUrl: '#academics'
  },
  {
    id: 'notif_02',
    category: 'Placement',
    title: 'Shortlisted for Interview at Google!',
    description: 'Congratulations! Your profile has been shortlisted for Google Summer 2026 SWE Intern round. Check the placements tab.',
    timestamp: '2 hours ago',
    isRead: false,
    actionUrl: '#placements'
  },
  {
    id: 'notif_03',
    category: 'Academic',
    title: 'New BCS601 Module 4 Notes Uploaded by Prof. Sudha',
    description: 'Official verified notes for Distributed Storage & MapReduce are now available for download.',
    timestamp: '5 hours ago',
    isRead: false,
    actionUrl: '#notes'
  },
  {
    id: 'notif_04',
    category: 'Event',
    title: 'Registration Confirmed: VTU InnoTech 2026 Hackathon',
    description: 'Your team registration is confirmed for BMSCE Campus. Hackathon passes generated.',
    timestamp: '1 day ago',
    isRead: true,
    actionUrl: '#events'
  },
  {
    id: 'notif_05',
    category: 'Community',
    title: 'Dr. Sudha answered your question in the Discussion Forum',
    description: 'Your question regarding VTU SEE preparation strategy received an expert faculty reply.',
    timestamp: '1 day ago',
    isRead: true,
    actionUrl: '#community'
  }
];

export const MOCK_TESTIMONIALS = [
  {
    name: 'Sneha Hegde',
    usn: '1RV21CS112',
    college: 'R.V. College of Engineering, Bengaluru',
    branch: 'Computer Science',
    year: 'Class of 2025',
    quote: 'VTU Student Connect completely changed how we prepare for semester end exams. Having scheme-accurate notes and question papers sorted module-wise saved hundreds of hours!',
    role: 'Incoming SDE @ Microsoft'
  },
  {
    name: 'Karthik Gowda',
    usn: '1BM21IS045',
    college: 'BMS College of Engineering, Bengaluru',
    branch: 'Information Science',
    year: 'Class of 2026',
    quote: 'The placement tracker Kanban and the peer community are top-tier. Finding teammates for the VTU hackathon was effortless, and we went on to win the state round.',
    role: 'Hackathon Finalist & CSE Student'
  },
  {
    name: 'Ananya Sharma',
    usn: '1MS21EC019',
    college: 'Ramaiah Institute of Technology, Bengaluru',
    branch: 'Electronics & Communication',
    year: 'Class of 2026',
    quote: 'The personalized dashboard filters everything by your college, branch, and scheme. No more scrolling through random telegram channels with broken PDFs!',
    role: 'VTU Student Representative'
  }
];

export const MOCK_ADMIN_STATS = {
  totalStudents: 14280,
  activeToday: 8940,
  totalNotes: 25840,
  questionPapers: 5210,
  totalDownloads: 184500,
  registeredColleges: 218,
  activeEvents: 32,
  placedStudents: 1450,
  recentRegistrations: [
    { name: 'Rohan Deshmukh', usn: '1MS22CS105', college: 'MSRIT', branch: 'CSE', date: 'Just now', status: 'Active' },
    { name: 'Bhavana S', usn: '1RV22IS034', college: 'RVCE', branch: 'ISE', date: '5 mins ago', status: 'Active' },
    { name: 'Varun Kulkarni', usn: '1BM22EC089', college: 'BMSCE', branch: 'ECE', date: '12 mins ago', status: 'Active' },
    { name: 'Megha Patil', usn: '2GI22CS044', college: 'GIT Belagavi', branch: 'CSE', date: '25 mins ago', status: 'Pending Verification' },
    { name: 'Siddharth Rao', usn: '1PE22AI012', college: 'PESIT', branch: 'AIML', date: '40 mins ago', status: 'Active' }
  ],
  pendingModeration: [
    { id: 'mod_1', title: 'Compiler Design Module 5 Hand-Written Scans', author: 'Vikram R', type: 'Note', date: 'Today', status: 'Pending Review' },
    { id: 'mod_2', title: 'Question Regarding CIE Re-evaluation Malpractice', author: 'Anonymous', type: 'Question', date: 'Yesterday', status: 'Flagged for Review' },
    { id: 'mod_3', title: 'Off-Campus Drive Scam Alert: Cognizant Impersonation', author: 'Placement Cell', type: 'Announcement', date: 'Yesterday', status: 'Verified' }
  ]
};
