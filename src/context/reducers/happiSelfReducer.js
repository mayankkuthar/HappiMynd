export const initialSelfState = {
  currentSubCourse: null,
  currentTask: null,
  questionsList: [],
  activeTask: null,
  activeTaskAnswer: "", // Comma Seperated String values (question_id) eg: ' 12,16,22 '
};

export const happiSelfReducer = (state, action) => {
  switch (action.type) {
    case "SET_QUESTIONS":
      return {
        ...state,
        questionsList: action.payload,
      };
    case "RESET_QUESTIONS":
      return {
        ...state,
        questionsList: [],
      };
    case "SET_CURRENT_SUBCOURSE":
      return {
        ...state,
        currentSubCourse: action.payload,
      };
    case "SET_CURRENT_TASK":
      return {
        ...state,
        currentTask: action.payload,
      };
    case "SET_ACTIVE_TASK":
      return {
        ...state,
        activeTask: action.payload,
      };
    case "SET_ACTIVE_TASK_ANSWER":
      return {
        ...state,
        activeTaskAnswer: action.payload,
      };
    default:
      return state;
  }
};
