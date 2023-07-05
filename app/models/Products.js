const { Model, DataTypes } = require('sequelize')
const { MySQL } = require('../../utils/MySQL')

class Products extends Model {}

Products.init({
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
    },
    small_image: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    big_image: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    features: {
        type: DataTypes.STRING(500),
        allowNull: false,
    },
    price: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    short_description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    category_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
}, {
    sequelize: MySQL,
    modelName: 'products',
    freezeTableName: true,
    timestamps: false,
    indexes: [ { fields: ['category_id'] } ]
})

module.exports = Products