import mongoose from "mongoose";

const recordSchema = new mongoose.Schema(
  {
    // user who created the record
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // what type of record is this?
    type: {
      type: String,
      enum: ["symptom", "lifestyle"],
      required: true,
    },

    // full input data from frontend (symptom or lifestyle form)
    inputData: {
      type: Object,
      required: true,
    },

    // AI generated result / report
    aiResult: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Record", recordSchema);
