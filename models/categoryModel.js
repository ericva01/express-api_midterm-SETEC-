const {DataTypes} = require('sequelize')
const sequelize = require('../config/db')

const Category = sequelize.define("Category",{
    categoryid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    categoryname: DataTypes.STRING
},{
    tableName: 'category_eric',
    timestamps: false
}
);

module.exports = Category
