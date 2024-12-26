import React, { useState, useEffect, useContext, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";

// Constants
import { Hcontext } from "../../context/Hcontext";
import { colors } from "../../assets/constants";

// Components
import Header from "../../components/common/Header";
import NotificationCard from "../../components/cards/NotificationCard";

// Dummy Data
const notificationsList = [
  {
    id: 0,
    title:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor",
    read: true,
  },
  {
    id: 1,
    title:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor",
    read: false,
  },
  {
    id: 2,
    title:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor",
    read: false,
  },
  {
    id: 3,
    title:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor",
    read: false,
  },
];

const Notification = (props) => {
  // Prop Destructuring
  const { navigation } = props;

  // Context Variables
  const { getNotifications, snackDispatch } = useContext(Hcontext);

  // State Variables
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  // Hits when focus hits
  useFocusEffect(
    React.useCallback(() => {
      fetchNotifications();
      return () => {};
    }, [])
  );

  // Fetching the notifications
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const notificationRes = await getNotifications();
      console.log("Teh fetched notifications are - ", notificationRes);
      if (notificationRes.status === "success") {
        setNotifications(notificationRes.list);
      }
    } catch (err) {
      console.log("Some issue while fetching notfications - ", err);
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Header showNav={false} navigation={navigation} />

      <View style={{ height: hp(2) }} />

      <View style={{ paddingHorizontal: wp(10), flex: 1 }}>
        <View style={{ flex: 1 }}>
          {/* Title Section */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={styles.title}>Notifications</Text>
            {/* <TouchableOpacity
              style={styles.actionButton}
              activeOpacity={0.7}
              onPress={() => {}}
            >
              <Text style={styles.actionButtonText}>Mark all as Read</Text>
            </TouchableOpacity> */}
          </View>

          {/* Sized Box */}
          <View style={{ height: hp(4) }} />

          {notifications.length ? (
            <FlatList
              data={notifications}
              renderItem={({ item }) => (
                <>
                  <NotificationCard key={item.id} data={item} />

                  <View style={{ height: hp(2) }} />
                </>
              )}
              keyExtractor={(item) => item.id}
              onRefresh={fetchNotifications}
              refreshing={loading}
            />
          ) : (
            <View>
              <Text
                style={{
                  fontSize: RFValue(16),
                  fontFamily: "PoppinsMedium",
                  color: colors.borderLight,
                  textAlign: "center",
                }}
              >
                No Notification
              </Text>
            </View>
          )}

          {/* Cards Section */}
          {/* {notifications.length ? (
            notifications.map((data) => (
              <>
                <NotificationCard key={data.id} data={data} />
                
                <View style={{ height: hp(2) }} />
              </>
            ))
          ) : (
            <View>
              <Text
                style={{
                  fontSize: RFValue(16),
                  fontFamily: "PoppinsMedium",
                  color: colors.borderLight,
                  textAlign: "center",
                }}
              >
                No Notification
              </Text>
            </View>
          )} */}
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  title: {
    fontSize: RFValue(24),
    fontFamily: "PoppinsSemiBold",
    color: colors.pageTitle,
  },
  actionButton: {
    // paddingVertical: hp(0.5),
    // paddingHorizontal: hp(2),
    backgroundColor: colors.primary,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    width: wp(26),
    height: hp(4),
  },
  actionButtonText: {
    fontSize: RFValue(8),
    fontFamily: "Poppins",
  },
});

export default Notification;
