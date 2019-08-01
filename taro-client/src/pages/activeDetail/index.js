import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtCard } from 'taro-ui'
import { pay } from '../../assets/utils/request'

import './index.scss'

class ActiveDetail extends Component {

  constructor(props) {
    super(props);
    this.state = {
      orderDetail: {}
    }
  }

  config = {}

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillMount () { }

  componentDidMount () {
    this.setState({
      orderDetail: this.$router.params
    })
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  pay () {
    console.log(this.state.orderDetail)
    pay(`event/purchase/promotion/${this.props.counter.openid}`, this.state.orderDetail)
  }

  render () {
    return (
      <View className='order-detail'>
        <View className='card'>
          <AtCard
            isFull
            title='订单信息'
          >
            <View className='preview'>
              <Text>付款金额:</Text>
              <Text>{this.state.orderDetail.price}</Text>
            </View>
            <View className='preview'>
              <Text>订单信息:</Text>
              <Text>{this.state.orderDetail.name}</Text>
            </View>
            <View className='preview'>
              <Text>订单详情:</Text>
              <Text>{this.state.orderDetail.description}</Text>
            </View>
            <Button onClick={this.pay}>立即支付</Button>
          </AtCard>
        </View>
      </View>
    )
  }
}
export default connect(({ counter }) => ({
  counter
}))(ActiveDetail)
