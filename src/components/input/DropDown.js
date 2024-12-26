import React from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import SelectDropdown from "react-native-select-dropdown";
import { FontAwesome5, FontAwesome } from "@expo/vector-icons";

// Constants
import { colors } from "../../assets/constants";

const DropDown = (props) => {
  // Prop Destructuring
  const {
    title,
    placeHolder,
    data = [],
    setSelectedData,
    search = null,
  } = props;
  return (
    <View>
      <Text style={styles.text}>{title}</Text>
      <SelectDropdown
        data={data.map((item) => item.name)}
        onSelect={(selectedItem, index) => {
          console.log("The selected item - ", data[index]);
          setSelectedData(data[index]);
        }}
        buttonTextAfterSelection={(selectedItem, index) => {
          // text represented after item is selected
          // if data array is an array of objects then return selectedItem.property to render after item is selected
          return selectedItem;
        }}
        rowTextForSelection={(item, index) => {
          // text represented for each item in dropdown
          // if data array is an array of objects then return item.property to represent item in dropdown
          return item;
        }}
        defaultButtonText={placeHolder}
        buttonStyle={styles.container}
        buttonTextStyle={styles.containerText}
        dropdownStyle={styles.dropDownContainer}
        rowTextStyle={styles.rowText}
        renderDropdownIcon={() => (
          <FontAwesome5 name="chevron-down" size={hp(2)} color="black" />
        )}
        search={search}
        searchInputStyle={styles.searchInputStyleStyle}
        searchPlaceHolder={"Search here"}
        searchPlaceHolderColor={colors.borderDark}
        renderSearchInputLeftIcon={() => {
          return (
            <FontAwesome
              name={"search"}
              color={colors.borderDark}
              size={hp(2)}
            />
          );
        }}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  text: {
    fontSize: RFValue(12),
    // color: "#758080",
    color: "#000",
    fontFamily: "Poppins",
    paddingBottom: 4,
  },
  container: {
    backgroundColor: "#EFFEFE",
    width: "100%",
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: 6,
    height: hp(5),
  },
  containerText: {
    fontSize: RFValue(12),
    fontFamily: "Poppins",
    color: colors.borderLight,
    textAlign: "left",
  },
  dropDownContainer: {
    backgroundColor: "#EFFEFE",
    borderRadius: 6,
    textAlign: "left",
    borderWidth: 1,
    borderColor: colors.borderDark,
  },
  rowText: {
    fontSize: RFValue(13),
    fontFamily: "Poppins",
    color: colors.borderDark,
    textAlign: "left",
  },
  searchInputStyleStyle: {
    backgroundColor: "#EFFEFE",
    borderBottomWidth: 1,
    borderBottomColor: colors.borderDim,
  },
});

export default DropDown;
