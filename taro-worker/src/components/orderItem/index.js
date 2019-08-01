import Taro, { Component } from '@tarojs/taro'
import { View, Text, Navigator, Picker } from '@tarojs/components'

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
    const { item, onDownOrder, showDetail, showDown, title, onReceipt, receiptArray } = this.props
    return (
      <View className='card-item'>
        <View className='preview'>
          <Text>订单编号：</Text>
          <Text>{item.orderNumber}</Text>
        </View>
        <View className='preview'>
          <Text>订单状态：</Text>
          <Text>{item.statusName}</Text>
        </View>
        <View className='preview'>
          <Text>服务内容：</Text>
          <Text>{item.serviceName}</Text>
        </View>
        <View className='preview'>
          <Text>预约时间：</Text>
          <Text>{item.bookTime}</Text>
        </View>
        {
          showDetail && <Navigator 
            url={`../../pages/orderDetail/index?orderId=${item.id}`}
            className='nav'
          >
            查看详情
          </Navigator>
        }
        {
          showDown && <View className='nav' onClick={onDownOrder}>
            <Text>{title}</Text>
          </View>
        }
        {
          item.status === 32 || item.status === 20 && <Picker
            onChange={onReceipt} range={receiptArray} rangeKey='content'
          >
            <View className='nav'><Text>{title}</Text></View>
          </Picker>
        }
      </View>
    )
  }
}

OrderItem.defaultProps = {
  item: {},
  onDownOrder: ()=> {},
  onReceipt: ()=> {},
  showDetail: true,
  showDown: false,
  receiptArray: [],
  title: '抢单'
}

export default OrderItem
