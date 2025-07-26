# 🥘 Saving for Street Food – MERN Stack Project Guide

A web app that helps street food vendors collaboratively purchase raw materials, access trusted suppliers, and manage wallet-based transactions.

---

## 🔧 Tech Stack

- **Frontend**: React (Vite), Tailwind CSS
- **Backend**: Express.js + MongoDB (Mongoose)
- **Database**: MongoDB Atlas
- **Auth**: JWT (JSON Web Token)
- **State Management**: Context API (or Redux if needed)
- **Deployment**: Vercel (frontend), Render/Cyclic (backend)

---

## 📁 Folder Structure

### 🖥️ Client (Frontend)
Frontend/
├── public/
├── src/
│ ├── assets/
│ ├── components/
│ ├── pages/
│ ├── context/
│ ├── hooks/
│ ├── utils/
│ ├── App.jsx
│ ├── main.jsx
├── tailwind.config.js
├── index.html
├── package.json


### 🔙 Server (Backend)


server/
├── controllers/
├── models/
├── routes/
├── middleware/
├── config/
│ └── db.js
├── index.js
├── .env
├── package.json