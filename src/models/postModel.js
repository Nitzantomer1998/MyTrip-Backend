// Import needed package
import mongoose from 'mongoose';

// Create post schema
const postSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.ObjectId,
      ref: 'User',
      required: true,
    },
    location: {
      type: String,
      default: null,
    },
    text: {
      type: String,
    },
    images: {
      type: Array,
    },
    type: {
      type: String,
      enum: ['profilePicture', null],
      default: null,
    },
    background: {
      type: String,
    },

    sharedFrom: {
      type: mongoose.ObjectId,
      ref: 'Post',
      default: null,
    },
    originalUser: {
      username: {
        type: String,
      },
    },
    sharingUser: {
      username: {
        type: String,
        default: null,
      },
    },

    recommends: [
      {
        recommend: {
          type: mongoose.ObjectId,
          ref: 'User',
        },
        recommendAt: {
          type: Date,
          required: true,
        },
      },
    ],
    likes: [
      {
        like: {
          type: mongoose.ObjectId,
          ref: 'User',
        },

        likeAt: {
          type: Date,
          required: true,
        },
      },
    ],
    comments: [
      {
        comment: {
          type: String,
        },

        commentBy: {
          type: mongoose.ObjectId,
          ref: 'User',
        },
        commentAt: {
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

// Create post model
const Post = mongoose.model('Post', postSchema);

// Export the model
export default Post;
