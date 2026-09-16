import React, { useState, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
  Platform,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFValue } from "react-native-responsive-fontsize";
import { Feather, FontAwesome } from "@expo/vector-icons";
import Collapsible from "react-native-collapsible";
import Modal from "react-native-modal";
import { useFocusEffect } from "@react-navigation/native";

// Components
import { Hcontext } from "../../context/Hcontext";
import { colors } from "../../assets/constants";
import CouponModal from "../../components/Modals/CouponModal";

const growthPlanNames = [
  "SELF STARTER",
  "BUDDY",
  "BUDDY PLUS",
  "CARE 3X",
  "CARE 6X",
  "CARE 12X",
];

const validityMap = {
  "SELF STARTER": "1 Month",
  BUDDY: "1 Month",
  "BUDDY PLUS": "3 Months",
  "CARE 3X": "3 Months",
  "CARE 6X": "6 Months",
  "CARE 12X": "12 Months",
};

const formatPrice = (value) =>
  `₹${Number(value ?? 0).toLocaleString("en-IN")}`;

const growthPlanFeatures = {
  "SELF STARTER": {
    access_to_assessments: true,
    daily_guided_self_reflection: { name: "HappiSelf", included: true },
    expert_curated_learning_resources: { name: "HappiLearn", included: true },
    short_growth_quizzes_and_check_ins: true,
    private_and_confidential_experience: true,
    personalized_reports: true,
    conscious_growth_blueprint: false,
    "24x7_expert_chat": { name: "HappiBuddy", included: false },
    one_on_one_growth_conversations: { name: "SOLV", count: 0 },
    therapist_led_counselling_sessions: { name: "HappiTalk", count: 0 },
    smart_growth_reminders: false,
    live_growth_webinars: false,
    exclusive_community: { name: "HappiVibe", included: false },
  },
  BUDDY: {
    access_to_assessments: true,
    daily_guided_self_reflection: { name: "HappiSelf", included: true },
    expert_curated_learning_resources: { name: "HappiLearn", included: true },
    short_growth_quizzes_and_check_ins: true,
    private_and_confidential_experience: true,
    personalized_reports: true,
    conscious_growth_blueprint: true,
    "24x7_expert_chat": { name: "HappiBuddy", included: true },
    one_on_one_growth_conversations: { name: "SOLV", count: 1 },
    therapist_led_counselling_sessions: { name: "HappiTalk", count: 0 },
    smart_growth_reminders: false,
    live_growth_webinars: false,
    exclusive_community: { name: "HappiVibe", included: false },
  },
  "BUDDY PLUS": {
    access_to_assessments: true,
    daily_guided_self_reflection: { name: "HappiSelf", included: true },
    expert_curated_learning_resources: { name: "HappiLearn", included: true },
    short_growth_quizzes_and_check_ins: true,
    private_and_confidential_experience: true,
    personalized_reports: true,
    conscious_growth_blueprint: true,
    "24x7_expert_chat": { name: "HappiBuddy", included: true },
    one_on_one_growth_conversations: { name: "SOLV", count: 1 },
    therapist_led_counselling_sessions: { name: "HappiTalk", count: 0 },
    smart_growth_reminders: false,
    live_growth_webinars: false,
    exclusive_community: { name: "HappiVibe", included: false },
  },
  "CARE 3X": {
    access_to_assessments: true,
    daily_guided_self_reflection: { name: "HappiSelf", included: true },
    expert_curated_learning_resources: { name: "HappiLearn", included: true },
    short_growth_quizzes_and_check_ins: true,
    private_and_confidential_experience: true,
    personalized_reports: true,
    conscious_growth_blueprint: true,
    "24x7_expert_chat": { name: "HappiBuddy", included: true },
    one_on_one_growth_conversations: { name: "SOLV", count: 1 },
    therapist_led_counselling_sessions: { name: "HappiTalk", count: 3 },
    smart_growth_reminders: true,
    live_growth_webinars: true,
    exclusive_community: { name: "HappiVibe", included: true },
  },
  "CARE 6X": {
    access_to_assessments: true,
    daily_guided_self_reflection: { name: "HappiSelf", included: true },
    expert_curated_learning_resources: { name: "HappiLearn", included: true },
    short_growth_quizzes_and_check_ins: true,
    private_and_confidential_experience: true,
    personalized_reports: true,
    conscious_growth_blueprint: true,
    "24x7_expert_chat": { name: "HappiBuddy", included: true },
    one_on_one_growth_conversations: { name: "SOLV", count: 1 },
    therapist_led_counselling_sessions: { name: "HappiTalk", count: 6 },
    smart_growth_reminders: true,
    live_growth_webinars: true,
    exclusive_community: { name: "HappiVibe", included: true },
  },
  "CARE 12X": {
    access_to_assessments: true,
    daily_guided_self_reflection: { name: "HappiSelf", included: true },
    expert_curated_learning_resources: { name: "HappiLearn", included: true },
    short_growth_quizzes_and_check_ins: true,
    private_and_confidential_experience: true,
    personalized_reports: true,
    conscious_growth_blueprint: true,
    "24x7_expert_chat": { name: "HappiBuddy", included: true },
    one_on_one_growth_conversations: { name: "SOLV", count: 1 },
    therapist_led_counselling_sessions: { name: "HappiTalk", count: 12 },
    smart_growth_reminders: true,
    live_growth_webinars: true,
    exclusive_community: { name: "HappiVibe", included: true },
  },
};

