import mongoose from 'mongoose'

const PartnerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobile: { type: String, required: true, unique: true },
  email: { type: String },
  googleId: { type: String, unique: true, sparse: true },
  profileImage: { type: String },
  vehicleNumber: String,
  vehicleType: String,
  aadharNumber: String,
  panNumber: String,
  drivingLicenseNumber: String,
  aadharImage: String,
  drivingLicenseImage: String,
  kycStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  kycRejectionReason: String,
  kycSubmittedAt: Date,
  bankDetails: {
    accountHolderName: String,
    accountNumber: String,
    ifscCode: String,
    bankName: String,
    branch: String
  },
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String
  },
  pincodes: [{ type: String }],
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