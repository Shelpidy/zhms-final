import { CURRENTUSER, CUSTOMTHEMECOLORS, MODE } from "./actions";

const initialState = {
  customThemeColors: {
    primaryColor: "#0f0b80",
    secondaryColor: "#1f1b80",
  },
  mode: "light",
  currentUser: {
    userId: "ad9cf610-1703-4000-874c-dfb7be0e67dc",
    profilePicture: "https://picsum.photos/200/300",
    displayName: "Michael Johnson",
  },
};

export function mainReducer(state = initialState, action: Action) {
  switch (action.type) {
    case CUSTOMTHEMECOLORS:
      return {
        ...state,
        customThemeColors: action.payload,
      };
    case MODE:
      return {
        ...state,
        mode: action.payload,
      };
    case CURRENTUSER:
      return {
        ...state,
        currentUser: action.payload,
      };
    default:
      return state;
  }
}
