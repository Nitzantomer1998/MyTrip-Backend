import mongoose from 'mongoose';

async function connectToDB() {
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  try {
    await mongoose.connect(process.env.DATABASE_URL, options);
    console.log('Database Connected');
  } catch (error) {
    console.error(`Database Failed: ${error.message}`);
    throw error;
  }
}

export default connectToDB;
