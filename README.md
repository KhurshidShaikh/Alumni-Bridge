<p align="center">
  <img src="https://img.shields.io/badge/Alumni-Bridge-0066FF?style=for-the-badge&logoColor=white&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBhdGggZD0iTTIyIDEwdjZNMiAxMGw1LjUtNUwxMiA4bDQuNS0zTDIyIDEwbC01LjUtMy41TDEyIDE0IDcuNSA2LjVMMiAxMHoiLz48cGF0aCBkPSJNNiAxMnY2YTIgMiAwIDAgMCAyIDJoOGEyIDIgMCAwIDAgMi0ydi02Ii8+PC9zdmc+" alt="AlumniBridge" />
</p>

<h1 align="center">🎓 AlumniBridge</h1>

<p align="center">
  <strong>The Premier Alumni Networking Platform — Connecting Graduates, Building Futures</strong>
</p>

<p align="center">
  <a href="#features"><img src="https://img.shields.io/badge/Features-20+-blue?style=flat-square" alt="Features" /></a>
  <img src="https://img.shields.io/badge/React-19.1-61DAFB?style=flat-square&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-Express_5-339933?style=flat-square&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Socket.IO-Realtime-010101?style=flat-square&logo=socket.io&logoColor=white" alt="Socket.IO" />
  <img src="https://img.shields.io/badge/Gemini_AI-Chatbot-4285F4?style=flat-square&logo=google&logoColor=white" alt="Gemini AI" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="MIT License" />
</p>

<p align="center">
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-architecture">Architecture</a> •
  <a href="#-deployment">Deployment</a> •
  <a href="#-contributing">Contributing</a>
</p>

---

## 📖 About

**AlumniBridge** is a comprehensive, full-stack alumni networking platform designed for college communities. It empowers graduates to stay connected, discover career opportunities, share success stories, and give back to their alma mater — all within a modern, real-time web application.

Built for **Datta Meghe College of Engineering**, AlumniBridge brings together students, alumni, and administrators on a single platform with role-based access, real-time chat, AI-powered assistance, and a full-featured admin dashboard.

---

## ✨ Features

### 👥 For Alumni & Students
| Feature | Description |
|---|---|
| **🏠 Dashboard** | Personalized home feed with stats, recent alumni, upcoming events & job postings |
| **👤 Rich Profiles** | Detailed profiles with bio, work history, skills, LinkedIn/GitHub links & resume uploads |
| **🔍 Alumni Directory** | Search & filter alumni by name, batch, branch, company, and location |
| **🤝 Connections** | Send, accept, and manage connection requests — build your professional network |
| **💬 Real-Time Chat** | Instant messaging with Socket.IO — message read receipts & conversation history |
| **💼 Job Board** | Browse, post, and apply to jobs with advanced filters (type, location, experience, salary) |
| **📋 Job Applications** | Apply with resume & cover letter — track application status (pending → reviewed → shortlisted → hired) |
| **📅 Events** | Discover & register for alumni meetups, reunions, workshops, and networking sessions |
| **📰 News & Stories** | Community feed for sharing posts, success stories, and announcements |
| **🤖 AI Chatbot** | Gemini-powered intelligent assistant for campus and platform queries |
| **⚙️ Settings** | Account management, notification preferences & profile customization |

