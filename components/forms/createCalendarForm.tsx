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
import * as ImagePicker from "expo-image-picker";
import { uploadAvatarCloud } from "../../app/services/rest";
import { FontAwesome5 } from "@expo/vector-icons";

const CreateCalendarForm = ({ isModalVisible, handleCreate, handleCancel }) => {
  const [calendarBanner, setcalendarBanner] = useState(null);
  const [title, settitle] = useState("");
  const [description, setdescription] = useState("");

  const handleSubmitForm = () => {
    handleCreate({
      title,
      description,
      calendar_url: calendarBanner ? calendarBanner : "",
    });
  };

  const handlePickAvatar = async () => {
    // Requesting permission to access the camera roll
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }

    // Launching the image picker
    let result: any = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // Optional: You can force the crop aspect ratio to be square
      quality: 1,
    });

    if (!result.cancelled) {
      const uploadResult = await uploadAvatarCloud(result.assets[0].uri);
      // // Assuming you have a function to handle the upload of the image URL to your server or backend
      setcalendarBanner(uploadResult);
    }
  };

  return (
    <Modal animationType="slide" transparent={true} visible={isModalVisible}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.imagePickerBox}>
            <Text style={styles.imagePickerText}>Calendar Photo</Text>
            {calendarBanner ? (
              <TouchableOpacity
                style={styles.avatarBg}
                onPress={handlePickAvatar}
              >
                <Image src={calendarBanner} style={styles.profileImg} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.dynamicAvatarBg}
                onPress={handlePickAvatar}
              >
                <FontAwesome5
                  name="calendar"
                  size={36}
                  color={THEME.COLORS.lighter}
                />
              </TouchableOpacity>
            )}
          </View>
          <TextInput
            style={styles.textInput}
            placeholder={"Calendar Name"}
            placeholderTextColor="grey"
            onChangeText={(value) => {
              settitle(value);
            }}
          ></TextInput>
          <TextInput
            style={styles.textInput}
            placeholder={"Calendar Description"}
            placeholderTextColor="grey"
            onChangeText={(value) => {
              setdescription(value);
            }}
          ></TextInput>
          <View style={styles.modalConfirmContainer}>
            <BasicBtn
              iconUrl={<></>}
              handlePress={handleSubmitForm}
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
  imagePickerBox: {
    flexDirection: "row",
    minWidth: "80%",
    justifyContent: "space-around",
    alignItems: "center",
  },
  imagePickerText: {
    color: "grey",
    fontWeight: "300",
    fontSize: THEME.SIZES.medium,
    paddingBottom: 15,
  },
  profileImg: {
    maxWidth: 75,
    maxHeight: 75,
    minWidth: 75,
    minHeight: 75,
    borderRadius: 75 / 2,
    marginBottom: 15,
  },
  avatarBg: {
    minWidth: 75,
    minHeight: 75,
    borderRadius: 75 / 2,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  dynamicAvatarBg: {
    backgroundColor: THEME.COLORS.neutral,
    minWidth: 75,
    minHeight: 75,
    borderRadius: 75 / 2,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  dynamicAvatarText: {
    fontSize: THEME.SIZES.large,
    color: THEME.COLORS.fontColor,
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
    minHeight: 150,
  },
});

export default CreateCalendarForm;
