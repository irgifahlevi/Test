const express = require('express');
const router = express.Router();
const transaksi = require('../controllers/transaksiController');


// handle transaksi
router.get('/', transaksi.allTransaksi);
router.get('/:id', transaksi.oneTransaksi);

module.exports = router;
