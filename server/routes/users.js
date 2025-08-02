const express = require('express');
const { pool } = require('../database-sqlite');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all users (sorted by last login time - REQUIREMENT #3)
router.get('/', authenticateToken, async (req, res) => {
  try {
    // Get users sorted by last login time (newest first)
    const result = await pool.query(`
      SELECT id, name, email, status, last_login, registration_time
      FROM users 
      ORDER BY last_login DESC NULLS LAST, registration_time DESC
    `);

    res.json({
      users: result.rows,
      message: 'Users retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Block users
router.patch('/block', authenticateToken, async (req, res) => {
  try {
    const { userIds } = req.body;

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ message: 'User IDs array is required' });
    }

    // Block multiple users
    const placeholders = userIds.map(() => '?').join(',');
    const result = await pool.query(
      `UPDATE users SET status = ? WHERE id IN (${placeholders}) RETURNING id, name, email, status`,
      ['blocked', ...userIds]
    );

    res.json({
      message: `${result.rows.length} user(s) blocked successfully`,
      blockedUsers: result.rows
    });

  } catch (error) {
    console.error('Error blocking users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Unblock users
router.patch('/unblock', authenticateToken, async (req, res) => {
  try {
    const { userIds } = req.body;

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ message: 'User IDs array is required' });
    }

    // Unblock multiple users
    const placeholders = userIds.map(() => '?').join(',');
    const result = await pool.query(
      `UPDATE users SET status = ? WHERE id IN (${placeholders}) RETURNING id, name, email, status`,
      ['active', ...userIds]
    );

    res.json({
      message: `${result.rows.length} user(s) unblocked successfully`,
      unblockedUsers: result.rows
    });

  } catch (error) {
    console.error('Error unblocking users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete users
router.delete('/delete', authenticateToken, async (req, res) => {
  try {
    const { userIds } = req.body;

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ message: 'User IDs array is required' });
    }

    // Get user info before deletion
    const placeholders = userIds.map(() => '?').join(',');
    const usersToDelete = await pool.query(
      `SELECT id, name, email FROM users WHERE id IN (${placeholders})`,
      [...userIds]
    );

    // Delete multiple users
    await pool.query(
      `DELETE FROM users WHERE id IN (${placeholders})`,
      [...userIds]
    );

    res.json({
      message: `${usersToDelete.rows.length} user(s) deleted successfully`,
      deletedUsers: usersToDelete.rows
    });

  } catch (error) {
    console.error('Error deleting users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router; 