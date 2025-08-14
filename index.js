#!/usr/bin/env node

// Entry point for Render deployment
// This file directly requires the backend server

const path = require('path');

// Set the working directory to backend
process.chdir(path.join(__dirname, 'backend'));

console.log('🚀 Starting Wagehire Backend Server...');
console.log(`📁 Working directory: ${process.cwd()}`);

// Import and start the server
try {
  require('./server.js');
} catch (error) {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
} 