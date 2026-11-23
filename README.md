# EventFlow — College Event Management System

React + Vite + Tailwind, Node.js + Express, MongoDB/Mongoose, JWT.

## Included
- Student registration/login; admin and organizer roles
- Event creation, listing, editing, cancellation and capacity-aware registration
- Registration QR codes; organizer QR scanner and manual attendance
- Database-backed in-app notifications and announcements
- PDF participation certificates after attendance
- Dashboard metrics and CSV report export

## Windows setup
1. Extract ZIP and open `EventFlow` in VS Code.
2. Copy `server/.env.example` to `server/.env`; set `MONGODB_URI` and a long `JWT_SECRET`.
3. In PowerShell:
   ```powershell
   cd server
   npm install
   npm run seed
   npm run dev
   ```
4. Open a second terminal:
   ```powershell
   cd client
   npm install
   npm run dev
   ```
5. Open the URL Vite prints, normally `http://localhost:5173`.

## Demo logins
Admin: `admin@eventflow.local` / `Admin123!`
Organizer: `organizer@eventflow.local` / `Organizer123!`
Student: `student@eventflow.local` / `Student123!`

## MongoDB Atlas Free
Create a free cluster and database user, add your current IP under Network Access, choose Connect → Drivers → Node.js and copy the URI. Put it in `server/.env` as `MONGODB_URI`. If the password has special characters, URL-encode it. Never share `.env` or put secrets in the frontend.

QR camera access requires browser permission and localhost/HTTPS. Notifications are in-app; no paid email/SMS service is used. This is a college demo project: test thoroughly before real-world deployment.
