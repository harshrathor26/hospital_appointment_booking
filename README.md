HEAD
# 🏥 MediBook — Hospital Appointment Booking System

A full-stack hospital appointment booking system built with **React.js** (frontend) and **Java Spring Boot** (backend) with **MySQL** database.

## Features

- 🔐 **JWT Authentication** with role-based access (Patient / Doctor / Admin)
- 📅 **Appointment Booking** — Patients can search doctors, book, and manage appointments
- 🩺 **Doctor Dashboard** — Doctors can accept/reject/complete appointments
- 🛡️ **Admin Dashboard** — System overview with stats
- 🎨 **Premium Dark UI** with glassmorphism, animations, and responsive design
- 🚀 **Production-Ready** with Docker, Netlify, and Render deployment configs

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js + Vite |
| Backend | Java Spring Boot 4 |
| Database | MySQL |
| Auth | Spring Security + JWT |
| Styling | Vanilla CSS (Dark Theme) |
| Deployment | Netlify (frontend) + Render (backend) |

## Quick Start (Local Development)

### Prerequisites
- Node.js 18+
- Java 17+
- MySQL 8+

### 1. Database Setup
```sql
CREATE DATABASE hospital_db;
```

### 2. Backend
```bash
cd backend
./mvnw spring-boot:run
```
> Departments are auto-seeded on first run. Backend runs on `http://localhost:8080`

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```
> Frontend runs on `http://localhost:5173` with API proxy to backend

### 4. Use the App
1. Open `http://localhost:5173`
2. Register as a Patient or Doctor
3. Log in and start booking appointments!

## Deployment

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for full instructions on deploying to Netlify + Render.

## Project Structure

```
hospital_appointment_booking/
├── backend/                    # Spring Boot backend
│   ├── src/main/java/com/hospital/backend/
│   │   ├── config/            # CORS, DataSeeder
│   │   ├── controller/        # REST controllers
│   │   ├── entity/            # JPA entities
│   │   ├── payload/           # Request/Response DTOs
│   │   ├── repository/        # JPA repositories
│   │   └── security/          # JWT + Spring Security
│   ├── Dockerfile
│   └── pom.xml
├── frontend/                   # React.js frontend
│   ├── src/
│   │   ├── components/        # Layout, PrivateRoute
│   │   ├── pages/             # Login, Register, Dashboards
│   │   └── services/          # API, Auth, Doctor, Appointment
│   ├── netlify.toml
│   └── vite.config.js
└── DEPLOYMENT_GUIDE.md
```

# hospital_appointment_booking

