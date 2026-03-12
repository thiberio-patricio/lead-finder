import { connectToDatabase } from './db.js';
import Lead from './leadModel.js';

export default async function handler(req, res) {
  await connectToDatabase();
  const { method, query, body } = req;

  if (method === 'GET') {
    const { status, estado, cidade, search, sortBy } = query;
    const filter = {};
    if (status && status !== 'todos') filter.status = status;
    if (estado && estado !== 'todos') filter.estado = estado;
    if (cidade && cidade !== 'todas') filter.cidade = cidade;
    if (search) filter.nome = { $regex: search, $options: 'i' };

    let mongoQuery = Lead.find(filter);
    if (sortBy) mongoQuery = mongoQuery.sort({ [sortBy]: -1 });
    const leads = await mongoQuery.exec();
    res.status(200).json(leads);
  } else if (method === 'POST') {
    try {
      const lead = new Lead(body);
      await lead.save();
      res.status(201).json(lead);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  } else if (method === 'PUT') {
    try {
      const id = query.id;
      const lead = await Lead.findByIdAndUpdate(id, body, { new: true });
      res.status(200).json(lead);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  } else {
    res.setHeader('Allow', ['GET','POST','PUT']);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
