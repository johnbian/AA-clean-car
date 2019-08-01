import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtAvatar, AtList, AtListItem } from 'taro-ui'
import { connect } from '@tarojs/redux'
import './index.scss'

class Mine extends Component {

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

  navigateTo (url) {
    Taro.navigateTo({url: `../../pages/${url}/index`})
  }

  render () {
    return (
      <View className='mine'>
        <View className='header'>
          <AtAvatar circle size='large' image={this.props.counter.userInfo.avatarUrl}></AtAvatar>
          <Text>{this.props.counter.userInfo.nickName}</Text>
        </View>
        <AtList>
          <AtListItem
            title='充值/套餐卡'
            arrow='right'
            onClick={this.navigateTo.bind(this, 'cardList')}
            thumb={require('../../assets/images/ic_mine_card.png')}
          />
          <AtListItem
            title='优惠劵'
            arrow='right'
            onClick={this.navigateTo.bind(this, 'reelList')}
            thumb={require('../../assets/images/ic_mine_reel.png')}
          />
          <AtListItem
            title='历史订单'
            arrow='right'
            onClick={this.navigateTo.bind(this, 'orderList')}
            thumb={require('../../assets/images/ic_mine_order.png')}
          />
        </AtList>
      </View>
    )
  }
}
export default connect(({ counter }) => ({
  counter
}))(Mine)