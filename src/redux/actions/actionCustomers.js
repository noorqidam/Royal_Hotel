import * as types from '../types';
import axios from 'axios';

export const handleGetCust = token => ({
  type: types.GET_CUST,
  payload: axios({
    method: 'GET',
    url: 'https://restapi-royalhotel.herokuapp.com/api/v2/customers',
    headers: {
      Authorization: `${token}`,
    },
  }),
});

export const handleAddCust = (
  token,
  name,
  identity_number,
  phone_number,
  image,
) => ({
  type: types.ADD_CUST,
  payload: axios({
    method: 'POST',
    url: 'https://restapi-royalhotel.herokuapp.com/api/v2/customer',
    headers: {
      Authorization: `${token}`,
    },
    data: { name, identity_number, phone_number, image },
  }),
});

export const handleUpdateCust = (
  token,
  id,
  name,
  identity_number,
  phone_number,
  image,
) => ({
  type: types.UPDATE_CUST,
  payload: axios({
    method: 'PUT',
    url: `https://restapi-royalhotel.herokuapp.com/api/v2/customer/${id}`,
    headers: {
      Authorization: `${token}`,
    },
    data: { name, identity_number, phone_number, image },
  }),
});

export const handleDeleteCust = (
  token,
  id
) => ({
  type: types.DELETE_CUST,
  payload: axios({
    method: 'DELETE',
    url: `https://restapi-royalhotel.herokuapp.com/api/v2/customer/${id}`,
    headers: {
      Authorization: `${token}`,
    },
  }),
});
