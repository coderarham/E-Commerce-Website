const mongoose = require('mongoose');
require('dotenv').config();

const testConnection = async () => {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI;
    console.log('Connecting to:', mongoUri);
    
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');
    
    // List all databases
    const admin = mongoose.connection.db.admin();
    const dbs = await admin.listDatabases();
    console.log('Available databases:', dbs.databases.map(db => db.name));
    
    // Check current database
    console.log('Current database:', mongoose.connection.name);
    
    // List collections in current database
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections:', collections.map(col => col.name));
    
    // Count documents in each collection
    for (const col of collections) {
      const count = await mongoose.connection.db.collection(col.name).countDocuments();
      console.log(`${col.name}: ${count} documents`);
      
      // Show sample documents
      if (count > 0) {
        const sample = await mongoose.connection.db.collection(col.name).findOne();
        console.log(`Sample from ${col.name}:`, JSON.stringify(sample, null, 2));
      }
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

testConnection();