# User Management with Authentication

A **full-stack web application** featuring secure **user registration, authentication, and management**. Built with **React (frontend)** and **Node.js/Express (backend)**, with JWT-based authentication and a connected database.

## Features

-    **User Registration & Login**
    
-    **JWT Authentication** with secure session handling
    
-    **Protected Routes** (Dashboard access only after login)
    
-    **User Management** (view users)
    
-    Full-stack setup with **React + Express + Database**


## 📂 Project Structure

```
.
├── client/           # React frontend
│   ├── components/   # UI Components (Login, Register, Dashboard)
│   ├── contexts/     # React Context API for authentication
│   ├── services/     # API calls & services
│   └── types/        # Type definitions (if TypeScript is used)
│
├── server/           # Node.js backend
│   ├── middleware/   # Auth & request validation middleware
│   ├── routes/       # API endpoints (auth, users)
│   ├── database.js   # Database connection
│   └── env.example   # Example environment variables
│
├── package.json      # Project metadata & dependencies

```


## Getting Started

### Prerequisites

-   [Node.js](https://nodejs.org/) (v14+ recommended)
    
-   npm or yarn package manager
    

### Setup & Installation

1️⃣ **Clone the repository**

```bash
git clone <repo-url>
cd <repo-folder>

```

2️⃣ **Install dependencies**

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install

```

3️⃣ **Configure environment variables**

```bash
# Copy the example file
cp server/env.example server/.env

```

-   Add your database URI and JWT secret inside `.env`
    

4️⃣ **Run the project**

```bash
# Start backend server (http://localhost:5000)
cd server
npm start

# Start frontend client (http://localhost:3000)
cd ../client
npm start

```

 **Contributions are welcome** — Open an issue or create a pull request if you’d like to improve something.
