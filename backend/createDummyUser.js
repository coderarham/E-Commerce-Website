const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

async function createDummyUser() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const hashedPassword = await bcrypt.hash('test123', 12);
    
    const dummyUser = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: hashedPassword
    });

    await dummyUser.save();
    console.log('Dummy user created successfully');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

createDummyUser();