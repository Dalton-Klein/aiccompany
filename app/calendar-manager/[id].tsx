import {
  Text,
  Image,
  TouchableOpacity,
  View,
  Modal,
  TextInput,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { StyleSheet } from "react-native";
import * as THEME from "../../constants/theme";
import BasicBtn from "../../components/tiles/buttons/basicButton";
import { useEffect, useState } from "react";
import {
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import CalendarInviteForm from "../../components/forms/calendarInviteForm";
import {
  deleteCalendar,
  getCalendarsData,
  removeCalendarMember,
  revokeCalendarInvite,
  updateCalendarsData,
  uploadAvatarCloud,
} from "../services/rest";
import MemberTile from "../../components/tiles/social/memberTile";
import React from "react";
import { FontAwesome5 } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { RootState } from "../../store/store";
import { useDispatch, useSelector } from "react-redux";
import { setPreferences } from "../../store/userPreferencesSlice";

const CalendarManager = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const userState = useSelector(
    (state: RootState) => state.user.user
  );
  const preferencesState = useSelector(
    (state: RootState) => state.preferences
  );

  const [calendarBanner, setcalendarBanner] = useState("");
  const [title, settitle] = useState("");
  const [description, setdescription] = useState("");
  const [memberTiles, setmemberTiles] = useState([]);
  const [invitedTiles, setinvitedTiles] = useState([]);
  const [unsavedChanges, setunsavedChanges] = useState([]);
  const [isResultModalVisible, setisResultModalVisible] =
    useState(false);
  const [resultText, setresultText] = useState("");
  const [isLeaveModalVisible, setisLeaveModalVisible] =
    useState(false);
  const [
    isDeleteCalendarModalVisible,
    setisDeleteCalendarModalVisible,
  ] = useState(false);
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRefresh = () => {
    fetchData();
  };

  const fetchData = async () => {
    const result = await getCalendarsData(id, "");
    setcalendarBanner(result.data.calendar_url);
    settitle(result.data.title);
    setdescription(result.data.description);
    if (result.memberResult && result.memberResult.length) {
      convertMembersToTiles(result.memberResult);
    } else {
      setmemberTiles([]);
    }
    if (result.inviteResult && result.inviteResult.length) {
      convertInviteesToTiles(result.inviteResult);
    } else {
      setinvitedTiles([]);
    }
  };

  const convertMembersToTiles = (memberData: any[]) => {
    let tiles = [];
    memberData.forEach((member) => {
      tiles.push(
        <MemberTile
          member={member}
          key={member.id}
          isRemovable={true}
          removeMessage={
            "Are you sure you want to remove this user from the calendar?"
          }
          handleRemoveUser={() => {
            handleRemoveUserFromCalendar(member);
          }}
        ></MemberTile>
      );
    });
    setmemberTiles(tiles);
  };

  const convertInviteesToTiles = (memberData: any[]) => {
    let tiles = [];
    memberData.forEach((member) => {
      tiles.push(
        <MemberTile
          member={member}
          key={member.id}
          isRemovable={true}
          removeMessage={
            "Are you sure you want to revoke the invite for this user?"
          }
          handleRemoveUser={() => {
            handleRemoveInviteForUser(member);
          }}
        ></MemberTile>
      );
    });
    setinvitedTiles(tiles);
  };

  const handleRemoveUserFromCalendar = async (
    member: any
  ) => {
    await removeCalendarMember(member.user_id, id, "");
    await fetchData();
  };

  const handleRemoveInviteForUser = async (member: any) => {
    await revokeCalendarInvite(member.receiver, id, "");
    await fetchData();
  };

  const addUnsavedChange = (
    field: string,
    value: string
  ) => {
    const existingIndex = unsavedChanges.findIndex(
      (item) => item.field === field
    );

    if (existingIndex === -1) {
      // Field doesn't exist, add a new object
      setunsavedChanges([
        ...unsavedChanges,
        { field: field, value: value },
      ]);
    } else {
      // Field exists, update the existing object
      const updatedChanges = [...unsavedChanges];
      updatedChanges[existingIndex].value = value;
      setunsavedChanges(updatedChanges);
    }
  };

  const handleSaveChanges = async () => {
    if (!unsavedChanges.length) {
      setresultText("Changes saved!");
      setisResultModalVisible(true);
    } else {
      const saveResult = await updateCalendarsData(
        id,
        unsavedChanges,
        ""
      );
      setresultText("Changes saved!");
      setisResultModalVisible(true);
      setunsavedChanges([]);
    }
  };

  const navigateBack = () => {
    if (unsavedChanges.length) {
      setisLeaveModalVisible(true);
    } else {
      router.navigate(`/dashboard`);
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

    if (result && !result.cancelled) {
      const uploadResult = await uploadAvatarCloud(
        result.assets[0].uri
      );
      // // Assuming you have a function to handle the upload of the image URL to your server or backend
      addUnsavedChange("calendar_url", uploadResult);
      setcalendarBanner(uploadResult);
    }
  };

  const handleDeleteCalendar = async () => {
    await deleteCalendar(userState.id, id, "");
    dispatch(
      setPreferences({
        ...preferencesState,
        refreshDashboard:
          !preferencesState.refreshDashboard,
      })
    );
    router.navigate("dashboard");
  };

  return (
    <SafeAreaView style={styles.master}>
      <View style={styles.titleRow}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={navigateBack}
        >
          <Text>Back</Text>
        </TouchableOpacity>
        <Text style={styles.titleText}>
          Manage Calendar
        </Text>
        <Text style={styles.backBtn}></Text>
      </View>
      <ScrollView
        keyboardShouldPersistTaps="always"
        style={styles.scrollBox}
      >
        <View style={styles.photoBox}>
          <Text style={styles.subTitle}>Photo</Text>
          {calendarBanner ? (
            <TouchableOpacity
              style={styles.avatarBg}
              onPress={handlePickAvatar}
            >
              <Image
                src={calendarBanner}
                style={styles.profileImg}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.dynamicAvatarBg}
              onPress={handlePickAvatar}
            >
              <FontAwesome5
                name="calendar"
                size={50}
                color={THEME.COLORS.lighter}
              />
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.subTitle}>Title</Text>
        <View style={styles.fieldBox}>
          <TextInput
            style={styles.textInput}
            placeholder={"Calendar Name"}
            value={title}
            placeholderTextColor="grey"
            onChangeText={(value) => {
              addUnsavedChange("title", value);
              settitle(value);
            }}
          ></TextInput>
        </View>
        <Text style={styles.subTitle}>Description</Text>
        <View style={styles.fieldBox}>
          <TextInput
            style={styles.textInput}
            placeholder={"Calendar Description"}
            value={description}
            placeholderTextColor="grey"
            onChangeText={(value) => {
              addUnsavedChange("description", value);
              setdescription(value);
            }}
          ></TextInput>
        </View>
        <Text style={styles.subTitle}>Invite</Text>
        <CalendarInviteForm
          calendarId={id}
          handleRefresh={handleRefresh}
        ></CalendarInviteForm>
        <Text style={styles.subTitle}>Members</Text>
        {memberTiles.length ? (
          memberTiles
        ) : (
          <Text style={styles.nothingText}>
            Nothing to show here!
          </Text>
        )}
        <Text style={styles.subTitle}>Pending Invites</Text>
        {invitedTiles.length ? (
          invitedTiles
        ) : (
          <Text style={styles.nothingText}>
            Nothing to show here!
          </Text>
        )}
        <Text style={styles.subTitle}>Danger Zone</Text>
        <View style={styles.buttonBox}>
          <TouchableOpacity
            onPress={() => {
              setisDeleteCalendarModalVisible(true);
            }}
            style={styles.deleteAcctBtn}
          >
            <Text style={styles.deleteAcctBtnText}>
              Delete Calendar
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <View style={styles.confirmContainer}>
        <BasicBtn
          iconUrl={<></>}
          handlePress={handleSaveChanges}
          buttonText={"Save Calendar"}
          isCancel={false}
        />
      </View>
      {/* Result Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isResultModalVisible}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              {resultText}
            </Text>
            <TouchableOpacity
              style={styles.btnContainer}
              onPress={() => {
                setisResultModalVisible(false);
              }}
            >
              <Text style={styles.btnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* Confirm Leave Page Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isLeaveModalVisible}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text
              style={styles.modalText}
            >{`You have unsaved changes, are you sure you want to leave?`}</Text>
            <TouchableOpacity
              style={styles.stayBtnContainer}
              onPress={() => {
                setisLeaveModalVisible(false);
              }}
            >
              <Text style={styles.stayBtnText}>Stay</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnContainer}
              onPress={() => {
                router.navigate(`/dashboard`);
              }}
            >
              <Text style={styles.btnText}>Leave</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* Confirm Delete Calendar Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isDeleteCalendarModalVisible}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              Are you sure you want to delete this calendar?
            </Text>
            <Text style={styles.modalText}>
              Don't worry, no events will be deleted.
            </Text>
            <Text style={styles.modalText}>
              However, all events currently assigned to this
              calendar will become unassigned, and the
              calendar will be removed for all members
              within it.
            </Text>
            <BasicBtn
              iconUrl={<></>}
              handlePress={() => {
                handleDeleteCalendar();
                setisDeleteCalendarModalVisible(false);
              }}
              buttonText={"Confirm"}
              isCancel={false}
            />
            <BasicBtn
              iconUrl={<></>}
              handlePress={() => {
                setisDeleteCalendarModalVisible(false);
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
  master: {
    backgroundColor: THEME.COLORS.lighter,
  },
  scrollBox: {
    maxHeight: "80%",
  },
  photoBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  profileImg: {
    maxWidth: 100,
    maxHeight: 100,
    minWidth: 100,
    minHeight: 100,
    borderRadius: 100 / 2,
    marginBottom: 15,
  },
  avatarBg: {
    minWidth: 100,
    minHeight: 100,
    borderRadius: 100 / 2,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
  },
  dynamicAvatarBg: {
    backgroundColor: THEME.COLORS.neutral,
    minWidth: 100,
    minHeight: 100,
    borderRadius: 100 / 2,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
  },
  dynamicAvatarText: {
    fontSize: THEME.SIZES.large,
    color: THEME.COLORS.fontColor,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 5,
  },
  titleText: {
    color: THEME.COLORS.fontColor,
    textAlign: "center",
    fontWeight: "600",
    fontSize: THEME.SIZES.large,
    minWidth: "50%",
  },
  backBtn: {
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
    minWidth: 50,
    maxHeight: 50,
  },
  fieldBox: {
    minWidth: "80%",
    marginBottom: 5,
    marginLeft: 20,
    marginRight: 20,
    alignContent: "flex-start",
  },
  btnContainer: {
    backgroundColor: THEME.COLORS.primary,
    borderRadius: THEME.SIZES.small / 1.25,
    justifyContent: "center",
    alignItems: "center",
    minWidth: "100%",
    marginBottom: 15,
  },
  stayBtnContainer: {
    backgroundColor: THEME.COLORS.lighter,
    borderRadius: THEME.SIZES.small / 1.25,
    borderWidth: 2,
    borderColor: THEME.COLORS.secondary,
    justifyContent: "center",
    alignItems: "center",
    minWidth: "100%",
    marginBottom: 15,
  },
  textInput: {
    marginBottom: 15,
    padding: 5,
    borderRadius: THEME.BORDERSIZES.large,
    fontSize: THEME.SIZES.large,
    fontWeight: "600",
    borderColor: THEME.COLORS.secondary,
    minWidth: "80%",
  },
  subTitle: {
    color: THEME.COLORS.fontColor,
    fontWeight: "300",
    fontSize: THEME.SIZES.large,
    marginLeft: 20,
    marginBottom: 10,
    marginTop: 15,
  },
  btnText: {
    color: THEME.COLORS.lighter,
    marginLeft: 10,
    fontSize: THEME.SIZES.large,
    paddingBottom: 10,
    paddingTop: 10,
  },
  stayBtnText: {
    color: THEME.COLORS.secondary,
    marginLeft: 10,
    fontSize: THEME.SIZES.large,
    paddingBottom: 10,
    paddingTop: 10,
  },
  nothingText: {
    color: "grey",
    marginLeft: 25,
    marginBottom: 20,
    fontSize: THEME.SIZES.medium,
  },
  buttonBox: {
    flex: 1,
    maxWidth: "100%",
    marginTop: 15,
    justifyContent: "center",
  },
  deleteAcctBtn: {
    flex: 1,
    borderRadius: THEME.BORDERSIZES.medium,
    borderWidth: 2,
    borderColor: "red",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    marginLeft: 20,
    marginRight: 20,
    minWidth: "80%",
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
  confirmContainer: {
    minWidth: "80%",
    alignItems: "center",
    justifyContent: "space-evenly",
    minHeight: 150,
    marginLeft: 20,
    marginRight: 20,
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
});

export default CalendarManager;
