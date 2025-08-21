#!/usr/bin/env node

// Root server entry point for Render deployment
// This file starts the backend server

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database initialization
const initDatabase = require('./backend/database/init');

// Email service initialization
const { verifyEmailConfig } = require('./backend/services/emailService');

// Routes
const { router: authRoutes } = require('./backend/routes/auth');
const interviewRoutes = require('./backend/routes/interviews');
const userRoutes = require('./backend/routes/users');
const adminRoutes = require('./backend/routes/admin');


// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);


// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Wagehire API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Initialize database and start server
async function startServer() {
  try {
    console.log('🚀 Starting Wagehire Backend Server...');
    console.log(`📁 Root directory: ${__dirname}`);
    
    // Initialize database
    console.log('Database initialization started');
    await initDatabase();
    console.log('Database initialized successfully');
    
    // Verify email configuration
    const emailConfigValid = await verifyEmailConfig();
    if (emailConfigValid) {
      console.log('Email service configured successfully');
    } else {
      console.warn('Email service configuration failed. Email features may not work properly.');
    }
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`API available at http://localhost:${PORT}/api`);
      console.log(`API available at http://0.0.0.0:${PORT}/api (external access)`);
      console.log(`Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    console.error('Error details:', error.message);
    process.exit(1);
  }
}

startServer(); 