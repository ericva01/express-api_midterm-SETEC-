const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Product = sequelize.define(
  "Product",
  {
    productid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    productname: DataTypes.STRING,
    price: DataTypes.DECIMAL(10, 2),
    discount: DataTypes.DECIMAL(5, 2),
    qty: DataTypes.INTEGER,
    categoryid: {
      type: DataTypes.INTEGER,
      references: {
        model: "category_eric",
        key: "categoryid",
      },
    },
  },
  {
    tableName: "product_eric",
    timestamps: false,
  }
);

module.exports = Product;
