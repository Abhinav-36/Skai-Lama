const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  }
}, {
  timestamps: true
});

profileSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Profile', profileSchema);


