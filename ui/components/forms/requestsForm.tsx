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

const RequestsForm = ({ isModalVisible, requests, handleClose }) => {
  const turnRequestsIntoTiles = async () => {
    requests.forEach((req: any) => {});
  };
  const handleAcceptRequest = async () => {};
  return (
    <Modal animationType="slide" transparent={true} visible={isModalVisible}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.modalConfirmContainer}>
            <BasicBtn
              iconUrl={<></>}
              handlePress={handleClose}
              buttonText={"Close"}
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
  modalConfirmContainer: {
    minWidth: "100%",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
});

export default RequestsForm;
