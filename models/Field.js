const mongoose = require('mongoose');

const fieldSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: String,
  location: String,
  soilPh: Number,
  crop: String
}, { timestamps: true });

module.exports = mongoose.model('Field', fieldSchema);
