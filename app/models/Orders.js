const { Model, DataTypes } = require('sequelize')
const { MySQL } = require('../../utils/MySQL')

const Flights = require('./Flights')

class Orders extends Model {}

Orders.init({
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
    },
    flight_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    firstname: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    lastname: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    surname: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    phone: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    gender: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    date_of_birth: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    document: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    document_number: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    nationality: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    date: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    payment_method: {
        type: DataTypes.STRING(50),
        allowNull: false,
    }
}, {
    sequelize: MySQL,
    modelName: 'orders',
    freezeTableName: true,
})

Orders.belongsTo(Flights, { foreignKey: 'flight_id', as: 'flight' })

module.exports = Orders