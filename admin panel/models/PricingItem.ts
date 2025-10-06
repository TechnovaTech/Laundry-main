import mongoose from 'mongoose';

const PricingItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: ['Men', 'Women', 'Household', 'All'],
    default: 'All'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.models.PricingItem || mongoose.model('PricingItem', PricingItemSchema);