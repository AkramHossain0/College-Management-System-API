import mongoose from "mongoose";

const noticeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    postedBy: {
      type: String,
      required: true,
    },
    postedAt: {
      type: Date,
      default: Date.now,
    }
  },
  { timestamps: true } 
);

const Notice = mongoose.model("Notice", noticeSchema);

export default Notice;
