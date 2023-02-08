const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const produkRouter = require('./routes/produk');
const kategoriRouter = require('./routes/kategori');
const frontendRouter = require('./routes/frontend');
const transaksiRouter = require('./routes/transaksi');

const db = require('./models/bundleModel');



db.sequelize.sync({force: false});
app.use('/public', express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/produk', produkRouter);

app.use('/kategori', kategoriRouter);

app.use('/frontend', frontendRouter);

app.use('/transaksi', transaksiRouter);



module.exports = app;