import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Constants
import { colors } from "../../assets/constants";
import { Hcontext } from "../../context/Hcontext";

// Components
import Header from "../../components/common/Header";
import InputField from "../../components/input/InputField";
import Button from "../../components/buttons/Button";
import PhoneInputField from "../../components/input/PhoneInputField";
import ParentOtp from "../../components/common/ParentOtp";

const avatarList = [
  { id: 0, image: require("../../assets/images/male3.png"), selected: false },
  { id: 1, image: require("../../assets/images/male1.png"), selected: false },
  { id: 2, image: require("../../assets/images/male2.png"), selected: false },
  { id: 3, image: require("../../assets/images/male4.png"), selected: false },
  { id: 4, image: require("../../assets/images/male5.png"), selected: false },
];

const Profile = (props) => {
  // Prop Destructuring
  const { navigation } = props;

  // Context Variables
  const {
    authState,
    authDispatch,
    userProfileEdit,
    getUserProfile,
    snackDispatch,
  } = useContext(Hcontext);

  // State Variables
  const [editMode, setEditMode] = useState(false);
  const [nickName, setNickName] = useState(
    authState?.user?.user ? authState?.user?.user.nickname : ""
  );
  const [userName, setUserName] = useState(
    authState?.user?.user ? authState?.user?.user.username : ""
  );
  const [email, setEmail] = useState(
    authState?.user?.user ? authState?.user?.user.email : ""
  );
  const [phone, setPhone] = useState(
    authState?.user?.user ? authState?.user?.user.mobile : ""
  );
  const [gender, setGender] = useState(
    authState?.user?.user ? authState?.user?.user.gender : ""
  );
  const [age, setAge] = useState(
    authState?.user?.user ? String(authState?.user?.user.age) : ""
  );
  const [otpVerified, setOtpVerified] = useState(false);
  const [loading, setLoading] = useState(false);

  // Mounting
  useEffect(() => {
    // Getting the updated user profile
    fetchUserProfile(authState.user.access_token);
  }, []);

  const fetchUserProfile = async (token) => {
    setLoading(true);
    try {
      // get updated user profile from backedend
      const userProfile = await getUserProfile({ token });

      // getting user profile saved in phone memory
      const userRes = await AsyncStorage.getItem("USER");

      // merging the updated profile data
      const dataToMemory = { ...JSON.parse(userRes), user: userProfile.data };

      // saveing the updated profile data to memory
      await AsyncStorage.setItem("USER", JSON.stringify(dataToMemory));

      // saving the data to global storage
      if (userProfile.status === "success")
        authDispatch({ type: "USER_UPDATE", payload: userProfile.data });
    } catch (err) {
      console.log("Some issue while getting user profile - ", err);
    }
    setLoading(false);
  };

  const submitHandler = async () => {
    setLoading(true);
    try {
      // sending the updated profile to backend
      const updatedProfile = await userProfileEdit({
        nickName,
        userProfileId: authState.user.user.user_profile_id,
        age: Number(age),
        gender,
        userName,
        email,
        phone,
      });

      console.log("Check teh edit mode - ", updatedProfile);

      if (updatedProfile.status == "error") {
        setLoading(false);

        if (updatedProfile.message === "Mobbile number already taken") {
          return snackDispatch({
            type: "SHOW_SNACK",
            payload: "This mobile number is already registered",
          });
        } else if (updatedProfile.message === "Email already taken") {
          return snackDispatch({
            type: "SHOW_SNACK",
            payload: "This Email ID is already registered",
          });
        }
        return snackDispatch({
          type: "SHOW_SNACK",
          payload: updatedProfile.message,
        });
      }

      setEditMode(false);

      // fetching the updated data and saving to memory
      fetchUserProfile(authState.user.access_token);
      navigation.goBack();
    } catch (err) {
      console.log("Some issue while editing profile (Profile.js) - ", err);
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Header showLogo={false} showBack={true} navigation={navigation} />

      <KeyboardAwareScrollView style={{ paddingHorizontal: wp(10) }}>
        {/* Sized Box */}
        <View style={{ height: hp(2) }} />
        <View style={styles.profileImageContainer}>
          <Image
            source={require("../../assets/images/male3.png")}
            resizeMode="contain"
            style={styles.profileImage}
          />

          {/* Sized Box */}
          <View style={{ width: wp(4) }} />

          <View style={styles.profileNameBox}>
            <Text style={styles.profileName}>
              {authState?.user?.user ? authState?.user?.user.username : ""}
            </Text>
            {!editMode ? (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setEditMode(true)}
                style={styles.editButton}
              >
                <Text style={styles.editButtonText}>Edit Profile</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>

        {/* Sized Box */}
        <View style={{ height: hp(4) }} />

        <View>
          {editMode ? (
            <>
              <Text style={styles.profileInputTitle}>Select Avatar</Text>
              <ScrollView horizontal={true}>
                {avatarList.map((avatar) => (
                  <View key={avatar.id}>
                    <Image
                      source={avatar.image}
                      resizeMode="contain"
                      style={styles.avatarSelect}
                    />
                    {/* Sized Box */}
                    <View style={{ width: wp(14) }} />
                  </View>
                ))}
              </ScrollView>
            </>
          ) : null}

          {/* Sized Box */}
          <View style={{ height: hp(2) }} />

          <InputField
            title="Nick Name"
            placeHolder="Enter nick name"
            value={nickName}
            onChangeText={(text) => setNickName(text)}
            editable={editMode}
          />

          {/* Sized Box */}
          <View style={{ height: hp(2) }} />

          <InputField
            title="Username"
            placeHolder="Enter user name"
            value={userName}
            onChangeText={(text) => setUserName(text)}
            editable={editMode}
          />

          {/* Sized Box */}
          <View style={{ height: hp(2) }} />

          <InputField
            title="Email"
            placeHolder="Enter email"
            value={email}
            onChangeText={(text) => setEmail(text)}
            editable={editMode}
          />

          {/* Sized Box */}
          <View style={{ height: hp(2) }} />
          <PhoneInputField
            title="Phone Number"
            placeHolder="Enter phone number"
            value={phone}
            onChangeText={(text) => setPhone(text)}
            editable={editMode}
          />

          {/* <InputField
            title="Phone Number (+91)"
            placeHolder="Enter phone number"
            value={phone}
            onChangeText={(text) => setPhone(text)}
            editable={editMode}
          /> */}

          {/* Sized Box */}
          <View style={{ height: hp(2) }} />

          <InputField
            title="Gender"
            placeHolder="Enter gender"
            value={gender}
            onChangeText={(text) => setGender(text)}
            editable={editMode}
          />

          {/* Sized Box */}
          <View style={{ height: hp(2) }} />

          <InputField
            title="Age"
            placeHolder="Enter age"
            keyboardType="numeric"
            value={age}
            onChangeText={(text) => setAge(text)}
            editable={editMode}
          />

          {/* Sized Box */}
          <View style={{ height: hp(2) }} />

          {editMode && age <= 18 && (
            <ParentOtp
              otpVerified={otpVerified}
              setOtpVerified={setOtpVerified}
            />
          )}

          {/* Sized Box */}
          <View style={{ height: hp(2) }} />
        </View>
        {editMode ? (
          <Button
            text="Save Changes"
            pressHandler={submitHandler}
            loading={loading}
            disabled={age <= 18 ? !otpVerified : false}
          />
        ) : null}

        {/* Sized Box */}
        <View style={{ height: hp(4) }} />
      </KeyboardAwareScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  profileImageContainer: {
    // backgroundColor: "red",
    flexDirection: "row",
  },
  profileImage: {
    width: hp(10),
    height: hp(10),
  },
  profileNameBox: {
    // backgroundColor: "yellow",
    paddingVertical: hp(1),
    justifyContent: "space-between",
  },
  profileName: {
    fontSize: RFValue(18),
    fontFamily: "PoppinsSemiBold",
  },
  editButton: {
    backgroundColor: colors.primary,
    height: hp(3.5),
    paddingHorizontal: wp(6),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: hp(100),
  },
  editButtonText: {
    fontSize: RFValue(10),
    fontFamily: "Poppins",
    textAlign: "center",
  },
  profileInputTitle: {
    fontSize: RFValue(12),
    color: "#758080",
    fontFamily: "Poppins",
    paddingBottom: 4,
  },
  avatarSelect: {
    width: hp(5),
    height: hp(5),
  },
});

export default Profile;
