const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Tenant = require('../models/Tenant');
const User = require('../models/User');
const router = express.Router();
require('dotenv').config();

// ✅ Tenant Registration
router.post('/register', async (req, res) => {
  try {
    const { name, adminEmail, password } = req.body;

    // Validation: Check for missing fields
    if (!name || !adminEmail || !password) {
      return res.status(400).json({ error: 'All fields (name, adminEmail, password) are required.' });
    }

    // Check if tenant already exists
    const existingTenant = await Tenant.findOne({ name });
    if (existingTenant) return res.status(400).json({ error: 'Tenant already exists' });

    // Check if admin email is already used
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) return res.status(400).json({ error: 'Admin email already in use' });

    // Create new tenant
    const tenant = new Tenant({ name, adminEmail });
    await tenant.save();

    // Create hashed password for admin user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      tenantId: tenant._id,
      name: 'Admin',
      email: adminEmail,
      password: hashedPassword,
      role: 'Admin'
    });
    await user.save();

    // Generate JWT Token
    const token = jwt.sign(
      { userId: user._id, tenantId: tenant._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log(`✅ Tenant "${name}" registered successfully with Admin Email: ${adminEmail}`);
    res.status(201).json({ message: 'Tenant registered successfully', token });
  } catch (error) {
    console.error('❌ Error in Tenant Registration:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ✅ Fetch All Tenants (Admin Access Only)
router.get('/', async (req, res) => {
  try {
    const tenants = await Tenant.find({}, '_id name adminEmail createdAt');
    if (!tenants.length) {
      return res.status(404).json({ message: 'No tenants found' });
    }
    res.json(tenants);
  } catch (error) {
    console.error('❌ Error fetching tenants:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
