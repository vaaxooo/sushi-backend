const { Model, DataTypes } = require('sequelize')
const { MySQL } = require('../../utils/MySQL')

class Carriers extends Model {}

Carriers.init({
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    rating: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: 0,
    },
    votes: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: 0,
    },
}, {
    sequelize: MySQL,
    modelName: 'сarriers',
    freezeTableName: true,
})

module.exports = Carriers