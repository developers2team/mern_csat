const express = require('express');
const bodyParser = require('body-parser');
const reviewsRoutes = require('./routes/reviewsRoutes');
const baseRoute = require('./routes/baseRoute');
const cors = require('cors');

require('dotenv').config();

const app = express();

app.use(bodyParser.json());

// Enable CORS
const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',');

// app.use(cors({
//   origin: function(origin, callback) {
//     if (!origin) return callback(null, true);
//     // origin.endsWith('.vercel.app')
//     if (allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS')); // block
//     }
//   },
//   credentials: true
// }));

// Routes
app.use('/', baseRoute);
app.use('/reviews', reviewsRoutes);

const PORT = 8000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
