const axios = require("axios");

exports.getForecast = async (location) => {
  try {
    const key = process.env.OWM_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${key}&units=metric`;

    const res = await axios.get(url);

    const dailyData = {};
    res.data.list.forEach((entry) => {
      const date = entry.dt_txt.split(" ")[0];
      if (!dailyData[date]) {
        dailyData[date] = {
          temps: [],
          tempMins: [],
          tempMaxs: [],
          humidities: [],
          rains: [],
          descriptions: [],
        };
      }
      dailyData[date].temps.push(entry.main.temp);
      dailyData[date].tempMins.push(entry.main.temp_min);
      dailyData[date].tempMaxs.push(entry.main.temp_max);
      dailyData[date].humidities.push(entry.main.humidity);
      if (entry.rain && entry.rain["3h"]) {
        dailyData[date].rains.push(entry.rain["3h"]);
      }
      dailyData[date].descriptions.push(entry.weather[0].description);
    });

    const days = Object.keys(dailyData).slice(0, 7); // up to 7 days

    let sumTemp = 0,
      sumMin = 0,
      sumMax = 0,
      sumHumidity = 0,
      sumRain = 0;
    const descriptions = [];

    days.forEach((d) => {
      const day = dailyData[d];
      sumTemp += day.temps.reduce((a, b) => a + b, 0) / day.temps.length;
      sumMin += Math.min(...day.tempMins);
      sumMax += Math.max(...day.tempMaxs);
      sumHumidity += day.humidities.reduce((a, b) => a + b, 0) / day.humidities.length;
      sumRain += day.rains.length ? day.rains.reduce((a, b) => a + b, 0) : 0;

      // pick most frequent description per day
      const descCounts = {};
      day.descriptions.forEach((desc) => {
        descCounts[desc] = (descCounts[desc] || 0) + 1;
      });
      const topDesc = Object.entries(descCounts).sort((a, b) => b[1] - a[1])[0][0];
      descriptions.push(topDesc);
    });

    // most frequent description of whole week
    const weekDescCounts = {};
    descriptions.forEach((desc) => {
      weekDescCounts[desc] = (weekDescCounts[desc] || 0) + 1;
    });
    const finalDesc = Object.entries(weekDescCounts).sort((a, b) => b[1] - a[1])[0][0];

    return {
      location,
      forecast: {
        location,
        temperature: sumTemp / days.length,
        temperatureMin: sumMin / days.length,
        temperatureMax: sumMax / days.length,
        humidity: sumHumidity / days.length,
        rainfall: sumRain / days.length,
        description: finalDesc,
      },
    };
  } catch (err) {
    console.error("Weather fetch error:", err.message);
    return {
      location,
      forecast: {
        location,
        temperature: 30,
        temperatureMin: 28,
        temperatureMax: 32,
        humidity: 60,
        rainfall: 0,
        description: "clear sky",
      },
    };
  }
};
