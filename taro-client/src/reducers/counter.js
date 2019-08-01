import { USERINFO, OPENID, CARTYPE } from "../constants/counter";

const INITIAL_STATE = {
  userInfo: {},
  openid: "",
  carType: {
    vehicleCategories: [],
    vehicleTypes: []
  },
};

export default function counter(state = INITIAL_STATE, action) {
  switch (action.type) {
    case USERINFO:
      return {
        ...state,
        userInfo: action.payload
      };
    case OPENID:
      return {
        ...state,
        openid: action.payload
      };
    case CARTYPE:
      return {
        ...state,
        carType: action.payload
      };
    default:
      return state;
  }
}
