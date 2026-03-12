import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import leadsRouter from './routes/leads.js';
import scanRouter from './routes/scan.js';
import cron from 'node-cron';
import { collectInstagramProfiles } from './pipeline/instagramCollector.js';

dotenv.config();

const app = express();
app.use(express.json());

// connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error', err));

// API routes
app.use('/api/leads', leadsRouter);
app.use('/api/scan', scanRouter);

// schedule background job every hour (adjust cron expression as needed)
cron.schedule('0 * * * *', async () => {
  console.log('Running hourly Instagram collector');
  try {
    await collectInstagramProfiles();
  } catch (e) {
    console.error('collector failed', e);
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening on port ${port}`));
