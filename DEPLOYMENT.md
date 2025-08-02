# Deployment Guide

This guide will help you deploy the User Management Application to various platforms.

## Prerequisites

- Node.js application ready for deployment
- PostgreSQL database (local or cloud)
- Git repository

## Option 1: Deploy to Railway (Recommended for Beginners)

### 1. Database Setup
1. Go to [Railway](https://railway.app/)
2. Create a new project
3. Add a PostgreSQL database
4. Note the connection details

### 2. Backend Deployment
1. Connect your GitHub repository to Railway
2. Set environment variables:
   ```
   DB_USER=your_db_user
   DB_HOST=your_db_host
   DB_NAME=your_db_name
   DB_PASSWORD=your_db_password
   DB_PORT=5432
   JWT_SECRET=your-super-secret-jwt-key
   PORT=5000
   ```
3. Deploy the server directory

### 3. Frontend Deployment
1. Deploy to Vercel or Netlify
2. Set environment variable:
   ```
   REACT_APP_API_URL=https://your-railway-app-url.railway.app/api
   ```

## Option 2: Deploy to Heroku

### 1. Database Setup
1. Create a Heroku account
2. Add PostgreSQL addon to your app
3. Get the database URL

### 2. Backend Deployment
1. Install Heroku CLI
2. Create a new Heroku app
3. Set environment variables:
   ```bash
   heroku config:set DB_URL=your_postgresql_url
   heroku config:set JWT_SECRET=your-secret-key
   ```
4. Deploy:
   ```bash
   git push heroku main
   ```

### 3. Frontend Deployment
1. Build the React app:
   ```bash
   cd client
   npm run build
   ```
2. Deploy to Vercel or Netlify

## Option 3: Deploy to Vercel (Full Stack)

### 1. Database Setup
1. Use a cloud PostgreSQL service (Supabase, Neon, etc.)
2. Get connection details

### 2. Full Stack Deployment
1. Connect your repository to Vercel
2. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `client/build`
3. Set environment variables
4. Deploy

## Option 4: Local Deployment with Docker

### 1. Create Dockerfile for Backend
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"]
```

### 2. Create Dockerfile for Frontend
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### 3. Create docker-compose.yml
```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: user_management
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./server
    ports:
      - "5000:5000"
    environment:
      DB_USER: postgres
      DB_HOST: postgres
      DB_NAME: user_management
      DB_PASSWORD: password
      DB_PORT: 5432
      JWT_SECRET: your-secret-key
    depends_on:
      - postgres

  frontend:
    build: ./client
    ports:
      - "3000:3000"
    environment:
      REACT_APP_API_URL: http://localhost:5000/api
    depends_on:
      - backend

volumes:
  postgres_data:
```

### 4. Run with Docker
```bash
docker-compose up --build
```

## Environment Variables

### Backend (.env)
```env
# Database Configuration
DB_USER=your_db_user
DB_HOST=your_db_host
DB_NAME=user_management
DB_PASSWORD=your_db_password
DB_PORT=5432

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key

# Server Port
PORT=5000
```

### Frontend (.env)
```env
REACT_APP_API_URL=https://your-backend-url.com/api
```

## Database Migration

The application automatically creates the database schema on startup. If you need to run migrations manually:

```sql
-- Create users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'blocked')),
  last_login TIMESTAMP,
  registration_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create unique index on email
CREATE UNIQUE INDEX idx_users_email_unique ON users(email);
```

## SSL/HTTPS Configuration

For production deployments, ensure SSL is enabled:

### Vercel/Netlify
- Automatic SSL certificates
- No additional configuration needed

### Heroku
- SSL certificates are included
- Custom domains require SSL certificate

### Railway
- Automatic SSL for custom domains
- Built-in SSL for railway.app domains

## Monitoring and Logs

### Railway
- Built-in logging and monitoring
- Automatic restarts on crashes

### Heroku
- View logs: `heroku logs --tail`
- Monitor with Heroku addons

### Vercel
- Built-in analytics and monitoring
- Function logs in dashboard

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check environment variables
   - Verify database is accessible
   - Test connection string

2. **CORS Errors**
   - Ensure frontend URL is in CORS configuration
   - Check API URL in frontend environment

3. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Check for TypeScript errors

4. **Authentication Issues**
   - Verify JWT_SECRET is set
   - Check token expiration settings
   - Ensure proper redirect URLs

### Performance Optimization

1. **Database**
   - Add indexes for frequently queried fields
   - Use connection pooling
   - Monitor query performance

2. **Frontend**
   - Enable code splitting
   - Optimize bundle size
   - Use CDN for static assets

3. **Backend**
   - Enable compression
   - Use caching where appropriate
   - Monitor API response times

## Security Checklist

- [ ] Environment variables are properly set
- [ ] JWT secret is strong and unique
- [ ] Database credentials are secure
- [ ] HTTPS is enabled
- [ ] CORS is properly configured
- [ ] Input validation is working
- [ ] Rate limiting is implemented (if needed)
- [ ] Error messages don't expose sensitive information

## Support

For deployment issues:
1. Check the logs for error messages
2. Verify environment variables
3. Test database connectivity
4. Ensure all dependencies are installed
5. Check platform-specific documentation 