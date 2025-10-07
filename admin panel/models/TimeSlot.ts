import mongoose from 'mongoose'

const TimeSlotSchema = new mongoose.Schema({
  time: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['pickup', 'delivery', 'both'],
    default: 'both'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

export default mongoose.models.TimeSlot || mongoose.model('TimeSlot', TimeSlotSchema)