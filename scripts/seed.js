const mongoose = require('mongoose');
require('dotenv').config();
const connectDB = require('../config/db');
const User = require('../models/User');
const Field = require('../models/Field');

connectDB();

const seed = async () => {
  await User.deleteMany();
  await Field.deleteMany();

  const user = await User.create({ name: "Test Farmer", email: "farmer@test.com", password: "123456" });
  await Field.create({ userId: user._id, name: "Field 1", lat: 22.5726, lng: 88.3639, soilPh: 6.5, crop: "Wheat" });
  console.log("Seed done");
  process.exit();
};

seed();
