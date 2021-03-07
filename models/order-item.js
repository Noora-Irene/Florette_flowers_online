const Sequelize = require('sequelize');
const sequelize = require('../aider/database');

const orderItem = sequelize.define('orderItem', {
   id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
   }
});

module.exports = orderItem;