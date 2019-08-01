import Taro, { Component } from '@tarojs/taro'
import { View, Text, Navigator } from '@tarojs/components'

import './index.scss'

class OrderItem extends Component {

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
      <View className='card-item'>
        <View className='preview'>
          <Text>订单编号：</Text>
          <Text>{item.orderNumber}</Text>
        </View>
        <View className='preview'>
          <Text>订单状态：</Text>
          <Text>{item.status}</Text>
        </View>
        <View className='preview'>
          <Text>服务内容：</Text>
          <Text>{item.serviceName}</Text>
        </View>
        <View className='preview'>
          <Text>预约时间：</Text>
          <Text>{item.bookTime}</Text>
        </View>
        <Navigator 
          url={`../../pages/orderDetail/index?orderId=${item.id}`}
          className='nav'
        >
          查看详情
        </Navigator>
      </View>
    )
  }
}

OrderItem.defaultProps = {
  item: {}
}

export default OrderItem
