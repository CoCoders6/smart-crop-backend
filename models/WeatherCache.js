const mongoose = require('mongoose');

const weatherCacheSchema = new mongoose.Schema({
  location: String,
  data: Object,
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('WeatherCache', weatherCacheSchema);
