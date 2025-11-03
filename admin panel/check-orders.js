const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/laundry')
  .then(() => console.log('✅ Connected'))
  .catch(err => console.error('❌ Error:', err));

const OrderSchema = new mongoose.Schema({}, { strict: false });
const Order = mongoose.model('Order', OrderSchema);

async function checkOrders() {
  try {
    const orders = await Order.find({ status: 'delivery_failed' }).select('orderId status redeliveryScheduled');
    console.log('\nDelivery Failed Orders:');
    orders.forEach(o => console.log(`  - ${o.orderId} (redelivery: ${o.redeliveryScheduled})`));
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
  }
}

checkOrders();
