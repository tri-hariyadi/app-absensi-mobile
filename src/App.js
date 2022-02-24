import React, { useEffect, useState } from 'react';
import { LogBox } from 'react-native';
import { Provider as StoreProvider, useDispatch } from 'react-redux';
import { NavigationContainer, CommonActions } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import FlashMessage from "react-native-flash-message";
import Routes from './routes';
import store from './store';
import axios from 'axios';
import messaging from '@react-native-firebase/messaging';
import SQLite from 'react-native-sqlite-storage';
import PushNotification from 'react-native-push-notification';
import { refreshAccessToken, resetAllAuthReducer } from './store/actions/AuthAction';
import { storeData, removeData } from './store/localStorage';
import { Alert, RemotePushController } from './components';
import SQLiteData from './store/SQLiteData';
import { sendFcmToken } from './utils';
import { insertDataNotification } from './store/actions/CommonAction';

global.db = SQLite.openDatabase(
  {
    name: 'SQLite',
    location: 'default',
    createFromLocation: '~SQLite.db',
  },
  () => { },
  error => {
    console.log("ERROR: " + error);
  }
);

const MainApp = () => {
  LogBox.ignoreLogs(['Warning: Cannot update a component from inside the function body of a different component']);
  const dispatch = useDispatch();
  const navigationRef = React.createRef();
  const [sessionExp, setSessionExp] = useState(false);
  let inc = 0;

  const inisiateDataSQLite = async () => {
    await SQLiteData.CreateTable();
    const data = await SQLiteData.SelectQuery();
    dispatch(insertDataNotification(data));
  }

  useEffect(() => {
    sendFcmToken();
    inisiateDataSQLite();
    let isRefreshing = false;
    let failedQueue = [];

    const processQueue = (error, token = null) => {
      failedQueue.forEach(prom => {
        if (error) {
          prom.reject(error);
        } else {
          prom.resolve(token);
        }
      });
      failedQueue = [];
    }

    axios.interceptors.response.use(async function (response) {
      const originalRequest = response.config;
      const status = response.status;
      if ((status === 401 || status === 403) && !originalRequest._retry && !(response.config.url.includes('/refreshtoken'))) {
        console.log('sessionExp => ', sessionExp);
        if (isRefreshing) {
          try {
            const token = await new Promise(function (resolve, reject) {
              failedQueue.push({ resolve, reject });
            });
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return await axios(originalRequest);
          } catch (err) {
            return await Promise.reject(err);
          }
        }

        originalRequest._retry = true;
        isRefreshing = true;

        return new Promise((resolve, reject) => {
          refreshAccessToken()
            .then(async ({ data }) => {
              const promise = await storeData('token', { accessToken: data.result.newAccessToken });
              await Promise.resolve(promise);
              axios.defaults.headers.common['Authorization'] = `Bearer ${data.result.newAccessToken}`;
              originalRequest.headers['Authorization'] = `Bearer ${data.result.newAccessToken}`;
              processQueue(null, data.result.newAccessToken);
              resolve(axios(originalRequest));
            })
            .catch(async (err) => {
              dispatch(resetAllAuthReducer());
              await removeData('token');
              setSessionExp(true);
            })
            .finally(() => { isRefreshing = false });
        })
      }
      return response;
    }, async function (error) {
      const originalRequest = error.config;
      const status = error.response ? error.response.status : null;
      if ((status === 401 || status === 403) && !originalRequest._retry && !(error.config.url.includes('/refreshtoken'))) {
        console.log('sessionExp => ', sessionExp);
        if (isRefreshing) {
          try {
            const token = await new Promise(function (resolve, reject) {
              failedQueue.push({ resolve, reject });
            });
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return await axios(originalRequest);
          } catch (err) {
            return await Promise.reject(err);
          }
        }

        originalRequest._retry = true;
        isRefreshing = true;

        return new Promise((resolve, reject) => {
          refreshAccessToken()
            .then(async ({ data }) => {
              const promise = await storeData('token', { accessToken: data.result.newAccessToken });
              await Promise.resolve(promise);
              axios.defaults.headers.common['Authorization'] = `Bearer ${data.result.newAccessToken}`;
              originalRequest.headers['Authorization'] = `Bearer ${data.result.newAccessToken}`;
              processQueue(null, data.result.newAccessToken);
              resolve(axios(originalRequest));
            })
            .catch(async (err) => {
              dispatch(resetAllAuthReducer());
              await removeData('token');
              setSessionExp(true);
            })
            .finally(() => { isRefreshing = false });
        })
      }
      return Promise.reject(error);
    });
  }, []);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log(remoteMessage);
      await SQLiteData.InsertQuery(remoteMessage.data.title, remoteMessage.data.subject, remoteMessage.data.content, remoteMessage.data.icon);
      const data = await SQLiteData.SelectQuery();
      dispatch(insertDataNotification(data));
      PushNotification.localNotification({
        id: '1',
        channelId: '123',
        autoCancel: true,
        bigText: remoteMessage.data.subject,
        title: remoteMessage.data.title,
        message: remoteMessage.data.subject,
        vibrate: true,
        vibration: 300,
        playSound: true,
        soundName: 'default',
        number: inc > 0 ? inc : null,
        bigPictureUrl: remoteMessage.data.imageUrl
      });
    });

    return unsubscribe;
  }, []);

  return (
    <SafeAreaProvider>
      <FlashMessage position="top" />
      <NavigationContainer ref={navigationRef}>
        <Routes />
      </NavigationContainer>
      <Alert
        show={sessionExp}
        type='warning'
        title='Warning'
        message='Your session is expired, please login again !'
        showCancelButton
        cancelText='OK'
        onCancelPressed={() => {
          navigationRef.current.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'LoginPage' }]
            })
          );
          setSessionExp(false);
        }}
        onDismiss={() => setSessionExp(false)}
        closeOnHardwareBackPress={false}
        closeOnTouchOutside={false}
      />
      <RemotePushController />
    </SafeAreaProvider>
  );
}

const App = () => {
  return (
    <StoreProvider store={store}>
      <MainApp />
    </StoreProvider>
  )
}

export default App;
