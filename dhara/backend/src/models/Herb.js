const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Herb = sequelize.define('Herb', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    dosha: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    benefits: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    safety_notes: {
        type: DataTypes.TEXT,
        allowNull: true,
    }
}, {
    timestamps: false,
});

module.exports = Herb;
