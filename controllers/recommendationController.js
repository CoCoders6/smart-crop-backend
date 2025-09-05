const Field = require('../models/Field');
const mlService = require('../services/mlService');

exports.getRecommendation = async (req, res) => {
  try {
    const field = await Field.findById(req.params.fieldId);
    if (!field) 
      return res.status(404).json({ success: false, error: "Field not found" });

    // Use soilPh and N from query if provided, fallback to DB
    const soilPh = req.query.soilPh ? Number(req.query.soilPh) : field.soilPh;
    const N = req.query.N ? Number(req.query.N) : field.N ?? 120;

    const recommendation = await mlService.getRecommendation({ ...field.toObject(), soilPh, N });

    res.json({ success: true, recommendation });
  } catch (err) {
    console.error("Recommendation error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};
