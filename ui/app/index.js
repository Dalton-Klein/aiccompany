import { useState } from "react";
import { View, ScrollView, SafeAreaView, Text } from "react-native";
import { Stack, useRouter } from "expo-router";
import { NavigationContainer } from "@react-navigation/native";
import { COLORS } from "../constants/theme";
import { heart, location } from "../constants/icons";
import { MainNav } from "../components/tiles/nav/mainNav";
import { Dashboard } from "../components/pages/dashboard";
import { Settings } from "../components/pages/settings";
import { Calendar } from "../components/pages/calendar";
import { Assistant } from "../components/pages/assistant";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
const Tab = createBottomTabNavigator();

const Home = () => {
  const router = useRouter();
  console.log("huh ", heart, location);
  return (
    <Tab.Navigator>
      <Tab.Screen name="home" component={Dashboard} />
      <Tab.Screen name="assistant" component={Calendar} />
      <Tab.Screen name="calendar" component={Assistant} />
      <Tab.Screen name="settings" component={Settings} />
    </Tab.Navigator>
  );
};
export default Home;
