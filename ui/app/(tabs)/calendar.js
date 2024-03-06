import { useState, useEffect } from "react";
import { ScrollView, SafeAreaView, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { getAllEventsForUser } from "../services/rest";
import * as calendarService from "../services/date-logic/calendar-logic"
import DayTile from "../../components/tiles/calendar/day-tile";
import moment from 'moment';
import * as THEME from "../../constants/theme";
import WeeklyPicker from "../../components/nav/weekly-picker";
import TitleBar from "../../components/nav/tab-titlebar";

const Calendar = () => {
  const router = useRouter();
  const [selectedDate, setselectedDate] = useState(moment().format('YYYY/MM/DD'));
  const [dateHeaders, setdateHeaders] = useState([]);
  const [calendarFeed, setcalendarFeed] = useState([]);

  useEffect(() => {
    setselectedDate(selectedDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    generateMasterSchedule(selectedDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  const refreshSchedule = (date) => {
    setselectedDate(date);
  }

  // Creates master data array of days with events nested
  const generateMasterSchedule = async() => {
    const dateHeadings = calendarService.generateDateHeadings(selectedDate);
    console.log('new headings: ', dateHeadings)
    const eventResult = await grabEvents();
    let events;
    if (eventResult.data.length) {
      events = eventResult.data;
    }
    //Loop over date headings
    dateHeadings.forEach(dateHeading => {
      //Loop over events to pop events into day block
      events.forEach(event => {
        if (dateHeading.date.isSame(moment(event.start_time), 'day')) {
          dateHeading.events.push(event);
        }
      });
    });
    setdateHeaders(dateHeadings)
    generateDayTiles(dateHeadings);
  }

  const grabEvents = async () => {
    const result = await getAllEventsForUser(1, '');
    return result
  }

  

  const generateDayTiles = (dateHeadings) => {
    setcalendarFeed(
      dateHeadings.map(
        dateHeading => (
          <DayTile {...dateHeading} key={dateHeading.title}></DayTile>
        )
      )
    );
  }


  return (
    <SafeAreaView style={styles.calendarContainer}>
      <TitleBar title='Calendar'></TitleBar>
      <WeeklyPicker updateCalendarFeed={refreshSchedule} dateHeaders={dateHeaders}></WeeklyPicker>
      <ScrollView>
        {calendarFeed}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  calendarContainer: {
    paddingTop: 5,
    flex: 1,
    backgroundColor: THEME.COLORS.darker,
  },


});

export default Calendar;
