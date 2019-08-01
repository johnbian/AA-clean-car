import { WORKETINFO, USERINFO, OPENID } from '../constants/counter'

export const getUserInfo = (payload: any) => {
  return {
    type: USERINFO,
    payload
  }
}

export const getWorkerInfo = (payload: any) => {
  return {
    type: WORKETINFO,
    payload
  }
}

export const getOpenId = (payload: any) => {
  return {
    type: OPENID,
    payload
  }
}

// 异步的action
export function asyncGetWorkerInfo () {
  return dispatch => {
    setTimeout(() => {
      dispatch(getWorkerInfo())
    }, 2000)
  }
}
