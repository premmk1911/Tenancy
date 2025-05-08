// backend/models/Tenant.js
const mongoose = require('mongoose');

const TenantSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  adminEmail: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Tenant', TenantSchema);