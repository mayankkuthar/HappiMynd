import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
  Platform,
  Alert,
  NativeModules,
  NativeEventEmitter,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as RNIap from "react-native-iap";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { config } from "../../config";

// Constants
import { colors } from "../../assets/constants";

// Components
import Header from "../../components/common/Header";
import PricingCard from "../../components/cards/PricingCard";
import CouponModal from "../../components/Modals/CouponModal";
import ReceiptModal from "../../components/Modals/ReceiptModal";

// Context
import { Hcontext } from "../../context/Hcontext";
import axios from "axios";

// const { RNIapIos } = NativeModules;
// const RNIapEmitter = new NativeEventEmitter(RNIapIos);

const pricingData = [
  {
    id: 1,
    title: "HappiLIFE",
    // title: "HappiLIFE Screening",
    description: "Globally validated 10 Parameter Screening Summary",
    originalPrice: "499",
    discountedPrice: "299",
    discountPercent: "40",
    added: true,
  },
  // {
  //   id: 1,
  //   title: "HappiGUIDE",
  //   description:
  //     "Assisted Summary Reading by experienced emotional wellbeing experts",
  //   originalPrice: "499",
  //   discountedPrice: "399",
  //   discountPercent: "20",
  //   added: false,
  // },
  {
    id: 3,
    title: "HappiBUDDY",
    description:
      "Your personal emotional log room that is non-judgemental, anonymous and 100% confidential.",
    originalPrice: "1199",
    discountedPrice: "799",
    discountPercent: "33",
    added: false,
  },
  // {
  //   id: 3,
  //   title: "HappiBUDDY + HappiSELF",
  //   description:
  //     "Enjoy the benefits of HappiBUDDY and HappiSELF for a full year in the most affordable price package",
  //   originalPrice: "4999",
  //   discountedPrice: "1799",
  //   discountPercent: "40",
  //   added: false,
  // },
  {
    id: 21,
    title: "HappiSELF",
    description:
      "Globally validated, interactive self help tools to self-manage your emotional wellbeing.",
    originalPrice: "499",
    discountedPrice: "299",
    discountPercent: "40",
    added: false,
  },
  // {
  //   id: 5,
  //   title: "HappiTALK",
  //   description:
  //     "Virtual therapeutic counselling sessions of 45 minutes each by a certified psychologist in a 100% confidential and anonymous safe space.",
  //   originalPrice: "499",
  //   discountedPrice: "299",
  //   discountPercent: "40",
  //   added: false,
  // },
  {
    id: 2,
    title: "HappiLIFE",
    // title: "HappiLIFE Summary Reading",
    description:
      "Virtual therapeutic counselling sessions of 45 minutes each by a certified psychologist in a 100% confidential and anonymous safe space.",
    originalPrice: "499",
    discountedPrice: "299",
    discountPercent: "40",
    added: false,
  },
  {
    id: 5,
    title: "HappiVOICE (Year)",
    description:
      "Keep a watch on your emotional health stats everyday, through a 30 secs voice recording. Try today !!",
    originalPrice: "999",
    discountedPrice: "199",
    discountPercent: "80",
    added: false,
  },
  {
    id: 9,
    title: "HappiVOICE (Month)",
    description:
      "Keep a watch on your emotional health stats everyday, through a 30 secs voice recording. Try today !!",
    originalPrice: "199",
    discountedPrice: "99",
    discountPercent: "50",
    added: false,
  },
  {
    id: 10,
    title: "HappiLIFE Summary Reading",
    // title: "HappiLEARN",
    description: "HappiLEARN is content access of audio & video",
    originalPrice: "199",
    discountedPrice: "99",
    discountPercent: "50",
    added: false,
  }
];

// Purchasable packs
const itemSkus = Platform.select({
  ios: [
    "com.happimynd.service.happibuddy",
    "com.happimynd.service.happilearn",
    "com.happimynd.service.happilife",
    "com.happimynd.service.happiself",
    "com.happimynd.service.happivoice_monthly",
    "com.happimynd.service.happivoice_yearly",
  ],
  android: [],
});

