const sequelize = require('./config/db');
const Category = require('./models/categoryModel');
const Product = require('./models/productModel');
const User = require('./models/userModel');
const Order = require('./models/orderModel');
const OrderDetail = require('./models/orderDetailModel');
(
    async () =>{
        try{
            await sequelize.authenticate();
            console.log('Connection has been established successfully.');
            await sequelize.sync({alter: true});
            console.log("All models were synchronized successfully.");

            process.exit(0);
        }catch(err){
            console.error('Unable to connect to the database:', err);
            process.exit(1);
        }
    }
)