import { useEffect, useState } from "react";
import { View, SafeAreaView, Text, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import * as THEME from "../../constants/theme";
import TitleBar from "../../components/nav/tab-titlebar";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import MetricTile from "../../components/widgets/metric-widget";
import { useNavigationState } from "@react-navigation/native";
import { getMetricData } from "../services/rest";

const Dashboard = () => {
  const routeName = useNavigationState(
    (state) => state.routes[state.index].name
  );
  const userState = useSelector((state: RootState) => state.user.user);
  const router = useRouter();

  const [eventCount, seteventCount] = useState(0);
  const [friendCount, setfriendCount] = useState(0);
  const [friendInviteCount, setfriendInviteCount] = useState(0);
  const [calendarInviteCount, setcalendarInviteCount] = useState(0);
  const [calendarCount, setcalendarCount] = useState(0);
  useEffect(() => {
    refreshMetricTiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeName]);

  const refreshMetricTiles = async () => {
    const data = await getMetricData(userState.id, userState.token);
    console.log("data ", data);
    if (data && data.status === "success" && data.data) {
      seteventCount(data.data.events?.length ? data.data.events?.length : 0);
      setfriendCount(data.data.friends?.length ? data.data.friends?.length : 0);
      setfriendInviteCount(
        data.data.friendInviteCount?.length
          ? data.data.friendInviteCount?.length
          : 0
      );
      setcalendarInviteCount(
        data.data.calendarInvites?.length
          ? data.data.calendarInvites?.length
          : 0
      );
      setcalendarCount(
        data.data.calendars?.length ? data.data.calendars?.length : 0
      );
    }
  };

  return (
    <SafeAreaView style={styles.masterContainer}>
      <TitleBar title="Dashboard"></TitleBar>
      <ScrollView>
        <View style={styles.widgetContainer}>
          <MetricTile
            titleText={"Events this week"}
            amount={eventCount}
            handlePress={() => {}}
          ></MetricTile>
          <MetricTile
            titleText={"Active Tasks"}
            amount={0}
            handlePress={() => {}}
          ></MetricTile>
          <MetricTile
            titleText={"Friend Requests"}
            amount={friendInviteCount}
            handlePress={() => {}}
          ></MetricTile>
          <MetricTile
            titleText={"Friends"}
            amount={friendCount}
            handlePress={() => {}}
          ></MetricTile>
          <MetricTile
            titleText={"Calendar Invites"}
            amount={calendarInviteCount}
            handlePress={() => {}}
          ></MetricTile>
          <MetricTile
            titleText={"Owned Calendars"}
            amount={calendarCount}
            handlePress={() => {}}
          ></MetricTile>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  masterContainer: {
    flex: 1,
    backgroundColor: THEME.COLORS.darker,
  },
  titleText: {
    color: THEME.COLORS.lighter,
  },
  widgetContainer: {
    marginTop: 15,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
  },
});

export default Dashboard;
