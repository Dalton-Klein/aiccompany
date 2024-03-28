import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import * as THEME from "../../constants/theme";
import { useDispatch, useSelector } from "react-redux";
import { setPreferences } from "../../store/userPreferencesSlice";
import { RootState } from "../../store/store";

const TaskViewerNav = () => {
  const preferencesState = useSelector((state: RootState) => state.preferences);
  const dispatch = useDispatch();
  const [selectedOption, setSelectedOption] = useState("Active");

  useEffect(() => {
    setSelectedOption(preferencesState.taskView);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preferencesState.taskView]);

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    dispatch(
      setPreferences({
        ...preferencesState,
        taskView: option,
      })
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.optionButton,
          selectedOption === "Active" && styles.selectedOption,
        ]}
        onPress={() => handleOptionSelect("Active")}
      >
        <Text
          style={
            selectedOption === "Active"
              ? styles.optionSelectedText
              : styles.optionText
          }
        >
          Active
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.optionButton,
          selectedOption === "Overdue" && styles.selectedOption,
        ]}
        onPress={() => handleOptionSelect("Overdue")}
      >
        <Text
          style={
            selectedOption === "Overdue"
              ? styles.optionSelectedText
              : styles.optionText
          }
        >
          Overdue
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.optionButton,
          selectedOption === "Completed" && styles.selectedOption,
        ]}
        onPress={() => handleOptionSelect("Completed")}
      >
        <Text
          style={
            selectedOption === "Completed"
              ? styles.optionSelectedText
              : styles.optionText
          }
        >
          Completed
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 20,
    paddingBottom: 5,
  },
  optionButton: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    minWidth: "30%",
  },
  selectedOption: {
    backgroundColor: THEME.COLORS.primary, // Change color based on your preference
  },
  optionText: {
    color: THEME.COLORS.darker, // Change color based on your preference
    fontWeight: "500",
    textAlign: "center",
  },
  optionSelectedText: {
    color: THEME.COLORS.lighter, // Change color based on your preference
    fontWeight: "500",
    textAlign: "center",
  },
});

export default TaskViewerNav;
