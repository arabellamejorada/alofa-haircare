// server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const productRoutes = require('./routes/productRoutes.js');
const roleRoutes = require('./routes/roleRoutes.js');
const employeeRoutes = require('./routes/employeeRoutes.js');
const customerRoutes = require('./routes/customerRoutes.js');
const userAccountRoutes = require('./routes/userAccountRoutes.js');
const inventoryRoutes = require('./routes/inventoryRoutes.js');
const supplierRoutes = require('./routes/supplierRoutes.js');
const cartRoutes = require('./routes/cartRoutes.js');
const stockRoutes = require('./routes/stockRoutes.js');
const redisSessionMiddleware = require('./middlewares/redisSession');

const app = express();

// Middleware: CORS configuration
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5173'], // Wrap multiple origins in an array
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, // If you need to allow cookies or other credentials
}));

// Body Parser Middleware for handling JSON
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));

// Session Middleware (Redis)
app.use(redisSessionMiddleware); // Use the Redis session middleware

// Serve static files from the 'public/uploads' folder
const uploadsPath = path.join(__dirname, '..', 'public', 'uploads');
console.log('Serving images from:', uploadsPath); // This logs the path being served for debugging purposes

app.use('/uploads', express.static(uploadsPath));

// Routes for the application
app.use('/', productRoutes);
app.use('/', roleRoutes);
app.use('/', employeeRoutes);
app.use('/', customerRoutes);
app.use('/', userAccountRoutes);
app.use('/', inventoryRoutes);
app.use('/', supplierRoutes);
app.use('/', stockRoutes);
app.use('/', cartRoutes);

// Test route to check session functionality
app.get('/', (req, res) => {
    if (req.session.views) {
        req.session.views++;
        res.send(`Views: ${req.session.views}`);
    } else {
        req.session.views = 1;
        res.send('Welcome to the session demo. Refresh the page to track views!');
    }
});

app.get('/session', (req, res) => {
    if (req.session.views) {
        res.status(200).send(`Session active with ${req.session.views} views.`);
    } else {
        res.status(200).send('No active session.');
    }
});

app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Error ending session');
        }
        res.clearCookie('connect.sid'); // Assuming default cookie name for session is 'connect.sid'
        res.status(200).send('Session ended');
    });
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
