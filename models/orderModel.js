const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Order = sequelize.define(
  "Order",
  {
    orderid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    orderdate: DataTypes.DATE,
    orderno: DataTypes.STRING,
    userid: {
      type: DataTypes.INTEGER,
      references: {
        model: "user_eric",
        key: "userid",
      },
    },
  },
  {
    tableName: "order_eric",
    timestamps: false,
  }
);

module.exports = Order;
