import {
  Text,
  Image,
  TouchableOpacity,
  View,
  Modal,
  TextInput,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { StyleSheet } from "react-native";
import * as THEME from "../../constants/theme";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import MemberTile from "../../components/tiles/social/memberTile";
import TaskViewerNav from "../../components/nav/taskViwerNav";
import { getAllEventsForUser } from "../services/rest";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import moment from "moment";
import TaskTile from "../../components/tiles/tasks/task-tile";
import React from "react";

const TaskViewer = () => {
  const router = useRouter();
  const userState = useSelector((state: RootState) => state.user.user);

  const [unsavedChanges, setunsavedChanges] = useState([]);
  const [selectedView, setselectedView] = useState("Active");
  const [taskTiles, settaskTiles] = useState([]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    const result = await getAllEventsForUser(userState.id, "");
    if (result.data) {
      turnTasksIntoTiles(result.data.filter((t: any) => t.is_task));
    }
  };

  const turnTasksIntoTiles = (tasks: any) => {
    if (selectedView === "Active") {
      tasks.filter((t) => moment(t.end_time).isAfter(moment()));
    } else if (selectedView === "Overdue") {
      tasks.filter((t) => moment(t.end_time).isBefore(moment()));
    } else {
      tasks.filter((t) => t.is_completed);
    }
    let tempTaskTiles = [];
    tasks.forEach((task) => {
      tempTaskTiles.push(
        <View key={task.id}>
          <TaskTile task={task}></TaskTile>
        </View>
      );
    });
    settaskTiles(tempTaskTiles);
  };

  const navigateBack = () => {
    router.navigate(`/dashboard`);
  };

  return (
    <SafeAreaView>
      <View style={styles.titleRow}>
        <TouchableOpacity style={styles.backBtn} onPress={navigateBack}>
          <Text>Back</Text>
        </TouchableOpacity>
        <Text style={styles.titleText}>Tasks</Text>
        <Text style={styles.backBtn}></Text>
      </View>
      <TaskViewerNav updateView={() => {}}></TaskViewerNav>
      <ScrollView keyboardShouldPersistTaps="always">{taskTiles}</ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 5,
  },
  titleText: {
    color: THEME.COLORS.fontColor,
    textAlign: "center",
    fontWeight: "600",
    fontSize: THEME.SIZES.large,
    minWidth: "50%",
  },
  backBtn: {
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
    minWidth: 50,
    maxHeight: 50,
  },
});

export default TaskViewer;
