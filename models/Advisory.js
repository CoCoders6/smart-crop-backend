const mongoose = require('mongoose'); 

const advisorySchema = new mongoose.Schema({
  fieldId: { type: mongoose.Schema.Types.ObjectId, ref: 'Field' },
  advisories: [String],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Advisory', advisorySchema);
