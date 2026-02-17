const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Herb = require('./Herb');
const Medicine = require('./Medicine');

const Interaction = sequelize.define('Interaction', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    herb_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Herb,
            key: 'id',
        },
        allowNull: false,
    },
    medicine_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Medicine,
            key: 'id',
        },
        allowNull: false,
    },
    risk_level: {
        type: DataTypes.STRING, // SAFE, CAUTION, AVOID
        allowNull: false,
    },
    explanation: {
        type: DataTypes.TEXT,
        allowNull: true,
    }
}, {
    timestamps: false,
});

// Define relationships
Herb.hasMany(Interaction, { foreignKey: 'herb_id' });
Interaction.belongsTo(Herb, { foreignKey: 'herb_id' });

Medicine.hasMany(Interaction, { foreignKey: 'medicine_id' });
Interaction.belongsTo(Medicine, { foreignKey: 'medicine_id' });

module.exports = Interaction;
