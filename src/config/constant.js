import { getData } from '../store/localStorage';

// export const API_URL = 'https://floating-meadow-53357.herokuapp.com/api/v1/absensiMobile/';
export const API_URL = 'http://192.168.43.229:8082/api/v1/absensiMobile/';
export const IMAGE_PATH = 'https://floating-meadow-53357.herokuapp.com';
export const API_TIMEOUT = 15000;
export const API_HEADERS = {
  'Content-type': 'application/json',
  'X-Api-Key': '9515328e-d485-4d3e-b0e3-7bf20be04926'
}
export const authHeader = async () => {
  let accessToken = await getData('token');
  if (accessToken) {
    return {
      'Content-type': 'application/json',
      'X-Api-Key': '9515328e-d485-4d3e-b0e3-7bf20be04926',
      'Authorization': `Bearer ${accessToken.accessToken}`
    }
  }
  return {}
}

export const authHeaderMultiPart = async () => {
  let accessToken = await getData('token');
  if (accessToken) {
    return {
      'Content-Type': 'multipart/form-data',
      'X-Api-Key': '9515328e-d485-4d3e-b0e3-7bf20be04926',
      'Authorization': `Bearer ${accessToken.accessToken}`
    }
  }
  return {}
}
