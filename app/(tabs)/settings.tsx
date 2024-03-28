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
  Switch,
} from "react-native";
import { useRouter } from "expo-router";
import * as THEME from "../../constants/theme";
import TitleBar from "../../components/nav/tab-titlebar";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import BasicBtn from "../../components/tiles/buttons/basicButton";
import { logoutUser, updateUserThunk } from "../../store/userSlice";
import { updateUserField, uploadAvatarCloud } from "../services/rest";
import React from "react";
import * as ImagePicker from "expo-image-picker";

const Settings = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const userState = useSelector((state: RootState) => state.user.user);

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    if (!userState.id || userState.id < 1) {
      router.navigate("auth/authentication");
    }
    console.log("avatar: ", userState.avatar_url);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = () => {
    dispatch(logoutUser(userState.id));
    router.navigate("auth/authentication");
  };

  const toggleShowTasksSwitch = async (value: boolean) => {
    await updateUserField(userState.id, "show_tasks", value);
    dispatch(updateUserThunk(userState.id));
  };

  const handlePickAvatar = async () => {
    // Requesting permission to access the camera roll
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }

    // Launching the image picker
    let result: any = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // Optional: You can force the crop aspect ratio to be square
      quality: 1,
    });

    if (!result.cancelled) {
      const uploadResult = await uploadAvatarCloud(result.assets[0].uri);
      // // Assuming you have a function to handle the upload of the image URL to your server or backend
      const rez = await updateUserField(
        userState.id,
        "avatar_url",
        uploadResult
      );
      dispatch(updateUserThunk(userState.id));
    }
  };

  return (
    <SafeAreaView style={styles.masterContainer}>
      <TitleBar title="Settings"></TitleBar>
      <ScrollView contentContainerStyle={styles.scrollBox}>
        <View style={styles.userFieldBox}>
          <Text style={styles.userFieldText}>Profile Photo</Text>
          {userState.avatar_url?.length > 0 ? (
            <TouchableOpacity
              style={styles.avatarBg}
              onPress={handlePickAvatar}
            >
              <Image src={userState.avatar_url} style={styles.profileImg} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.dynamicAvatarBg}
              onPress={handlePickAvatar}
            >
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
        <View style={styles.userFieldBoxSwitch}>
          <Text style={styles.userFieldText}>Show tasks in calendar view</Text>
          <Switch
            trackColor={{
              false: THEME.COLORS.dark,
              true: THEME.COLORS.neutral,
            }}
            thumbColor={
              userState.show_tasks ? THEME.COLORS.primary : THEME.COLORS.lighter
            }
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleShowTasksSwitch}
            value={userState.show_tasks}
            style={styles.switch}
          />
        </View>
        <Text style={styles.infoText}>
          If enabled, we automatically slot tasks into your calendar as your
          schedule allows.
        </Text>
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
    backgroundColor: THEME.COLORS.lighter,
  },
  titleText: {
    color: THEME.COLORS.fontColor,
  },
  scrollBox: {
    justifyContent: "center",
    alignItems: "center",
  },
  profileImg: {
    maxWidth: 75,
    maxHeight: 75,
    minWidth: 75,
    minHeight: 75,
    borderRadius: 75 / 2,
  },
  avatarBg: {
    minWidth: 75,
    minHeight: 75,
    borderRadius: 75 / 2,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
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
    color: THEME.COLORS.fontColor,
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
  userFieldBoxSwitch: {
    marginTop: 25,
    marginBottom: 5,
    paddingLeft: 15,
    paddingRight: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    minWidth: "95%",
  },
  userFieldText: {
    color: THEME.COLORS.fontColor,
    fontSize: THEME.SIZES.medium,
  },
  infoText: {
    color: THEME.COLORS.fontColor,
    fontSize: THEME.SIZES.medium,
    fontStyle: "italic",
    fontWeight: "300",
    marginBottom: 25,
  },
  switch: {
    marginBottom: 10,
  },
  buttonBox: {
    maxWidth: 150,
    marginTop: 15,
  },
});

export default Settings;
