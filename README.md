# 🌱 Smart Crop Advisory System - Backend

The **backend** of the Smart Crop Advisory System powers authentication, crop advisories, weather data, and integration with ML recommendations.

---

## ✨ Features
- RESTful API built with **Node.js & Express**
- User authentication with JWT
- MongoDB for storing user and field data
- Weather data integration
- Advisory and crop recommendation endpoints
- Error handling middleware

---

## 🛠 Tech Stack
- **Node.js** + **Express.js**
- **MongoDB** (Mongoose)
- **JWT Authentication**
- **Axios** for API calls
- **dotenv** for environment variables

---

## 📂 Folder Structure

```text
smart-crop-backend/
├── config/          # DB and app configs
├── controllers/     # Request handlers
├── middleware/      # Authentication middleware
├── models/          # Mongoose models (User, Field, Advisory)
├── routes/          # API routes
├── scripts/         # Seed data scripts
├── services/        # External services (ML, weather, SMS)
├── utils/           # Helpers and error handlers
├── server.js        # Entry point
├── package.json     # Dependencies
└── .env.example     # Env variables template
```

---

## 🚀 Getting Started

### 1️⃣ Prerequisites
- Node.js (>= 16.x)
- MongoDB (local or cloud, e.g., MongoDB Atlas)
- NPM or Yarn

### 2️⃣ Installation
```bash
cd smart-crop-backend
npm install
```

### 3️⃣ Configuration
Copy `.env.example` → `.env` and update with:
```env
PORT=5000
MONGO_URI=mongodb+srv://<DB_USER>:<DB_PASSWORD>@<CLUSTER_URL>/<DB_NAME>?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key
OWM_API_KEY=your_openweathermap_api_key
ML_SERVICE_URL=http://127.0.0.1:8000
TWILIO_SID=your_twilio_sid
TWILIO_TOKEN=your_twilio_token
TWILIO_FROM=+91xxxxxxxxxx
CHATBASE_ID=your_chatbase_id
```

### 4️⃣ Run Server
```bash
npm run dev
```

Server will run on 👉 `http://localhost:5000`

---

## 🔗 API Endpoints
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/fields`
- `POST /api/fields`
- `GET /api/advisory/:fieldId`
- `GET /api/weather/:location`
- `POST /api/recommendation`

---

## 🤝 Contribution
1. Fork the repo  
2. Create a new branch (`feature-xyz`)  
3. Commit changes  
4. Push branch  
5. Create a Pull Request  

---

## 📜 License
This project is licensed under the **MIT License**.
