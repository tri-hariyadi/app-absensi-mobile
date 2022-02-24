import React, { useEffect } from 'react'
import PushNotification from 'react-native-push-notification';

const RemotePushController = () => {
  useEffect(() => {
    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function (token) {
        // console.log('TOKEN:', token)
      },
      // (required) Called when a remote or local notification is opened or received
      onNotification: function (notification) {
        // console.log('REMOTE NOTIFICATION ==>', notification)
        // process the notification here
      },
      onAction: function (notification) {
        console.log("ACTION:", notification.action);
        console.log("NOTIFICATION:", notification);

        // process the action
      },
      // Android only: GCM or FCM Sender ID
      // senderID: '256218572662',
      popInitialNotification: true,
      requestPermissions: true
    })
  }, [])
  return null
}

export default RemotePushController;
