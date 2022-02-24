import messaging from '@react-native-firebase/messaging';
import { getData } from '../../store/localStorage';
import jwt_decode from 'jwt-decode';
import { changeFcmToken } from '../../store/actions/TransactionAction';
import {
  NativeEventEmitter,
  NativeModules,
} from 'react-native';
import ReactNativeAN from 'react-native-alarm-notification';

const { RNAlarmNotification } = NativeModules;
const RNEmitter = new NativeEventEmitter(RNAlarmNotification);

export const sendFcmToken = async () => {
  await messaging().registerDeviceForRemoteMessages();
  const token = await messaging().getToken();
  const userToken = await getData('token');
  if (token && userToken) {
    const userId = jwt_decode(userToken.accessToken).idUser;
    // console.log(userId);
    await changeFcmToken({ userId, fcmToken: token })
  } else console.log('Error send fcmToken')
}

export const dateFormat = (data, format) => {
  let days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  let mounts = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  let date = new Date(data).getDate();
  let day = days[new Date(data).getDay()];
  let month = mounts[new Date(data).getMonth()];
  let hours = new Date(data).getHours();
  let min = new Date(data).getMinutes();
  let year = new Date(data).getFullYear();
  let dd = date < 10 ? `0${date}` : date;
  let time = new Date(data).getTime();

  switch (format) {
    case 'MMMM YYYY':
      return `${month} ${year}`;
    case 'DDDD, MMMM DD':
      return `${day}, ${month} ${dd}`
    case 'HH:mm':
      return `${hours} : ${min}`
    case 'DD MMMM YYYY':
      let DD = new Date(data).getDate() < 10 ? `0${new Date(data).getDate()}` : new Date(data).getDate();
      let MMMM = new Date(data).getMonth() + 1 < 10 ? `0${new Date(data).getMonth() + 1}` : new Date(data).getMonth() + 1;
      return `${DD}-${MMMM}-${year}`
    default:
      return {
        date,
        day,
        month,
        hours,
        min,
        year,
        time
      };
  }
}

export const errMsg = err => err ? err.response ? err.response.data.message : err.message : 'Oops... Something went wrong';

// export const checkFilePhoto = async fileUri => {
//   const fileTypes = /jpeg|jpg|png|gif/;
//   const response = {
//     status: 'no',
//     filename: '-',
//     message: 'Error'
//   }
//   try {
//     let result = await RNFetchBlob.fs.stat(fileUri)
//     if (!(fileTypes.test(result.filename) && fileTypes.test(result.path))) {
//       response.message = 'Must upload file image';
//       return response;
//     }
//     response.filename = result.filename;
//     response.status = 'ok';
//     response.message = 'success';
//     return response;
//   } catch (err) {
//     response.message = 'Error Upload Photo, try again!'
//     return response;
//   }
// }

export const formatter = (num) => {
  return 'Rp ' + num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
}

export const normalizePrice = (value) => {
  if (!value) {
    return value
  }
  let onlyNums = value.replace(/[^\d]/g, '').toString(),
    split = onlyNums.split(','),
    sisa = split[0].length % 3,
    priceFormat = split[0].substr(0, sisa),
    thousand = split[0].substr(sisa).match(/\d{1,3}/gi);

  if (thousand) {
    let separator = sisa ? '.' : '';
    priceFormat += separator + thousand.join('.');
  }

  priceFormat = split[1] !== undefined ? priceFormat + ',' + split[1] : priceFormat;
  return `Rp. ${priceFormat}`
}

export const compare = (prevProps, nextProps) => JSON.stringify(prevProps) === JSON.stringify(nextProps);
export const monts = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
export const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

export const formatDate = (date, showDay) => {
  let month = new Date(date).getMonth(),
    DD = new Date(date).getDate(),
    year = new Date(date).getFullYear();
  if (showDay) return [`${days[new Date(date).getDay()]},`, DD, monts[month], year].join(' ');
  return [DD, monts[month], year].join(' ');
}

export const setAlarm = async (fireDate, alarmNotifData) => {
  console.log('Fire-Date => ', fireDate);

  const details = { ...alarmNotifData, fire_date: fireDate };
  console.log(`alarm set: ${fireDate}`);

  try {
    const alarm = await ReactNativeAN.scheduleAlarm(details);
    console.log(alarm);
    if (alarm) {
      setConfigAlarm(v => ({ ...v, update: [...v.update, { date: `alarm set: ${fireDate}`, id: alarm.id }] }))
    }
  } catch (e) {
    console.log(e);
  }
};
