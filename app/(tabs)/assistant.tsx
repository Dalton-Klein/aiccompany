import { useEffect, useState } from "react";
import { View, SafeAreaView, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import * as THEME from "../../constants/theme";
import TitleBar from "../../components/nav/tab-titlebar";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

const Assistant = () => {
  const router = useRouter();
  const userState = useSelector((state: RootState) => state.user.user);

  useEffect(() => {
    if (!userState.id || userState.id < 1) {
      router.navigate("auth/authentication");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <SafeAreaView style={styles.masterContainer}>
      <TitleBar title="Assistant"></TitleBar>
      <Text style={styles.titleText}>AI Assistant coming soon!</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  masterContainer: {
    flex: 1,
    backgroundColor: THEME.COLORS.lighter,
  },
  titleText: {
    marginTop: 75,
    color: THEME.COLORS.fontColor,
    textAlign: "center",
    fontSize: THEME.SIZES.large,
  },
});

export default Assistant;
