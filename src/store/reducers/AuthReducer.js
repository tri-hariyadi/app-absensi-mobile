import * as types from '../types';

const initialState = {
  token: false,
  loading: false,
  errorLogin: false,

  loggedOut: false
}

export default (state = initialState, action) => {
  switch (action.type) {
    case types.RESET_ALL_AUTH_REDUCER:
      return {
        ...initialState
      }
    case types.USER_LOGIN:
      return {
        ...state,
        token: action.payload.data,
        loading: action.payload.loading,
        errorLogin: action.payload.errorMessage,
        loggedOut: false
      }
    case types.USER_LOGGED_OUT:
      return {
        ...state,
        token: false,
        loading: false,
        errorLogin: false,
        loggedOut: action.payload.data ? action.payload.data : action.payload.errorMessage,
      }
    default:
      return state;
  }
}
