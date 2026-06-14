import mongoose from 'mongoose';

const BookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  genre: {
    type: String,
    required: true,
    trim: true
  },
  language: {
    type: String,
    required: true,
    enum: ['english', 'hindi'],
    trim: true
  },
  availability: {
    type: String,
    required: true,
    enum: ['Available', 'Checked Out'],
    default: 'Available'
  },
  givenBy: {
    type: String,
    default: ''
  },
  coverUrl: {
    type: String,
    default: ''
  },
  summary2: {
    type: String,
    default: ''
  },
  summary4: {
    type: String,
    default: ''
  }
});

// For frontend compatibility: convert _id to id when toJSON is called
BookSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  }
});

export default mongoose.model('Book', BookSchema);
