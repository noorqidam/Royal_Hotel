import * as types from '../types';
import axios from 'axios';

export const handleGetRooms = token => ({
  type: types.GET_ROOMS,
  payload: axios({
    method: 'GET',
    url: 'https://restapi-royalhotel.herokuapp.com/api/v2/rooms',
    headers: {
      Authorization: `${token}`,
    },
  }),
});

export const handleAddRooms = (token, name) => ({
  type: types.ADD_ROOMS,
  payload: axios({
    method: 'POST',
    url: 'https://restapi-royalhotel.herokuapp.com/api/v2/room',
    headers: {
      Authorization: `${token}`,
    },
    data: { name },
  }),
});

export const handleUpdateRooms = (token, name, id) => ({
  type: types.UPDATE_ROOMS,
  payload: axios({
    method: 'PUT',
    url: `https://restapi-royalhotel.herokuapp.com/api/v2/room/${id}`,
    headers: {
      Authorization: `${token}`,
    },
    data: { name },
  }),
});

export const handleDeleteRooms = (token, id) => ({
  type: types.UPDATE_ROOMS,
  payload: axios({
    method: 'DELETE',
    url: `https://restapi-royalhotel.herokuapp.com/api/v2/room/${id}`,
    headers: {
      Authorization: `${token}`,
    },
  }),
});
