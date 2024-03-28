import { useState, useEffect } from "react";
import { View, StyleSheet, Text, TouchableOpacity, Image } from "react-native";
import * as THEME from "../../../constants/theme";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import React from "react";
import * as ImagePicker from "expo-image-picker";
import { FontAwesome5 } from "@expo/vector-icons";

const CalendarTile = ({ handlePress, calendar, isPreSelected = false }) => {
  const [calendarBanner, setcalendarBanner] = useState(null);
  const [memberFeed, setmemberFeed] = useState([]);
  const [isSelected, setisSelected] = useState(false);

  useEffect(() => {
    // generateMemberList();
    setisSelected(isPreSelected);
    setcalendarBanner(calendar.calendar_url);
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
        <FontAwesome
          size={18}
          name="check"
          color={THEME.COLORS.lighter}
          style={styles.checkmark}
        />
      ) : (
        <></>
      )}
      {calendarBanner ? (
        <View style={styles.avatarBg}>
          <Image src={calendarBanner} style={styles.profileImg} />
        </View>
      ) : (
        <></>
      )}
      <Text style={styles.calendarTitle}>{calendar.title}</Text>
      <Text style={styles.calendarSubTitle}>
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
  checkmark: {
    marginBottom: 15,
  },
  profileImg: {
    maxWidth: 50,
    maxHeight: 50,
    minWidth: 50,
    minHeight: 50,
    borderRadius: 50 / 2,
    marginBottom: 15,
  },
  avatarBg: {
    minWidth: 50,
    minHeight: 50,
    borderRadius: 50 / 2,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  dynamicAvatarBg: {
    backgroundColor: THEME.COLORS.neutral,
    minWidth: 50,
    minHeight: 50,
    borderRadius: 50 / 2,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  dynamicAvatarText: {
    fontSize: THEME.SIZES.large,
    color: THEME.COLORS.fontColor,
  },
  calendarTitle: {
    fontSize: THEME.SIZES.large,
    color: THEME.COLORS.lighter,
    fontWeight: "700",
  },
  calendarSubTitle: {
    fontSize: THEME.SIZES.small,
    fontWeight: "300",
    color: THEME.COLORS.lighter,
  },
});

export default CalendarTile;
