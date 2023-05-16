// Import needed function
import { connect } from 'mongoose';

async function connectDB() {
  try {
    // Database connection options
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    // Connect to the database
    await connect(process.env.DATABASE_URL, options);
    console.log('Database Connected');
  } catch (error) {
    console.log(`Database Failed: ${error.message}`);
  }
}

// Export the function
export default connectDB;
