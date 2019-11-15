import * as types from '../types';

const initialState = {
  cust: [],
  resp: [],
};

export default function reducerCustomers(state = initialState, action) {
  switch (action.type) {
    //
    //Get All Customer
    case `${types.GET_CUST}_PENDING`:
      return {
        ...state,
      };
    case `${types.GET_CUST}_FULFILLED`:
      return {
        ...state,
        cust: action.payload.data,
      };
    case `${types.GET_CUST}_REJECTED`:
      return {
        ...state,
        isError: true,
      };
    //
    //Add a new Customer
    case `${types.ADD_CUST}_PENDING`:
      return {
        ...state,
      };
    case `${types.ADD_CUST}_FULFILLED`:
      return {
        ...state,
        resp: action.payload.data,
      };
    case `${types.ADD_CUST}_REJECTED`:
      return {
        ...state,
        isError: true,
      };
    //
    //Update Customer Information
    case `${types.UPDATE_CUST}_PENDING`:
      return {
        ...state,
      };
    case `${types.UPDATE_CUST}_FULFILLED`:
      return {
        ...state,
        resp: action.payload.data,
      };
    case `${types.UPDATE_CUST}_REJECTED`:
      return {
        ...state,
        isError: true,
      };
    //Update Customer Information
    case `${types.DELETE_CUST}_PENDING`:
      return {
        ...state,
      };
    case `${types.DELETE_CUST}_FULFILLED`:
      return {
        ...state,
        resp: action.payload.data,
      };
    case `${types.DELETE_CUST}_REJECTED`:
      return {
        ...state,
        isError: true,
      };
    default:
      return state;
  }
}
