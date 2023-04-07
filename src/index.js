import express from 'express';
import mongoose from 'mongoose';
import Register from './models/registerModel.js';

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  console.log('A new request has arrived to index.js');
  res.send('Hello from the server main page');
});

app.post('/register', async (req, res) => {
  try {
    const register = await Register.create(req.body);
    res.status(200).json(register);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Register.findOne({ email });
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }
    if (user.password !== password) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }
    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

mongoose
  .connect(
    'mongodb+srv://nitzantomer1998:nitzantomer1998@backend-api.nminrxb.mongodb.net/?retryWrites=true&w=majority',
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    console.log('Connected to MongoDB');

    app.listen(PORT, () => {
      console.log(`Server is up and running at port --> ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
