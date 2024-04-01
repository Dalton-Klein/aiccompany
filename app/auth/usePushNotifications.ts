import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { useState, useEffect, useRef } from "react";
import Constants from "expo-constants";
import * as THEME from "../../constants/theme";
import { Platform } from "react-native";

export interface PushNotificationState {
  notification?: Notifications.Notification;
  expoPushToken?: Notifications.ExpoPushToken;
}

export const usePushNotifications =
  (): PushNotificationState => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldPlaySound: false,
        shouldShowAlert: true,
        shouldSetBadge: false,
      }),
    });

    const [expoPushToken, setexpoPushToken] = useState<
      Notifications.ExpoPushToken | undefined
    >();

    const [notification, setnotification] = useState<
      Notifications.Notification | undefined
    >();

    const notificationListener = useRef<any>();
    const responseListener = useRef<any>();

    async function registerForPushNotificationsAsync() {
      let token: any;
      if (Device.isDevice) {
        const { status: existingStatus } =
          await Notifications.getPermissionsAsync();

        let finalStatus = existingStatus;
        if (existingStatus != "granted") {
          const { status } =
            await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        if (finalStatus !== "granted") {
          alert("Failed to get push token!");
        }

        token = await Notifications.getExpoPushTokenAsync({
          projectId:
            Constants.expoConfig?.extra?.eas?.projectId,
        });

        if (Platform.OS === "android") {
          Notifications.setNotificationChannelAsync(
            "default",
            {
              name: "default",
              importance:
                Notifications.AndroidImportance.MAX,
              vibrationPattern: [0, 250, 250, 250],
              lightColor: THEME.COLORS.primary,
            }
          );
        }

        return token;
      } else {
        console.log(
          "Error: Please use a physical device to register for push notifications"
        );
      }
    }

    useEffect(() => {
      registerForPushNotificationsAsync().then((token) => {
        setexpoPushToken(token);
      });
      notificationListener.current =
        Notifications.addNotificationReceivedListener(
          (notification) => {
            setnotification(notification);
          }
        );
      responseListener.current =
        Notifications.addNotificationResponseReceivedListener(
          (response) => {
            console.log("listener: ", response);
          }
        );
      return () => {
        Notifications.removeNotificationSubscription(
          notificationListener.current!
        );
        Notifications.removeNotificationSubscription(
          responseListener.current!
        );
      };
    }, []);

    return {
      expoPushToken,
      notification,
    };
  };
