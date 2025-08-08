# Wagehire

A comprehensive interview scheduling and management system built with React, Express.js, and SQLite. Wagehire helps HR teams and interviewers efficiently manage the entire interview process from candidate registration to feedback submission.

## 🚀 Features

### Core Features
- **User Authentication & Authorization**
  - Secure login/register system with JWT tokens
  - Role-based access control (Admin, Interviewer, HR)
  - User profile management

- **Candidate Management**
  - Add, edit, and delete candidate profiles
  - Track candidate status (pending, interviewing, hired, rejected)
  - Search and filter candidates
  - Resume URL storage

- **Interview Scheduling**
  - Schedule interviews with date/time selection
  - Automatic conflict detection for interviewers
  - Multiple interview types (Technical, HR, Final)
  - Location and duration management

- **Interview Management**
  - View all scheduled interviews
  - Update interview status and details
  - Cancel or reschedule interviews
  - Interview feedback submission

- **Dashboard & Analytics**
  - Real-time statistics and metrics
  - Recent interviews overview
  - Quick action buttons
  - User-specific dashboard

### Technical Features
- **Modern UI/UX**
  - Responsive design with Tailwind CSS
  - Beautiful and intuitive interface
  - Mobile-friendly layout
  - Loading states and error handling

- **Backend API**
  - RESTful API design
  - Input validation and sanitization
  - Error handling and logging
  - Database relationships and constraints

- **Database**
  - SQLite for development (easily switchable to MySQL/PostgreSQL)
  - Proper table relationships
  - Sample data included

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API calls
- **React Hook Form** - Form handling
- **React Hot Toast** - Toast notifications
- **Lucide React** - Beautiful icons
- **Date-fns** - Date manipulation

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **SQLite3** - Database (development)
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **express-validator** - Input validation
- **helmet** - Security middleware
- **cors** - Cross-origin resource sharing

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** (v8 or higher)

## 🚀 Installation & Setup

### Local Development

#### 1. Clone the Repository
```bash
git clone <repository-url>
cd wagehire
```

#### 2. Install Dependencies
```bash
# Install all dependencies (root, backend, and frontend)
npm run install-all
```

#### 3. Environment Setup
Create a `.env` file in the backend directory:
```bash
cd backend
touch .env
```

Add the following environment variables:
```env
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-here
NODE_ENV=development
```

#### 4. Initialize Database
```bash
cd backend
npm run init-db
```

#### 5. Start the Application

##### Development Mode (Recommended)
```bash
# From the root directory
npm run dev
```

This will start both the backend server (port 5000) and frontend development server (port 3000) concurrently.

##### Production Mode
```bash
# Build the frontend
npm run build

# Start the backend server
npm start
```

#### 6. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api

### 🚀 Vercel Deployment

For production deployment on Vercel, see the [DEPLOYMENT.md](DEPLOYMENT.md) guide.

