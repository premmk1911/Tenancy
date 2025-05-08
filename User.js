const mongoose = require('mongoose');

// Define the User Schema
const UserSchema = new mongoose.Schema({
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant',
    required: [true, 'Tenant ID is required'],
  },
  name: {
    type: String,
    required: [true, 'User name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email address is required'],
    unique: true,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, 'Please provide a valid email address'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  role: {
    type: String,
    enum: ['Admin', 'Manager', 'Viewer'],
    required: [true, 'User role is required'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// ✅ Middleware to log when a new user is created
UserSchema.post('save', function (doc) {
  console.log(`✅ New user "${doc.name}" created with role "${doc.role}" under Tenant ID: ${doc.tenantId}`);
});

module.exports = mongoose.model('User', UserSchema);
