const mongoose = require('mongoose');

// MongoDB connection
const MONGODB_URI = 'mongodb://localhost:27017/laundry';

async function addDueAmountField() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const customersCollection = db.collection('customers');

    // Add dueAmount field to all customers who don't have it
    const result = await customersCollection.updateMany(
      { dueAmount: { $exists: false } },
      { $set: { dueAmount: 0 } }
    );

    console.log(`Updated ${result.modifiedCount} customers with dueAmount field`);

    // Verify
    const sampleCustomer = await customersCollection.findOne({});
    console.log('Sample customer:', {
      _id: sampleCustomer._id,
      name: sampleCustomer.name,
      walletBalance: sampleCustomer.walletBalance,
      dueAmount: sampleCustomer.dueAmount
    });

    await mongoose.connection.close();
    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

addDueAmountField();
