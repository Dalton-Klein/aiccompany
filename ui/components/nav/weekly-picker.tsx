import { useState, useEffect } from "react";
import { View, StyleSheet, Text, TouchableOpacity, Modal } from "react-native";
import * as THEME from "../../constants/theme";
import moment from "moment";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import DatePicker from "react-native-modern-datepicker";

const WeeklyPicker = (props) => {
  const [sliderTiles, setsliderTiles] = useState([]);
  const [isDatePickerOpen, setisDatePickerOpen] = useState(false);
  const [selectedDate, setselectedDate] = useState(
    moment().format("YYYY/MM/DD")
  );

  useEffect(() => {
    createSliderTiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    createSliderTiles();
    props.updateCalendarFeed(selectedDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  const createSliderTiles = () => {
    let tempTiles = [];
    const mostRecentSunday = moment(selectedDate, "YYYY/MM/DD").day(0);
    for (let i = 0; i <= 6; i++) {
      const dateData = mostRecentSunday.clone().add(i, "days");
      tempTiles.push(
        <View style={styles.daySliderSlot} key={dateData.format("YYYY-DD-MM")}>
          <Text style={styles.daySliderDayTitleText}>
            {dateData.format("dd")}
          </Text>
          <TouchableOpacity style={styles.dayButton}>
            <Text style={styles.dayOfMonthText}>
              {moment(dateData).format("DD")}
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
    setsliderTiles(tempTiles);
  };

  const handleOpenExpandedPicker = () => {
    setisDatePickerOpen(!isDatePickerOpen);
  };

  const handleWeekChange = (date) => {
    setselectedDate(date);
    handleOpenExpandedPicker();
  };

  return (
    <View style={styles.daySlider}>
      <TouchableOpacity
        style={styles.expandCalendarButton}
        onPress={handleOpenExpandedPicker}
      >
        <FontAwesome
          size={28}
          name="calendar-o"
          color={THEME.COLORS.secondary}
        />
      </TouchableOpacity>
      {sliderTiles}

      {/* MODAL- Expanded Date Picker */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isDatePickerOpen}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <DatePicker
              mode="calendar"
              selected={selectedDate}
              onDateChange={handleWeekChange}
              options={{
                mainColor: THEME.COLORS.primary,
                borderColor: THEME.COLORS.primary,
              }}
            />
            {/* Close Modal Button */}
            <TouchableOpacity
              style={styles.closeCalendarButton}
              onPress={handleOpenExpandedPicker}
            >
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  expandCalendarButton: {
    paddingTop: 5,
  },
  closeCalendarButton: {
    borderRadius: THEME.BORDERSIZES.large,
    borderColor: "black",
    borderWidth: 2,
  },
  daySlider: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 20,
    marginRight: 20,
    minWidth: "90%",
    marginTop: 10,
    marginBottom: 10,
  },
  daySliderSlot: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  dayButton: {},
  daySliderDayTitleText: {
    fontSize: THEME.SIZES.medium,
    color: THEME.COLORS.fontColor,
  },
  dayOfMonthText: {
    color: THEME.COLORS.fontColor,
    fontSize: THEME.SIZES.medium,
    fontWeight: "bold",
  },
  daySliderDaysOfMonth: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    minWidth: "90%",
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
  buttonText: {
    padding: 10,
    color: THEME.COLORS.fontColor,
  },
});

export default WeeklyPicker;
