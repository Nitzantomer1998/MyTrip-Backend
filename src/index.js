import express from 'express';
import connectDB from './config/database.js';
import dotenv from 'dotenv';

import userRoute from './routes/userRoute.js';

dotenv.config();

connectDB();

const app = express();

app.use(express.json());
app.use('/users', userRoute);

app.listen(process.env.PORT, () => console.log('Server Connected'));
