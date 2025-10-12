const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Users } = require("../models/Users");

// Register endpoint
router.post("/register", async (req, res) => {
  console.log('=== POST /auth/register - User Registration ===');
  console.log('Request body fields:', Object.keys(req.body));
  console.log('Email:', req.body.email);
  
  try {
    const { email, first_name, last_name, password } = req.body;

    // Validation logging
    if (!email || !first_name || !last_name || !password) {
      console.error('❌ Registration failed: Missing required fields');
      console.log('Missing fields:', {
        email: !email,
        first_name: !first_name,
        last_name: !last_name,
        password: !password
      });
      return res.status(400).json({ error: "All fields are required" });
    }

    console.log('✓ All required fields present');
    console.log('Checking for existing user with email:', email);

    const existingUser = await Users.findOne({ email });

    if (existingUser) {
      console.warn('⚠️ Registration failed: Email already exists');
      console.log('Existing user ID:', existingUser._id);
      return res.status(400).json({ error: "Email already in use" });
    }

    console.log('✓ Email available');
    console.log('Hashing password...');
    
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('✓ Password hashed successfully');

    const user = new Users({
      email,
      first_name,
      last_name,
      password: hashedPassword,
    });

    console.log('Saving new user to database...');
    await user.save();
    
    console.log('✅ User registered successfully');
    console.log('New user ID:', user._id);
    console.log('User details:', { email, first_name, last_name });

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error('❌ Registration error:', err.message);
    console.error('Error stack:', err.stack);
    console.error('Error name:', err.name);
    res.status(400).json({ error: err.message });
  }
});

// Login endpoint
router.post("/login", async (req, res) => {
  console.log('=== POST /auth/login - User Login ===');
  console.log('Request body fields:', Object.keys(req.body));
  console.log('Login attempt for email:', req.body.email);
  
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      console.error('❌ Login failed: Missing credentials');
      console.log('Missing:', { email: !email, password: !password });
      return res.status(400).json({ error: "Email and password are required" });
    }

    console.log('Looking up user in database...');
    const user = await Users.findOne({ email });
    
    if (!user) {
      console.warn('⚠️ Login failed: User not found');
      console.log('Email attempted:', email);
      return res.status(400).json({ error: "Invalid email or password" });
    }

    console.log('✓ User found:', user._id);
    console.log('Comparing passwords...');
    
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      console.warn('⚠️ Login failed: Invalid password');
      console.log('User ID:', user._id);
      return res.status(400).json({ error: "Invalid email or password" });
    }

    console.log('✓ Password verified');
    console.log('Checking JWT_SECRET environment variable...');
    
    if (!process.env.JWT_SECRET) {
      console.error('❌ CRITICAL: JWT_SECRET not configured');
      return res.status(500).json({ error: "Server configuration error" });
    }

    console.log('✓ JWT_SECRET present');
    console.log('Generating JWT token...');
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    console.log('✓ Token generated successfully');
    console.log('Token preview:', token.substring(0, 20) + '...');
    console.log('✅ Login successful');
    console.log('User authenticated:', {
      id: user._id,
      email: user.email,
      name: `${user.first_name} ${user.last_name}`
    });

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
      },
    });
  } catch (err) {
    console.error('❌ Login error:', err.message);
    console.error('Error stack:', err.stack);
    console.error('Error name:', err.name);
    res.status(400).json({ error: err.message });
  }
});

// Logout endpoint
router.post("/logout", (req, res) => {
  console.log('=== POST /auth/logout - User Logout ===');
  console.log('User logged out at:', new Date().toISOString());
  
  if (req.user) {
    console.log('User ID:', req.user.id);
  } else {
    console.log('No user info in request (client-side logout)');
  }
  
  res.json({
    message: "Logout successful",
  });
  
  console.log('✅ Logout completed');
});

console.log('Auth routes module loaded successfully');

module.exports = { authRoutes: router };