import mongoose from 'mongoose';

const registerSchema = mongoose.Schema(
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

const Register = mongoose.model('Register', registerSchema);

export default Register;
