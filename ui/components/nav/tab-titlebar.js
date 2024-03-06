import { useState, useEffect, } from "react";
import { View, TouchableOpacity, Text, StyleSheet, Modal } from "react-native";
import * as THEME from "../../constants/theme";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useNavigationState } from '@react-navigation/native';

const TitleBar = (props) => {
  const [isCalendarPickerOpen, setisCalendarPickerOpen] = useState(false);

  const routeName = useNavigationState(state => 
    state.routes[state.index].name
  );

  const handleOpenCalendarPicker = () => {
    setisCalendarPickerOpen(!isCalendarPickerOpen);
    console.log('toggling? ', isCalendarPickerOpen)
  }
  const handleLeftButtonPress = () => {
    if (routeName === 'calendar') {
      handleOpenCalendarPicker();
    }
  }
  const handleRightButtonPress = () => {

  }
  return (
    <View  style={styles.titleContainer}>
      <View style={styles.titleButtonContainerLeft}>
        {routeName === 'calendar' ? 
          <TouchableOpacity style={styles.titleButton} onPress={handleLeftButtonPress}>
            <FontAwesome size={28} name="level-up" color={THEME.COLORS.secondary} />
          </TouchableOpacity> :
          <></>
        }
       
      </View>
      <Text style={styles.titleText}>{props.title}</Text>
      <View style={styles.titleButtonContainerNonCalendar}>
      {routeName === 'calendar' ? 
          <TouchableOpacity style={styles.titleButton} onPress={handleRightButtonPress}>
            <FontAwesome size={28} name="plus" color={THEME.COLORS.secondary} />
          </TouchableOpacity> :
          <></>
        }
        {/* <TouchableOpacity style={styles.titleButton} onPress={handleRightButtonPress}>
          <FontAwesome size={28} name="ellipsis-v" color={THEME.COLORS.secondary} />
        </TouchableOpacity> */}
      </View>

      {/* MODAL- Calendar Picker */}
      {/* MODAL- Expanded Date Picker */}
      <Modal animationType="slide" transparent={true} visible={isCalendarPickerOpen}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              
              {/* Close Modal Button */}
              <TouchableOpacity style={styles.expandCalendarButton} onPress={handleOpenCalendarPicker}>
                <Text>Close</Text> 
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    minWidth: '100%',
    marginBottom: 5,
  },
  titleButtonContainerLeft: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingLeft: 15,
    paddingRight: 15,
    maxWidth: '25%',
    minWidth: '25%'
  },
  titleButtonContainerNonCalendar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingLeft: 15,
    paddingRight: 15,
    maxWidth: '25%',
    minWidth: '25%'
  },
  titleButtonContainerCalendar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
    paddingRight: 15,
    maxWidth: '25%',
    minWidth: '25%'
  },
  titleButton: {
    paddingLeft: 5,
    paddingRight: 5,
  },
  titleText: {
    color: THEME.COLORS.lighter,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: THEME.SIZES.large,
    minWidth: '50%',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: THEME.COLORS.lighter,
    borderRadius: 20,
    width: '90%',
    padding: 35, 
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: .25,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default TitleBar;
