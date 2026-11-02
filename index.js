import 'dotenv/config';
import app from './app.js';
import connectDB from './database.js';

const PORT = process.env.PORT || 5000;

// Connect to MongoDB Atlas
await connectDB();

// Start Express server
app.listen(PORT, () => {
  console.log(`\n=================================================`);
  console.log(`🚀 Server listening on port ${PORT}`);
  console.log(`📡 Local URL: http://localhost:${PORT}`);
  console.log(`📝 Ready to receive requests from Postman or browser`);
  console.log(`=================================================\n`);
});
