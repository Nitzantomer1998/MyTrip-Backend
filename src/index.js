import express from 'express';
import dotenv from 'dotenv';

import connectToDB from './config/database.js';
import userRoute from './routes/userRoute.js';

dotenv.config();

connectToDB();

const app = express();

app.use(express.json());
app.get('/', (req, res) => {
  res.send('Default message');
});

app.use('/user', userRoute);

app.listen(process.env.PORT, () => console.log('Server Connected'));