### 🔐 For Administrators
| Feature | Description |
|---|---|
| **📊 Admin Dashboard** | Overview of platform metrics & activity at a glance |
| **👥 User Management** | Verify accounts, manage roles (student/alumni/admin), and moderate users |
| **📣 Announcements** | Create & broadcast announcements to the entire alumni community |
| **📅 Event Management** | Full CRUD for events — create, edit, publish and track registrations |
| **💼 Job Management** | Review, approve, and moderate job postings |
| **📝 Content Management** | Moderate news/stories and community posts |
| **📤 Bulk Import** | CSV-based bulk user import for batch onboarding |
| **📈 Analytics** | Platform-wide insights — user growth, engagement metrics, job placement stats |
| **📜 Admin Logs** | Audit trail of all administrative actions for accountability |
| **💬 Admin Messaging** | Communicate with users directly from the admin panel |

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 19** | UI Library with modern hooks & concurrent features |
| **Vite 7** | Lightning-fast build tool & dev server |
| **Tailwind CSS 4** | Utility-first CSS framework |
| **React Router 7** | Client-side routing & navigation |
| **Redux Toolkit** | Global state management |
| **Socket.IO Client** | Real-time bidirectional communication |
| **Radix UI** | Accessible, unstyled component primitives |
| **Lucide React** | Beautiful & consistent icon system |
| **Sonner** | Toast notifications |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js + Express 5** | Web server & RESTful API |
| **MongoDB + Mongoose** | NoSQL database & ODM |
| **Socket.IO** | WebSocket server for real-time chat |
| **JWT** | Stateless authentication |
| **Cloudinary** | Cloud image storage & optimization |
| **Multer** | File upload handling |
| **Nodemailer** | Email notifications & OTP delivery |
| **Google Gemini AI** | AI-powered chatbot responses |
| **bcryptjs** | Password hashing |
| **csv-parser** | Bulk user import from CSV files |

---

## 🏗️ Architecture

```
AlumniBridge/
├── client/                     # React Frontend (Vite)
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── ui/             # Radix-based design system (Button, Card, etc.)
│   │   │   ├── Sidebar.jsx     # Navigation sidebar
│   │   │   ├── BottomBar.jsx   # Mobile bottom navigation
│   │   │   ├── Chatbot.jsx     # AI chatbot widget
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/              # Route-level page components
│   │   │   ├── Admin/          # Admin panel pages (12 modules)
│   │   │   ├── LandingPage.jsx
│   │   │   ├── HomePage.jsx    # Dashboard
│   │   │   ├── AlumniPage.jsx  # Alumni directory
│   │   │   ├── JobsPage.jsx    # Job board
│   │   │   ├── ChatPage.jsx    # Real-time messaging
│   │   │   ├── EventsPage.jsx
│   │   │   └── ...
│   │   ├── services/           # API service layers
│   │   ├── store/              # Redux store & slices
│   │   ├── hooks/              # Custom React hooks
│   │   ├── config/             # App configuration
│   │   └── styles/             # Global styles
│   ├── vercel.json             # Vercel SPA rewrite config
│   └── vite.config.js
│
├── server/                     # Node.js Backend (Express)
│   ├── config/
│   │   ├── mongoDB.js          # Database connection
│   │   ├── cloudinary.js       # Image upload config
│   │   ├── socket.js           # Socket.IO setup
│   │   └── email.js            # Email transporter
│   ├── controllers/            # Business logic (11 controllers)
│   │   ├── Authentication.js
│   │   ├── Admin.js            # Full admin operations
│   │   ├── Job.js              # Job CRUD + applications
│   │   ├── Message.js          # Chat & conversations
│   │   ├── Connection.js       # Connection request flows
│   │   ├── Chatbot.js          # Gemini AI integration
│   │   └── ...
│   ├── models/                 # Mongoose schemas (13 models)
│   ├── routes/                 # Express route definitions
│   ├── middlewere/             # Auth & validation middleware
│   ├── services/               # External service integrations
│   └── index.js                # Server entry point
│
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** v18+ and **npm**
- **MongoDB** (local or [Atlas](https://www.mongodb.com/atlas))
- **Cloudinary** account (for image uploads)
- **Google Gemini API key** (for AI chatbot)

### 1. Clone the Repository

```bash
git clone https://github.com/KhurshidShaikh/Alumni-Bridge.git
cd Alumni-Bridge
```

### 2. Setup the Backend

```bash
cd server
npm install
```

Create `server/.env`:

```env
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL=your_email@gmail.com
PASSWORD=your_app_password

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# AI Chatbot
GEMINI_API_KEY=your_gemini_api_key

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

Start the server:

```bash
npm start          # Production
npm run server     # Development (with nodemon)
```

### 3. Setup the Frontend

```bash
cd ../client
npm install
```

Create `client/.env`:

```env
VITE_BACKEND_URL=http://localhost:3000
```

Start the development server:

```bash
npm run dev
```

### 4. Open in Browser

```
Frontend:  http://localhost:5173
Backend:   http://localhost:3000
```

---

## 🌐 Deployment

### Frontend → Vercel

