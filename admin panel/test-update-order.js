const { MongoClient } = require('mongodb');

async function updateOrder() {
  const client = new MongoClient('mongodb://localhost:27017');
  
  try {
    await client.connect();
    const db = client.db('laundry');
    
    // Find a delivery_failed order
    const order = await db.collection('orders').findOne({ status: 'delivery_failed' });
    
    if (order) {
      console.log('Found order:', order.orderId);
      
      // Update it with return request fields
      const result = await db.collection('orders').updateOne(
        { _id: order._id },
        { 
          $set: { 
            returnToHubRequested: true,
            returnToHubRequestedAt: new Date()
          } 
        }
      );
      
      console.log('Update result:', result);
      
      // Verify update
      const updated = await db.collection('orders').findOne({ _id: order._id });
      console.log('Updated order returnToHubRequested:', updated.returnToHubRequested);
    } else {
      console.log('No delivery_failed orders found');
    }
  } finally {
    await client.close();
  }
}

updateOrder().catch(console.error);
