const express = require('express');
const cors = require('cors');
const app = express();
const products =require('./routes/ProductRoutes');

app.use(cors());
app.use(express.json());
app.use('/api',products);
module.exports=app;