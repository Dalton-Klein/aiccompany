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
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import BasicBtn from "../buttons/basicButton";

const MemberTile = ({
  member,
  isRemovable,
  removeMessage,
  handleRemoveUser,
}) => {
  const [isConfirmModalVisible, setisConfirmModalVisible] =
    useState(false);

  const userState = useSelector(
    (state: RootState) => state.user.user
  );

  return (
    <View style={styles.requestContainer}>
      <View style={styles.userInfoContainer}>
        {member.avatar_url &&
        member.avatar_url.length > 0 ? (
          <Image
            src={member.avatar_url}
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
      {isRemovable ? (
        <TouchableOpacity
          onPress={() => {
            setisConfirmModalVisible(true);
          }}
        >
          <MaterialIcons
            name="remove-circle"
            size={24}
            color="red"
          />
        </TouchableOpacity>
      ) : (
        <></>
      )}
      {/* Confirm Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isConfirmModalVisible}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              {removeMessage}
            </Text>
            <BasicBtn
              iconUrl={<></>}
              handlePress={() => {
                handleRemoveUser();
                setisConfirmModalVisible(false);
              }}
              buttonText={"Confirm"}
              isCancel={false}
            />
            <BasicBtn
              iconUrl={<></>}
              handlePress={() => {
                setisConfirmModalVisible(false);
              }}
              buttonText={"Cancel"}
              isCancel={true}
            />
          </View>
        </View>
      </Modal>
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
    minHeight: "40%",
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
    marginBottom: 40,
    fontSize: THEME.SIZES.medium,
    textAlign: "center",
  },
  modalBtnContainer: {
    flex: 1,
    backgroundColor: THEME.COLORS.primary,
    borderRadius: THEME.BORDERSIZES.medium,
    justifyContent: "center",
    alignItems: "center",
    minWidth: "100%",
    marginLeft: 5,
    marginRight: 5,
    marginTop: 20,
    maxHeight: 50,
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 20,
    paddingLeft: 20,
  },
  modalBtnText: {
    color: THEME.COLORS.lighter,
    fontSize: THEME.SIZES.medium,
    textAlign: "center",
  },
});

export default MemberTile;
