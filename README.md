# Student Connect – VTU Student Connect

A modern full-stack VTU educational resources, community, and placement web application built with a **React frontend**, pure **Java Jakarta Servlets backend**, **JDBC DAO layer**, and **MySQL database**.

Designed for Visvesvaraya Technological University (VTU) affiliated engineering students and academic administrators.

---

## Architecture Overview

```
                      +-----------------------------+
                      |   React.js SPA (Vite)       |
                      |  - Dark SaaS Glassmorphism  |
                      |  - React Router DOM v6      |
                      |  - Student & Admin Portals  |
                      +--------------+--------------+
                                     |
                                REST API
                                     |
                      +--------------v--------------+
                      |  Jakarta Java Servlets 6.0  |
                      |  - Embedded & Standalone    |
                      |  - AuthFilter & AdminFilter |
                      |  - Controller Layer         |
                      +--------------+--------------+
                                     |
                      +--------------v--------------+
                      |       Service Layer         |
                      |  (Auth, Resource, Placement)|
                      +--------------+--------------+
                                     |
                      +--------------v--------------+
                      |      Data Access (DAO)      |
                      |  (PreparedStatements/JDBC)  |
                      +--------------+--------------+
                                     |
                      +--------------v--------------+
                      |       MySQL Database        |
                      |   (18 Normalized Tables)    |
                      +-----------------------------+
```

---

## Key Features

### 🎓 Academic Curriculum & Notes Hub
- **Semesters 1 through 8:** Complete VTU 2022 Scheme CBCS curriculum mapping.
- **Dynamic Subject Breakdown:** Dynamic subject codes (e.g., `BCS601`, `21CS62`), credits, and departments loaded live from MySQL.
- **Official PDF Notes:** Unit 1 through Unit 5 faculty-authored PDF materials.
- **In-Browser PDF Viewer:** Zoom controls, watermark, document overview, and metadata sidebar.
- **Offline Tracking:** Direct PDF download tracking with download counters.
- **Saved Bookmarks:** Fast bookmark toggling for exam-eve revisions.

### ❓ Question Banks & SEE Solved Papers
- **Curated Question Banks:** Categorized into **2 Marks**, **5 Marks**, **10 Marks**, **Important**, **Frequently Asked**, **Conceptual**, and **Programming**.
- **Difficulty Badges:** Tagged with Easy, Medium, and Hard indicators with marking schemes.
- **Solved Previous Papers:** VTU Semester End Exam (SEE) question papers from 2022 to 2025 across Regular and Supplementary cycles.

### 💼 Placement Connect
- **Drive Listings:** Verified campus and pooled hiring drives (Google, AWS, Cisco Systems, Infosys, Mercedes-Benz).
- **Drive Details:** Real CTC compensation, eligibility cutoffs, location, batch, and required skills.
- **Interactive Application Modal:** Apply directly with public resume URLs and custom cover notes.
- **Status Tracking:** Visual badges displaying application status.

### 💬 Community Discussion & Peer Chat
- **Discussion Rooms:** General, Java, SQL, React, DBMS, Placements, and Doubts.
- **Live Sync Polling:** Periodic polling updates for active conversation flow.
- **Moderation Reporting:** Report abusive or inappropriate messages for administrator review.

### 🛡️ Administrative Portal
- **Protected Access:** Strict backend `AdminFilter` returning **HTTP 403 Forbidden** for non-admin accounts.
- **Real-Time Telemetry Cards:** Active counts for students, notes, question banks, previous papers, placements, downloads, and chat messages.
- **Safe PDF Upload:** Server-side file validation, 20MB threshold, and directory traversal protection.
- **Audit Logging:** Immutable administrative audit trail for all create, update, and delete actions.
- **Chat Moderation:** Review peer-reported messages and execute disciplinary deletions.

---

## Database Configuration

The application uses **MySQL 8.0+** with 18 normalized tables:
- `users`, `profiles`, `semesters`, `subjects`, `notes`, `question_banks`, `previous_year_papers`
- `placements`, `placement_applications`, `advertisements`, `chat_rooms`, `chat_messages`
- `message_reports`, `bookmarks`, `downloads`, `notifications`, `announcements`, `audit_logs`

### Database Setup

1. Start MySQL and log in:
```bash
mysql -u root -p
```

2. Create and seed the database using the provided scripts:
```bash
mysql -u root -p < backend/src/main/resources/schema-mysql.sql
mysql -u root -p < backend/src/main/resources/data-mysql.sql
```

3. Configure credentials in `backend/src/main/resources/application.properties`:
```properties
db.url=jdbc:mysql://localhost:3306/vtu_student_connect?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
db.user=root
db.password=081506
db.pool.size=10
```

---

## Running in Development

### 1. Start Java Servlet Backend
```bash
cd backend
mvn exec:java
```
The backend API initializes on `http://localhost:8080/api`.

### 2. Start React Frontend
```bash
cd frontend
npm install
npm run dev
```
The React development server runs on `http://localhost:5173`.

---

## Production Deployment (Apache Tomcat)

### 1. Build the React Frontend
```bash
cd frontend
npm run build
```
Generates production bundle in `frontend/dist/`.

### 2. Build the Java Web Archive (WAR)
```bash
cd backend
mvn clean package -DskipTests
```
This generates the standalone enterprise WAR file:
`backend/target/vtu-student-connect.war` (13 MB).

### 3. Deploy to Apache Tomcat 10
Copy the `.war` package into your Tomcat installation:
```bash
cp backend/target/vtu-student-connect.war $CATALINA_HOME/webapps/
$CATALINA_HOME/bin/startup.sh
```

---

## Demo Credentials

| Role | Email | Password |
|---|---|---|
| **Student** | `aarav.sharma@vtuconnect.in` | `password123` |
| **Admin** | `admin@vtuconnect.in` | `password123` |

*Both accounts can also be logged into using the one-click demo credentials pill on the Login Page (`/login`).*
