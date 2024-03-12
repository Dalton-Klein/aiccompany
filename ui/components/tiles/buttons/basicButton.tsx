import { Text, Image, TouchableOpacity, View } from "react-native";
import { StyleSheet } from "react-native";
import * as THEME from "../../../constants/theme";
import { useEffect, useState } from "react";

const BasicBtn = ({ iconUrl, buttonText, handlePress, isCancel }) => {
  return (
    <TouchableOpacity
      style={isCancel ? styles.cancelButton : styles.btnContainer}
      onPress={handlePress}
    >
      <View style={styles.btnContentBox}>
        {iconUrl}
        <Text style={isCancel ? styles.cancelbtnText : styles.btnText}>
          {buttonText}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btnContainer: {
    flex: 1,
    backgroundColor: THEME.COLORS.primary,
    borderRadius: THEME.BORDERSIZES.medium,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    marginLeft: 5,
    marginRight: 5,
    minWidth: "100%",
    maxHeight: 50,
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
    fontSize: THEME.SIZES.medium,
    textAlign: "center",
  },
  cancelbtnText: {
    color: THEME.COLORS.secondary,
    marginLeft: 10,
    fontSize: THEME.SIZES.medium,
    textAlign: "center",
  },
});

export default BasicBtn;
