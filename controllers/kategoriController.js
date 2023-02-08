const db = require('../models/bundleModel');

const Joi = require('@hapi/joi');

// buat skema validasi
const kategoriSchema = Joi.object().keys({
    name: Joi.string().min(3).max(150).required()
})

exports.create = async (req, res) => {

    // validasi request dari body
    const {error} = kategoriSchema.validate(req.body);

    // jika request error tidak sesuai
    if(error) {
        return res.status(422).send({
            code: 422,
            message: 'Invalid request body',
            error: error.details[0].message
        });
    }

    // jika proses validasi sesuai coba jalankan
    try {
        
        // buat objek data kategori
        const data = {
            name: req.body.name
        }

        // create data kategori dan masukan kedalam database
        const kategori = await db.kategori.create(data);

        // jika proses create berhasil kirim response
        res.send({
            code: 200,
            message: 'Successfully created',
            data: kategori
        })

    // jika proses create tidak berhasil kirim response 500 
    } catch (error) {
        res.status(500).send({
            code: 500,
            message: 'Failed to create the kategori',
            error: error.message
        })
        
    }
}

exports.findAll = async (req, res) => {
    db.kategori.findAll().then(result => {

        try {
            if(result.length > 0) {
                res.send({
                    code: 200,
                    data: result
                })
            }else{
                res.send({
                    code: 404,
                    message: 'Data not found'
                })
            }
        } catch (err) {
            res.status(500).send({
                code: 500,
                message: 'Failed to find records',
                error: err.message
            })
       }
        
    })
}

exports.findById = async (req, res) => {

    // dapatkan id dari param request
    const id = req.params.id;

    try {
        // mencari satu baris yang memenuhi kriteria berdasarkan request
        const result = await db.kategori.findOne({
            where: {id: id}
        })

        if(result){
        // jika data ditemukan kirim response 200
            res.send({
                code: 200,
                data: result
            })
        }else{
            // jika data tidak ditemukan kirim response 404 
            res.status(404).send({
                code: 404,
                message: 'No records found'
            })
        }


    } catch (error) {
        // jika terjadi error pada server kirimkan response 500
        res.status(500).send({
        code: 500,
        message: 'Failed to find the kategori record',
        error: error.message
        });
    }
}

exports.update = async (req, res) =>{

    // validasi request body menggunakan schema yang telah dibuat
    const {error} = kategoriSchema.validate(req.body);

    // jika request tidak sesuai kirimkan response 400
    if(error) {
        return res.status(422).send({
            code: 422,
            message: 'Invalid request body',
            error: error.details[0].message
        });
    }

    // coba update kategori dan handle error
    try {
        
        // buat objek data kategori
        const data = {
            name: req.body.name
        }

        // cari kategori id dan update kategori
        const [rowsKategori, dataKategori] = await db.kategori.update( data, {
            where: {id: req.params.id}
        })

        // cek jika kategori id tidak ada
        if(rowsKategori === 0){
            return res.status(404).send({
                code: 404,
                message: 'Kategori not found'
            })
        }

        // kirim response jika data berhasil di update
        res.send({
            code: 200,
            message: 'Successfully updated',
            data: data
        })
    } catch (error) {

        // jika terjadi error pada server kirimkan response 500
        res.status(500).send({
            code: 500,
            message: 'Update failed',
            error: error.message
        });
    }
}

exports.delete = async (req, res) => {

    try {
        
        // dapatkan produk id dari param request
        const id = req.params.id;

        // cek apakah request id ada di dalam tabel
        const kategorId = await db.kategori.findByPk(id);

        // cek jika katogeri id tidak ada kirim response 404
        if(!kategorId){
            return res.status(404).send({
                code: 404,
                message: 'Kategori not found'
            });
        }

        // apabila id ditemukan maka hapus id
        await db.kategori.destroy({
            where: {id: id}
        })

        // kirimkan response 200 Ok
        res.send({
            code: 200,
            message: 'Successfully deleted',
        });
    } catch (error) {
         // jika terjadi error pada server kirimkan response 500
         res.status(500).send({
            code: 500,
            message: 'Delete failed',
            error: error.message
        });
    }
}
