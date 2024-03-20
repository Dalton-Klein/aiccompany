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
import { useLocalSearchParams, useRouter } from "expo-router";
import CalendarInviteForm from "../../components/forms/calendarInviteForm";
import { getCalendarsData, updateCalendarsData } from "../services/rest";
import MemberTile from "../../components/tiles/social/memberTile";

const CalendarManager = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [title, settitle] = useState("");
  const [description, setdescription] = useState("");
  const [memberTiles, setmemberTiles] = useState([]);
  const [invitedTiles, setinvitedTiles] = useState([]);
  const [unsavedChanges, setunsavedChanges] = useState([]);
  const [isResultModalVisible, setisResultModalVisible] = useState(false);
  const [resultText, setresultText] = useState("");

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRefresh = () => {
    fetchData();
  };

  const fetchData = async () => {
    const result = await getCalendarsData(id, "");
    settitle(result.data.title);
    setdescription(result.data.description);
    if (result.memberResult && result.memberResult.length) {
      convertMembersToTiles(result.memberResult);
    }
    if (result.inviteResult && result.inviteResult.length) {
      convertInviteesToTiles(result.inviteResult);
    }
  };

  const convertMembersToTiles = (memberData: any[]) => {
    let tiles = [];
    memberData.forEach((member) => {
      tiles.push(<MemberTile member={member} key={member.id}></MemberTile>);
    });
    setmemberTiles(tiles);
  };

  const convertInviteesToTiles = (memberData: any[]) => {
    let tiles = [];
    memberData.forEach((member) => {
      tiles.push(<MemberTile member={member} key={member.id}></MemberTile>);
    });
    setinvitedTiles(tiles);
  };

  const addUnsavedChange = (field: string, value: string) => {
    const existingIndex = unsavedChanges.findIndex(
      (item) => item.field === field
    );

    if (existingIndex === -1) {
      // Field doesn't exist, add a new object
      setunsavedChanges([...unsavedChanges, { field: field, value: value }]);
    } else {
      // Field exists, update the existing object
      const updatedChanges = [...unsavedChanges];
      updatedChanges[existingIndex].value = value;
      setunsavedChanges(updatedChanges);
    }
  };

  const handleSaveChanges = async () => {
    if (!unsavedChanges.length) {
      setresultText("No changes to title or description detected!");
      setisResultModalVisible(true);
    } else {
      const saveResult = await updateCalendarsData(id, unsavedChanges, "");
      setresultText("Changes saved!");
      setisResultModalVisible(true);
    }
  };

  const navigateBack = () => {
    router.navigate(`/dashboard`);
  };

  return (
    <SafeAreaView>
      <View style={styles.titleRow}>
        <TouchableOpacity style={styles.backBtn} onPress={navigateBack}>
          <Text>Back</Text>
        </TouchableOpacity>
        <Text style={styles.titleText}>Manage Calendar</Text>
        <Text style={styles.backBtn}></Text>
      </View>
      <ScrollView keyboardShouldPersistTaps="always">
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
          <Text style={styles.nothingText}>Nothing to show here!</Text>
        )}
        <Text style={styles.subTitle}>Pending Invites</Text>
        {invitedTiles.length ? (
          invitedTiles
        ) : (
          <Text style={styles.nothingText}>Nothing to show here!</Text>
        )}
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
            <Text style={styles.modalText}>{resultText}</Text>
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
  nothingText: {
    color: "grey",
    marginLeft: 25,
    marginBottom: 20,
    fontSize: THEME.SIZES.large,
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
    minHeight: 200,
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
  },
});

export default CalendarManager;
