export const initialLabelState = {
  header: 0,
  footer: 0,
  logo: "",
};

export const whiteLabelReducer = (state, action) => {
  switch (action.type) {
    case "SET_WHITE_LABEL":
      return {
        ...state,
        header: action.payload.header,
        footer: action.payload.footer,
        logo: action.payload.logo,
      };
    case "RESET_WHITE_LABEL":
      return { ...state };
    default:
      return state;
  }
};
