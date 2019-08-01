import { USERINFO, OPENID, CARTYPE } from '../constants/counter'

export const getUserInfo = (payload: any) => {
  return {
    type: USERINFO,
    payload
  }
}

export const getOpenId = (payload: any) => {
  return {
    type: OPENID,
    payload
  }
}

export const getCarType = (payload: any) => {
  return {
    type: CARTYPE,
    payload
  }
}

// 异步的action
export function asyncGetUserInfo () {
  return dispatch => {
    setTimeout(() => {
      dispatch(getUserInfo())
    }, 2000)
  }
}
