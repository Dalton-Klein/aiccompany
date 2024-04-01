import { Tabs } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import * as THEME from "../../constants/theme";
import React from "react";

const Layout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: THEME.COLORS.darker,
        tabBarStyle: {
          backgroundColor: THEME.COLORS.lighter,
          borderTopWidth: 1,
          borderTopColor: THEME.COLORS.darker,
          paddingTop: 5,
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          headerShown: false,
          title: "Dashboard",
          tabBarIcon: ({ color }) => (
            <FontAwesome
              size={28}
              name="home"
              color={color}
            />
          ),
        }}
      ></Tabs.Screen>
      <Tabs.Screen
        name="calendar"
        options={{
          headerShown: false,
          title: "Calendar",
          tabBarIcon: ({ color }) => (
            <FontAwesome
              size={28}
              name="calendar"
              color={color}
            />
          ),
        }}
      ></Tabs.Screen>
      <Tabs.Screen
        name="assistant"
        options={{
          headerShown: false,
          title: "Assistant",
          tabBarIcon: ({ color }) => (
            <FontAwesome
              size={28}
              name="user"
              color={color}
            />
          ),
        }}
      ></Tabs.Screen>
      <Tabs.Screen
        name="settings"
        options={{
          headerShown: false,
          title: "Settings",
          tabBarIcon: ({ color }) => (
            <FontAwesome
              size={28}
              name="cog"
              color={color}
            />
          ),
        }}
      ></Tabs.Screen>
    </Tabs>
  );
};

export default Layout;
