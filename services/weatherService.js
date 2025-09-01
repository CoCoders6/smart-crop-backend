const axios = require("axios");

exports.getForecast = async (location) => {
  try {
    const key = process.env.OWM_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${key}&units=metric`;

    const res = await axios.get(url);

    return {
      temperature: res.data.main.temp,
      temperatureMin: res.data.main.temp_min,
      temperatureMax: res.data.main.temp_max,
      humidity: res.data.main.humidity,
      rainfall: res.data.rain ? res.data.rain["1h"] || 0 : 0,
      description: res.data.weather[0].description,
    };
  } catch (err) {
    console.error("Weather fetch error:", err.message);

    return {
      temperature: 30,
      temperatureMin: 28,
      temperatureMax: 32,
      humidity: 60,
      rainfall: 0,
      description: "Clear sky",
    };
  }
};
