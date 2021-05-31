import { Schema } from 'mongoose';

const bookmarkSchema = new Schema(
  {
    type: {
      type: String,
      enum: ['photo', 'video'],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      required: false,
      default: [],
    },
    contentDetails: {
      height: {
        type: Number,
        required: true,
      },
      width: {
        type: Number,
        required: true,
      },
      duration: {
        type: Number,
        required: false,
      },
    },
  },
  { timestamps: true },
);

export default bookmarkSchema;
