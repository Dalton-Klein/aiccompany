import {
  Text,
  Image,
  TouchableOpacity,
  View,
  Modal,
  TextInput,
  SafeAreaView,
} from "react-native";
import { StyleSheet } from "react-native";
import * as THEME from "../../constants/theme";
import BasicBtn from "../../components/tiles/buttons/basicButton";
import { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import CalendarInviteForm from "../../components/forms/calendarInviteForm";
import { getCalendarsData } from "../services/rest";

const CalendarManager = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [title, settitle] = useState("");
  const [description, setdescription] = useState("");
  const [memberTiles, setmemberTiles] = useState([]);
  const [invitedTiles, setinvitedTiles] = useState([]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    const result = await getCalendarsData(id, "");
    settitle(result.data.title);
    setdescription(result.data.description);
    console.log("what? ", result);
  };
  const handleSubmitForm = () => {
    // handleCreate({ title, description });
  };

  const navigateBack = () => {
    router.navigate(`/dashboard`);
  };

  return (
    <SafeAreaView>
      <View>
        <View style={styles.titleRow}>
          <TouchableOpacity style={styles.backBtn} onPress={navigateBack}>
            <Text>Back</Text>
          </TouchableOpacity>
          <Text style={styles.titleText}>Manage Calendar</Text>
          <Text style={styles.backBtn}></Text>
        </View>
        <Text style={styles.subTitle}>Title</Text>
        <View style={styles.fieldBox}>
          <TextInput
            style={styles.textInput}
            placeholder={"Calendar Name"}
            value={title}
            placeholderTextColor="grey"
            onChangeText={(value) => {
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
              setdescription(value);
            }}
          ></TextInput>
        </View>
        <Text style={styles.subTitle}>Invite</Text>
        <CalendarInviteForm></CalendarInviteForm>
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
        <View style={styles.confirmContainer}>
          <BasicBtn
            iconUrl={<></>}
            handlePress={handleSubmitForm}
            buttonText={"Save Calendar"}
            isCancel={false}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 35,
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
    marginBottom: 15,
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
    borderWidth: 2,
  },
  subTitle: {
    color: THEME.COLORS.fontColor,
    fontWeight: "300",
    fontSize: THEME.SIZES.large,
    marginLeft: 20,
    marginBottom: 10,
  },
  btnText: {
    color: THEME.COLORS.lighter,
    marginLeft: 10,
    fontSize: THEME.SIZES.large,
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
});

export default CalendarManager;
