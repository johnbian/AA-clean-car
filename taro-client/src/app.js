import Taro, { Component } from '@tarojs/taro'
import '@tarojs/async-await'
import { Provider } from '@tarojs/redux'

import Index from './pages/index'

import configStore from './store'

import './app.scss'

const store = configStore()

class App extends Component {

  config = {
    pages: [
      'pages/index/index',
      'pages/login/index',
      'pages/mine/index',
      'pages/activeList/index',
      'pages/activeDetail/index',
      'pages/orderDetail/index',
      'pages/orderList/index',
      'pages/cardList/index',
      'pages/reelList/index',
      'pages/carInfo/index',
      'pages/services/index',
      'pages/serviceDetail/index',
      'pages/pay/index',
      'pages/stores/index'
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#00BDE2',
      navigationBarTitleText: 'AA上门洗车',
      navigationBarTextStyle: '#fff',
    },
    tabBar: {
      list: [{
        iconPath: './assets/images/ic_home_normal.png',
        pagePath: 'pages/index/index',
        selectedIconPath: './assets/images/ic_home_select.png',
        text: '首页'
      }, {
        iconPath: './assets/images/ic_activity_normal.png',
        pagePath: 'pages/activeList/index',
        selectedIconPath: './assets/images/ic_activity_select.png',
        text: '活动'
      }, {
        iconPath: './assets/images/ic_mine_normal.png',
        selectedIconPath: './assets/images/ic_mine_select.png',
        pagePath: 'pages/mine/index',
        text: '我的'
      }],
      color: '#979797',
      selectedColor: '#58C9D0'
    },
    "permission": {
      "scope.userLocation": {
        "desc": "你的位置信息将用于获取你的位置方便提供上门洗车服务"
      }
    }
  }

  componentDidMount () {}

  componentDidShow () {}

  componentDidHide () {}

  componentCatchError () {}

  render () {
    return (
      <Provider store={store}>
        <Index />
      </Provider>
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
