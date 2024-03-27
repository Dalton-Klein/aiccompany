import {
  Text,
  Image,
  TouchableOpacity,
  View,
  Modal,
  TextInput,
} from "react-native";
import { StyleSheet } from "react-native";
import * as THEME from "../../constants/theme";
import BasicBtn from "../tiles/buttons/basicButton";
import { useState } from "react";
import React from "react";

const CreateForm = ({
  isModalVisible,
  handleCreateEvent,
  handleCreateTask,
  handleCreateCalendar,
  handleCancel,
}) => {
  return (
    <Modal animationType="slide" transparent={true} visible={isModalVisible}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.modalConfirmContainer}>
            <BasicBtn
              iconUrl={<></>}
              handlePress={handleCreateEvent}
              buttonText={"Create Event"}
              isCancel={false}
            />
            <BasicBtn
              iconUrl={<></>}
              handlePress={handleCreateTask}
              buttonText={"Create Task"}
              isCancel={false}
            />
            <BasicBtn
              iconUrl={<></>}
              handlePress={handleCreateCalendar}
              buttonText={"Create Calendar"}
              isCancel={false}
            />
            <BasicBtn
              iconUrl={<></>}
              handlePress={handleCancel}
              buttonText={"Cancel"}
              isCancel={true}
            />
          </View>
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
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-around",
    flexWrap: "wrap",
  },
  btnContainer: {
    backgroundColor: THEME.COLORS.primary,
    borderRadius: THEME.SIZES.small / 1.25,
    justifyContent: "center",
    alignItems: "center",
    minWidth: "100%",
    marginBottom: 15,
  },
  textInput: {
    marginBottom: 15,
    padding: 5,
    borderRadius: THEME.BORDERSIZES.medium,
    borderColor: THEME.COLORS.primary,
    minWidth: "100%",
  },
  btnContentBox: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    minWidth: "100%",
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 20,
    paddingLeft: 20,
    borderRadius: THEME.BORDERSIZES.large,
  },
  btnImg: {
    borderRadius: THEME.SIZES.small / 1.25,
  },
  btnText: {
    color: THEME.COLORS.lighter,
    marginLeft: 10,
    fontSize: THEME.SIZES.large,
  },
  modalConfirmContainer: {
    minWidth: "100%",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
});

export default CreateForm;
