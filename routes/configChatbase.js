const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ id: process.env.CHATBASE_ID });
});

module.exports = router;
