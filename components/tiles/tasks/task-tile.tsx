import { useState, useEffect } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import moment from "moment";
import * as THEME from "../../../constants/theme";
import React from "react";
import { Entypo, FontAwesome6 } from "@expo/vector-icons";
import { updateEventsData } from "../../../app/services/rest";
import { useDispatch, useSelector } from "react-redux";
import { setPreferences } from "../../../store/userPreferencesSlice";
import { RootState } from "../../../store/store";

const TaskTile = (props: any) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const preferencesState = useSelector((state: RootState) => state.preferences);

  const [taskDuration, settaskDuration] = useState("");
  const [taskEndTime, settaskEndTime] = useState("");
  const [isCancelled, setisCancelled] = useState(false);
  const [isCompleted, setisCompleted] = useState(false);

  useEffect(() => {
    setTileData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setTileData = () => {
    setisCancelled(props.task.is_cancelled);
    setisCompleted(props.task.is_completed);
    settaskDuration(props.task.task_duration);
    settaskEndTime(moment(props.task.end_time).format("MMMM Do YYYY, h:mm a"));
  };

  const handleEventPressed = () => {
    router.navigate(`/event-manager/${props.task.id}`);
  };

  const handleToggleTaskCompleted = async () => {
    await updateEventsData(
      props.task.id,
      [{ field: "is_completed", value: !isCompleted }],
      ""
    );
    dispatch(
      setPreferences({
        ...preferencesState,
        refreshTaskView: !preferencesState.refreshTaskView,
      })
    );
  };

  return (
    <TouchableOpacity
      style={[styles.eventTile, styles.taskColor]}
      onPress={handleEventPressed}
    >
      <View style={styles.taskBox}>
        <View style={styles.eventDetails}>
          <Text
            style={
              isCancelled
                ? [styles.eventTitle, styles.strikeText]
                : styles.eventTitle
            }
          >
            {isCancelled ? `Cancelled: ${props.task.title}` : props.task.title}
          </Text>
          <Text
            style={
              isCancelled
                ? [styles.eventNotes, styles.strikeText]
                : styles.eventNotes
            }
          >
            {props.task.notes}
          </Text>
          <Text style={styles.eventStartTime}>
            Duration: {taskDuration} minutes
          </Text>
          <Text style={styles.eventStartTime}>Deadline: {taskEndTime}</Text>
        </View>
        <TouchableOpacity
          style={styles.taskCompletionBtn}
          onPress={handleToggleTaskCompleted}
        >
          {isCompleted ? (
            <FontAwesome6
              name="circle-check"
              size={28}
              color={THEME.COLORS.lighter}
            />
          ) : (
            <Entypo name="circle" size={28} color={THEME.COLORS.lighter} />
          )}
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  strikeText: {
    textDecorationLine: "line-through",
  },
  eventTile: {
    marginTop: 15,
    marginRight: 10,
    marginLeft: 10,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 5,
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    borderRadius: THEME.BORDERSIZES.large,
    shadowColor: THEME.COLORS.darker,
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 2,
  },
  taskBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minWidth: "85%",
  },
  eventColor: {
    backgroundColor: THEME.COLORS.primary,
  },
  taskColor: {
    backgroundColor: THEME.COLORS.secondary,
  },
  eventDetails: {
    marginLeft: 35,
  },
  eventTitle: {
    fontSize: THEME.SIZES.large,
    color: THEME.COLORS.lighter,
    fontWeight: "bold",
  },
  eventNotes: {
    fontSize: THEME.SIZES.medium,
    fontWeight: "200",
    color: THEME.COLORS.lighter,
  },
  eventStartTime: {
    fontSize: THEME.SIZES.medium,
    color: THEME.COLORS.lighter,
  },
  taskCompletionBtn: {
    marginBottom: 10,
  },
});

export default TaskTile;
