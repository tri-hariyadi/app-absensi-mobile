import axios from 'axios';
import * as type from '../types';
import {
  loadingDispatch,
  successDispatch,
  errorDispatch
} from '../dispatchs';
import {
  API_URL,
  API_TIMEOUT,
  API_HEADERS,
  authHeader,
} from '../../config/constant';
import { storeData, removeData } from '../localStorage';
import { errMsg } from '../../utils';

export const resetAllAuthReducer = () => dispatch => {
  dispatch({
    type: type.RESET_ALL_AUTH_REDUCER
  });
}

export const loginUser = data => async dispatch => {
  loadingDispatch(dispatch, type.USER_LOGIN);
  try {
    await axios({
      method: 'post',
      url: `${API_URL}login`,
      timeout: API_TIMEOUT,
      headers: API_HEADERS,
      data
    }).then(async ({ data }) => {
      if (data.result) {
        const promise = await storeData('token', { accessToken: data.result.accessToken });
        await Promise.resolve(promise);
        successDispatch(dispatch, type.USER_LOGIN, data.result.accessToken);
      }
    });
  } catch (err) {
    errorDispatch(dispatch, type.USER_LOGIN, err.response ? err.response.data.message : err.message);
  }
}

export const userLogout = (cb) => async dispatch => {
  loadingDispatch(dispatch, type.USER_LOGGED_OUT);
  if (cb) cb();
  try {
    await axios({
      method: 'delete',
      url: `${API_URL}logout`,
      timeout: API_TIMEOUT,
      headers: await authHeader(),
    }).then(async ({ data }) => {
      if (data.message) {
        successDispatch(dispatch, type.USER_LOGGED_OUT, true);
      }
    });
    await removeData('token');
  } catch (err) {
    errorDispatch(dispatch, type.USER_LOGGED_OUT, false);
    await removeData('token');
  }
}

export const refreshAccessToken = async () => {
  let headers = await authHeader();
  return axios({
    method: 'get',
    url: `${API_URL}refreshtoken`,
    timeout: API_TIMEOUT,
    headers
  });
}

export const recoveryPassword = async payload => {
  let result;
  await axios({
    method: 'post',
    url: `${API_URL}update-password`,
    timeout: API_TIMEOUT,
    headers: API_HEADERS,
    data: payload,
    validateStatus: () => true
  }).then(({ data }) => {
    if (data.result && data.status === 200) result = { result: data.message, errMsg: null }
    else result = { result: null, errMsg: data.message }
  }).catch((err) => {
    result = { result: null, errMsg: errMsg(err) }
  });
  return result;
}
