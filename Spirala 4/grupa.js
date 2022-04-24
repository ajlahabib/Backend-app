const Sequelize = require("sequelize");

module.exports = function (sequelize, DataTypes) {
    const Grupa = sequelize.define('Grupa', {
        grupa: Sequelize.STRING
    }, {
        tableName: 'grupa'
    });

    return Grupa;
};