const AmountBox = (props) => {
  // Props Destructuring
  const {
    navigation,
    totalAmount,
    setTotalAmount,
    paymentHandler,
    bundlesInfo,
    addedBundles,
    paymentLoading,
    setLoading,
    couponHandler,
  } = props;

  // Context Variables
  const {
    snackDispatch,
    applyCoupon,
    payments,
    userProfileEdit,
    getUserProfile,
    authState,
    authDispatch,
    saveEmail,
    onOffStatus,
  } = useContext(Hcontext);

  // State variables
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [discountedAmount, setDiscountedAmount] = useState(0);
  const [coupon, setCoupon] = useState("");

  const [showCouponButton, setShowCouponButton] = useState(
    Platform.OS === "android"
  );

  // Mounting Phase
  useEffect(() => {
    // if (!authState?.user?.user?.email) setShowReceiptModal(true);
    if (!authState?.user?.user?.email) setShowReceiptModal(false);
    if (Platform.OS === "ios") getOnOffStatus();
  }, []);

  // UpdatingPhase
  useEffect(() => {
    if (isCouponApplied) {
      setIsCouponApplied(false);
      // console.log("172...");
      setTotalAmount(totalAmount + discountedAmount);
    }
  }, [coupon]);

  const getOnOffStatus = async () => {
    try {
      const fetchedStatus = await onOffStatus();
      console.log("The fetched on/off STatus - ", fetchedStatus);

      if (fetchedStatus?.status === "success") {
        setShowCouponButton(fetchedStatus?.is_open ? true : false);
      }
    } catch (err) {
      console.log("Some issue while getting on-off status - ", err);
    }
  };

  const handleCoupon = async () => {
    try {
      setShowCouponModal(false);

      // console.log("Check teh bubdle here - ", addedBundles.toString());

      const couponRes = await applyCoupon({
        plan: addedBundles.toString(),
        coupon: coupon,
      });

      console.log("Check teh coupon res - ", couponRes);

      if (couponRes?.status === "success") {
        setIsCouponApplied(true);
        if (Platform.OS === "android") {
          //setCouponId(couponRes.data.coupon_id);
          couponHandler({ couponId: couponRes.data.coupon_id });
          const discountedPrice = discountCalculations(couponRes.data);

          setTotalAmount(totalAmount - discountedPrice);
        } else {
          setLoading(true);
          setTotalAmount(0);
          console.log("send for payment id ", addedBundles.toString());
          const availFreeRes = await payments({
            id: addedBundles.toString(),
            amount: 0,
          });
          console.log("check the avail free res - ", availFreeRes);

          if (availFreeRes?.status == "success") {
            console.log("go to iiiii ----- ", params?.isFrom);
            if (params?.isFrom == "Voice") {
              navigation.navigate("ReportsCheck");
            }
            else {
              navigation.navigate("HomeScreen");
            }
          }
        }
      }
    } catch (err) {
      console.log("Some problem while applying coupon - ", err);
    }
    setLoading(false);
  };

  const discountCalculations = (data) => {
    const { plan_id, discount } = data;
    const item = bundlesInfo.find((bundle) => bundle.id == plan_id);
    const discountedAmount = item.price * (discount / 100);
    var rounded = Math.round(discountedAmount * 10) / 10;
    console.log("rounded", rounded);
    setDiscountedAmount(rounded);
    return rounded;
  };


  const fetchUserProfile = async (token) => {
    // setLoading(true);
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
    // setLoading(false);
  };

  return (
    <View style={styles.amountBox}>
      <CouponModal
        showModal={showCouponModal}
        setShowModal={setShowCouponModal}
        handleSubmit={handleCoupon}
        value={coupon}
        setValue={setCoupon}
        isCouponApplied={isCouponApplied}
      />
      {/* <ReceiptModal
        showModal={showReceiptModal}
        setShowModal={setShowReceiptModal}
        pressHandler={async (email) => {
          try {
            setShowReceiptModal(false);
            const savedRes = await saveEmail({ email });
            console.log("Check the saved res - ", savedRes);
            if (savedRes?.status === "error") {
              setTimeout(() => setShowReceiptModal(true), 2000);
              return snackDispatch({
                type: "SHOW_SNACK",
                payload: savedRes?.message,
              });
            }

            snackDispatch({
              type: "SHOW_SNACK",
              payload: savedRes?.message,
            });
            fetchUserProfile(authState.user.access_token);
          } catch (err) {
            console.log(
              "Some issue while capturing email (ReceiptModal/Procing.js) - ",
              err
            );
          }
        }}
      /> */}
      <View>
        <Text style={styles.amountTitle}>Total Amount</Text>
        <Text style={styles.amountValue}>
          {Platform.OS === "android" ? `Rs.${totalAmount}` : totalAmount}
        </Text>
      </View>
      <View style={{ flexDirection: "row" }}>
        {showCouponButton ? (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setShowCouponModal(true)}
            style={{ ...styles.amountButton, backgroundColor: "#fff" }}
          >
            <Text
              style={{ ...styles.amountButtonText, color: colors.primaryText }}
            >
              Apply Coupon
            </Text>
          </TouchableOpacity>
        ) : null}
        {/* Sized Box */}
        <View style={{ width: hp(1) }} />
        <TouchableOpacity
          activeOpacity={0.7}
          // onPress={() => {
          //   // navigation.push("MakeBooking");
          //   setShowReceiptModal(true);
          // }}
          onPress={paymentHandler}
          style={{ ...styles.amountButton }}
        >
          {paymentLoading ? (
            <ActivityIndicator size="small" color={colors.loaderColor} />
          ) : (
            <Text style={{ ...styles.amountButtonText }}>Proceed</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const Pricing = (props) => {
  // Context Variables
  const {
    authState,
    snackDispatch,
    getBundles,
    payments,
    paymentForIos,
    getSubscriptions,
    screenTrafficAnalytics,
  } = useContext(Hcontext);

  // Prop Destructuring
  const { navigation } = props;
  const { params } = props?.route;

  // State Variables
  const [bundles, setBundles] = useState([]);
  const [iosBundles, setIosBundles] = useState([]);
  const [addedBundles, setAddedBundles] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [bundlesInfo, setBundlesInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [iosTransaction, setIosTransaction] = useState(null);
  const [subscribedServices, setSubscribedServices] = useState(null);
  const [couponId, setCouponId] = useState(0);
  // Mounting

  useEffect(() => {
    // checkPromotions();
    checkSubscription();
    screenTrafficAnalytics({ screenName: "Pricing Screen" });

    return () => {
      RNIap.endConnection();
    };
  }, []);

  useEffect(() => {
    let unsubscribe;
    if (Platform.OS === "ios") {
      iosIAPConnectionHandler();
    } else {
      unsubscribe = navigation.addListener("focus", () => {
        fetchPricing();
      });
    }
    // iosIAPConnectionHandler();
    // unsubscribe = navigation.addListener("focus", () => {
    //   fetchPricing();
    // });

    return unsubscribe;
  }, [subscribedServices]);

  // updating Phase
  useEffect(() => {
    if (iosTransaction) {
      iosPaymentBackendStore();
    }
  }, [iosTransaction]);

  // const checkPromotions = async () => {
  //   try {
  //     console.log("inside checking promotions - ", RNIapEmitter);
  //     const productId = await RNIap.getPromotedProductIOS();
  //     console.log("check the product id here - ", productId);
  //     RNIapEmitter.addListener("iap-promoted-product", async () => {
  //       // Check if there's a persisted promoted product
  //       const productId = await RNIap.getPromotedProductIOS();
  //       console.log("check the product id here - ", productId);
  //       if (productId !== null) {
  //         // You may want to validate the product ID against your own SKUs
  //         try {
  //           await RNIap.buyPromotedProductIOS(); // This will trigger the App Store purchase process
  //         } catch (error) {
  //           console.warn(error);
  //         }
  //       }
  //     });
  //   } catch (err) {
  //     console.log("Some issue while checking promotions - ", err);
  //   }
  // };

  const checkSubscription = async () => {
    // setLoading(true);
    try {
      const mySub = await getSubscriptions();

      if (mySub.status === "success") {
        if (Platform.OS === "ios") {
          const subscriptions = mySub.data.map((product) =>
            product.name === "HappiLIFE Summary Reading"
              ? { ...product, name: "HappiLEARN" }
              : product
          );
          setSubscribedServices(subscriptions);
        } else {
          setSubscribedServices(mySub.data);
        }
      }
    } catch (err) {
      console.log("Some issue while checking subscription - ", err);
    }
    // setLoading(false);
  };

  const iosPaymentBackendStore = async () => {
    try {
      const userpaymentRes = await paymentForIos({
        id: bundlesInfo.id,
        amount: bundlesInfo.price,
        transactionId: iosTransaction.transactionId,
        transactionReceipt: iosTransaction.transactionReceipt,
      });
      console.log("Check the user backend res = ", userpaymentRes);
      if (userpaymentRes.status === "success")
        if (params?.isFrom == "Voice") {
          navigation.navigate("ReportsCheck");
        } else {

          navigation.navigate("HomeScreen");
        }
    } catch (err) {
      console.log("Some issue while user ios payments - ", err);
    }
  };

  const iosIAPConnectionHandler = async () => {
    try {
      const iapConnection = await RNIap.initConnection();

      if (iapConnection) getIOSProducts();
    } catch (err) {
      console.log("Some issue while IAP connection - ", err);
    }

    purchaseUpdateSubscription = RNIap.purchaseUpdatedListener(
      async (purchase) => {
        console.log("the purchase is", purchase);
        const receipt = purchase.transactionReceipt;
        console.log("the receipt is", receipt);
        if (receipt) {
          try {
            if (Platform.OS === "ios") {
              RNIap.finishTransactionIOS(purchase.transactionId);
            }
            // else if (Platform.OS === "android") {
            //   // If consumable (can be purchased again)
            //   consumePurchaseAndroid(purchase.purchaseToken);
            //   // If not consumable
            //   acknowledgePurchaseAndroid(purchase.purchaseToken);
            // }
            // if (Platform.OS === 'android') {
            //   RNIap.acknowledgePurchaseAndroid(purchase.purchaseToken);
            // }
            const ackResult = await RNIap.finishTransaction(purchase);
            console.log("acknowledge result", ackResult);
          } catch (ackErr) {
            console.warn("ackErr", ackErr);
          }

          console.log("Now go to neext and set state");
          setPaymentLoading(false);
          setIosTransaction(purchase);
        }
      }
    );

    purchaseErrorSubscription = RNIap.purchaseErrorListener((error) => {
      console.log("purchaseErrorListener", error);
      setPaymentLoading(false);
      Alert.alert("Purchase Error", JSON.stringify(error));
    });
  };

  // getting user purchase
  // const getIOSProducts = async () => {
  //   setLoading(true);
  //   try {
  //     const products = await RNIap.getProducts({ skus: itemSkus });
  //     console.log("products____", products)

  //      let fetchedBundles = await getBundles();
  //     console.warn("fetchedBundles______", fetchedBundles)
  //     const formattedProducts = products.map((product) => {
  //       // console.log('pricingData________ ', pricingData)

  //       const foundProd = pricingData.find((ele) => {
  //         if (ele?.title.includes(product?.title) || ele?.title === "HappiLIFE Summary Reading"){
  //           // console.warn('foundProd_____ ', ele?.title,product?.title)
  //           return ele;
  //         } 
  //       });

  //       // console.warn('foundProd_____ ', foundProd,fetchedBundles);
  //       const productInfo = fetchedBundles?.data?.find(
  //         (service) =>{service.name == foundProd?.title}
  //       );

  //       // console.warn('productInfo__________ ', productInfo)

  //       return {
  //         ...product,
  //         name: product.title,
  //         id: foundProd ? foundProd.id : product.productId,
  //         description: foundProd?.description,
  //         is_subscribed: productInfo?.is_subscribed,
  //         mobile_plans: [
  //           {
  //             ...productInfo?.mobile_plans[0],
  //             price: product.price,
  //             localizedPrice: product.localizedPrice,
  //             mobile_offers: [],
  //             mobile_duration: [],
  //           },
  //         ],
  //       };

  //     });
  //     console.log("Formatted Permiuim purchases", formattedProducts);
  //     setBundles(formattedProducts);
  //     setIosBundles(formattedProducts);
  //   } catch (err) {
  //     console.log("Some issue while getting produts - ", err);
  //   }
  //   setLoading(false);
  // };

  // const getIOSProducts_ = async () => {
  //   setLoading(true);
  //   try {
  //     // Fetch the products from RNIap
  //     const products = await RNIap.getProducts({ skus: itemSkus });
  //     // console.warn("products-----", products);

  //     // Fetch the bundles
  //     let fetchedBundles = await getBundles();
  //     console.warn("fetchedBundles______", fetchedBundles.length);

  //     // Map through the products to format them
  //     const formattedProducts = products.map((product) => {
  //       // Find matching product in pricingData
  //       const foundProd = pricingData.find((ele) => 
  //         ele?.title.includes(product?.title) || ele?.title === "HappiLIFE Summary Reading"
  //       );

  //       // console.warn("data -----",fetchedBundles?.data);
  //       // Find product information in fetchedBundles
  //       const productInfo = fetchedBundles?.data?.find(
  //         (service) => service.name === foundProd?.title
  //       );

  //        console.warn("data of products ",productInfo);
  //       // Return formatted product
  //       return {
  //         ...product,
  //         name: product.title,
  //         id: foundProd ? foundProd.id : product.productId,
  //         description: foundProd?.description,
  //         is_subscribed: productInfo?.is_subscribed,
  //         mobile_plans: [
  //           {
  //             ...productInfo?.mobile_plans[0],
  //             price: product.price,
  //             localizedPrice: product.localizedPrice,
  //             mobile_offers: [],
  //             mobile_duration: [],
  //           },
  //         ],
  //       };
  //     });

  //     // console.log("Formatted Premium purchases", formattedProducts);

  //     // Set the state with the formatted products
  //     setBundles(formattedProducts);
  //     setIosBundles(formattedProducts);
  //   } catch (err) {
  //     console.log("Some issue while getting products - ", err);
  //   } finally {
  //     // Ensure loading state is set to false at the end
  //     setLoading(false);
  //   }
  // };

  //**** new code ******/

  const getIOSProducts = async () => {
    setLoading(true);
    // Fetch the products from RNIap
    const products = await RNIap.getProducts({ skus: itemSkus });

    let fetchedBundles = await getBundles();

    axios.get(`${config.BASE_URL}/api/v1/buy-plan`, {
      headers: { Authorization: "Bearer " + authState.user.access_token },
    }).then(res => {
      // console.log("data is ---",products);

      let fetchedBundles = res.data?.data;
      // Map through the products to format them
      const formattedProducts = products.map((product) => {
        // Find matching product in pricingData
        const foundProd = pricingData.find((ele) =>
          ele?.title.includes(product?.title) || ele?.title === "HappiLIFE Summary Reading"
        );

        console.log("data----", foundProd);

        // Find product information in fetchedBundles
        const productInfo = fetchedBundles?.find((service) => service.name === foundProd?.title);

        // console.warn("data of products ", productInfo?.is_subscribed);
        // Return formatted product
        return {
          ...product,
          name: product.title,
          id: foundProd ? foundProd.id : product.productId,
          description: foundProd?.description,
          is_subscribed: productInfo?.is_subscribed,
          mobile_plans: [
            {
              ...productInfo?.mobile_plans[0],
              price: product.price,
              localizedPrice: product.localizedPrice,
              mobile_offers: [],
              mobile_duration: [],
            },
          ],
        };
      });
      // Set the state with the formatted products
      setBundles(formattedProducts);
      setIosBundles(formattedProducts);
      setLoading(false);
    }).catch(err => {
      console.log('catch error ---', err);
      setLoading(false);
    })


  }


  const fetchPricing = async () => {
    setLoading(true);
    try {
      let fetchedBundles = await getBundles();

      // fetchedBundles.data = fetchedBundles.data.filter(
      //   (bundle) => bundle.name !== "HappiGUIDE"
      // );
      console.log("Check the fetche dbundles - ", fetchedBundles);

      if (fetchedBundles.status === "success") {
        setBundles(fetchedBundles.data);
        setIosBundles(fetchedBundles.data);
      }

      if (params?.selectedPlan) {
        fetchedBundles.data.map((data) => {

          if (data.name === params?.selectedPlan) {

            addBundleHandler({
              id: data.mobile_plans[0]?.id,
              name: data.name,
              price: data.mobile_plans[0]?.mobile_offers[0].price,
            });

            if (data.is_subscribed !== 2)
              setTotalAmount(
                (prevState) =>
                  prevState + data.mobile_plans[0]?.mobile_offers[0].price
              );
          }
        });
      }

    } catch (err) {
      console.log("Soem issue while getting pricing - ", err);
    }
    setLoading(false);
  };

  // Request for new purchases
  const requestPurchase = async ({ sku: sku }) => {
    console.log("calling for purchace -----", sku);
    try {
      let res = await RNIap.requestPurchase({ sku: sku });
    } catch (err) {
      console.warn("Issue with requesting purchase", err.code, err.message);
    }
  };

  useEffect(() => {
    console.log("useeffect_addedBundles___", addedBundles)
    // console.log("useeffect_bundlesInfo___",bundlesInfo)
  }, [addedBundles])

  const addBundleHandler = async ({
    id = 0,
    productId = "",
    name = "",
    price = 0,
  }) => {
    let info;
    if (Platform.OS === "android") info = [...bundlesInfo, { id, name, price }];
    else info = { id, productId, name, price };
    console.log("addBundleHandler_called__", info);
    setBundlesInfo(info);
    setAddedBundles((prevState) => [...prevState, id]);
    // setAddedBundles([...addedBundles, id]);

  };

  const removeBundleHandler = async (id) => {
    const info = bundlesInfo.filter((bundle) => bundle.id !== id);
    console.log("removeBundleHandler_info_", bundlesInfo, id)

    setBundlesInfo(info);
    setAddedBundles(addedBundles.filter((bun) => bun !== id));
  };

  const couponHandler = (couponId) => {
    console.log("couponHandler====>", couponId.couponId);
    setCouponId(couponId.couponId);
  };

  const paymentHandler = async (id, amount) => {
    setPaymentLoading(true);
    if (!id) {
      setPaymentLoading(false);
      return snackDispatch({
        type: "SHOW_SNACK",
        payload: "Please select a plan !",
      });
    }

    try {
      if (Platform.OS === "ios") {
        console.log("calling here ------ ", amount, id)
        if (amount <= 0) {
          const prodId = iosBundles.find((bundle) => bundle.id == id);
          console.log("check prod Id here - ", prodId);
          const payRes = await payments({
            id: prodId?.mobile_plans[0]?.id || id,
            amount,
          });
          console.log("cehck payment res here - ", payRes);
          if (payRes?.status === "success") {

            if (params?.isFrom == "Voice") {
              navigation.navigate("ReportsCheck");
            }
            setTimeout(() => {
              setPaymentLoading(false);

              navigation.navigate("HomeScreen");
            }, 1000);
          }
        } else {
          requestPurchase({ sku: bundlesInfo.productId });
        }
      } else {
      //****** dont go to report check screen if user not subscribed.

        console.log(
          "Check the payment function - ",
          id,
          " /// ",
          amount,
          "///",
          couponId
        );
        
        const payRes = await payments({ id, amount, couponId });
        console.log("The Payments response - ", payRes, params?.isFrom);
        if (payRes.status === "success") {
           if(amount<=0){
            if (params?.isFrom == "Voice") {
              navigation.navigate("ReportsCheck");
              setPaymentLoading(false);
            }
            else {
              if (params?.isFrom == undefined) {
                setPaymentLoading(false);
                console.log("user subscribe -----",amount);
                navigation.replace("SubscribedServices");
              } else
                Linking.openURL(payRes?.link);
  
              setPaymentLoading(false);
            }
           }else{
            Linking.openURL(payRes?.link);
           }
        }
        else {
          setTimeout(() => {
            setPaymentLoading(false);
            navigation.navigate("HomeScreen");
          }, 1000);
        }

      }
    } catch (err) {
      console.log("Some issue while making payments______________ - ", err);
    }
    // setPaymentLoading(false);
  };

  // IOS Pricing Section
  if (Platform.OS === "ios") {
    return (
      <View style={styles.container}>
        <Header navigation={navigation} showLogo={false} showBack={true} />
        <KeyboardAwareScrollView style={{ paddingHorizontal: wp(10) }}>
          {loading ? (
            <View
              style={{
                height: hp(64),
                justifyContent: "center",
              }}
            >
              <ActivityIndicator size="small" color={colors.loaderColor} />
            </View>
          ) : (
            <>
              <View>
                <Text style={styles.pageTitle}>Select Plan</Text>
              </View>

              {/* Sized Box */}
              <View style={{ height: hp(2) }} />

              <View>
                {iosBundles.map((data, index) => (
                  <View key={index}>
                    <PricingCard
                      navigation={navigation}
                      data={data}
                      addBundleHandler={addBundleHandler}
                      removeBundleHandler={removeBundleHandler}
                      totalAmount={totalAmount}
                      setTotalAmount={setTotalAmount}
                      addedBundles={addedBundles}
                      setAddedBundles={setAddedBundles}
                      setBundlesInfo={setBundlesInfo}
                      highlighted={
                        Platform.OS === "android"
                          ? bundlesInfo.find(
                            (bundle) => bundle.id == data.mobile_plans[0].id
                          )
                          : null
                      }
                    />

                    <View style={{ height: hp(2) }} />
                  </View>
                ))}
              </View>
            </>
          )}
        </KeyboardAwareScrollView>
        <AmountBox
          navigation={navigation}
          totalAmount={totalAmount}
          setTotalAmount={setTotalAmount}
          paymentHandler={() =>
            paymentHandler(addedBundles.toString(), totalAmount)
          }
          addedBundles={addedBundles}
          bundlesInfo={bundlesInfo}
          paymentLoading={paymentLoading}
          setLoading={setLoading}
          couponHandler={(couponId) => {
            couponHandler(couponId);
          }}
        />
      </View>
    );
  }

  // Android pricing Section
  return (
    <View style={styles.container}>
      <Header navigation={navigation} showLogo={false} showBack={true} />
      {console.log("chec the bunfleds inofo y - ", bundlesInfo)}
      <KeyboardAwareScrollView style={{ paddingHorizontal: wp(10) }}>
        {loading ? (
          <ActivityIndicator size="small" color={colors.loaderColor} />
        ) : (
          <>
            <View>
              <Text style={styles.pageTitle}>Select Plan</Text>
            </View>

            {/* Sized Box */}
            <View style={{ height: hp(2) }} />

            <View>
              {bundles.map((data) => (
                <View key={data.id}>
                  <PricingCard
                    navigation={navigation}
                    data={data}
                    addBundleHandler={addBundleHandler}
                    removeBundleHandler={removeBundleHandler}
                    totalAmount={totalAmount}
                    setTotalAmount={setTotalAmount}
                    addedBundles={addedBundles}
                    setAddedBundles={setAddedBundles}
                    setBundlesInfo={setBundlesInfo}
                    highlighted={bundlesInfo.find(
                      (bundle) => bundle.id == data.mobile_plans[0].id
                    )}
                  />
                  {/* Sized Box */}
                  <View style={{ height: hp(2) }} />
                </View>
              ))}
            </View>
          </>
        )}
      </KeyboardAwareScrollView>
      <AmountBox
        navigation={navigation}
        totalAmount={totalAmount}
        setTotalAmount={setTotalAmount}
        paymentHandler={() =>
          paymentHandler(addedBundles.toString(), totalAmount)
        }
        addedBundles={addedBundles}
        bundlesInfo={bundlesInfo}
        paymentLoading={paymentLoading}
        setLoading={setLoading}
        couponHandler={(couponId) => {
          couponHandler(couponId);
        }}
      />
    </View>
  );
};

export default Pricing;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  pageTitle: {
    fontSize: RFValue(22),
    fontFamily: "PoppinsSemiBold",
    color: colors.pageTitle,
  },
  amountBox: {
    backgroundColor: "#F9FEFE",
    width: wp(100),
    height: hp(10),
    paddingHorizontal: wp(8),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  amountTitle: {
    fontSize: RFValue(10),
    fontFamily: "PoppinsMedium",
  },
  amountValue: {
    fontSize: RFValue(18),
    fontFamily: "PoppinsSemiBold",
    color: colors.pageTitle,
  },
  amountButton: {
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: hp(10),
    paddingHorizontal: hp(2),
    paddingVertical: hp(1),
  },
  amountButtonText: {
    fontSize: RFValue(10),
    fontFamily: "PoppinsMedium",
  },
});
