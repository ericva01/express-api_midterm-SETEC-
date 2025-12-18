const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");

const OrderDetail = sequelize.define(
  "OrderDetail",
  {
    orderdetailid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    orderid: {
      type: DataTypes.INTEGER,
      references: {
        model: "order_eric",
        key: "orderid",
      },
    },
    productid: {
      type: DataTypes.INTEGER,
      references: {
        model: "product_eric",
        key: "productid",
      },
    },
    qty: DataTypes.INTEGER,
    discount: DataTypes.DECIMAL(5, 2),
},
  {
    tableName: "orderdetail_eric",
    timestamps: false,
  }
);

module.exports = OrderDetail;