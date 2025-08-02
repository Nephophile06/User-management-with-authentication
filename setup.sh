#!/bin/bash

echo "🚀 Setting up User Management Application..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install server dependencies
echo "📦 Installing server dependencies..."
cd server
npm install
cd ..

# Install client dependencies
echo "📦 Installing client dependencies..."
cd client
npm install
cd ..

# Create environment file for server
echo "🔧 Setting up environment variables..."
if [ ! -f "server/.env" ]; then
    cp server/env.example server/.env
    echo "✅ Created server/.env file"
    echo "⚠️  Please edit server/.env with your database credentials"
else
    echo "✅ server/.env already exists"
fi

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "Next steps:"
echo "1. Edit server/.env with your PostgreSQL database credentials"
echo "2. Create a PostgreSQL database named 'user_management'"
echo "3. Run 'npm run dev' to start the application"
echo ""
echo "For more information, see README.md" 