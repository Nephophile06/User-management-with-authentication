# PostgreSQL Setup Guide

## Quick Setup for PostgreSQL

### Option 1: Docker (Easiest)

```bash
# Start PostgreSQL container
docker run --name postgres-user-management \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=user_management \
  -p 5432:5432 \
  -d postgres:15

# Check if container is running
docker ps

# View logs if needed
docker logs postgres-user-management
```

### Option 2: Local PostgreSQL

1. **Install PostgreSQL**:
   - Windows: Download from https://www.postgresql.org/download/windows/
   - macOS: `brew install postgresql`
   - Ubuntu: `sudo apt-get install postgresql postgresql-contrib`

2. **Start PostgreSQL service**:
   - Windows: PostgreSQL service should start automatically
   - macOS: `brew services start postgresql`
   - Ubuntu: `sudo systemctl start postgresql`

3. **Create database and user**:
```bash
# Connect to PostgreSQL as superuser
sudo -u postgres psql

# Create database
CREATE DATABASE user_management;

# Create user (optional)
CREATE USER myuser WITH PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE user_management TO myuser;

# Exit
\q
```

### Environment Configuration

1. Copy the environment file:
```bash
cd server
cp env.example .env
```

2. Edit `.env` file with your PostgreSQL settings:
```env
DB_USER=postgres
DB_HOST=localhost
DB_NAME=user_management
DB_PASSWORD=password
DB_PORT=5432
JWT_SECRET=your-super-secret-jwt-key
PORT=5000
```

### Test Database Connection

```bash
# Install dependencies
npm run install-all

# Test the connection
cd server
npm run dev
```

You should see: `✅ Server running on port 5000`

### Troubleshooting

**Connection refused**:
- Ensure PostgreSQL is running
- Check if port 5432 is available
- Verify credentials in `.env` file

**Database doesn't exist**:
- Create the database manually
- Check database name in `.env` file

**Permission denied**:
- Check user permissions
- Verify password in `.env` file 