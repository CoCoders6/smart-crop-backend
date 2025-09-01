const weatherService = require("../services/weatherService");

exports.getWeather = async (req, res) => {
  const location = req.query.location;
  if (!location) {
    return res.status(400).json({ error: "Location query parameter is required" });
  }

  try {
    const forecast = await weatherService.getForecast(location);

    const weatherData = {
      location,
      temperature: forecast.temperature,
      humidity: forecast.humidity,
      rainfall: forecast.rainfall, // include rainfall now
      description: forecast.description,
    };

    res.json(weatherData);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
};
