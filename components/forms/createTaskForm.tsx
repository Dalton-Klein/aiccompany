import {
  Text,
  TouchableOpacity,
  View,
  Modal,
  TextInput,
  ScrollView,
} from "react-native";
import { StyleSheet } from "react-native";
import * as THEME from "../../constants/theme";
import BasicBtn from "../tiles/buttons/basicButton";
import { useEffect, useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";

const CreateTaskForm = ({ isModalVisible, handleCreate, handleCancel }) => {
  const [errorText, seterrorText] = useState("");
  const [title, settitle] = useState("");
  const [notes, setnotes] = useState("");
  const [duration, setduration] = useState(0);
  const [selectedEndDate, setSelectedEndDate] = useState(new Date());

  useEffect(() => {
    setSelectedEndDate(new Date());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmitForm = () => {
    let hasError = false;
    if (title.length < 3) {
      seterrorText("Title too short!");
      hasError = true;
    }
    if (!selectedEndDate) {
      seterrorText("Must choose Event End Time!");
      hasError = true;
    }
    if (!hasError) {
      handleCreate({
        title,
        notes,
        end_time: selectedEndDate,
        task_duration: duration,
      });
      seterrorText("");
    }
  };

  const handleConfirmEndTime = (e, date: any) => {
    setSelectedEndDate(date);
  };

  return (
    <Modal animationType="slide" transparent={true} visible={isModalVisible}>
      <ScrollView contentContainerStyle={styles.centeredView}>
        <View style={styles.modalView}>
          <TextInput
            style={styles.textInput}
            placeholder={"Task Name..."}
            placeholderTextColor="grey"
            onChangeText={(value) => {
              settitle(value);
            }}
          ></TextInput>
          <TextInput
            style={styles.textInput}
            placeholder={"Task Notes..."}
            placeholderTextColor="grey"
            onChangeText={(value) => {
              setnotes(value);
            }}
          ></TextInput>
          <TextInput
            style={styles.textInput}
            keyboardType="numeric"
            placeholder={"Task Duration in minutes..."}
            placeholderTextColor="grey"
            onChangeText={(value) => {
              setduration(parseInt(value.replace(/[^0-9]/g, "")));
            }}
          ></TextInput>
          <Text style={styles.datePickerText}>Select Task Deadline</Text>
          <DateTimePicker
            value={selectedEndDate}
            mode={"datetime"}
            onChange={handleConfirmEndTime}
            accentColor={THEME.COLORS.primary}
          />
          <View style={styles.modalConfirmContainer}>
            {errorText !== "" ? (
              <Text style={styles.errorText}>{errorText}</Text>
            ) : (
              <></>
            )}
            <BasicBtn
              iconUrl={<></>}
              handlePress={handleSubmitForm}
              buttonText={"Create Task"}
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
      </ScrollView>
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
    minHeight: 150,
    marginTop: 20,
  },
  datePickerText: {
    marginBottom: 10,
    marginTop: 10,
    color: THEME.COLORS.darker,
    fontSize: THEME.SIZES.medium,
  },
  datePickedText: {
    marginBottom: 15,
    color: THEME.COLORS.darker,
    fontSize: THEME.SIZES.medium,
  },
  errorText: {
    marginTop: 15,
    color: "red",
  },
});

export default CreateTaskForm;
