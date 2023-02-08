const express = require('express');
const router = express.Router();
const frontend = require('../controllers/frontendController');
const handleUpload = require('../libs/handleUpload');

router.get('/produkHome', frontend.produkHome);
router.get('/produkPage', frontend.produkPage);
router.get('/produkDetail/:url', frontend.produkDetail);


// handle keranjang
router.get('/keranjang', frontend.dataKeranjang);
router.post('/keranjang', frontend.tambahKeranjang);
router.put('/keranjang/:id', frontend.ubahKeranjang);
router.delete('/keranjang/:id', frontend.hapusKeranjang);


router.post('/checkout', frontend.checkout);

module.exports = router;
