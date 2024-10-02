const express = require('express');
const cors = require('cors');
const session = require('express-session');
const RedisStore = require('connect-redis').default;
const redis = require('redis');
const client = redis.createClient();
const app = express();
const productRoutes = require('./routes/productRoutes.js');
const roleRoutes = require('./routes/roleRoutes.js');
const employeeRoutes = require('./routes/employeeRoutes.js');
const customerRoutes = require('./routes/customerRoutes.js');
const userAccountRoutes = require('./routes/userAccountRoutes.js');
const inventoryRoutes = require('./routes/inventoryRoutes.js');
const supplierRoutes = require('./routes/supplierRoutes.js');
const cartRoutes = require('./routes/cartRoutes.js');
const stockRoutes = require('./routes/stockRoutes.js');

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));

app.use('/', productRoutes);
app.use('/', roleRoutes);
app.use('/', employeeRoutes);
app.use('/', customerRoutes);
app.use('/', userAccountRoutes);
app.use('/', inventoryRoutes);
app.use('/', supplierRoutes);
app.use('/', stockRoutes);
app.use('/', cartRoutes);

const redisClient = redis.createClient({
    host: 'localhost',
    port: 6379
});

redisClient.on('error', (err) => {
    console.error('Redis error: ', err);
});

app.use(session({
    store: new RedisStore({ client: redisClient }),
    secret: 'secret',                // Change this to a random string or a secret key
    resave: false,                   // Don't save session if unmodified
    saveUninitialized: false,        // Don't create session until something stored
    cookie: {
        secure: false,              // Set this to true if using https
        httpOnly: true,             // Prevents client side JS from reading the cookie/ XSS attacks
         maxAge: 1000 * 60 * 60 * 24 * 30,    // Session time = 30 days
    },
}));

app.get('/', (req, res) => {
    if (req.session.views) {
        req.session.views++;
        res.send(`Views: ${req.session.views}`);
    } else {
        req.session.views = 1;
        res.send('Welcome to the session demo. Refresh the page to track views!');
    }
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});