const { Model, DataTypes } = require('sequelize')
const { MySQL } = require('../../utils/MySQL')

class Reviews extends Model {}

Reviews.init({
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    date: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    text: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
}, {
    sequelize: MySQL,
    modelName: 'reviews',
    freezeTableName: true,
})

module.exports = Reviews