require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/auth');
const fieldRoutes = require('./routes/fields');
const weatherRoutes = require('./routes/weather');
const advisoryRoutes = require('./routes/advisory');
const recommendationRoutes = require('./routes/recommendation');
const configChatbaseRoutes = require("./routes/configChatbase");

const app = express();
connectDB();

// ✅ Restrict CORS to your frontend domain
app.use(cors({
  origin: [
    "https://smartcropadvisor.vercel.app", // your frontend
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

app.use(express.json());

// ✅ Routes
app.get("/", (req, res) => {
  res.send("🌱 Smart Crop Backend is running!");
});

app.use('/api/auth', authRoutes);
app.use('/api/fields', fieldRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/advisory', advisoryRoutes);
app.use('/api/recommendation', recommendationRoutes);
app.use("/configChatbase", configChatbaseRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
