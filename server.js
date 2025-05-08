// backend/server.js - Full Tenant & User Management with RBAC, JWT, and Docker

const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const listEndpoints = require('express-list-endpoints'); // ✅ Logs API routes
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// ✅ Database Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.log('❌ MongoDB Connection Error:', err));

// ✅ Import Models and Middleware
const Tenant = require('./models/Tenant');
const User = require('./models/User');
const Project = require('./models/Project');
const { authorize } = require('./middleware/auth');

// ✅ Rate Limiting Configuration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests
  message: 'Too many requests, please try again later.'
});
app.use(limiter);

// ✅ Import Routes
const authRoutes = require('./routes/authRoutes');
const tenantRoutes = require('./routes/tenantRoutes');
const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');

// ✅ Register Routes
app.use('/api/auth', authRoutes);
app.use('/api/tenant', tenantRoutes);
app.use('/api/user', userRoutes);
app.use('/api/projects', projectRoutes);

// ✅ Log All Available Routes
console.log("✅ Available API Routes:", listEndpoints(app));

// ✅ Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
