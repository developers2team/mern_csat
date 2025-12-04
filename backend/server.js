require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const csatRoutes = require('./routes/csat');
const ticketRoutes = require('./routes/ticket');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/csat', csatRoutes);
app.use('/api/tickets', ticketRoutes);

// Root test endpoint
app.get('/', (req, res) => {
  res.send('CSAT MERN backend running');
});

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

