@echo off
echo 🚀 Setting up User Management Application...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ Node.js and npm are installed

REM Install root dependencies
echo 📦 Installing root dependencies...
npm install

REM Install server dependencies
echo 📦 Installing server dependencies...
cd server
npm install
cd ..

REM Install client dependencies
echo 📦 Installing client dependencies...
cd client
npm install
cd ..

REM Create environment file for server
echo 🔧 Setting up environment variables...
if not exist "server\.env" (
    copy "server\env.example" "server\.env"
    echo ✅ Created server\.env file
    echo ⚠️  Please edit server\.env with your database credentials
) else (
    echo ✅ server\.env already exists
)

echo.
echo 🎉 Setup completed successfully!
echo.
echo Next steps:
echo 1. Edit server\.env with your PostgreSQL database credentials
echo 2. Create a PostgreSQL database named 'user_management'
echo 3. Run 'npm run dev' to start the application
echo.
echo For more information, see README.md
pause 