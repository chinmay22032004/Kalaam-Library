import dotenv from 'dotenv';
dotenv.config();

// Removed dns override to prevent Vercel DNS resolution timeout

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import Book from './models/Book.js';
import Setting from './models/Setting.js';
import User from './models/User.js';
import { auth, admin } from './middleware/auth.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Environment fallbacks
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://chinmay22032004:Chs%402203@cluster0.dsk00ft.mongodb.net/kalaam?appName=Cluster0";
const JWT_SECRET = process.env.JWT_SECRET || "kalaam_library_super_secret_key_12345";
process.env.JWT_SECRET = JWT_SECRET;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

// --- SETTINGS ROUTES ---

// GET /api/settings
app.get('/api/settings', async (req, res) => {
  try {
    const settingsList = await Setting.find({});
    // Format into the expected frontend format: { about: {}, quote: {}, spotlight: {} }
    const settingsObj = {};
    settingsList.forEach(s => {
      settingsObj[s.type] = s.data;
    });
    
    // Provide defaults if database is not seeded
    const response = {
      about: settingsObj.about || {
        mission: "Kalaam is the official poetry club of NIT Rourkela.",
        pillar1Title: "Creative Expression",
        pillar1Desc: "Empowering students.",
        pillar2Title: "Historical Preservation",
        pillar2Desc: "Showcasing Urdu, Hindi, and English masterpieces."
      },
      quote: settingsObj.quote || {
        title: "Thought of the Day",
        quote: "What you seek is seeking you.",
        author: "Rumi"
      },
      spotlight: settingsObj.spotlight || {
        title: "Spotlight: Historical Poet of the Day",
        name: "Muztar Khairabadi",
        description: "An esteemed Urdu poet."
      }
    };
    
    res.json(response);
  } catch (err) {
    console.error('API Settings Error:', err);
    res.status(500).json({ message: 'Error fetching settings', error: err.message });
  }
});

// PUT /api/settings/:type
app.put('/api/settings/:type', auth, admin, async (req, res) => {
  try {
    const { type } = req.params;
    let setting = await Setting.findOne({ type });
    
    if (setting) {
      setting.data = { ...setting.data, ...req.body };
      await setting.save();
    } else {
      setting = new Setting({
        type,
        data: req.body
      });
      await setting.save();
    }
    
    res.json(setting.data);
  } catch (err) {
    res.status(500).json({ message: 'Error updating settings' });
  }
});


// --- BOOKS ROUTES ---

// GET /api/books
app.get('/api/books', async (req, res) => {
  try {
    const books = await Book.find({});
    res.json(books);
  } catch (err) {
    console.error('API Books Error:', err);
    res.status(500).json({ message: 'Error fetching books', error: err.message });
  }
});

// POST /api/books
app.post('/api/books', auth, admin, async (req, res) => {
  try {
    const { title, author, genre, language, availability, givenBy, coverUrl, summary, issuedTo } = req.body;
    
    if (!title || !author || !genre || !language) {
      return res.status(400).json({ message: 'Title, Author, Genre and Language are required' });
    }
    
    const newBook = new Book({
      title,
      author,
      genre,
      language,
      availability: availability || 'Available',
      givenBy,
      coverUrl,
      summary,
      issuedTo: issuedTo || null
    });
    
    await newBook.save();
    res.status(201).json(newBook);
  } catch (err) {
    res.status(500).json({ message: 'Error adding book' });
  }
});

// PUT /api/books/:id
app.put('/api/books/:id', auth, admin, async (req, res) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedBook) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(updatedBook);
  } catch (err) {
    res.status(500).json({ message: 'Error updating book' });
  }
});

// DELETE /api/books/:id
app.delete('/api/books/:id', auth, admin, async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(444).json({ message: 'Book not found' });
    }
    // Remove from all users' favorites
    await User.updateMany({}, { $pull: { favorites: req.params.id } });
    
    res.json({ success: true, message: 'Book deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting book' });
  }
});


// --- AUTHENTICATION ROUTES ---

// GET /api/auth/admin-registered
app.get('/api/auth/admin-registered', async (req, res) => {
  try {
    const adminExists = await User.exists({ isAdmin: true });
    res.json(!!adminExists);
  } catch (err) {
    res.status(500).json({ message: 'Error checking admin registration' });
  }
});

