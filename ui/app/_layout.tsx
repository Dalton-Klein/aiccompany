import { Stack } from "expo-router";
import { Provider } from "react-redux";
import store from "../store/store";

const Layout = () => {
  return (
    <Provider store={store}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="auth/authentication" />
      </Stack>
    </Provider>
  );
};

export default Layout;
