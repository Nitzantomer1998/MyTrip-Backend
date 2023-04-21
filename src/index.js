import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import connectToDB from './config/database.js';
import userRoute from './routes/userRoute.js';
import logger from './middlewares/logger.js';

dotenv.config();
await connectToDB();

const server = express();

server.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
server.use(express.urlencoded({ extended: true, limit: '1mb' }));
server.use(express.json());
server.use(logger);

server.use('/user', userRoute);

server.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

server.get('/', (req, res) => res.send('Default message'));

server.listen(process.env.PORT || 3000, () => {
  console.log('Server Connected');
});
