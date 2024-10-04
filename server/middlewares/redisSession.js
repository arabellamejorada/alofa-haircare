// /middlewares/redisSession.js
const session = require('express-session');
const RedisStore = require('connect-redis').default;  // Use .default for v6+
const redis = require('redis');

// Redis Client Setup
const redisClient = redis.createClient({
    socket: {
        host: 'localhost',
        port: 6379
    }
});

redisClient.on('error', (err) => {
    console.error('Redis error: ', err);
});

redisClient.connect().catch(console.error); // Ensure Redis connects properly

// Redis session middleware setup
const redisSessionMiddleware = session({
    store: new RedisStore({ client: redisClient }),
    secret: 'your-secret-key', // Change this in production
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Should be true if using HTTPS
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days expiration
    },
});

module.exports = redisSessionMiddleware;
