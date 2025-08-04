# User Management Application

A full-stack user management application built with **JavaScript**, **React**, **Express**, and **PostgreSQL**.

## Tech Stack

- **Frontend**: React, JavaScript
- **Backend**: Express.js, Node.js
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs

## Features

- User registration and authentication
- User management (view, block, unblock, delete users)
- JWT-based authentication
- Password hashing and validation
- User status tracking (active/blocked)
- Last login tracking
- Registration time tracking

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd task4
```

### 2. Install Dependencies

```bash
npm run install-all
```

### 3. PostgreSQL Setup

#### Option A: Using Docker (Recommended)

```bash
# Start PostgreSQL container
docker run --name postgres-user-management \
  -e POSTGRES_PASSWORD=your_password \
  -e POSTGRES_DB=user_management \
  -p 5432:5432 \
  -d postgres:15
```

#### Option B: Local PostgreSQL Installation

1. Install PostgreSQL on your system
2. Create a database named `user_management`
3. Create a user with appropriate permissions

### 4. Environment Configuration

Copy the environment example file and configure your database settings:

```bash
cd server
cp env.example .env
```

Edit the `.env` file with your PostgreSQL credentials:

```env
# Database Configuration
DB_USER=postgres
DB_HOST=localhost
DB_NAME=user_management
DB_PASSWORD=your_password
DB_PORT=5432

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key

# Server Port
PORT=5000
```

### 5. Start the Application

```bash
# Start both frontend and backend
npm run dev

# Or start them separately:
npm run server  # Backend only
npm run client  # Frontend only
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### User Management
- `GET /api/users` - Get all users (requires authentication)
- `PATCH /api/users/block` - Block selected users
- `PATCH /api/users/unblock` - Unblock selected users
- `DELETE /api/users/delete` - Delete selected users

## Database Schema

The application uses a single `users` table with the following structure:

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'blocked')),
  last_login TIMESTAMP,
  registration_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Features

### User Registration
- Name, email, and password validation
- Email uniqueness check
- Password hashing with bcryptjs
- Automatic JWT token generation

### User Authentication
- Email and password validation
- Account status checking (blocked users cannot login)
- Last login time tracking
- JWT token generation

### User Management
- View all users with sorting by last login
- Block/unblock multiple users
- Delete multiple users
- Real-time status updates

## Security Features

- Password hashing using bcryptjs
- JWT token authentication
- Input validation and sanitization
- SQL injection prevention using parameterized queries
- CORS configuration for frontend-backend communication

## Development

### Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── services/      # API service functions
│   │   └── App.js         # Main App component
│   └── package.json
├── server/                 # Express backend
│   ├── routes/            # API route handlers
│   ├── middleware/        # Express middleware
│   ├── database.js        # PostgreSQL configuration
│   └── package.json
└── package.json           # Root package.json
```

### Available Scripts

- `npm run dev` - Start both frontend and backend in development mode
- `npm run server` - Start backend server only
- `npm run client` - Start frontend development server only
- `npm run build` - Build frontend for production
- `npm run install-all` - Install dependencies for all packages

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Ensure PostgreSQL is running
   - Check database credentials in `.env` file
   - Verify database exists

2. **Port Already in Use**
   - Change PORT in `.env` file
   - Kill processes using the ports

3. **CORS Errors**
   - Ensure frontend is running on port 3000
   - Check CORS configuration in server

### Database Reset

To reset the database:

```sql
DROP TABLE IF EXISTS users;
```

The application will automatically recreate the table on startup.

## License

MIT License 