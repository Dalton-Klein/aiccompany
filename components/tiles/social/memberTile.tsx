import {
  Text,
  Image,
  TouchableOpacity,
  View,
  Modal,
  TextInput,
} from "react-native";
import { StyleSheet } from "react-native";
import * as THEME from "../../../constants/theme";
import BasicBtn from "../../tiles/buttons/basicButton";
import { useEffect, useState } from "react";
import {
  acceptCalendarInvite,
  acceptFriendRequest,
} from "../../../app/services/rest";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import React from "react";

const MemberTile = ({ member }) => {
  const userState = useSelector((state: RootState) => state.user.user);

  return (
    <View style={styles.requestContainer}>
      <View style={styles.userInfoContainer}>
        {member.avatar_url && member.avatar_url.length > 0 ? (
          <Image
            source={{ uri: member.avatar_url }}
            style={styles.prolfileImg}
          />
        ) : (
          <View style={styles.dynamicAvatarBg}>
            <Text style={styles.dynamicAvatarText}>
              {member.username
                ? member.username
                    .split(" ")
                    .map((word: string[]) => word[0])
                    .join("")
                    .slice(0, 2)
                    .toLowerCase()
                : "gg"}
            </Text>
          </View>
        )}
        <Text style={styles.usernameText}>
          {member.username.substring(0, 16)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  requestContainer: {
    backgroundColor: THEME.COLORS.light,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 5,
    marginBottom: 5,
    marginRight: 20,
    marginLeft: 20,
    paddingRight: 15,
    paddingLeft: 15,
    minWidth: "80%",
    minHeight: 50,
    borderRadius: THEME.BORDERSIZES.large,
  },
  userInfoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    minWidth: 80,
  },
  prolfileImg: {
    maxWidth: 30,
    maxHeight: 30,
    minWidth: 30,
    minHeight: 30,
    borderRadius: 30 / 2,
  },
  dynamicAvatarBg: {
    backgroundColor: THEME.COLORS.neutral,
    minWidth: 30,
    minHeight: 30,
    maxWidth: 30,
    maxHeight: 30,
    borderRadius: 30 / 2,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  dynamicAvatarText: {
    fontSize: THEME.SIZES.large,
    color: THEME.COLORS.fontColor,
  },
  usernameText: {
    fontSize: THEME.SIZES.medium,
    color: THEME.COLORS.darker,
    marginLeft: 5,
  },
});

export default MemberTile;
