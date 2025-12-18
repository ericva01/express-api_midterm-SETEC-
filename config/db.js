
// const mysql = require("mysql2");

// const db = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "",
//     database: "pos_system",
// });

// db.connect((err) => {
//     if (err) throw err;
//     console.log("MySQL Connected...");
// });

// module.exports = db;

const { Sequelize } = require("sequelize");


const sequelize = new Sequelize(
    'pos_system', 'root','',
    {
        host: 'localhost',
        dialect: 'mysql',
        logging: false
    }
)


sequelize.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

module.exports = sequelize;