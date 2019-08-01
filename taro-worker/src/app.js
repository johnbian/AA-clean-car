import '@tarojs/async-await'
import Taro, { Component } from '@tarojs/taro'
import { Provider } from '@tarojs/redux'

import Index from './pages/index'

import configStore from './store'

import './app.scss'

const store = configStore()

class App extends Component {

  config = {
    pages: [
      'pages/index/index',
      'pages/processing/index',
      'pages/orderList/index',
      'pages/orderDetail/index',
      'pages/promt/index',
      'pages/login/index',
      'pages/bicycling/index'
    ],
    window: {
      backgroundTextStyle: 'dark',
      navigationBarBackgroundColor: '#00B8A5',
      navigationBarTitleText: 'AA洗车工',
      navigationBarTextStyle: '#fff'
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

  componentDidCatchError () {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render () {
    return (
      <Provider store={store}>
        <Index />
      </Provider>
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
