/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging';
import PushNotification, { Importance } from 'react-native-push-notification';
import SQLiteData from './src/store/SQLiteData';

PushNotification.createChannel(
  {
    channelId: "123", // (required)
    channelName: "My channel", // (required)
    channelDescription: "A channel to categorise your notifications", // (optional) default: undefined.
    playSound: true, // (optional) default: true
    soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
    importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
    vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
  },
  (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
);

let inc = 0;
// Register background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
  inc += 1;
  console.log('Message handled in the background!', remoteMessage);
  await SQLiteData.InsertQuery(remoteMessage.data.title, remoteMessage.data.body, remoteMessage.data.imageUrl);
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

AppRegistry.registerComponent(appName, () => App);
