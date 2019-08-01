import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'

import './index.scss'

class ReelItem extends Component {

  constructor(props) {
    super(props);
  }

  config = {}

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillMount () {}

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    const { item } = this.props
    return (
      <View className='j-reel-item'>
        <View class='j-reel-item-left'>
          <Text class='j-reel-item-left-name'>{item.name}</Text>
          <Text class='j-reel-item-left-name-detail'>{item.validatedTime}</Text>
        </View>
        <View class='j-reel-item-right'>
          <Text class='j-reel-item-right-price'>{item.price}</Text>
        </View>
      </View>
    )
  }
}

ReelItem.defaultProps = {
  item: {}
}

export default ReelItem
