import { POSITION, MOBILE, CARINFO, BOOKTIME, SERVICEPROJECT, 
  PRICE, SERVICE, CAPABILITYTYPE, STORES, STOREINFO, ADDRESSREMARK } from '../constants/service'

export const getPosition = (payload: any) => {
  return {
    type: POSITION,
    payload
  }
}

export const getMobile = (payload: any) => {
  return {
    type: MOBILE,
    payload
  }
}

export const getCarInfo = (payload: any) => {
  return {
    type: CARINFO,
    payload
  }
}

export const getBookTime = (payload: any) => {
  return {
    type: BOOKTIME,
    payload
  }
}

export const getPrice = (payload: any) => {
  return {
    type: PRICE,
    payload
  }
}

export const getServiceProject = (payload: any) => {
  return {
    type: SERVICEPROJECT,
    payload
  }
}

export const getService = (payload: any) => {
  return {
    type: SERVICE,
    payload
  }
}

export const getCapabilityType = (payload: any) => {
  return {
    type: CAPABILITYTYPE,
    payload
  }
}

export const getStores = (payload: any) => {
  return {
    type: STORES,
    payload
  }
}

export const getStoreId = (payload: any) => {
  return {
    type: STOREINFO,
    payload
  }
}

export const getAddressRemark= (payload: any) => {
  return {
    type: ADDRESSREMARK,
    payload
  }
}