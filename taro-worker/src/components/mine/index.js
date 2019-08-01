import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtAvatar, AtList, AtListItem } from 'taro-ui'

import './index.scss'

export default class Mine extends Component {

  constructor(props) {
    super(props);
  }

  config = {}

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillMount () {
    console.log('我的')
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  goOrderList () {
    Taro.navigateTo({url: '../../pages/orderList/index'})
  }

  render () {
    return (
      <View className='mine'>
        <View className='header'>
          <AtAvatar circle size='large' image={this.props.avatarUrl}></AtAvatar>
          <Text>{this.props.nickName}</Text>
        </View>
        <AtList>
          <AtListItem
            title='历史订单'
            arrow='right'
            onClick={this.goOrderList}
            thumb='https://img12.360buyimg.com/jdphoto/s72x72_jfs/t6160/14/2008729947/2754/7d512a86/595c3aeeNa89ddf71.png'
          />
        </AtList>
      </View>
    )
  }
}
