import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI;
const MONGO_DB_NAME = process.env.MONGO_DB_NAME;

if (!MONGO_URI) {
  throw new Error('กรุณากำหนดตัวแปร MONGO_URI ในไฟล์ environment');
}

if (!MONGO_DB_NAME) {
  throw new Error('กรุณากำหนดตัวแปร MONGO_DB_NAME ในไฟล์ environment');
}

const globalCache = globalThis.mongooseCache ?? { conn: null, promise: null };

if (!globalThis.mongooseCache) {
  globalThis.mongooseCache = globalCache;
}

export async function connectDB() {
  if (globalCache.conn) {
    return globalCache.conn;
  }

  if (!globalCache.promise) {
    mongoose.set('strictQuery', true);
    globalCache.promise = mongoose.connect(MONGO_URI, {
      dbName: MONGO_DB_NAME,
    });
  }

  globalCache.conn = await globalCache.promise;
  return globalCache.conn;
}
