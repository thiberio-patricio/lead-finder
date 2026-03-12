import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
  nome: String,
  instagram: String,
  estado: String,
  cidade: String,
  bairro: String,
  categoria: String,
  seguidores: Number,
  engajamento: Number,
  posts: Number,
  ultimoPost: Number,
  leadScore: Number,
  status: { type: String, enum: ['novo', 'contatado', 'negociação', 'cliente', 'descartado'], default: 'novo' },
  telefone: String,
  bio: String,
  cta: Boolean,
  reels: Boolean,
}, { timestamps: true });

export default mongoose.models.Lead || mongoose.model('Lead', leadSchema);
