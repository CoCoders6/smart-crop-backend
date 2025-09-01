const axios = require('axios');
const weatherService = require('./weatherService');
const WeatherCache = require('../models/WeatherCache');

exports.getRecommendation = async (field) => {
  try {
    // 1️⃣ Fetch weather (with cache)
    let forecast;
    const cached = await WeatherCache.findOne({ location: field.location });
    if (cached && (Date.now() - cached.updatedAt) < 3600_000) { // 1 hour
      forecast = cached.data;
    } else {
      forecast = await weatherService.getForecast(field.location);
      await WeatherCache.findOneAndUpdate(
        { location: field.location },
        { data: forecast, updatedAt: new Date() },
        { upsert: true }
      );
    }

    // 2️⃣ Prepare ML payload
    const payload = {
      soilPh: field.soilPh,
      N: field.N || 120,           // use DB value or fallback
      rain: forecast.rainfall,     // real rainfall from API/cache
      crop: field.crop || "Not specified"
    };

    console.log("ML payload:", payload); // debug logging

    // 3️⃣ Call ML service
    const res = await axios.post(`${process.env.ML_SERVICE_URL}/recommend`, payload);

    // 4️⃣ Return ML recommendation
    return res.data.recommended_crop;

  } catch (err) {
    console.error("ML Service error:", err.message);
    return "No recommendation available";
  }
};