1. Import your GitHub repo on [Vercel](https://vercel.com)
2. Set **Root Directory** to `client`
3. Add environment variable: `VITE_BACKEND_URL` = your Render backend URL
4. Deploy ✅

### Backend → Render

1. Create a **Web Service** on [Render](https://render.com)
2. Set **Root Directory** to `server`
3. **Build Command**: `npm install`
4. **Start Command**: `npm start`
5. Add all environment variables from your `.env`
6. Don't forget to set `FRONTEND_URL` to your Vercel URL (for CORS)
7. Deploy ✅

---

## 📸 Screenshots

<details>
<summary><strong>🏠 Landing Page</strong></summary>
<br>
Beautiful landing page with hero section, featured alumni, feature highlights, testimonials, and contact section with glassmorphism effects and smooth animations.
</details>

<details>
<summary><strong>📊 Dashboard</strong></summary>
<br>
Personalized dashboard showing platform stats (Total Alumni, Job Postings, Events), recent alumni list, upcoming events, latest job opportunities, and quick action buttons.
</details>

<details>
<summary><strong>💬 Real-Time Chat</strong></summary>
<br>
Full-featured chat interface with Socket.IO — conversation list, message bubbles, read receipts, and real-time message delivery.
</details>

<details>
<summary><strong>💼 Job Board</strong></summary>
<br>
Advanced job board with filters for job type, work mode, experience level, category, and salary range. Alumni can post jobs; students can apply with resume upload.
</details>

<details>
<summary><strong>🔧 Admin Panel</strong></summary>
<br>
Comprehensive admin dashboard with user management, event management, content moderation, analytics, bulk import, and audit logs.
</details>

---

## 🔌 API Endpoints

<details>
<summary><strong>Authentication</strong></summary>

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register new user |
| `POST` | `/api/auth/login` | Login with credentials |
</details>

<details>
<summary><strong>Profile</strong></summary>

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/profile` | Get current user profile |
| `PUT` | `/api/profile` | Update profile |
</details>

<details>
<summary><strong>Connections</strong></summary>

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/connections/send` | Send connection request |
| `PUT` | `/api/connections/accept` | Accept connection |
| `GET` | `/api/connections` | Get all connections |
</details>

<details>
<summary><strong>Jobs</strong></summary>

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/jobs` | List all jobs (with filters) |
| `POST` | `/api/jobs` | Create a job posting |
| `GET` | `/api/jobs/:id` | Get job details |
| `POST` | `/api/jobs/:id/apply` | Apply to a job |
</details>

<details>
<summary><strong>Messages</strong></summary>

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/messages` | Get conversations list |
| `GET` | `/api/messages/:id` | Get conversation messages |
| `POST` | `/api/messages` | Send a message |
</details>

<details>
<summary><strong>Events</strong></summary>

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/event` | List upcoming events |
| `POST` | `/api/event` | Create an event |
| `POST` | `/api/event/:id/register` | Register for an event |
</details>

<details>
<summary><strong>Posts & News</strong></summary>

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/posts` | Get community posts |
| `POST` | `/api/posts` | Create a post |
</details>

<details>
<summary><strong>Admin</strong></summary>

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/admin/users` | List all users |
| `PUT` | `/api/admin/users/:id/verify` | Verify a user |
| `GET` | `/api/admin/analytics` | Platform analytics |
| `POST` | `/api/admin/bulk-import` | Bulk import users via CSV |
| `GET` | `/api/admin/logs` | View admin audit logs |
</details>

<details>
<summary><strong>AI Chatbot</strong></summary>

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/chatbot` | Send message to AI chatbot |
</details>

---

## 🤝 Contributing

1. **Fork** the repository
2. **Create** your feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Khurshid Shaikh**

[![GitHub](https://img.shields.io/badge/GitHub-KhurshidShaikh-181717?style=flat-square&logo=github)](https://github.com/KhurshidShaikh)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=flat-square&logo=linkedin)](https://linkedin.com/in/khurshidshaikh)

---

<p align="center">
  <strong>⭐ If you found this project helpful, please give it a star!</strong>
</p>

<p align="center">
  Made with ❤️ for the DMCE Alumni Community
</p>
