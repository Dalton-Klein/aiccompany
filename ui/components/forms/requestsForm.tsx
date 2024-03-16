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
import { useEffect, useState } from "react";
import RequestTile from "../tiles/social/requestTile";

const RequestsForm = ({
  isModalVisible,
  title,
  requests,
  handleRefresh,
  handleClose,
  isFriendRequests,
}) => {
  const [requestTiles, setrequestTiles] = useState([]);

  useEffect(() => {
    turnRequestsIntoTiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requests]);

  const turnRequestsIntoTiles = async () => {
    let tiles = [];
    if (requests && requests.length) {
      requests.forEach((req: any) => {
        tiles.push(
          <View key={req.id} style={styles.tileContainer}>
            <RequestTile
              request={req}
              handleAccept={() => {
                handleAcceptRequest();
              }}
              isFriendRequest={isFriendRequests}
            ></RequestTile>
          </View>
        );
      });
      setrequestTiles(tiles);
    } else {
      setrequestTiles([]);
    }
  };
  const handleAcceptRequest = async () => {
    console.log("handled? ");
    handleRefresh();
  };
  return (
    <Modal animationType="slide" transparent={true} visible={isModalVisible}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitleText}>{title}</Text>
          <View style={styles.modalGrid}>{requestTiles}</View>
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
  modalTitleText: {
    marginBottom: 15,
    fontWeight: "bold",
    fontSize: THEME.SIZES.medium,
    color: THEME.COLORS.fontColor,
  },
  modalGrid: {
    minWidth: "100%",
    marginBottom: 25,
    flexDirection: "row",
    justifyContent: "space-around",
    flexWrap: "wrap",
  },
  tileContainer: {
    maxWidth: "100%",
  },
  modalConfirmContainer: {
    minWidth: "100%",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
});

export default RequestsForm;
