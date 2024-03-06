import { useState } from "react";
import { View, SafeAreaView, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import * as THEME from "../../constants/theme";
import TitleBar from "../../components/nav/tab-titlebar";

const Assistant = () => {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.masterContainer}>
      <TitleBar title='Assistant'></TitleBar>
      <Text style={styles.titleText}>Assistant!</Text>
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

export default Assistant;