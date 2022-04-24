const Sequelize = require("sequelize");

const sequelize = new Sequelize("proba", "root", "", {
    host: "localhost",
    dialect: "mysql"
});
module.exports = sequelize;