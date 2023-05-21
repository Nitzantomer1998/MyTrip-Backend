// Import needed package
import mongoose from 'mongoose';

// Create user schema
const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },

    picture: {
      type: String,
      default:
        'https://res.cloudinary.com/dmhcnhtng/image/upload/v1643044376/avatars/default_pic_jeaybr.png',
    },
    details: {
      bio: {
        type: String,
      },
    },

    following: [
      {
        type: mongoose.ObjectId,
        ref: 'User',
      },
    ],
    followers: [
      {
        type: mongoose.ObjectId,
        ref: 'User',
      },
    ],

    likedPosts: [
      {
        post: {
          type: mongoose.ObjectId,
          ref: 'Post',
        },
        likedAt: {
          type: Date,
          required: true,
        },
      },
    ],
    recommendedPosts: [
      {
        post: {
          type: mongoose.ObjectId,
          ref: 'Post',
        },
        recommendedAt: {
          type: Date,
          required: true,
        },
      },
    ],
    savedPosts: [
      {
        post: {
          type: mongoose.ObjectId,
          ref: 'Post',
        },
        savedAt: {
          type: Date,
          required: true,
        },
      },
    ],

    search: [
      {
        user: {
          type: mongoose.ObjectId,
          ref: 'User',
          required: true,
        },
        createdAt: {
          type: Date,
          required: true,
        },
      },
    ],
  },

  {
    timestamps: true,
  }
);

// Create user model
const User = mongoose.model('User', userSchema);

// Export the model
export default User;
