const mongoose = require('mongoose');

const fieldSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: String,
  location: String,
  soilPh: { type: Number, default: 7.0 },
  crop: String,
  N: { type: Number, default: 120 },
}, { timestamps: true });

module.exports = mongoose.model('Field', fieldSchema);
