const express = require("express");
const app = express();

const productRoutes = require('./routes/productRoutes.js');

app.use(express.json()); 

app.use('/', productRoutes);

app.listen(3000, () => console.log(`app listening on port 3000`));
