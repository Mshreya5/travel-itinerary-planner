const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const planRoutes            = require('./routes/planRoutes');
const authRoutes            = require('./routes/authRoutes');
const eventsTransportRoutes = require('./routes/eventsTransportRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ─── Database ─────────────────────────────────────────────────────────────────
let isConnected = false;

const connectDB = async () => {
  if (isConnected || mongoose.connection.readyState >= 1) {
    isConnected = true;
    return;
  }
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/travel-itinerary');
    isConnected = true;
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.log('⚠️  MongoDB not available – itineraries will not be persisted.');
    console.log('   Error:', err.message);
  }
};

app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api', planRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', eventsTransportRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'TravelPlan API is running! 🌍' });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
