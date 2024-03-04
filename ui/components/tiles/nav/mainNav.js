import { useState } from "react";
import { View, ScrollView, SafeAreaView, Text } from "react-native";
import { Dashboard } from "../../pages/dashboard";
import { Settings } from "../../pages/settings";
import { Calendar } from "../../pages/calendar";
import { Assistant } from "../../pages/assistant";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
const Tab = createBottomTabNavigator();

import { COLORS, icons, images, SIZEZ } from "../../../constants/theme";

const MainNav = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="home" component={Dashboard} />
      <Tab.Screen name="assistant" component={Calendar} />
      <Tab.Screen name="calendar" component={Assistant} />
      <Tab.Screen name="settings" component={Settings} />
    </Tab.Navigator>
  );
};
export default MainNav;
