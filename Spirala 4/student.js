const Sequelize = require("sequelize");

module.exports = function (sequelize, DataTypes) {
    const Student = sequelize.define('Student', {
        ime: Sequelize.STRING, 
        prezime: Sequelize.STRING,
        index: Sequelize.STRING,
        grupa: Sequelize.INTEGER
    }, {
        tableName: 'student'
    });
    return Student;
};