// USER TYPES
// individual
// organisation

export const initialAuthState = {
  isLogged: false,
  isGuest: true,
  selectedLanguage: null,
  user: null,
  isOnBoarded: false,
  feedbackSubmitted: false,
  isScreeningComplete: false,
  userType: "",
};

export const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        isLogged: true,
        isGuest: false,
        user: action.payload,
      };
    case "SIGNUP":
      return {
        ...state,
        isLogged: false,
        isGuest: false,
        user: action.payload,
      };
    case "FEEDBACK":
      return { ...state, feedbackSubmitted: action.payload };
    case "LANGUAGE_SELECTION":
      return { ...state, selectedLanguage: action.payload };
    case "ON_BOARDING_PROCESS":
      return { ...state, isOnBoarded: true };
    case "USER_UPDATE":
      return {
        ...state,
        user: action.payload
          ? {
              ...state.user,
              user: { ...state?.user?.user, ...action?.payload },
            }
          : { ...state.user },
        userType: action.userType,
      };
    case "COMPLETE_SCREENING":
      return {
        ...state,
        isScreeningComplete: action.payload,
      };
    case "LOGOUT":
      return {
        ...state,
        isLogged: false,
        isGuest: true,
        user: null,
        feedbackSubmitted: false,
      };
    default:
      return state;
  }
};
