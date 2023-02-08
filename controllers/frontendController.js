const db = require('../models/bundleModel')
const {v4: uuidv4} = require('uuid')

const func = require('../libs/function')
const Joi = require('@hapi/joi');

const Op = db.Sequelize.Op;


exports.produkHome = async (req, res) => {
    
    db.produk.findAll({
        attributes: ['id', 'title', 'image', 'price', 'url'],
        limit: 5
    }).then(result => {
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


exports.produkPage = async (req, res) => {
    let keyword = '';

    const condition = [];
    if(req.query.keyword){
        keyword = req.query.keyword;
        condition.push({
            title: {[Op.like] : '%' + keyword + '%'}
        })
    }


    db.produk.findAll({
        where: condition,
        attributes: ['id', 'title', 'image', 'price', 'url']
    }).then(result => {
        if(result.length > 0){
            res.send({
                code: 200,
                data: result
            })
        }else{
            res.status(404).send({
                code: 404,
                message: `No records found ${ keyword }`
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

exports.produkDetail = async (req, res) => {

    // dapatkan url dari param request
    const url = req.params.url;
    try {
        // mencari satu baris yang memenuhi kriteria berdasarkan url
        const result = await db.produk.findOne({
            where: {url: url},
            attributes: ['id', 'title', 'description', 'full_description', 'price', 'image', 'price', 'url', 'createdAt'],
            include: [
                {
                    model: db.kategori,
                    attributes: ['name']
                }
            ]
        });
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

// Keranjang controller

exports.dataKeranjang = async (req, res) => {
    
    const session_id = req.query.session_id
    db.keranjang.findAll({
        where: { session_id: session_id },
        attributes: ['id', 'qty', 'session_id', 'createdAt'],
        include: [
            {
                model: db.produk,
                attributes: ['id', 'title', 'image', 'price', 'url']
            }
        ]
    }).then(result => {
        if(result.length > 0){
            res.send({
                code: 200,
                data: result
            })
        }else{
            res.status(404).send({
                code: 404,
                message: 'You dont have a cart yet'
            })
        }
    }).catch(error => {
        res.status(500).send({
            code: 500,
            message: 'Failed to find cart',
            error: error.message
        })
    })
}

exports.tambahKeranjang = async (req, res) => {

    // cek apakah produk sudah ada di keranjang dengan mencocokan produk id dan session id
    const cekKeranjang = await db.keranjang.findOne({ 
        where: [
            { produk_id: req.body.produk_id },
            { session_id: req.body.session_id }
        ]
    });

    // jika keranjang memiliki nilai atau terdapat produk dengan produk id dan session id
    if(cekKeranjang !== null){ 
        
        // buat objek baru dengan menambahkan qty pada produk
        const data = {
            qty: cekKeranjang.qty + 1,
        }

        // melakukan update pada keranjang
        await db.keranjang.update(data,{
            where: {id: cekKeranjang.id}
        }).then(result => {
            res.send({
                code: 200,
                message: 'Successfully added to cart'
            })
        }).catch(error => {
            res.status(500).send({
                code: 500,
                message: 'Oops something went wrong',
                error: error.message
            })
        })

    // jika keranjang tidak memiliki niali atau sama dengan null, keranjang masih kosong
    }else{
        
        // membuat objek data baru
        const data = {
            produk_id : req.body.produk_id,
            qty: req.body.qty,
            session_id: req.body.session_id
        }
        
        // menambahkan data ke keranjang
        await db.keranjang.create(data).then(result => {
            res.send({
                code: 200,
                message: 'Cart has been created',
                data: result
            })
        }).catch(error => {
            res.status(500).send({
                code: 500,
                message: 'Failed to create cart',
                error: error.message
            })
        });
    }

}

exports.ubahKeranjang = async (req, res) => {
    // untuk menangkap request params id
    const id = req.params.id;

    // untuk menangkap request body qty
    const qty = req.body.qty;

    db.keranjang.update({qty: qty}, {
        where: {id : id},
    }).then(result => { // then dijalankan apabila proses update berhasil dilakukan.
        if(result[0]){ // jika ada baris yang terupdate
            res.send({
                code: 200,
                message: 'Keranjang has been updated'
            })
        }else{ // jika tidak ada baris yang terupdate
            return res.status(404).send({
                code: 404,
                message: 'Oops something went wrong'
            })
        }
    }).catch(error => { // dijalankan apabila terjadi error saat proses update.
        res.status(500).send({
            code: 500,
            message: 'Failed to update keranjang',
            error: error.message
        })
    })
}

exports.hapusKeranjang = async (req, res) => {

    // untuk menangkap request params id
    const id = req.params.id;

    db.keranjang.destroy({
        where: {id : id}
    }).then(result => {
        res.send({
            code: 200,
            message: 'Keranjang has been destroyed'
        })
    }).catch(error => {
        res.status(500).send({
            code: 500,
            message: 'Failed to destroy keranjang',
            error: error.message
        })
    })
}

exports.checkout = async (req, res) => {

    // menangap request berdasarkan session_id
    const session_id = req.query.session_id;

    // menangkap request body
    const data = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        alamat: req.body.alamat,
        phone: req.body.phone
    }

    const dataKeranjang = await db.keranjang.findAll({
        where: {session_id : session_id}
    })

    if(dataKeranjang.length > 0) {
        const trs_number = 'TRS-' + Date.now();
        const trs_id = uuidv4();


        const dataTransaksi = {
            id: trs_id,
            trs_number: trs_number
        }

        await db.transaksi.create(dataTransaksi);

        await dataKeranjang.map((item, index) => {
            const trsDetail = {
                qty: item.qty,
                produk_id: item.produk_id,
                trs_id: trs_id
            }

            db.transaksiDetail.create(trsDetail);
            db.keranjang.destroy({
                where: {id: item.id}
            })
        })

        await db.customer.create(data);

        await res.status(200).send({
            code: 200,
            message: 'Transaction has been successfully',
            data: dataTransaksi
        })
    }else{
        res.send({
            code: 403,
            message: 'You do not have permission to checkout this transaction'
        })
    }
}