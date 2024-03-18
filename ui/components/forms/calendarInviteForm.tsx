import {
  Text,
  Image,
  TouchableOpacity,
  View,
  TextInput,
  Modal,
} from "react-native";
import { StyleSheet } from "react-native";
import * as THEME from "../../constants/theme";
import { useEffect, useRef, useState } from "react";
import BasicBtn from "../tiles/buttons/basicButton";
import {
  searchUserByUsername,
  sendFriendRequest,
} from "../../app/services/rest";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

const CalendarInviteForm = () => {
  const userState = useSelector((state: RootState) => state.user.user);
  const textInputRef = useRef(null);

  const [user, setuser] = useState("");
  const [resultText, setresultText] = useState("");
  const [isResultModalVisible, setisResultModalVisible] = useState(false);

  const tryAddFriend = async () => {
    if (user.length < 3) {
      setresultText(`${user} is not a valid username!`);
      setisResultModalVisible(true);
    } else {
      const searchResult = await searchUserByUsername(user, "");
      if (searchResult.data.length) {
        const requestResult = await sendFriendRequest(
          userState.id,
          searchResult.data[0].id,
          ""
        );
        if (
          requestResult &&
          requestResult.status &&
          requestResult.status === "success"
        ) {
          setresultText(`Request sent to ${user}!`);
          setisResultModalVisible(true);
        } else {
          if (requestResult.data) {
            //Specific problem is given from api
            setresultText(requestResult.data);
          } else {
            //No speicifc problem given from api
            setresultText(`Problem sending request!`);
          }
          setisResultModalVisible(true);
        }
      } else {
        setresultText(`${user} is not a valid username!`);
        setisResultModalVisible(true);
      }
    }
  };

  const closeModal = () => {
    setuser("");
    if (textInputRef.current) {
      textInputRef.current.clear();
    }
    setisResultModalVisible(false);
  };

  return (
    <View style={styles.parentBox}>
      <TextInput
        ref={textInputRef}
        style={styles.textInput}
        placeholder={"Invite by username..."}
        placeholderTextColor="grey"
        onChangeText={(value) => {
          setuser(value);
        }}
      ></TextInput>
      <TouchableOpacity style={styles.sendBtnContainer} onPress={tryAddFriend}>
        <Text style={styles.btnText}>Send</Text>
      </TouchableOpacity>
      {/* Result Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isResultModalVisible}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>{resultText}</Text>
            <TouchableOpacity style={styles.btnContainer} onPress={closeModal}>
              <Text style={styles.btnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  parentBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    minWidth: "95%",
    marginTop: 15,
    marginBottom: 15,
  },
  textInput: {
    marginTop: 5,
    marginBottom: 15,
    marginLeft: 15,
    padding: 5,
    borderRadius: THEME.BORDERSIZES.medium,
    borderColor: THEME.COLORS.primary,
    minWidth: "70%",
  },
  sendBtnContainer: {
    flex: 1,
    backgroundColor: THEME.COLORS.primary,
    borderRadius: THEME.BORDERSIZES.medium,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 5,
    marginRight: 20,
    maxHeight: 50,
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 20,
    paddingLeft: 20,
  },
  btnContainer: {
    flex: 1,
    backgroundColor: THEME.COLORS.primary,
    borderRadius: THEME.BORDERSIZES.medium,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 5,
    marginRight: 5,
    maxHeight: 50,
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 20,
    paddingLeft: 20,
  },
  btnText: {
    color: THEME.COLORS.lighter,
    fontSize: THEME.SIZES.medium,
    textAlign: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: THEME.COLORS.lighter,
    borderRadius: 20,
    width: "90%",
    minHeight: 200,
    padding: 35,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 20,
    fontSize: THEME.SIZES.medium,
  },
});

export default CalendarInviteForm;
