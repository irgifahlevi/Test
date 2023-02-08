const db = require('../models/bundleModel');

exports.allTransaksi = (req, res) => {
    db.transaksi.findAll({
        attributes: ['id', 'trs_number', 'createdAt'],
        include: [
            {
                model: db.transaksiDetail,
                attributes: ['id', 'qty'],
                include: [
                    {
                        model: db.produk,
                        attributes: ['id', 'title', 'image', 'price', 'url'],
                        include: [
                            {
                                model: db.kategori,
                                attributes: ['name'],
                            }
                        ]
                    }
                ]
            }
        ]
    }).then( async result => {
        if(result.length > 0){

            const dataTransaksi = await result.map((item, index) => {

                const detailItem = item.transaksi_details.map((item_detail, index_detail) => {
                    return {
                        id: item_detail.id,
                        produk_id: item_detail.produk_id,
                        title: item_detail.produk.title,
                        image: item_detail.produk.image,
                        price: item_detail.produk.price,
                        url: item_detail.produk.url,
                        qty: item_detail.qty,
                        kategori: item_detail.produk.kategori.name
                    }
                })
                return {
                    id: item.id,
                    trs_number: item.trs_number,
                    createdAt: item.createdAt,
                    details: detailItem
                }
            })

            res.send({
                code: 200,
                message: 'OK',
                data: dataTransaksi
            })
        }else{
            res.status(404).send({
                code: 404,
                message: 'You havent had any transactions yet'
            })
        }
    }).catch(error => {
        res.status(500).send({
            code: 500,
            message: 'Oops! Something went wrong',
            error: error.message
        })
    })
}


exports.oneTransaksi = async (req, res) => {
    
    const id = req.params.id

    db.transaksi.findOne({
        where: {id: id},
        attributes: ['id', 'trs_number', 'createdAt'],
        include: [
            {
                model: db.transaksiDetail,
                attributes: ['id', 'qty'],
                include: [
                    {
                        model: db.produk,
                        attributes: ['id', 'title', 'image', 'price', 'url'],
                        include: [
                            {
                                model: db.kategori,
                                attributes: ['name'],
                            }
                        ]
                    }
                ]
            }
        ]
    }).then(async result => {

        if(result.length !== null){
        const detailItem = result.transaksi_details.map((item_detail, index_detail) => {
            return {
                id: item_detail.id,
                produk_id: item_detail.produk_id,
                title: item_detail.produk.title,
                image: item_detail.produk.image,
                price: item_detail.produk.price,
                url: item_detail.produk.url,
                qty: item_detail.qty,
                kategori: item_detail.produk.kategori.name
            }
        })
            res.send({
                code: 200,
                message: 'OK',
                data: {
                    id: result.id,
                    trs_number: result.trs_number,
                    createdAt: result.createdAt,
                    details: detailItem
                }
            })
        }else{
            res.status(404).send({
                code: 404,
                message: 'You havent had any transactions yet',
            })
        }
    }).catch(error => {
        res.status(500).send({
            code: 500,
            message: 'Oops! Something went wrong',
            error: error.message
        })
    })

}
