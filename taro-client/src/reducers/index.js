import { combineReducers } from 'redux'
import counter from './counter'
import service from './service'

export default combineReducers({
  counter,
  service
})
