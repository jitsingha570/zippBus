const mongoose = require("mongoose");

const busEditRequestSchema = new mongoose.Schema(
  {
    busId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bus",
      required: true,
    },
    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["ADD", "UPDATE", "DELETE"], // type of edit
      required: true,
    },
    stoppageId: {
      type: mongoose.Schema.Types.ObjectId, // needed for UPDATE or DELETE
      ref: "Bus.stoppages",
      default: null,
    },
    data: {
      type: Object, // store the new stoppage data (name, order, times)
      default: null,
    },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },
    adminRemark: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

module.exports = mongoose.model("BusEditRequest", busEditRequestSchema);
