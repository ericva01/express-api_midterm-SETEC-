const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const User = sequelize.define(
  "User",
  {
    userid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: DataTypes.STRING,
    userpassword: DataTypes.STRING,
  },
  {
    tableName: "user_eric",
    timestamps: false,
  }
);

module.exports = User;
