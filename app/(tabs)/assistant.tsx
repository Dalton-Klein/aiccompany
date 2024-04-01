import { useEffect, useRef, useState } from "react";
import {
  View,
  SafeAreaView,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import { useRouter } from "expo-router";
import * as THEME from "../../constants/theme";
import TitleBar from "../../components/nav/tab-titlebar";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import React from "react";
import { FontAwesome } from "@expo/vector-icons";
import MessageBubble from "../../components/tiles/social/message";
import { queryAssistant } from "../services/rest";
import { Keyboard } from "react-native";

const Assistant = () => {
  const router = useRouter();
  const userState = useSelector(
    (state: RootState) => state.user.user
  );
  const scrollViewRef = useRef(null);

  const [queryText, setqueryText] = useState("");
  const [messages, setmessages] = useState([
    <MessageBubble
      username={"Assistant"}
      text={`Hello, ${userState.username}. I am your personal AI assistant. I am here to help, ask me anything!`}
      avatar_url={""}
      key={0}
    ></MessageBubble>,
  ]);

  useEffect(() => {
    if (!userState.id || userState.id < 1) {
      router.navigate("auth/authentication");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendQuery = async () => {
    Keyboard.dismiss();
    setqueryText("");
    createMessageTile(
      userState.username,
      queryText,
      userState.avatar_url
    );
    console.log("sending ");
    const apiResult = await queryAssistant(
      userState.id,
      queryText,
      ""
    );
    console.log("api result?: ", apiResult);
    if (apiResult) {
      setTimeout(() => {
        // After refreshing, set isRefreshing back to false
        createMessageTile(
          "Assistant",
          apiResult.message.content,
          ""
        );
      }, 500);
    }
  };

  const createMessageTile = (
    username: string,
    text: string,
    avatar_url: string
  ) => {
    const uniqueKey = `msg-${new Date().getTime()}`;
    setmessages((currentMessages) => [
      ...currentMessages,
      <MessageBubble
        username={username}
        text={text}
        avatar_url={avatar_url}
        key={uniqueKey}
      ></MessageBubble>,
    ]);
  };

  return (
    <SafeAreaView style={styles.masterContainer}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={"padding"}
        keyboardVerticalOffset={64}
      >
        <TitleBar title="Assistant"></TitleBar>
        <ScrollView
          scrollEventThrottle={16}
          keyboardShouldPersistTaps="always"
          ref={scrollViewRef}
          onContentSizeChange={() =>
            scrollViewRef.current.scrollToEnd({
              animated: true,
            })
          }
        >
          {messages}
        </ScrollView>
        <View style={styles.inputBox}>
          <TextInput
            style={styles.textInput}
            placeholder={"Ask me anything..."}
            value={queryText}
            placeholderTextColor="grey"
            onChangeText={(value) => {
              setqueryText(value);
            }}
          />
          <TouchableOpacity
            onPress={sendQuery}
            style={styles.sendBtn}
          >
            <FontAwesome
              name="send"
              size={30}
              color={THEME.COLORS.primary}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  masterContainer: {
    flex: 1,
    backgroundColor: THEME.COLORS.lighter,
  },
  titleText: {
    marginTop: 75,
    marginBottom: 50,
    color: THEME.COLORS.fontColor,
    textAlign: "center",
    fontSize: THEME.SIZES.large,
  },
  descriptionText: {
    marginTop: 25,
    marginLeft: 25,
    marginRight: 25,
    color: "grey",
    textAlign: "center",
    fontSize: THEME.SIZES.medium,
  },
  inputBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginLeft: 15,
    marginRight: 15,
  },
  textInput: {
    marginTop: 10,
    marginBottom: 25,
    marginRight: 15,
    padding: 10,
    borderRadius: THEME.BORDERSIZES.large,
    fontSize: THEME.SIZES.medium,
    fontWeight: "300",
    borderColor: "grey",
    borderWidth: 1,
    minWidth: "80%",
    maxWidth: "80%",
  },
  sendBtn: {
    paddingBottom: 10,
  },
});

export default Assistant;
