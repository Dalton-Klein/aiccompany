import { Text, View, Modal, TextInput, Switch, ScrollView } from "react-native";
import { StyleSheet } from "react-native";
import * as THEME from "../../constants/theme";
import BasicBtn from "../tiles/buttons/basicButton";
import { useEffect, useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";
import SelectDropdown from "react-native-select-dropdown";
import React from "react";

const CreateEventForm = ({ isModalVisible, handleCreate, handleCancel }) => {
  const recurrenceOptions = ["Day(s)", "Week(s)", "Month(s)"];
  const [errorText, seterrorText] = useState("");
  const [title, settitle] = useState("");
  const [notes, setnotes] = useState("");
  const [isSeries, setisSeries] = useState(false);
  const [seriesReccurenceNumber, setseriesReccurenceNumber] = useState(1);
  const [seriesReccurenceFrequency, setseriesReccurenceFrequency] =
    useState("");
  const [selectedSeriesEndDate, setselectedSeriesEndDate] = useState(
    new Date()
  );
  const [selectedStartDate, setselectedStartDate] = useState(new Date());
  const [duration, setduration] = useState("60");

  useEffect(() => {
    setInitialFormValues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setInitialFormValues = () => {
    const remainder = 15 - (moment().minute() % 15);
    const dateTime = moment().add(remainder, "minutes");
    setselectedStartDate(dateTime.toDate());
    setduration("60");
    setselectedSeriesEndDate(dateTime.add(1, "hour").toDate());
    setseriesReccurenceNumber(1);
    setseriesReccurenceFrequency("");
    setisSeries(false);
  };

  const handleSubmitForm = () => {
    let hasError = false;
    if (title.length < 3) {
      seterrorText("Title too short!");
      hasError = true;
    }
    if (!selectedStartDate) {
      seterrorText("Must choose Event Start Time!");
      hasError = true;
    }
    if (!duration) {
      seterrorText("Must choose Event Duration!");
      hasError = true;
    }
    if (isSeries) {
      if (seriesReccurenceNumber < 1) {
        seterrorText("Must choose frequency options!");
        hasError = true;
      }
      if (seriesReccurenceFrequency === "") {
        seterrorText("Must choose frequency options!");
        hasError = true;
      }
      if (!selectedSeriesEndDate) {
        seterrorText("Must choose Series End Date!");
        hasError = true;
      }
    }
    if (!hasError) {
      handleCreate({
        title,
        notes,
        start_time: selectedStartDate,
        end_time: moment(selectedStartDate)
          .add(parseInt(duration), "minutes")
          .toDate(),
        is_series: isSeries,
        series_reccurence_number: seriesReccurenceNumber,
        series_reccurence_frequency: seriesReccurenceFrequency,
        series_end_time: selectedSeriesEndDate,
      });
      setInitialFormValues();
      seterrorText("");
    }
  };

  const handleConfirmStartTime = (e: any, date: any) => {
    setselectedStartDate(date);
  };

  const toggleSeriesSwitch = () => {
    setisSeries(!isSeries);
  };

  const handleConfirmSeriesEndTime = (e: any, date: any) => {
    setselectedSeriesEndDate(date);
  };

  return (
    <Modal animationType="slide" transparent={true} visible={isModalVisible}>
      <ScrollView contentContainerStyle={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.datePickerText}>*Event Name</Text>
          <TextInput
            style={styles.textInput}
            placeholder={"Event Name"}
            placeholderTextColor="grey"
            onChangeText={(value) => {
              settitle(value);
            }}
          ></TextInput>
          <Text style={styles.datePickerText}>*Select Event Start Time</Text>
          <DateTimePicker
            value={selectedStartDate}
            mode={"datetime"}
            onChange={handleConfirmStartTime}
            accentColor={THEME.COLORS.primary}
            minuteInterval={15}
            style={styles.datePicker}
          />
          <Text
            style={styles.datePickerText}
          >{`Event Duration (Minutes)`}</Text>
          <TextInput
            style={styles.textInput}
            keyboardType="numeric"
            placeholder={"Event Duration in minutes..."}
            placeholderTextColor="grey"
            value={duration}
            onChangeText={(value) => {
              setduration(value);
            }}
          ></TextInput>
          <Text style={styles.datePickerText}>Event Notes</Text>
          <TextInput
            style={styles.textInput}
            placeholder={"Event Notes"}
            placeholderTextColor="grey"
            onChangeText={(value) => {
              setnotes(value);
            }}
          ></TextInput>
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

              <Text style={styles.datePickerText}>Select Series End Date</Text>

              <DateTimePicker
                value={selectedSeriesEndDate}
                mode={"datetime"}
                onChange={handleConfirmSeriesEndTime}
                minuteInterval={15}
              />
            </View>
          ) : (
            <></>
          )}
          <View style={styles.modalConfirmContainer}>
            {errorText !== "" ? (
              <Text style={styles.errorText}>{errorText}</Text>
            ) : (
              <></>
            )}
            <BasicBtn
              iconUrl={<></>}
              handlePress={handleSubmitForm}
              buttonText={"Create Event"}
              isCancel={false}
            />
            <BasicBtn
              iconUrl={<></>}
              handlePress={() => {
                seterrorText("");
                handleCancel();
              }}
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
    minHeight: 175,
    marginTop: 20,
  },
  datePickerText: {
    marginBottom: 10,
    marginTop: 10,
    color: THEME.COLORS.darker,
    fontSize: THEME.SIZES.medium,
  },
  datePicker: {
    marginBottom: 15,
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
    marginTop: 20,
  },
  seriesSwitch: {
    marginBottom: 10,
  },
  recurrenceBox: {
    alignItems: "center",
    justifyContent: "space-between",
    minWidth: "100%",
  },
  errorText: {
    marginTop: 15,
    color: "red",
    marginBottom: 10,
  },
});

export default CreateEventForm;
