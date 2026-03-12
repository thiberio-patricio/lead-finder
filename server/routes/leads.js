import express from 'express';
import Lead from '../models/Lead.js';

const router = express.Router();

// GET /api/leads
router.get('/', async (req, res) => {
  const { status, estado, cidade, search, sortBy } = req.query;
  const filter = {};
  if (status && status !== 'todos') filter.status = status;
  if (estado && estado !== 'todos') filter.estado = estado;
  if (cidade && cidade !== 'todas') filter.cidade = cidade;
  if (search) filter.nome = { $regex: search, $options: 'i' };

  let query = Lead.find(filter);
  if (sortBy) query = query.sort({ [sortBy]: -1 });
  const leads = await query.exec();
  res.json(leads);
});

// POST /api/leads
router.post('/', async (req, res) => {
  try {
    const lead = new Lead(req.body);
    await lead.save();
    res.status(201).json(lead);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/leads/:id
router.put('/:id', async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(lead);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
