import mongoose from "mongoose";

const docSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String, 
    },
    summary: {
      type: String,
    },
    studyGuid: {
      type: String,
    },
    briefingGuide: {
      type: String,
    },
    faq: {
      type: String,
    },
    mindMap: {
      type: String,
    },
    noteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Note",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

const Doc = mongoose.model("Doc", docSchema);

export default Doc;
