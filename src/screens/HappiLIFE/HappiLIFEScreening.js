import React, {
  useState,
  useEffect,
  useRef,
  useContext,
  memo,
  useCallback,
} from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Constants
import { colors } from "../../assets/constants";
import { Hcontext } from "../../context/Hcontext";

// Components
import ScreeningCard from "../../components/cards/ScreeningCard";
import ExitScreeningModal from "../../components/Modals/ExitScreeningModal";

const Header = (props) => {
  // Prop Destructuring
  const { backHandler } = props;

  return (
    <View style={styles.headerContainer}>
      <View style={styles.headerBox}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={backHandler}
          // style={{ backgroundColor: "red" }}
        >
          <Ionicons name="ios-chevron-back" size={hp(4)} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const HappiLIFEScreening = (props) => {
  // Prop Destructuring
  const { navigation } = props;

  // Context Variables
  const {
    authState,
    authDispatch,
    startAssessment,
    submitAnswer,
    screenTrafficAnalytics,
    snackDispatch,
  } = useContext(Hcontext);

  // State Variables
  const [showExitModal, setShowExitModal] = useState(false);
  const [screeningData, setScreeningData] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [screenLoading, setScreenLoading] = useState(false);

  // Ref Variables
  const listRef = useRef();
  const itemRefs = useRef([]); // refs to each item View

  // Mounting
  useEffect(() => {
    initialMount();
  }, []);

  // Auto-scroll to the newly active question whenever selectedIndex advances
  useEffect(() => {
    if (selectedIndex <= 0) return;

    const timer = setTimeout(() => {
      const itemRef = itemRefs.current[selectedIndex];
      if (!itemRef || !listRef.current) return;

      itemRef.measureLayout(
        listRef.current.getScrollableNode?.() ?? listRef.current,
        (x, y) => {
          listRef.current?.scrollTo({ y, animated: true });
        },
        () => console.log("measureLayout failed"),
      );
    }, 150);

    return () => clearTimeout(timer);
  }, [selectedIndex]);

  const initialMount = async () => {
    try {
      console.log("Screening mount log - ", props);
      const token = authState?.user?.access_token;
      if (!token) {
        console.log("No access token found in authState");
        return;
      }
      getAssessment(token);
      screenTrafficAnalytics({ screenName: "HappiLIFE Screening Assessment" });
    } catch (err) {
      console.log(
        "Some issue while initial mount (HappiLIFEScreening.js) - ",
        err,
      );
    }
  };

  const getAssessment = async (token) => {
    setScreenLoading(true);
    setSelectedIndex(0);
    try {
      const data = await startAssessment({ token });
      console.log("The raw received data - ", data);
      
      if (!data || !data.questions || data.questions.length === 0) {
        console.log("No questions received from API");
        snackDispatch({
          type: "SHOW_SNACK",
          payload: "No screening questions available at the moment.",
        });
        setScreeningData([]);
        return;
      }
      
      const modifiedData = data.questions.map((item, index) => {
        return { ...item, disabled: index > 0, position: index };
      });
      console.log("The received assessment data - ", modifiedData);
      setScreeningData(modifiedData);
    } catch (err) {
      console.log("Some issue while getting assessment - ", err);
      snackDispatch({
        type: "SHOW_SNACK",
        payload: "Failed to load screening questions. Please try again.",
      });
      setScreeningData([]);
    }
    setScreenLoading(false);
  };

  if (screenLoading)
    return (
      <View
        style={{
          ...styles.container,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="small" color={colors.loaderColor} />
      </View>
    );

  return (
    <View style={styles.container}>
      <Header backHandler={() => setShowExitModal(true)} />

      <ExitScreeningModal
        showModal={showExitModal}
        setShowModal={setShowExitModal}
        navigation={navigation}
      />

      {/* Sized Box */}
      <View style={{ height: hp(1) }} />

      <View style={{ flex: 1 }}>
        <View style={{ paddingHorizontal: wp(10) }}>
          <Text style={styles.pageTitle}>HappiLIFE Awareness Tool</Text>
          <Text style={styles.pageSubTitle}>
            Answer these simple questions for an insightful emotional wellbeing
            summary
          </Text>
        </View>

        {/* Sized Box */}
        <View style={{ height: hp(2) }} />

        {/* Screening Questions */}
        <View style={{ flex: 1 }}>
          {screeningData.length === 0 ? (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: wp(10) }}>
              <Text style={{ fontSize: RFValue(14), fontFamily: "Poppins", color: colors.borderLight, textAlign: "center" }}>
                No screening questions available. Please try again later or contact support.
              </Text>
            </View>
          ) : (
            <ScrollView ref={listRef}>
              {screeningData.map((item, index) => (
                <View
                  key={item.id}
                  ref={(el) => (itemRefs.current[index] = el)}
                  style={{ paddingHorizontal: wp(10) }}
                >
                  <ScreeningCard
                    listRef={listRef}
                    data={screeningData}
                    setData={setScreeningData}
                    item={item}
                    index={index}
                    selectedIndex={selectedIndex}
                    setSelectedIndex={setSelectedIndex}
                    getAssessment={getAssessment}
                    {...props}
                  />
                  <View style={{ height: hp(2) }} />
                </View>
              ))}
              <View style={{ height: hp(44) }} />
            </ScrollView>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    height: hp(96),
  },
  headerContainer: {
    width: wp(100),
    paddingTop: hp(10),
    paddingBottom: hp(1),
    paddingHorizontal: wp(4),
  },
  skipButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  skipText: {
    fontSize: RFValue(14),
    fontFamily: "Poppins",
    color: colors.primaryText,
    marginLeft: wp(1),
  },
  pageTitle: {
    fontSize: RFValue(22),
    fontFamily: "PoppinsSemiBold",
    color: colors.pageTitle,
  },
  pageSubTitle: {
    fontSize: RFValue(10),
    fontFamily: "Poppins",
    color: colors.borderLight,
  },
});

export default memo(HappiLIFEScreening);
