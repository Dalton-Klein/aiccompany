import { useState, useEffect } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import * as THEME from "../../../constants/theme";
import FontAwesome from "@expo/vector-icons/FontAwesome";

const CalendarTile = ({ handlePress, calendar, isPreSelected = false }) => {
  const [memberFeed, setmemberFeed] = useState([]);
  const [isSelected, setisSelected] = useState(false);

  useEffect(() => {
    // generateMemberList();
    setisSelected(isPreSelected);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const generateMemberList = () => {
    let allMembers = calendar.members.map((member: any) =>
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
    setisSelected(!isSelected);
    handlePress(calendar, !isSelected);
  };

  return (
    <TouchableOpacity
      style={
        isSelected
          ? [styles.CalendarTile, styles.selected]
          : [styles.CalendarTile, styles.notSelected]
      }
      onPress={handleCalendarSelected}
    >
      {isSelected ? (
        <FontAwesome size={18} name="check" color={THEME.COLORS.lighter} />
      ) : (
        <></>
      )}
      <Text style={styles.dayTitle}>{calendar.title}</Text>
      <Text style={styles.daySubTitle}>
        {calendar.member_count > 0
          ? `${calendar.member_count} members`
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
    borderRadius: THEME.BORDERSIZES.medium,
    justifyContent: "space-between",
    alignItems: "center",
  },
  notSelected: {
    backgroundColor: THEME.COLORS.primary,
  },
  selected: {
    backgroundColor: THEME.COLORS.neutral,
  },
  dayTitle: {
    fontSize: THEME.SIZES.large,
    color: THEME.COLORS.lighter,
    fontWeight: "700",
  },
  daySubTitle: {
    fontSize: THEME.SIZES.small,
    fontWeight: "300",
    color: THEME.COLORS.lighter,
  },
});

export default CalendarTile;
