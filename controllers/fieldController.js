const Field = require('../models/Field');

exports.createField = async (req, res) => {
  try {
    const field = await Field.create({ ...req.body, userId: req.userId });
    res.json({ success: true, field });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.getFields = async (req, res) => {
  try {
    const fields = await Field.find({ userId: req.userId });
    res.json({ success: true, fields });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.getFieldById = async (req, res) => {
  try {
    const field = await Field.findById(req.params.id);
    res.json({ success: true, field });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