// POST /api/auth/register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { mobile, password, displayName, isAdmin } = req.body;
    
    if (!mobile || !password) {
      return res.status(400).json({ message: 'Mobile and password are required' });
    }
    
    if (!/^[0-9]{10}$/.test(mobile)) {
      return res.status(400).json({ message: 'Mobile number must be exactly 10 digits' });
    }
    
    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }

    // Check if user already exists
    const userExists = await User.findOne({ mobile });
    if (userExists) {
      return res.status(400).json({ message: 'Mobile number already registered' });
    }

    // If trying to register as admin, check if an admin already exists
    if (isAdmin) {
      const adminExists = await User.findOne({ isAdmin: true });
      if (adminExists) {
        return res.status(400).json({ message: 'An admin is already registered in the system' });
      }
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      mobile,
      displayName: displayName || '',
      passwordHash,
      isAdmin: !!isAdmin
    });

    await newUser.save();
    
    res.status(201).json({
      id: newUser._id.toString(),
      mobile: newUser.mobile,
      displayName: newUser.displayName,
      isAdmin: newUser.isAdmin
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Error registering user' });
  }
});

// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { mobile, password } = req.body;
    
    if (!mobile || !password) {
      return res.status(400).json({ message: 'Mobile and password are required' });
    }

    const user = await User.findOne({ mobile });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user._id.toString(), mobile: user.mobile, isAdmin: user.isAdmin },
      process.env.JWT_SECRET || 'kalaam_library_super_secret_key_12345',
      { expiresIn: '1h' }
    );

    res.json({
      token,
      user: {
        id: user._id.toString(),
        mobile: user.mobile,
        displayName: user.displayName,
        isAdmin: user.isAdmin,
        favorites: user.favorites ? user.favorites.map(id => id.toString()) : []
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Error during login' });
  }
});

// GET /api/auth/me
app.get('/api/auth/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({
      id: user._id.toString(),
      mobile: user.mobile,
      displayName: user.displayName,
      isAdmin: user.isAdmin,
      favorites: user.favorites ? user.favorites.map(id => id.toString()) : []
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user' });
  }
});

// POST /api/auth/me/favorites
app.post('/api/auth/me/favorites', auth, async (req, res) => {
  try {
    const { bookId } = req.body;
    if (!bookId) return res.status(400).json({ message: 'Book ID required' });
    
    const user = await User.findById(req.user._id);
    if (!user.favorites.includes(bookId)) {
      user.favorites.push(bookId);
      await user.save();
    }
    res.json({ success: true, favorites: user.favorites });
  } catch (err) {
    res.status(500).json({ message: 'Error adding favorite' });
  }
});

// DELETE /api/auth/me/favorites/:bookId
app.delete('/api/auth/me/favorites/:bookId', auth, async (req, res) => {
  try {
    const { bookId } = req.params;
    const user = await User.findById(req.user._id);
    user.favorites = user.favorites.filter(id => id.toString() !== bookId);
    await user.save();
    res.json({ success: true, favorites: user.favorites });
  } catch (err) {
    res.status(500).json({ message: 'Error removing favorite' });
  }
});

// POST /api/auth/logout
app.post('/api/auth/logout', (req, res) => {
  res.json({ success: true });
});


// --- ADMIN MANAGEMENT ROUTES ---

// GET /api/admin/users
app.get('/api/admin/users', auth, admin, async (req, res) => {
  try {
    const users = await User.find({}).select('-passwordHash').sort({ createdAt: -1 });
    // Transform _id to id for frontend consistency
    const formattedUsers = users.map(u => ({
      id: u._id.toString(),
      mobile: u.mobile,
      displayName: u.displayName,
      isAdmin: u.isAdmin,
      createdAt: u.createdAt
    }));
    res.json(formattedUsers);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// PUT /api/admin/users/:id/transfer-admin
app.put('/api/admin/users/:id/transfer-admin', auth, admin, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const targetUserId = req.params.id;
    const currentAdminId = req.user._id;

    if (currentAdminId.toString() === targetUserId) {
      return res.status(400).json({ message: 'You are already the admin' });
    }

    const targetUser = await User.findById(targetUserId).session(session);
    if (!targetUser) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'Target user not found' });
    }

    // Demote current admin
    await User.findByIdAndUpdate(currentAdminId, { isAdmin: false }).session(session);
    
    // Promote target user
    targetUser.isAdmin = true;
    await targetUser.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.json({
      id: targetUser._id.toString(),
      mobile: targetUser.mobile,
      displayName: targetUser.displayName,
      isAdmin: true
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: 'Error transferring admin rights' });
  }
});

// DELETE /api/admin/users/:id
app.delete('/api/admin/users/:id', auth, admin, async (req, res) => {
  try {
    const userIdToDelete = req.params.id;
    
    if (req.user._id.toString() === userIdToDelete) {
      return res.status(400).json({ message: 'Admin cannot delete their own account' });
    }
    
    const user = await User.findByIdAndDelete(userIdToDelete);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting user' });
  }
});

// Start Server
import * as url from 'url';
const isMain = process.argv[1] && import.meta.url === url.pathToFileURL(process.argv[1]).href;

if (isMain) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;
