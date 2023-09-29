import fs from 'fs';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';

// Import needed functions
import connectDB from './config/database.js';
import fileUpload from 'express-fileupload';

// Set up dotenv configuartion
dotenv.config();

// Set up database connection
await connectDB();

// Set up express app
const app = express();

// Set up express middlewares
app.use(express.json());
app.use(cors({ origin: process.env.BASE_URL, credentials: true }));
app.use(fileUpload({ useTempFiles: true }));

// Set up dynamic route classifier
fs.readdirSync('./src/routes').map(async (route) =>
  app.use('/', (await import(`./routes/${route}`)).default)
);

// Set up server listener
app.listen(process.env.PORT, () => console.log('Server Connected'));


// Tricking The Hosting Website "Render" Followed By Faster Responses
import axios from 'axios';

const keepServerAlive = async () => {
  try {
    await axios.get('https://mytrip-backend-pc4j.onrender.com');
  } catch (error) {
    return;
  }
};

setInterval(keepServerAlive, 600000);
// Tricking The Hosting Website "Render" Followed By Faster Responses
