import mongoose from 'mongoose';

/**
 * Connects to MongoDB Atlas cluster using Mongoose ODM.
 */
const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri || uri.includes('<username>') || uri.includes('<password>')) {
    console.warn('\n⚠️  WARNING: MongoDB URI is not configured yet in .env!');
    console.warn('👉 Please update MONGO_URI in your .env file with your MongoDB Atlas connection string.');
    console.warn('👉 Tutorial Guide: Step (b) Setup an online MongoDB account and cluster.\n');
    return;
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB Connected Successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
