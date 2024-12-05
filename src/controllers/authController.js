const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '24h' });
};

exports.getLoginPage = (req, res) => {
  res.render('login', { error: null });
};

exports.getRegisterPage = (req, res) => {
  res.render('register', { error: null });
};

exports.getResetPage = (req, res) => {
  res.render('reset', { error: null });
};

exports.getHomePage = (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  res.render('home', { user: req.session.user });
};

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.render('register', { error: 'Email already registered' });
    }

    const user = new User({ email, password });
    await user.save();

    res.redirect('/login');
  } catch (error) {
    res.render('register', { error: 'Registration failed' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.render('login', { error: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.render('login', { error: 'Invalid credentials' });
    }

    req.session.user = { email: user.email, id: user._id };
    res.redirect('/home');
  } catch (error) {
    res.render('login', { error: 'Login failed' });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, oldPassword, newPassword } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.render('reset', { error: 'User not found' });
    }

    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      return res.render('reset', { error: 'Invalid old password' });
    }

    user.password = newPassword;
    await user.save();

    res.redirect('/login');
  } catch (error) {
    res.render('reset', { error: 'Password reset failed' });
  }
};

exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect('/login');
};