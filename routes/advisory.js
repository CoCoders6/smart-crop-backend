const express = require("express");
const router = express.Router();
const advisoryController = require("../controllers/advisoryController");
const authMiddleware = require("../middleware/auth");

// Generate advisory JSON
router.post("/:fieldId", authMiddleware, advisoryController.createAdvisory);

// Send advisory via SMS
router.post("/sms/:fieldId", authMiddleware, advisoryController.sendAdvisorySMS);

module.exports = router;
