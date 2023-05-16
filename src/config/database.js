import { connect } from 'mongoose';

async function connectDB() {
  try {
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    await connect(process.env.DATABASE_URL, options);
    console.log('Database Connected');
  } catch (error) {
    console.log(`Database Failed: ${error.message}`);
  }
}

export default connectDB;
