import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { env } from '../config/env.js';

const createToken = (user) =>
  jwt.sign({ id: user._id, email: user.email }, env.jwtSecret, {
    expiresIn: '7d',
  });

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
        data: null,
      });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered',
        data: null,
      });
    }

    const user = await User.create({ name, email, password });
    const token = createToken(user);

    return res.status(201).json({
      success: true,
      data: {
        user: { id: user._id, name: user.name, email: user.email },
        token,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Signup failed',
      data: null,
      error: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password required',
        data: null,
      });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
        data: null,
      });
    }

    const token = createToken(user);
    return res.json({
      success: true,
      data: {
        user: { id: user._id, name: user.name, email: user.email },
        token,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Login failed',
      data: null,
      error: error.message,
    });
  }
};

export const getProfile = (req, res) =>
  res.json({ success: true, data: { user: req.user } });

export const deleteAccount = async (req, res) => {
  await User.findByIdAndDelete(req.user.id);
  return res.json({
    success: true,
    data: { message: 'Account deleted', userId: req.user.id },
  });
};
