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
        secure: false,  // For development, should be true in production when using HTTPS
        httpOnly: true, // Ensures the cookie is inaccessible to JavaScript (XSS protection)
        maxAge: 1000 * 60 * 60 * 24 * 30, // Cookie expiry time (30 days)
    },
});

module.exports = redisSessionMiddleware;
