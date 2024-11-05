const pool = require('../db.js');

const getAllFaqs = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM faqs');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    res.status(500).json({ error: 'Failed to retrieve FAQs' });
  }
};

const getFaqById = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const result = await pool.query('SELECT * FROM faqs WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'FAQ not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching FAQ:', error);
    res.status(500).json({ error: 'Failed to retrieve FAQ' });
  }
};

const createFaq = async (req, res) => {
  const { question, answer } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO faqs (question, answer) VALUES ($1, $2) RETURNING id',
      [question, answer]
    );
    res.status(201).json({ message: 'FAQ added', id: result.rows[0].id });
  } catch (error) {
    console.error('Error creating FAQ:', error);
    res.status(500).json({ error: 'Failed to add FAQ' });
  }
};

const updateFaq = async (req, res) => {
  const id = parseInt(req.params.id);
  const { question, answer } = req.body;

  try {
    const result = await pool.query(
      'UPDATE faqs SET question = $1, answer = $2 WHERE id = $3 RETURNING id',
      [question, answer, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'FAQ not found' });
    }

    res.status(200).json({ message: 'FAQ updated', id: result.rows[0].id });
  } catch (error) {
    console.error('Error updating FAQ:', error);
    res.status(500).json({ error: 'Failed to update FAQ' });
  }
};

const deleteFaq = async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const result = await pool.query(
      'DELETE FROM faqs WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'FAQ not found' });
    }

    res.status(200).json({ message: 'FAQ deleted', id: result.rows[0].id });
  } catch (error) {
    console.error('Error deleting FAQ:', error);
    res.status(500).json({ error: 'Failed to delete FAQ' });
  }
};

module.exports = {
  getAllFaqs,
  getFaqById,
  createFaq,
  updateFaq,
  deleteFaq
};
