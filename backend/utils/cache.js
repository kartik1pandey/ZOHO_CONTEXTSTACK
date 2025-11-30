const redis = require('redis');

let client;

async function initRedis() {
  client = redis.createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
  });
  
  client.on('error', (err) => console.log('Redis Client Error', err));
  await client.connect();
  console.log('✅ Redis connected');
}

async function getCache(key) {
  try {
    const data = await client.get(key);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.error('Cache get error:', err);
    return null;
  }
}

async function setCache(key, value, ttlSeconds = 300) {
  try {
    await client.setEx(key, ttlSeconds, JSON.stringify(value));
  } catch (err) {
    console.error('Cache set error:', err);
  }
}

module.exports = { initRedis, getCache, setCache };