#### Quick Deploy
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from project root
vercel
```

#### Environment Variables for Vercel
Set these in your Vercel project settings:
```
JWT_SECRET=your-super-secret-jwt-key-here
NODE_ENV=production
```

## 👥 Default Users

The system comes with pre-configured demo users:

| Email | Password | Role |
|-------|----------|------|
| admin@company.com | admin123 | Admin |
| sarah.tech@company.com | password123 | Interviewer |
| alex.hr@company.com | password123 | Interviewer |

## 📁 Project Structure

```
wagehire/
├── backend/
│   ├── database/
│   │   ├── connection.js    # Database connection utility
│   │   ├── db.js           # Database schema and queries
│   │   ├── init.js         # Database initialization
│   │   ├── interview_management.db  # SQLite database file
│   │   └── wagehire.db     # Alternative database file
│   ├── routes/
│   │   ├── admin.js        # Admin-specific routes
│   │   ├── auth.js         # Authentication routes
│   │   ├── candidates.js   # Candidate management routes
│   │   ├── interviews.js   # Interview management routes
│   │   └── users.js        # User management routes
│   ├── package.json
│   ├── reset-db.js         # Database reset utility
│   └── server.js           # Main server file
├── frontend/
│   ├── public/
│   │   └── index.html      # HTML template
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   │   └── Layout.js   # Main layout component
│   │   ├── contexts/       # React contexts
│   │   │   └── AuthContext.js  # Authentication context
│   │   ├── pages/          # Page components
│   │   │   ├── AddCandidate.js
│   │   │   ├── Admin.js
│   │   │   ├── CandidateDetail.js
│   │   │   ├── Candidates.js
│   │   │   ├── Dashboard.js
│   │   │   ├── EditInterview.js
│   │   │   ├── InterviewDetail.js
│   │   │   ├── Interviews.js
│   │   │   ├── Login.js
│   │   │   ├── Profile.js
│   │   │   ├── Register.js
│   │   │   ├── ScheduleInterview.js
│   │   │   └── Users.js
│   │   ├── services/
│   │   │   └── api.js      # API service functions
│   │   ├── App.js          # Main app component
│   │   ├── index.css       # Global styles
│   │   ├── index.js        # Entry point
│   │   └── setupProxy.js   # Development proxy configuration
│   ├── package.json
│   ├── postcss.config.js   # PostCSS configuration
│   └── tailwind.config.js  # Tailwind configuration
├── package.json            # Root package.json
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/profile` - Get user profile

### Interviews
- `GET /api/interviews` - Get all interviews
- `GET /api/interviews/:id` - Get specific interview
- `POST /api/interviews` - Create new interview
- `PUT /api/interviews/:id` - Update interview
- `DELETE /api/interviews/:id` - Delete interview
- `POST /api/interviews/:id/feedback` - Submit feedback

### Candidates
- `GET /api/candidates` - Get all candidates
- `GET /api/candidates/:id` - Get specific candidate
- `POST /api/candidates` - Create new candidate
- `PUT /api/candidates/:id` - Update candidate
- `DELETE /api/candidates/:id` - Delete candidate

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get specific user
- `GET /api/users/me/interviews` - Get user's interviews
- `GET /api/users/me/dashboard` - Get user dashboard stats
- `PUT /api/users/me` - Update user profile

### Admin (Admin-only endpoints)
- `GET /api/admin/stats` - Get admin dashboard statistics
- `GET /api/admin/users` - Get all users (admin view)
- `PUT /api/admin/users/:id` - Update user (admin)

## 🎨 Customization

### Styling
The application uses Tailwind CSS for styling. You can customize the design by modifying:
- `frontend/tailwind.config.js` - Tailwind configuration
- `frontend/src/index.css` - Custom CSS classes

### Database
To switch from SQLite to another database:
1. Install the appropriate database driver
2. Update the connection configuration in `backend/database/connection.js`
3. Modify the database initialization script if needed

### Environment Variables
Key environment variables you can customize:
- `PORT` - Backend server port (default: 5000)
- `JWT_SECRET` - JWT signing secret (required for security)
- `NODE_ENV` - Environment mode (development/production)

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Change the port in the .env file
   PORT=5001
   
   # Or kill processes using the port
   npx kill-port 5000
   ```

2. **Database connection issues**
   - Ensure SQLite is properly installed
   - Check file permissions for the database file
   - Run `npm run init-db` to recreate the database

3. **Frontend not connecting to backend**
   - Verify the proxy setting in `frontend/package.json`
   - Check if the backend server is running on the correct port
   - Ensure CORS is properly configured

4. **Authentication issues**
   - Clear browser localStorage
   - Check JWT token expiration
   - Verify JWT_SECRET in environment variables
   - Try logging out and logging back in

5. **Module not found errors**
   ```bash
   # Clear node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

### Development Tips

1. **Hot Reload**: The development server supports hot reload for both frontend and backend
2. **Database Reset**: Run `npm run init-db` to reset the database with sample data
3. **API Testing**: Use tools like Postman or Insomnia to test API endpoints
4. **Logs**: Check console logs for detailed error information
5. **Browser DevTools**: Use browser developer tools to debug frontend issues

## 📝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests if applicable
5. Commit your changes (`git commit -m 'Add some amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Submit a pull request

### Development Guidelines
- Follow the existing code style and conventions
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation if needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Support

If you encounter any issues or have questions:

1. **Check the troubleshooting section** above
2. **Review the API documentation** in this README
3. **Search existing issues** in the repository
4. **Create a new issue** with:
   - Clear description of the problem
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details (OS, Node.js version, etc.)

## 🚀 Deployment

### Production Deployment
1. Set `NODE_ENV=production` in your environment variables
2. Build the frontend: `npm run build`
3. Start the backend server: `npm start`
4. Configure your reverse proxy (nginx, Apache) to serve the built frontend
5. Set up environment variables for production

### Docker Deployment (Optional)
```dockerfile
# Example Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

---

**Happy Interviewing! 🎉**

*Built with ❤️ using React, Express.js, and SQLite* 