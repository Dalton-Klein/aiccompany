import { useState, useEffect } from "react";
import {
  ScrollView,
  SafeAreaView,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
} from "react-native";
import { router } from "expo-router";
import { getAllEventsForUser } from "../services/rest";
import * as calendarService from "../services/date-logic/calendar-logic";
import DayTile from "../../components/tiles/calendar/day-tile";
import moment from "moment";
import * as THEME from "../../constants/theme";
import WeeklyPicker from "../../components/nav/weekly-picker";
import TitleBar from "../../components/nav/tab-titlebar";
import { useDispatch, useSelector } from "react-redux";
import { RootState, persistor } from "../../store/store";
import { useNavigationState } from "@react-navigation/native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import React, { useRef } from "react";
import { updateUserThunk } from "../../store/userSlice";

const Calendar = () => {
  const dispatch = useDispatch();
  const routeName = useNavigationState(
    (state) => state.routes[state.index].name
  );
  const userState = useSelector(
    (state: RootState) => state.user.user
  );
  const preferencesState = useSelector(
    (state: RootState) => state.preferences
  );
  const scrollViewRef = useRef(null);
  const dayTilePositionsRef = useRef({});

  //Refresh Page Variables
  const [lastRefreshTime, setlastRefreshTime] =
    useState<any>(null);
  const [isRefreshing, setisRefreshing] =
    useState<any>(null);

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

  useEffect(() => {
    if (routeName === "calendar") {
      generateMasterSchedule(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeName]);

  //This function will clear a bad cache of state
  const clearReduxPersistCache = async () => {
    await persistor.purge();
  };

  useEffect(() => {
    generateMasterSchedule(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  useEffect(() => {
    if (
      preferencesState &&
      preferencesState.selectedCalendar
    ) {
      generateMasterSchedule();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    preferencesState.selectedCalendar,
    preferencesState.refreshCalendar,
  ]);

  useEffect(() => {
    if (
      preferencesState &&
      preferencesState.selectedDate &&
      preferencesState.selectedDate !== ""
    ) {
      setselectedDate(preferencesState.selectedDate);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preferencesState.selectedDate]);

  const resetIsRefreshing = async () => {
    setTimeout(() => {
      // After refreshing, set isRefreshing back to false
      setisRefreshing(false);
    }, 2000);
  };
  const handleScroll = (event: any) => {
    const { contentOffset } = event.nativeEvent;
    const isScrolledToTop = contentOffset.y <= 0;
    if (isScrolledToTop) {
      generateMasterSchedule();
    }
  };

  const refreshSchedule = (date: any) => {
    setselectedDate(date);
  };

  // Creates master data array of days with events nested
  const generateMasterSchedule = async (
    isForceRefresh = false
  ) => {
    const currentTime = new Date().getTime();
    if (
      isForceRefresh ||
      (!isRefreshing &&
        (!lastRefreshTime ||
          currentTime - lastRefreshTime > 1000))
    ) {
      setlastRefreshTime(currentTime);
      setisRefreshing(true);
      setdateHeaders([]);
      setcalendarFeed([]);
      const dateHeadings =
        calendarService.generateDateHeadings(selectedDate);
      const eventResult = await grabEvents();
      let events = [];
      if (eventResult?.data.length) {
        events = eventResult.data;
      }
      if (
        preferencesState.selectedCalendar &&
        preferencesState.selectedCalendar.id !== 0
      ) {
        //Conditionally filter to a specific calendar
        events = events.filter((e: any) => {
          return (
            e.calendar_id ===
            preferencesState.selectedCalendar.id
          );
        });
      }

      let tasks = events.filter(
        (event) => event.is_task && !event.is_completed
      );
      //Loop over the date headings
      dateHeadings.forEach((dateHeading) => {
        let tasksWithPotentialToday = [...tasks];
        // Do no add any tasks if the user has selected to not show them in calendar view
        if (!userState.show_tasks) {
          tasksWithPotentialToday = [];
        }
        // Do no add any tasks if user is looking in a future week, we only slot them into current week
        const startDateOfCurrentWeek =
          moment().startOf("week");
        if (
          moment(dateHeading.date)
            .startOf("week")
            .isAfter(startDateOfCurrentWeek, "day")
        ) {
          tasksWithPotentialToday = [];
        }
        //Find events for this date heding
        const eventsForDay = events.filter(
          (event) =>
            dateHeading.date.isSame(
              moment(event.start_time),
              "day"
            ) && !event.is_task
        );
        //Check if date heading is in future or past to be able to slot tasks in
        if (
          moment(dateHeading.date).isSameOrAfter(
            moment(currentTime),
            "day"
          )
        ) {
          const openTimeSlots =
            calendarService.findOpenTimeSlots(eventsForDay);
          // Slot in tasks by looping over them
          let tasksThatWeveFoundOpenTimeForToday = [];
          tasksWithPotentialToday.forEach((task) => {
            // Check if the task has already been assigned
            if (task.is_assigned) {
              return;
            }
            const taskDurationMinutes = moment
              .duration(task.task_duration, "minutes")
              .asMilliseconds();

            // Iterate over the open time slots until the task is assigned or no more slots are available
            let assigned = false;
            for (let i = 0; i < openTimeSlots.length; i++) {
              const slot = openTimeSlots[i];
              const breakDurationMilliseconds = moment(
                slot.break_end
              ).diff(moment(slot.break_start));
              if (
                breakDurationMilliseconds >=
                taskDurationMinutes
              ) {
                // Assign the task to this time slot
                const startTime = slot.break_start;
                task.start_time = new Date(startTime);
                task.end_time = new Date(
                  startTime + taskDurationMinutes
                );

                // Update the time slot if there is remaining time after the task
                if (
                  breakDurationMilliseconds >
                  taskDurationMinutes
                ) {
                  const newBreakStart = moment(startTime)
                    .add(
                      taskDurationMinutes,
                      "milliseconds"
                    )
                    .toISOString();
                  openTimeSlots[i] = {
                    break_start: newBreakStart,
                    break_end: slot.break_end,
                  };
                } else {
                  // Remove the slot if it's fully used by the task
                  openTimeSlots.splice(i, 1);
                }

                assigned = true;
                task.is_assigned = true;
                tasksThatWeveFoundOpenTimeForToday.push(
                  task
                );
                break;
              }
            }

            // If the task couldn't be assigned to any open slot, break the loop
            if (!assigned) {
              return;
            }
          });

          // Merge tasks with non-task events
          const allEventsForDay = [
            ...eventsForDay,
            ...tasksThatWeveFoundOpenTimeForToday,
          ];
          // Resort events and tasks so they show in order
          allEventsForDay.sort((a, b) => {
            const startTimeA = moment(
              a.start_time
            ).valueOf();
            const startTimeB = moment(
              b.start_time
            ).valueOf();
            return startTimeA - startTimeB;
          });
          dateHeading.events.push(...allEventsForDay);
        } else {
          //Loop over events to pop events into day block
          eventsForDay.forEach((event) => {
            dateHeading.events.push(event);
          });
        }
      });
      generateDayTiles(dateHeadings);
      resetIsRefreshing();
    }
  };

  const grabEvents = async () => {
    const result = await getAllEventsForUser(
      userState.id,
      ""
    );
    return result;
  };

  const generateDayTiles = (dateHeadings: any) => {
    setcalendarFeed(
      dateHeadings.map((dateHeading: any, index: any) => (
        <DayTile
          {...dateHeading}
          key={dateHeading.title}
          onLayout={(event: any) => {
            const layout = event.nativeEvent.layout;
            dayTilePositionsRef.current[dateHeading.title] =
              layout.y;
          }}
        ></DayTile>
      ))
    );
    setdateHeaders(dateHeadings);
  };

  const scrollToDayTile = (desiredDate: any) => {
    if (desiredDate) {
      const formattedDesiredDate = moment(
        desiredDate,
        "YYYY-DD-MM"
      ).format("MMM D dddd");
      const yPosition =
        dayTilePositionsRef.current[formattedDesiredDate];
      if (yPosition !== undefined) {
        scrollViewRef.current.scrollTo({
          y: yPosition,
          animated: true,
        });
      }
    }
  };

  return (
    <SafeAreaView style={styles.calendarContainer}>
      <TitleBar title="Calendar"></TitleBar>
      <WeeklyPicker
        dateHeaders={dateHeaders}
        parentSelectedDate={selectedDate}
        scrollToDay={scrollToDayTile}
      ></WeeklyPicker>
      <ScrollView
        onScroll={handleScroll}
        scrollEventThrottle={16}
        keyboardShouldPersistTaps="always"
        ref={scrollViewRef}
      >
        {calendarFeed}
        {calendarFeed.length ? (
          <View style={styles.weeklyQuickNavBox}>
            <TouchableOpacity
              style={styles.weeklyQuickNavButton}
              onPress={() => {
                setselectedDate(
                  moment(selectedDate, "YYYY/MM/DD")
                    .subtract(1, "weeks")
                    .format("YYYY/MM/DD")
                );
              }}
            >
              <FontAwesome
                size={28}
                name="angle-left"
                color={THEME.COLORS.lighter}
                style={styles.weeklyQuickNavIcon}
              />
              <Text style={styles.weeklyQuickNavText}>
                Back One Week
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.weeklyQuickNavButton}
              onPress={() => {
                setselectedDate(
                  moment(selectedDate, "YYYY/MM/DD")
                    .add(1, "weeks")
                    .format("YYYY/MM/DD")
                );
              }}
            >
              <Text style={styles.weeklyQuickNavText}>
                Forward One Week
              </Text>
              <FontAwesome
                size={28}
                name="angle-right"
                color={THEME.COLORS.lighter}
                style={styles.weeklyQuickNavIcon}
              />
            </TouchableOpacity>
          </View>
        ) : (
          <></>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  calendarContainer: {
    paddingTop: 5,
    flex: 1,
    backgroundColor: THEME.COLORS.lighter,
  },
  weeklyQuickNavBox: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 25,
  },
  weeklyQuickNavButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: THEME.COLORS.neutral,
    borderRadius: THEME.BORDERSIZES.large,
  },
  weeklyQuickNavIcon: {
    marginLeft: 10,
    marginRight: 10,
  },
  weeklyQuickNavText: {
    color: THEME.COLORS.lighter,
    fontWeight: "400",
  },
});

export default Calendar;
