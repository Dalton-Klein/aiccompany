import { useState, useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
import { useRouter } from "expo-router";
import moment from 'moment';
import * as THEME from "../../../constants/theme";

const EventTile = (props) => {
  const router = useRouter();
  const [eventStartTime, seteventStartTime] = useState([]);

  useEffect(() => {
    setTileData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setTileData = () => {
    seteventStartTime(moment(props.start_time).format("h:mm A"));
  }

  return (
      <View style={styles.eventTile}>
        <Text style={styles.eventStartTime}>{eventStartTime}</Text>
        <View style={styles.eventDetails}>
          <Text style={styles.eventTitle}>{props.title}</Text>
          <Text style={styles.eventNotes}>{props.notes}</Text>
        </View>
      </View>
  );
};

const styles = StyleSheet.create({
  eventTile: {
    paddingTop: 15,
    paddingLeft: 25,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  eventDetails: {
    marginLeft: 35
  },
  eventTitle: {
    fontSize: THEME.SIZES.large,
    color: THEME.COLORS.lighter,
    fontWeight: 'bold',
  },
  eventNotes: {
    fontSize: THEME.SIZES.medium,
    color: THEME.COLORS.lighter,
  },
  eventStartTime: {
    fontSize: THEME.SIZES.medium,
    color: THEME.COLORS.lighter,
  },

});

export default EventTile;
