import * as type from '../types';
import {
  API_URL,
  API_TIMEOUT,
  authHeaderMultiPart,
  authHeader
} from '../../config/constant';
import {
  loadingDispatch,
  successDispatch,
  errorDispatch
} from '../dispatchs';
import { errMsg } from '../../utils';
// import RNFetchBlob from 'rn-fetch-blob';
import axios from 'axios';

export const resetAllReducerTransaction = () => dispatch => {
  dispatch({
    type: type.RESET_ALL_TRANSACTION_REDUCER
  });
}

export const absentIn = (userId, userName, desc, location, image, cb) => async dispatch => {
  console.log(userId);
  loadingDispatch(dispatch, type.ABSENT_IN);
  // const dataParse = JSON.stringify({ userId, userName, desc, location });
  // const headerConfig = await authHeaderMultiPart();
  // let validFilePhoto = await checkFilePhoto(image.uri);

  const imageData = new FormData();
  imageData.append('file', {
    uri: image.uri,
    type: 'image/jpeg',
    name: `photo-${new Date().getTime()}.jpg`
  });
  imageData.append('data', JSON.stringify({ userId, userName, desc, location }));
  axios({
    method: 'post',
    url: `${API_URL}absent/in`,
    timeout: API_TIMEOUT,
    headers: await authHeaderMultiPart(),
    data: imageData,
    validateStatus: () => true
  }).then(({ data }) => {
    console.log(data);
    if (data.status === 200) {
      successDispatch(dispatch, type.ABSENT_IN, data.message);
      if (cb) cb(data.message, 'ok');
    } else {
      console.log(data);
      errorDispatch(dispatch, type.ABSENT_IN, data.message);
      if (cb) cb(data.message, 'failed');
    }
  }).catch(err => {
    console.log(err);
    errorDispatch(dispatch, type.ABSENT_IN, errMsg(err));
    if (cb) cb(errMsg(err), 'failed');
  });

  // if (validFilePhoto.status === 'ok') {
  //   const upload = () => {
  //     return RNFetchBlob.fetch(
  //       'POST',
  //       `${API_URL}absent/in`,
  //       headerConfig,
  //       [
  //         { name: 'data', data: dataParse },
  //         {
  //           name: 'file',
  //           filename: validFilePhoto.filename,
  //           type: 'image/png',
  //           data: image.base64
  //         },
  //       ]
  //     );
  //   }

  //   upload()
  //     .then(res => {
  //       try {
  //         let resData = JSON.parse(res.data);
  //         if (resData.status === 200) {
  //           successDispatch(dispatch, type.ABSENT_IN, resData.message);
  //           if (cb) cb();
  //         }
  //         else errorDispatch(dispatch, type.ABSENT_IN, resData.message);
  //       } catch (err) {
  //         errorDispatch(dispatch, type.ABSENT_IN, 'Can not absent, please try again!');
  //       }
  //     })
  //     .catch(err => {
  //       errorDispatch(dispatch, type.ABSENT_IN, errMsg(err))
  //     });
  // } else {
  //   errorDispatch(dispatch, type.ABSENT_IN, validFilePhoto.message);
  // }
}

export const absentOut = (id, location, image, cb) => async dispatch => {
  loadingDispatch(dispatch, type.ABSENT_OUT);
  const imageData = new FormData();
  imageData.append('file', {
    uri: image.uri,
    type: 'image/jpeg',
    name: `photo-${new Date().getTime()}.jpg`
  });
  imageData.append('data', JSON.stringify({ id, location }));
  axios({
    method: 'post',
    url: `${API_URL}absent/out`,
    timeout: API_TIMEOUT,
    headers: await authHeaderMultiPart(),
    data: imageData,
    validateStatus: () => true
  }).then(({ data }) => {
    if (data.status === 200) {
      successDispatch(dispatch, type.ABSENT_OUT, data.message);
      if (cb) cb();
    } else {
      errorDispatch(dispatch, type.ABSENT_OUT, data.message);
    }
  }).catch(err => {
    errorDispatch(dispatch, type.ABSENT_OUT, errMsg(err));
  });
}

