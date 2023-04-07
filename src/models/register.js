import mongoose from 'mongoose';

const registerSchema = mongoose.Schema(
  {
    email: {
      type: email,
      require,
    },
    password: {
      type: String,
      require,
    },
  },
  {
    timestamp: true,
  }
);

const Register = mongoose.model('Register', registerSchema);

module.exports = Register;
