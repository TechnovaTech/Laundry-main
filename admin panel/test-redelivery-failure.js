// Test script to simulate redelivery failure for order ILKGB
// Run with: node test-redelivery-failure.js

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/laundry')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

const OrderSchema = new mongoose.Schema({}, { strict: false });
const Order = mongoose.model('Order', OrderSchema);

async function testRedeliveryFailure() {
  try {
    const order = await Order.findOne({ orderId: 'ILKGB' });
    
    if (!order) {
      console.log('❌ Order ILKGB not found');
      return;
    }

    console.log('\n📋 CURRENT STATE:');
    console.log('   Status:', order.status);
    console.log('   redeliveryScheduled:', order.redeliveryScheduled);
    console.log('   returnToHubApproved:', order.returnToHubApproved);

    console.log('\n🔄 Simulating redelivery failure...');
    
    await Order.updateOne(
      { orderId: 'ILKGB' },
      {
        $set: {
          status: 'delivery_failed',
          deliveryFailedAt: new Date(),
          returnToHubRequested: false,
          returnToHubApproved: false,
          returnToHubRequestedAt: null,
          returnToHubApprovedAt: null,
          redeliveryScheduled: true
        }
      }
    );

    console.log('✅ Order updated!\n');
    
    const updated = await Order.findOne({ orderId: 'ILKGB' });
    
    console.log('📋 NEW STATE:');
    console.log('   Status:', updated.status);
    console.log('   redeliveryScheduled:', updated.redeliveryScheduled);
    console.log('   returnToHubApproved:', updated.returnToHubApproved);
    
    console.log('\n✅ TEST COMPLETE:');
    console.log('   → Order shows in partner /hub/drop with "⚠ Redelivery Failed"');
    console.log('   → Partner can send new return request');
    console.log('   → Admin sees "SUSPEND ORDER" button');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
  }
}

testRedeliveryFailure();
