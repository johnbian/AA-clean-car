import { POSITION, MOBILE, CARINFO, BOOKTIME, 
  SERVICEPROJECT, PRICE, SERVICE, CAPABILITYTYPE,
  STORES, STOREINFO, ADDRESSREMARK  } from "../constants/service";

const INITIAL_STATE = {
  position: {},
  addressRemark: '',
  mobile: '',
  carInfo: {},
  bookTime: '',
  price: '',
  project: [],
  service: {},
  capabilityType: 'H',
  stores: [],
  storeInfo: {},
};

export default function service(state = INITIAL_STATE, action) {
  switch (action.type) {
    case POSITION:
      return {
        ...state,
        position: action.payload
      };
    case MOBILE:
      return {
        ...state,
        mobile: action.payload
      };
    case CARINFO:
      return {
        ...state,
        carInfo: action.payload
      };
    case BOOKTIME:
      return {
        ...state,
        bookTime: action.payload
      };
    case PRICE:
      return {
        ...state,
        price: action.payload
      };
    case SERVICEPROJECT:
      return {
        ...state,
        project: action.payload
      };
    case SERVICE:
      return {
        ...state,
        service: action.payload
      };
    case CAPABILITYTYPE:
      return {
        ...state,
        capabilityType: action.payload
      };
    case STORES:
      return {
        ...state,
        stores: action.payload
      };
    case STOREINFO:
      return {
        ...state,
        storeInfo: action.payload
      };
    case ADDRESSREMARK:
      return {
        ...state,
        addressRemark: action.payload
      };
    default:
      return state;
  }
}
