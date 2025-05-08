const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Import User model
const { authenticate, authorize } = require('../middleware/auth');

const userRouter = express.Router();

// ✅ User Registration
userRouter.post('/:tenantId/user', authenticate, authorize(['Admin']), async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if email already exists in this tenant
    const existingUser = await User.findOne({ email, tenantId: req.params.tenantId });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      tenantId: req.params.tenantId,
      name,
      email,
      password: hashedPassword,
      role,
    });

    await user.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error in user registration:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ✅ User Login
userRouter.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { userId: user._id, tenantId: user.tenantId, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ✅ Fetch All Users in a Tenant (Protected Route)
userRouter.get('/:tenantId', authenticate, authorize(['Admin']), async (req, res) => {
  try {
    const users = await User.find({ tenantId: req.params.tenantId }).select('-password'); // Exclude password
    res.json(users);
  } catch (error) {
    console.error('Fetching users error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = userRouter;
