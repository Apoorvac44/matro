const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Message = sequelize.define('Message', {
    sender: { type: DataTypes.INTEGER, allowNull: false },
    receiver: { type: DataTypes.INTEGER, allowNull: false },
    content: { type: DataTypes.TEXT, allowNull: false },
}, {
    timestamps: true
});

module.exports = Message;
