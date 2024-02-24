import mongoose from "mongoose";
import { rewiewSchemaForBooks } from './reviewSchema.js'

const bookSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      default: "active",
    },
    thumbnail: {
      type: String,
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
    publish_year: {
      type: String,
      required: true,
    },
    isbn: {
      type: String,
      unique: true,
      index: 1,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },

    is_available: {
      type: Boolean,
      default: true,
    },
    due_date: {
      type: Date,
      default: null,
    },
    reviews: {
      type: [rewiewSchemaForBooks],
      default: [],
    }
  },
  {
    timestamps: true,
  }
);

// books
export default mongoose.model("book", bookSchema);
