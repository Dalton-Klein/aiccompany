import { useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Modal,
  Image,
} from "react-native";
import * as THEME from "../../constants/theme";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useNavigationState } from "@react-navigation/native";
import {
  createCalendar,
  createEvent,
  createEventAssignments,
  createTask,
  getAllCalendarsForUser,
} from "../../app/services/rest";
import CalendarTile from "../tiles/calendar/calendar-tile";
import BasicBtn from "../tiles/buttons/basicButton";
import CreateCalendarForm from "../forms/createCalendarForm";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import CreateEventForm from "../forms/createEventForm";
import CreateForm from "../forms/createForm";
import { setPreferences } from "../../store/userPreferencesSlice";
import CreateTaskForm from "../forms/createTaskForm";
import CalendarBrowser from "./calendarBrowser";

const TitleBar = (props: any) => {
  const dispatch = useDispatch();
  const userState = useSelector((state: RootState) => state.user.user);
  const preferencesState = useSelector((state: RootState) => state.preferences);

  const [mainTitle, setmainTitle] = useState("Dashboard");
  //For picking calendar to filter by
  const [isCalendarPickerOpen, setisCalendarPickerOpen] = useState(false);
  //For selecting calendars to assign events
  const [isCalendarSelectionOpen, setisCalendarSelectionOpen] = useState(false);
  const [calendarsSelected, setcalendarsSelected] = useState([]);
  const [newEventId, setnewEventId] = useState(0);
  const [isCreateMenuOpen, setisCreateMenuOpen] = useState(false);
  const [isNewCalendarFormOpen, setisNewCalendarFormOpen] = useState(false);
  const [isNewEventFormOpen, setisNewEventFormOpen] = useState(false);
  const [isNewTaskFormOpen, setisNewTaskFormOpen] = useState(false);
  const [calendarTitle, setcalendarTitle] = useState("Master");

  const routeName = useNavigationState(
    (state) => state.routes[state.index].name
  );

  useEffect(() => {
    if (routeName === "calendar") {
      setmainTitle(calendarTitle);
    } else {
      const newTitle = routeName.charAt(0).toUpperCase() + routeName.slice(1);
      setmainTitle(newTitle);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeName, calendarTitle]);

  const handleCalendarSelectedForFilter = (calendar: any) => {
    handleOpenCalendarPicker();
    setcalendarTitle(calendar.title);
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

  const handleOpenCalendarPicker = async () => {
    setisCalendarPickerOpen(!isCalendarPickerOpen);
  };

  const handleOpenCreateMenu = async () => {
    setisCreateMenuOpen(!isCreateMenuOpen);
  };

  const handleLeftButtonPress = () => {
    if (routeName === "calendar") {
      handleOpenCalendarPicker();
    }
  };

  const handleRightButtonPress = () => {
    handleOpenCreateMenu();
  };

  const handleOpenCreateEventForm = () => {
    setisCreateMenuOpen(false);
    setisNewEventFormOpen(true);
  };

  const handleOpenCreateTaskForm = () => {
    setisCreateMenuOpen(false);
    setisNewTaskFormOpen(true);
  };

  const handleOpenCreateCalendarForm = () => {
    setisCreateMenuOpen(false);
    setisNewCalendarFormOpen(!isNewCalendarFormOpen);
  };

  const handleSubmitCreateEvent = async (event: any) => {
    const eventResult = await createEvent(userState.id, event, "");
    dispatch(
      setPreferences({
        ...preferencesState,
        refreshCalendar: !preferencesState.refreshCalendar,
      })
    );
    setisNewEventFormOpen(false);
    setisCalendarSelectionOpen(true);
    setnewEventId(eventResult.data.id);
  };

  const handleAddAssignmentsForEvent = async () => {
    if (newEventId !== 0) {
      await createEventAssignments(
        userState.id,
        newEventId,
        calendarsSelected.map((calendar: any) => calendar.id),
        ""
      );
      setcalendarsSelected([]);
      setnewEventId(0);
    }
  };

  const handleSubmitCreateTask = async (task: any) => {
    await createTask(userState.id, task, "");
    dispatch(
      setPreferences({
        ...preferencesState,
        refreshCalendar: !preferencesState.refreshCalendar,
      })
    );
    closeAllModals();
  };

  const handleSubmitCreateCalendar = async (form: any) => {
    await createCalendar(userState.id, form.title, form.description, [], "");
    closeAllModals();
  };

  const closeAllModals = () => {
    setisCreateMenuOpen(false);
    setisNewCalendarFormOpen(false);
    setisCalendarPickerOpen(false);
    setisNewEventFormOpen(false);
    setisNewTaskFormOpen(false);
    setisCalendarSelectionOpen(false);
  };

  return (
    <View style={styles.titleContainer}>
      <View style={styles.titleButtonContainerLeft}>
        {routeName === "calendar" ? (
          <TouchableOpacity
            style={styles.titleButton}
            onPress={handleLeftButtonPress}
          >
            <FontAwesome
              size={28}
              name="filter"
              color={THEME.COLORS.secondary}
            />
          </TouchableOpacity>
        ) : (
          <></>
        )}
      </View>
      <Text style={styles.titleText}>{mainTitle}</Text>
      <View style={styles.titleButtonContainerNonCalendar}>
        {routeName ? (
          <TouchableOpacity
            style={styles.titleButton}
            onPress={handleRightButtonPress}
          >
            <FontAwesome size={28} name="plus" color={THEME.COLORS.secondary} />
          </TouchableOpacity>
        ) : (
          <></>
        )}
        {/* <TouchableOpacity style={styles.titleButton} onPress={handleRightButtonPress}>
          <FontAwesome size={28} name="ellipsis-v" color={THEME.COLORS.secondary} />
        </TouchableOpacity> */}
      </View>

      {/* MODAL- Calendar Picker */}
      {/* MODAL- Calendar Filter Modal */}
      <CalendarBrowser
        modalTitle={"Filter By Calendar"}
        closeButtonText={"Close"}
        isVisible={isCalendarPickerOpen}
        isFilter={true}
        handlePress={(calendar: any) => {
          handleCalendarSelectedForFilter(calendar);
        }}
        handleClose={closeAllModals}
      ></CalendarBrowser>
      {/* MODAL- Calendar Assignment Selection */}
      <CalendarBrowser
        modalTitle={"Tap calendars to share this event in"}
        closeButtonText={"Done"}
        isVisible={isCalendarSelectionOpen}
        isFilter={false}
        handlePress={(calendar: any) => {
          handleCalendarSelectedForAssignment(calendar);
        }}
        handleClose={() => {
          handleAddAssignmentsForEvent();
          closeAllModals();
        }}
      ></CalendarBrowser>
      {/* MODAL- Create Modal */}
      <CreateForm
        isModalVisible={isCreateMenuOpen}
        handleCreateEvent={handleOpenCreateEventForm}
        handleCreateTask={handleOpenCreateTaskForm}
        handleCreateCalendar={handleOpenCreateCalendarForm}
        handleCancel={closeAllModals}
      ></CreateForm>
      {/* MODAL- Create Event Modal */}
      <CreateEventForm
        isModalVisible={isNewEventFormOpen}
        handleCreate={handleSubmitCreateEvent}
        handleCancel={closeAllModals}
      ></CreateEventForm>
      <CreateTaskForm
        isModalVisible={isNewTaskFormOpen}
        handleCreate={handleSubmitCreateTask}
        handleCancel={closeAllModals}
      ></CreateTaskForm>
      {/* MODAL- Create Calendar Modal */}
      <CreateCalendarForm
        isModalVisible={isNewCalendarFormOpen}
        handleCreate={handleSubmitCreateCalendar}
        handleCancel={closeAllModals}
      ></CreateCalendarForm>
    </View>
  );
};

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    minWidth: "100%",
    marginBottom: 5,
    marginTop: 5,
  },
  titleButtonContainerLeft: {
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingLeft: 15,
    paddingRight: 15,
    maxWidth: "25%",
    minWidth: "25%",
  },
  titleButtonContainerNonCalendar: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingLeft: 15,
    paddingRight: 15,
    maxWidth: "25%",
    minWidth: "25%",
  },
  titleButtonContainerCalendar: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 15,
    paddingRight: 15,
    maxWidth: "25%",
    minWidth: "25%",
  },
  titleButton: {
    paddingLeft: 5,
    paddingRight: 5,
  },
  titleText: {
    color: THEME.COLORS.fontColor,
    textAlign: "center",
    fontWeight: "600",
    fontSize: THEME.SIZES.large,
    minWidth: "50%",
  },
});

export default TitleBar;
