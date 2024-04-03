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
  TouchableWithoutFeedback,
} from "react-native";
import { StyleSheet } from "react-native";
import * as THEME from "../../constants/theme";
import BasicBtn from "../../components/tiles/buttons/basicButton";
import { useEffect, useState } from "react";
import {
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import {
  createEventAssignments,
  deleteEvent,
  deleteSeries,
  getEventsData,
  removeEventAssignments,
  updateEventsData,
} from "../services/rest";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import CalendarTile from "../../components/tiles/calendar/calendar-tile";
import moment from "moment";
import { setPreferences } from "../../store/userPreferencesSlice";
import React from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Keyboard } from "react-native";

const EventManager = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const userState = useSelector(
    (state: RootState) => state.user.user
  );
  const preferencesState = useSelector(
    (state: RootState) => state.preferences
  );

  const [isTask, setisTask] = useState(false);

  const [title, settitle] = useState("");
  const [notes, setnotes] = useState("");
  const [startTime, setstartTime] = useState("");
  const [taskDuration, settaskDuration] = useState(0);
  const [endTime, setendTime] = useState("");
  const [isSeries, setisSeries] = useState(false);
  const [seriesId, setseriesId] = useState(0);
  const [isCancelled, setisCancelled] = useState(false);
  const [isCompleted, setisCompleted] = useState(false);
  const [calendarTiles, setcalendarTiles] = useState([]);
  const [calendarsSelected, setcalendarsSelected] =
    useState([]);
  const [unsavedChanges, setunsavedChanges] = useState([]);
  const [isResultModalVisible, setisResultModalVisible] =
    useState(false);
  const [resultText, setresultText] = useState("");
  const [isLeaveModalVisible, setisLeaveModalVisible] =
    useState(false);
  const [isDeleteModalVisible, setisDeleteModalVisible] =
    useState(false);
  const [
    isDeleteSeriesModalVisible,
    setisDeleteSeriesModalVisible,
  ] = useState(false);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    const result = await getEventsData(
      userState.id,
      id,
      ""
    );
    setisTask(result.data.event.is_task);
    settitle(result.data.event.title);
    setnotes(result.data.event.notes);
    setisSeries(result.data.event.series_id ? true : false);
    setseriesId(result.data.event.series_id);
    setisCancelled(result.data.event.is_cancelled);
    setisCompleted(result.data.event.is_completed);
    setstartTime(result.data.event.start_time);
    setendTime(result.data.event.end_time);
    settaskDuration(result.data.event.task_duration);
    if (
      result.data.calendarAssignments &&
      result.data.calendarAssignments.length
    ) {
      convertAssignmentsToTiles(
        result.data.calendarAssignments
      );
    }
  };

  const convertAssignmentsToTiles = (calendars: any[]) => {
    calendars.forEach((calendar) => {
      if (calendar.is_assigned) {
        setcalendarsSelected([
          ...calendarsSelected,
          calendar.calendar_id,
        ]);
      }
    });
    const memberCalendars = calendars.map(
      (calendar: any) => (
        <View key={calendar.calendar_id}>
          <CalendarTile
            calendar={calendar}
            handlePress={
              handleCalendarSelectedForAssignment
            }
            isPreSelected={calendar.is_assigned === 1}
          ></CalendarTile>
        </View>
      )
    );
    setcalendarTiles(memberCalendars);
  };

  const addUnsavedChange = (field: string, value: any) => {
    if (field === "task_duration" && !value) {
      value = 0;
    }
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

  const handleCalendarSelectedForAssignment = async (
    cal: any,
    isSelected: boolean
  ) => {
    if (isSelected) {
      await createEventAssignments(
        userState.id,
        id,
        [cal.calendar_id],
        ""
      );
    } else {
      await removeEventAssignments(
        userState.id,
        id,
        [cal.calendar_id],
        ""
      );
    }
  };

  const handleSaveChanges = async () => {
    if (!unsavedChanges.length) {
      setresultText("Changes saved!");
      setisResultModalVisible(true);
    } else {
      const saveResult = await updateEventsData(
        id,
        unsavedChanges,
        ""
      );
      if (saveResult) {
        setresultText("Changes saved!");
        setisResultModalVisible(true);
        dispatch(
          setPreferences({
            ...preferencesState,
            refreshCalendar:
              !preferencesState.refreshCalendar,
          })
        );
        setunsavedChanges([]);
      } else {
        setresultText(
          "There was a problem saving changes. Try again or contact support."
        );
        setisResultModalVisible(true);
      }
    }
  };

  const navigateBack = () => {
    if (unsavedChanges.length) {
      setisLeaveModalVisible(true);
    } else {
      router.navigate(`/${preferencesState.lastTabPage}`);
    }
  };

  return (
    <TouchableWithoutFeedback
      onPress={Keyboard.dismiss}
      accessible={false}
      style={styles.master}
    >
      <SafeAreaView>
        <View style={styles.calendarContentBox}>
          <View style={styles.titleRow}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={navigateBack}
            >
              <Text>Back</Text>
            </TouchableOpacity>
            <Text style={styles.titleText}>
              {isTask ? "Manage Task" : "Manage Event"}
            </Text>
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
            <Text style={styles.subTitle}>
              {isTask ? "Duration (minutes)" : "Start Time"}
            </Text>
            <View style={styles.datePickerBox}>
              {/* <Text style={styles.datePickedText}>
              {isTask
                ? `${taskDuration} minutes`
                : moment(startTime).format("MMMM Do YYYY, h:mm a")}
            </Text> */}
              {isTask ? (
                <TextInput
                  style={styles.textInput}
                  keyboardType="numeric"
                  placeholder={
                    "Task Duration in minutes..."
                  }
                  placeholderTextColor="grey"
                  value={
                    taskDuration && taskDuration > 0
                      ? `${taskDuration}`
                      : ""
                  }
                  onChangeText={(value) => {
                    const safeValue = parseInt(
                      value.replace(/[^0-9]/g, "")
                    );
                    addUnsavedChange(
                      "task_duration",
                      safeValue
                    );
                    settaskDuration(safeValue);
                  }}
                  onBlur={() => Keyboard.dismiss()}
                ></TextInput>
              ) : (
                <DateTimePicker
                  value={
                    startTime
                      ? moment(
                          startTime,
                          "YYYY-MM-DDTHH:mm:ss.SSSZ"
                        ).toDate()
                      : moment().toDate()
                  }
                  mode={"datetime"}
                  onChange={(e: any, date: any) => {
                    if (date) {
                      addUnsavedChange("start_time", date);
                      setstartTime(
                        moment(
                          date,
                          "YYYY-MM-DDTHH:mm:ss.SSSZ"
                        ).format("YYYY-MM-DDTHH:mm:ss.SSSZ")
                      );
                    }
                  }}
                  accentColor={THEME.COLORS.primary}
                  minuteInterval={15}
                  style={styles.datePicker}
                />
              )}
            </View>
            <Text style={styles.subTitle}>
              {isTask ? "Deadline" : "End Time"}
            </Text>
            <View style={styles.datePickerBox}>
              {/* <Text style={styles.datePickedText}>
                {moment(endTime).format("MMMM Do YYYY, h:mm a")}
              </Text> */}
              <DateTimePicker
                value={
                  endTime
                    ? moment(
                        endTime,
                        "YYYY-MM-DDTHH:mm:ss.SSSZ"
                      ).toDate()
                    : moment().toDate()
                }
                mode={"datetime"}
                onChange={(e: any, date: any) => {
                  if (date) {
                    addUnsavedChange("end_time", date);
                    setendTime(
                      moment(
                        date,
                        "YYYY-MM-DDTHH:mm:ss.SSSZ"
                      ).format("YYYY-MM-DDTHH:mm:ss.SSSZ")
                    );
                  }
                }}
                accentColor={THEME.COLORS.primary}
                minuteInterval={15}
                style={styles.datePicker}
              />
            </View>
            {isTask ? (
              <Text style={styles.subTitle}>
                Is Task Completed
              </Text>
            ) : (
              <></>
            )}
            {isTask ? (
              <View style={styles.fieldBox}>
                <Switch
                  trackColor={{
                    false: THEME.COLORS.dark,
                    true: THEME.COLORS.neutral,
                  }}
                  thumbColor={
                    isCompleted
                      ? THEME.COLORS.primary
                      : THEME.COLORS.lighter
                  }
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={() => {
                    setisCompleted(!isCompleted);
                    addUnsavedChange(
                      "is_completed",
                      !isCompleted
                    );
                  }}
                  value={isCompleted}
                  style={styles.seriesSwitch}
                />
              </View>
            ) : (
              <></>
            )}
            <Text style={styles.subTitle}>
              {isTask
                ? "Is Task Cancelled"
                : "Is Event Cancelled"}
            </Text>
            <View style={styles.fieldBox}>
              <Switch
                trackColor={{
                  false: THEME.COLORS.dark,
                  true: THEME.COLORS.neutral,
                }}
                thumbColor={
                  isCancelled
                    ? THEME.COLORS.primary
                    : THEME.COLORS.lighter
                }
                ios_backgroundColor="#3e3e3e"
                onValueChange={() => {
                  setisCancelled(!isCancelled);
                  addUnsavedChange(
                    "is_cancelled",
                    !isCancelled
                  );
                }}
                value={isCancelled}
                style={styles.seriesSwitch}
              />
            </View>
            {isSeries && (
              <Text style={styles.seriesNotifText}>
                *Calendar assignments will be applied to all
                events in this series*
              </Text>
            )}
            <Text style={styles.subTitle}>
              Calendar Assignments
            </Text>
            <View style={styles.calendarTileBox}>
              {calendarTiles}
            </View>
            <TouchableOpacity
              style={styles.deleteBtnContainer}
              onPress={() => {
                setisDeleteModalVisible(true);
              }}
            >
              <Text style={styles.stayBtnText}>
                {isTask ? "Delete Task" : "Detete Event"}
              </Text>
            </TouchableOpacity>
            {isSeries ? (
              <TouchableOpacity
                style={styles.deleteBtnContainer}
                onPress={() => {
                  setisDeleteSeriesModalVisible(true);
                }}
              >
                <Text style={styles.stayBtnText}>
                  Delete Series
                </Text>
              </TouchableOpacity>
            ) : (
              <></>
            )}
          </ScrollView>
        </View>
        <View style={styles.confirmContainer}>
          <BasicBtn
            iconUrl={<></>}
            handlePress={handleSaveChanges}
            buttonText={"Save"}
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
                  router.navigate(
                    `/${preferencesState.lastTabPage}`
                  );
                }}
              >
                <Text style={styles.btnText}>Leave</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        {/* Confirm Delete Event Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={isDeleteModalVisible}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text
                style={styles.modalText}
              >{`This event will be removed from all calendars. Are you sure you want to delete this event?`}</Text>
              <TouchableOpacity
                style={styles.stayBtnContainer}
                onPress={() => {
                  setisDeleteModalVisible(false);
                }}
              >
                <Text style={styles.stayBtnText}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btnContainer}
                onPress={async () => {
                  await deleteEvent(userState.id, id, "");
                  dispatch(
                    setPreferences({
                      ...preferencesState,
                      refreshCalendar:
                        !preferencesState.refreshCalendar,
                    })
                  );
                  router.navigate(
                    `/${preferencesState.lastTabPage}`
                  );
                }}
              >
                <Text style={styles.btnText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        {/* Confirm Delete SERIES Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={isDeleteSeriesModalVisible}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text
                style={styles.modalText}
              >{`All events in this series will be removed from all calendars. \n\nAre you sure you want to delete every event in this series?`}</Text>
              <TouchableOpacity
                style={styles.stayBtnContainer}
                onPress={() => {
                  setisDeleteSeriesModalVisible(false);
                }}
              >
                <Text style={styles.stayBtnText}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btnContainer}
                onPress={async () => {
                  await deleteSeries(
                    userState.id,
                    id,
                    seriesId,
                    ""
                  );
                  dispatch(
                    setPreferences({
                      ...preferencesState,
                      refreshCalendar:
                        !preferencesState.refreshCalendar,
                    })
                  );
                  router.navigate(
                    `/${preferencesState.lastTabPage}`
                  );
                }}
              >
                <Text style={styles.btnText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  master: {
    backgroundColor: THEME.COLORS.lighter,
  },
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
  datePickerBox: {
    minWidth: "40%",
    maxWidth: "70%",
    marginBottom: 5,
    marginTop: 10,
    marginLeft: 20,
    marginRight: 20,
    alignContent: "flex-start",
  },
  datePicker: {
    marginBottom: 10,
    maxWidth: 300,
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
  deleteBtnContainer: {
    backgroundColor: THEME.COLORS.lighter,
    borderRadius: THEME.SIZES.small / 1.25,
    borderWidth: 2,
    borderColor: THEME.COLORS.secondary,
    justifyContent: "center",
    alignItems: "center",
    minWidth: "80%",
    marginTop: 25,
    marginBottom: 5,
    marginLeft: 20,
    marginRight: 20,
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
    fontSize: THEME.SIZES.large,
  },
  seriesNotifText: {
    color: THEME.COLORS.dark,
    textAlign: "center",
    marginLeft: 25,
    marginRight: 25,
    marginBottom: 10,
    fontSize: THEME.SIZES.medium,
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
    textAlign: "center",
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
