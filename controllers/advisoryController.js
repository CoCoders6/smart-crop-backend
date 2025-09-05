const Field = require("../models/Field");
const User = require("../models/User");
const Advisory = require("../models/Advisory");
const smsService = require("../services/smsService");
const weatherService = require("../services/weatherService");


// 🔹 Generate dynamic advisory based on field and weather
function generateAdvisory({ rain, temperature, humidity }) {
  const advice = [];
  
  // 🌧️ Rain
  if (rain < 1) advice.push("Low rain irrigate crops");
  else if (rain <= 9) advice.push("Good rain less irrigation needed");
  else advice.push("Heavy rain check drainage");

  // 🌡️ Temperature
  if (temperature <= 10) advice.push("Protect crops from cold stress");
  else if (temperature <= 20 && temperature >10) advice.push("Cold weather good for Rabi crops");
  else if (temperature <= 30 && temperature >20) advice.push("Temperature normal crops healthy");
  else if (temperature <= 35 && temperature >30) advice.push("Hot weather irrigate to reduce stress");
  else advice.push("Very hot provide shade and water");

  // 💧 Humidity
  if (humidity < 50) advice.push("Low humidity irrigate more");
  else if (humidity <= 80) advice.push("Humidity normal");
  else advice.push("High humidity watch for fungal attack");

  return advice;
}


// 🔹 Create advisory (API)
exports.createAdvisory = async (req, res) => {
  const { fieldId } = req.params;

  try {
    const field = await Field.findById(fieldId);
    if (!field) return res.status(404).json({ error: "Field not found" });

    const rawWeather = await weatherService.getForecast(field.location);
const forecast = rawWeather.forecast; // ✅ extract only forecast

// ✅ match the expected params for generateAdvisory
const weather = {
  rain: forecast.rainfall ?? 0,
  temperature: forecast.temperature ?? 25,
  humidity: forecast.humidity ?? 50
};

const advice = generateAdvisory(weather);

    // Save advisory in DB
    const newAdvisory = await Advisory.create({ fieldId, advisories: advice });

    res.json({ success: true, field, advice: newAdvisory.advisories });
  } catch (err) {
    console.error("Advisory error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

// 🔹 Send advisory via SMS
exports.sendAdvisorySMS = async (req, res) => {
  const { fieldId } = req.params;

  try {
    const field = await Field.findById(fieldId);
    if (!field) return res.status(404).json({ error: "Field not found" });

    const user = await User.findById(field.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const weather = await weatherService.getForecast(field.location);
    const advice = generateAdvisory(field, weather);

    const phone = user.phone || "+91xxxxxxxxxx";
    const message = `Advisory for field "${field.name}" (${field.crop}):\n${advice.join("\n")}`;

    if (process.env.TWILIO_SID && process.env.TWILIO_TOKEN && process.env.TWILIO_FROM) {
      await smsService.sendSMS(phone, message);
      res.json({ success: true, message: "SMS sent", advisory: advice });
    } else {
      console.log("SMS fallback:", message);
      res.json({ success: true, message: "SMS fallback (console)", advisory: advice });
    }
  } catch (err) {
    console.error("SMS error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};
