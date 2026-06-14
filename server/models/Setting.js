const mongoose = require('mongoose');

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

module.exports = mongoose.model('Setting', SettingSchema);
