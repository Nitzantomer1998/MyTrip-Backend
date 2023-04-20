import mongoose from 'mongoose';

const connectToDB = async () => {
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  try {
    await mongoose.connect(process.env.DATABASE_URL, options);
    console.log('Database connected');
  } catch (error) {
    console.error(`Error connecting to database: ${error.message}`);
    throw error;
  }
};

export default connectToDB;
