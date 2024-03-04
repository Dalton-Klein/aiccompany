import { useState } from "react";
import { View, SafeAreaView, Text } from "react-native";
import { useRouter } from "expo-router";

import { COLORS } from "../../constants/theme";

const Settings = () => {
  const router = useRouter();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.light }}>
      <View>
        <Text>Settings!</Text>
      </View>
    </SafeAreaView>
  );
};
export default Settings;
