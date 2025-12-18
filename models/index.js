
const sequelize = require("../config/db");
const Order = require("./orderModel");
const OrderDetail = require("./orderDetailModel");
const Product = require("./productModel");
const Category = require("./categoryModel");
const User = require("./userModel");

const models = {
  Order,
  OrderDetail,
  Product,
  Category,
  User,
};

// Define associations
Order.hasMany(OrderDetail, { foreignKey: "orderid" });
OrderDetail.belongsTo(Order, { foreignKey: "orderid" });

Product.hasMany(OrderDetail, { foreignKey: "productid" });
OrderDetail.belongsTo(Product, { foreignKey: "productid" });

Category.hasMany(Product, { foreignKey: "categoryid" });
Product.belongsTo(Category, { foreignKey: "categoryid" });

User.hasMany(Order, { foreignKey: "userid" });
Order.belongsTo(User, { foreignKey: "userid" });

models.sequelize = sequelize;

module.exports = models;
