import {
  Text,
  Image,
  TouchableOpacity,
  View,
} from "react-native";
import { StyleSheet } from "react-native";
import * as THEME from "../../../constants/theme";
import React, { useEffect, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";

const MessageBubble = ({ username, text, avatar_url }) => {
  const [isBot, setisBot] = useState(false);

  useEffect(() => {
    if (username === "Assistant") {
      setisBot(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (username === "Assistant") {
      setisBot(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);

  return (
    <View
      style={[
        styles.messageContainer,
        isBot ? styles.taskColor : styles.eventColor,
      ]}
    >
      <View style={styles.avatarBox}>
        {isBot ? (
          <MaterialIcons
            name="assistant"
            size={24}
            color={THEME.COLORS.lighter}
          />
        ) : (
          <Image
            src={avatar_url}
            style={styles.profileImg}
          />
        )}
      </View>
      <View style={styles.contentBox}>
        <Text style={styles.titleText}>{username}</Text>
        <Text style={styles.messageText}>{text}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    flex: 1,
    borderRadius: THEME.BORDERSIZES.large,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    padding: 15,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
    minWidth: "85%",
    maxWidth: "85%",
    shadowColor: THEME.COLORS.darker,
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 2,
  },
  eventColor: {
    backgroundColor: THEME.COLORS.primary,
    alignSelf: "flex-end",
  },
  taskColor: {
    backgroundColor: THEME.COLORS.secondary,
    alignSelf: "flex-start",
  },
  avatarBox: {},
  profileImg: {
    maxWidth: 30,
    maxHeight: 30,
    minWidth: 30,
    minHeight: 30,
    borderRadius: 30 / 2,
  },
  contentBox: {
    alignItems: "flex-start",
    marginLeft: 15,
  },
  titleText: {
    fontWeight: "600",
    color: THEME.COLORS.lighter,
    fontSize: THEME.SIZES.medium,
  },
  messageText: {
    fontWeight: "300",
    color: THEME.COLORS.lighter,
    fontSize: THEME.SIZES.medium,
    paddingRight: 20,
  },
});

export default MessageBubble;
