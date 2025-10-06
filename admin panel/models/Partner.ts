import mongoose from 'mongoose'

const PartnerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobile: { type: String, required: true, unique: true },
  email: { type: String },
  vehicleNumber: String,
  vehicleType: String,
  aadharNumber: String,
  panNumber: String,
  bankDetails: {
    accountNumber: String,
    ifscCode: String,
    bankName: String
  },
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String
  },
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  rating: { type: Number, default: 0 },
  totalDeliveries: { type: Number, default: 0 },
  totalEarnings: { type: Number, default: 0 },
  currentOrders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

export default mongoose.models.Partner || mongoose.model('Partner', PartnerSchema)