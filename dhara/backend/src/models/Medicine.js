const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Medicine = sequelize.define('Medicine', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    drug_class: {
        type: DataTypes.STRING,
        allowNull: true,
    }
}, {
    timestamps: false,
});

module.exports = Medicine;
