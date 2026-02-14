const mongoose = require("mongoose");

const busEditRequestSchema = new mongoose.Schema(
  {
    // ========================
    // Core References
    // ========================
    busId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bus",
      required: true,
      index: true,
    },

    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Admin
      default: null,
    },

    // ========================
    // Action Type
    // ========================
    actionType: {
      type: String,
      enum: [
        "ADD_STOPPAGE",
        "UPDATE_STOPPAGE",
        "DELETE_STOPPAGE",
        "UPDATE_BUS" // ✅ bus-level update (except busNumber)
      ],
      required: true,
    },

    // ========================
    // Target Stoppage (only for stoppage update/delete)
    // ========================
    stoppageId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },

    // ========================
    // Requested Change Data
    // ========================
    requestedData: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    // ========================
    // Admin Review Status
    // ========================
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
      index: true,
    },

    adminRemark: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// ========================
// Validation Logic
// ========================
busEditRequestSchema.pre("validate", function (next) {
  // UPDATE / DELETE stoppage must have stoppageId
  if (
    ["UPDATE_STOPPAGE", "DELETE_STOPPAGE"].includes(this.actionType) &&
    !this.stoppageId
  ) {
    return next(
      new Error("stoppageId is required for UPDATE_STOPPAGE or DELETE_STOPPAGE")
    );
  }

  // ADD stoppage must have data
  if (this.actionType === "ADD_STOPPAGE" && !this.requestedData) {
    return next(
      new Error("requestedData is required for ADD_STOPPAGE")
    );
  }

  // UPDATE bus must have data
  if (this.actionType === "UPDATE_BUS" && !this.requestedData) {
    return next(
      new Error("requestedData is required for UPDATE_BUS")
    );
  }

  next();
});

module.exports = mongoose.model("BusEditRequest", busEditRequestSchema);
