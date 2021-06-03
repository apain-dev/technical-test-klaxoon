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
    webPage: {
      type: String,
      required: true,
    },
    thumbnail: {
      url: {
        type: String,
        required: true,
      },
      width: {
        type: Number,
        required: true,
      },
      height: {
        type: Number,
        required: true,
      },
    },
    author: {
      url: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
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
    contentUrl: { type: String, required: true },
  },
  { timestamps: true },
);

export default bookmarkSchema;
