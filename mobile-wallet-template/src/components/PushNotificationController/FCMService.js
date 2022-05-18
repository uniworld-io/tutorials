// import messaging from '@react-native-firebase/messaging';
// import { Platform } from 'react-native';

// class FCMService {

//     register = (onRegister, onNotification, onOpenNotification) => {
//         this.checkPermission(onRegister);
//         this.createNotificationListeners(onRegister, onNotification, onOpenNotification);
//     }

//     registerAppWithFCM = async () => {
//         // if (Platform.OS === 'ios') {
//         //     await messaging().registerDeviceForRemoteMessages();
//         //     await messaging().setAutoInitEnabled(true);
//         // }
//     }

//     checkPermission = async (onRegister) => {
//         if (Platform.OS === 'ios') {
//             await messaging().registerDeviceForRemoteMessages();
//             await messaging().setAutoInitEnabled(true);
//         }
//         messaging().hasPermission()
//             .then(enabled => {
//                 if (enabled) {
//                     this.getToken(onRegister);
//                 } else {
//                     this.requestPermission(onRegister);
//                 }
//             }).catch(err => {
//                 console.log("[FCMService] Permission rejected", err);
//             })
//     }

//     getToken = (onRegister) => {
//         messaging().getToken()
//             .then(fcmToken => {
//                 if (fcmToken) {
//                     onRegister(fcmToken);
//                 } else {
//                     console.log("[FCMService] User does not have a device token");
//                 }
//             }).catch(err => {
//                 console.log("[FCMService] Get token rejected", err);
//             });
//     }

//     requestPermission = (onRegister) => {
//         messaging().requestPermission()
//             .then(() => {
//                 this.getToken(onRegister);
//             }).catch(err => {
//                 console.log("[FCMService] Request permission rejected", err);
//             })
//     }

//     deleteToken = () => {
//         console.log("[FCMService] Delete token");
//         messaging().deleteToken()
//             .catch(err => {
//                 console.log("[FCMService] Delete token failed", err);
//             })
//     }

//     createNotificationListeners = (onRegister, onNotification, onOpenNotification) => {
//         // When the application is running, but in the background
//         messaging()
//             .onNotificationOpenedApp(remoteMessage => {
//                 console.log("[FCMService] onNotificationOpenedApp Notification caused app to open from background");
//                 if (remoteMessage) {
//                     const notification = remoteMessage.notification;
//                     onOpenNotification(notification);
//                     // this.removeDeliveredNotification(notification.notificationId);
//                 }
//             });

//         // When the application is opened from a quit state
//         messaging()
//             .getInitialNotification()
//             .then(remoteMessage => {
//                 console.log("[FCMService] onNotificationOpenedApp Notification caused app to open from quit state");
//                 if (remoteMessage) {
//                     const notification = remoteMessage.notification;
//                     onOpenNotification(notification);
//                     // this.removeDeliveredNotification(notification.notificationId);
//                 }
//             });

//         // Foreground state messages
//         this.messageListener = messaging().onMessage(async remoteMessage => {
//             console.log("[FCMService] A new FCM message arrived", remoteMessage);
//             if (remoteMessage) {
//                 let notification = null;
//                 if (Platform.OS === 'ios') {
//                     notification = remoteMessage.data;
//                 } else {
//                     notification = { ...remoteMessage.notification, ...remoteMessage.data };
//                 }
//                 onNotification(notification);
//             }
//         });

//         // Triggered when have a new token
//         messaging().onTokenRefresh(fcmToken => {
//             console.log("[FCMService] New token refresh: ", fcmToken);
//             onRegister(fcmToken);
//         });
//     }

//     unRegister = () => {
//         this.messageListener();
//     }

// }

// export const fcmService = new FCMService();