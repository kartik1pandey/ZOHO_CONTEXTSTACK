require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const redis = require('redis');

async function testConnections() {
  console.log('🔍 Testing service connections...\n');
  
  // Test MongoDB
  console.log('1️⃣ Testing MongoDB Atlas...');
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000
    });
    console.log('✅ MongoDB connected successfully');
    console.log(`   Database: ${mongoose.connection.db.databaseName}`);
    await mongoose.connection.close();
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
  }
  
  // Test Redis
  console.log('\n2️⃣ Testing Redis Cloud...');
  try {
    const client = redis.createClient({
      url: process.env.REDIS_URL,
      socket: {
        connectTimeout: 5000
      }
    });
    
    client.on('error', (err) => console.error('Redis error:', err.message));
    
    await client.connect();
    await client.set('test_key', 'test_value');
    const value = await client.get('test_key');
    
    if (value === 'test_value') {
      console.log('✅ Redis connected successfully');
      console.log('   Read/Write test passed');
    }
    
    await client.del('test_key');
    await client.quit();
  } catch (err) {
    console.error('❌ Redis connection failed:', err.message);
  }
  
  // Test NLP Service
  console.log('\n3️⃣ Testing NLP Service...');
  try {
    const fetch = require('node-fetch');
    const response = await fetch(`${process.env.NLP_URL}/health`, {
      timeout: 3000
    });
    
    if (response.ok) {
      console.log('✅ NLP Service is running');
    } else {
      console.log('⚠️  NLP Service responded but not healthy');
    }
  } catch (err) {
    console.log('⚠️  NLP Service not running (this is optional for basic functionality)');
    console.log('   Start it with: cd nlp_service && python app.py');
  }
  
  console.log('\n✨ Connection test complete!\n');
}

testConnections().catch(console.error);