export const payingKas = (data, imageUri, cb) => async dispatch => {
  loadingDispatch(dispatch, type.PAYING_KAS);
  const imageData = new FormData();
  imageData.append('file', {
    uri: imageUri,
    type: 'image/jpeg',
    name: `photo-${new Date().getTime()}.jpg`
  });
  imageData.append('data', JSON.stringify(data));
  axios({
    method: 'post',
    url: `${API_URL}kas/kasTransaction`,
    timeout: API_TIMEOUT,
    headers: await authHeaderMultiPart(),
    data: imageData,
    validateStatus: () => true
  }).then(({ data }) => {
    if (data.status === 200) {
      successDispatch(dispatch, type.PAYING_KAS, data.message);
      if (cb) cb(data.message, 'ok');
    } else {
      errorDispatch(dispatch, type.PAYING_KAS, data.message);
      if (cb) cb(data.message, 'failed');
    }
  }).catch(err => {
    errorDispatch(dispatch, type.PAYING_KAS, errMsg(err));
    if (cb) cb(errMsg(err), 'failed');
  });
}

export const offWork = async data => {
  let result;
  const formData = new FormData();
  if (data.imageUri) formData.append('file', {
    uri: data.imageUri,
    type: 'image/jpeg',
    name: `photo-${new Date().getTime()}.jpg`
  });
  formData.append('data', JSON.stringify(data.payload));
  await axios({
    method: 'post',
    url: `${API_URL}absent/offwork`,
    timeout: API_TIMEOUT,
    headers: await authHeaderMultiPart(),
    data: formData
  }).then(({ data }) => {
    console.log(data);
    if (data.result && data.status === 200) result = data.result.Message;
  }).catch((err) => { console.log(errMsg(err)) });
  return result
}

export const updateProfile = data => async dispatch => {
  loadingDispatch(dispatch, type.UPDATE_PROFILE);
  axios({
    method: 'post',
    url: `${API_URL}update-temp`,
    timeout: API_TIMEOUT,
    headers: await authHeader(),
    data
  }).then(({ data }) => {
    if (!data.result || data.status !== 200)
      errorDispatch(dispatch, type.UPDATE_PROFILE, data.message)
    else successDispatch(dispatch, type.UPDATE_PROFILE, data.result.Message);
  }).catch((err) => {
    errorDispatch(dispatch, type.UPDATE_PROFILE, errMsg(err));
  });
}

export const updatePhotoProfile = async (imageUri, id) => {
  let result;
  const formData = new FormData();
  formData.append('file', {
    uri: imageUri,
    type: 'image/jpeg',
    name: `photo-${new Date().getTime()}.jpg`
  });
  formData.append('data', JSON.stringify({ id }));
  await axios({
    method: 'post',
    url: `${API_URL}update`,
    timeout: API_TIMEOUT,
    headers: await authHeaderMultiPart(),
    data: formData
  }).then(({ data }) => {
    if (data.result && data.status === 200) result = 'Success Update Photo Profile'
  }).catch((err) => { });
  return result;
}

export const applyReimbursement = async (payload, imageUri) => {
  let result;
  const formData = new FormData();
  formData.append('file', {
    uri: imageUri,
    type: 'image/jpeg',
    name: `photo-${new Date().getTime()}.jpg`
  });
  formData.append('data', JSON.stringify(payload));
  await axios({
    method: 'post',
    url: `${API_URL}reimbursement/insert`,
    timeout: API_TIMEOUT,
    headers: await authHeaderMultiPart(),
    data: formData
  }).then(({ data }) => {
    if (data.result && data.status === 200) result = 'Success Apply Reimbursement, please wait until finance accept your request.';
  }).catch((err) => { console.log(errMsg(err)) });
  return result;
}

export const deleteReimbursement = async data => {
  console.log(data);
  let result;
  await axios({
    method: 'post',
    url: `${API_URL}reimbursement/delete`,
    timeout: API_TIMEOUT,
    headers: await authHeader(),
    data
  }).then(({ data }) => {
    if (data.result && data.status === 200) result = data.message;
  }).catch((err) => { console.log(errMsg(err)) });
  return result;
}

export const changeFcmToken = async payload => {
  let result;
  await axios.post(`${API_URL}fcmToken`, payload, { headers: await authHeader() })
    .then(({ data }) => {
      if (data.result && data.status === 200) result = data.message;
    }).catch(err => { console.log(errMsg(err)) });
  return result;
}
