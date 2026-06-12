
MediBook — Hospital Appointment Booking System

A full-stack hospital appointment booking system built with React.js(frontend) and Java Spring Boot(backend) with MySQL database.
## Features

-  **JWT Authentication** with role-based access (Patient / Doctor / Admin)
-  **Appointment Booking** — Patients can search doctors, book, and manage appointments
-  **Doctor Dashboard** — Doctors can accept/reject/complete appointments
-  **Admin Dashboard** — System overview with stats
-  **Premium Dark UI** with glassmorphism, animations, and responsive design
-  **Production-Ready** with Docker, Netlify, and Render deployment configs

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



