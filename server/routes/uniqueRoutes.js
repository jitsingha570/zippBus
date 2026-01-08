const express = require("express");
const router = express.Router();
const { getUniqueRoutes } = require("../controllers/uniqueRoutesController");

router.get("/unique-routes", getUniqueRoutes);


module.exports = router;

