import mongoose from 'mongoose';

async function connectDB() {
  try {
    const connectOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    await mongoose.connect(process.env.DATABASE_URL, connectOptions);
    console.log('Database Connected');
  } catch (error) {
    console.error(`Database Failed: ${error.message}`);
  }
}

export default connectDB;
