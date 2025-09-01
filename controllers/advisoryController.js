const Field = require("../models/Field");
const User = require("../models/User");
const Advisory = require("../models/Advisory");
const smsService = require("../services/smsService");
const weatherService = require("../services/weatherService");

// Crop-specific irrigation thresholds (mm/h or accumulated)
const irrigationThreshold = {
  paddy: 5,
  wheat: 2,
  maize: 3,
  millets: 1,
  barley: 2,
  sugarcane: 6,
  soybean: 3,
  groundnut: 2
};

// 🔹 Generate advisory based on field and weather
function generateAdvisory(field, weather) {
  const advice = [];

  const crop = field.crop || "wheat";
  const threshold = irrigationThreshold[crop] || 3;

  // Irrigation advisory
  if ((weather.rainfall || 0) >= threshold) {
    advice.push("No irrigation needed today");
  } else {
    advice.push("Irrigation recommended");
  }

  // Temperature advisory
  if ((weather.temperature || 0) > 35) {
    advice.push("Provide shade / cooling for crops");
  }

  // Soil pH advisory
  if ((field.soilPh || 7) < 5.5) {
    advice.push("Add lime to increase soil pH");
  }

  return advice;
}

// 🔹 Create advisory (API response)
exports.createAdvisory = async (req, res) => {
  const { fieldId } = req.params;

  try {
    const field = await Field.findById(fieldId);
    if (!field) return res.status(404).json({ error: "Field not found" });

    // Fetch weather for field location
    const weather = await weatherService.getForecast(field.location);

    const advice = generateAdvisory(field, weather);

    // Optionally save advisory in DB
    await Advisory.create({ fieldId, advisories: advice });

    res.json({ success: true, field, advice });
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
    const message = `Advisory for field "${field.name}":\n${advice.join(", ")}`;

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
