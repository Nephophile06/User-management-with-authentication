# User Management Application (JavaScript Version)

A complete user management web application built with **JavaScript**, React, Express, and PostgreSQL. Perfect for learning JavaScript and full-stack development!

## 🎯 Features

- ✅ **Unique Index in Database** - Email uniqueness guaranteed at database level
- ✅ **Professional Table & Toolbar** - Bootstrap-styled table with toolbar
- ✅ **Sorted Data** - Users sorted by last login time
- ✅ **Multiple Selection** - Checkboxes for select all/individual selection
- ✅ **Authentication Middleware** - Server checks user existence and status before each request
- ✅ **User Registration & Login** - Secure authentication system
- ✅ **User Management** - Block, unblock, and delete users
- ✅ **Responsive Design** - Works on desktop and mobile
- ✅ **Professional UI** - Bootstrap framework for consistent styling
- ✅ **Error Handling** - Comprehensive error messages and notifications

## 🛠️ Technology Stack

### Frontend (React + JavaScript)
- **React 18** - Modern React with hooks
- **React Router** - Client-side routing
- **Bootstrap 5** - CSS framework for styling
- **React Bootstrap** - Bootstrap components for React
- **Axios** - HTTP client for API calls
- **React Toastify** - Toast notifications

### Backend (Express + JavaScript)
- **Express.js** - Web framework for Node.js
- **PostgreSQL** - Relational database
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **express-validator** - Input validation
- **cors** - Cross-origin resource sharing

### Database
- **PostgreSQL** - Primary database
- **Unique Index** - Email uniqueness constraint
- **Proper Schema** - Users table with all required fields

## 📁 Project Structure

```
task4/
├── server/                 # Backend (Express + JavaScript)
│   ├── database.js        # Database configuration
│   ├── middleware/        # Authentication middleware
│   ├── routes/           # API routes
│   ├── index.js          # Main server file
│   └── package.json      # Server dependencies
├── client/                # Frontend (React + JavaScript)
│   ├── public/           # Static files
│   ├── src/              # React source code
│   │   ├── components/   # React components
│   │   ├── contexts/     # React contexts
│   │   ├── services/     # API services
│   │   ├── App.js        # Main app component
│   │   └── index.js      # Entry point
│   └── package.json      # Client dependencies
├── README.md             # This file
├── DEPLOYMENT.md         # Deployment instructions
└── package.json          # Root package.json
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** (version 16 or higher)
- **npm** (comes with Node.js)
- **PostgreSQL** (version 12 or higher)

### Step 1: Install Dependencies
```bash
# Install all dependencies (root, server, and client)
npm run install-all
```

### Step 2: Set Up Database
1. **Install PostgreSQL** if you haven't already
2. **Create a database** named `user_management`
3. **Update environment variables** in `server/.env`

### Step 3: Configure Environment
```bash
# Copy the example environment file
cp server/env.example server/.env

# Edit the .env file with your database details
# DB_USER=your_username
# DB_PASSWORD=your_password
# DB_HOST=localhost
# DB_NAME=user_management
# JWT_SECRET=your-secret-key
```

### Step 4: Start the Application
```bash
# Start both server and client
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 📋 Requirements Met

### ✅ Requirement #1: Unique Index in Database
- Created unique index on email field in PostgreSQL
- Database handles email uniqueness at storage level
- No application-level uniqueness checks needed

### ✅ Requirement #2: Professional Table & Toolbar
- Bootstrap-styled table with proper alignment
- Toolbar with Block, Unblock, and Delete buttons
- No buttons in individual rows
- Clean, business-oriented design

### ✅ Requirement #3: Sorted Data
- Users sorted by last login time (descending)
- Users with no login time appear last
- Secondary sort by registration time

### ✅ Requirement #4: Multiple Selection
- Checkboxes in leftmost column for each user
- "Select All" checkbox in table header
- Multiple users can be selected for bulk operations
- Visual feedback for selected users

### ✅ Requirement #5: Authentication Middleware
- Server checks user existence before each request
- Server verifies user is not blocked
- Automatic redirect to login if user is invalid/blocked
- JWT token validation

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### User Management
- `GET /api/users` - Get all users (sorted by last login)
- `PATCH /api/users/block` - Block selected users
- `PATCH /api/users/unblock` - Unblock selected users
- `DELETE /api/users/delete` - Delete selected users

## 🎨 User Interface

### Login/Register Pages
- Clean, centered forms
- Bootstrap styling
- Error handling and validation
- Responsive design

### Dashboard
- User management table
- Toolbar with action buttons
- Multiple selection checkboxes
- Status badges (active/blocked)
- Last login and registration times

## 🔒 Security Features

- **Password Hashing** - bcryptjs for secure password storage
- **JWT Authentication** - Secure token-based authentication
- **Input Validation** - Server-side validation for all inputs
- **CORS Protection** - Cross-origin request handling
- **SQL Injection Protection** - Parameterized queries
- **XSS Protection** - React's built-in XSS protection

## 🚀 Deployment

See `DEPLOYMENT.md` for detailed deployment instructions to various platforms:
- Railway (recommended for beginners)
- Heroku
- Vercel + Railway
- Local deployment

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check PostgreSQL is running
   - Verify database credentials in `.env`
   - Ensure database `user_management` exists

2. **Port Already in Use**
   - Change port in `.env` file
   - Kill processes using ports 3000/5000

3. **Module Not Found Errors**
   - Run `npm run install-all` again
   - Delete `node_modules` and reinstall

### Getting Help

1. Check the console for error messages
2. Verify all environment variables are set
3. Ensure PostgreSQL is running
4. Check network connectivity

## 📚 Learning Resources

This project demonstrates:
- **JavaScript ES6+** features
- **React Hooks** (useState, useEffect, useContext)
- **Express.js** routing and middleware
- **PostgreSQL** database operations
- **JWT** authentication
- **Bootstrap** styling
- **RESTful API** design

## 🤝 Contributing

Feel free to improve this project! Some ideas:
- Add user roles and permissions
- Implement user search and filtering
- Add user activity logs
- Create user profile pages
- Add email verification

## 📄 License

This project is open source and available under the MIT License. 