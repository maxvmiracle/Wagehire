const express = require('express');
const { body, validationResult } = require('express-validator');
const { run, get, all } = require('../database/db');
const { authenticateToken, requireAdmin } = require('./auth');

const router = express.Router();

// Middleware to validate request
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: errors.array()[0].msg,
      errors: errors.array() 
    });
  }
  next();
};

// Get all candidates (admin only)
router.get('/candidates', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { role, search } = req.query;
    
    let query = `
      SELECT 
        u.*,
        COUNT(i.id) as interview_count
      FROM users u
      LEFT JOIN interviews i ON u.id = i.candidate_id
    `;
    
    const params = [];
    const conditions = [];
    
    if (role) {
      conditions.push('u.role = ?');
      params.push(role);
    }
    
    if (search) {
      conditions.push('(u.name LIKE ? OR u.email LIKE ? OR u.current_position LIKE ?)');
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    query += ' GROUP BY u.id ORDER BY u.created_at DESC';
    
    const candidates = await all(query, params);
    
    res.json({ candidates });
    
  } catch (error) {
    console.error('Get all candidates error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all users (admin only)
router.get('/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { role, search } = req.query;
    
    let query = 'SELECT id, email, name, role, phone, current_position, experience_years, skills, created_at FROM users';
    const params = [];
    const conditions = [];
    
    if (role) {
      conditions.push('role = ?');
      params.push(role);
    }
    
    if (search) {
      conditions.push('(name LIKE ? OR email LIKE ? OR current_position LIKE ?)');
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    query += ' ORDER BY name ASC';
    
    const users = await all(query, params);
    
    res.json({ users });
    
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user role (admin only)
router.put('/users/:id/role', [
  authenticateToken,
  requireAdmin,
  body('role').isIn(['admin', 'candidate']).withMessage('Role must be either admin or candidate')
], validateRequest, async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    
    // Check if user exists
    const user = await get('SELECT id, role FROM users WHERE id = ?', [id]);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Prevent admin from removing their own admin role
    if (parseInt(id) === req.user.userId && role !== 'admin') {
      return res.status(400).json({ error: 'Cannot remove your own admin role' });
    }
    
    // Update user role
    await run('UPDATE users SET role = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [role, id]);
    
    // Get updated user
    const updatedUser = await get(
      'SELECT id, email, name, role, phone, current_position, experience_years, skills, created_at FROM users WHERE id = ?',
      [id]
    );
    
    res.json({
      message: 'User role updated successfully',
      user: updatedUser
    });
    
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete user (admin only)
router.delete('/users/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if user exists
    const user = await get('SELECT id, role FROM users WHERE id = ?', [id]);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Prevent admin from deleting themselves
    if (parseInt(id) === req.user.userId) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }
    
    // Check if user has any interviews
    const interviewCount = await get(
      'SELECT COUNT(*) as count FROM interviews WHERE candidate_id = ?',
      [id]
    );
    
    if (interviewCount.count > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete user with existing interviews. Please delete interviews first.' 
      });
    }
    
    // Delete user
    await run('DELETE FROM users WHERE id = ?', [id]);
    
    res.json({ message: 'User deleted successfully' });
    
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get admin dashboard stats
router.get('/dashboard', authenticateToken, requireAdmin, async (req, res) => {
  try {
    // Get total users
    const totalUsers = await get('SELECT COUNT(*) as count FROM users');
    
    // Get total candidates
    const totalCandidates = await get('SELECT COUNT(*) as count FROM users WHERE role = "candidate"');
    
    // Get total interviews
    const totalInterviews = await get('SELECT COUNT(*) as count FROM interviews');
    
    // Get interviews by status
    const interviewsByStatus = await all(`
      SELECT status, COUNT(*) as count 
      FROM interviews 
      GROUP BY status
    `);
    
    // Get candidates by experience level
    const candidatesByExperience = await all(`
      SELECT 
        CASE 
          WHEN experience_years < 1 THEN 'Entry Level'
          WHEN experience_years < 3 THEN 'Junior'
          WHEN experience_years < 5 THEN 'Mid Level'
          ELSE 'Senior'
        END as level,
        COUNT(*) as count 
      FROM users 
      WHERE role = 'candidate' AND experience_years IS NOT NULL
      GROUP BY level
    `);
    
    // Get recent activity (last 7 days)
    const recentInterviews = await all(`
      SELECT 
        i.*,
        u.name as candidate_name
      FROM interviews i
      JOIN users u ON i.candidate_id = u.id
      WHERE i.created_at >= datetime('now', '-7 days')
      ORDER BY i.created_at DESC
      LIMIT 10
    `);
    
    // Get recent candidates
    const recentCandidates = await all(`
      SELECT 
        id, name, email, current_position, experience_years, skills, created_at
      FROM users 
      WHERE role = 'candidate' AND created_at >= datetime('now', '-7 days')
      ORDER BY created_at DESC
      LIMIT 10
    `);
    
    res.json({
      stats: {
        totalUsers: totalUsers.count,
        totalCandidates: totalCandidates.count,
        totalInterviews: totalInterviews.count,
        interviewsByStatus,
        candidatesByExperience
      },
      recentInterviews,
      recentCandidates
    });
    
  } catch (error) {
    console.error('Get admin dashboard error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all interviews (admin only)
router.get('/interviews', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status, search } = req.query;
    
    let query = `
      SELECT 
        i.*,
        u.name as candidate_name,
        u.email as candidate_email,
        u.current_position as candidate_position
      FROM interviews i
      JOIN users u ON i.candidate_id = u.id
    `;
    
    const params = [];
    const conditions = [];
    
    if (status) {
      conditions.push('i.status = ?');
      params.push(status);
    }
    
    if (search) {
      conditions.push('(u.name LIKE ? OR i.company_name LIKE ? OR i.job_title LIKE ?)');
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    query += ' ORDER BY i.scheduled_date DESC';
    
    const interviews = await all(query, params);
    
    res.json({ interviews });
    
  } catch (error) {
    console.error('Get all interviews error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get detailed reports (admin only)
router.get('/reports', authenticateToken, requireAdmin, async (req, res) => {
  try {
    // Get comprehensive system statistics
    const totalUsers = await get('SELECT COUNT(*) as count FROM users');
    const totalInterviews = await get('SELECT COUNT(*) as count FROM interviews');
    const completedInterviews = await get('SELECT COUNT(*) as count FROM interviews WHERE status = "completed"');
    const scheduledInterviews = await get('SELECT COUNT(*) as count FROM interviews WHERE status = "scheduled"');
    const cancelledInterviews = await get('SELECT COUNT(*) as count FROM interviews WHERE status = "cancelled"');
    
    // Get user statistics by role
    const adminUsers = await get('SELECT COUNT(*) as count FROM users WHERE role = "admin"');
    const regularUsers = await get('SELECT COUNT(*) as count FROM users WHERE role = "user"');
    
    // Get new users this month
    const newUsersThisMonth = await get(`
      SELECT COUNT(*) as count 
      FROM users 
      WHERE created_at >= datetime('now', 'start of month')
    `);
    
    // Get interviews by month (last 6 months)
    const interviewsByMonth = await all(`
      SELECT 
        strftime('%Y-%m', created_at) as month,
        COUNT(*) as count
      FROM interviews 
      WHERE created_at >= datetime('now', '-6 months')
      GROUP BY month
      ORDER BY month DESC
    `);
    
    // Get user registration by month (last 6 months)
    const usersByMonth = await all(`
      SELECT 
        strftime('%Y-%m', created_at) as month,
        COUNT(*) as count
      FROM users 
      WHERE created_at >= datetime('now', '-6 months')
      GROUP BY month
      ORDER BY month DESC
    `);
    
    // Get top interviewers (users who conducted most interviews)
    const topInterviewers = await all(`
      SELECT 
        u.name,
        u.email,
        COUNT(i.id) as interview_count
      FROM users u
      JOIN interviews i ON u.id = i.interviewer_id
      GROUP BY u.id
      ORDER BY interview_count DESC
      LIMIT 5
    `);
    
    // Get recent activity (last 30 days)
    const recentActivity = await all(`
      SELECT 
        'interview' as type,
        i.id,
        i.company_name,
        i.job_title,
        i.status,
        i.created_at,
        u.name as candidate_name
      FROM interviews i
      JOIN users u ON i.candidate_id = u.id
      WHERE i.created_at >= datetime('now', '-30 days')
      UNION ALL
      SELECT 
        'user' as type,
        u.id,
        u.name as company_name,
        u.role as job_title,
        'registered' as status,
        u.created_at,
        u.name as candidate_name
      FROM users u
      WHERE u.created_at >= datetime('now', '-30 days')
      ORDER BY created_at DESC
      LIMIT 20
    `);
    
    // Calculate completion rate
    const completionRate = totalInterviews.count > 0 
      ? Math.round((completedInterviews.count / totalInterviews.count) * 100)
      : 0;
    
    // Calculate average interviews per user
    const avgInterviewsPerUser = totalUsers.count > 0 
      ? Math.round((totalInterviews.count / totalUsers.count) * 10) / 10
      : 0;
    
    const reports = {
      summary: {
        totalUsers: totalUsers.count,
        totalInterviews: totalInterviews.count,
        completedInterviews: completedInterviews.count,
        scheduledInterviews: scheduledInterviews.count,
        cancelledInterviews: cancelledInterviews.count,
        adminUsers: adminUsers.count,
        regularUsers: regularUsers.count,
        newUsersThisMonth: newUsersThisMonth.count,
        completionRate,
        avgInterviewsPerUser
      },
      trends: {
        interviewsByMonth,
        usersByMonth
      },
      analytics: {
        topInterviewers,
        recentActivity
      }
    };
    
    res.json({ reports });
    
  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 