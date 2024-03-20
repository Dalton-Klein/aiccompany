import {
  Text,
  Image,
  TouchableOpacity,
  View,
  TextInput,
  Modal,
  FlatList,
} from "react-native";
import { StyleSheet } from "react-native";
import * as THEME from "../../constants/theme";
import { useEffect, useRef, useState } from "react";
import BasicBtn from "../tiles/buttons/basicButton";
import {
  fetchUserSearchData,
  searchUserByUsername,
  sendCalendarInvite,
  sendFriendRequest,
} from "../../app/services/rest";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

const CalendarInviteForm = ({ calendarId, handleRefresh }) => {
  const userState = useSelector((state: RootState) => state.user.user);
  const textInputRef = useRef(null);

  const [searchQuery, setsearchQuery] = useState("");
  const [userData, setuserData] = useState([]);
  const [resultText, setresultText] = useState("");
  const [isResultModalVisible, setisResultModalVisible] = useState(false);
  const [suggestions, setsuggestions] = useState([]);

  useEffect(() => {
    getUsersForSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (searchQuery === "") {
      setsuggestions([]);
    } else {
      setsuggestions(
        userData.filter((user) => {
          if (user.username.toLowerCase().includes(searchQuery.toLowerCase())) {
            if (user.username === userState.username) {
              return false;
            } else {
              return true;
            }
          } else {
            return false;
          }
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [suggestions]);

  const getUsersForSearch = async () => {
    const result = await fetchUserSearchData("");
    setuserData(result);
  };

  const handleSuggestionSelect = (user: any) => {
    setsearchQuery(user.username); // Fill the text input with the selected username
  };

  const tryAddMember = async () => {
    if (searchQuery.length < 3) {
      setresultText(`${searchQuery} is not a valid username!`);
      setisResultModalVisible(true);
    } else {
      const searchResult = await searchUserByUsername(searchQuery, "");
      if (searchResult.data.length) {
        console.log("id? ", calendarId);
        const requestResult = await sendCalendarInvite(
          calendarId,
          userState.id,
          searchResult.data[0].id,
          ""
        );
        if (
          requestResult &&
          requestResult.status &&
          requestResult.status === "success"
        ) {
          setresultText(`Request sent to ${searchQuery}!`);
          setisResultModalVisible(true);
          handleRefresh();
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
        setresultText(`${searchQuery} is not a valid username!`);
        setisResultModalVisible(true);
      }
    }
  };

  const closeModal = () => {
    setsearchQuery("");
    setsuggestions([]);
    if (textInputRef.current) {
      textInputRef.current.clear();
    }
    setisResultModalVisible(false);
  };

  return (
    <View>
      <View style={styles.parentBox}>
        <View style={styles.searchBox}>
          <TextInput
            ref={textInputRef}
            style={styles.textInput}
            value={searchQuery}
            placeholder={"Invite by username..."}
            placeholderTextColor="grey"
            onChangeText={(value) => {
              setsearchQuery(value);
            }}
          ></TextInput>
          <TouchableOpacity
            style={styles.sendBtnContainer}
            onPress={tryAddMember}
          >
            <Text style={styles.btnText}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        style={styles.suggestionList}
        data={suggestions}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => handleSuggestionSelect(item)}
            key={item.id}
            style={styles.userTile}
          >
            <Text style={styles.suggestionText}>{item.username}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => {
          return item ? item.id : "0";
        }}
        horizontal
      />
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
    alignItems: "flex-start",
    minWidth: "95%",
    marginTop: 15,
    marginBottom: 15,
  },
  searchBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    minWidth: "95%",
  },
  textInput: {
    marginTop: 5,
    marginBottom: 15,
    marginLeft: 15,
    padding: 5,
    borderRadius: THEME.BORDERSIZES.medium,
    borderColor: THEME.COLORS.primary,
    minWidth: "65%",
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
    paddingRight: 10,
    paddingLeft: 10,
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
  suggestionList: {
    minWidth: "90%",
    marginLeft: 5,
    marginRight: 5,
  },
  suggestionText: {
    color: THEME.COLORS.fontColor,
  },
  userTile: {
    backgroundColor: THEME.COLORS.light,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 5,
    marginBottom: 5,
    marginRight: 5,
    marginLeft: 5,
    paddingRight: 15,
    paddingLeft: 15,
    minWidth: "20%",
    minHeight: 50,
    borderRadius: THEME.BORDERSIZES.large,
  },
});

export default CalendarInviteForm;
