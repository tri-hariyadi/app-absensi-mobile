import axios from 'axios';
import * as type from '../types';
import {
  API_URL,
  API_TIMEOUT,
  authHeader,
  API_HEADERS
} from '../../config/constant';
import {
  loadingDispatch,
  successDispatch,
  errorDispatch
} from '../dispatchs';
import { errMsg } from '../../utils';

export const resetAllCommonReducer = () => dispatch => {
  dispatch({
    type: type.RESET_ALL_COMMON_REDUCER
  });
}

export const getUser = () => { }

export const getAbsensts = data => async dispatch => {
  loadingDispatch(dispatch, type.GET_ABSENTS);
  // let headers = await authHeader();
  axios({
    method: 'post',
    url: `${API_URL}absent/getAbsents`,
    timeout: API_TIMEOUT,
    headers: await authHeader(),
    data
  }).then(({ data }) => {
    successDispatch(dispatch, type.GET_ABSENTS, data.result);
  }).catch((err) => {
    errorDispatch(dispatch, type.GET_ABSENTS, errMsg(err));
  });
}

export const getLatestAbsents = data => async dispatch => {
  loadingDispatch(dispatch, type.GET_LATEST_ABSENTS);
  axios({
    method: 'post',
    url: `${API_URL}absent/getLatestAbsents`,
    timeout: API_TIMEOUT,
    headers: await authHeader(),
    data: { userId: data }
  }).then(({ data }) => {
    successDispatch(dispatch, type.GET_LATEST_ABSENTS, data.result);
  }).catch(err => {
    errorDispatch(dispatch, type.GET_LATEST_ABSENTS, errMsg(err));
  })
}

export const getAbsentById = id => async dispatch => {
  loadingDispatch(dispatch, type.GET_ABSENT_BY_ID);
  try {
    await axios({
      method: 'post',
      url: `${API_URL}absent/getAbsentById`,
      timeout: API_TIMEOUT,
      headers: await authHeader(),
      data: { id }
    }).then(({ data }) => {
      if (data && data.status !== 200)
        errorDispatch(dispatch, type.GET_ABSENT_BY_ID, data.message);
      else successDispatch(dispatch, type.GET_ABSENT_BY_ID, data.result);
    });
  } catch (err) {
    errorDispatch(dispatch, type.GET_ABSENT_BY_ID, errMsg(err));
  }
}

export const getAttendanceTag = () => dispatch => {
  loadingDispatch(dispatch, type.GET_ATTENDANCE_TAG);
  axios({
    method: 'get',
    url: `${API_URL}attendacetag/getAll`,
    timeout: API_TIMEOUT,
    headers: API_HEADERS,
  }).then(({ data }) => {
    const dataOptions = [];
    data.result.forEach(item => dataOptions.push({
      value: item._id,
      label: item.desc
    }));
    successDispatch(dispatch, type.GET_ATTENDANCE_TAG, dataOptions);
  }).catch(err => {
    errorDispatch(dispatch, type.GET_ATTENDANCE_TAG, errMsg(err));
  });
}

export const getSaldoKas = () => async dispatch => {
  loadingDispatch(dispatch, type.GET_SALDO_KAS);
  axios({
    method: 'get',
    url: `${API_URL}kas/getKas`,
    timeout: API_TIMEOUT,
    headers: await authHeader()
  }).then(({ data }) => {
    if (data.result && data.result.length > 0 && data.status === 200)
      successDispatch(dispatch, type.GET_SALDO_KAS, data.result[0])
    if (!data.result && data.result.length === 0 && data.status !== 200)
      errorDispatch(dispatch, type.GET_SALDO_KAS, data.message)
  }).catch(err => errorDispatch(dispatch, type.GET_SALDO_KAS, errMsg(err)));
}

export const getKasTransaction = data => async dispatch => {
  loadingDispatch(dispatch, type.GET_KAS_TRANSACTION);
  await axios({
    method: 'post',
    url: `${API_URL}kas/getKasTransaction`,
    timeout: API_TIMEOUT,
    headers: await authHeader(),
    data
  }).then(({ data }) => {
    if (!data.result || data.status !== 200)
      errorDispatch(dispatch, type.GET_KAS_TRANSACTION, data.message);
    else successDispatch(dispatch, type.GET_KAS_TRANSACTION, data.result);
  }).catch(err => {
    errorDispatch(dispatch, type.GET_KAS_TRANSACTION, errMsg(err))
  });
}

export const getUserById = data => async dispatch => {
  loadingDispatch(dispatch, type.GET_USER_BY_ID);
  await axios({
    method: 'post',
    url: `${API_URL}getUserById`,
    timeout: API_TIMEOUT,
    headers: await authHeader(),
    data
  }).then(({ data }) => {
    if (!data.result || data.status !== 200)
      errorDispatch(dispatch, type.GET_USER_BY_ID, data.message);
    else successDispatch(dispatch, type.GET_USER_BY_ID, data.result);
  }).catch(err => {
    errorDispatch(dispatch, type.GET_USER_BY_ID, errMsg(err))
  });
}

export const getReimbursement = data => async dispatch => {
  loadingDispatch(dispatch, type.GET_REIMBURSEMENT);
  try {
    await axios({
      method: 'post',
      url: `${API_URL}reimbursement/getbyuser`,
      timeout: API_TIMEOUT,
      headers: await authHeader(),
      data
    }).then(({ data }) => {
      if (data.result && data.status === 200)
        successDispatch(dispatch, type.GET_REIMBURSEMENT, data.result);
      else errorDispatch(dispatch, type.GET_REIMBURSEMENT, data.message);
    })
  } catch (err) {
    errorDispatch(dispatch, type.GET_REIMBURSEMENT, errMsg(err));
  }
}

export const getSaldoReimbursement = data => async dispatch => {
  loadingDispatch(dispatch, type.GET_SALDO_REIMBURSEMENT);
  try {
    await axios({
      method: 'post',
      url: `${API_URL}reimbursement/getsaldo`,
      timeout: API_TIMEOUT,
      headers: await authHeader(),
      data
    }).then(({ data }) => {
      if (data.result && data.status === 200)
        successDispatch(dispatch, type.GET_SALDO_REIMBURSEMENT, data.result);
      else errorDispatch(dispatch, type.GET_SALDO_REIMBURSEMENT, data.message);
    })
  } catch (err) {
    errorDispatch(dispatch, type.GET_SALDO_REIMBURSEMENT, errMsg(err))
  }
}

export const insertDataNotification = (payload) => dispatch => {
  dispatch({
    type: type.INCOMING_NOTIFICATION,
    payload
  })
}

export const getAllTypeOffWork = () => async dispatch => {
  loadingDispatch(dispatch, type.GET_TYPE_OFF_WORK);
  axios({
    method: 'get',
    url: `${API_URL}typeoffwork/getall`,
    timeout: API_TIMEOUT,
    headers: await authHeader()
  }).then(({ data }) => {
    if (data.result && data.status === 200) {
      const dataOptions = data.result.map(v => ({ value: v._id, label: v.name }));
      successDispatch(dispatch, type.GET_TYPE_OFF_WORK, dataOptions);
    }
    else errorDispatch(dispatch, type.GET_TYPE_OFF_WORK, data.message);
  }).catch(err => errorDispatch(dispatch, type.GET_TYPE_OFF_WORK, errMsg(err)));
}
