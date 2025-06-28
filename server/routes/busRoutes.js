const express = require("express");
const router = express.Router();
const { addBus, searchBus } = require("../controllers/busController");

router.post("/add", addBus);
router.get("/search", searchBus);

module.exports = router;
