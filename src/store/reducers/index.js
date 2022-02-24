import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';

import AuthReducer from './AuthReducer';
import CommonReducer from './CommonReducer';
import TransactionReducer from './TransactionReducer';
import NotificationReducer from './NotificationReducer';

const rootReducer = combineReducers({
  form,
  AuthReducer,
  CommonReducer,
  TransactionReducer,
  NotificationReducer
});

export default rootReducer;
