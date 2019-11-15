'use strict';
module.exports = (sequelize, DataTypes) => {
  const rooms = sequelize.define('rooms', {
    name: DataTypes.STRING
  }, {});
  rooms.associate = function (models) {
    rooms.hasMany(models.orders, {
      foreignKey: 'room',
      as: 'order',
    });
  };
  return rooms;
};