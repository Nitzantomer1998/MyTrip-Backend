// Import needed packages
import mongoose from 'mongoose';

async function connectDB() {
  // Database connection options
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  // Connect to the database
  mongoose
    .connect(process.env.DATABASE_URL, options)
    .then(() => console.log('Database Connected'))
    .catch((error) => console.log(`Database Failed: ${error.message}`));
}

export default connectDB;
