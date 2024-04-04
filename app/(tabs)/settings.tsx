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
  Modal,
} from "react-native";
import { useRouter } from "expo-router";
import * as THEME from "../../constants/theme";
import TitleBar from "../../components/nav/tab-titlebar";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import BasicBtn from "../../components/tiles/buttons/basicButton";
import {
  logoutUser,
  updateUserThunk,
} from "../../store/userSlice";
import {
  deleteUserAccount,
  updateUserField,
  uploadAvatarCloud,
} from "../services/rest";
import React from "react";
import * as ImagePicker from "expo-image-picker";
import SelectDropdown from "react-native-select-dropdown";
import { FontAwesome } from "@expo/vector-icons";

const Settings = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const userState = useSelector(
    (state: RootState) => state.user.user
  );

  const [reminderSetting, setreminderSetting] =
    useState("");
  const [newUsername, setnewUsername] = useState("");
  const [errorText, seterrorText] = useState("");
  const [
    isUsernameInputFocused,
    setisUsernameInputFocused,
  ] = useState(false);
  const [
    isDeleteAccountModalVisible,
    setisDeleteAccountModalVisible,
  ] = useState(false);
  const [
    isChangeUsernameModalVisible,
    setisChangeUsernameModalVisible,
  ] = useState(false);

  useEffect(() => {
    if (!userState.id || userState.id < 1) {
      router.navigate("auth/authentication");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    //Might need this hook to get pictures to refresh without switching tabs
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userState.avatar_url]);

  useEffect(() => {
    if (userState.reminder_type === 1) {
      setreminderSetting("15 minutes before");
    } else if (userState.reminder_type === 2) {
      setreminderSetting("30 minutes before");
    } else if (userState.reminder_type === 3) {
      setreminderSetting("1 hour before");
    } else if (userState.reminder_type === 4) {
      setreminderSetting("2 hours before");
    } else if (userState.reminder_type === 5) {
      setreminderSetting("24 hours before");
    } else if (userState.reminder_type === 6) {
      setreminderSetting("Never");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userState.reminder_type]);

  const handleLogout = () => {
    dispatch(logoutUser(userState.id));
    router.navigate("auth/authentication");
  };

  const handleDeleteAccount = async () => {
    await deleteUserAccount(userState.id, "");
    setisDeleteAccountModalVisible(false);
    dispatch(logoutUser(userState.id));
    router.navigate("auth/authentication");
  };

  const toggleShowTasksSwitch = async (value: boolean) => {
    await updateUserField(
      userState.id,
      "show_tasks",
      value
    );
    if (userState && userState.id && userState.id > 0) {
      dispatch(updateUserThunk(userState.id));
    }
  };

  const handlePickAvatar = async () => {
    // Requesting permission to access the camera roll
    const { status } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert(
        "Sorry, we need camera roll permissions to make this work! Go to your settings, then to the Accompany Me app, and enable access to photos."
      );
      return;
    }

    // Launching the image picker
    let result: any =
      await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1], // Optional: You can force the crop aspect ratio to be square
        quality: 1,
      });

    if (!result.cancelled) {
      const uploadResult = await uploadAvatarCloud(
        result.assets[0].uri
      );
      // // Assuming you have a function to handle the upload of the image URL to your server or backend
      const rez = await updateUserField(
        userState.id,
        "avatar_url",
        uploadResult
      );
      if (userState && userState.id && userState.id > 0) {
        dispatch(updateUserThunk(userState.id));
      }
    }
  };

  const setReminderSetting = async (selected: any) => {
    let determinedId = 1;
    if (selected === "15 minutes before") {
      determinedId = 1;
    } else if (selected === "30 minutes before") {
      determinedId = 2;
    } else if (selected === "1 hour before") {
      determinedId = 3;
    } else if (selected === "2 hours before") {
      determinedId = 4;
    } else if (selected === "24 hours before") {
      determinedId = 5;
    } else if (selected === "Never") {
      determinedId = 6;
    }
    await updateUserField(
      userState.id,
      "reminder_type",
      determinedId
    );
  };

  const handleRequestUsernameChange = async () => {
    const result: any = await updateUserField(
      userState.id,
      "username",
      newUsername
    );
    if (!result) {
      seterrorText("API error, sorry try again");
    } else if (result && result.error) {
      seterrorText(result.error);
    } else {
      setisChangeUsernameModalVisible(false);
      if (userState && userState.id && userState.id > 0) {
        dispatch(updateUserThunk(userState.id));
      }
    }
  };
  const handleUsernameErrorChecking = (value: string) => {
    const regex = /[A-Za-z0-9]/;
    if (value.length < 4) {
      seterrorText("Username is too short");
    } else if (value.length > 18) {
      seterrorText("Username is too long");
    } else if (!regex.test(value)) {
      seterrorText(
        "Username must contain a letter or number"
      );
    } else {
      seterrorText("");
    }
    setnewUsername(value);
  };
  return (
    <SafeAreaView style={styles.masterContainer}>
      <TitleBar title="Settings"></TitleBar>
      <ScrollView contentContainerStyle={styles.scrollBox}>
        <View style={styles.userFieldBox}>
          <Text style={styles.userFieldText}>
            Profile Photo
          </Text>
          {userState.avatar_url?.length > 0 ? (
            <TouchableOpacity
              style={styles.avatarBg}
              onPress={handlePickAvatar}
            >
              <Image
                src={userState.avatar_url}
                style={styles.profileImg}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.dynamicAvatarBg}
              onPress={handlePickAvatar}
            >
              <FontAwesome
                name="user-o"
                size={36}
                color={THEME.COLORS.lighter}
              />
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.userFieldBox}>
          <Text style={styles.userFieldText}>Username</Text>
          <TouchableOpacity
            onPress={() => {
              setisChangeUsernameModalVisible(true);
            }}
          >
            <Text style={styles.userFieldText}>
              {userState.username}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.userSelectBox}>
          <Text style={styles.userFieldText}>
            Default Event Reminder Setting
          </Text>
          <SelectDropdown
            data={[
              "15 minutes before",
              "30 minutes before",
              "1 hour before",
              "2 hours before",
              "24 hours before",
              "Never",
            ]}
            defaultValue={reminderSetting}
            defaultButtonText="Select Reminder Setting"
            onSelect={(selectedItem, index) => {
              setReminderSetting(selectedItem);
            }}
            buttonTextAfterSelection={(
              selectedItem,
              index
            ) => {
              return selectedItem;
            }}
            rowTextForSelection={(item, index) => {
              return item;
            }}
            buttonStyle={{
              marginBottom: 5,
              marginTop: 5,
              minWidth: "95%",
            }}
          />
        </View>
        <View style={styles.userFieldBoxSwitch}>
          <Text style={styles.userFieldText}>
            Show tasks in calendar view
          </Text>
          <Switch
            trackColor={{
              false: THEME.COLORS.dark,
              true: THEME.COLORS.neutral,
            }}
            thumbColor={
              userState.show_tasks
                ? THEME.COLORS.primary
                : THEME.COLORS.lighter
            }
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleShowTasksSwitch}
            value={userState.show_tasks}
            style={styles.switch}
          />
        </View>
        <Text style={styles.infoText}>
          If enabled, we automatically slot tasks into your
          calendar as your schedule allows.
        </Text>
        <View style={styles.buttonBox}>
          <BasicBtn
            iconUrl={<></>}
            handlePress={handleLogout}
            buttonText={"Logout"}
            isCancel={true}
          />
        </View>
        <View style={styles.userFieldBox}>
          <Text style={styles.userFieldText}>
            Danger Zone
          </Text>
        </View>
        <View style={styles.buttonBox}>
          <TouchableOpacity
            onPress={() => {
              setisDeleteAccountModalVisible(true);
            }}
            style={styles.deleteAcctBtn}
          >
            <Text style={styles.deleteAcctBtnText}>
              Delete Account
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      {/* Delete Account Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isDeleteAccountModalVisible}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              Are you sure you want to delete your account?
            </Text>
            <Text style={styles.modalText}>
              All of the data associated to your account
              will be deleted.
            </Text>
            <TouchableOpacity
              style={styles.deleteAcctBtn}
              onPress={() => {
                handleDeleteAccount();
              }}
            >
              <Text style={styles.deleteAcctBtnText}>
                Continue
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalBtnContainer}
              onPress={() => {
                setisDeleteAccountModalVisible(false);
              }}
            >
              <Text style={styles.modalBtnText}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* Change Username Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isChangeUsernameModalVisible}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              Change Username
            </Text>
            <TextInput
              style={[
                styles.textInput,
                isUsernameInputFocused &&
                  styles.focusedInput,
              ]}
              placeholder={"New username..."}
              placeholderTextColor="grey"
              onChangeText={(value) => {
                handleUsernameErrorChecking(value);
              }}
              onFocus={() =>
                setisUsernameInputFocused(true)
              }
              onBlur={() =>
                setisUsernameInputFocused(false)
              }
            />
            <Text style={styles.errorText}>
              {errorText && errorText.length
                ? errorText
                : ""}
            </Text>
            <BasicBtn
              iconUrl={<></>}
              handlePress={() => {
                handleRequestUsernameChange();
              }}
              buttonText={"Request Change"}
              isCancel={false}
            />
            <BasicBtn
              iconUrl={<></>}
              handlePress={() => {
                setisChangeUsernameModalVisible(false);
              }}
              buttonText={"Cancel"}
              isCancel={true}
            />
          </View>
        </View>
      </Modal>
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
  userSelectBox: {
    minWidth: "95%",
    marginTop: 25,
    marginBottom: 15,
    paddingLeft: 15,
    paddingRight: 15,
    alignItems: "flex-start",
    justifyContent: "flex-start",
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
    maxWidth: 250,
    marginTop: 15,
  },
  deleteAcctBtn: {
    backgroundColor: THEME.COLORS.lighter,
    flex: 1,
    borderRadius: THEME.BORDERSIZES.medium,
    borderWidth: 2,
    borderColor: "red",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    marginLeft: 5,
    marginRight: 5,
    minWidth: "100%",
    maxHeight: 50,
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 20,
    paddingLeft: 20,
  },
  deleteAcctBtnText: {
    color: "red",
    fontSize: THEME.SIZES.medium,
    textAlign: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: THEME.COLORS.lighter,
    borderRadius: 20,
    width: "90%",
    minHeight: "50%",
    padding: 35,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 20,
    fontSize: THEME.SIZES.medium,
    textAlign: "center",
  },
  modalBtnContainer: {
    flex: 1,
    backgroundColor: THEME.COLORS.primary,
    borderRadius: THEME.BORDERSIZES.medium,
    justifyContent: "center",
    alignItems: "center",
    minWidth: "100%",
    marginLeft: 5,
    marginRight: 5,
    marginTop: 20,
    maxHeight: 50,
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 20,
    paddingLeft: 20,
  },
  modalBtnText: {
    color: THEME.COLORS.lighter,
    fontSize: THEME.SIZES.medium,
    textAlign: "center",
  },
  textInput: {
    marginTop: 15,
    marginBottom: 45,
    padding: 5,
    borderRadius: THEME.BORDERSIZES.medium,
    borderColor: THEME.COLORS.primary,
    minWidth: "100%",
    color: THEME.COLORS.fontColor,
    textAlign: "center",
    fontWeight: "800",
  },
  focusedInput: {
    borderColor: THEME.COLORS.primary,
    borderWidth: 2,
  },
  errorText: {
    textAlign: "center",
    color: "red",
    fontSize: THEME.SIZES.medium,
    marginBottom: 15,
  },
});

export default Settings;
