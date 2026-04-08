import React, { useState, useEffect, useReducer, useRef } from "react";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import messaging from "@react-native-firebase/messaging";
import { getStorage, ref, getDownloadURL, uploadBytes } from "firebase/storage";
import apiClient from "./apiClient";

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

export const Hprovider = (props) => {
  // Reducer Variables
  const [authState, authDispatch] = useReducer(authReducer, initialAuthState);
  const [whiteLabelState, whiteLabelDispatch] = useReducer(
    whiteLabelReducer,
    initialLabelState,
  );
  const [happiSelfState, happiSelfDispatch] = useReducer(
    happiSelfReducer,
    initialSelfState,
  );
  const [snackState, snackDispatch] = useReducer(
    snackReducer,
    initialSnackState,
  );

  // State Variables
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
  const [gotoVideo, setGotoVideo] = useState(false);
  const [gotoAssessment, setGotoAssessment] = useState(false);
  const [categoryId, setCategoryId] = useState("");

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
      // Unsubscribe FCM listeners when the provider unmounts.
      if (notificationListener.current) notificationListener.current();
      if (responseListener.current) responseListener.current();
    };
  }, []);

  const notificationsHandler = async () => {
  try {
    const token = await registerForPushNotificationsAsync();
    if (token) {
      setDeviceToken(token);
      setExpoPushToken(token);
    }

    notificationListener.current = messaging().onMessage(async (msg) => {
      if (msg?.data) setNotification(msg.data);
    });

    responseListener.current = messaging().onNotificationOpenedApp((msg) => {
      if (msg?.data) setNotification(msg.data);
    });

    const initial = await messaging().getInitialNotification();
    if (initial?.data) setNotification(initial.data);

  } catch (err) {
    console.log("Notification setup error:", err);
  }
};

  const registerForPushNotificationsAsync = async () => {
    try {
      // Request notification permission.
      // On Android 13+ this triggers the POST_NOTIFICATIONS runtime prompt.
      // On iOS it requests alert / badge / sound permissions.
      const authStatus = await messaging().requestPermission();
      const granted =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (!granted) {
        console.log("Notification permission not granted, status:", authStatus);
        return null;
      }

      // Retrieve the FCM registration token for this device.
      const token = await messaging().getToken();
      console.log("FCM device token:", token);
      return token;
    } catch (err) {
      console.log("Error registering for push notifications:", err);
      return null;
    }
  };

  const userLogin = async ({ username, password }) => {
  try {
    const res = await apiClient.post("/api/v1/login", {
      username,
      password,
      device_token: deviceToken || "TestDeviceToken",
    });

    return res.data;
  } catch (err) {
    snackDispatch({
      type: "SHOW_SNACK",
      payload: err.message || "Login failed",
    });
    throw err;
  }
};

  const userCodeLogin = async ({ code }) => {
    try {
      const res = await apiClient.post("/api/v1/login-with-code", {
        happimynd_code: code,
        device_token: deviceToken,
      });

      return res.data;
    } catch (err) {
      snackDispatch({
        type: "SHOW_SNACK",
        payload: "Invalid code. Please check again.",
      });
      throw err;
    }
  };

  const userLogout = async ({ token }) => {
    try {
      const res = await apiClient.get("/api/v1/logout");
      return res.data;
    } catch (err) {
      console.log("Logout error:", err);
      throw err;
    }
  };

  const guardianVerification = async ({ type, uniqueId, mobile, email }) => {
    try {
      const res = await apiClient.post("/api/v1/guardian-verification", {
        type,
        random_unique_id: uniqueId,
        email,
        mobile,
      });

      return res.data;
    } catch (err) {
      console.log("Guardian verification error:", err);
      throw err;
    }
  };

  const verifyGuardianOtp = async ({ otp, uniqueId }) => {
    try {
      const res = await apiClient.post("/api/v1/verify-guardian-otp", {
        otp,
        unique_id: uniqueId,
      });

      return res.data;
    } catch (err) {
      console.log("Verify guardian OTP error:", err);
      throw err;
    }
  };

  const getSponsorList = async () => {
    try {
      const res = await axios.get(`${config.BASE_URL}/api/v1/organizer-list`);
      return res.data;
    } catch (err) {
      console.log("Get sponsor list error:", err);
      throw err;
    }
  };

  const checkSponsorCode = async ({ id, code }) => {
    try {
      const res = await axios.post(`${config.BASE_URL}/api/v1/entry-via-org`, {
        organization_id: id,
        happimynd_code: code,
      });

      return res.data;
    } catch (err) {
      console.log("Check sponsor code error:", err);
      snackDispatch({ type: "SHOW_SNACK", payload: "Please check your code." });
      throw err;
    }
  };

  const getProfileList = async () => {
    try {
      const res = await axios.get(`${config.BASE_URL}/api/v1/user-profile`);
      return res.data;
    } catch (err) {
      console.log("Get profile list error:", err);
      throw err;
    }
  };

  const userSignup = async (data) => {
  try {
    const res = await apiClient.post("/api/v1/signup", {
      nickname: data.nickName,
      user_profile_id: data.selectedProfileType,
      age: data.age,
      gender: data.gender,
      username: data.userName,
      password: data.password,
      confirm_password: data.confirmPassword,
      signup_type: data.signupType, // FIXED
      happimyndCode: data.happimyndCode,
      language: data.language,
      device_token: deviceToken,
      referral_code: data.refferalCode,
    });

    return res.data;
  } catch (err) {
    snackDispatch({
      type: "SHOW_SNACK",
      payload: err.message,
    });
    throw err;
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
      const res = await apiClient.post("/api/v1/edit-profile", {
        nickname: nickName,
        user_profile_id: userProfileId,
        age,
        gender,
        username: userName,
        email,
        mobile: phone,
      });

      return res.data;
    } catch (err) {
      console.log("Profile edit error:", err);
      throw err;
    }
  };

  const getUserProfile = async ({ token }) => {
    try {
      const res = await apiClient.get("/api/v1/get-profile");
      return res.data;
    } catch (err) {
      console.log("Get user profile error:", err);
      throw err;
    }
  };

  const changePassword = async ({
    oldPassword,
    newPassword,
    confirmPassword,
  }) => {
    try {
      const res = await apiClient.post("/api/v1/change-password", {
        old_password: oldPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });

      return res.data;
    } catch (err) {
      snackDispatch({
        type: "SHOW_SNACK",
        payload: err.message || "Old password incorrect!",
      });
      throw err;
    }
  };

  const forgotPassword = async ({ email, mobile }) => {
    try {
      const res = await axios.post(`${config.BASE_URL}/api/v1/forgot-password`, {
        email,
        type: email ? "email" : "mobile",
        mobile,
      });

      return res.data;
    } catch (err) {
      snackDispatch({
        type: "SHOW_SNACK",
        payload: "You have not registered these details with us yet. Please create a new account.",
      });
      throw err;
    }
  };

  const verifyOtp = async ({ email, mobile, otp }) => {
    try {
      const res = await axios.post(`${config.BASE_URL}/api/v1/verify-otp`, {
        email,
        mobile,
        otp,
      });

      return res.data;
    } catch (err) {
      snackDispatch({
        type: "SHOW_SNACK",
        payload: "OTP incorrect!",
      });
      throw err;
    }
  };

  const resetPassword = async ({
    password,
    confirmPassword,
    email,
    mobile,
  }) => {
    try {
      const res = await axios.post(`${config.BASE_URL}/api/v1/reset-password`, {
        password,
        confirm_password: confirmPassword,
        email,
        mobile,
      });

      return res.data;
    } catch (err) {
      console.log("Reset password error:", err);
      throw err;
    }
  };

  const startAssessment = async ({ token }) => {
    try {
      console.log("Calling start-assessment endpoint...");
      const res = await apiClient.post("/api/v1/start-assessment", {
        platform: Platform.OS,
      });

      console.log("Assessment response:", res.data);
      return res.data;
    } catch (err) {
      console.log("Start assessment error:", err);
      console.log("Error response:", err.response?.data || err.message);
      console.log("Error status:", err.response?.status);
      snackDispatch({
        type: "SHOW_SNACK",
        payload: err.response?.data?.message || "Failed to start assessment. Please try again.",
      });
      throw err;
    }
  };

  const AnyAssessment = async ({ token }) => {
    try {
      const res = await apiClient.post("/api/v1/checkifany", {
        platform: Platform.OS,
      });

      return res.data;
    } catch (err) {
      console.log("Check assessment error:", err);
      throw err;
    }
  };

  const submitAnswer = async ({ optionId }) => {
    try {
      const res = await apiClient.post("/api/v1/save-option", {
        option_question_id: optionId,
      });

      return res.data;
    } catch (err) {
      console.log("Submit answer error:", err);
      throw err;
    }
  };

  const getReport = async () => {
    try {
      const res = await apiClient.get("/api/v1/get-report");
      return res.data;
    } catch (err) {
      if (err.status === 500) {
        snackDispatch({ type: "SHOW_SNACK", payload: err.message });
      }
      throw err;
    }
  };

  const getAllReport = async () => {
    try {
      const res = await apiClient.get("/api/v1/get-all-report");
      return res.data;
    } catch (err) {
      if (err.status === 500) {
        snackDispatch({ type: "SHOW_SNACK", payload: err.message });
      }
      throw err;
    }
  };

  const getLanguages = async () => {
    try {
      const axiosRes = await axios({
        method: "get",
        url: `${config.BASE_URL}/api/v1/language-list`,
        headers: { Authorization: "Bearer " + authState?.user?.access_token },
      });

      return axiosRes.data;
    } catch (err) {
      if (err.response) {
        // Request made and server responded with an error status
        console.log(
          "getLanguages – server error | status:",
          err.response.status,
          "| data:",
          JSON.stringify(err.response.data),
        );
      } else if (err.request) {
        // Request was made but no response received (network / SSL / timeout)
        console.log(
          "getLanguages – no response received (network/SSL/timeout) | message:",
          err.message,
        );
      } else {
        // Something else went wrong while setting up the request
        console.log("getLanguages – request setup error:", err.message);
      }
      // Re-throw so the calling component can show an error state
      throw err;
    }
  };

  const assignPsychologist = async ({ language }) => {
    try {
      const res = await apiClient.post("/api/v1/assign-psychologist", {
        language,
      });

      return res.data;
    } catch (err) {
      console.log("Assign psychologist error:", err);
      throw err;
    }
  };

  const changePsychologist = async ({ language }) => {
    try {
      const res = await apiClient.post("/api/v1/switch-language-while-chat", {
        language,
      });

      return res.data;
    } catch (err) {
      console.log("Change psychologist error:", err);
      throw err;
    }
  };

  const currentlyAssignedPsychologist = async () => {
    try {
      const res = await apiClient.get("/api/v1/psy-whom-user-currently-chatting");
      return res.data;
    } catch (err) {
      console.log("Get assigned psychologist error:", err);
      throw err;
    }
  };

  const sendMsgToPsy = async ({ groupId, psyId, message }) => {
    try {
      const res = await apiClient.post("/api/v1/send-message-by-user-to-psy", {
        group_id: groupId,
        psychologist_id: psyId,
        message,
      });

      return res.data;
    } catch (err) {
      console.log("Send message to psychologist error:", err);
      throw err;
    }
  };

  const clearMessageBatch = async () => {
    try {
      const res = await apiClient.post("/api/v1/clear-message-batch-of-user");
      return res.data;
    } catch (err) {
      console.log("Clear message batch error:", err);
      throw err;
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
      const res = await apiClient.post("/api/v1/happi-learn-content", {
        search,
        content_type: contentType,
        parameters,
        profile,
        language,
      });

      return res.data;
    } catch (err) {
      console.log("HappiLearn list error:", err);
      throw err;
    }
  };

  const happiLearnContent = async ({ id }) => {
    try {
      const res = await apiClient.post("/api/v1/happi-learn-content-by-id", {
        content_id: id,
      });

      return res.data;
    } catch (err) {
      console.log("HappiLearn content error:", err);
      throw err;
    }
  };

  const likePost = async ({ id = null }) => {
    try {
      const res = await apiClient.post("/api/v1/like-happi-learn-post", {
        happi_learn_content_id: id,
      });

      return res.data;
    } catch (err) {
      console.log("Like post error:", err);
      throw err;
    }
  };

  const unlikePost = async ({ id = null }) => {
    try {
      const res = await apiClient.post("/api/v1/unlike-happi-learn-post", {
        happi_learn_content_id: id,
      });

      return res.data;
    } catch (err) {
      console.log("Unlike post error:", err);
      throw err;
    }
  };

  const getBundles = async () => {
    try {
      const res = await apiClient.get("/api/v1/buy-plan");
      return res.data;
    } catch (err) {
      console.log("Get bundles error:", err);
      throw err;
    }
  };

  const payments = async ({ id, amount, couponId = 0 }) => {
  try {
    const endpoint =
      amount && Number(amount) > 0
        ? "/api/v1/payment"
        : "/api/v1/avail-free-services";

    const res = await apiClient.post(endpoint, {
      plan_id: id,
      amount,
      coupon_id: couponId,
    });

    return res.data;
  } catch (err) {
    console.log("Payment error:", err);
    throw err;
  }
};

  const getSubscriptions = async () => {
    try {
      const res = await apiClient.get("/api/v1/my-subscribed-services");
      return res.data;
    } catch (err) {
      console.log("Get subscriptions error:", err);
      throw err;
    }
  };

  const applyCoupon = async ({ plan, coupon }) => {
    try {
      const res = await apiClient.post("/api/v1/apply-coupon", {
        plan_id: plan,
        coupon,
      });

      return res.data;
    } catch (err) {
      console.log("Apply coupon error:", err);
      snackDispatch({
        type: "SHOW_SNACK",
        payload: err.message || "Failed to apply coupon",
      });
      throw err;
    }
  };

  const sendOTP = async ({ type, email, mobile, country_code }) => {
    let dataToSend;
    if (type === "email") {
      dataToSend = { type, email };
    } else if (type === "mobile") {
      dataToSend = { type, mobile, country_code };
    }
    
    try {
      const res = await apiClient.post("/api/v1/send-verification-otp", dataToSend);
      return res.data;
    } catch (err) {
      const message = err.message || "";
      if (message.includes("Email address is already exist")) {
        snackDispatch({
          type: "SHOW_SNACK",
          payload: "This Email ID is already registered.",
        });
      } else if (message.includes("Mobile number is already exist")) {
        snackDispatch({
          type: "SHOW_SNACK",
          payload: "This mobile number is already registered.",
        });
      } else {
        snackDispatch({
          type: "SHOW_SNACK",
          payload: message,
        });
      }
      throw err;
    }
  };

  const getEmojiList = async () => {
    try {
      const res = await apiClient.get("/api/v1/emoji-list");
      return res.data;
    } catch (err) {
      console.log("Get emoji list error:", err);
      throw err;
    }
  };

  const submitRating = async ({ id, review }) => {
    try {
      const res = await apiClient.post("/api/v1/submit-rating", {
        application_rate_emoji_id: id,
        review,
      });

      return res.data;
    } catch (err) {
      console.log("Submit rating error:", err);
      throw err;
    }
  };

  const raiseQuery = async ({ category, description }) => {
    try {
      const res = await apiClient.post("/api/v1/raise-query-app", {
        category,
        description,
      });

      return res.data;
    } catch (err) {
      console.log("Raise query error:", err);
      throw err;
    }
  };
  const submitFeedback = async ({ id, review }) => {
    try {
      const res = await apiClient.post("/api/v1/feedback", {
        application_rate_emoji_id: id,
        feedback_message: review,
      });

      return res.data;
    } catch (err) {
      console.log("Submit feedback error:", err);
      throw err;
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
      const endpoint =
        module === "talk"
          ? "/api/v1/submit-opinion-after-session-user"
          : "/api/v1/submit-opinion-after-guide-session-user";

      const res = await apiClient.post(endpoint, {
        session_id: sessionId,
        emoji_id: emojiId,
        reason,
        additional_comment: comments,
      });

      return res.data;
    } catch (err) {
      console.log("Submit opinion error:", err);
      throw err;
    }
  };

  const getNotifications = async () => {
    try {
      const res = await apiClient.get("/api/v1/notification-list");
      return res.data;
    } catch (err) {
      console.log("Get notifications error:", err);
      throw err;
    }
  };

  const sendChatNotification = async ({ deviceToken, message }) => {
    try {
      const axiosRes = await axios({
        method: "post",
        url: `https://exp.host/--/api/v2/push/send`,
        // headers: { Authorization: "Bearer " + authState?.user?.access_token },
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
          err.response,
        );
      }
    }
  };

  const sendNotification = async ({ message }) => {
    try {
      const axiosRes = await axios({
        method: "post",
        url: `https://exp.host/--/api/v2/push/send`,
        // headers: { Authorization: "Bearer " + authState?.user?.access_token },
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
        err,
      );
    }
  };

  const fileUploadFirebase = async (source) => {
  try {
    const response = await fetch(source);
    const blob = await response.blob();

    const fileName = source.substring(source.lastIndexOf("/") + 1);

    const storage = getStorage();
    const storageRef = ref(storage, fileName);

    // Upload
    const snapshot = await uploadBytes(storageRef, blob);

    // Get URL (IMPORTANT)
    const downloadURL = await getDownloadURL(snapshot.ref);

    return downloadURL;
  } catch (err) {
    console.log("Firebase upload error:", err);
    throw err;
  }
};

  const getWhiteLabel = async () => {
    try {
      const res = await apiClient.get("/api/v1/white-labelling-status");
      return res.data;
    } catch (err) {
      console.log("Get white label error:", err);
      throw err;
    }
  };

  const getFAQ = async () => {
    try {
      const res = await axios.get(`${config.BASE_URL}/api/v1/general-faqs`);
      return res.data;
    } catch (err) {
      console.log("Get FAQ error:", err);
      throw err;
    }
  };

  const courseList = async () => {
    try {
      const res = await apiClient.get("/api/v1/course-list");
      return res.data;
    } catch (err) {
      console.log("Course list error:", err);
      throw err;
    }
  };

  const subCourseList = async (courseId) => {
    try {
      const res = await apiClient.post("/api/v1/sub-course-list", {
        happiself_course_id: courseId,
      });

      return res.data;
    } catch (err) {
      console.log("Sub course list error:", err);
      throw err;
    }
  };

  const subCourseContent = async (subCourseId) => {
    try {
      const res = await apiClient.post("/api/v1/get-sub-course-content", {
        happiself_sub_course_id: subCourseId,
      });

      return res.data;
    } catch (err) {
      console.log("Sub course content error:", err);
      throw err;
    }
  };

  const likeCourse = async (courseId) => {
    try {
      const res = await apiClient.post("/api/v1/like-happiself-course", {
        happiself_course_id: courseId,
      });

      return res.data;
    } catch (err) {
      console.log("Like course error:", err);
      throw err;
    }
  };
  const unLikeCourse = async (courseId) => {
    try {
      const res = await apiClient.post("/api/v1/unlike-happiself-course", {
        happiself_course_id: courseId,
      });

      return res.data;
    } catch (err) {
      console.log("Unlike course error:", err);
      throw err;
    }
  };
  const startCourse = async (courseId) => {
    try {
      const res = await apiClient.post("/api/v1/start-sub-course", {
        happiself_sub_course_id: courseId,
      });

      return res.data;
    } catch (err) {
      console.log("Start course error:", err);
      throw err;
    }
  };
  const completeCourse = async (courseId) => {
    try {
      const res = await apiClient.post("/api/v1/end-sub-course", {
        happiself_sub_course_id: courseId,
      });

      return res.data;
    } catch (err) {
      console.log("Complete course error:", err);
      throw err;
    }
  };

  const getNotes = async () => {
    try {
      const res = await apiClient.get("/api/v1/happiself-get-notes-list");
      return res.data;
    } catch (err) {
      console.log("Get notes error:", err);
      throw err;
    }
  };

  const addNote = async ({ note }) => {
    try {
      const res = await apiClient.post("/api/v1/happiself-add-notes", {
        notes: note,
      });

      return res.data;
    } catch (err) {
      console.log("Add note error:", err);
      throw err;
    }
  };
  const updateNote = async ({ id, note }) => {
    try {
      const res = await apiClient.post("/api/v1/happiself-update-notes", {
        notes_id: id,
        notes: note,
      });

      return res.data;
    } catch (err) {
      console.log("Update note error:", err);
      throw err;
    }
  };
  const deleteNote = async ({ id }) => {
    try {
      const res = await apiClient.post("/api/v1/happiself-delete-notes-by-id", {
        notes_id: id,
      });

      return res.data;
    } catch (err) {
      console.log("Delete note error:", err);
      throw err;
    }
  };
  const libraryList = async () => {
    try {
      const res = await apiClient.get("/api/v1/happiself-library-list");
      return res.data;
    } catch (err) {
      console.log("Library list error:", err);
      throw err;
    }
  };
  const libraryContent = async ({ id }) => {
    try {
      const res = await apiClient.post("/api/v1/happiself-library-content", {
        happiself_library_id: id,
      });

      return res.data;
    } catch (err) {
      console.log("Library content error:", err);
      throw err;
    }
  };
  const deleteAccount = async ({ id, answer }) => {
    try {
      const res = await apiClient.post("/api/v1/delete-account");
      return res.data;
    } catch (err) {
      console.log("Delete account error:", err);
      throw err;
    }
  };

  const saveHappiSelfContentAnswer = async ({ id, answer }) => {
    try {
      const res = await apiClient.post("/api/v1/save-happiself-content-answer", {
        content_id: id,
        answer,
      });

      return res.data;
    } catch (err) {
      console.log("Save HappiSelf answer error:", err);
      throw err;
    }
  };

  const paymentForIos = async ({
    id = 0,
    amount = 0,
    merchantName = "apple_pay",
    transactionId = null,
    transactionReceipt = null,
  }) => {
    try {
      const res = await apiClient.post("/api/v1/payment-for-ios", {
        plan_id: id,
        amount,
        merchant_name: merchantName,
        transaction_id: transactionId,
        transaction_receipt: transactionReceipt,
      });

      return res.data;
    } catch (err) {
      console.log("Payment for iOS error:", err);
      throw err;
    }
  };

  const joinRoom = async ({ sessionId = "" }) => {
    try {
      const res = await apiClient.post("/api/v1/join-talk-room-user", {
        session_id: sessionId,
      });

      return res.data;
    } catch (err) {
      console.log("Join room error:", err);
      throw err;
    }
  };
  const joinRoomGuide = async ({ sessionId = "" }) => {
    try {
      const res = await apiClient.post("/api/v1/join-guide-room-user", {
        session_id: sessionId,
      });

      return res.data;
    } catch (err) {
      console.log("Join room guide error:", err);
      throw err;
    }
  };

  const psychologistTalkListing = async ({ search = "" }) => {
    try {
      const res = await apiClient.post("/api/v1/psychologist-listing", {
        search,
      });

      return res.data;
    } catch (err) {
      console.log("Psychologist listing error:", err);
      throw err;
    }
  };

  const myBookingUsers = async ({ bookingType }) => {
    try {
      const res = await apiClient.post("/api/v1/my-booking-user", {
        type: bookingType,
      });

      return res.data;
    } catch (err) {
      console.log("My booking users error:", err);
      throw err;
    }
  };

  const getSlotsOfPsy = async (id) => {
    try {
      const res = await apiClient.post("/api/v1/get-slots-of-psy", {
        psychologist_id: id,
      });

      return res.data;
    } catch (err) {
      console.log("Get slots error:", err);
      throw err;
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
    coupon_id = 0,
  }) => {
    try {
      const res = await apiClient.post("/api/v1/payment-for-happitalk", {
        psychologist_id: psyId,
        plan_id: planId,
        amount,
        date,
        time,
        session,
        user_recording_permission: shouldRecord.toString(),
        coupon_id,
      });

      return res.data;
    } catch (err) {
      console.log("Payment for HappiTalk error:", err);
      throw err;
    }
  };

  const cancelBooking = async ({ sessionId = null, cancelReason = null }) => {
    try {
      const res = await apiClient.post("/api/v1/cancel-booking-user", {
        session_id: sessionId,
        cancel_reason: cancelReason,
      });

      return res.data;
    } catch (err) {
      console.log("Cancel booking error:", err);
      throw err;
    }
  };

  const creditsListing = async () => {
    try {
      const res = await apiClient.get("/api/v1/list-to-book-another-session-user");
      return res.data;
    } catch (err) {
      console.log("Credits listing error:", err);
      throw err;
    }
  };

  const bookAnotherSession = async ({ bookingId, date, time }) => {
    try {
      const res = await apiClient.post("/api/v1/book-another-session-user", {
        booking_id: bookingId,
        date,
        time,
        user_recording_permission: "true",
      });

      return res.data;
    } catch (err) {
      console.log("Book another session error:", err);
      throw err;
    }
  };
  const rescheduleBooking = async ({ session, date, time }) => {
    try {
      const res = await apiClient.post("/api/v1/reschedule-booking-user", {
        session_id: session,
        date,
        time,
      });

      return res.data;
    } catch (err) {
      console.log("Reschedule booking error:", err);
      throw err;
    }
  };
  const rescheduleGuideBooking = async ({ session, date, time }) => {
    try {
      const res = await apiClient.post("/api/v1/happiguide-reschedule-session-user", {
        session_id: session,
        date,
        time,
      });

      return res.data;
    } catch (err) {
      console.log("Reschedule guide booking error:", err);
      throw err;
    }
  };
  const psychologistPayment = async ({
    psyId,
    session,
    date,
    time,
    shouldRecord = false,
    coupon_id = 0,
  }) => {
    try {
      const res = await apiClient.post("/api/v1/avail-haapitalk-user", {
        psychologist_id: psyId,
        session,
        date,
        time,
        user_recording_permission: shouldRecord,
        coupon_id,
      });

      return res.data;
    } catch (err) {
      console.log("Psychologist payment error:", err);
      throw err;
    }
  };
  const happiGUIDEPayment = async (data) => {
    try {
      const res = await apiClient.post("/api/v1/payment-for-happiguide", data);
      return res.data;
    } catch (err) {
      console.log("HappiGUIDE payment error:", err);
      throw err;
    }
  };
  const happiGUIDESession = async () => {
    try {
      const res = await apiClient.post("/api/v1/happiguide-session-user");
      return res.data;
    } catch (err) {
      console.log("HappiGUIDE session error:", err);
      throw err;
    }
  };
  const moodEmojiList = async () => {
    try {
      const res = await apiClient.get("/api/v1/mood-emoji-list");
      return res.data;
    } catch (err) {
      console.log("Mood emoji list error:", err);
      throw err;
    }
  };
  const userMood = async ({ id, name }) => {
    try {
      const res = await apiClient.post("/api/v1/user-mood", {
        emoji_id: id,
        text: name,
      });

      return res.data;
    } catch (err) {
      console.log("User mood error:", err);
      throw err;
    }
  };
  const totalRewardPoints = async () => {
    try {
      const res = await apiClient.get("/api/v1/total-reward-points-user");
      return res.data;
    } catch (err) {
      console.log("Total reward points error:", err);
      throw err;
    }
  };
  const referralCode = async () => {
    try {
      const res = await apiClient.get("/api/v1/my-referral-code");
      return res.data;
    } catch (err) {
      console.log("Referral code error:", err);
      throw err;
    }
  };
  const screenTrafficAnalytics = async ({ screenName }) => {
    try {
      const res = await axios.post(config.ANALYTICS_URL, {
        app_id: config.ANALYTOCS_APP_ID,
        app_token: config.ANALYTOCS_APP_TOKEN,
        screenName,
      });

      return res.data;
    } catch (err) {
      console.log("Screen traffic analytics error:", err);
      throw err;
    }
  };
  const rewardList = async () => {
    try {
      const res = await apiClient.get("/api/v1/reward-instances-list");
      return res.data;
    } catch (err) {
      console.log("Reward list error:", err);
      throw err;
    }
  };
  const offerScreenContent = async () => {
    try {
      const res = await axios.get(`${config.BASE_URL}/api/v1/offer-screen-content`);
      return res.data;
    } catch (err) {
      console.log("Offer screen content error:", err);
      throw err;
    }
  };
  const getUserReport = async ({ user }) => {
    try {
      const res = await apiClient.post("/api/v1/get-user-report-by-psy", {
        user_id: user,
      });

      return res.data;
    } catch (err) {
      console.log("Get user report error:", err);
      throw err;
    }
  };
  const availHappiGuideUser = async ({ planId, date, time, coupon_id = 0 }) => {
    try {
      const res = await apiClient.post("/api/v1/avail-happiguide-user", {
        plan_id: planId,
        date,
        time,
        coupon_id,
      });

      return res.data;
    } catch (err) {
      console.log("Avail HappiGuide user error:", err);
      throw err;
    }
  };
  const saveEmail = async ({ email }) => {
    try {
      const res = await apiClient.post("/api/v1/save-email", { email });
      return res.data;
    } catch (err) {
      console.log("Save email error:", err);
      throw err;
    }
  };
  const getPenaltyClauseUser = async () => {
    try {
      const res = await apiClient.get("/api/v1/get-penalty-clause-user");
      return res.data;
    } catch (err) {
      console.log("Get penalty clause error:", err);
      throw err;
    }
  };
  const onOffStatus = async () => {
    try {
      const res = await apiClient.get("/api/v1/on-off-status");
      return res.data;
    } catch (err) {
      console.log("On-off status error:", err);
      throw err;
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
        currentlyAssignedPsychologist,
        psychologistTalkListing,
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
        psychologistTalkListing,
        myBookingUsers,
        getSlotsOfPsy,
        paymentForHappiTalk,
        cancelBooking,
        creditsListing,
        bookAnotherSession,
        happiGUIDEPayment,
        happiGUIDESession,
        rescheduleBooking,
        psychologistPayment,
        rescheduleGuideBooking,
        moodEmojiList,
        userMood,
        referralCode,
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
        setCategoryId,
      }}
    >
      {props.children}
    </Hcontext.Provider>
  );
};
