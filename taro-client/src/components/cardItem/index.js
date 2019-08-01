import Taro, { Component } from '@tarojs/taro'
import { View, Text, Navigator } from '@tarojs/components'

import './index.scss'

class CardItem extends Component {

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
    const { item, onGoService } = this.props
    return (
      <View className='card-item'>
        {
          !item.validatedTime? <Navigator
            url={`../../pages/activeDetail/index?name=${item.name}&id=${item.id}&price=${item.price}&description=${item.description}`} 
            className='j-card-item'
          >
            <View className='flex1'>
              <Text style={{color: '#6bbaa7'}}>¥</Text><Text className='j-card-item-top-price'>{item.price}</Text>
            </View>
            <View className='j-card-item-top flex2'>
              <Text className='j-card-item-top-name-name'>{item.name}</Text>
              <Text className='j-card-item-top-name-detail'>{item.description}</Text>
            </View>
            <View className='j-card-item-use'>
              <Text>去购买</Text>
            </View>
          </Navigator>: <View
            className='j-card-item'
          >
            <View className='j-card-item-top flex1'>
              <Text className='j-card-item-top-name-name'>{item.name}</Text>
              <Text className='j-card-item-top-time'>有效期至：{item.validatedTime}</Text>
            </View>
            <View className='j-card-item-use' onClick={onGoService}>
              <Text>立即使用</Text>
            </View>
          </View>
        }
      </View>
    )
  }
}
CardItem.defaultProps = {
  item: {},
  onGoService: ()=> {}
}

export default CardItem
