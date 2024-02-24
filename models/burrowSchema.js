import mongoose from "mongoose";

const burrowSchema = new mongoose.Schema(
  {
    book_id: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    book_name: {
      type: String,
      required: true,
    },
    user_id: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    user_name: {
      type: String,
      required: true,
    },
    due_date: {
      type: Date,
      required: true,
    },
    is_returned: {
      type: Boolean,
      default: false,
    },
    returned_date: {
      type: Date,
      default: null,
    },
    has_review: {
      type: Boolean,
      default: false,
    }
  },
  {
    timestamps: true,
  }
);

 // burrows
export default mongoose.model("burrow", burrowSchema);
