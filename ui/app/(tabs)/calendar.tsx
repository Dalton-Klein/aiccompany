import { useState, useEffect } from "react";
import { ScrollView, SafeAreaView, StyleSheet } from "react-native";
import { router } from "expo-router";
import { getAllEventsForUser } from "../services/rest";
import * as calendarService from "../services/date-logic/calendar-logic";
import DayTile from "../../components/tiles/calendar/day-tile";
import moment from "moment";
import * as THEME from "../../constants/theme";
import WeeklyPicker from "../../components/nav/weekly-picker";
import TitleBar from "../../components/nav/tab-titlebar";
import { useSelector } from "react-redux";
import { RootState, persistor } from "../../store/store";

const Calendar = () => {
  const userState = useSelector((state: RootState) => state.user.user);
  const preferencesState = useSelector((state: RootState) => state.preferences);
  const [selectedDate, setselectedDate] = useState(
    moment().format("YYYY/MM/DD")
  );
  const [dateHeaders, setdateHeaders] = useState([]);
  const [calendarFeed, setcalendarFeed] = useState([]);

  useEffect(() => {
    // clearReduxPersistCache();
    if (!userState.id || userState.id < 1) {
      router.navigate("auth/authentication");
    }
    setselectedDate(selectedDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //This function will clear a bad cache of state
  const clearReduxPersistCache = async () => {
    await persistor.purge();
  };

  useEffect(() => {
    generateMasterSchedule();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  useEffect(() => {
    if (preferencesState && preferencesState.selectedCalendar) {
      generateMasterSchedule();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preferencesState.selectedCalendar, preferencesState.refreshCalendar]);

  const refreshSchedule = (date: any) => {
    setselectedDate(date);
  };

  // Creates master data array of days with events nested
  const generateMasterSchedule = async () => {
    setdateHeaders([]);
    setcalendarFeed([]);
    const dateHeadings = calendarService.generateDateHeadings(selectedDate);
    const eventResult = await grabEvents();
    let events = [];
    if (eventResult?.data.length) {
      events = eventResult.data;
    }
    if (
      preferencesState.selectedCalendar &&
      preferencesState.selectedCalendar.id !== 0
    ) {
      events = events.filter((e: any) => {
        return e.calendar_id === preferencesState.selectedCalendar.id;
      });
    }
    //Loop over date headings
    dateHeadings.forEach((dateHeading) => {
      //Loop over events to pop events into day block
      events.forEach((event) => {
        if (dateHeading.date.isSame(moment(event.start_time), "day")) {
          dateHeading.events.push(event);
        }
      });
    });
    setdateHeaders(dateHeadings);
    generateDayTiles(dateHeadings);
  };

  const grabEvents = async () => {
    const result = await getAllEventsForUser(userState.id, "");
    return result;
  };

  const generateDayTiles = (dateHeadings) => {
    setcalendarFeed(
      dateHeadings.map((dateHeading) => (
        <DayTile {...dateHeading} key={dateHeading.title}></DayTile>
      ))
    );
  };

  return (
    <SafeAreaView style={styles.calendarContainer}>
      <TitleBar title="Calendar"></TitleBar>
      <WeeklyPicker
        updateCalendarFeed={refreshSchedule}
        dateHeaders={dateHeaders}
      ></WeeklyPicker>
      <ScrollView>{calendarFeed}</ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  calendarContainer: {
    paddingTop: 5,
    flex: 1,
    backgroundColor: THEME.COLORS.lighter,
  },
});

export default Calendar;
