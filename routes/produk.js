const express = require('express');
const router = express.Router();
const produk = require('../controllers/produkController');
const handleUpload = require('../libs/handleUpload');


router.get('/', produk.findAll);
router.get('/:id', produk.findById);
router.post('/', handleUpload.single('image'), produk.create);
router.put('/:id', handleUpload.single('image'), produk.update);
router.delete('/:id', produk.delete);

module.exports = router;
