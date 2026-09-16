import React, { useState, useEffect, useContext } from "react";
import useIsMounted from "../../hooks/useIsMounted";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFValue } from "react-native-responsive-fontsize";
import { Feather } from "@expo/vector-icons";
import Collapsible from "react-native-collapsible";

// Constants
import { colors, happiVoice_constants } from "../../assets/constants";
import { Hcontext } from "../../context/Hcontext";
import {
  growthPlanNames,
  validityMap,
  growthPlanFeatures,
  featureLabels,
  getFeatureValue,
  formatPrice,
} from "./ExploreServices";

// Known service descriptions (API returns raw Package rows)
const descriptionMap = {
  "HappiLIFE Screening":
    "Evaluate your wellbeing on several parameters of emotional and mental health with a unique profile based approach.",
  "HappiLIFE Summary Reading":
    "Enrich yourself with a 24*7 access to 5000+ minutes of curated, well researched self-help content that includes video, audio, blogs and more.",
  HappiBUDDY:
    "Connect with a professional expert buddy in a personal emotional log room that is non-judgemental, anonymous, and 100% confidential.",
  HappiSELF:
    "Self-manage your emotional wellbeing with globally validated, interactive self help tools that include mind soothing content and gamified exercises.",
};

// Tolerant match: "HappiBUDDY" / "Happi BUDDY" → "BUDDY", etc.
const matchPlanKey = (name) => {
  const raw = (name || "").toUpperCase().replace(/^HAPPI\s*/i, "").trim();
  return growthPlanNames.find((key) => key === raw) || null;
};

const SubscriptionCard = ({ subscription }) => {
  // State Variables
  const [expanded, setExpanded] = useState(false);

  const name = subscription.name;
  const planKey = matchPlanKey(name);
  const features = planKey ? growthPlanFeatures[planKey] || {} : null;
  const featureEntries = features ? Object.entries(features) : [];
  const description =
    descriptionMap[name] ||
    happiVoice_constants?.happiVoice_desc ||
    subscription.description ||
    "";
  const price = formatPrice(subscription.regular_price);
  const validity =
    subscription.validity ||
    validityMap[name?.toUpperCase?.()] ||
    validityMap[planKey] ||
    "";

  return (
    <View style={styles.card}>
      {/* Top Row: Name + Pricing + Dropdown */}
      <View style={styles.topRow}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setExpanded(!expanded)}
          style={styles.nameWrap}
        >
          <Text style={styles.cardName}>{name}</Text>
        </TouchableOpacity>

        {price ? (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setExpanded(!expanded)}
            style={styles.priceWrap}
          >
            <Text style={styles.price}>{price}</Text>
          </TouchableOpacity>
        ) : null}

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setExpanded(!expanded)}
        >
          <Feather
            name={expanded ? "chevron-up" : "chevron-down"}
            size={hp(2.2)}
            color="#45434D"
          />
        </TouchableOpacity>
      </View>

      {/* Expanded Details */}
      <Collapsible collapsed={!expanded}>
        <View style={styles.detailsBox}>
          {featureEntries.length ? (
            featureEntries.map(([key, item]) => {
              const { count } = getFeatureValue(item);
              return (
                <View key={key} style={styles.featureRow}>
                  <Image
                    source={require("../../assets/images/bullet_point.png")}
                    style={styles.bulletPoint}
                    resizeMode="contain"
                  />
                  <Text style={styles.featureLabel}>
                    {featureLabels[key] || key.replace(/_/g, " ")}
                    {count > 0 ? (
                      <Text style={styles.featureValue}>
                        {" "}
                        – {count} session{count === 1 ? "" : "s"}
                      </Text>
                    ) : null}
                  </Text>
                </View>
              );
            })
          ) : description ? (
            <Text style={styles.description}>{description}</Text>
          ) : null}
        </View>
      </Collapsible>

      {/* Validity Row */}
      {validity ? (
        <View style={styles.validityRow}>
          <Text style={styles.validityText}>
            Validity: <Text style={styles.validityValue}>{validity}</Text>
          </Text>
        </View>
      ) : null}
    </View>
  );
};

