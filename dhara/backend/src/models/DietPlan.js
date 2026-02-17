const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');

const DietPlan = sequelize.define('DietPlan', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id',
        },
        allowNull: false,
    },
    week_start: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    plan: {
        type: DataTypes.JSON,
        allowNull: false,
    }
}, {
    timestamps: false,
});

// Define relationship
User.hasMany(DietPlan, { foreignKey: 'user_id' });
DietPlan.belongsTo(User, { foreignKey: 'user_id' });

module.exports = DietPlan;
