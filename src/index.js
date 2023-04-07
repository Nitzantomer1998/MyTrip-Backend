import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import registerRouter from './routes/registerRouter.js';
import loginRouter from './routes/loginRouter.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(express.json());

// Routes
app.use('/register', registerRouter);
app.use('/login', loginRouter);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server is up and running at port --> ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
