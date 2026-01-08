const Bus = require("../models/busModel");

exports.getUniqueRoutes = async (req, res) => {
  try {
    const routes = await Bus.aggregate([
      {
        $addFields: {
          sortedStoppages: {
            $sortArray: {
              input: "$stoppages",
              sortBy: { order: 1 }
            }
          }
        }
      },
      {
        $project: {
          start: { $arrayElemAt: ["$sortedStoppages.name", 0] },
          end: { $arrayElemAt: ["$sortedStoppages.name", -1] }
        }
      },
      {
        $group: {
          _id: { start: "$start", end: "$end" }
        }
      },
      {
        $project: {
          _id: 0,
          from: "$_id.start",
          to: "$_id.end"
        }
      }
    ]);

    res.json({ success: true, routes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
