import { useEffect, useRef, useState } from "react";
import { View, SafeAreaView, Text, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import * as THEME from "../../constants/theme";
import TitleBar from "../../components/nav/tab-titlebar";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import MetricTile from "../../components/widgets/metric-widget";
import { useNavigationState } from "@react-navigation/native";
import { getMetricData } from "../services/rest";
import AddFriendForm from "../../components/forms/addFriendForm";
import moment from "moment";
import RequestsForm from "../../components/forms/requestsForm";
import CalendarBrowser from "../../components/nav/calendarBrowser";
import FriendBrowser from "../../components/nav/friendBrowser";
import { setPreferences } from "../../store/userPreferencesSlice";

const Dashboard = () => {
  const routeName = useNavigationState(
    (state) => state.routes[state.index].name
  );
  const dispatch = useDispatch();
  const userState = useSelector((state: RootState) => state.user.user);
  const preferencesState = useSelector((state: RootState) => state.preferences);
  const router = useRouter();
  const scrollViewRef = useRef(null);

  //Refresh Page Variables
  const [lastRefreshTime, setlastRefreshTime] = useState<any>(null);
  const [isRefreshing, setisRefreshing] = useState<any>(null);

  const [metricData, setmetricData] = useState<any>({});
  const [eventCount, seteventCount] = useState(0);
  const [unsharedEventCount, setunsharedEventCount] = useState(0);
  const [taskCount, settaskCount] = useState(0);
  const [overdueTaskCount, setoverdueTaskCount] = useState(0);
  const [friendCount, setfriendCount] = useState(0);
  const [friendInviteCount, setfriendInviteCount] = useState(0);
  const [calendarInviteCount, setcalendarInviteCount] = useState(0);
  const [calendarCount, setcalendarCount] = useState(0);

  const [isFriendRequestsOpen, setisFriendRequestsOpen] = useState(false);
  const [isCalendarRequestsOpen, setisCalendarRequestsOpen] = useState(false);
  const [isCalendarPickerOpen, setisCalendarPickerOpen] = useState(false);
  const [isFriendViewerOpen, setisFriendViewerOpen] = useState(false);

  useEffect(() => {
    refreshMetricTiles();
    if (
      routeName === "dashboard" ||
      routeName === "calendar" ||
      routeName === "assistant" ||
      routeName === "settings"
    ) {
      dispatch(
        setPreferences({
          ...preferencesState,
          lastTabPage: routeName,
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeName]);

  const refreshMetricTiles = async (forceRefresh = false) => {
    const currentTime = new Date().getTime();
    if (
      forceRefresh ||
      (!isRefreshing &&
        (!lastRefreshTime || currentTime - lastRefreshTime > 3000))
    ) {
      setlastRefreshTime(currentTime);
      setisRefreshing(true);
      const data = await getMetricData(userState.id, userState.token);
      if (data && data.status && data.status === "success" && data.data) {
        setmetricData(data.data);
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
                (event: any) =>
                  event.is_task && moment().isBefore(event.end_time)
              ).length
            : 0
        );
        setoverdueTaskCount(
          data.data.eventsAll?.length
            ? data.data.eventsAll?.filter(
                (event: any) =>
                  event.is_task && moment().isAfter(event.end_time)
              ).length
            : 0
        );
        setfriendCount(
          data.data.friends?.length ? data.data.friends?.length : 0
        );
        setfriendInviteCount(
          data.data.friendRequests?.length
            ? data.data.friendRequests?.length
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
        resetIsRefreshing();
      }
    }
  };

  const resetIsRefreshing = async () => {
    setTimeout(() => {
      // After refreshing, set isRefreshing back to false
      setisRefreshing(false);
    }, 2000);
  };

  const handleOpenFriendRequests = () => {
    setisFriendRequestsOpen(true);
  };

  const handleOpenCalendarRequests = () => {
    setisCalendarRequestsOpen(true);
  };

  const handleCalendarSelectedForManagement = (calendar: any) => {
    setisCalendarPickerOpen(false);
    router.navigate(`/calendar-manager/${calendar.id}`);
  };

  const handleScroll = (event) => {
    const { contentOffset } = event.nativeEvent;
    const isScrolledToTop = contentOffset.y <= 0;
    if (isScrolledToTop) {
      refreshMetricTiles();
    }
  };

  const handleTextInputFocus = () => {
    scrollViewRef.current.scrollToEnd({ animated: true });
  };

  return (
    <SafeAreaView style={styles.masterContainer}>
      <TitleBar title="Dashboard"></TitleBar>
      <ScrollView
        keyboardShouldPersistTaps="always"
        onScroll={handleScroll}
        scrollEventThrottle={16}
        ref={scrollViewRef}
      >
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
        <AddFriendForm
          handleTextInputFocus={() => {
            handleTextInputFocus();
          }}
        ></AddFriendForm>
        <View style={styles.widgetContainer}>
          <MetricTile
            isTask={false}
            titleText={"Friend Requests"}
            amount={friendInviteCount}
            handlePress={() => {
              handleOpenFriendRequests();
            }}
          ></MetricTile>
          <MetricTile
            isTask={false}
            titleText={"Friends"}
            amount={friendCount}
            handlePress={() => {
              setisFriendViewerOpen(true);
            }}
          ></MetricTile>
        </View>
        <Text style={styles.headingText}>Calendars</Text>
        <View style={styles.widgetContainer}>
          <MetricTile
            isTask={false}
            titleText={"Calendar Invites"}
            amount={calendarInviteCount}
            handlePress={() => {
              handleOpenCalendarRequests();
            }}
          ></MetricTile>
          <MetricTile
            isTask={false}
            titleText={"Group Calendars"}
            amount={calendarCount}
            handlePress={() => {
              setisCalendarPickerOpen(true);
            }}
          ></MetricTile>
        </View>
      </ScrollView>

      {/* START CONDITIONAL MODALS */}
      <RequestsForm
        isModalVisible={isFriendRequestsOpen}
        title={"Friend Requests"}
        isFriendRequests={true}
        requests={
          metricData &&
          metricData.friendRequests &&
          metricData.friendRequests.length
            ? metricData.friendRequests
            : []
        }
        handleRefresh={async () => {
          refreshMetricTiles(true);
        }}
        handleClose={() => {
          setisFriendRequestsOpen(false);
        }}
      ></RequestsForm>
      <RequestsForm
        isModalVisible={isCalendarRequestsOpen}
        title={"Calendar Invites"}
        isFriendRequests={false}
        requests={
          metricData &&
          metricData.calendarInvites &&
          metricData.calendarInvites.length
            ? metricData.calendarInvites
            : []
        }
        handleRefresh={async () => {
          refreshMetricTiles(true);
        }}
        handleClose={() => {
          setisCalendarRequestsOpen(false);
        }}
      ></RequestsForm>
      {/* MODAL- Calendar Management Modal */}
      <CalendarBrowser
        modalTitle={"Choose Calendar To Manage"}
        closeButtonText={"Close"}
        isVisible={isCalendarPickerOpen}
        isFilter={false}
        handlePress={(calendar: any) => {
          handleCalendarSelectedForManagement(calendar);
        }}
        handleClose={() => {
          setisCalendarPickerOpen(false);
        }}
      ></CalendarBrowser>
      <FriendBrowser
        friends={metricData.friends}
        modalTitle={"My Friends"}
        closeButtonText={"Close"}
        isVisible={isFriendViewerOpen}
        handleClose={() => {
          setisFriendViewerOpen(false);
        }}
      ></FriendBrowser>
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
