import {
  Text,
  Image,
  TouchableOpacity,
  View,
  Modal,
  TextInput,
  SafeAreaView,
  ScrollView,
  Switch,
} from "react-native";
import { StyleSheet } from "react-native";
import * as THEME from "../../constants/theme";
import BasicBtn from "../../components/tiles/buttons/basicButton";
import { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getEventsData, updateCalendarsData } from "../services/rest";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import CalendarTile from "../../components/tiles/calendar/calendar-tile";
import moment from "moment";

const EventManager = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const userState = useSelector((state: RootState) => state.user.user);
  const preferencesState = useSelector((state: RootState) => state.preferences);

  const [title, settitle] = useState("");
  const [notes, setnotes] = useState("");
  const [startTime, setstartTime] = useState("");
  const [endTime, setendTime] = useState("");
  const [isCancelled, setisCancelled] = useState(false);
  const [calendarTiles, setcalendarTiles] = useState([]);
  const [calendarsSelected, setcalendarsSelected] = useState([]);
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
    const result = await getEventsData(userState.id, id, "");
    settitle(result.data.event.title);
    setnotes(result.data.event.notes);
    setisCancelled(result.data.event.is_cancelled);
    setstartTime(result.data.event.start_time);
    setendTime(result.data.event.end_time);
    if (
      result.data.calendarAssignments &&
      result.data.calendarAssignments.length
    ) {
      convertAssignmentsToTiles(result.data.calendarAssignments);
    }
  };

  const convertAssignmentsToTiles = (calendars: any[]) => {
    calendars.forEach((calendar) => {
      if (calendar.is_assigned) {
        setcalendarsSelected([...calendarsSelected, calendar.calendar_id]);
      }
    });
    const memberCalendars = calendars.map((calendar: any) => (
      <View key={calendar.calendar_id}>
        <CalendarTile
          calendar={calendar}
          handlePress={handleCalendarSelectedForAssignment}
          isPreSelected={calendar.is_assigned === 1}
        ></CalendarTile>
      </View>
    ));
    setcalendarTiles(memberCalendars);
  };

  const addUnsavedChange = (field: string, value: any) => {
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

  const handleCalendarSelectedForAssignment = (cal: any) => {
    //This either adds or removes a calendar from the array of selected calendars
    if (calendarsSelected.some((calendar: any) => calendar.id === cal.id)) {
      const updatedCalendars = calendarsSelected.filter(
        (calendar) => calendar.id !== cal.id
      );
      setcalendarsSelected(updatedCalendars);
    } else {
      setcalendarsSelected([...calendarsSelected, cal]);
    }
  };

  const handleSaveChanges = async () => {
    if (!unsavedChanges.length) {
      setresultText("No changes to title or notes detected!");
      setisResultModalVisible(true);
    } else {
      const saveResult = await updateCalendarsData(id, unsavedChanges, "");
      console.log("save result: ", saveResult);
      setresultText("Changes saved!");
      setisResultModalVisible(true);
    }
  };

  const navigateBack = () => {
    router.navigate(`/${preferencesState.lastTabPage}`);
  };

  return (
    <SafeAreaView>
      <View style={styles.calendarContentBox}>
        <View style={styles.titleRow}>
          <TouchableOpacity style={styles.backBtn} onPress={navigateBack}>
            <Text>Back</Text>
          </TouchableOpacity>
          <Text style={styles.titleText}>Manage Event</Text>
          <Text style={styles.backBtn}></Text>
        </View>
        <ScrollView keyboardShouldPersistTaps="always">
          <Text style={styles.subTitle}>Title</Text>
          <View style={styles.fieldBox}>
            <TextInput
              style={styles.textInput}
              placeholder={"Event Name"}
              value={title}
              placeholderTextColor="grey"
              onChangeText={(value) => {
                addUnsavedChange("title", value);
                settitle(value);
              }}
            ></TextInput>
          </View>
          <Text style={styles.subTitle}>Notes</Text>
          <View style={styles.fieldBox}>
            <TextInput
              style={styles.textInput}
              placeholder={"Event Notes"}
              value={notes}
              placeholderTextColor="grey"
              onChangeText={(value) => {
                addUnsavedChange("notes", value);
                setnotes(value);
              }}
            ></TextInput>
          </View>
          <Text style={styles.subTitle}>Start Time</Text>
          <View style={styles.fieldBox}>
            <Text style={styles.datePickedText}>
              {moment(startTime).format("MMMM Do YYYY, h:mm a")}
            </Text>
          </View>
          <Text style={styles.subTitle}>End Time</Text>
          <View style={styles.fieldBox}>
            <Text style={styles.datePickedText}>
              {moment(endTime).format("MMMM Do YYYY, h:mm a")}
            </Text>
          </View>
          <Text style={styles.subTitle}>Is Event Cancelled</Text>
          <View style={styles.fieldBox}>
            <Switch
              trackColor={{
                false: THEME.COLORS.dark,
                true: THEME.COLORS.neutral,
              }}
              thumbColor={
                isCancelled ? THEME.COLORS.primary : THEME.COLORS.lighter
              }
              ios_backgroundColor="#3e3e3e"
              onValueChange={() => {
                setisCancelled(!isCancelled);
                addUnsavedChange("is_cancelled", !isCancelled);
              }}
              value={isCancelled}
              style={styles.seriesSwitch}
            />
          </View>
          <Text style={styles.subTitle}>Calendar Assignments</Text>
          <View style={styles.calendarTileBox}>{calendarTiles}</View>
        </ScrollView>
      </View>
      <View style={styles.confirmContainer}>
        <BasicBtn
          iconUrl={<></>}
          handlePress={handleSaveChanges}
          buttonText={"Save Event"}
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
  calendarContentBox: {
    maxHeight: "83%",
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
  seriesSwitch: {
    marginBottom: 10,
  },
  calendarTileBox: {
    flexDirection: "row",
    flexWrap: "wrap",
    maxWidth: "90%",
    justifyContent: "space-evenly",
    marginLeft: 15,
    marginRight: 15,
  },
  datePickedText: {
    marginBottom: 15,
    color: THEME.COLORS.darker,
    fontSize: THEME.SIZES.medium,
  },
});

export default EventManager;
