'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('customers', [
      {
        name: 'Rizky Fadhillah',
        identity_number: '3181797290176243',
        phone_number: '085771603597',
        image:
          'https://pbs.twimg.com/media/Cg9j3RRWUAAxAps?format=jpg&name=small',
      },
      {
        name: 'Khairunnas',
        identity_number: '3181797226179687',
        phone_number: '081245458173',
        image:
          'https://pbs.twimg.com/profile_images/841496273589026816/6j-pZMzM.jpg',
      },
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('customers', null, {});
  }
};
