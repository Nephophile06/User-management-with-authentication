const fs = require('fs');
const path = require('path');

console.log('🧪 Testing User Management Application Setup (JavaScript Version)...\n');

// Check if required files exist
const requiredFiles = [
  'package.json',
  'server/package.json',
  'client/package.json',
  'server/index.js',
  'client/src/App.js',
  'README.md'
];

let allFilesExist = true;

requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} exists`);
  } else {
    console.log(`❌ ${file} missing`);
    allFilesExist = false;
  }
});

// Check if node_modules directories exist
const nodeModulesDirs = [
  'node_modules',
  'server/node_modules',
  'client/node_modules'
];

console.log('\n📦 Checking dependencies...');
nodeModulesDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    console.log(`✅ ${dir} exists`);
  } else {
    console.log(`❌ ${dir} missing - run 'npm run install-all'`);
  }
});

// Check environment file
console.log('\n🔧 Checking environment configuration...');
if (fs.existsSync('server/.env')) {
  console.log('✅ server/.env exists');
} else if (fs.existsSync('server/env.example')) {
  console.log('⚠️  server/.env missing - copy server/env.example to server/.env and configure');
} else {
  console.log('❌ server/env.example missing');
}

// Check JavaScript files
console.log('\n📁 Checking JavaScript files...');
const jsFiles = [
  'server/database.js',
  'server/middleware/auth.js',
  'server/routes/auth.js',
  'server/routes/users.js',
  'client/src/components/Login.js',
  'client/src/components/Register.js',
  'client/src/components/Dashboard.js',
  'client/src/components/UserTable.js',
  'client/src/components/PrivateRoute.js',
  'client/src/contexts/AuthContext.js',
  'client/src/services/api.js'
];

jsFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} exists`);
  } else {
    console.log(`❌ ${file} missing`);
    allFilesExist = false;
  }
});

console.log('\n📋 Summary:');
if (allFilesExist) {
  console.log('✅ All required files are present');
  console.log('🎉 Setup appears to be complete!');
  console.log('\nNext steps:');
  console.log('1. Configure your database in server/.env');
  console.log('2. Run "npm run dev" to start the application');
} else {
  console.log('❌ Some files are missing');
  console.log('Please run the setup script or install dependencies manually');
}

console.log('\nFor detailed setup instructions, see README.md and SETUP_GUIDE.md'); 