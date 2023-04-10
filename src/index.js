import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectToDB from './config/database.js';
import userRoute from './routes/userRoute.js';

dotenv.config();

connectToDB();

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
  })
);

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Default message');
});

app.use('/users', userRoute);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

app.listen(process.env.PORT, () =>
  console.log(`Server listening on port ${process.env.PORT}`)
);
