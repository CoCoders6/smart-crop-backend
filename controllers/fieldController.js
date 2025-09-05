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

exports.deleteField = async (req, res) => {
  try {
    const field = await Field.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId, // ensure user can only delete their own field
    });

    if (!field) {
      return res.status(404).json({ success: false, error: "Field not found" });
    }

    res.json({ success: true, message: "Field deleted successfully" });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
