const db = require('../models/bundleModel')
const {v4: uuidv4} = require('uuid')

const func = require('../libs/function')
const Joi = require('@hapi/joi');

// skema validasi
const productSchema = Joi.object().keys({
    title: Joi.string().min(3).max(150).required(),
    description: Joi.string().min(3).max(500).required(),
    full_description: Joi.string().min(3).max(1000).allow(''),
    image: Joi.any(),
    price: Joi.number().min(100).max(100000000).required(),
    category_id: Joi.number().integer().required()
});

exports.create = async (req, res) => {

    // validasi request dari body
    const { error } = productSchema.validate(req.body);
    
    // jika request error dari body atau request dari file maka jalankan perintah
    if (error || (!req.file || !req.file.filename)) {
    let errorMessage = error ? error.details[0].message : 'File is required';
        return res.status(400).send({
            code: 400,
            message: 'Invalid request body',
            error: errorMessage
        });
    }
    
    // jika proses validasi tidak error coba jalankan
    try {
    
    // buat objek produk data
        const data = {
        id: uuidv4(), // membuat unik id
        title: req.body.title,
        description: req.body.description,
        full_description: req.body.full_description,
        image: req.file.filename,
        price: req.body.price,
        category_id: req.body.category_id,
        url: func.convertToSlug(req.body.title + ' ' + Math.random(1000))
        };

    
        // create produk data masukkan ke dalam database
        const product = await db.produk.create(data);
        
        // jika berhasil kirim response 200
        res.send({
        code: 200,
        message: 'Successfully created the product',
        data: product
        });
    } catch (error) {
        // jika terjadi error pada server kirimkan response 500
        res.status(500).send({
        code: 500,
        message: 'Failed to create the product',
        error: error.message
        });
    }
};
exports.findAll = async (req, res) => {
    
    db.produk.findAll().then(result => {
        if(result.length > 0){
            res.send({
                code: 200,
                data: result
            })
        }else{
            res.status(404).send({
                code: 404,
                message: 'No records found'
            })
        }
    }).catch(err => {
        res.status(err).send({
            code: 500,
            message: 'Failed to find records',
            error: err.message
        })
    })
}

exports.findById = async (req, res) => {

    // dapatkan id dari param request
    const id = req.params.id;
    try {
        // mencari satu baris yang memenuhi kriteria berdasarkan id
        const result = await db.produk.findOne(
            {where: {id: id}}
        );
        if(result){
        // jika data ditemukan dan bernilai true maka akan mengirimkan kode HTTP 200 OK
            res.send({
                code: 200,
                data: result
            })
        }else{
        // jika data tidak ditemukan dan bernilai false maka akan mengirimkan kode 404
            res.status(404).send({
                code: 404,
                message: 'No records found'
            })
        }
    } catch (error) {
        // jika terjadi error pada server
        console.log(error)
        res.status(500).send({
            code: 500,
            message: 'Failed to find record'
        })
    }
}

exports.update = async (req, res) => {

    // validasi request dari body
    const { error } = productSchema.validate(req.body, {
        ignore: ['image'] // abaikan gambar
    });
    
    // jika request error kirim response 400
    if (error) {
        return res.status(422).send({
            code: 422,
            message: 'Invalid request body',
            error: error.details[0].message
        });
    }

    try {
        // dapatkan id produk dari param request
        const id = req.params.id;

        // objek untuk menampung data
        const data = {
            title: req.body.title,
            description: req.body.description,
            full_description: req.body.full_description,
            price: req.body.price,
            category_id: req.body.category_id,
            url: func.convertToSlug(req.body.title + ' ' + Math.random(1000))
        }

        // hanya perbarui file jika ada di request
        if(req.file){
            data['image'] = req.file.filename;
        }

        // cek apakah produk ada di dalam database
        const produkId = await db.produk.findByPk(id);

        // jika data tidak ditemukan
        if(!produkId){
            return res.status(404).send({
                message: 'Data not found'
            })
        }

        // jika ditemukan perbarui data yang ada di db
        await db.produk.update(data, {
            where: {id : id}
        })

        // menampilkan pesan OK
        res.status(200).send({
            message: 'Data updated successfully',
            data: data
        })
        
        // jika terjadi error pada server
    } catch (error) {
        res.status(500).send({
            message: 'Failed to update records',
            error
        })
    }

}

exports.delete = async (req, res) => {

    try {
        // dapatkan produk id dari param request
        const id = req.params.id;

        // cek apakah produk ada di dalam database
        const produkId = await db.produk.findByPk(id);

        // jika produk tidak ditemukan
        if(!produkId){
            return res.status(404).send({
                message: 'Data not found'
            });
        }

        // jika produk ditemukan maka hapus produk di dalam database
        await db.produk.destroy({
            where: {id : id}
        })

        // menampilkan pesan OK
        res.status(200).send({
            message: 'Data destroyed successfully'
        });

        // jika terjadi error pada server
    } catch (error) {
        res.status(500).send({
            code: 500,
            message: 'Failed to delete',
            error: error.message
        })
    }

}