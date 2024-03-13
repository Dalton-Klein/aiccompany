import { useEffect, useState } from "react";
import {
  View,
  SafeAreaView,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Image,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import * as THEME from "../../constants/theme";
import TitleBar from "../../components/nav/tab-titlebar";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import BasicBtn from "../../components/tiles/buttons/basicButton";
import { logoutUser } from "../../store/userSlice";

const Settings = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const userState = useSelector((state: RootState) => state.user.user);

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    // clearReduxPersistCache();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = () => {
    dispatch(logoutUser(userState.id));
    router.navigate("auth/authentication");
  };

  return (
    <SafeAreaView style={styles.masterContainer}>
      <TitleBar title="Settings"></TitleBar>
      <ScrollView contentContainerStyle={styles.scrollBox}>
        <View style={styles.userFieldBox}>
          <Text style={styles.userFieldText}>Profile Photo</Text>
          {userState.avatar_url.length > 0 ? (
            <Image source={userState.avatar_url} style={styles.prolfileImg} />
          ) : (
            <TouchableOpacity style={styles.dynamicAvatarBg}>
              <Text style={styles.dynamicAvatarText}>
                {userState.username
                  ? userState.username
                      .split(" ")
                      .map((word: string[]) => word[0])
                      .join("")
                      .slice(0, 2)
                      .toLowerCase()
                  : "gg"}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.userFieldBox}>
          <Text style={styles.userFieldText}>Username</Text>
          <Text style={styles.userFieldText}>{userState.username}</Text>
        </View>
        <View style={styles.buttonBox}>
          <BasicBtn
            iconUrl={<></>}
            handlePress={handleLogout}
            buttonText={"Logout"}
            isCancel={true}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  masterContainer: {
    flex: 1,
    backgroundColor: THEME.COLORS.darker,
  },
  titleText: {
    color: THEME.COLORS.lighter,
  },
  scrollBox: {
    justifyContent: "center",
    alignItems: "center",
  },
  prolfileImg: {
    maxWidth: 75,
    maxHeight: 75,
    minWidth: 75,
    minHeight: 75,
    borderRadius: 75 / 2,
  },
  dynamicAvatarBg: {
    backgroundColor: THEME.COLORS.neutral,
    minWidth: 75,
    minHeight: 75,
    borderRadius: 75 / 2,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  dynamicAvatarText: {
    fontSize: THEME.SIZES.large,
  },
  userFieldBox: {
    marginTop: 25,
    marginBottom: 25,
    paddingLeft: 15,
    paddingRight: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    minWidth: "95%",
  },
  userFieldText: {
    color: THEME.COLORS.lighter,
    fontSize: THEME.SIZES.medium,
  },
  buttonBox: {
    maxWidth: 150,
    marginTop: 15,
  },
});

export default Settings;
