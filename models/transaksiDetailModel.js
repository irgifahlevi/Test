module.exports = (sequelize, Sequelize) => {
    const TransaksiDetail = sequelize.define('transaksi_detail', {
        qty: {
            type: Sequelize.INTEGER,
        }
    })

    return TransaksiDetail;
}