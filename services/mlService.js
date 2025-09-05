const axios = require('axios');
const weatherService = require('./weatherService');
const WeatherCache = require('../models/WeatherCache');

exports.getRecommendation = async (field) => {
  try {
    // 1️⃣ Fetch weather (with cache)
    let forecast = {};
    const cached = await WeatherCache.findOne({ location: field.location });

    if (cached && (Date.now() - cached.updatedAt) < 3600_000) {
      forecast = cached.data.forecast || {};
    } else {
      const wx = await weatherService.getForecast(field.location);
      forecast = wx.forecast || {};
      await WeatherCache.findOneAndUpdate(
        { location: field.location },
        { data: { forecast }, updatedAt: new Date() },
        { upsert: true }
      );
    }

    // 2️⃣ Prepare ML payload with safe defaults
    const payload = {
      soilPh: Number(field.soilPh) || 7.0,
      N: Number(field.N) || 120,
      rain: forecast.rainfall != null ? Number(forecast.rainfall.toFixed(2)) : 0,
      temperature: forecast.temperature != null ? Number(forecast.temperature.toFixed(2)) : 30.0,
      humidity: forecast.humidity != null ? Number(forecast.humidity.toFixed(2)) : 50.0,
      crop: field.crop ? String(field.crop) : "Not specified"
    };

    console.log("ML payload ->", payload);

    // 3️⃣ Call ML service
    const res = await axios.post(`${process.env.ML_SERVICE_URL}/recommend`, payload);

    // 4️⃣ Format recommendation
    let recommended = res.data.recommended_crop || "No recommendation available";
    recommended = recommended.charAt(0).toUpperCase() + recommended.slice(1);

    return recommended;

  } catch (err) {
    console.error("ML Service error:", err.message);
    return "No recommendation available";
  }
};
