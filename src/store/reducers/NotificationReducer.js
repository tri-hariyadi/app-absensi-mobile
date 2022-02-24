import * as type from '../types';

const initialState = {
  dataNotification: false
}

export default (state = initialState, action) => {
  switch (action.type) {
    case type.INCOMING_NOTIFICATION:
      return {
        ...state,
        dataNotification: action.payload
      }

    default:
      return state;
  }
}
