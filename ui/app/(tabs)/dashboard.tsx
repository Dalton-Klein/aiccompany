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
import AddFriendForm from "../../components/forms/addFriendForm";
import moment from "moment";

const Dashboard = () => {
  const routeName = useNavigationState(
    (state) => state.routes[state.index].name
  );
  const userState = useSelector((state: RootState) => state.user.user);
  const router = useRouter();

  const [eventCount, seteventCount] = useState(0);
  const [unsharedEventCount, setunsharedEventCount] = useState(0);
  const [taskCount, settaskCount] = useState(0);
  const [overdueTaskCount, setoverdueTaskCount] = useState(0);
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
    if (data && data.status === "success" && data.data) {
      seteventCount(
        data.data.eventsThisWeek?.length
          ? data.data.eventsThisWeek?.filter((event: any) => !event.is_task)
              .length
          : 0
      );
      setunsharedEventCount(
        data.data.eventsAll?.length
          ? data.data.eventsAll?.filter(
              (event: any) => !event.is_task && !event.calendar_id
            ).length
          : 0
      );
      settaskCount(
        data.data.eventsAll?.length
          ? data.data.eventsAll?.filter(
              (event: any) => event.is_task && moment().isBefore(event.end_time)
            ).length
          : 0
      );
      setoverdueTaskCount(
        data.data.eventsAll?.length
          ? data.data.eventsAll?.filter(
              (event: any) => event.is_task && moment().isAfter(event.end_time)
            ).length
          : 0
      );
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
        <Text style={styles.headingText}>Events</Text>
        <View style={styles.widgetContainer}>
          <MetricTile
            isTask={false}
            titleText={"Events this week"}
            amount={eventCount}
            handlePress={() => {}}
          ></MetricTile>
          <MetricTile
            isTask={false}
            titleText={"Unshared Events"}
            amount={unsharedEventCount}
            handlePress={() => {}}
          ></MetricTile>
        </View>
        <Text style={styles.headingText}>Tasks</Text>
        <View style={styles.widgetContainer}>
          <MetricTile
            isTask={true}
            titleText={"Active Tasks"}
            amount={taskCount}
            handlePress={() => {}}
          ></MetricTile>
          <MetricTile
            isTask={true}
            titleText={"Overdue Tasks"}
            amount={overdueTaskCount}
            handlePress={() => {}}
          ></MetricTile>
        </View>
        <Text style={styles.headingText}>Social</Text>
        <AddFriendForm></AddFriendForm>
        <View style={styles.widgetContainer}>
          <MetricTile
            isTask={false}
            titleText={"Friend Requests"}
            amount={friendInviteCount}
            handlePress={() => {}}
          ></MetricTile>
          <MetricTile
            isTask={false}
            titleText={"Friends"}
            amount={friendCount}
            handlePress={() => {}}
          ></MetricTile>
        </View>
        <Text style={styles.headingText}>Calendars</Text>
        <View style={styles.widgetContainer}>
          <MetricTile
            isTask={false}
            titleText={"Calendar Invites"}
            amount={calendarInviteCount}
            handlePress={() => {}}
          ></MetricTile>
          <MetricTile
            isTask={false}
            titleText={"Group Calendars"}
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
    backgroundColor: THEME.COLORS.lighter,
  },
  headingText: {
    fontWeight: "600",
    color: THEME.COLORS.fontColor,
    marginLeft: 25,
    marginTop: 25,
    fontSize: THEME.SIZES.medium,
    // textAlign: "center",
  },
  widgetContainer: {
    marginTop: 15,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
  },
});

export default Dashboard;
