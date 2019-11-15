import * as types from '../types';

const initialState = {
  rooms: [],
  response: [],
};

export default function reducerRooms(state = initialState, action) {
  switch (action.type) {
    //
    // =================== GET ROOM =================================
    case `${types.GET_ROOMS}_PENDING`:
      return {
        ...state,
      };
    case `${types.GET_ROOMS}_FULFILLED`:
      return {
        ...state,
        rooms: action.payload.data,
      };
    case `${types.GET_ROOMS}_REJECTED`:
      return {
        ...state,
        isError: true,
      };
    //
    // =================== ADD ROOM ================================
    case `${types.ADD_ROOMS}_PENDING`:
      return {
        ...state,
      };
    case `${types.ADD_ROOMS}_FULFILLED`:
      return {
        ...state,
        response: action.payload.data,
      };
    case `${types.ADD_ROOMS}_REJECTED`:
      return {
        ...state,
        isError: true,
      };
    //
    // =================== EDIT ROOM ================================
    case `${types.UPDATE_ROOMS}_PENDING`:
      return {
        ...state,
      };
    case `${types.UPDATE_ROOMS}_FULFILLED`:
      return {
        ...state,
        response: action.payload.data,
      };
    case `${types.UPDATE_ROOMS}_REJECTED`:
      return {
        ...state,
        isError: true,
      };
    // =================== DELETE ROOM ================================
    case `${types.DELETE_ROOMS}_PENDING`:
      return {
        ...state,
      };
    case `${types.DELETE_ROOMS}_FULFILLED`:
      return {
        ...state,
        response: action.payload.data,
      };
    case `${types.DELETE_ROOMS}_REJECTED`:
      return {
        ...state,
        isError: true,
      };
    default:
      return state;
  }
}
