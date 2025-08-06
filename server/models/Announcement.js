import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['sale', 'promotion', 'info', 'announcement'],
    default: 'announcement'
  },
  buttonText: {
    type: String,
    trim: true
  },
  buttonLink: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date
  },
  priority: {
    type: Number,
    default: 1,
    min: 1,
    max: 10
  },
  backgroundColor: {
    type: String,
    default: '#10b981'
  },
  textColor: {
    type: String,
    default: '#ffffff'
  }
}, {
  timestamps: true
});

// Index for efficient querying
announcementSchema.index({ isActive: 1, priority: -1, startDate: 1 });

export default mongoose.model('Announcement', announcementSchema);