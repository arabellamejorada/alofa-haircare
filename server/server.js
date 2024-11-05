// server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const productRoutes = require('./routes/productRoutes.js');
const roleRoutes = require('./routes/roleRoutes.js');
const employeeRoutes = require('./routes/employeeRoutes.js');
const customerRoutes = require('./routes/customerRoutes.js');
const inventoryRoutes = require('./routes/inventoryRoutes.js');
const supplierRoutes = require('./routes/supplierRoutes.js');
const cartRoutes = require('./routes/cartRoutes.js');
const stockRoutes = require('./routes/stockRoutes.js');
const orderRoutes = require('./routes/orderRoutes.js');
const voucherRoutes = require('./routes/voucherRoutes.js');
const faqsRoutes = require('./routes/faqsRoutes.js');

const app = express();

// Middleware: CORS configuration
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, // If you need to allow cookies or other credentials
}));

// Body Parser Middleware for handling JSON
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));

// Serve static files from the 'public/uploads' folder
const uploadsPath = path.join(__dirname, '..', 'public', 'uploads');
console.log('Serving images from:', uploadsPath); // This logs the path being served for debugging purposes

app.use('/uploads', express.static(uploadsPath));

// Routes for the application
app.use('/', productRoutes);
app.use('/', roleRoutes);
app.use('/', employeeRoutes);
app.use('/', customerRoutes);
app.use('/', inventoryRoutes);
app.use('/', supplierRoutes);
app.use('/', stockRoutes);
app.use('/', cartRoutes);
app.use('/', orderRoutes);
app.use('/', voucherRoutes);
app.use('/', faqsRoutes);

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
