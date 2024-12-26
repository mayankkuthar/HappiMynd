export const initialSnackState = {
  visible: false,
  message: "",
};

export const snackReducer = (state, action) => {
  switch (action.type) {
    case "SHOW_SNACK":
      return { ...state, visible: true, message: action.payload };
    case "HIDE_SNACK":
      return { ...state, visible: false, message: "" };
    default:
      return state;
  }
};
