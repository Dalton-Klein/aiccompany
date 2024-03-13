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
  getAllCalendarsForUser,
} from "../../app/services/rest";
import CalendarTile from "../tiles/calendar/calendar-tile";
import BasicBtn from "../tiles/buttons/basicButton";
import CreateCalendarForm from "../forms/createCalendarForm";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import CreateEventForm from "../forms/createEventForm";
import CreateForm from "../forms/createForm";

const TitleBar = (props: any) => {
  const userState = useSelector((state: RootState) => state.user.user);
  const [mainTitle, setmainTitle] = useState("Dashboard");
  const [isCalendarPickerOpen, setisCalendarPickerOpen] = useState(false);
  const [isCreateMenuOpen, setisCreateMenuOpen] = useState(false);
  const [isNewCalendarFormOpen, setisNewCalendarFormOpen] = useState(false);
  const [isNewEventFormOpen, setisNewEventFormOpen] = useState(false);
  const [calendarTiles, setcalendarTiles] = useState([]);
  const [calendarTitle, setcalendarTitle] = useState("Master");

  const routeName = useNavigationState(
    (state) => state.routes[state.index].name
  );

  useEffect(() => {
    if (isCalendarPickerOpen) {
      refreshCalendars();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCalendarPickerOpen]);

  useEffect(() => {
    if (routeName === "calendar") {
      setmainTitle(calendarTitle);
    } else {
      const newTitle = routeName.charAt(0).toUpperCase() + routeName.slice(1);
      setmainTitle(newTitle);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeName, calendarTitle]);

  const refreshCalendars = async () => {
    const results = await getAllCalendarsForUser(1, "");
    if (results.status === "success" && results.data.length) {
      covertCalendarDataIntoTiles(results.data);
    } else {
      covertCalendarDataIntoTiles([]);
    }
  };

  const covertCalendarDataIntoTiles = async (calendars: any) => {
    const memberCalendars = calendars.map((calendar) => (
      <View key={calendar.id}>
        <CalendarTile {...calendar} closeModal={closeModal}></CalendarTile>
      </View>
    ));
    const defaultCalendar = {
      title: "Master",
      member_count: 0,
      id: 0,
    };
    const defaultCalendarTile = [
      <View key={0}>
        <CalendarTile
          {...defaultCalendar}
          closeModal={closeModal}
        ></CalendarTile>
      </View>,
    ];
    setcalendarTiles(defaultCalendarTile.concat(memberCalendars));
  };

  const closeModal = (calendar: any) => {
    handleOpenCalendarPicker();
    setcalendarTitle(calendar.title);
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

  const handleOpenCreateCalendarForm = () => {
    setisCreateMenuOpen(false);
    setisNewCalendarFormOpen(!isNewCalendarFormOpen);
  };

  const handleSubmitCreateEvent = async (event: any) => {
    console.log("creating event: ", event);
    const result = await createEvent(userState.id, event, "");
    console.log("result: ", result);
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
      <Modal
        animationType="slide"
        transparent={true}
        visible={isCalendarPickerOpen}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitleText}>Filter By Calendar</Text>
            <View style={styles.modalGrid}>{calendarTiles}</View>
            {/* Close Modal Button */}
            <TouchableOpacity
              style={styles.expandCalendarButton}
              onPress={handleOpenCalendarPicker}
            >
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* MODAL- Create Modal */}
      <CreateForm
        isModalVisible={isCreateMenuOpen}
        handleCreateEvent={handleOpenCreateEventForm}
        handleCreateCalendar={handleOpenCreateCalendarForm}
        handleCancel={closeAllModals}
      ></CreateForm>
      {/* MODAL- Create Event Modal */}
      <CreateEventForm
        isModalVisible={isNewEventFormOpen}
        handleCreate={handleSubmitCreateEvent}
        handleCancel={closeAllModals}
      ></CreateEventForm>
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
    color: THEME.COLORS.lighter,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: THEME.SIZES.large,
    minWidth: "50%",
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
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalGrid: {
    minWidth: "100%",
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-around",
    flexWrap: "wrap",
  },
  expandCalendarButton: {
    borderRadius: THEME.BORDERSIZES.large,
    borderColor: "black",
    borderWidth: 2,
  },
  modalTitleText: {
    marginBottom: 15,
    fontWeight: "bold",
    fontSize: THEME.SIZES.medium,
  },
  buttonText: {
    padding: 10,
  },
});

export default TitleBar;
