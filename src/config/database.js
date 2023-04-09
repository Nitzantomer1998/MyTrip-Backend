import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongooseConnection = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected');
    return mongooseConnection;
  } catch (error) {
    console.error(`Error --> ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
