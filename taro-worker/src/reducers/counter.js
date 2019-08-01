import { WORKETINFO, USERINFO, OPENID } from "../constants/counter";

const INITIAL_STATE = {
  userInfo: {},
  workerInfo: {},
  openid: ""
};

export default function counter(state = INITIAL_STATE, action) {
  switch (action.type) {
    case USERINFO:
      return {
        ...state,
        userInfo: action.payload
      };
    case WORKETINFO:
      return {
        ...state,
        workerInfo: action.payload
      };
    case OPENID:
      return {
        ...state,
        openid: action.payload
      };
    default:
      return state;
  }
}
