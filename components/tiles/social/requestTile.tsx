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

const RequestTile = ({ request, handleAccept, isFriendRequest }) => {
  const userState = useSelector((state: RootState) => state.user.user);
  const handleAcceptRequest = async () => {
    const requestObject = {
      senderId: request.user_id,
      receiver: userState.id,
      pendingId: request.requestid,
    };
    if (isFriendRequest) {
      await acceptFriendRequest(requestObject, "");
    } else {
      await acceptCalendarInvite(
        request.calendar_id,
        userState.id,
        request.id,
        ""
      );
    }
    handleAccept();
  };

  return (
    <View style={styles.requestContainer}>
      <View style={styles.userInfoContainer}>
        {isFriendRequest ? (
          request.avatar_url && request.avatar_url.length > 0 ? (
            <Image
              source={{ uri: request.avatar_url }}
              style={styles.prolfileImg}
            />
          ) : (
            <View style={styles.dynamicAvatarBg}>
              <Text style={styles.dynamicAvatarText}>
                {request.username
                  ? request.username
                      .split(" ")
                      .map((word: string[]) => word[0])
                      .join("")
                      .slice(0, 2)
                      .toLowerCase()
                  : "gg"}
              </Text>
            </View>
          )
        ) : (
          <></>
        )}
        {!isFriendRequest ? (
          <View style={styles.dynamicAvatarBg}>
            <Text style={styles.dynamicAvatarText}>
              {request.title
                ? request.title
                    .split(" ")
                    .map((word: string[]) => word[0])
                    .join("")
                    .slice(0, 2)
                    .toLowerCase()
                : "gg"}
            </Text>
          </View>
        ) : (
          <></>
        )}
        <Text style={styles.usernameText}>
          {isFriendRequest
            ? request.username.substring(0, 16)
            : request.title.substring(0, 16)}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.acceptButton}
        onPress={handleAcceptRequest}
      >
        <Text style={styles.btnText}>Accept</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  requestContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    marginRight: 10,
    minWidth: "100%",
    minHeight: 50,
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
  requestConfirmContainer: {
    minWidth: "100%",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  acceptButton: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: THEME.COLORS.primary,
    borderRadius: THEME.BORDERSIZES.medium,
    justifyContent: "center",
    alignItems: "center",
  },
  btnText: {
    color: THEME.COLORS.lighter,
    fontSize: THEME.SIZES.medium,
    textAlign: "center",
  },
});

export default RequestTile;
