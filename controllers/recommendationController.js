const Field = require('../models/Field');
const mlService = require('../services/mlService');

exports.getRecommendation = async (req, res) => {
  try {
    const field = await Field.findById(req.params.fieldId);
    const recommendation = await mlService.getRecommendation(field);
    res.json({ success: true, recommendation });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
