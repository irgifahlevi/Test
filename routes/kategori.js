const express = require('express');
const router = express.Router();
const kategori = require('../controllers/kategoriController');
// const handleUpload = require('../controllers/handleUpload');


router.get('/', kategori.findAll);
router.get('/:id', kategori.findById);
router.post('/', kategori.create);
router.put('/:id', kategori.update);
router.delete('/:id', kategori.delete);

module.exports = router;