import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
  }
  },
  {
    timestamps: true,
  }
)

//sessions
export default mongoose.model("session", sessionSchema)