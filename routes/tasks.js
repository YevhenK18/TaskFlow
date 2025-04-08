const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Get all tasks
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tasks ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Create a task
router.post('/', async (req, res) => {
  try {
    const { title, description } = req.body;
    const result = await pool.query(
      'INSERT INTO tasks (title, description) VALUES ($1, $2) RETURNING *',
      [title, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update a task
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, completed } = req.body;
    const result = await pool.query(
      'UPDATE tasks SET title = $1, description = $2, completed = $3 WHERE id = $4 RETURNING *',
      [title, description, completed, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).send('Task not found');
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Delete a task
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).send('Task not found');
    }
    res.json({ message: 'Task deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;