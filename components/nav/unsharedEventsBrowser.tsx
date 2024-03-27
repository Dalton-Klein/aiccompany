import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
} from "react-native";
import * as THEME from "../../constants/theme";
import { getAllCalendarsForUser } from "../../app/services/rest";
import CalendarTile from "../tiles/calendar/calendar-tile";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { setPreferences } from "../../store/userPreferencesSlice";
import moment from "moment";
import React from "react";

const UnsharedEventsBrowser = ({
  events,
  isVisible,
  handlePress,
  handleClose,
}) => {
  const dispatch = useDispatch();
  const userState = useSelector((state: RootState) => state.user.user);
  const preferencesState = useSelector((state: RootState) => state.preferences);
  const [eventTiles, seteventTiles] = useState([]);

  useEffect(() => {
    refreshEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible]);

  const refreshEvents = async () => {
    if (events && events.length) {
      convertEventDataIntoTiles(events);
    } else {
      convertEventDataIntoTiles([]);
    }
  };

  const handleEventPressed = (event: any) => {
    handlePress(event.id);
  };

  const convertEventDataIntoTiles = async (events: any) => {
    const eventTilesTemp = events.map((event: any) => (
      <View key={event.id}>
        <TouchableOpacity
          onPress={() => {
            handleEventPressed(event);
          }}
          style={styles.eventTile}
        >
          <Text style={styles.eventTitle}>{event.title}</Text>
          <Text style={styles.eventSubTitle}>
            {moment(event.start_time).format("MMMM Do YYYY, h:mm a")}
          </Text>
        </TouchableOpacity>
      </View>
    ));
    seteventTiles(eventTilesTemp);
  };

  return (
    <Modal animationType="slide" transparent={true} visible={isVisible}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitleText}>Unshared Events </Text>
          <Text style={styles.modalSubTitleText}>
            You might want to add these events to a group calendar to be visible
            by others
          </Text>
          <ScrollView style={styles.scrollView}>{eventTiles}</ScrollView>
          {/* Close Modal Button */}
          <TouchableOpacity
            style={styles.expandCalendarButton}
            onPress={() => {
              handleClose();
            }}
          >
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
    maxHeight: "70%",
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
  scrollView: {
    minWidth: "100%",
    maxHeight: "80%",
    marginBottom: 15,
    paddingLeft: 10,
    paddingRight: 10,
  },
  expandCalendarButton: {
    borderRadius: THEME.BORDERSIZES.large,
    borderColor: THEME.COLORS.darker,
    borderWidth: 2,
  },
  modalTitleText: {
    marginBottom: 15,
    fontWeight: "bold",
    fontSize: THEME.SIZES.medium,
    color: THEME.COLORS.fontColor,
    textAlign: "center",
  },
  modalSubTitleText: {
    marginBottom: 15,
    fontWeight: "300",
    fontSize: THEME.SIZES.medium,
    color: THEME.COLORS.fontColor,
    textAlign: "center",
  },
  buttonText: {
    padding: 10,
    color: THEME.COLORS.fontColor,
  },
  eventTile: {
    padding: 25,
    marginBottom: 10,
    minHeight: 60,
    borderRadius: THEME.BORDERSIZES.medium,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: THEME.COLORS.primary,
  },
  eventTitle: {
    fontSize: THEME.SIZES.large,
    color: THEME.COLORS.lighter,
    fontWeight: "700",
  },
  eventSubTitle: {
    fontSize: THEME.SIZES.small,
    fontWeight: "300",
    color: THEME.COLORS.lighter,
  },
});

export default UnsharedEventsBrowser;
