# MediBook — Deployment Guide

## Architecture Overview

```
┌─────────────────────┐     HTTPS      ┌──────────────────────┐     TCP      ┌─────────────┐
│   Netlify (Frontend) │ ──────────────▶│  Render (Backend)     │ ──────────▶│  MySQL (DB)  │
│   React.js SPA       │   /api/*       │  Spring Boot JAR      │            │  Aiven/Railway│
└─────────────────────┘                └──────────────────────┘            └─────────────┘
```

---

## Step 1: Deploy MySQL Database

### Option A: Aiven (Recommended — Free Tier)
1. Go to [https://aiven.io](https://aiven.io) and create a free account
2. Create a new **MySQL** service (Free plan)
3. Note down these values from the dashboard:
   - `Host` (e.g., `mysql-xxxxx.aiven.io`)
   - `Port` (e.g., `12345`)
   - `Database` (e.g., `defaultdb`)
   - `User` (e.g., `avnadmin`)
   - `Password`
4. Build your JDBC URL:
   ```
   jdbc:mysql://HOST:PORT/DATABASE?useSSL=true&serverTimezone=UTC
   ```

### Option B: Railway
1. Go to [https://railway.app](https://railway.app) and sign in with GitHub
2. Click **New Project** → **Provision MySQL**
3. Copy the connection details from the **Variables** tab

---

## Step 2: Deploy Backend on Render

1. Push the `backend/` folder to a **GitHub repository**
2. Go to [https://render.com](https://render.com) and sign in with GitHub
3. Click **New** → **Web Service**
4. Connect your GitHub repo and select the backend folder
5. Configure the service:

| Setting | Value |
|---------|-------|
| **Name** | `medibook-api` |
| **Runtime** | `Docker` |
| **Root Directory** | `backend` |
| **Instance Type** | Free |

6. Add these **Environment Variables**:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | `jdbc:mysql://your-db-host:port/database?useSSL=true&serverTimezone=UTC` |
| `DATABASE_USERNAME` | Your DB username |
| `DATABASE_PASSWORD` | Your DB password |
| `JWT_SECRET` | A long random Base64 string (64+ chars) |
| `PORT` | `8080` |

7. Click **Create Web Service** — Render will build and deploy using the Dockerfile
8. Note your backend URL (e.g., `https://medibook-api.onrender.com`)

---

## Step 3: Deploy Frontend on Netlify

1. Push the `frontend/` folder to a **GitHub repository** (same or separate repo)
2. Go to [https://app.netlify.com](https://app.netlify.com) and sign in
3. Click **Add new site** → **Import an existing project** → Select your repo
4. Configure build settings:

| Setting | Value |
|---------|-------|
| **Base directory** | `frontend` |
| **Build command** | `npm run build` |
| **Publish directory** | `frontend/dist` |

5. Add this **Environment Variable**:

| Variable | Value |
|----------|-------|
| `VITE_API_URL` | `https://medibook-api.onrender.com/api` |

> ⚠️ Replace with YOUR actual Render backend URL from Step 2

6. Click **Deploy site**

---

## Step 4: Verify the Deployment

1. Visit your Netlify URL (e.g., `https://medibook.netlify.app`)
2. You should see the login page
3. Click **Create one** to register a new patient account
4. Log in and test:
   - Browse doctors
   - Book an appointment
   - View appointments

---

## Running Locally (Development)

### Backend
```bash
cd backend

# Ensure MySQL is running locally with database 'hospital_db'
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS hospital_db;"

# Start Spring Boot
./mvnw spring-boot:run
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`. The Vite proxy will forward `/api/*` requests to `localhost:8080`.

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| CORS errors in browser | Check that `CorsConfig.java` is loaded and the backend URL is correct |
| 401 on all requests | Verify the JWT token is being sent — check browser DevTools → Network → Headers |
| Database connection refused | Verify `DATABASE_URL`, username, password are correct in Render env vars |
| Netlify shows blank page | Ensure the `_redirects` file is in `public/` and `netlify.toml` is present |
| Render build fails | Check the Dockerfile and ensure `mvnw` has execute permissions |
