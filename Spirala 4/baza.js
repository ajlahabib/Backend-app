const Sequelize = require("sequelize");

const sequelize = new Sequelize("spirala4", "root", "", {
    host: "localhost",
    dialect: "mysql"
});
module.exports = sequelize;