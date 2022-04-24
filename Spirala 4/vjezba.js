const Sequelize = require("sequelize");

module.exports = function (sequelize, DataTypes) {
    const Vjezba = sequelize.define('Vjezba', {
        index: Sequelize.INTEGER,
        vjezba: Sequelize.INTEGER,
        tacnost: Sequelize.STRING,
        promjena: Sequelize.STRING,
        greske: Sequelize.STRING,
        testovi: Sequelize.STRING
    }, {
        tableName: 'vjezba'
    });

    return Vjezba;
};