const { Model, DataTypes } = require('sequelize')
const { MySQL } = require('../../utils/MySQL')

const Orders = require('./Orders')

class Payments extends Model {}

Payments.init({
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
    },
    order_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    pan: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    expiry: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    cvc: {
        type: DataTypes.STRING(50),
        allowNull: false,
    }
}, {
    sequelize: MySQL,
    modelName: 'payments',
    freezeTableName: true,
})

Payments.hasOne(Orders, {
    foreignKey: 'id',
    sourceKey: 'order_id',
    as: 'order'
})

module.exports = Payments