const SubscribedServices = (props) => {
  // Prop Destructuring
  const { navigation } = props;

  // Context Variables
  const { getSubscriptions, screenTrafficAnalytics } = useContext(Hcontext);

  // State Variables
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mount guard — prevents setState on unmounted component
  const isMounted = useIsMounted();

  // Mounting
  useEffect(() => {
    fetchSubscriptions();
    screenTrafficAnalytics({ screenName: "Subscribed Services Screen" });
    return () => {};
  }, []);

  const fetchSubscriptions = async () => {
    if (!isMounted.current) return;
    setLoading(true);
    try {
      const mySub = await getSubscriptions();
      console.log("che cthe my suvbscribed - ", mySub);

      if (mySub.status === "success") {
        if (!isMounted.current) return;
        setSubscriptions(mySub.data || []);
      }
    } catch (err) {
      console.log("Some issue while fetching subscription - ", err);
    }
    if (isMounted.current) setLoading(false);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        {/* Sized Box */}
        <View style={{ height: hp(6) }} />

        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <Image
            source={require("../../assets/images/happimynd_logo.png")}
            style={styles.headerLogo}
            resizeMode="contain"
          />
          <Text style={styles.headerTitle}>My Subscription</Text>
        </View>
      </View>

      {/* Cards */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.bodyContainer}>
          {/* Sized Box */}
          <View style={{ height: hp(2.8) }} />

          {loading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          ) : subscriptions.length ? (
            subscriptions.map((subscription) => (
              <React.Fragment key={subscription.id}>
                <SubscriptionCard subscription={subscription} />
                {/* Sized Box */}
                <View style={{ height: hp(2.5) }} />
              </React.Fragment>
            ))
          ) : (
            <Text style={styles.emptyText}>No Subscriptions</Text>
          )}

          {/* Sized Box */}
          <View style={{ height: hp(4) }} />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F8F7FF",
    flex: 1,
  },
  headerContainer: {
    width: wp(100),
    height: hp(20),
    paddingHorizontal: wp(4),
    paddingBottom: hp(1.5),
    backgroundColor: "#EEE7FF",
    alignItems: "center",
    justifyContent: "center",
  },
  headerLogo: {
    width: hp(10),
    height: hp(10),
  },
  headerTitle: {
    fontSize: RFValue(18),
    fontFamily: "PoppinsSemiBold",
    color: "#111111",
  },
  bodyContainer: {
    paddingHorizontal: wp(3.5),
  },
  loaderContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: hp(10),
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E4DFF4",
    borderRadius: hp(2.7),
    paddingHorizontal: wp(5),
    paddingVertical: hp(2.6),
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  nameWrap: {
    flex: 1,
  },
  cardName: {
    fontSize: RFValue(14),
    fontFamily: "PoppinsSemiBold",
    color: "#8250F6",
  },
  priceWrap: {
    marginLeft: wp(1),
  },
  price: {
    fontSize: RFValue(16),
    fontFamily: "PoppinsBold",
    color: "#8250F6",
  },
  validityRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: hp(1.2),
  },
  validityText: {
    fontSize: RFValue(12),
    fontFamily: "Poppins",
    color: "#4C4A55",
    flex: 1,
  },
  validityValue: {
    color: "#4C4A55",
  },
  detailsBox: {
    marginTop: hp(1.8),
    paddingTop: hp(1.8),
    borderTopWidth: 1,
    borderTopColor: "#E4DFF4",
  },
  description: {
    fontSize: RFValue(12),
    fontFamily: "Poppins",
    color: "#4C4A55",
    lineHeight: hp(2.2),
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: hp(0.8),
  },
  bulletPoint: {
    width: hp(2),
    height: hp(2),
    marginRight: wp(1.5),
  },
  featureLabel: {
    fontSize: RFValue(12),
    fontFamily: "Poppins",
    color: "#4C4A55",
    flex: 1,
  },
  featureValue: {
    fontSize: RFValue(12),
    fontFamily: "PoppinsSemiBold",
    color: "#8250F6",
  },
  emptyText: {
    fontSize: RFValue(18),
    fontFamily: "PoppinsMedium",
    textAlign: "center",
    color: colors.borderLight,
    marginTop: hp(10),
  },
});

export default SubscribedServices;