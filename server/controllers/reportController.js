const Report = require("../models/reportModel");

// @desc Submit a new report
// @route POST /api/reports/submit
// @access Private (User)
exports.submitReport = async (req, res) => {
  try {
    const { busNumber, issueType, description, priority } = req.body;

    if (!busNumber || !issueType || !description) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const report = await Report.create({
      busNumber,
      issueType,
      description,
      priority: priority || "medium",
      reportedBy: req.user.id
    });

    res.status(201).json({
      success: true,
      message: "Report submitted successfully",
      reportId: report._id
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// @desc Get all reports submitted by logged-in user
// @route GET /api/reports/my-reports
// @access Private (User)
exports.getMyReports = async (req, res) => {
  try {
    const reports = await Report.find({ reportedBy: req.user.id }).sort({ createdAt: -1 });

    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// @desc Get all reports (Admin only)
// @route GET /api/reports
// @access Private (Admin)
exports.getAllReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate("reportedBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// @desc Update report status (Admin only)
// @route PATCH /api/reports/:id/status
// @access Private (Admin)
exports.updateReportStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["pending", "investigating", "resolved", "dismissed"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!report) {
      return res.status(404).json({ success: false, message: "Report not found" });
    }

    res.status(200).json({
      success: true,
      message: "Report status updated",
      report
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};
