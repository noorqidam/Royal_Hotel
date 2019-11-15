import * as types from './../types';
import axios from 'axios';

export const handleLogin = (email, password) => ({
  type: types.LOGIN,
  payload: axios({
    method: 'POST',
    url: 'https://restapi-royalhotel.herokuapp.com/api/v2/login',
    data: { email, password },
  }),
});
