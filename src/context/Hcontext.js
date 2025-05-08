import React, { useState, useEffect, useReducer, useRef } from "react";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import { getStorage, ref, getDownloadURL, uploadBytes } from "firebase/storage";

// Config
import { config } from "../config";

// Reducers
import { initialAuthState, authReducer } from "./reducers/authReducer";
import { initialSnackState, snackReducer } from "./reducers/snackReducer";
import {
  initialLabelState,
  whiteLabelReducer,
} from "./reducers/whiteLabelReducer";
import {
  initialSelfState,
  happiSelfReducer,
} from "./reducers/happiSelfReducer";

export const Hcontext = React.createContext();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const Hprovider = (props) => {
  // Reducer Variables
  const [authState, authDispatch] = useReducer(authReducer, initialAuthState);
  const [whiteLabelState, whiteLabelDispatch] = useReducer(
    whiteLabelReducer,
    initialLabelState
  );
  const [happiSelfState, happiSelfDispatch] = useReducer(
    happiSelfReducer,
    initialSelfState
  );
  const [snackState, snackDispatch] = useReducer(
    snackReducer,
    initialSnackState
  );

  // Stste Vaiables
  const [deviceToken, setDeviceToken] = useState(null);
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const [selectedMood, setSelectedMood] = useState();
const [signedUrlAudio, setsignedUrlAudio] = useState();
const [tokenSonde, setTokenSonde] = useState();
const [sondeJobId, setSondeJobId] = useState();
const [sondeUserId, setSondeUserId] = useState();
const [voiceReport, setVoiceReport] = useState("");
const [botVisible, setBotVisible] = useState(true);
const [gotoVideo, setGotoVideo] = useState(false)
const [gotoAssessment, setGotoAssessment] = useState(false)
const [categoryId, setCategoryId] = useState("")




  // Filter Variables
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState([]);
  const [contentType, setContentType] = useState("");
  const [parameters, setParameters] = useState("");
  const [profile, setProfile] = useState("");
  const [language, setLanguage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const notificationListener = useRef();
  const responseListener = useRef();

  // Mounting
  useEffect(() => {
    notificationsHandler();

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  const notificationsHandler = async () => {
    try {
      registerForPushNotificationsAsync().then((token) =>
        setExpoPushToken(token)
      );

      notificationListener.current =
        Notifications.addNotificationReceivedListener((notification) => {
          console.log("notification", 
          // notification
          );
          // setNotification(notification);
        });

      responseListener.current =
        Notifications.addNotificationResponseReceivedListener((response) => {
          console.log("notification receiver res - ",
          //  response
           );
          setNotification(response.notification.request.content.data);
        });
    } catch (err) {
      console.log("Some issue while useing notifications (Main.js) - ", 
      // err
      );
    }
  };

  const registerForPushNotificationsAsync = async () => {
    let token;
    if (Constants.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      console.log("cheking the final status -- ", 
      // finalStatus
      );
      // if (finalStatus !== "granted") {
      //   alert("Failed to get push token for push notification!");
      //   return;
      // }
      token = (
        await Notifications.getExpoPushTokenAsync({
          experienceId: "@ashish-seraphic/HappiMynd",
        })
      ).data;
      // const token = (await Notifications.getDevicePushTokenAsync()).data;
      console.log("The device token is - ", 
      // token
      );

      // Setting device token in state
      setDeviceToken(token);
    } else {
      alert("Must use physical device for Push Notifications");
    }

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    console.log("check the expo token - ",
    //  token
    );

    return token;
  };

  const userLogin = async ({ username, password }) => {
    try {
      const axiosRes = await axios({
        method: "post",
        url: `${config.BASE_URL}/api/v1/login`,
        data: {
          username,
          password,
          device_token: deviceToken ? deviceToken : "TestDeviceToken",
        },
      });

      return axiosRes.data;
    } catch (err) {
      const axiosRes = JSON.parse(JSON.stringify(err));
      console.log("Some issue while login (Hcontext) - ", 
      // axiosRes
      );
      snackDispatch({
        type: "SHOW_SNACK",
        payload: "Invalid username or password.",
      });
    }
  };

  const userCodeLogin = async ({ code }) => {
    try {
      const axiosRes = await axios({
        method: "post",
        url: `${config.BASE_URL}/api/v1/login-with-code`,
        data: { happimynd_code: code, device_token: deviceToken },
      });

      return axiosRes.data;
    } catch (err) {
      const axiosRes = JSON.parse(JSON.stringify(err));
      console.log("Some issue while login with code (Hcontext) - ", 
      // axiosRes
      );
      snackDispatch({
        type: "SHOW_SNACK",
        payload: "Invalid code. Please check again.",
      });
    }
  };

  const userLogout = async ({ token }) => {
    try {
      const axiosRes = await axios({
        method: "get",
        url: `${config.BASE_URL}/api/v1/logout`,
        headers: { Authorization: "Bearer " + token },
      });
      console.log("USer logout res - ", 
      // axiosRes
      );

      return axiosRes.data;
    } catch (err) {
      const axiosRes = JSON.parse(JSON.stringify(err));
      console.log("Some issue while logout (Hcontext) - ", 
      // axiosRes
      );
    }
  };

  const guardianVerification = async ({ type, uniqueId, mobile, email }) => {
    try {
      const axiosRes = await axios({
        method: "post",
        url: `${config.BASE_URL}/api/v1/guardian-verification`,
        data: {
          type,
          random_unique_id: uniqueId,
          email,
          mobile,
        },
      });

      return axiosRes.data;
    } catch (err) {
      const axiosRes = JSON.parse(JSON.stringify(err));
      if (err.response)
        console.log(
          "Some issue while sending guardian otp (Hcontext) - ",
          // err.response
        );
    }
  };

  const verifyGuardianOtp = async ({ otp, uniqueId }) => {
    try {
      const axiosRes = await axios({
        method: "post",
        url: `${config.BASE_URL}/api/v1/verify-guardian-otp`,
        data: {
          otp,
          unique_id: uniqueId,
        },
      });

      return axiosRes.data;
    } catch (err) {
      const axiosRes = JSON.parse(JSON.stringify(err));
      if (err.response)
        console.log(
          "Some issue while verifying guardian (Hcontext) - ",
          // err.response
        );
    }
  };

  const getSponsorList = async () => {
    try {
      const axiosRes = await axios({
        method: "get",
        url: `${config.BASE_URL}/api/v1/organizer-list`,
      });

      return axiosRes.data;
    } catch (err) {
      const axiosRes = JSON.parse(JSON.stringify(err));
      console.log(
        "Some issue while getting sponsored list (Hcontext) - ",
        // axiosRes
      );
    }
  };

  const checkSponsorCode = async ({ id, code }) => {
    try {
      const axiosRes = await axios({
        method: "post",
        url: `${config.BASE_URL}/api/v1/entry-via-org`,
        data: { organization_id: id, happimynd_code: code },
      });

      return axiosRes.data;
    } catch (err) {
      const axiosRes = JSON.parse(JSON.stringify(err));
      console.log(
        "Some issue while checking sponsor code (Hcontext) - ",
        // axiosRes
      );
      snackDispatch({ type: "SHOW_SNACK", payload: "Please check your code." });
    }
  };

  const getProfileList = async () => {
    try {
      const axiosRes = await axios({
        method: "get",
        url: `${config.BASE_URL}/api/v1/user-profile`,
      });

      return axiosRes.data;
    } catch (err) {
      const axiosRes = JSON.parse(JSON.stringify(err));
      console.log(
        "Some issue while getting profile list (Hcontext) - ",
        // axiosRes
      );
    }
  };

  const userSignup = async ({
    nickName,
    selectedProfileType,
    age,
    gender,
    userName,
    password,
    confirmPassword,
    signup_type,
    happimyndCode,
    signupType,
    language,
    refferalCode,
  }) => {
    try {
      const axiosRes = await axios({
        method: "post",
        url: `${config.BASE_URL}/api/v1/signup`,
        data: {
          nickname: nickName,
          user_profile_id: selectedProfileType,
          age,
          gender,
          username: userName,
          password,
          confirm_password: confirmPassword,
          signup_type,
          happimyndCode,
          signup_type: signupType,
          language,
          device_token: deviceToken,
          referral_code: refferalCode,
        },
      });

      console.log("The signup response - ", 
      // axiosRes
      );

      return axiosRes.data;
    } catch (err) {
      const axiosRes = JSON.parse(JSON.stringify(err));
      console.log("Some issue while user signup (Hcontext) - ", 
      // axiosRes
      );

      if (err.response) {
        // Request made and server responded
        console.log("Signup error response (Hcontext) - ", 
        // err.response.data
        );
        if (err.response.data.message === "Username is alraedy taken") {
          snackDispatch({
            type: "SHOW_SNACK",
            payload: "Username is already taken",
          });
        } else {
          snackDispatch({
            type: "SHOW_SNACK",
            payload: err.response.data.message,
          });
        }
      }
    }
  };

  const userProfileEdit = async ({
    nickName,
    userProfileId,
    age,
    gender,
    userName,
    email,
    phone,
  }) => {
    try {
      const axiosRes = await axios({
        method: "post",
        url: `${config.BASE_URL}/api/v1/edit-profile`,
        headers: { Authorization: "Bearer " + authState.user.access_token },
        data: {
          nickname: nickName,
          user_profile_id: 2,
          age,
          gender,
          username: userName,
          email,
          mobile: phone,
        },
      });

      console.log("The profile edit response - ", 
      // axiosRes
      );

      return axiosRes.data;
    } catch (err) {
      const axiosRes = JSON.parse(JSON.stringify(err));

      if (err.response) {
        // Request made and server responded
        console.log(
          "Some issue while user profile edit (Hcontext) - ",
          // err.response
        );
      }
    }
  };

  const getUserProfile = async ({ token }) => {
    try {
      const axiosRes = await axios({
        method: "get",
        url: `${config.BASE_URL}/api/v1/get-profile`,
        headers: { Authorization: "Bearer " + token },
      });
      console.log("USer profile received res - ",axiosRes.data);
      return axiosRes.data;
    } catch (err) {
      const axiosRes = JSON.parse(JSON.stringify(err));
      console.log("Some issue while getting user profile (Hcontext) - ",axiosRes);
    }
  };

  const changePassword = async ({
    oldPassword,
    newPassword,
    confirmPassword,
  }) => {
    try {
      const axiosRes = await axios({
        method: "post",
        url: `${config.BASE_URL}/api/v1/change-password`,
        headers: { Authorization: "Bearer " + authState.user.access_token },
        data: {
          old_password: oldPassword,
          new_password: newPassword,
          confirm_password: confirmPassword,
        },
      });

      return axiosRes.data;
    } catch (err) {
      const axiosRes = JSON.parse(JSON.stringify(err));
      console.log("Some issue while password change (Hcontext) - ", 
      // axiosRes
      );

      snackDispatch({
        type: "SHOW_SNACK",
        payload: "Old password incorrect !",
      });
    }
  };

  const forgotPassword = async ({ email, mobile }) => {
    try {
      const axiosRes = await axios({
        method: "post",
        url: `${config.BASE_URL}/api/v1/forgot-password`,
        data: {
          email,
          type: email ? "email" : "mobile",
          mobile,
        },
      });

      return axiosRes.data;
    } catch (err) {
      const axiosRes = JSON.parse(JSON.stringify(err));
      console.log("Some issue while forgot password (Hcontext) - ", 
      // axiosRes
      );
      snackDispatch({
        type: "SHOW_SNACK",
        payload: `You have not registered these details with us yet. Please create a new account`,
      });
    }
  };

  const verifyOtp = async ({ email, mobile, otp }) => {
    try {
      const axiosRes = await axios({
        method: "post",
        url: `${config.BASE_URL}/api/v1/verify-otp`,
        data: {
          email,
          mobile,
          otp
        },
      });

      return axiosRes.data;
    } catch (err) {
      const axiosRes = JSON.parse(JSON.stringify(err));
      console.log("Some issue while verifying otp (Hcontext) - ", 
      // axiosRes
      );
      snackDispatch({
        type: "SHOW_SNACK",
        payload: "OTP incorrect !",
      });
    }
  };

  const resetPassword = async ({
    password,
    confirmPassword,
    email,
    mobile,
  }) => {
    try {
      const axiosRes = await axios({
        method: "post",
        url: `${config.BASE_URL}/api/v1/reset-password`,
        data: {
          password,
          confirm_password: confirmPassword,
          email,
          mobile,
        },
      });

      return axiosRes.data;
    } catch (err) {
      const axiosRes = JSON.parse(JSON.stringify(err));
      console.log(
        "Some issue while resetting password (Hcontext) - ",
        // axiosRes
      );
    }
  };

  const startAssessment = async ({ token }) => {
    try {
      const axiosRes = await axios({
        method: "post",
        url: `${config.BASE_URL}/api/v1/start-assessment`,
        headers: { Authorization: "Bearer " + token },
        data: { platform: Platform.OS },
      });

      return axiosRes.data;
    } catch (err) {
      if (err.response) {
        // Request made and server responded
        console.log(
          "Some issue while starting assessment (Hcontext) - ",
          // err.response.data
        );
      }
    }
  };

  const AnyAssessment = async ({ token }) => {
    try {
      const axiosRes = await axios({
        method: "post",
        url: `${config.BASE_URL}/api/v1/checkifany`,
        headers: { Authorization: "Bearer " + token },
        data: { platform: Platform.OS },
      });

      return axiosRes.data;
    } catch (err) {
      if (err.response) {
        // Request made and server responded
        console.log(
          "Some issue while starting assessment (Hcontext) - ",
          // err.response.data
        );
      }
    }
  };

  const submitAnswer = async ({ optionId }) => {
    try {
      const axiosRes = await axios({
        method: "post",
        url: `${config.BASE_URL}/api/v1/save-option`,
        headers: { Authorization: "Bearer " + authState.user.access_token },
        data: {
          option_question_id: optionId,
        },
      });

      console.log("context check answer res = ", 
      // axiosRes
      );

      return axiosRes.data;
    } catch (err) {
      const axiosRes = JSON.parse(JSON.stringify(err));
      console.log("Some issue while submitting option (Hcontext) - ", axiosRes);
    }
  };

  const getReport = async () => {
    try {
      const axiosRes = await axios({
        method: "get",
        url: `${config.BASE_URL}/api/v1/get-report`,
        headers: { Authorization: "Bearer " + authState.user.access_token },
      });

      return axiosRes.data;
    } catch (err) {
      const axiosRes = JSON.parse(JSON.stringify(err));
      console.log("Some issue while getting report (Hcontext) - ",
      //  axiosRes
       );
      if (axiosRes.status === 500)
        snackDispatch({ type: "SHOW_SNACK", payload: axiosRes.message });
    }
  };

  const getAllReport = async () => {
    try {
      const axiosRes = await axios({
        method: "get",
        url: `${config.BASE_URL}/api/v1/get-all-report`,
        headers: { Authorization: "Bearer " + authState.user.access_token },
      });

      return axiosRes.data;
    } catch (err) {
      const axiosRes = JSON.parse(JSON.stringify(err));
      console.log("Some issue while getting report (Hcontext) - ",
      //  axiosRes
       );
      if (axiosRes.status === 500)
        snackDispatch({ type: "SHOW_SNACK", payload: axiosRes.message });
    }
  };

  const getLanguages = async () => {
    try {
      const axiosRes = await axios({
        method: "get",
        url: `${config.BASE_URL}/api/v1/language-list`,
        headers: { Authorization: "Bearer " + authState.user.access_token },
      });

      return axiosRes.data;
    } catch (err) {
      const axiosRes = JSON.parse(JSON.stringify(err));

      if (err.response) {
        // Request made and server responded
        console.log(
          "Some issue while getting languages (Hcontext) - ",
          // err.response
        );
      }
    }
  };

  const assignPsychologist = async ({ language }) => {
    try {
      const axiosRes = await axios({
        method: "post",
        url: `${config.BASE_URL}/api/v1/assign-psychologist`,
        headers: { Authorization: "Bearer " + authState.user.access_token },
        data: {
          language,
        },
      });

      return axiosRes.data;
    } catch (err) {
      const axiosRes = JSON.parse(JSON.stringify(err));

      if (err.response) {
        // Request made and server responded
        console.log(
          "Some issue while asigning psycologist (Hcontext) - ",
          // err.response
        );
      }
    }
  };

  const changePsychologist = async ({ language }) => {
    try {
      const axiosRes = await axios({
        method: "post",
        url: `${config.BASE_URL}/api/v1/switch-language-while-chat`,
        headers: { Authorization: "Bearer " + authState.user.access_token },
        data: {
          language,
        },
      });

      return axiosRes.data;
    } catch (err) {
      const axiosRes = JSON.parse(JSON.stringify(err));

      if (err.response) {
        // Request made and server responded
        console.log(
          "Some issue while changing psycologist (Hcontext) - ",
          // err.response
        );
      }
    }
  };

  const currentlyAssignedPsycologist = async () => {
    try {
      const axiosRes = await axios({
        method: "get",
        url: `${config.BASE_URL}/api/v1/psy-whom-user-currently-chatting`,
        headers: { Authorization: "Bearer " + authState.user.access_token },
      });

      return axiosRes.data;
    } catch (err) {
      const axiosRes = JSON.parse(JSON.stringify(err));

      if (err.response) {
        // Request made and server responded
        console.log(
          "Some issue while getting currently assigned psycologist (Hcontext) - ",
          // err.response
        );
      }
    }
  };

  const sendMsgToPsy = async ({ groupId, psyId, message }) => {
    try {
      const axiosRes = await axios({
        method: "post",
        url: `${config.BASE_URL}/api/v1/send-message-by-user-to-psy`,
        headers: { Authorization: "Bearer " + authState.user.access_token },
        data: {
          group_id: groupId,
          psychologist_id: psyId,
          message,
        },
      });

      return axiosRes.data;
    } catch (err) {
      const axiosRes = JSON.parse(JSON.stringify(err));

      if (err.response) {
        // Request made and server responded
        console.log(
          "Some issue sending message to psycologist (Hcontext) - ",
          // err.response
        );
      }
    }
  };

  const clearMessageBatch = async () => {
    try {
      const axiosRes = await axios({
        method: "post",
        url: `${config.BASE_URL}/api/v1/clear-message-batch-of-user`,
        headers: { Authorization: "Bearer " + authState.user.access_token },
      });

      return axiosRes.data;
    } catch (err) {
      const axiosRes = JSON.parse(JSON.stringify(err));

      if (err.response) {
        // Request made and server responded
        console.log(
          "Some issue clearing message batch (Hcontext) - ",
          // err.response
        );
      }
    }
  };

  const happiLearnList = async ({
    search = "",
    contentType = "",
    parameters = "",
    profile = "",
    language = "",
  }) => {
    try {
      const axiosRes = await axios({
        method: "post",
        url: `${config.BASE_URL}/api/v1/happi-learn-content`,
        headers: { Authorization: "Bearer " + authState.user.access_token },
        data: {
          search,
          content_type: contentType,
          parameters,
          profile,
          language,
        },
      });

      return axiosRes.data;
    } catch (err) {
      const axiosRes = JSON.parse(JSON.stringify(err));

      if (err.response) {
        // Request made and server responded
        console.log(
          "Some issue while happi-learn listing (Hcontext) - ",
          // err.response
        );
      }
    }
  };

  const happiLearnContent = async ({ id }) => {
    try {
      const axiosRes = await axios({
        method: "post",
        url: `${config.BASE_URL}/api/v1/happi-learn-content-by-id`,
        headers: { Authorization: "Bearer " + authState.user.access_token },
        data: { content_id: id },
      });

      return axiosRes.data;
    } catch (err) {
      const axiosRes = JSON.parse(JSON.stringify(err));

      if (err.response) {
        // Request made and server responded
        console.log(
          "Some issue while happi-learn content view (Hcontext) - ",
          // err.response
        );
      }
    }
  };

  const likePost = async ({ id = null }) => {
    try {
      const axiosRes = await axios({
        method: "post",
        url: `${config.BASE_URL}/api/v1/like-happi-learn-post`,
        headers: { Authorization: "Bearer " + authState.user.access_token },
        data: { happi_learn_content_id: id },
      });

      return axiosRes.data;
    } catch (err) {
      const axiosRes = JSON.parse(JSON.stringify(err));

      if (err.response) {
        // Request made and server responded
        console.log("Some issue while liking post (Hcontext) - ", 
        // err.response
        );
      }
    }
  };

  const unlikePost = async ({ id = null }) => {
    try {
      const axiosRes = await axios({
        method: "post",
        url: `${config.BASE_URL}/api/v1/unlike-happi-learn-post`,
        headers: { Authorization: "Bearer " + authState.user.access_token },
        data: { happi_learn_content_id: id },
      });

      return axiosRes.data;
    } catch (err) {
      const axiosRes = JSON.parse(JSON.stringify(err));

      if (err.response) {
        // Request made and server responded
        console.log(
          "Some issue while un-liking post (Hcontext) - ",
          // err.response
        );
      }
    }
  };

  const getBundles = async () => {
    try {
      const axiosRes = await axios({
        method: "get",
        url: `${config.BASE_URL}/api/v1/buy-plan`,
        headers: { Authorization: "Bearer " + authState.user.access_token },
      });

      // console.log("subcribe user:",axiosRes.data);
      return axiosRes.data;
    } catch (err) {
      const axiosRes = JSON.parse(JSON.stringify(err));
      if (err.response) {
        // Request made and server responded
        console.log("Some issue getting bundles (Hcontext) - ", 
        // err.response
        );
      }
    }
  };

  const payments = async ({ id, amount, couponId = 0 }) => {
    console.log("coupenId========>", couponId);
    let endpoint;
    if (amount > 0) {
      endpoint = `${config.BASE_URL}/api/v1/payment`;
    } else {
      endpoint = `${config.BASE_URL}/api/v1/avail-free-services`;
    }
    console.log( `check on the amount - ${amount} and also the endpoint - ${endpoint}`);

    console.log("sending payload ---- ",id,amount);
    try {
      const axiosRes = await axios({
        method: "post",
        url: endpoint,
        headers: { Authorization: "Bearer " + authState.user.access_token },
        data: {
          plan_id: id,
          amount,
          coupen_id: couponId,
        },
      });

      console.log("payment -------- ", axiosRes?.data);

      return axiosRes?.data;
    } catch (err) {
      // const axiosRes = JSON.parse(JSON.stringify(err));

      if (err.response) {
        // Request made and server responded
        console.log("Some issue while making payments (Hcontext) - ",err.response);
      }
    }
  };

  const getSubscriptions = async () => {
    try {
      const axiosRes = await axios({
        method: "get",
        url: `${config.BASE_URL}/api/v1/my-subscribed-services`,
        headers: { Authorization: "Bearer " + authState.user.access_token },
      });
 console.log("getsubscription>>", axiosRes?.data)
      return axiosRes.data;
    } catch (err) {
      console.log("Some issue while getting subscriptions - ", err);
    }
  };

  const applyCoupon = async ({ plan, coupon }) => {
   console.log("send payload ----",plan,coupon);
    try {
      const axiosRes = await axios({
        method: "post",
        url: `${config.BASE_URL}/api/v1/apply-coupon`,
        headers: { Authorization: "Bearer " + authState.user.access_token },
        data: {
          plan_id: plan,
          coupon,
        },
      });

      return axiosRes.data;
    } catch (err) {
      const axiosRes = JSON.parse(JSON.stringify(err));

      if (err.response) {
        // Request made and server responded
        console.log(
          "Some issue while applying coupon (Hcontext) - ",
          err.response
        );

        snackDispatch({
          type: "SHOW_SNACK",
          payload: err.response.data.message,
        });
      }
    }
  };

  const sendOTP = async ({ type, email, mobile,country_code }) => {
    let dataToSend;
    if (type === "email") {
      dataToSend = {
        type,
        email,
      };
    }
   else if (type === "mobile") {
      dataToSend = {
        type,
        mobile,
        country_code
      };
    }
    console.log("check data to send - ", dataToSend, "Bearer " + authState.user.access_token);
    try {
      const axiosRes = await axios({
        method: "post",
        url: `${config.BASE_URL}/api/v1/send-verification-otp`,
        headers: { Authorization: "Bearer " + authState.user.access_token },
        data: dataToSend,
      });

      console.log("response ----",axiosRes);

      return axiosRes.data;
    } catch (err) {
      const axiosRes = JSON.parse(JSON.stringify(err));
      if (err.response) {
        // Request made and server responded
        console.log("Some issue while sending OTP (Hcontext) - ", err.response);

        if (err.response.data.message === "Email address is already exist.") {
          return snackDispatch({
            type: "SHOW_SNACK",
            payload: "This Email ID is already registered.",
          });
        }
        if (err.response.data.message === "Mobile number is already exist.") {
          return snackDispatch({
            type: "SHOW_SNACK",
            payload: "This mobile number is already registered.",
          });
        }

        snackDispatch({
          type: "SHOW_SNACK",
          payload: err.response.data.message,
        });
      }
    }
  };

  const getEmojiList = async () => {
    try {
      const axiosRes = await axios({
        method: "get",
        url: `${config.BASE_URL}/api/v1/emoji-list`,
        headers: { Authorization: "Bearer " + authState.user.access_token },
      });

      return axiosRes.data;
    } catch (err) {
      const axiosRes = JSON.parse(JSON.stringify(err));

      if (err.response) {
        // Request made and server responded
        console.log(
          "Some issue while getting emoji list (Hcontext) - ",
          err.response
        );
      }
    }
  };

  const submitRating = async ({ id, review }) => {
    try {
      const axiosRes = await axios({
        method: "post",
        url: `${config.BASE_URL}/api/v1/submit-rating`,
        headers: { Authorization: "Bearer " + authState.user.access_token },
        data: { application_rate_emoji_id: id, review },
      });

      return axiosRes.data;
    } catch (err) {
      const axiosRes = JSON.parse(JSON.stringify(err));

      if (err.response) {
        // Request made and server responded
        console.log(
          "Some issue while submitting rating (Hcontext) - ",
          err.response
        );
      }
    }
  };

  const raiseQuery = async ({ category, description }) => {
    try {
      const axiosRes = await axios({
        method: "post",
        url: `${config.BASE_URL}/api/v1/raise-query-app`,
        headers: { Authorization: "Bearer " + authState.user.access_token },
        data: { category, description },
      });

      return axiosRes.data;
    } catch (err) {
      const axiosRes = JSON.parse(JSON.stringify(err));

      if (err.response) {
        // Request made and server responded
        console.log(
          "Some issue while raising query (Hcontext) - ",
          err.response
        );
      }
    }
  };
  const submitFeedback = async ({ id, review }) => {
    try {
      const axiosRes = await axios({
        method: "post",
        url: `${config.BASE_URL}/api/v1/feedback`,
        headers: { Authorization: "Bearer " + authState.user.access_token },
        data: { application_rate_emoji_id: id, feedback_message: review },
      });

      return axiosRes.data;
    } catch (err) {
      const axiosRes = JSON.parse(JSON.stringify(err));

      if (err.response) {
        // Request made and server responded
        console.log(
          "Some issue while submitting feedback (Hcontext) - ",
          err.response
        );
      }
    }
  };
  const submitOpinionAfterSession = async ({
    sessionId,
    emojiId,
    reason = " ",
    comments,
    module,
  }) => {
    try {
      const axiosRes = await axios({
        method: "post",
        url:
          module === "talk"
            ? `${config.BASE_URL}/api/v1/submit-opinion-after-session-user`
            : `${config.BASE_URL}/api/v1/submit-opinion-after-guide-session-user`,
        headers: { Authorization: "Bearer " + authState.user.access_token },
        data: {
          session_id: sessionId,
          emoji_id: emojiId,
          reason,
          additional_comment: comments,
        },
      });

      return axiosRes.data;
    } catch (err) {
      const axiosRes = JSON.parse(JSON.stringify(err));

      if (err.response) {
        // Request made and server responded
        console.log(
          "Some issue while submitting feedback (Hcontext) - ",
          err.response
        );
      }
    }
  };

  const getNotifications = async () => {
    try {
      const axiosRes = await axios({
        method: "get",
        url: `${config.BASE_URL}/api/v1/notification-list`,
        headers: { Authorization: "Bearer " + authState.user.access_token },
      });

      return axiosRes.data;
    } catch (err) {
      const axiosRes = JSON.parse(JSON.stringify(err));

      if (err.response) {
        // Request made and server responded
        console.log(
          "Some issue while getting notifications (Hcontext) - ",
          err.response
        );
      }
    }
  };

  const sendChatNotification = async ({ deviceToken, message }) => {
    try {
      const axiosRes = await axios({
        method: "post",
        url: `https://exp.host/--/api/v2/push/send`,
        // headers: { Authorization: "Bearer " + authState.user.access_token },
        data: {
          to: deviceToken,
          sound: "default",
          body: message,
        },
      });

      return axiosRes.data;
    } catch (err) {
      const axiosRes = JSON.parse(JSON.stringify(err));

      if (err.response) {
        // Request made and server responded
        console.log(
          "Some issue while sending notifications (Hcontext) - ",
          err.response
        );
      }
    }
  };

  const sendNotification = async ({ message }) => {
    try {
      const axiosRes = await axios({
        method: "post",
        url: `https://exp.host/--/api/v2/push/send`,
        // headers: { Authorization: "Bearer " + authState.user.access_token },
        data: {
          to: deviceToken,
          sound: "default",
          body: message,
        },
      });

      return axiosRes.data;
    } catch (err) {
      console.log(
        "Some issue while sending notification (Hcontext.js) - ",
        err
      );
    }
  };

  const fileUploadFirebase = async (source) => {
    console.log("Firebase source check or not - ", source);
    try {
      // Creating a blob for the document
      const response = await fetch(source);
      const blob = await response.blob();

      // Extracting file-name
      const fileName = source.substring(source.lastIndexOf("/") + 1);

      // Firrebase Storage reference
      const storage = getStorage();
      const storageRef = ref(storage, fileName);

      // Uploading the bytes to Firebase
      uploadBytes(storageRef, blob).then((snapshot) => {
        console.log("Uploaded a blob or file!", snapshot);
        return snapshot;
      });
    } catch (err) {
      console.log("Some issue while uploading file to firebase - ", err);
    }
  };

  const getWhiteLabel = async () => {
    try {
      const axiosRes = await axios({
        method: "get",
        url: `${config.BASE_URL}/api/v1/white-labelling-status`,
        headers: { Authorization: "Bearer " + authState.user.access_token },
      });

      return axiosRes.data;
    } catch (err) {
      const axiosRes = JSON.parse(JSON.stringify(err));

      if (err.response) {
        // Request made and server responded
        console.log(
          "Some issue while getting white label (Hcontext) - ",
          err.response
        );
      }
    }
  };

  const getFAQ = async () => {
    try {
      const axiosRes = await axios({
        method: "get",
        url: `${config.BASE_URL}/api/v1/general-faqs`,
      });

      return axiosRes.data;
    } catch (err) {
      const axiosRes = JSON.parse(JSON.stringify(err));

      if (err.response) {
        // Request made and server responded
        console.log(
          "Some issue while getting FAQ list (Hcontext) - ",
          err.response
        );
      }
    }
  };

  const courseList = async () => {
    try {
      const axiosRes = await axios({
        method: "get",
        url: `${config.BASE_URL}/api/v1/course-list`,
        headers: { Authorization: "Bearer " + authState.user.access_token },
      });

      return axiosRes.data;
    } catch (err) {
      const axiosRes = JSON.parse(JSON.stringify(err));

      if (err.response) {
        // Request made and server responded
        console.log(
          "Some issue while getting Course list (Hcontext) - ",
          err.response
        );
      }
    }
  };

  const subCourseList = async (courseId) => {
    try {
      const axiosRes = await axios({
        method: "post",
        url: `${config.BASE_URL}/api/v1/sub-course-list`,
        headers: { Authorization: "Bearer " + authState.user.access_token },
        data: { happiself_course_id: courseId },
      });

      return axiosRes.data;
    } catch (err) {
      const axiosRes = JSON.parse(JSON.stringify(err));

      if (err.response) {
        // Request made and server responded
        console.log(
          "Some issue while getting Sub Course list (Hcontext) - ",
          err.response
        );
      }
    }
  };

  const subCourseContent = async (subCourseId) => {
    try {
      const axiosRes = await axios({
        method: "post",
        url: `${config.BASE_URL}/api/v1/get-sub-course-content`,
        headers: { Authorization: "Bearer " + authState.user.access_token },
        data: { happiself_sub_course_id: subCourseId },
      });

      return axiosRes.data;
    } catch (err) {
      const axiosRes = JSON.parse(JSON.stringify(err));

      if (err.response) {
        // Request made and server responded
        console.log(
          "Some issue while getting Sub Course Content (Hcontext) - ",
          err.response
        );
      }
    }
  };

  const likeCourse = async (courseId) => {
    try {
      const axiosRes = await axios({
        method: "post",
        url: `${config.BASE_URL}/api/v1/like-happiself-course`,
        headers: { Authorization: "Bearer " + authState.user.access_token },
        data: { happiself_course_id: courseId },
      });

      return axiosRes.data;
    } catch (err) {
      const axiosRes = JSON.parse(JSON.stringify(err));

      if (err.response) {
        // Request made and server responded
        console.log(
          "Some issue while liking course (Hcontext) - ",
          err.response
        );
      }
    }
  };
  const unLikeCourse = async (courseId) => {
    try {
      const axiosRes = await axios({
        method: "post",
        url: `${config.BASE_URL}/api/v1/unlike-happiself-course`,
        headers: { Authorization: "Bearer " + authState.user.access_token },
        data: { happiself_course_id: courseId },
      });

      return axiosRes.data;
    } catch (err) {
      const axiosRes = JSON.parse(JSON.stringify(err));

      if (err.response) {
        // Request made and server responded
        console.log(
          "Some issue while unliking course (Hcontext) - ",
          err.response
        );
      }
    }
  };
  const startCourse = async (courseId) => {
    try {
      const axiosRes = await axios({
        method: "post",
        url: `${config.BASE_URL}/api/v1/start-sub-course`,
        headers: { Authorization: "Bearer " + authState.user.access_token },
        data: { happiself_sub_course_id: courseId },
      });

      return axiosRes.data;
    } catch (err) {
      const axiosRes = JSON.parse(JSON.stringify(err));

      if (err.response) {
        // Request made and server responded
        console.log(
          "Some issue while starting course (Hcontext) - ",
          err.response
        );
      }
    }
  };
  const completeCourse = async (courseId) => {
    try {
      const axiosRes = await axios({
        method: "post",
        url: `${config.BASE_URL}/api/v1/end-sub-course`,
        headers: { Authorization: "Bearer " + authState.user.access_token },
        data: { happiself_sub_course_id: courseId },
      });

      return axiosRes.data;
    } catch (err) {
      const axiosRes = JSON.parse(JSON.stringify(err));

      if (err.response) {
        // Request made and server responded
        console.log(
          "Some issue while completing course (Hcontext) - ",
          err.response
        );
      }
    }
  };

  const getNotes = async () => {
    try {
      const axiosRes = await axios({
        method: "get",
        url: `${config.BASE_URL}/api/v1/happiself-get-notes-list`,
        headers: { Authorization: "Bearer " + authState.user.access_token },
      });

      return axiosRes.data;
    } catch (err) {
      const axiosRes = JSON.parse(JSON.stringify(err));

      if (err.response) {
        // Request made and server responded
        console.log(
          "Some issue while getting notes (Hcontext) - ",
          err.response
        );
      }
    }
  };

  const addNote = async ({ note }) => {
    try {
      const axiosRes = await axios({
        method: "post",
        url: `${config.BASE_URL}/api/v1/happiself-add-notes`,
        headers: { Authorization: "Bearer " + authState.user.access_token },
        data: { notes: note },
      });

      return axiosRes.data;
    } catch (err) {
      const axiosRes = JSON.parse(JSON.stringify(err));

      if (err.response) {
        // Request made and server responded
        console.log("Some issue while adding note (Hcontext) - ", err.response);
      }
    }
  };
  const updateNote = async ({ id, note }) => {
    try {
      const axiosRes = await axios({
        method: "post",
        url: `${config.BASE_URL}/api/v1/happiself-update-notes`,
        headers: { Authorization: "Bearer " + authState.user.access_token },
        data: { notes_id: id, notes: note },
      });

      return axiosRes.data;
    } catch (err) {
      const axiosRes = JSON.parse(JSON.stringify(err));

      if (err.response) {
        // Request made and server responded
        console.log(
          "Some issue while updating note (Hcontext) - ",
          err.response
        );
      }
    }
  };
  const deleteNote = async ({ id }) => {
    try {
      const axiosRes = await axios({
        method: "post",
        url: `${config.BASE_URL}/api/v1/happiself-delete-notes-by-id`,
        headers: { Authorization: "Bearer " + authState.user.access_token },
        data: { notes_id: id },
      });

      return axiosRes.data;
    } catch (err) {
      const axiosRes = JSON.parse(JSON.stringify(err));

      if (err.response) {
        // Request made and server responded
        console.log(
          "Some issue while deleting note (Hcontext) - ",
          err.response
        );
      }
    }
  };
  const libraryList = async () => {
    try {
      const axiosRes = await axios({
        method: "get",
        url: `${config.BASE_URL}/api/v1/happiself-library-list`,
        headers: { Authorization: "Bearer " + authState.user.access_token },
      });

      return axiosRes.data;
    } catch (err) {
      const axiosRes = JSON.parse(JSON.stringify(err));

      if (err.response) {
        // Request made and server responded
        console.log(
          "Some issue while getting library list (Hcontext) - ",
          err.response
        );
      }
    }
  };
  const libraryContent = async ({ id }) => {
    try {
      const axiosRes = await axios({
        method: "post",
        url: `${config.BASE_URL}/api/v1/happiself-library-content`,
        headers: { Authorization: "Bearer " + authState.user.access_token },
        data: { happiself_library_id: id },
      });

      return axiosRes.data;
    } catch (err) {
      const axiosRes = JSON.parse(JSON.stringify(err));

      if (err.response) {
        // Request made and server responded
        console.log(
          "Some issue while getting library Content list (Hcontext) - ",
          err.response
        );
      }
    }
  };
  const deleteAccount = async ({ id, answer }) => {
    try {
      const axiosRes = await axios({
        method: "post",
        url: `${config.BASE_URL}/api/v1/delete-account`,
        headers: { Authorization: "Bearer " + authState.user.access_token },
      });

      return axiosRes.data;
    } catch (err) {
      const axiosRes = JSON.parse(JSON.stringify(err));

      if (err.response) {
        // Request made and server responded
        console.log(
          "Some issue while account deletion (Hcontext) - ",
          err.response
        );
      }
    }
  };

  const saveHappiSelfContentAnswer = async ({ id, answer }) => {
    try {
      const axiosRes = await axios({
        method: "post",
        url: `${config.BASE_URL}/api/v1/save-happiself-content-answer`,
        headers: { Authorization: "Bearer " + authState.user.access_token },
        data: { content_id: id, answer },
      });

      return axiosRes.data;
    } catch (err) {
      const axiosRes = JSON.parse(JSON.stringify(err));

      if (err.response) {
        // Request made and server responded
        console.log(
          "Some issue while saving happi-self content answer (Hcontext) - ",
          err.response
        );
      }
    }
  };

  const paymentForIos = async ({
    id = 0,
    amount = 0,
    marchantName = "apple_pay",
    transactionId = null,
    transactionReceipt = null,
  }) => {
    try {
      const axiosRes = await axios({
        method: "post",
        url: `${config.BASE_URL}/api/v1/payment-for-ios`,
        headers: { Authorization: "Bearer " + authState.user.access_token },
        data: {
          plan_id: id,
          amount,
          marchant_name: marchantName,
          transaction_id: transactionId,
          transaction_receipt: transactionReceipt,
        },
      });

      return axiosRes.data;
    } catch (err) {
      const axiosRes = JSON.parse(JSON.stringify(err));

      if (err.response) {
        // Request made and server responded
        console.log(
          "Some issue while payment for ios (Hcontext) - ",
          err.response
        );
      }
    }
  };

  const joinRoom = async ({ sessionId = "" }) => {
    try {
      const axiosRes = await axios({
        method: "post",
        url: `${config.BASE_URL}/api/v1/join-talk-room-user`,
        headers: { Authorization: "Bearer " + authState.user.access_token },
        data: {
          session_id: sessionId,
        },
      });

      return axiosRes.data;
    } catch (err) {
      const axiosRes = JSON.parse(JSON.stringify(err));

      if (err.response) {
        // Request made and server responded
        console.log(
          "Some issue grantng room access token (Hcontext) - ",
          err.response
        );
      }
    }
  };
  const joinRoomGuide = async ({ sessionId = "" }) => {
    try {
      const axiosRes = await axios({
        method: "post",
        url: `${config.BASE_URL}/api/v1/join-guide-room-user`,
        headers: { Authorization: "Bearer " + authState.user.access_token },
        data: {
          session_id: sessionId,
        },
      });

      return axiosRes.data;
    } catch (err) {
      const axiosRes = JSON.parse(JSON.stringify(err));

      if (err.response) {
        // Request made and server responded
        console.log(
          "Some issue grantng room access token for guide (Hcontext) - ",
          err.response
        );
      }
    }
  };

  const psycologistTalkListing = async ({ search = "" }) => {
    try {
      const axiosRes = await axios({
        method: "post",
        url: `${config.BASE_URL}/api/v1/psychologist-listing`,
        headers: { Authorization: "Bearer " + authState.user.access_token },
        data: { search },
      });

      return axiosRes.data;
    } catch (err) {
      const axiosRes = JSON.parse(JSON.stringify(err));

      if (err.response) {
        // Request made and server responded
        console.log(
          "Some issue while getting psycologist listing (Hcontext) - ",
          err.response
        );
      }
    }
  };

  const myBookingUsers = async ({ bookingType }) => {
    try {
      const axiosRes = await axios({
        method: "post",
        url: `${config.BASE_URL}/api/v1/my-booking-user`,
        headers: { Authorization: "Bearer " + authState.user.access_token },
        data: { type: bookingType },
      });

      return axiosRes.data;
    } catch (err) {
      const axiosRes = JSON.parse(JSON.stringify(err));

      if (err.response) {
        // Request made and server responded
        console.log(
          "Some issue while getting my booked users list (Hcontext) - ",
          err.response
        );
      }
    }
  };

  const getSlotsOfPsy = async (id) => {
    try {
      const axiosRes = await axios({
        method: "post",
        url: `${config.BASE_URL}/api/v1/get-slots-of-psy`,
        headers: { Authorization: "Bearer " + authState.user.access_token },
        data: { psychologist_id: id },
      });

      return axiosRes.data;
    } catch (err) {
      const axiosRes = JSON.parse(JSON.stringify(err));

      if (err.response) {
        // Request made and server responded
        console.log(
          "Some issue while getting psycologist slots (Hcontext) - ",
          err.response
        );
      }
    }
  };

  const paymentForHappiTalk = async ({
    psyId = null,
    planId = null,
    amount = 0,
    date = "",
    time = "",
    session = "",
    shouldRecord = false,
    coupen_id = 0,
  }) => {
    try {
      const axiosRes = await axios({
        method: "post",
        url: `${config.BASE_URL}/api/v1/payment-for-happitalk`,
        headers: { Authorization: "Bearer " + authState.user.access_token },
        data: {
          psychologist_id: psyId,
          plan_id: planId,
          amount,
          date,
          time,
          session,
          user_recording_permission: shouldRecord.toString(),
          coupen_id: coupen_id,
        },
      });

      return axiosRes.data;
    } catch (err) {
      const axiosRes = JSON.parse(JSON.stringify(err));

      if (err.response) {
        // Request made and server responded
        console.log(
          "Some issue while getting paymentForHappiTalk (Hcontext) - ",
          err.response
        );
      }
    }
  };

  const cancelBooking = async ({ sessionId = null, cancelReason = null }) => {
    try {
      const axiosRes = await axios({
        method: "post",
        url: `${config.BASE_URL}/api/v1/cancel-booking-user`,
        headers: { Authorization: "Bearer " + authState.user.access_token },
        data: { session_id: sessionId, cancel_reason: cancelReason },
      });

      return axiosRes.data;
    } catch (err) {
      const axiosRes = JSON.parse(JSON.stringify(err));

      if (err.response) {
        // Request made and server responded
        console.log(
          "Some issue while cancelling user booking (Hcontext) - ",
          err.response
        );
      }
    }
  };

  const creditsListing = async () => {
    try {
      const axiosRes = await axios({
        method: "get",
        url: `${config.BASE_URL}/api/v1/list-to-book-another-session-user`,
        headers: { Authorization: "Bearer " + authState.user.access_token },
      });

      return axiosRes.data;
    } catch (err) {
      const axiosRes = JSON.parse(JSON.stringify(err));

      if (err.response) {
        // Request made and server responded
        console.log(
          "Some issue while credit listing (Hcontext) - ",
          err.response
        );
      }
    }
  };

  const bookAnotherSession = async ({ bookingId, date, time }) => {
    try {
      const axiosRes = await axios({
        method: "post",
        url: `${config.BASE_URL}/api/v1/book-another-session-user`,
        headers: { Authorization: "Bearer " + authState.user.access_token },
        data: {
          booking_id: bookingId,
          date,
          time,
          user_recording_permission: "true",
        },
      });

      return axiosRes.data;
    } catch (err) {
      const axiosRes = JSON.parse(JSON.stringify(err));

      if (err.response) {
        // Request made and server responded
        console.log(
          "Some issue while booking another session (Hcontext) - ",
          err.response
        );
      }
    }
  };
  const rescheduleBooking = async ({ session, date, time }) => {
    try {
      const axiosRes = await axios({
        method: "post",
        url: `${config.BASE_URL}/api/v1/reschedule-booking-user`,
        headers: { Authorization: "Bearer " + authState.user.access_token },
        data: { session_id: session, date, time },
      });

      return axiosRes.data;
    } catch (err) {
      const axiosRes = JSON.parse(JSON.stringify(err));

      if (err.response) {
        // Request made and server responded
        console.log(
          "Some issue while rescheduling booking (Hcontext) - ",
          err.response
        );
      }
    }
  };
  const rescheduleGuideBooking = async ({ session, date, time }) => {
    try {
      const axiosRes = await axios({
        method: "post",
        url: `${config.BASE_URL}/api/v1/happiguide-reschedule-session-user`,
        headers: { Authorization: "Bearer " + authState.user.access_token },
        data: { session_id: session, date, time },
      });

      return axiosRes.data;
    } catch (err) {
      const axiosRes = JSON.parse(JSON.stringify(err));

      if (err.response) {
        // Request made and server responded
        console.log(
          "Some issue while rescheduling guide booking (Hcontext) - ",
          err.response
        );
      }
    }
  };
  const psycologistPayment = async ({
    psyId,
    session,
    date,
    time,
    shouldRecord = false,
    coupen_id = 0,
  }) => {
    try {
      const axiosRes = await axios({
        method: "post",
        url: `${config.BASE_URL}/api/v1/avail-haapitalk-user`,
        headers: { Authorization: "Bearer " + authState.user.access_token },
        data: {
          psychologist_id: psyId,
          session,
          date,
          time,
          user_recording_permission: shouldRecord,
          coupen_id: coupen_id,
        },
      });

      return axiosRes.data;
    } catch (err) {
      const axiosRes = JSON.parse(JSON.stringify(err));

      if (err.response) {
        // Request made and server responded
        console.log(
          "Some issue while psycologist payment (Hcontext) - ",
          err.response
        );
      }
    }
  };
  const happiGUIDEPayment = async (data) => {
    try {
      const axiosRes = await axios({
        method: "post",
        url: `${config.BASE_URL}/api/v1/payment-for-happiguide`,
        headers: { Authorization: "Bearer " + authState.user.access_token },
        data: data,
      });

      return axiosRes.data;
    } catch (err) {
      const axiosRes = JSON.parse(JSON.stringify(err));

      if (err.response) {
        // Request made and server responded
        console.log(
          "Some issue while HappiGUIDE payment (Hcontext) - ",
          err.response
        );
      }
    }
  };
  const happiGUIDESession = async () => {
    try {
      const axiosRes = await axios({
        method: "post",
        url: `${config.BASE_URL}/api/v1/happiguide-session-user`,
        headers: { Authorization: "Bearer " + authState.user.access_token },
      });

      return axiosRes.data;
    } catch (err) {
      const axiosRes = JSON.parse(JSON.stringify(err));

      if (err.response) {
        // Request made and server responded
        console.log(
          "Some issue while getting HappiGUIDE session (Hcontext) - ",
          err.response
        );
      }
    }
  };
  const moodEmojiList = async () => {
    try {
      const axiosRes = await axios({
        method: "get",
        url: `${config.BASE_URL}/api/v1/mood-emoji-list`,
        headers: { Authorization: "Bearer " + authState.user.access_token },
      });

      return axiosRes.data;
    } catch (err) {
      const axiosRes = JSON.parse(JSON.stringify(err));

      if (err.response) {
        // Request made and server responded
        console.log(
          "Some issue while getting Mood-O-Meter emoji list (Hcontext) - ",
          err.response
        );
      }
    }
  };
  const userMood = async ({ id, name }) => {
    try {
      const axiosRes = await axios({
        method: "post",
        url: `${config.BASE_URL}/api/v1/user-mood`,
        headers: { Authorization: "Bearer " + authState.user.access_token },
        data: { emoji_id: id, text: name },
      });

      return axiosRes.data;
    } catch (err) {
      const axiosRes = JSON.parse(JSON.stringify(err));

      if (err.response) {
        // Request made and server responded
        console.log(
          "Some issue while saving Mood-O-Meter response (Hcontext) - ",
          err.response
        );
      }
    }
  };
  const totalRewardPoints = async () => {
    try {
      const axiosRes = await axios({
        method: "get",
        url: `${config.BASE_URL}/api/v1/total-reward-points-user`,
        headers: { Authorization: "Bearer " + authState.user.access_token },
      });

      return axiosRes.data;
    } catch (err) {
      const axiosRes = JSON.parse(JSON.stringify(err));

      if (err.response) {
        // Request made and server responded
        console.log(
          "Some issue while fetching reward points (Hcontext) - ",
          err.response
        );
      }
    }
  };
  const refferalCode = async () => {
    try {
      const axiosRes = await axios({
        method: "get",
        url: `${config.BASE_URL}/api/v1/my-referral-code`,
        headers: { Authorization: "Bearer " + authState.user.access_token },
      });

      return axiosRes.data;
    } catch (err) {
      const axiosRes = JSON.parse(JSON.stringify(err));

      if (err.response) {
        // Request made and server responded
        console.log(
          "Some issue while fetching refferal code (Hcontext) - ",
          err.response
        );
      }
    }
  };
  const screenTrafficAnalytics = async ({ screenName }) => {
    try {
      const axiosRes = await axios({
        method: "post",
        url: config.ANALYTICS_URL,
        data: {
          app_id: config.ANALYTOCS_APP_ID,
          app_token: config.ANALYTOCS_APP_TOKEN,
          screenName,
        },
      });

      return axiosRes.data;
    } catch (err) {
      const axiosRes = JSON.parse(JSON.stringify(err));

      if (err.response) {
        // Request made and server responded
        console.log(
          "Some issue while sending analytics data (Hcontext) - ",
          // err.response
        );
      }
    }
  };
  const rewardList = async () => {
    try {
      const axiosRes = await axios({
        method: "get",
        url: `${config.BASE_URL}/api/v1/reward-instances-list`,
        headers: { Authorization: "Bearer " + authState.user.access_token },
      });

      return axiosRes.data;
    } catch (err) {
      const axiosRes = JSON.parse(JSON.stringify(err));

      if (err.response) {
        // Request made and server responded
        console.log(
          "Some issue while getting reward list (Hcontext) - ",
          err.response
        );
      }
    }
  };
  const offerScreenContent = async () => {
    try {
      const axiosRes = await axios({
        method: "get",
        url: `${config.BASE_URL}/api/v1/offer-screen-content`,
        // headers: { Authorization: "Bearer " + authState.user.access_token },
      });

      return axiosRes.data;
    } catch (err) {
      const axiosRes = JSON.parse(JSON.stringify(err));

      if (err.response) {
        // Request made and server responded
        console.log(
          "Some issue while getting offer screen content (Hcontext) - ",
          err.response
        );
      }
    }
  };
  const getUserReport = async ({ user }) => {
    try {
      const axiosRes = await axios({
        method: "post",
        url: `${config.BASE_URL}/api/v1/get-user-report-by-psy`,
        headers: { Authorization: "Bearer " + authState.user.access_token },
        data: { user_id: user },
      });

      return axiosRes.data;
    } catch (err) {
      const axiosRes = JSON.parse(JSON.stringify(err));

      if (err.response) {
        // Request made and server responded
        console.log(
          "Some issue while getting user report (Hcontext) - ",
          err.response
        );
      }
    }
  };
  const availHappiGuideUser = async ({ planId, date, time, coupen_id = 0 }) => {
    try {
      const axiosRes = await axios({
        method: "post",
        url: `${config.BASE_URL}/api/v1/avail-happiguide-user`,
        headers: { Authorization: "Bearer " + authState.user.access_token },
        data: { plan_id: planId, date, time, coupen_id },
      });

      return axiosRes.data;
    } catch (err) {
      const axiosRes = JSON.parse(JSON.stringify(err));

      if (err.response) {
        // Request made and server responded
        console.log(
          "Some issue while getting avail happiguide user (Hcontext) - ",
          err.response
        );
      }
    }
  };
  const saveEmail = async ({ email }) => {
    try {
      const axiosRes = await axios({
        method: "post",
        url: `${config.BASE_URL}/api/v1/save-email`,
        headers: { Authorization: "Bearer " + authState.user.access_token },
        data: { email },
      });

      return axiosRes.data;
    } catch (err) {
      const axiosRes = JSON.parse(JSON.stringify(err));

      if (err.response) {
        // Request made and server responded
        console.log(
          "Some issue while saving email (Hcontext) - ",
          err.response
        );
      }
    }
  };
  const getPenaltyClauseUser = async () => {
    try {
      const axiosRes = await axios({
        method: "get",
        url: `${config.BASE_URL}/api/v1/get-penalty-clause-user`,
        headers: { Authorization: "Bearer " + authState.user.access_token },
      });

      return axiosRes.data;
    } catch (err) {
      const axiosRes = JSON.parse(JSON.stringify(err));

      if (err.response) {
        // Request made and server responded
        console.log(
          "Some issue while getting panelity clause for user (Hcontext) - ",
          err.response
        );
      }
    }
  };
  const onOffStatus = async () => {
    try {
      const axiosRes = await axios({
        method: "get",
        url: `${config.BASE_URL}/api/v1/on-off-status`,
        headers: { Authorization: "Bearer " + authState.user.access_token },
      });

      return axiosRes.data;
    } catch (err) {
      const axiosRes = JSON.parse(JSON.stringify(err));

      if (err.response) {
        // Request made and server responded
        console.log(
          "Some issue while getting on-off status (Hcontext) - ",
          err.response
        );
      }
    }
  };

  return (
    <Hcontext.Provider
      value={{
        // Reducers
        authState,
        authDispatch,
        snackState,
        snackDispatch,
        whiteLabelState,
        whiteLabelDispatch,
        happiSelfState,
        happiSelfDispatch,
        // Common Methods
        userLogin,
        userCodeLogin,
        userLogout,
        guardianVerification,
        verifyGuardianOtp,
        getSponsorList,
        checkSponsorCode,
        getProfileList,
        userSignup,
        userProfileEdit,
        getUserProfile,
        changePassword,
        forgotPassword,
        verifyOtp,
        resetPassword,
        startAssessment,
        submitAnswer,
        AnyAssessment,
        getReport,
        getAllReport,
        getLanguages,
        assignPsychologist,
        changePsychologist,
        currentlyAssignedPsycologist,
        sendMsgToPsy,
        clearMessageBatch,
        happiLearnList,
        happiLearnContent,
        likePost,
        unlikePost,
        getBundles,
        payments,
        getSubscriptions,
        applyCoupon,
        sendOTP,
        getEmojiList,
        submitRating,
        raiseQuery,
        submitFeedback,
        getNotifications,
        sendChatNotification,
        sendNotification,
        fileUploadFirebase,
        getWhiteLabel,
        getFAQ,
        courseList,
        subCourseList,
        subCourseContent,
        likeCourse,
        unLikeCourse,
        startCourse,
        completeCourse,
        getNotes,
        addNote,
        updateNote,
        deleteNote,
        libraryList,
        libraryContent,
        deleteAccount,
        saveHappiSelfContentAnswer,
        paymentForIos,
        joinRoom,
        joinRoomGuide,
        psycologistTalkListing,
        myBookingUsers,
        getSlotsOfPsy,
        paymentForHappiTalk,
        cancelBooking,
        creditsListing,
        bookAnotherSession,
        happiGUIDEPayment,
        happiGUIDESession,
        rescheduleBooking,
        psycologistPayment,
        rescheduleGuideBooking,
        moodEmojiList,
        userMood,
        refferalCode,
        screenTrafficAnalytics,
        rewardList,
        offerScreenContent,
        getUserReport,
        availHappiGuideUser,
        submitOpinionAfterSession,
        getPenaltyClauseUser,
        saveEmail,
        onOffStatus,
        // State Variables
        selectedCategory,
        setSelectedCategory,
        selectedFilter,
        setSelectedFilter,
        contentType,
        setContentType,
        parameters,
        setParameters,
        language,
        setLanguage,
        profile,
        setProfile,
        searchTerm,
        setSearchTerm,
        selectedMood,
        setSelectedMood,
        signedUrlAudio,
        setsignedUrlAudio,
        tokenSonde,
        setTokenSonde,
        sondeJobId, 
        setSondeJobId,
        sondeUserId, 
        setSondeUserId,
        voiceReport,
        setVoiceReport,
        totalRewardPoints,
        botVisible,
        setBotVisible,
        gotoVideo,
        setGotoVideo,
        gotoAssessment, 
        setGotoAssessment,
        categoryId, 
        setCategoryId

      }}
    >
      {props.children}
    </Hcontext.Provider>
  );
};
