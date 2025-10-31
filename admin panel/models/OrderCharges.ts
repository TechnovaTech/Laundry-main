import mongoose from 'mongoose'

const OrderChargesSchema = new mongoose.Schema({
  cancellationPercentage: { type: Number, default: 20 },
  customerUnavailable: { type: Number, default: 150 },
  incorrectAddress: { type: Number, default: 150 },
  refusalToAccept: { type: Number, default: 150 },
  updatedAt: { type: Date, default: Date.now }
})

export default mongoose.models.OrderCharges || mongoose.model('OrderCharges', OrderChargesSchema)