const featureLabels = {
  access_to_assessments: "Access to Assessments",
  daily_guided_self_reflection: "Daily Guided Self Reflection – HappiSelf",
  expert_curated_learning_resources: "Expert Curated Learning – HappiLearn",
  short_growth_quizzes_and_check_ins: "Short Growth Quizzes & Check-ins",
  private_and_confidential_experience: "Private & Confidential Experience",
  personalized_reports: "Personalized Reports",
  conscious_growth_blueprint: "Conscious Growth Blueprint",
  "24x7_expert_chat": "24x7 Expert Chat – HappiBuddy",
  one_on_one_growth_conversations: "One-on-One Growth Conversations – SOLV",
  therapist_led_counselling_sessions: "Therapist-Led Counselling – HappiTalk",
  smart_growth_reminders: "Smart Growth Reminders",
  live_growth_webinars: "Live Growth Webinars",
  exclusive_community: "Exclusive Community – HappiVibe",
};

const getFeatureValue = (item) => {
  if (typeof item === "boolean") return { included: item, count: null };
  if (item && typeof item === "object") {
    if (item.included !== undefined)
      return { included: item.included, count: null };
    if (item.count !== undefined)
      return { included: Number(item.count) > 0, count: item.count };
  }
  return { included: false, count: null };
};

