import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  mobile: {
    type: String,
    sparse: true,
    unique: true,
    trim: true,
    match: [/^[0-9]{10}$/, 'Mobile number must be 10 digits']
  },
  email: {
    type: String,
    sparse: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  googleId: {
    type: String,
    sparse: true,
    unique: true,
  },
  displayName: {
    type: String,
    default: ''
  },
  profilePicture: {
    type: String,
    default: ''
  },
  passwordHash: {
    type: String
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('User', UserSchema);
