import mongoose from 'mongoose';

const loginSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
    },
  },
  {
    timestamps: true,
  }
);

const Login = mongoose.model('Login', loginSchema);

export default Login;