const CheckoutSheet = (props) => {
  // Prop Destructuring
  const {
    showModal,
    setShowModal,
    plan,
    totalAmount,
    showOriginal,
    onApplyCoupon,
    onProceed,
  } = props;

  const hasOffer = plan?.offer && Number(plan.offer.discount) > 0;
  const showStrikethrough = showOriginal || hasOffer;

  return (
    <Modal
      isVisible={showModal}
      onBackButtonPress={() => setShowModal(false)}
      onBackdropPress={() => setShowModal(false)}
      style={{ justifyContent: "flex-end", margin: 0 }}
    >
      <View style={styles.sheetContainer}>
        {/* Amount Section */}
        <View style={styles.sheetAmountSection}>
          <Text style={styles.sheetAmountLabel}>Total Amount</Text>
          <Text style={styles.sheetTotalAmount}>
            {plan ? formatPrice(totalAmount ?? plan.selling_price) : ""}
          </Text>
          {showStrikethrough && plan ? (
            <Text style={styles.sheetOriginalAmount}>
              {formatPrice(plan.price ?? plan.selling_price)}
            </Text>
          ) : null}
        </View>

        {/* Coupon */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onApplyCoupon}
          style={styles.couponButton}
        >
          <Text style={styles.couponText}>Apply Coupon</Text>
        </TouchableOpacity>

        {/* Proceed */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onProceed}
          style={styles.proceedButton}
        >
          <Text style={styles.proceedText}>Proceed</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const PlanCard = (props) => {
  // Prop Destructuring
  const { plan, packageName, selected, onSelect } = props;

  // State Variables
  const [expanded, setExpanded] = useState(false);

  const planName = plan?.name || plan?.expert_level || packageName;
  const hasOffer = plan.offer && Number(plan.offer.discount) > 0;
  const validity =
    validityMap[planName?.toUpperCase?.()] || plan.duration?.name || "";

  const features =
    growthPlanFeatures[planName?.toUpperCase?.()] || plan?.features || {};
  const featureEntries = Object.entries(features);

  return (
    <View style={styles.planCard}>
      {/* Top Row: Checkbox + Name + Pricing + Dropdown */}
      <View style={styles.topRow}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => onSelect(plan)}
          style={styles.checkbox}
        >
          {selected ? (
            <FontAwesome name="check" size={hp(2)} color="#FFFFFF" />
          ) : null}
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setExpanded(!expanded)}
          style={styles.nameWrap}
        >
          <Text style={styles.planName}>{planName}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setExpanded(!expanded)}
          style={styles.priceWrap}
        >
          {hasOffer ? (
            <View style={styles.priceGroup}>
              <ImageBackground
                source={require("../../assets/images/Off_badge.png")}
                style={styles.offBadge}
                resizeMode="contain"
              >
                <Text style={styles.offBadgeText}>
                  {plan.offer.discount}% off
                </Text>
              </ImageBackground>
              <Text style={styles.originalPrice}>{formatPrice(plan.price)}</Text>
              <Text style={styles.price}>{formatPrice(plan.selling_price)}</Text>
            </View>
          ) : (
            <View style={styles.priceGroup}>
              <Text style={styles.price}>{formatPrice(plan.selling_price)}</Text>
            </View>
          )}
        </TouchableOpacity>

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
        <View style={styles.featuresBox}>
          {featureEntries.length
            ? featureEntries.map(([key, item]) => {
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
            : null}
        </View>
      </Collapsible>

      {/* Validity Row */}
      <View style={styles.validityRow}>
        <Text style={styles.validityText}>
          Validity: <Text style={styles.validityValue}>{validity}</Text>
        </Text>
      </View>
    </View>
  );
};

const ExploreServices = (props) => {
  // Prop Destructuring
  const { navigation } = props;

  // Context Variables
  const { getPackages, applyCoupon, payments, snackDispatch } = useContext(
    Hcontext,
  );

  // State Variables
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedPlanData, setSelectedPlanData] = useState(null);
  const [checkoutPlan, setCheckoutPlan] = useState(null);
  const [showCoupon, setShowCoupon] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [couponId, setCouponId] = useState(0);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [paymentLoading, setPaymentLoading] = useState(false);

  // Hits when focus hits
  useFocusEffect(
    React.useCallback(() => {
      fetchPackages();
      return () => {};
    }, []),
  );

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const res = await getPackages();
      console.log("The packages - ", res);
      if (res.status === "success") {
        setPackages(res.data);
      }
    } catch (err) {
      console.log("Some issue while fetching packages - ", err);
    }
    setLoading(false);
  };

  // Flatten packages into individual plan cards, keeping only Growth Plans
  const planCards =
    packages?.reduce?.((acc, pkg) => {
      const plans = pkg.plans || [];
      plans.forEach((plan) => {
        const name = plan?.name || plan?.expert_level || pkg.name;
        if (growthPlanNames.includes(name?.toUpperCase?.())) {
          acc.push({ plan, packageName: pkg.name });
        }
      });
      return acc;
    }, []) || [];

  // Select a plan and open the checkout bottom sheet
  const handleSelect = (plan) => {
    setSelectedPlan(plan.id);
    setSelectedPlanData(plan);
    setCheckoutPlan(plan);
    setCouponId(0);
    setCouponDiscount(0);
    setCoupon("");
  };

  const handleApplyCoupon = () => {
    setShowCoupon(true);
  };

  const handleCouponSubmit = async () => {
    const planId = selectedPlanData?.id ?? selectedPlan;
    try {
      const res = await applyCoupon({
        plan: planId,
        coupon,
      });
      console.log("Coupon applied - ", res);
      if (res?.status === "success") {
        setCouponId(res?.data?.coupon_id ?? 0);
        const discount = res?.data?.discount ?? 0;
        setCouponDiscount(discount);
        snackDispatch({
          type: "SHOW_SNACK",
          payload: res.message || "Coupon applied successfully",
        });
      }
    } catch (err) {
      console.log("Some issue while applying coupon - ", err);
    }
    setShowCoupon(false);
    setCoupon("");
  };

  const handleProceed = async () => {
    if (!selectedPlan) {
      return snackDispatch({
        type: "SHOW_SNACK",
        payload: "Please select a plan first",
      });
    }

    const planId = selectedPlanData?.id ?? selectedPlan;
    const sellingPrice = selectedPlanData?.selling_price ?? 0;
    const discount = couponDiscount ?? 0;
    const finalAmount = Math.round(sellingPrice * (1 - discount / 100));
    setCheckoutPlan(null);

    try {
      setPaymentLoading(true);
      const payRes = await payments({
        id: planId,
        amount: finalAmount,
        couponId,
      });
      console.log("The Payments response - ", payRes);

      if (payRes?.status === "success") {
        if (finalAmount <= 0) {
          snackDispatch({
            type: "SHOW_SNACK",
            payload: "Subscription activated successfully",
          });
          navigation.replace("SubscribedServices");
        } else if (payRes?.link) {
          Linking.openURL(payRes.link);
        } else if (Platform.OS === "ios" && payRes?.payment) {
          snackDispatch({
            type: "SHOW_SNACK",
            payload: "Payment completed successfully",
          });
        } else {
          snackDispatch({
            type: "SHOW_SNACK",
            payload: "Payment is in progress",
          });
        }
      } else {
        snackDispatch({
          type: "SHOW_SNACK",
          payload: payRes?.message || "Something went wrong",
        });
      }
    } catch (err) {
      console.log("Some issue while proceeding for payment - ", err);
    }
    setPaymentLoading(false);
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
          <Text style={styles.headerTitle}>Growth Plans</Text>
        </View>
      </View>

      {/* Plans */}
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.plansContainer}>
            {planCards.map((card, index) => (
              <View key={card.plan?.id ?? index}>
                <PlanCard
                  plan={card.plan}
                  packageName={card.packageName}
                  selected={selectedPlan === card.plan?.id}
                  onSelect={handleSelect}
                />
                <View style={{ height: hp(2.5) }} />
              </View>
            ))}
          </View>
          {/* Sized Box */}
          <View style={{ height: hp(4) }} />
        </ScrollView>
      )}

      {/* Checkout Bottom Sheet */}
      <CheckoutSheet
        showModal={checkoutPlan !== null}
        setShowModal={(v) => (!v ? setCheckoutPlan(null) : null)}
        plan={checkoutPlan}
        totalAmount={
          couponDiscount > 0 && checkoutPlan
            ? Math.round(
                checkoutPlan.selling_price * (1 - couponDiscount / 100),
              )
            : checkoutPlan?.selling_price
        }
        showOriginal={couponDiscount > 0}
        onApplyCoupon={handleApplyCoupon}
        onProceed={handleProceed}
      />

      {/* Coupon Modal */}
      <CouponModal
        showModal={showCoupon}
        setShowModal={setShowCoupon}
        handleSubmit={handleCouponSubmit}
        value={coupon}
        setValue={setCoupon}
      />
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
  loaderContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  plansContainer: {
    paddingTop: hp(2.8),
    paddingHorizontal: wp(3.5),
  },
  planCard: {
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
  checkbox: {
    width: hp(3.2),
    height: hp(3.2),
    borderRadius: hp(1.6),
    borderWidth: 2,
    borderColor: "#8250F6",
    alignItems: "center",
    justifyContent: "center",
    marginRight: wp(2),
  },
  nameWrap: {
    flex: 1,
  },
  planName: {
    fontSize: RFValue(14),
    fontFamily: "PoppinsSemiBold",
    color: "#8250F6",
  },
  priceWrap: {
    marginLeft: wp(1),
  },
  priceGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  offBadge: {
    width: wp(13),
    height: hp(4.2),
    marginRight: wp(1),
    alignItems: "center",
    justifyContent: "center",
  },
  offBadgeText: {
    fontSize: RFValue(10),
    fontFamily: "PoppinsSemiBold",
    color: "#111111",
  },
  originalPrice: {
    fontSize: RFValue(12),
    fontFamily: "Poppins",
    color: "#AAAAAA",
    textDecorationLine: "line-through",
    marginRight: wp(1.5),
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
  featuresBox: {
    marginTop: hp(1.8),
    paddingTop: hp(1.8),
    borderTopWidth: 1,
    borderTopColor: "#E4DFF4",
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
  sheetContainer: {
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp(6),
    paddingTop: hp(4),
    paddingBottom: hp(1),
    borderTopLeftRadius: hp(3),
    borderTopRightRadius: hp(3),
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: "#E3E0EA",
    elevation: 12,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },
  sheetAmountSection: {
    flex: 1,
    justifyContent: "center",
  },
  sheetAmountLabel: {
    color: "#111111",
    fontFamily: "Poppins",
    fontSize: RFValue(12),
  },
  sheetTotalAmount: {
    color: "#111111",
    fontFamily: "PoppinsSemiBold",
    fontSize: RFValue(20),
  },
  sheetOriginalAmount: {
    color: "#494650",
    fontFamily: "Poppins",
    fontSize: RFValue(13),
    textDecorationLine: "line-through",
  },
  couponButton: {
    flex: 1,
    minHeight: hp(5.6),
    borderWidth: 1,
    borderColor: "#DCCEFF",
    borderRadius: hp(50),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    marginRight: wp(2),
  },
  couponText: {
    color: "#222222",
    fontFamily: "Poppins",
    fontSize: RFValue(13),
    textAlign: "center",
  },
  proceedButton: {
    flex: 1,
    minHeight: hp(5.6),
    borderRadius: hp(50),
    backgroundColor: "#E6DEFF",
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  proceedText: {
    color: "#222222",
    fontFamily: "PoppinsSemiBold",
    fontSize: RFValue(13),
    textAlign: "center",
  },
});

export {
  growthPlanNames,
  validityMap,
  growthPlanFeatures,
  featureLabels,
  getFeatureValue,
  formatPrice,
};

export default ExploreServices;