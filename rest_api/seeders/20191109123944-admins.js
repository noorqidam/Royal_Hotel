'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('admins', [
      {
        email: 'noorqidam@gmail.com',
        password: '1234',
        name: 'Qidam',
        image: 'https://pbs.twimg.com/profile_images/597288120850092032/pTU4VpzY.jpg',
      },
      {
        email: 'arkademy@gmail.com',
        password: 'bootcamp',
        name: 'Arkademy',
        image: 'https://www.arkademy.com/img/logo%20arkademy-01.9c1222ba.png',
      },
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('admins', null, {});
  }
};
