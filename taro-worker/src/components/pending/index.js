import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import OrderItem from '../orderItem/index'
import NoData from '../noData/index'

import './index.scss'

class Pending extends Component {

  constructor(props) {
    super(props);
  }

  config = {}

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillMount () {
    console.log('代办页面')
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  onDownOrder = (orderId) => {
    console.log(orderId)
    Taro.navigateTo({url: `../../pages/processing/index?orderId=${orderId}`})
  }

  render () {
    return (
      <View>
        {
          this.props.uncompletedlist.length >0 ? this.props.uncompletedlist.map((item, index) => {
            return (
              <OrderItem key={index} item={item} showDetail={false} title='去处理'
                showDown
                onDownOrder={this.onDownOrder.bind(this, item.id)}
              />
            )
          }) : <NoData title='暂无数据' />
        }
      </View>
    )
  }
}

Pending.defaultProps = {
  uncompletedlist: []
}

export default Pending
