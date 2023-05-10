// Import needed packages
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import fileUpload from 'express-fileupload';
import { readdirSync } from 'fs';

// Import needed files
import connectDB from './config/database.js';

// Config environment variables
dotenv.config();

// Connect to database
await connectDB();

// Connect to express
const app = express();

// Define express middlewares
app.use(express.json());
app.use(cors({ origin: process.env.BASE_URL, credentials: true }));
app.use(fileUpload({ useTempFiles: true }));

// Define Routes
readdirSync('./src/routes').map(async (route) =>
  app.use('/', (await import(`./routes/${route}`)).default)
);

// Define server listening port
app.listen(process.env.PORT, () => console.log('Server Connected'));
