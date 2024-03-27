import { View, TouchableOpacity, Text, StyleSheet, Modal } from "react-native";
import * as THEME from "../../constants/theme";
import { getAllCalendarsForUser } from "../../app/services/rest";
import CalendarTile from "../tiles/calendar/calendar-tile";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { setPreferences } from "../../store/userPreferencesSlice";
import React from "react";

const CalendarBrowser = ({
  modalTitle,
  closeButtonText,
  isVisible,
  isFilter,
  handlePress,
  handleClose,
}) => {
  const dispatch = useDispatch();
  const userState = useSelector((state: RootState) => state.user.user);
  const preferencesState = useSelector((state: RootState) => state.preferences);
  const [calendarTiles, setcalendarTiles] = useState([]);

  useEffect(() => {
    refreshCalendars();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible]);

  const refreshCalendars = async () => {
    const results = await getAllCalendarsForUser(userState.id, "");
    if (
      results &&
      results.status &&
      results.status === "success" &&
      results.data.length
    ) {
      covertCalendarDataIntoTiles(results.data);
    } else {
      covertCalendarDataIntoTiles([]);
    }
  };

  const handleCalendarPressed = (calendar: any) => {
    handlePress(calendar);
    if (isFilter) {
      dispatch(
        setPreferences({
          ...preferencesState,
          selectedCalendar: calendar,
        })
      );
    }
  };

  const covertCalendarDataIntoTiles = async (calendars: any) => {
    const memberCalendars = calendars.map((calendar: any) => (
      <View key={calendar.id}>
        <CalendarTile
          calendar={calendar}
          handlePress={handleCalendarPressed}
        ></CalendarTile>
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
          calendar={defaultCalendar}
          handlePress={(calendar: any) => {
            handleCalendarPressed(calendar);
          }}
        ></CalendarTile>
      </View>,
    ];
    if (isFilter) {
      setcalendarTiles(defaultCalendarTile.concat(memberCalendars));
    } else {
      setcalendarTiles(memberCalendars);
    }
  };

  return (
    <Modal animationType="slide" transparent={true} visible={isVisible}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitleText}>{modalTitle}</Text>
          <View style={styles.modalGrid}>
            {calendarTiles.length ? (
              calendarTiles
            ) : (
              <Text style={styles.noCalendarsText}>
                You are not part of any group calendars yet. Create one to get
                started!
              </Text>
            )}
          </View>
          {/* Close Modal Button */}
          <TouchableOpacity
            style={styles.expandCalendarButton}
            onPress={() => {
              handleClose();
            }}
          >
            <Text style={styles.buttonText}>{closeButtonText}</Text>
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
    borderColor: THEME.COLORS.darker,
    borderWidth: 2,
  },
  modalTitleText: {
    marginBottom: 15,
    fontWeight: "bold",
    fontSize: THEME.SIZES.medium,
    color: THEME.COLORS.fontColor,
  },
  buttonText: {
    padding: 10,
    color: THEME.COLORS.fontColor,
  },
  noCalendarsText: {
    marginBottom: 10,
    marginTop: 10,
    fontSize: THEME.SIZES.medium,
    fontWeight: "300",
    textAlign: "center",
  },
});

export default CalendarBrowser;
