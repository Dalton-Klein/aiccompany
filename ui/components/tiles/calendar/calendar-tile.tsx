import { useState, useEffect } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import * as THEME from "../../../constants/theme";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { setPreferences } from "../../../store/userPreferencesSlice";

const CalendarTile = (props: any) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const userState = useSelector((state: RootState) => state.user.user);
  const preferencesState = useSelector((state: RootState) => state.preferences);
  const [memberFeed, setmemberFeed] = useState([]);

  useEffect(() => {
    // generateMemberList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const generateMemberList = () => {
    let allMembers = props.members.map((member: any) =>
      turnMemberIntoTile(member)
    );
    setmemberFeed(allMembers.slice(0, 3));
  };

  const turnMemberIntoTile = (member: any) => {
    return (
      <View key={member.id}>
        <Text>{member.username}</Text>
      </View>
    );
  };

  const handleCalendarSelected = () => {
    dispatch(
      setPreferences({
        ...preferencesState,
        selectedCalendar: props,
      })
    );
    props.closeModal(props);
  };

  return (
    <TouchableOpacity
      style={styles.CalendarTile}
      onPress={handleCalendarSelected}
    >
      <Text style={styles.dayTitle}>{props.title}</Text>
      <Text style={styles.daySubTitle}>
        {props.member_count > 0
          ? `${props.member_count} members`
          : "All calendars"}{" "}
      </Text>
      {/* {memberFeed} */}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  CalendarTile: {
    padding: 25,
    marginBottom: 10,
    minHeight: 60,
    backgroundColor: THEME.COLORS.primary,
    borderRadius: THEME.BORDERSIZES.medium,
    justifyContent: "space-between",
    alignItems: "center",
  },
  dayTitle: {
    fontSize: THEME.SIZES.large,
    color: THEME.COLORS.lighter,
    fontWeight: "bold",
  },
  daySubTitle: {
    fontSize: THEME.SIZES.mediuml,
    color: THEME.COLORS.lighter,
  },
});

export default CalendarTile;
