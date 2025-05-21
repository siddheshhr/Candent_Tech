# Candent Tech - Leads and Opportunity Management System

## 📌 Overview

The Leads and Opportunity Management System (LGO System) is designed for Candent Technologies Pvt Ltd to streamline lead generation and track potential clients, converting them into confirmed opportunities. This system enhances communication, provides tracking capabilities, and offers insights for decision-making.

## 🚀 Features

### Lead Management
- Capture lead details (Company Name, Industry, Contact Info, etc.)
- Track lead progress with customizable stages

### Opportunity Management
- Convert leads into opportunities with project details
- Retain all associated lead data during conversion

### Comment System
- Add comments on leads and opportunities
- Reply to existing comments for threaded discussions

### Search & Filtering
- Find leads/opportunities based on industry, tech stack, project domain, status, etc.

### Reporting & Analytics
- Generate customizable XLSX/PDF reports with insights on lead conversion, industry trends, and more

## 🛠 Tech Stack

- **Frontend**: React.js
- **Backend**: Node.js with Express.js
- **Database**: MongoDB Atlas
- **Authentication**: OAuth , JWT (JSON Web Tokens)

## ⚡ Installation & Setup

### Prerequisites
- Node.js
- npm 
- MongoDB Atlas account
- Git

### Clone the Repository
```bash
git clone https://github.com/siddheshhr/Candent_Tech.git
cd Candent_Tech
```

### Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```
MONGO=''
JWT_SECRET=''
RESET_PASSWORD_KEY=''
```

Start the backend server:
```bash
nodemon index.js
```

### Frontend Setup
```bash
cd ../frontend
npm install
```

Create a `.env` file in the frontend directory:
```
VITE_FIREBASE_API_KEY=''
```

Start the frontend development server:
```bash
npm run dev
```

The application should now be running at `http://localhost:5173`

## 🖥️ Project Structure

```
Candent_Tech/
├── backend/
│   ├── controllers/   # Business logic
│   ├── models/        # Database schemas
│   ├── routes/        # API endpoints
│   ├── middleware/    # Auth and validation
│   └── index.js       # Entry point
├── frontend/
│   ├── public/        # Static assets
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Main application views
│   │   ├── context/       # React context providers
│   │   └── services/      # API integration
│   └── index.html     # HTML entry
└── README.md
```

## 📫 Contact

For any inquiries, reach out to Candent Technologies Pvt Ltd at:


## 👨‍💻 Maintainers

This project is maintained by:

1. Siddhesh Raskar
2. Manish Sonawane
3. Aditya Wanve
4. Soham Shriram

---

&copy; 2025 Candent Technologies Pvt Ltd. All Rights Reserved.