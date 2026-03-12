import { connectToDatabase } from './db.js';
import { collectInstagramProfiles } from '../server/pipeline/instagramCollector.js';

export default async function handler(req, res) {
  await connectToDatabase();
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { estado, cidade, nicho, raio } = req.body;
  try {
    collectInstagramProfiles({ estado, cidade, nicho, raio }).catch(e => console.error(e));
    res.status(202).json({ message: 'scan started' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
