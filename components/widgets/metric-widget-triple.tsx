import { Text, Image, TouchableOpacity, View } from "react-native";
import { StyleSheet } from "react-native";
import * as THEME from "../../constants/theme";
import React from "react";

const MetricTileTriple = ({
  title1Text,
  title2Text,
  title3Text,
  amount1,
  amount2,
  amount3,
  handlePress,
  isTask,
  isNeutral = false,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.widgetContainer,
        isTask ? styles.taskColor : styles.eventColor,
        isNeutral ? styles.neutralColor : null,
      ]}
      onPress={handlePress}
    >
      <View style={styles.titleBox}>
        <Text style={styles.amountText}>{amount1}</Text>
        <Text style={styles.titleText}>{title1Text}</Text>
      </View>
      <View style={styles.titleBox}>
        <Text style={styles.amountText}>{amount2}</Text>
        <Text style={styles.titleText}>{title2Text}</Text>
      </View>
      <View style={styles.titleBox}>
        <Text style={styles.amountText}>{amount3}</Text>
        <Text style={styles.titleText}>{title3Text}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  widgetContainer: {
    flex: 1,
    borderRadius: THEME.BORDERSIZES.large,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
    minWidth: 150,
    maxWidth: 150,
    minHeight: 150,
    maxHeight: 150,
    shadowColor: THEME.COLORS.darker,
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 2,
  },
  eventColor: {
    backgroundColor: THEME.COLORS.primary,
  },
  taskColor: {
    backgroundColor: THEME.COLORS.secondary,
  },
  neutralColor: {
    backgroundColor: THEME.COLORS.neutral,
  },
  cancelButton: {
    backgroundColor: THEME.COLORS.lighter,
    flex: 1,
    borderRadius: THEME.BORDERSIZES.medium,
    borderWidth: 2,
    borderColor: THEME.COLORS.secondary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    marginLeft: 5,
    marginRight: 5,
    minWidth: "100%",
    maxHeight: 50,
  },
  titleBox: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
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
  titleText: {
    fontWeight: "300",
    color: THEME.COLORS.lighter,
    fontSize: THEME.SIZES.medium,
    textAlign: "center",
  },
  amountText: {
    fontWeight: "900",
    color: THEME.COLORS.lighter,
    fontSize: THEME.SIZES.large,
    textAlign: "center",
  },
});

export default MetricTileTriple;
