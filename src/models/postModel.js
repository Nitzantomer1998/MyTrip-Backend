import { Schema, ObjectId, model } from 'mongoose';

const postSchema = Schema(
  {
    user: {
      type: ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['profilePicture', null],
      default: null,
    },
    background: {
      type: String,
    },
    text: {
      type: String,
    },
    images: {
      type: Array,
    },

    sharedFrom: {
      username: {
        type: String,
      },
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

    comments: [
      {
        comment: {
          type: String,
        },

        commentBy: {
          type: ObjectId,
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

const Post = model('Post', postSchema);

export default Post;
