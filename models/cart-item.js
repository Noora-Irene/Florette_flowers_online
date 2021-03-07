const Sequelize = require('sequelize');
const sequelize = require('../aider/database');

const CartItem = sequelize.define('cartItem', {
   id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
   },
   quantity: Sequelize.INTEGER
});

module.exports = CartItem;