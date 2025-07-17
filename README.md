# Scorezilla

A comprehensive event and sponsorship management platform with real-time analytics, user authentication, and interactive dashboards for Admins, Judges, Leaders, and Players.

---

## 🚀 Project Overview
Scorezilla is a full-stack web application designed to manage tournaments, teams, player scoring, and sponsor analytics. It features real-time updates, QR-based team joining, and a modern, responsive UI.

---

## ✨ Features
- User authentication (Admin, Judge, Leader, Player roles)
- Tournament and team management
- Real-time leaderboard and sponsor analytics (Socket.IO + Chart.js)
- QR code-based team joining
- Admin dashboard with tournament creation, WhatsApp notifications, and analytics
- Judge scoring interface
- Certificate generation for winners
- Responsive, modern UI (React + Tailwind CSS)

---

## 🛠️ Tech Stack
- **Frontend:** React, Chart.js, GSAP, Tailwind CSS, Axios
- **Backend (Authorization):** Django REST Framework
- **Backend (Real-time):** Node.js, Express, Socket.IO
- **Database:** SQLite (Django default)

---

## 📁 Folder Structure
```
Scorezilla/
  ├── Authorization-Backend/         # Django backend for user management
  │   └── authapi/
  ├── DripSyncFrontend/              # React frontend
  │   └── dripsync/
  │       ├── src/
  │       │   ├── Components/        # React components (pages, charts, dashboards, etc.)
  │       │   └── utils/             # API utilities
  │       └── public/                # Static assets
  │       └── package.json           # Frontend dependencies
  └── README.md                      # Project documentation
```

---

## ⚡ Setup Instructions

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd Scorezilla
```

### 2. Backend Setup (Django)
```bash
cd Authorization-Backend/authapi
pip install -r ../requirements.txt
python manage.py migrate
python manage.py runserver
```
- The Django backend will run on `http://localhost:8000/`

### 3. Frontend Setup (React)
```bash
cd ../../DripSyncFrontend/dripsync
npm install
npm start
```
- The React frontend will run on `http://localhost:3000/`

### 4. Real-time Server (Socket.IO)
```bash
cd src/Components
npm install express cors socket.io
node Server.js
```
- The Socket.IO server will run on `http://localhost:3001/`

---

## 📝 Usage
- Register as Admin, Judge, Leader, or Player.
- Admins can create tournaments, send WhatsApp notifications, and view sponsor analytics.
- Judges can score players and update team scores.
- Leaders can manage teams and generate certificates.
- All users can view real-time leaderboards and sponsor analytics.

---

## 📊 Demo
<!-- Add your screenshots or GIFs here -->

---

## 🤝 Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## 📄 License
[MIT](LICENSE)
