
const { Model, DataTypes } = require('sequelize')
const { MySQL } = require('../../utils/MySQL')

const Carriers = require('./Carriers')

class Flights extends Model {}

Flights.init({
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
    },
    carriers_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    from: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    from_full_address: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    to: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    to_full_address: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    time_departure: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    time_arrival: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    duration: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    flight_frequency: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    price: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    bus: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    bus_photo: {
        type: DataTypes.BLOB,
        allowNull: false,
    },
}, {
    sequelize: MySQL,
    modelName: 'flights',
    freezeTableName: true,
})

Flights.belongsTo(Carriers, { foreignKey: 'carriers_id', as: 'carrier' })

module.exports = Flights