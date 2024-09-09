const express = require('express');
const cors = require('cors');
const app = express();
const productRoutes = require('./routes/productRoutes.js');
const roleRoutes = require('./routes/roleRoutes.js');
const employeeRoutes = require('./routes/employeeRoutes.js');
const customerRoutes = require('./routes/customerRoutes.js');
const userAccountRoutes = require('./routes/userAccountRoutes.js');
const inventoryRoutes = require('./routes/inventoryRoutes.js');
const supplierRoutes = require('./routes/supplierRoutes.js');

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

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});