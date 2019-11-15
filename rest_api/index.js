const express = require('express');
const bodyParser = require('body-parser');
require('express-group-routes');

const app = express();
const port = 5000;

//controllers
const AuthController = require('./controller/auth');
const RoomController = require('./controller/rooms');
const CustomerController = require('./controller/customers');
const CheckinController = require('./controller/checkin');

//middleware
const { authenticated } = require('./middleware');

app.use(bodyParser.json());

app.group('/api/v2', router => {
  //hello world
  router.get('/', (req, res) => {
    res.send('Hello World!');
  });

  //auth API
  router.post('/login', AuthController.signIn);
  router.post('/register', AuthController.signUp);
  router.get('/user/', AuthController.showAllUser);

  //rooms
  router.get('/rooms', authenticated, RoomController.showAllRoom);
  router.post('/room', authenticated, RoomController.addRoom);
  router.put('/room/:id', authenticated, RoomController.updateRoom);
  router.delete('/room/:id', authenticated, RoomController.deleteRoom);

  //customers
  router.get('/customers', authenticated, CustomerController.showAllCustomers);
  router.post('/customer', authenticated, CustomerController.addCustomer);
  router.put('/customer/:id', authenticated, CustomerController.updateCustomer);
  router.delete('/customer/:id', authenticated, CustomerController.deleteCustomer);

  //checkin
  router.get('/checkin/logs', authenticated, CheckinController.checkinLogs)
  router.get('/checkins', authenticated, CheckinController.showCheckin);
  router.post('/checkin', authenticated, CheckinController.checkin);
  router.put('/checkout/:id', authenticated, CheckinController.checkout);
});

app.listen(port, () => console.log(`Listening on port ${port}!`));