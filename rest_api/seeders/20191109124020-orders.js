'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('orders', [
      {
        duration: 0,
        is_booked: false,
        is_done: true,
        order_end_time: '2019-10-26T05:31:08.000Z',
        customer: 1,
        room: 1,
      },
      {
        duration: 0,
        is_booked: true,
        is_done: false,
        order_end_time: '2019-10-26T05:31:08.000Z',
        customer: 2,
        room: 2,
      }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('orders', null, {});
  }
};
