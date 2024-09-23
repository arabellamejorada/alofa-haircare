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

// Session middleware
app.use(session({
    store: new RedisStore({ client }),
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }  // 1 day session expiry
}));

// Use the cart routes
app.use(cartRoutes);

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});