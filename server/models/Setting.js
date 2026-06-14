import mongoose from 'mongoose';

const SettingSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    unique: true
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  }
});

export default mongoose.model('Setting', SettingSchema);
