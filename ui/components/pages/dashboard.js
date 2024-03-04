import { useState } from "react";
import { View, SafeAreaView, Text } from "react-native";
import { useRouter } from "expo-router";

import { COLORS } from "../../constants/theme";

const Dashboard = () => {
  const router = useRouter();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.light }}>
      <View>
        <Text>Dashboard!</Text>
      </View>
    </SafeAreaView>
  );
};
export default Dashboard;
