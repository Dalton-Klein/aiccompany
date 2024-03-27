import { useState, useEffect } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import moment from "moment";
import * as THEME from "../../../constants/theme";
import React from "react";

const TaskTile = (props) => {
  const router = useRouter();
  const [eventStartTime, seteventStartTime] = useState("");
  const [eventEndTime, seteventEndTime] = useState("");
  const [isTask, setisTask] = useState(false);
  const [isCancelled, setisCancelled] = useState(false);

  useEffect(() => {
    setTileData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setTileData = () => {
    setisCancelled(props.is_cancelled);
    setisTask(props.is_task);
    seteventStartTime(moment(props.start_time).format("h:mm A"));
    let formattedDifference = moment
      .duration(moment(props.end_time).diff(moment(props.start_time)))
      .humanize();
    //Instead of "an hour" conver to "1 hour"
    if (formattedDifference.slice(0, 2) === "an") {
      formattedDifference = `1 ${formattedDifference.slice(2, 1000)}`;
    }
    seteventEndTime(
      props.is_task ? `${props.task_duration} minutes` : formattedDifference
    );
  };

  const handleEventPressed = () => {
    router.navigate(`/event-manager/${props.id}`);
  };

  return (
    <TouchableOpacity
      style={
        isTask
          ? [styles.eventTile, styles.taskColor]
          : [styles.eventTile, styles.eventColor]
      }
      onPress={handleEventPressed}
    >
      <View>
        <Text style={styles.eventStartTime}>{eventStartTime}</Text>
        <Text style={styles.eventStartTime}>{eventEndTime}</Text>
      </View>
      <View style={styles.eventDetails}>
        <Text
          style={
            isCancelled
              ? [styles.eventTitle, styles.strikeText]
              : styles.eventTitle
          }
        >
          {isCancelled ? `Cancelled: ${props.title}` : props.title}
        </Text>
        <Text
          style={
            isCancelled
              ? [styles.eventNotes, styles.strikeText]
              : styles.eventNotes
          }
        >
          {props.notes}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  strikeText: {
    textDecorationLine: "line-through",
  },
  eventTile: {
    marginTop: 10,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 25,
    marginRight: 10,
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
});

export default TaskTile;
