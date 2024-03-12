import {
  Text,
  Image,
  TouchableOpacity,
  View,
  Modal,
  TextInput,
  Switch,
  ScrollView,
} from "react-native";
import { StyleSheet } from "react-native";
import * as THEME from "../../constants/theme";
import BasicBtn from "../tiles/buttons/basicButton";
import { useEffect, useState } from "react";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import SelectDropdown from "react-native-select-dropdown";

const CreateEventForm = ({ isModalVisible, handleCreate, handleCancel }) => {
  const recurrenceOptions = ["Day(s)", "Week(s)", "Month(s)"];
  const [errorText, seterrorText] = useState("");
  const [title, settitle] = useState("");
  const [notes, setnotes] = useState("");
  const [isSeries, setisSeries] = useState(false);
  const [seriesReccurenceNumber, setseriesReccurenceNumber] = useState(1);
  const [seriesReccurenceFrequency, setseriesReccurenceFrequency] =
    useState("");
  const [selectedSeriesEndDate, setSelectedSeriesEndDate] = useState(null);
  const [isSeriesEndDatePickerVisible, setisSeriesEndDatePickerVisible] =
    useState(false);
  const [isStartDatePickerVisible, setisStartDatePickerVisible] =
    useState(false);
  const [isEndDatePickerVisible, setisEndDatePickerVisible] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);

  useEffect(() => {
    setSelectedStartDate(null);
    setSelectedEndDate(null);
    setSelectedSeriesEndDate(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmitForm = () => {
    let hasError = false;
    if (title.length < 3) {
      seterrorText("Title too short!");
      hasError = true;
    }
    if (!selectedStartDate) {
      seterrorText("Must choose Start Time!");
      hasError = true;
    }
    if (!selectedEndDate) {
      seterrorText("Must choose End Time!");
      hasError = true;
    }
    if (isSeries) {
      if (seriesReccurenceNumber < 1) {
        seterrorText("Must choose frequency options!");
        hasError = true;
      }
    }
    handleCreate({ title, notes });
  };

  const showStartPicker = () => {
    setisStartDatePickerVisible(true);
  };

  const showEndPicker = () => {
    setisStartDatePickerVisible(true);
  };

  const hideAllDatePickers = () => {
    setisStartDatePickerVisible(false);
    setisEndDatePickerVisible(false);
    setisSeriesEndDatePickerVisible(false);
  };

  const handleConfirmStartTime = (date: any) => {
    setSelectedStartDate(date);
    hideAllDatePickers();
  };

  const handleConfirmEndTime = (date: any) => {
    setSelectedEndDate(date);
    hideAllDatePickers();
  };

  const toggleSeriesSwitch = () => {
    setisSeries(!isSeries);
  };

  const handleConfirmSeriesEndTime = (date: any) => {
    setSelectedSeriesEndDate(date);
    hideAllDatePickers();
  };

  return (
    <Modal animationType="slide" transparent={true} visible={isModalVisible}>
      <ScrollView contentContainerStyle={styles.centeredView}>
        <View style={styles.modalView}>
          <TextInput
            style={styles.textInput}
            placeholder={"Event Name"}
            placeholderTextColor="grey"
            onChangeText={(value) => {
              settitle(value);
            }}
          ></TextInput>
          <TextInput
            style={styles.textInput}
            placeholder={"Event Notes"}
            placeholderTextColor="grey"
            onChangeText={(value) => {
              setnotes(value);
            }}
          ></TextInput>
          <TouchableOpacity onPress={showStartPicker}>
            <Text style={styles.datePickerText}>Select Event Start Time</Text>
          </TouchableOpacity>
          {selectedStartDate ? (
            <Text style={styles.datePickedText}>
              {moment(selectedStartDate).format("MMMM Do YYYY, h:mm a")}
            </Text>
          ) : (
            <></>
          )}

          <DateTimePickerModal
            isVisible={isStartDatePickerVisible}
            mode="datetime"
            onConfirm={handleConfirmStartTime}
            onCancel={hideAllDatePickers}
          />
          <TouchableOpacity onPress={showEndPicker}>
            <Text style={styles.datePickerText}>Select Event End Time</Text>
          </TouchableOpacity>
          {selectedEndDate ? (
            <Text style={styles.datePickedText}>
              {moment(selectedEndDate).format("MMMM Do YYYY, h:mm a")}
            </Text>
          ) : (
            <></>
          )}

          <DateTimePickerModal
            isVisible={isEndDatePickerVisible}
            mode="datetime"
            onConfirm={handleConfirmEndTime}
            onCancel={hideAllDatePickers}
          />
          <View style={styles.seriesBox}>
            <Text style={styles.datePickedText}>Is this a series?</Text>
            <Switch
              trackColor={{
                false: THEME.COLORS.dark,
                true: THEME.COLORS.neutral,
              }}
              thumbColor={
                isSeries ? THEME.COLORS.primary : THEME.COLORS.lighter
              }
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSeriesSwitch}
              value={isSeries}
              style={styles.seriesSwitch}
            />
          </View>
          {isSeries ? (
            <View style={styles.recurrenceBox}>
              <Text>Every</Text>
              <SelectDropdown
                data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]}
                defaultButtonText="1"
                onSelect={(selectedItem, index) => {
                  setseriesReccurenceNumber(selectedItem);
                }}
                buttonTextAfterSelection={(selectedItem, index) => {
                  return selectedItem;
                }}
                rowTextForSelection={(item, index) => {
                  return item;
                }}
                buttonStyle={{ marginBottom: 5, marginTop: 5 }}
              />
              <SelectDropdown
                data={recurrenceOptions}
                defaultButtonText="Select Frequency"
                onSelect={(selectedItem, index) => {
                  setseriesReccurenceFrequency(selectedItem);
                }}
                buttonTextAfterSelection={(selectedItem, index) => {
                  return selectedItem;
                }}
                rowTextForSelection={(item, index) => {
                  return item;
                }}
                buttonStyle={{ marginBottom: 5, marginTop: 5 }}
              />
              <TouchableOpacity onPress={showStartPicker}>
                <Text style={styles.datePickerText}>
                  Select Series End Date
                </Text>
              </TouchableOpacity>
              {selectedSeriesEndDate ? (
                <Text style={styles.datePickedText}>
                  {moment(selectedSeriesEndDate).format("MMMM Do YYYY, h:mm a")}
                </Text>
              ) : (
                <></>
              )}

              <DateTimePickerModal
                isVisible={isStartDatePickerVisible}
                mode="datetime"
                onConfirm={handleConfirmSeriesEndTime}
                onCancel={hideAllDatePickers}
              />
            </View>
          ) : (
            <></>
          )}
          <View style={styles.modalConfirmContainer}>
            <BasicBtn
              iconUrl={<></>}
              handlePress={handleSubmitForm}
              buttonText={"Create Event"}
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
  },
  datePickerText: {
    marginBottom: 10,
    marginTop: 10,
    color: THEME.COLORS.primary,
    fontSize: THEME.SIZES.medium,
  },
  datePickedText: {
    marginBottom: 15,
    color: THEME.COLORS.darker,
    fontSize: THEME.SIZES.medium,
  },
  seriesBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    minWidth: "100%",
  },
  seriesSwitch: {
    marginBottom: 10,
  },
  recurrenceBox: {
    alignItems: "center",
    justifyContent: "space-between",
    minWidth: "100%",
  },
});

export default CreateEventForm;
