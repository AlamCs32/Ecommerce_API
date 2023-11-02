const { sequelize, Model, DataTypes } = require('../../config/dbConfig')
const { Product } = require('../product/product')
const { Category } = require('./category')

class CategorySearch extends Model { }

CategorySearch.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    categoryId: {
        type: DataTypes.INTEGER,
        references: {
            model: "Category",
            key: "id"
        }
    },
    productId: {
        type: DataTypes.INTEGER,
        references: {
            model: "Product",
            key: "id"
        }
    }
}, {
    sequelize,
    modelName: "CategorySearch",
    tableName: "CategorySearch",
    timestamps: true
})

// CategorySearch.sync({ force: true }).then(() => console.log('Tables is created')).catch(error => console.log(error))

CategorySearch.belongsTo(Category, {
    foreignKey: "categoryId",
    targetKey: "id",
    as:"category"
})

CategorySearch.belongsTo(Product, {
    foreignKey: "productId",
    targetKey: "id",
    as:"product"
})

module.exports = { CategorySearch }