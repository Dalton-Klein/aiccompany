import { useState } from "react";
import { View, SafeAreaView, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import * as THEME from "../../constants/theme";
import TitleBar from "../../components/nav/tab-titlebar";

const Dashboard = () => {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.masterContainer}>
      <TitleBar title='Dashboard'></TitleBar>
      <Text style={styles.titleText}>Dashboard!</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  masterContainer: {
    flex: 1, 
    backgroundColor: THEME.COLORS.darker,
  },
  titleText: {
    color: THEME.COLORS.lighter
  },


});

export default Dashboard;
