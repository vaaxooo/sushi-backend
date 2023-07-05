const { Model, DataTypes } = require('sequelize')
const { MySQL } = require('../../utils/MySQL')

class Categories extends Model {}

Categories.init({
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    slug: {
        type: DataTypes.STRING(255),
        allowNull: false,
    }
}, {
    sequelize: MySQL,
    modelName: 'categories',
    freezeTableName: true,
})

module.exports = Categories