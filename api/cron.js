import { connectToDatabase } from './db.js';
import { collectInstagramProfiles } from '../server/pipeline/instagramCollector.js';

export default async function handler(req, res) {
  await connectToDatabase();
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    await collectInstagramProfiles();
    res.status(200).json({ message: 'cron run completed' });
  } catch (err) {
    console.error('cron error', err);
    res.status(500).json({ error: err.message });
  }
}
