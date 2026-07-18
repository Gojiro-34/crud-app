const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');

// GET /api/tasks - List all tasks
router.get('/', async (req, res, next) => {
  try {
    const { status } = req.query;
    let query = 'SELECT * FROM tasks';
    const params = [];

    if (status && ['todo', 'in-progress', 'done'].includes(status)) {
      query += ' WHERE status = ?';
      params.push(status);
    }

    query += ' ORDER BY created_at DESC';

    const [rows] = await pool.query(query, params);
    res.status(200).json(rows);
  } catch (error) {
    next(error);
  }
});

// GET /api/tasks/:id - Get single task by ID
router.get('/:id', async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM tasks WHERE id = ?', [req.params.id]);
    
    if (rows.length === 0) {
      const error = new Error('Task not found');
      error.statusCode = 404;
      return next(error);
    }
    
    res.status(200).json(rows[0]);
  } catch (error) {
    next(error);
  }
});

// POST /api/tasks - Create a new task
router.post('/', async (req, res, next) => {
  try {
    const { title, description, status = 'todo', due_date } = req.body;

    if (!title || title.trim() === '') {
      const error = new Error('Title is required');
      error.statusCode = 400;
      return next(error);
    }

    const query = 'INSERT INTO tasks (title, description, status, due_date) VALUES (?, ?, ?, ?)';
    const [result] = await pool.query(query, [title, description, status, due_date]);

    const [newTask] = await pool.query('SELECT * FROM tasks WHERE id = ?', [result.insertId]);
    res.status(201).json(newTask[0]);
  } catch (error) {
    next(error);
  }
});

// PUT /api/tasks/:id - Update a task
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, status, due_date } = req.body;

    if (status && !['todo', 'in-progress', 'done'].includes(status)) {
      const error = new Error('Invalid status value');
      error.statusCode = 400;
      return next(error);
    }

    // Check if task exists
    const [existing] = await pool.query('SELECT * FROM tasks WHERE id = ?', [id]);
    if (existing.length === 0) {
      const error = new Error('Task not found');
      error.statusCode = 404;
      return next(error);
    }

    const updates = [];
    const params = [];

    if (title !== undefined) {
      updates.push('title = ?');
      params.push(title);
    }
    if (description !== undefined) {
      updates.push('description = ?');
      params.push(description);
    }
    if (status !== undefined) {
      updates.push('status = ?');
      params.push(status);
    }
    if (due_date !== undefined) {
      updates.push('due_date = ?');
      params.push(due_date);
    }

    if (updates.length > 0) {
      params.push(id);
      const updateQuery = `UPDATE tasks SET ${updates.join(', ')} WHERE id = ?`;
      await pool.query(updateQuery, params);
    }

    const [updatedTask] = await pool.query('SELECT * FROM tasks WHERE id = ?', [id]);
    res.status(200).json(updatedTask[0]);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/tasks/:id - Delete a task
router.delete('/:id', async (req, res, next) => {
  try {
    const [result] = await pool.query('DELETE FROM tasks WHERE id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      const error = new Error('Task not found');
      error.statusCode = 404;
      return next(error);
    }
    
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
