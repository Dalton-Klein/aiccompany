import { useState, useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
import { useRouter } from "expo-router";
import EventTile from "./event-tile";
import * as THEME from "../../../constants/theme";
import React from "react";

const DayTile = (props) => {
  const router = useRouter();
  const [eventFeed, seteventFeed] = useState([]);

  useEffect(() => {
    generateEventSchedule();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const generateEventSchedule = () => {
    seteventFeed(props.events.map((event: any) => turnEventIntoTile(event)));
  };

  const turnEventIntoTile = (event) => {
    return (
      <View key={event.id}>
        <EventTile {...event}></EventTile>
      </View>
    );
  };

  return (
    <View
      style={styles.dayTile}
      onLayout={(e) => {
        props.onLayout(e);
      }}
    >
      <Text style={styles.dayTitle}>{props.title}</Text>
      {eventFeed}
    </View>
  );
};

const styles = StyleSheet.create({
  dayTile: {
    paddingTop: 5,
    paddingLeft: 10,
    marginBottom: 10,
    minHeight: 60,
  },
  dayTitle: {
    fontSize: THEME.SIZES.medium,
    color: THEME.COLORS.fontColor,
  },
});

export default DayTile;
