import express from 'express';
import mongoose from 'mongoose';

const PORT = process.env.port || 3001;
const APP = express();

APP.use(express.json());

APP.get('/', (req, res) => {
  console.log('A new request has arrived to index.js');
  res.send('Hello from the server main page');
});

APP.post('/register', (req, res) => {
  console.log(req.body);
  res.send(req.body);
});

mongoose
  .connect(
    'mongodb+srv://nitzantomer1998:nitzantomer1998@backend-api.nminrxb.mongodb.net/?retryWrites=true&w=majority'
  )
  .then(() => {
    console.log('connected to mongoDB');

    APP.listen(PORT, () => {
      console.log(`server is up and running at port --> ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
