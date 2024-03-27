import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
} from "react-native";
import * as THEME from "../../constants/theme";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import MemberTile from "../tiles/social/memberTile";
import React from "react";

const FriendBrowser = ({
  friends,
  modalTitle,
  closeButtonText,
  isVisible,
  handleClose,
}) => {
  const dispatch = useDispatch();
  const userState = useSelector((state: RootState) => state.user.user);
  const preferencesState = useSelector((state: RootState) => state.preferences);
  const [userTiles, setuserTiles] = useState([]);

  useEffect(() => {
    refreshFriends();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [friends]);

  const refreshFriends = async () => {
    if (friends && friends.length) {
      covertCalendarDataIntoTiles(friends);
    } else {
      covertCalendarDataIntoTiles([]);
    }
  };

  const covertCalendarDataIntoTiles = async (users: any) => {
    const memberCalendars = users.map((member: any) => (
      <View key={member.id}>
        <MemberTile member={member}></MemberTile>
      </View>
    ));
    setuserTiles(memberCalendars);
  };

  return (
    <Modal animationType="slide" transparent={true} visible={isVisible}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitleText}>{modalTitle}</Text>
          <View style={styles.modalGrid}>
            <ScrollView style={styles.friendScrollBox}>
              {userTiles.length ? (
                userTiles
              ) : (
                <Text style={styles.noFriendsText}>No friends yet!</Text>
              )}
            </ScrollView>
          </View>
          {/* Close Modal Button */}
          <TouchableOpacity
            style={styles.expandCalendarButton}
            onPress={() => {
              handleClose();
            }}
          >
            <Text style={styles.buttonText}>{closeButtonText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
    maxHeight: "80%",
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalGrid: {
    minWidth: "100%",
    maxHeight: "80%",
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-around",
    flexWrap: "wrap",
  },
  friendScrollBox: {
    maxHeight: "100%",
  },
  expandCalendarButton: {
    borderRadius: THEME.BORDERSIZES.large,
    borderColor: THEME.COLORS.darker,
    borderWidth: 2,
  },
  modalTitleText: {
    marginBottom: 15,
    fontWeight: "bold",
    fontSize: THEME.SIZES.medium,
    color: THEME.COLORS.fontColor,
  },
  buttonText: {
    padding: 10,
    color: THEME.COLORS.fontColor,
  },
  noFriendsText: {
    marginBottom: 10,
    marginTop: 10,
    fontSize: THEME.SIZES.medium,
    fontWeight: "300",
    textAlign: "center",
  },
});

export default FriendBrowser;
