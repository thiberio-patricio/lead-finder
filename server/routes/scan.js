import express from 'express';
import { collectInstagramProfiles } from '../pipeline/instagramCollector.js';

const router = express.Router();

// POST /api/scan
// body: { estado, cidade, nicho, raio }
// this is a lightweight endpoint that queues a background job; actual work is
// handled by the collector script.  for simplicity we just call the collector
// immediately, but in a real app you would push to a message queue or schedule
// a more targeted query.
router.post('/', async (req, res) => {
  const { estado, cidade, nicho, raio } = req.body;
  // user may supply filters; collector can use them to narrow down search.
  try {
    // pass parameters along if you extend collector signature
    collectInstagramProfiles({ estado, cidade, nicho, raio }).catch(e => console.error(e));
    res.status(202).json({ message: 'scan started' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
