import mongoose from 'mongoose'

const CustomerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobile: { type: String, required: true, unique: true },
  email: { type: String },
  address: [{
    street: String,
    city: String,
    state: String,
    pincode: String,
    isDefault: { type: Boolean, default: false }
  }],
  paymentMethods: [{
    type: { type: String },
    upiId: { type: String },
    cardNumber: { type: String },
    cardHolder: { type: String },
    expiryDate: { type: String },
    cvv: { type: String },
    accountNumber: { type: String },
    ifscCode: { type: String },
    bankName: { type: String },
    details: { type: String },
    isPrimary: { type: Boolean, default: false },
    addedAt: { type: Date, default: Date.now }
  }],
  totalSpend: { type: Number, default: 0 },
  totalOrders: { type: Number, default: 0 },
  walletBalance: { type: Number, default: 0 },
  loyaltyPoints: { type: Number, default: 0 },
  lastAdjustmentReason: { type: String },
  lastAdjustmentAction: { type: String },
  lastAdjustmentAt: { type: Date },
  referralCodes: [{ 
    code: String, 
    used: { type: Boolean, default: false },
    usedBy: String,
    usedAt: Date,
    createdAt: { type: Date, default: Date.now }
  }],
  referredBy: String,
  isActive: { type: Boolean, default: true },
  lastOrderDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

export default mongoose.models.Customer || mongoose.model('Customer', CustomerSchema)