import { Redirect } from "expo-router";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import Entypo from "@expo/vector-icons/Entypo";
import { useCallback, useEffect, useState } from "react";
import { View } from "react-native";

SplashScreen.preventAutoHideAsync();

const StartPage = () => {
  let [fontsLoaded] = Font.useFonts({
    "Inter-Regular": require("../assets/fonts/Inter-Regular.ttf"),
    // Add more fonts if needed
  });

  if (!fontsLoaded) {
    SplashScreen.preventAutoHideAsync(); // Prevent SplashScreen from auto-hiding
    return null; // Return null to prevent rendering the app until fonts are loaded
  }

  // After fonts are loaded, you can call SplashScreen.hideAsync() to hide the SplashScreen
  SplashScreen.hideAsync();

  return <Redirect href="/dashboard" />;
};
export default StartPage;
