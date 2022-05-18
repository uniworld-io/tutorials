// import React, { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { withNavigation } from 'react-navigation';
// import { fcmService } from './FCMService';
// import { localNotificationService } from './LocalPushNotificationService';
// import { savePushToken, countUnReadNotification, getConversation } from '../../store/actions';
// import { getToken, getConversationId } from '../../store/selectors';
// import constants from '../../constants/constants';
// import { Platform } from 'react-native';

// const PushNotificationController = (props) => {

//     const dispatch = useDispatch();

//     const token = useSelector(state => getToken(state));
//     const conversationId = useSelector(state => getConversationId(state));

//     useEffect(() => {
//         console.log('----------PushNotificationController-----------');
//         fcmService.registerAppWithFCM();
//     }, []);

//     useEffect(() => {
//         fcmService.register(onRegister, onNotification, onOpenNotification);
//         localNotificationService.configure(onOpenNotification);

//         function onRegister(fcmToken) {
//             console.log("[PushNotificationController] onRegister: ", fcmToken);
//             dispatch(savePushToken(token, {
//                 deviceToken: fcmToken,
//                 deviceType: constants.appInfo.deviceType,
//                 deviceId: constants.appInfo.deviceId
//             }));
//         }

//         function onNotification(notify) {
//             console.log("[PushNotificationController] onNotification: ", notify);
//             console.log('-a-sa-s-a-sa-s-as', conversationId, notify.conversationId, conversationId !== notify.conversationId);
//             dispatch(countUnReadNotification(token));
//             const options = {
//                 soundName: 'default',
//                 playSound: true
//             }

//             if (conversationId !== notify.conversationId) {
//                 localNotificationService.showNotification(
//                     0,
//                     notify.title,
//                     notify.body,
//                     notify,
//                     options
//                 );
//             }
//         }

//         function onOpenNotification(notif) {
//             console.log("[PushNotificationController] onOpenNotification: ", notif);
//             // alert("Open Notification: " + notif.body);
//             // if (notif.opened_from_tray) {
//             //     console.log("======>Click Launch", notif)
//             //     switch (Platform.OS) {
//             //         case "android":
//             //             if (notif.target) {
//             //                 const target = notif.target;
//             //                 if (typeof (target) === "string") {
//             //                     const target = JSON.parse(notif.target);
//             //                     clickOpenFromTray(target.navigation, target.id, notif)
//             //                 } else {
//             //                     clickOpenFromTray(target.navigation, target.id, notif);
//             //                 }
//             //                 return;
//             //             }
//             //             else if (notif && notif.title && notif.content)
//             //                 props.navigation.navigate('NotificationDetail', { data: notif });
//             //             break;
//             //         case "ios":
//             //             if (notif.target) {
//             //                 const target = notif.target;
//             //                 if (typeof (target) === "string") {
//             //                     const target = JSON.parse(notif.target);
//             //                     clickOpenFromTray(target.navigation, target.id, notif)
//             //                 } else {
//             //                     clickOpenFromTray(target.navigation, target.id, notif)
//             //                 }
//             //                 return;
//             //             }
//             //             else if (notif && notif.title && notif.content)
//             //                 props.navigation.navigate('NotificationDetail', { data: notif });
//             //             break;
//             //         default:
//             //             break;
//             //     }
//             // } else {

//             // }

//             // if (Platform.OS === 'ios') {
//             //     switch (notif._notificationType) {
//             //         case NotificationType.Remote:
//             //             notif.finish(RemoteNotificationResult.NewData)
//             //             break;
//             //         case NotificationType.NotificationResponse:
//             //             notif.finish();
//             //             break;
//             //         case NotificationType.WillPresent:
//             //             notif.finish(WillPresentNotificationResult.All)
//             //             break;
//             //     }
//             // }
//         }

//         return () => {
//             console.log("[PushNotificationController] unRegister");
//             fcmService.unRegister();
//             localNotificationService.unregister();
//         }

//     }, [conversationId]);

//     const clickOpenFromTray = (screen, id, data) => {
//         switch (screen) {
//             case "POST":
//                 props.navigation.navigate('PostDetail', { postId: id })
//                 break;
//             case "provider/order":
//                 props.navigation.navigate('OrderList');
//                 break;
//             case "fire":
//                 props.navigation.navigate('FireNotification', { data });
//                 break;
//             case "TEXT":
//                 props.navigation.navigate('NotificationDetail', { data });
//                 break;
//             default:
//                 props.navigation.navigate('NotificationDetail', { data });
//                 break;
//         }

//     }

//     return null;

// }

// export default withNavigation(PushNotificationController);