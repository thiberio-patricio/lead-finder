import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
    cached.promise = mongoose.connect(process.env.MONGO_URI, opts).then(mongoose => mongoose);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
